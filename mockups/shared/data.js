// Shared mock data for all mockup variants. Classic script (no ES modules) so
// it works over file:// without CORS issues when double-clicked in a browser.
window.WS = window.WS || {};

// "Today" is pinned for the mockups so the demo data (needs-follow-up list,
// calendar highlighting, In Progress rows) always makes sense.
WS.TODAY = "2026-07-10";

WS.EMPLOYEES = [
  { id: "e1", name: "Maria Chen", role: "Lead Facilitator" },
  { id: "e2", name: "Devon Brooks", role: "Facilitator" },
  { id: "e3", name: "Priya Nair", role: "Facilitator" },
  { id: "e4", name: "Sam Okafor", role: "Lead Facilitator" },
  { id: "e5", name: "Jordan Blake", role: "Facilitator" },
  { id: "e6", name: "Aisha Patel", role: "Program Coordinator" },
];

WS.SCHOOLS = {
  "Lincoln Elementary": "412 Oak St, Springfield",
  "Washington Middle School": "88 Elm Ave, Springfield",
  "Jefferson Elementary": "215 Birch Rd, Springfield",
  "Roosevelt Elementary": "900 Maple Dr, Springfield",
  "Franklin Middle School": "33 Cedar Ln, Springfield",
};

WS.SERVICES = [
  "Intro to Robotics",
  "Creative Coding",
  "Watercolor Workshop",
  "Public Speaking Basics",
  "STEM Discovery Day",
];

WS.STATUSES = ["Scheduled", "In Progress", "Awaiting Feedback", "Terminated"];

WS.WORKSHOPS = [
  { id: "w001", service: "Intro to Robotics", school: "Lincoln Elementary", location: WS.SCHOOLS["Lincoln Elementary"], date: "2026-06-01", time: "09:00", classroom: "Room 12B", employeeIds: ["e1", "e3"], status: "Awaiting Feedback", studentsCount: 24 },
  { id: "w002", service: "Creative Coding", school: "Washington Middle School", location: WS.SCHOOLS["Washington Middle School"], date: "2026-06-03", time: "13:00", classroom: "Media Center", employeeIds: ["e2"], status: "Awaiting Feedback", studentsCount: 18 },
  { id: "w003", service: "Watercolor Workshop", school: "Jefferson Elementary", location: WS.SCHOOLS["Jefferson Elementary"], date: "2026-06-05", time: "10:00", classroom: "Art Room", employeeIds: ["e5"], status: "Terminated", studentsCount: null },
  { id: "w004", service: "Intro to Robotics", school: "Roosevelt Elementary", location: WS.SCHOOLS["Roosevelt Elementary"], date: "2026-06-10", time: "09:30", classroom: "Room 4", employeeIds: ["e1"], status: "Awaiting Feedback", studentsCount: 22 },
  { id: "w005", service: "Public Speaking Basics", school: "Lincoln Elementary", location: WS.SCHOOLS["Lincoln Elementary"], date: "2026-06-12", time: "13:30", classroom: "Library", employeeIds: ["e4", "e6"], status: "Awaiting Feedback", studentsCount: 15 },
  { id: "w006", service: "Creative Coding", school: "Franklin Middle School", location: WS.SCHOOLS["Franklin Middle School"], date: "2026-06-22", time: "09:00", classroom: "Room 7A", employeeIds: ["e2"], status: "Scheduled", studentsCount: null },
  { id: "w007", service: "STEM Discovery Day", school: "Washington Middle School", location: WS.SCHOOLS["Washington Middle School"], date: "2026-06-29", time: "10:00", classroom: "Gymnasium", employeeIds: ["e3", "e5"], status: "In Progress", studentsCount: null },
  { id: "w008", service: "Intro to Robotics", school: "Jefferson Elementary", location: WS.SCHOOLS["Jefferson Elementary"], date: "2026-07-09", time: "09:00", classroom: "Room 101", employeeIds: ["e1"], status: "Awaiting Feedback", studentsCount: 20 },
  { id: "w009", service: "Public Speaking Basics", school: "Roosevelt Elementary", location: WS.SCHOOLS["Roosevelt Elementary"], date: "2026-07-10", time: "09:00", classroom: "Library", employeeIds: ["e4"], status: "In Progress", studentsCount: null },
  { id: "w010", service: "Creative Coding", school: "Lincoln Elementary", location: WS.SCHOOLS["Lincoln Elementary"], date: "2026-07-10", time: "13:00", classroom: "Media Center", employeeIds: ["e2", "e3"], status: "In Progress", studentsCount: null },
  { id: "w011", service: "Watercolor Workshop", school: "Franklin Middle School", location: WS.SCHOOLS["Franklin Middle School"], date: "2026-07-14", time: "09:30", classroom: "Art Room", employeeIds: ["e5"], status: "Scheduled", studentsCount: null },
  { id: "w012", service: "Intro to Robotics", school: "Washington Middle School", location: WS.SCHOOLS["Washington Middle School"], date: "2026-07-14", time: "13:00", classroom: "Room 4", employeeIds: ["e1", "e6"], status: "Scheduled", studentsCount: null },
  { id: "w013", service: "STEM Discovery Day", school: "Lincoln Elementary", location: WS.SCHOOLS["Lincoln Elementary"], date: "2026-07-16", time: "10:00", classroom: "Gymnasium", employeeIds: ["e3", "e4", "e5"], status: "Scheduled", studentsCount: null },
  { id: "w014", service: "Creative Coding", school: "Roosevelt Elementary", location: WS.SCHOOLS["Roosevelt Elementary"], date: "2026-07-21", time: "09:00", classroom: "Room 7A", employeeIds: ["e2"], status: "Scheduled", studentsCount: null },
  { id: "w015", service: "Public Speaking Basics", school: "Jefferson Elementary", location: WS.SCHOOLS["Jefferson Elementary"], date: "2026-07-23", time: "13:30", classroom: "Library", employeeIds: ["e6"], status: "Scheduled", studentsCount: null },
  { id: "w016", service: "Intro to Robotics", school: "Franklin Middle School", location: WS.SCHOOLS["Franklin Middle School"], date: "2026-07-28", time: "09:00", classroom: "Room 12B", employeeIds: ["e1"], status: "Scheduled", studentsCount: null },
  { id: "w017", service: "STEM Discovery Day", school: "Washington Middle School", location: WS.SCHOOLS["Washington Middle School"], date: "2026-08-04", time: "10:00", classroom: "Gymnasium", employeeIds: ["e3", "e5"], status: "Scheduled", studentsCount: null },
  { id: "w018", service: "Watercolor Workshop", school: "Lincoln Elementary", location: WS.SCHOOLS["Lincoln Elementary"], date: "2026-08-11", time: "09:30", classroom: "Art Room", employeeIds: ["e5"], status: "Terminated", studentsCount: null },
];
