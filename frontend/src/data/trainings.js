// Default training calendar. The live schedule is managed in the admin panel (/admin);
// these rows are only shown when the API is unreachable or no rows have been added there.
// Titles also populate field 1 ("Training applied for") of the application form;
// if the schedule is empty the form falls back to a free-text input.
//
// Every row keeps the original fields (id, title, dates, duration, fees, admissionStatus).
// The Training Calendar also reads these optional fields, so rows without them still render:
//   group              "cultivation" | "spawn" (which calendar table the row goes in)
//   sNo                S. No. within its table
//   registrationDates  display text for "Online Registration Dates"
//   registrationStart, registrationEnd, startDate, endDate
//                      ISO dates (Indian time) used to compute the status (src/lib/trainingStatus.js)
//   language           shown with `duration` under "Language & Duration"
//   coordinator        "Course Coordinator"
//   note               shown instead of registration dates when a row has none
// admissionStatus ("Open" | "Closed" | "Upcoming") is only a fallback for rows without
// registration dates. An empty string means the value was not supplied.

const CULTIVATION = { group: "cultivation", language: "Hindi/English", duration: "6 Days" };
const FARMERS = { ...CULTIVATION, title: "Training on mushroom cultivation technology for farmers", fees: "3000/-" };
const ENTREPRENEURS = {
  ...CULTIVATION,
  title: "Training on mushroom cultivation technology for entrepreneurs",
  fees: "7000/-",
};

const SPAWN = {
  group: "spawn",
  title: "Training on Mushroom Spawn Production Technology 10 Nos Per Batch",
  fees: "Rs.4500/- per trainee",
  language: "English/ Hindi",
  duration: "3 Days",
  coordinator: "Dr. Prem Chandra & Dr. Rekha Singh (9125591178: only for Spawn Query) Call all days 10 AM to 12 PM",
  note: "",
};

const trainings = [
  // Training Programmes on Mushroom Cultivation Technology
  {
    ...FARMERS,
    id: "cultivation-2026-1",
    sNo: 1,
    dates: "25-30 Oct 2026",
    startDate: "2026-10-25",
    endDate: "2026-10-30",
    registrationDates: "01-10 August 2026",
    registrationStart: "2026-08-01",
    registrationEnd: "2026-08-10",
    coordinator: "Dr. Enespa, Dr. Rekha Singh",
    note: "",
    admissionStatus: "Closed",
  },
  {
    ...ENTREPRENEURS,
    id: "cultivation-2026-2",
    sNo: 2,
    dates: "01-06 Nov 2026",
    startDate: "2026-11-01",
    endDate: "2026-11-06",
    registrationDates: "",
    registrationStart: "",
    registrationEnd: "",
    coordinator: "Dr. Enespa, Dr. Kairovin Lakara",
    note: "Limited Seats — See the Special Note below",
    admissionStatus: "Closed",
  },
  {
    ...FARMERS,
    id: "cultivation-2026-3",
    sNo: 3,
    dates: "13-18 Nov 2026",
    startDate: "2026-11-13",
    endDate: "2026-11-18",
    registrationDates: "01-10 September 2026",
    registrationStart: "2026-09-01",
    registrationEnd: "2026-09-10",
    coordinator: "Dr. Enespa, Dr. Prem Chandra",
    note: "",
    admissionStatus: "Closed",
  },
  {
    ...ENTREPRENEURS,
    id: "cultivation-2026-4",
    sNo: 4,
    dates: "21-26 Nov 2026",
    startDate: "2026-11-21",
    endDate: "2026-11-26",
    registrationDates: "15-25 September 2026",
    registrationStart: "2026-09-15",
    registrationEnd: "2026-09-25",
    coordinator: "Dr. Enespa, Dr. Rekha Singh",
    note: "",
    admissionStatus: "Closed",
  },
  {
    ...FARMERS,
    id: "cultivation-2026-5",
    sNo: 5,
    dates: "2026", // training dates not supplied
    startDate: "",
    endDate: "",
    registrationDates: "01-10 October 2026",
    registrationStart: "2026-10-01",
    registrationEnd: "2026-10-10",
    coordinator: "Dr. Enespa, Dr. Kairovin Lakara",
    note: "",
    admissionStatus: "Closed",
  },
  {
    ...ENTREPRENEURS,
    id: "cultivation-2026-6",
    sNo: 6,
    dates: "16-27 Nov 2026",
    startDate: "2026-11-16",
    endDate: "2026-11-27",
    registrationDates: "15-25 October 2026",
    registrationStart: "2026-10-15",
    registrationEnd: "2026-10-25",
    coordinator: "Dr. Enespa, Dr. Prem Chandra",
    note: "",
    admissionStatus: "Upcoming",
  },
  {
    ...FARMERS,
    id: "cultivation-2026-7",
    sNo: 7,
    dates: "01-12 Dec 2026",
    startDate: "2026-12-01",
    endDate: "2026-12-12",
    registrationDates: "01-10 November 2026",
    registrationStart: "2026-11-01",
    registrationEnd: "2026-11-10",
    coordinator: "Dr. Enespa, Dr. Rekha Singh & Mr. Nilesh Srivastava ",
    note: "",
    admissionStatus: "Upcoming",
  },

  // Training on Mushroom Spawn Production Technology (Sept-Dec 2026)
  {
    ...SPAWN,
    id: "spawn-2026-1",
    sNo: 1,
    dates: "13-15 Sept 2026",
    startDate: "2026-09-13",
    endDate: "2026-09-15",
    registrationDates: "01-10 Sept 2026",
    registrationStart: "2026-09-01",
    registrationEnd: "2026-09-10",
    admissionStatus: "Closed",
  },
  {
    ...SPAWN,
    id: "spawn-2026-2",
    sNo: 2,
    dates: "28-30 Sept 2026",
    startDate: "2026-09-28",
    endDate: "2026-09-30",
    registrationDates: "16-25 Sept 2026",
    registrationStart: "2026-09-16",
    registrationEnd: "2026-09-25",
    admissionStatus: "Closed",
  },
  {
    ...SPAWN,
    id: "spawn-2026-3",
    sNo: 3,
    dates: "13-15 Oct 2026",
    startDate: "2026-10-13",
    endDate: "2026-10-15",
    registrationDates: "01-10 Oct 2026",
    registrationStart: "2026-10-01",
    registrationEnd: "2026-10-10",
    admissionStatus: "Closed",
  },
  {
    ...SPAWN,
    id: "spawn-2026-4",
    sNo: 4,
    dates: "28-30 Oct 2026",
    startDate: "2026-10-28",
    endDate: "2026-10-30",
    registrationDates: "16-25 Oct 2026",
    registrationStart: "2026-10-16",
    registrationEnd: "2026-10-25",
    admissionStatus: "Upcoming",
  },
  {
    ...SPAWN,
    id: "spawn-2026-5",
    sNo: 5,
    dates: "13-15 Nov 2026",
    startDate: "2026-11-13",
    endDate: "2026-11-15",
    registrationDates: "01-10 Nov 2026",
    registrationStart: "2026-11-01",
    registrationEnd: "2026-11-10",
    admissionStatus: "Upcoming",
  },
  {
    ...SPAWN,
    id: "spawn-2026-6",
    sNo: 6,
    dates: "27-30 Nov 2026",
    startDate: "2026-11-27",
    endDate: "2026-11-30",
    registrationDates: "16-25 Nov 2026",
    registrationStart: "2026-11-16",
    registrationEnd: "2026-11-25",
    admissionStatus: "Upcoming",
  },
  {
    ...SPAWN,
    id: "spawn-2026-7",
    sNo: 7,
    dates: "13-15 Dec 2026",
    startDate: "2026-12-13",
    endDate: "2026-12-15",
    registrationDates: "01-10 Dec 2026",
    registrationStart: "2026-12-01",
    registrationEnd: "2026-12-10",
    admissionStatus: "Upcoming",
  },
];

export default trainings;
