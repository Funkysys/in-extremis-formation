"use client";

export function VideoSection() {
  return (
    <section
      className="w-full px-4 py-16 md:px-10"
      style={{ background: "var(--color-background-stage)" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="mb-8 text-4xl font-bold text-center font-montserrat"
          style={{ color: "var(--color-primary-stage)" }}
        >
          À quoi ça ressemble ?
        </h2>
        <p
          className="mb-8 text-lg text-center"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          Découvrez l&apos;ambiance de nos stages à travers cette vidéo
        </p>
        <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-2xl aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/JID9BO9zPFs?si=C71u0adGZV_00and"
            title="Vidéo de présentation des stages In Extremis"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
