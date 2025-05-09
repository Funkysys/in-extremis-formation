import Image from "next/image";
import Link from "next/link";
import { CardType } from "../../types";

const LinksCard = ({
  id,
  title,
  description,
  imageUrl,
  link,
  mail,
}: CardType) => {
  return (
    <div
      key={id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-[50vh] lg:h-[50vh] flex flex-col"
    >
      {/* Image de la carte */}
      {imageUrl && (
        <div className="w-full h-[100%] lg:h-[60%] relative mb-4">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Contenu de la carte */}
      <div className="flex flex-col flex-grow justify-between items-start">
        <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        <p className="text-gray-700">{description}</p>
        {mail && (
          <Link
            href={`mailto:${mail}`}
            className="bg-yellow-500 hover:bg-orange-500 text-white px-4 py-2 mt-4 rounded-md"
          >
            Nous contacter
          </Link>
        )}

        {link && (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-sky-900 text-white px-4 py-2 mt-4 rounded-md"
          >
            {`C'est par là !`}
          </Link>
        )}
      </div>
    </div>
  );
};

export default LinksCard;
