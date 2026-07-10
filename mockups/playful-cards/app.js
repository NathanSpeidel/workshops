document.addEventListener("DOMContentLoaded", function () {
  var dateEl = document.getElementById("topbar-date");
  if (dateEl) dateEl.textContent = WS.formatDateLong(WS.TODAY);

  var resetBtn = document.getElementById("reset-demo");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      WS.resetDemoData();
      window.location.reload();
    });
  }

  var page = document.body.dataset.page;
  if (page === "home") initHome();
  else if (page === "upcoming") initUpcoming();
  else if (page === "new-workshop") initNewWorkshop();
  else if (page === "workshop") initWorkshopDetail();
  else if (page === "my-workshops") initMyWorkshops();
});

function statusPill(status) {
  return '<span class="pill status-' + WS.statusSlug(status) + '">' + WS.escapeHtml(status) + "</span>";
}

function employeeBadges(ids) {
  return WS.employeeNames(ids)
    .map(function (n) {
      return '<span class="employee-badge">' + WS.escapeHtml(n) + "</span>";
    })
    .join("");
}

function dateBadge(iso) {
  var d = new Date(iso.split("-").map(Number)[0], iso.split("-").map(Number)[1] - 1, iso.split("-").map(Number)[2]);
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return months[d.getMonth()] + " " + d.getDate();
}

function renderCardGrid(list) {
  return (
    '<div class="card-grid">' +
    list
      .map(function (w) {
        return (
          '<div class="workshop-card" data-id="' +
          w.id +
          '"><div class="wc-date-badge">' +
          dateBadge(w.date) +
          '</div><div class="wc-service">' +
          WS.escapeHtml(w.service) +
          '</div><div class="wc-meta">' +
          WS.escapeHtml(w.school) +
          " &middot; " +
          WS.formatTime(w.time) +
          '</div><div class="wc-footer"><div class="wc-employees">' +
          employeeBadges(w.employeeIds) +
          "</div>" +
          statusPill(w.status) +
          "</div></div>"
        );
      })
      .join("") +
    "</div>"
  );
}

function attachCardLinks(container) {
  container.querySelectorAll("[data-id]").forEach(function (el) {
    el.addEventListener("click", function () {
      window.location.href = "workshop.html?id=" + el.dataset.id;
    });
  });
}

// ---------------------------------------------------------------- Home ----

function initHome() {
  var workshops = WS.getWorkshops();
  var upcoming = WS.upcoming(workshops);
  var inProgress = workshops.filter(function (w) {
    return w.status === "In Progress";
  });
  var awaitingFeedback = workshops.filter(function (w) {
    return w.status === "Awaiting Feedback";
  });
  var needsFollowUp = workshops.filter(WS.needsFollowUp);

  document.getElementById("stat-grid").innerHTML =
    statTile(upcoming.length, "Upcoming") +
    statTile(inProgress.length, "In Progress") +
    statTile(awaitingFeedback.length, "Awaiting Feedback") +
    statTile(needsFollowUp.length, "Needs Follow-up");

  var followUpEl = document.getElementById("followup-list");
  followUpEl.innerHTML = needsFollowUp.length === 0 ? '<p class="empty-note">Nothing needs follow-up right now &#127881;</p>' : renderCardGrid(needsFollowUp);
  attachCardLinks(followUpEl);

  var nextUpEl = document.getElementById("next-up-list");
  var nextUp = upcoming.slice(0, 6);
  nextUpEl.innerHTML = nextUp.length === 0 ? '<p class="empty-note">No upcoming workshops scheduled.</p>' : renderCardGrid(nextUp);
  attachCardLinks(nextUpEl);
}

function statTile(num, label) {
  return '<div class="stat-tile"><div class="num">' + num + '</div><div class="label">' + label + "</div></div>";
}

// ----------------------------------------------------------- Upcoming ----

function initUpcoming() {
  var state = { view: "list", year: 2026, month: 6 };

  var listBtn = document.getElementById("toggle-list");
  var calBtn = document.getElementById("toggle-calendar");
  var listView = document.getElementById("list-view");
  var calView = document.getElementById("calendar-view");

  function render() {
    listBtn.classList.toggle("active", state.view === "list");
    calBtn.classList.toggle("active", state.view === "calendar");
    listView.style.display = state.view === "list" ? "" : "none";
    calView.style.display = state.view === "calendar" ? "" : "none";
    if (state.view === "list") renderListView();
    else renderCalendarView();
  }

  function renderListView() {
    var upcoming = WS.upcoming(WS.getWorkshops());
    listView.innerHTML = upcoming.length === 0 ? '<p class="empty-note">No upcoming workshops.</p>' : renderCardGrid(upcoming);
    attachCardLinks(listView);
  }

  function renderCalendarView() {
    var grid = WS.buildMonthGrid(state.year, state.month, WS.getWorkshops());
    var weekdayHeaders = WS.WEEKDAYS_SHORT.map(function (d) {
      return '<div class="cal-weekday">' + d + "</div>";
    }).join("");

    var cells = grid.weeks
      .map(function (week) {
        return week
          .map(function (cell) {
            var classes = "cal-cell" + (cell.inMonth ? "" : " out-month") + (cell.isToday ? " today" : "");
            var events = cell.workshops
              .map(function (w) {
                return '<div class="cal-event" data-id="' + w.id + '">' + WS.escapeHtml(w.service) + "</div>";
              })
              .join("");
            return (
              '<div class="' +
              classes +
              '"><span class="cal-daynum">' +
              cell.day +
              '</span><div class="cal-dot-row">' +
              events +
              "</div></div>"
            );
          })
          .join("");
      })
      .join("");

    calView.innerHTML =
      '<div class="cal-card"><div class="cal-header"><h3>' +
      grid.label +
      '</h3><div class="cal-nav"><button id="cal-prev">&larr;</button> <button id="cal-next">&rarr;</button></div></div>' +
      '<div class="cal-grid">' +
      weekdayHeaders +
      cells +
      "</div></div>";

    document.getElementById("cal-prev").addEventListener("click", function () {
      var prev = WS.addMonths(state.year, state.month, -1);
      state.year = prev.year;
      state.month = prev.month;
      renderCalendarView();
    });
    document.getElementById("cal-next").addEventListener("click", function () {
      var next = WS.addMonths(state.year, state.month, 1);
      state.year = next.year;
      state.month = next.month;
      renderCalendarView();
    });
    calView.querySelectorAll(".cal-event").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.href = "workshop.html?id=" + el.dataset.id;
      });
    });
  }

  listBtn.addEventListener("click", function () {
    state.view = "list";
    render();
  });
  calBtn.addEventListener("click", function () {
    state.view = "calendar";
    render();
  });

  render();
}

// -------------------------------------------------------- New Workshop ----

function initNewWorkshop() {
  var schoolSelect = document.getElementById("field-school");
  var locationInput = document.getElementById("field-location");

  Object.keys(WS.SCHOOLS).forEach(function (school) {
    var opt = document.createElement("option");
    opt.value = school;
    opt.textContent = school;
    schoolSelect.appendChild(opt);
  });

  schoolSelect.addEventListener("change", function () {
    locationInput.value = WS.SCHOOLS[schoolSelect.value] || "";
  });
  schoolSelect.dispatchEvent(new Event("change"));

  var serviceSelect = document.getElementById("field-service");
  WS.SERVICES.forEach(function (s) {
    var opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    serviceSelect.appendChild(opt);
  });

  var employeeList = document.getElementById("employee-checkboxes");
  WS.EMPLOYEES.forEach(function (emp) {
    var wrap = document.createElement("label");
    wrap.className = "checkbox-item";
    wrap.innerHTML = '<input type="checkbox" value="' + emp.id + '"> ' + WS.escapeHtml(emp.name);
    employeeList.appendChild(wrap);
  });

  var form = document.getElementById("new-workshop-form");
  var banner = document.getElementById("success-banner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var employeeIds = Array.from(employeeList.querySelectorAll("input:checked")).map(function (el) {
      return el.value;
    });

    var workshop = {
      id: WS.newWorkshopId(),
      service: serviceSelect.value,
      school: schoolSelect.value,
      location: locationInput.value,
      date: document.getElementById("field-date").value,
      time: document.getElementById("field-time").value,
      classroom: document.getElementById("field-classroom").value,
      employeeIds: employeeIds,
      status: "Scheduled",
      studentsCount: null,
    };

    WS.addWorkshop(workshop);

    banner.style.display = "block";
    banner.innerHTML = '&#127881; Workshop created! <a href="workshop.html?id=' + workshop.id + '">View it</a> or <a href="upcoming.html">see all upcoming workshops</a>.';
    form.reset();
    locationInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ----------------------------------------------------- Workshop Detail ----

function initWorkshopDetail() {
  var id = WS.getQueryParam("id");
  var container = document.getElementById("workshop-detail");
  var workshop = id ? WS.getWorkshopById(id) : null;

  if (!workshop) {
    container.innerHTML = '<p class="empty-note">Workshop not found. <a href="upcoming.html">Back to upcoming workshops</a>.</p>';
    return;
  }

  renderDetail();

  function renderDetail() {
    document.getElementById("detail-title").textContent = workshop.service;
    container.innerHTML =
      '<div class="detail-card"><div class="detail-grid">' +
      detailRow("School", WS.escapeHtml(workshop.school)) +
      detailRow("Location", WS.escapeHtml(workshop.location)) +
      detailRow("Date", WS.formatDateLong(workshop.date)) +
      detailRow("Time", WS.formatTime(workshop.time)) +
      detailRow("Classroom", WS.escapeHtml(workshop.classroom)) +
      detailRow("Status", statusPill(workshop.status)) +
      '</div><div class="detail-row"><div class="k">Facilitators</div><div class="badge-row">' +
      employeeBadges(workshop.employeeIds) +
      "</div></div></div>" +
      resultsSection();

    if (document.getElementById("results-form")) {
      document.getElementById("results-form").addEventListener("submit", handleResultsSubmit);
    }
  }

  function detailRow(label, value) {
    return '<div class="detail-row"><div class="k">' + label + '</div><div class="v">' + value + "</div></div>";
  }

  function resultsSection() {
    if (workshop.studentsCount != null) {
      return (
        '<div class="detail-card"><div class="form-step-label"><span class="form-step-num">&#10003;</span> Results</div><div class="detail-grid">' +
        detailRow("Number of students", workshop.studentsCount) +
        detailRow("Status", statusPill(workshop.status)) +
        "</div></div>"
      );
    }

    return (
      '<div class="form-card"><div class="form-step-label"><span class="form-step-num">!</span> Log Post-Workshop Data</div><form id="results-form">' +
      '<div class="form-grid">' +
      '<div class="form-field"><label for="result-students">Number of students</label><input id="result-students" type="number" min="0" required></div>' +
      '<div class="form-field"><label for="result-status">Status</label><select id="result-status" required>' +
      ["In Progress", "Awaiting Feedback", "Terminated"]
        .map(function (s) {
          return '<option value="' + s + '"' + (s === "Awaiting Feedback" ? " selected" : "") + ">" + s + "</option>";
        })
        .join("") +
      "</select></div>" +
      '</div><button type="submit" class="btn">Save results</button>' +
      "</form></div>"
    );
  }

  function handleResultsSubmit(e) {
    e.preventDefault();
    var students = document.getElementById("result-students").value;
    var status = document.getElementById("result-status").value;
    workshop = WS.updateWorkshop(workshop.id, { studentsCount: Number(students), status: status });
    renderDetail();
  }
}

// ------------------------------------------------------- My Workshops ----

function initMyWorkshops() {
  var select = document.getElementById("employee-filter");
  WS.EMPLOYEES.forEach(function (emp) {
    var opt = document.createElement("option");
    opt.value = emp.id;
    opt.textContent = emp.name + " — " + emp.role;
    select.appendChild(opt);
  });

  var listEl = document.getElementById("my-workshops-list");

  function render() {
    var all = WS.sortByDate(WS.getWorkshops(), "desc");
    var mine = WS.filterByEmployee(all, select.value);
    listEl.innerHTML = mine.length === 0 ? '<p class="empty-note">No workshops for this employee.</p>' : renderCardGrid(mine);
    attachCardLinks(listEl);
  }

  select.addEventListener("change", render);
  select.value = "e1";
  render();
}
