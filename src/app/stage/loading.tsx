import Image from "next/image";

export default function StageLoading() {
  return (
    <main
      className="overflow-x-hidden overflow-y-scroll"
      style={{ background: "var(--color-background-stage)" }}
    >
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <div
            className="flex flex-col items-center justify-center p-8 rounded-lg md:p-16 lg:p-20 animate-pulse"
            style={{
              background: "var(--color-background-secondary-stage)",
              borderColor: "var(--color-border-stage)",
              border: "2px solid",
            }}
          >
            <div className="relative mb-6">
              <Image
                src="/images/logo_white.png"
                alt="In Extremis Formation"
                width={200}
                height={200}
                className="object-cover animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out"
                priority
              />
            </div>

            <h1
              className="mb-4 text-4xl font-bold tracking-wide text-center md:text-5xl lg:text-6xl"
              style={{ color: "var(--color-primary-stage)" }}
            >
              IN EXTREMIS
            </h1>

            <p
              className="mb-6 text-xl italic font-medium text-center md:text-2xl lg:text-3xl"
              style={{ color: "var(--color-foreground-stage)" }}
            >
              STAGES
            </p>

            <div className="flex gap-2 mt-4">
              <div
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  background: "var(--color-primary-stage)",
                  animationDelay: "0ms",
                }}
              ></div>
              <div
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  background: "var(--color-primary-stage)",
                  animationDelay: "150ms",
                }}
              ></div>
              <div
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  background: "var(--color-primary-stage)",
                  animationDelay: "300ms",
                }}
              ></div>
            </div>

            <p
              className="mt-4 text-sm text-center md:text-base"
              style={{ color: "var(--color-foreground-stage)", opacity: 0.8 }}
            >
              Chargement en cours...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
