import StageContent from "@/components/stage/StageContent";
import StagePresentation from "@/components/stage/StagePresentation";
import TeamPage from "@/components/stage/TeamPage";

const StagePage = () => {
  return (
    <main
      className="overflow-x-hidden overflow-y-scroll"
      style={{ background: "var(--color-background-stage)" }}
    >
      <div
        className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative"
        style={{
          background: "var(--color-background-stage)",
          color: "var(--color-foreground-stage)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: "var(--color-foreground-stage)" }}
        >
          <div
            className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-20 rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out border-2"
            style={{
              background: "var(--color-background-secondary-stage)",
              borderColor: "var(--color-border-stage)",
            }}
          >
            <h1
              className="mb-6 text-4xl font-bold tracking-wide text-center md:text-6xl lg:text-7xl"
              style={{ color: "var(--color-primary-stage)" }}
            >
              IN EXTREMIS
            </h1>
            <h2
              className="text-2xl italic font-medium text-center md:text-3xl lg:text-4xl animate-fade-up animate-delay-500"
              style={{ color: "var(--color-foreground-stage)" }}
            >
              STAGES
            </h2>
          </div>
        </div>
      </div>
      <StageContent />
      <StagePresentation />
      <TeamPage title={"Notre équipe"} />
    </main>
  );
};

export default StagePage;
