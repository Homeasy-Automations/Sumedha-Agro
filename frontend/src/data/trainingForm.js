// Training application form: labels and options must stay exactly as supplied.

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const unionTerritories = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const formText = {
  title: "Application for training on mushroom cultivation technology at Sumedha Agro",
  instruction: "Please provide information for all the fields.",
  selectPlaceholder: "Select",
  // Shown under field 1 when the form was opened from a batch's Apply button on the Training Calendar.
  batchLabel: "Batch",
  submit: "Submit",
  submitting: "Submitting…",
  errorSummary: "Please correct the highlighted fields.",
  success: {
    heading: "Application submitted",
    referenceLabel: "Reference number",
    body: "Please keep this reference number for any correspondence about your application.",
    again: "Submit another application",
  },
  error: {
    heading: "Submission failed",
    body: "Your application could not be submitted. Please try again, or contact us using the details below.",
  },
};

export const validationMessages = {
  required: "This field is required.",
  mobile: "Enter a 10-digit mobile number.",
  aadhar: "Enter a 12-digit Aadhar number.",
  email: "Enter a valid email address.",
  pastDate: "Date of birth must be in the past.",
};

// type: "training" renders a select from src/data/trainings.js (free text if empty).
// validate: extra rule applied after the required check (see TrainingForm.jsx).
// details: a conditional textarea shown when the radio value equals showWhen (optional field).
export const fields = [
  { no: 1, name: "trainingAppliedFor", label: "Training applied for", type: "training" },
  { no: 2, name: "trainingModuleNo", label: "Training Module No", type: "text" },
  { no: 3, name: "trainingDate", label: "Date of training", type: "date" },
  {
    no: 4,
    name: "name",
    label: "Name (As you want it to be printed in certificates)",
    type: "text",
    autoComplete: "name",
  },
  { no: 5, name: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
  { no: 6, name: "category", label: "Category", type: "radio", options: ["SC", "ST", "OBC", "General"] },
  {
    no: 7,
    name: "postalAddress",
    label: "Complete postal address",
    type: "textarea",
    autoComplete: "street-address",
    wide: true,
  },
  {
    no: 8,
    name: "state",
    label: "State",
    type: "select",
    optionGroups: [
      { label: "States", options: states },
      { label: "Union Territories", options: unionTerritories },
    ],
  },
  {
    no: 9,
    name: "mobile",
    label: "Mobile No",
    type: "tel",
    validate: "mobile",
    inputMode: "numeric",
    autoComplete: "tel-national",
  },
  { no: 10, name: "aadhar", label: "Aadhar No", type: "text", validate: "aadhar", inputMode: "numeric" },
  { no: 11, name: "email", label: "Email", type: "email", validate: "email", autoComplete: "email" },
  { no: 12, name: "dateOfBirth", label: "Date of birth", type: "date", validate: "pastDate", autoComplete: "bday" },
  { no: 13, name: "education", label: "Education/ qualification", type: "text" },
  { no: 14, name: "livingPlace", label: "Living place", type: "text" },
  {
    no: 15,
    name: "employment",
    label: "Present employment/ designation",
    type: "text",
    autoComplete: "organization-title",
  },
  {
    no: 16,
    name: "previousTraining",
    label:
      "Have you taken any training on mushroom cultivation? If yes, please give description about training name, institution from where trained and duration of training",
    type: "radio",
    options: ["Yes", "No"],
    wide: true,
    details: { name: "previousTrainingDetails", showWhen: "Yes" },
  },
  {
    no: 17,
    name: "cultivatedBefore",
    label: "Have you cultivated any mushroom before?",
    type: "radio",
    options: ["Yes", "No"],
    wide: true,
  },
];
