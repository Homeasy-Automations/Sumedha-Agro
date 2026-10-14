import { today } from "../csv";
import ContentEditor from "../ContentEditor";
import { DateTime, PageTitle } from "../ui";

const FIELDS = [
  { name: "title", label: "Headline", required: true, maxLength: 200, wide: true },
  { name: "date", label: "Date", required: true, type: "date" },
  { name: "link", label: "Link", type: "url", placeholder: "https://…", hint: "Optional. A page with more details.", maxLength: 500 },
  { name: "body", label: "Details", type: "textarea", maxLength: 5000, wide: true },
];

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export default function NewsAdmin() {
  return (
    <>
      <PageTitle
        title="News & announcements"
        description="Shown on the News & Announcements page, and the latest three on the home page (newest date first)."
      />
      <ContentEditor
        kind="news"
        endpoint="/news"
        noun="Announcement"
        fields={FIELDS}
        initial={() => ({ title: "", date: today(), link: "", body: "" })}
        summary={(item) => (
          <>
            <p className="text-xs font-semibold text-[#5b735b]">{dateFormat.format(new Date(`${item.date}T00:00:00Z`))}</p>
            <p className="font-semibold text-[#0d1b0d]">{item.title}</p>
            {item.body && <p className="mt-1 line-clamp-2 text-sm text-[#3f5f3f]">{item.body}</p>}
            <p className="mt-1 text-xs text-[#5b735b]">
              Added <DateTime value={item.createdAt} />
            </p>
          </>
        )}
        emptyText="No announcements yet. The website shows “To be announced” until you add one."
      />
    </>
  );
}
