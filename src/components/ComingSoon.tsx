import { Link } from "@tanstack/react-router";

export function ComingSoon({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center px-6 py-24 md:px-10">
      <p className="editorial-label text-bakebook-blue">— {eyebrow}</p>
      <h1 className="mt-6 display-caps max-w-4xl text-5xl text-foreground md:text-7xl lg:text-8xl">
        {title}
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
        {body}
      </p>
      <div className="mt-10">
        <Link
          to="/"
          className="editorial-label inline-flex items-center gap-2 border-b border-foreground pb-1 text-foreground transition-colors hover:border-bakebook-blue hover:text-bakebook-blue"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
