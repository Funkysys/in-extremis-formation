import { cards } from "@/data/tools";
import Image from "next/image";
import Link from "next/link";
import { CardType } from "../../types/cards";
import LinksCard from "./LinksCard";

const ThirdPart: React.FC = () => {
  return (
    <section
      className="w-[100vw] min-h-[100vh] flex flex-col justify-center items-center"
      style={{
        background: "var(--color-background-tertiary)",
        color: "var(--color-foreground)",
      }}
    >
      <header>
        <h2
          className="mt-6 mb-6 text-xl italic text-center md:text-3xl font-Montserrat"
          style={{ color: "var(--color-foreground)" }}
        >
          Avant de partir, découvrez aussi notre catalogue de <br />
          conférence sur les thèmes de musique et société sur In Extremis
          Society
        </h2>
      </header>

      <figure className="relative w-[80vw] h-[20vh] md:w-[60vw] md:h-[40vh]  lg:w-[50vw] lg:h-[40vh] xl:w-[30vw] xl:h-[30vh]">
        <Link href="https://www.in-extremis-conferences.eu/" target="_blank">
          <Image
            src={"/images/in-extremis-society.png"}
            alt="In Extremis Society - Conférences sur la musique et la société"
            layout="fill"
            className="object-cover rounded-lg"
            style={{ background: "var(--color-background-tertiary)" }}
          />
        </Link>
      </figure>

      <Link
        href="https://www.in-extremis-conferences.eu/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 mt-4 text-xl text-white transition-colors duration-300 rounded"
        style={{
          backgroundColor: "#422D68",
          border: "2px solid var(--color-border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#2A3B61";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#422D68";
        }}
        aria-label="En savoir plus sur In Extremis Society"
      >
        En savoir plus
      </Link>

      <section className="w-full mt-10">
        <h2
          className="mb-6 text-3xl italic text-center font-Montserrat"
          style={{ color: "var(--color-foreground)" }}
        >
          Ainsi que nos différents outils
        </h2>
        <div className="grid grid-cols-1 gap-4 py-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-col-6 lg:p-10">
          {cards.map((card: CardType) => (
            <LinksCard
              id={card.id}
              key={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              link={card.link}
              mail={card.mail}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default ThirdPart;
