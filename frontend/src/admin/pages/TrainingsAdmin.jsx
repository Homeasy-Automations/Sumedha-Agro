import ContentEditor from "../ContentEditor";
import { PageTitle } from "../ui";

const TBA = "To be announced";

const FIELDS = [
  { name: "title", label: "Title", required: true, maxLength: 200, wide: true, placeholder: "e.g. Spawn Production Training" },
  { name: "dates", label: "Dates", maxLength: 100, placeholder: TBA },
  { name: "duration", label: "Duration", maxLength: 100, placeholder: TBA },
  { name: "fees", label: "Fees", maxLength: 100, placeholder: TBA },
  { name: "admissionStatus", label: "Admission status", maxLength: 100, placeholder: `${TBA} (e.g. Open, Closed)` },
];

export default function TrainingsAdmin() {
  return (
    <>
      <PageTitle
        title="Training schedule"
        description="Rows in the Training Schedule table on the Training page, in the order added. Titles also appear in the application form's “Training applied for” list. Empty fields show “To be announced”."
      />
      <ContentEditor
        kind="trainings"
        endpoint="/trainings"
        noun="Training"
        fields={FIELDS}
        initial={() => ({ title: "", dates: "", duration: "", fees: "", admissionStatus: "" })}
        summary={(item) => (
          <>
            <p className="font-semibold text-[#0d1b0d]">{item.title}</p>
            <dl className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#5b735b]">
              {FIELDS.slice(1).map((f) => (
                <div key={f.name} className="flex gap-1">
                  <dt>{f.label}:</dt>
                  <dd className="font-medium text-[#0d1b0d]">{item[f.name] || TBA}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        emptyText="No rows yet. The website shows the default “Spawn Production Training — To be announced” row until you add one."
      />
    </>
  );
}
