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
  // Field 2 (Date of training) is filled in from the chosen training's batch that is open for
  // registration on the Training Calendar (see TrainingForm.jsx).
  batchDate: {
    chooseTrainingFirst: "Select the training first",
    filledIn: "Filled in automatically from the Training Calendar.",
    chooseBatch: "More than one batch is open: select yours.",
    notOpen: "Registration for this training is not open right now.",
    nextBatch: "Next batch",
    registration: "Registration",
    seeCalendar: "See the Training Calendar",
  },
  // Field 17: paying the fee by UPI and uploading a screenshot of the payment.
  payment: {
    no: 17,
    label: "Payment of training fee",
    fee: "Training fee",
    intro:
      "Paying the training fee is required to complete your application. Click “Show QR code”, pay, then upload a screenshot of the payment.",
    // The QR code image is frontend/public/payment-qr.jpg (Canara Bank, from "Sumedha Payment QR.jpeg").
    qrSrc: "/payment-qr.jpg",
    qrAlt: "Canara Bank UPI QR code for paying the training fee. UPI ID: 338513151737107@cnrb",
    upiId: "338513151737107@cnrb",
    payeeName: "Sumedha Agro",
    showQr: "Show QR code",
    hideQr: "Hide QR code",
    payTitle: "Scan & pay",
    payText: "Scan the QR code with Google Pay, PhonePe, Paytm, BHIM or any UPI app and pay the training fee.",
    upiIdLabel: "UPI ID",
    copy: "Copy",
    copied: "Copied",
    download: "Download QR",
    phoneHint: "Paying from this phone? Tap “Pay with a UPI app”, copy the UPI ID into your app, or download the QR code and scan it from your gallery.",
    openApp: "Pay with a UPI app",
    screenshot: "Upload payment screenshot",
    requiredBadge: "Required",
    screenshotHint:
      "Upload a screenshot or PDF receipt of the successful payment, showing the amount, date and UPI transaction ID (UTR).",
    notAccepted: "Applications without a payment screenshot are not accepted.",
    choose: "Click to choose the screenshot or PDF",
    dropHint: "or drag and drop it here",
    formats: "Any image (JPG, PNG, WebP…) or PDF, up to 10 MB",
    pdfChosen: "PDF receipt",
    change: "Change",
    remove: "Remove",
    required: "Upload a screenshot of your payment.",
    notImage: "Choose an image (JPG, PNG, WebP…) or a PDF file.",
    uploading: "Uploading payment screenshot…",
  },
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

// type: "training" renders a select of the Training Calendar's programmes (free text if empty);
// type: "batch" shows the date of the chosen programme's batch that is open for registration.
// validate: extra rule applied after the required check (see TrainingForm.jsx).
// details: a conditional textarea shown when the radio value equals showWhen (optional field).
export const fields = [
  { no: 1, name: "trainingAppliedFor", label: "Training applied for", type: "training" },
  { no: 2, name: "trainingDate", label: "Date of training", type: "batch" },
  {
    no: 3,
    name: "name",
    label: "Name (As you want it to be printed in certificates)",
    type: "text",
    autoComplete: "name",
  },
  { no: 4, name: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
  { no: 5, name: "category", label: "Category", type: "radio", options: ["SC", "ST", "OBC", "General"], wide: true },
  {
    no: 6,
    name: "postalAddress",
    label: "Complete postal address",
    type: "textarea",
    autoComplete: "street-address",
    wide: true,
  },
  {
    no: 7,
    name: "state",
    label: "State",
    type: "select",
    optionGroups: [
      { label: "States", options: states },
      { label: "Union Territories", options: unionTerritories },
    ],
  },
  {
    no: 8,
    name: "mobile",
    label: "Mobile No",
    type: "tel",
    validate: "mobile",
    inputMode: "numeric",
    autoComplete: "tel-national",
  },
  { no: 9, name: "aadhar", label: "Aadhar No", type: "text", validate: "aadhar", inputMode: "numeric" },
  { no: 10, name: "email", label: "Email", type: "email", validate: "email", autoComplete: "email" },
  { no: 11, name: "dateOfBirth", label: "Date of birth", type: "date", validate: "pastDate", autoComplete: "bday" },
  { no: 12, name: "education", label: "Education/ qualification", type: "text" },
  { no: 13, name: "livingPlace", label: "Living place", type: "text" },
  {
    no: 14,
    name: "employment",
    label: "Present employment/ designation",
    type: "text",
    autoComplete: "organization-title",
  },
  {
    no: 15,
    name: "previousTraining",
    label:
      "Have you taken any training on mushroom cultivation? If yes, please give description about training name, institution from where trained and duration of training",
    type: "radio",
    options: ["Yes", "No"],
    wide: true,
    details: { name: "previousTrainingDetails", showWhen: "Yes" },
  },
  {
    no: 16,
    name: "cultivatedBefore",
    label: "Have you cultivated any mushroom before?",
    type: "radio",
    options: ["Yes", "No"],
    wide: true,
  },
];
