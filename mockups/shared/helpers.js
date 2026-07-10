// Shared pure logic used by all 3 mockup variants: date/time formatting,
// calendar-grid math, filtering/sorting, and a tiny sessionStorage-backed
// "database" so submitted forms feel alive across page navigations without
// a real backend (and without ever touching the WS.WORKSHOPS baseline).
(function () {
  var STORAGE_KEY = "ws_workshops_session";

  function parseISODate(iso) {
    var parts = iso.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toISODate(year, month, day) {
    return year + "-" + pad2(month + 1) + "-" + pad2(day);
  }

  // ---- session-backed workshop list -----------------------------------

  WS.getWorkshops = function () {
    var raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fall through to baseline if storage is corrupted
      }
    }
    return WS.WORKSHOPS.map(function (w) {
      return Object.assign({}, w);
    });
  };

  WS.saveWorkshops = function (list) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  WS.addWorkshop = function (workshop) {
    var list = WS.getWorkshops();
    list.push(workshop);
    WS.saveWorkshops(list);
  };

  WS.updateWorkshop = function (id, patch) {
    var list = WS.getWorkshops();
    var idx = list.findIndex(function (w) {
      return w.id === id;
    });
    if (idx !== -1) {
      list[idx] = Object.assign({}, list[idx], patch);
      WS.saveWorkshops(list);
    }
    return idx !== -1 ? list[idx] : null;
  };

  WS.resetDemoData = function () {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  WS.newWorkshopId = function () {
    return "w" + Date.now().toString(36);
  };

  // ---- lookups -----------------------------------------------------

  WS.getEmployeeById = function (id) {
    return WS.EMPLOYEES.find(function (e) {
      return e.id === id;
    });
  };

  WS.employeeNames = function (ids) {
    return ids
      .map(function (id) {
        var e = WS.getEmployeeById(id);
        return e ? e.name : id;
      });
  };

  WS.getWorkshopById = function (id) {
    return WS.getWorkshops().find(function (w) {
      return w.id === id;
    });
  };

  // ---- formatting -----------------------------------------------------

  var WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  WS.formatDate = function (iso) {
    var d = parseISODate(iso);
    return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear();
  };

  WS.formatDateLong = function (iso) {
    var d = parseISODate(iso);
    return WEEKDAYS_LONG[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  };

  WS.formatTime = function (time) {
    var parts = time.split(":").map(Number);
    var hours = parts[0];
    var minutes = parts[1];
    var period = hours >= 12 ? "PM" : "AM";
    var h12 = hours % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + pad2(minutes) + " " + period;
  };

  WS.statusSlug = function (status) {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  // ---- date comparisons -----------------------------------------------

  WS.isPast = function (iso) {
    return iso < WS.TODAY;
  };

  WS.isToday = function (iso) {
    return iso === WS.TODAY;
  };

  WS.needsFollowUp = function (w) {
    return WS.isPast(w.date) && (w.status === "Scheduled" || w.status === "In Progress");
  };

  // ---- sorting / filtering ---------------------------------------------

  WS.sortByDate = function (list, dir) {
    var mult = dir === "desc" ? -1 : 1;
    return list.slice().sort(function (a, b) {
      var aKey = a.date + " " + a.time;
      var bKey = b.date + " " + b.time;
      return aKey < bKey ? -1 * mult : aKey > bKey ? 1 * mult : 0;
    });
  };

  WS.upcoming = function (list) {
    return WS.sortByDate(
      list.filter(function (w) {
        return w.date >= WS.TODAY;
      }),
      "asc"
    );
  };

  WS.filterByEmployee = function (list, employeeId) {
    if (!employeeId || employeeId === "all") return list;
    return list.filter(function (w) {
      return w.employeeIds.indexOf(employeeId) !== -1;
    });
  };

  // ---- calendar grid ----------------------------------------------------

  WS.monthLabel = function (year, month) {
    return MONTHS[month] + " " + year;
  };

  WS.addMonths = function (year, month, delta) {
    var total = year * 12 + month + delta;
    return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
  };

  // Returns { year, month, label, weeks } where weeks is an array of 7-day
  // rows; each cell is { date (ISO), day, inMonth, isToday, workshops }.
  WS.buildMonthGrid = function (year, month, workshops) {
    var firstOfMonth = new Date(year, month, 1);
    var startWeekday = firstOfMonth.getDay(); // 0 = Sunday
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrevMonth = new Date(year, month, 0).getDate();

    var cells = [];

    // leading days from previous month
    for (var i = startWeekday - 1; i >= 0; i--) {
      var prevDay = daysInPrevMonth - i;
      var prev = WS.addMonths(year, month, -1);
      cells.push(makeCell(toISODate(prev.year, prev.month, prevDay), prevDay, false));
    }

    // days in this month
    for (var d = 1; d <= daysInMonth; d++) {
      cells.push(makeCell(toISODate(year, month, d), d, true));
    }

    // trailing days to complete the final week
    var next = WS.addMonths(year, month, 1);
    var trailing = 1;
    while (cells.length % 7 !== 0) {
      cells.push(makeCell(toISODate(next.year, next.month, trailing), trailing, false));
      trailing++;
    }

    function makeCell(iso, day, inMonth) {
      return {
        date: iso,
        day: day,
        inMonth: inMonth,
        isToday: iso === WS.TODAY,
        workshops: workshops
          .filter(function (w) {
            return w.date === iso;
          })
          .sort(function (a, b) {
            return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
          }),
      };
    }

    var weeks = [];
    for (var w = 0; w < cells.length; w += 7) {
      weeks.push(cells.slice(w, w + 7));
    }

    return { year: year, month: month, label: WS.monthLabel(year, month), weeks: weeks };
  };

  WS.WEEKDAYS_SHORT = WEEKDAYS_SHORT;

  // ---- misc --------------------------------------------------------------

  WS.getQueryParam = function (name) {
    return new URLSearchParams(window.location.search).get(name);
  };

  // Forms let a reviewer type arbitrary text (school name, service, etc.)
  // which we then render back via innerHTML — escape it so a stray "<" in
  // a form field can't be interpreted as markup.
  WS.escapeHtml = function (str) {
    var div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  };
})();
