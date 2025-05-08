import { cards } from "@/data/outils";
import Image from "next/image";
import Link from "next/link";
import { CardType } from "../../types";
import LinksCard from "./LinksCard";

const ThirdPart: React.FC = () => {
  return (
    <section className="w-[100vw] min-h-[100vh] bg-sky-600 flex flex-col justify-center items-center">
      <header>
        <h2 className="text-xl md:text-3xl text-white text-center mb-6 mt-6 font-roboto">
          Avant de partir, découvrez aussi notre catalogue de <br />
          conférence sur les thèmes de musique et société sur In Extremis
          Society
        </h2>
      </header>

      <figure className="relative w-[100vw] h-[20vh] xl:w-[70vw] xl:h-[30vh]">
        <Link href="https://www.in-extremis-conferences.eu/" target="_blank">
          <Image
            src={"/images/in-extremis-society.png"}
            alt="In Extremis Society - Conférences sur la musique et la société"
            layout="fill"
            className="object-cover rounded-lg"
          />
        </Link>
      </figure>

      <Link
        href="https://www.in-extremis-conferences.eu/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow-500 hover:text-sky-900 hover:bg-yellow-500 bg-sky-900 hover:text-yello-700 text-xl mt-4 px-4 py-2 border-4 border-yellow-500 rounded"
        aria-label="En savoir plus sur In Extremis Society"
      >
        En savoir plus
      </Link>

      <section className="w-full mt-10">
        <h2 className="text-3xl text-white text-center mb-6 font-roboto">
          Ainsi que nos différents outils
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-col-6 gap-4 py-10 lg:p-10">
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
