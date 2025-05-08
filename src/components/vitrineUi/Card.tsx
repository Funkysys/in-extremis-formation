import { CardType } from "@/types";
import Image from "next/image";
import Link from "next/link";

const Card = ({ id, title, description, imageUrl, link, mail }: CardType) => {
  return (
    <article
      key={id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-[80vh] lg:h-[70vh] flex flex-col"
    >
      {/* Image de la carte */}
      {imageUrl && (
        <figure className="w-full h-[100%] lg:h-[60%] relative mb-4">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </figure>
      )}

      {/* Contenu de la carte */}
      <div className="flex flex-col flex-grow justify-between items-start">
        <header>
          <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        </header>
        <p className="text-gray-700">{description}</p>
        <footer className="mt-4 w-full">
          {mail && (
            <Link
              href={`mailto:${mail}`}
              className="bg-yellow-500 hover:bg-orange-500 text-white px-4 py-2 rounded-md inline-block"
              aria-label={`Contacter ${title}`}
            >
              Nous contacter
            </Link>
          )}

          {link && (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-sky-900 text-white px-4 py-2 rounded-md inline-block"
              aria-label={`Rejoindre ${title}`}
            >
              Nous rejoindre
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
};

export default Card;
