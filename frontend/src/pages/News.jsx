import content from "../data/content";
import usePageMeta from "../hooks/usePageMeta";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import NewsList from "../components/NewsList";
import SectionHeading from "../components/SectionHeading";
import MediaSection from "../components/MediaSection";
import { container, sectionY } from "../components/styles";

const { news, media, nav, meta } = content;

export default function News() {
  usePageMeta(meta.news);

  return (
    <main>
      <PageHeader crumbs={[{ label: nav.links.news.label }]} title={news.heading} />
      <section className={`bg-background-light ${sectionY}`}>
        <Reveal className={`${container} max-w-4xl`}>
          <NewsList />
        </Reveal>
      </section>

      {/* Media: videos and gallery (formerly its own page) */}
      <section
        id={media.id}
        aria-labelledby={`${media.id}-heading`}
        className={`scroll-mt-24 bg-white md:scroll-mt-36 ${sectionY}`}
      >
        <div className={container}>
          <Reveal>
            <SectionHeading id={`${media.id}-heading`} title={media.heading} />
          </Reveal>
          <Reveal className="mt-6">
            <MediaSection headingLevel="h3" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
