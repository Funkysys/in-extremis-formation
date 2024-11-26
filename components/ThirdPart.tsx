import { cards } from "@/data/outils";
import { CardType } from "@/types";
import LinksCard from "./LinksCard";

import Link from "next/link";

const ThirdPart: React.FC = () => {
  return (
    <div className="w-[100vw] h-[100vh] bg-sky-600 flex flex-col justify-center items-center">
      <h3 className="text-3xl text-white text-center mb-6">
        Avant de partir, découvrez aussi notre catalogue de <br />
        conférence sur les thèmes de musique et société
      </h3>
      <Link
        href="https://www.in-extremis-conferences.eu/"
        target="_blank"
        className="text-yellow-500 hover:text-sky-900 hover:bg-yellow-500 bg-sky-900 hover:text-yello-700 text-xl mt-4 px-4 py-2 border-4 border-yellow-500 rounded"
      >
        En savoir plus
      </Link>
      <h3 className="text-3xl text-white text-center mt-10 mb-6">
        Ainsi que nos différents outils
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-col-6 gap-4 p-10">
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
    </div>
  );
};

export default ThirdPart;
