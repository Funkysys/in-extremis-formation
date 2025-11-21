import Image from "next/image";

export default function Loading() {
  return (
    <main className="overflow-y-scroll overflow-x-hidden bg-sky-900">
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center relative">
        <h1 className="sr-only">
          In Extremis Formation - Éducation musicale populaire en ligne
        </h1>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <Image
            src="/images/logo_white.png"
            alt="In Extremis Formation - Éducation musicale populaire en ligne"
            width={1000}
            height={1000}
            className="rounded-lg animate-fade-up animate-once animate-duration-[1000ms] animate-ease-in-out object-cover"
            priority
          />

          <p className="text-lg md:text-xl xl:text-2xl mt-2 text-center animate-fade-up animate-delay-500 sr-only">
            Pour apprendre la musique à votre rythme !
          </p>
        </div>
      </div>
    </main>
  );
}
