import content from "../data/content";
import { formText } from "../data/trainingForm";
import PageHeader from "../components/PageHeader";
import TrainingForm from "../components/TrainingForm";
import ContactBlock from "../components/ContactBlock";
import { card, container, heading } from "../components/styles";

const { contact, nav } = content;

export default function TrainingApply() {

  return (
    <main>
      <PageHeader
        crumbs={[
          { label: nav.links.training.label, to: nav.links.training.to },
          { label: nav.links.apply.label },
        ]}
        title={formText.title}
      />

      <section className="bg-background-light py-8 md:py-10">
        <div className={`${container} grid gap-8 lg:grid-cols-12`}>
          <div className="lg:col-span-8">
            <TrainingForm />
          </div>
          <aside className="lg:col-span-4">
            <div className={`${card} p-6 md:p-8 lg:sticky lg:top-36`}>
              <h2 className={`mb-6 text-xl font-bold ${heading}`}>{contact.heading}</h2>
              <ContactBlock />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
