import {
  FileText,
  Image,
  MessageCircle,
  Music2,
  Search,
  Star,
} from "lucide-react";

const reviewSources = [
  {
    name: "Google Reviews",
    icon: Search,
    summary: "Rating unavailable",
    description:
      "Google Business Profile ratings and client reviews will appear here after a future integration.",
  },
  {
    name: "Facebook Reviews",
    icon: MessageCircle,
    summary: "Recommendations unavailable",
    description:
      "Facebook recommendations and review activity will appear here after a future integration.",
  },
  {
    name: "Instagram Mentions",
    icon: Image,
    summary: "Mentions unavailable",
    description:
      "Tagged posts and relevant client mentions will appear here after a future integration.",
  },
  {
    name: "TikTok Mentions",
    icon: Music2,
    summary: "Mentions unavailable",
    description:
      "Relevant tagged videos and client mentions will appear here after a future integration.",
  },
  {
    name: "Manual Testimonials",
    icon: FileText,
    summary: "No testimonials added",
    description:
      "Approved client feedback entered by the studio will be organised here in a later milestone.",
  },
];

const testimonialFields = [
  "Client name",
  "Platform / source",
  "Rating",
  "Review text",
  "Date",
  "Status",
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Review Hub</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Monitor and organise client feedback from Google, Facebook,
          Instagram, and TikTok in one place.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm font-medium text-primary">UI planning page</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Review integrations are not connected yet. This page contains
          placeholders only and does not fetch, scrape, or publish feedback.
        </p>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-white">Feedback sources</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviewSources.map((source) => {
            const Icon = source.icon;
            return (
              <article
                key={source.name}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Connect later
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {source.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Placeholder: {source.summary}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {source.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Manual testimonial workspace
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Placeholder area for testimonials collected directly by the
            studio. Adding and publishing entries will come in a later
            milestone.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.1fr_1fr_0.6fr_2fr_0.9fr_0.9fr] gap-3 border-b border-slate-800 px-5 py-3">
              {testimonialFields.map((field) => (
                <span
                  key={field}
                  className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  {field}
                </span>
              ))}
            </div>
            <div className="flex min-h-40 flex-col items-center justify-center px-5 py-10 text-center">
              <FileText className="h-8 w-8 text-primary/70" />
              <p className="mt-3 text-sm font-medium text-white">
                No manual testimonials yet
              </p>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                Future entries will use Draft, Approved, or Published status.
                No review data is stored or displayed in this placeholder.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
