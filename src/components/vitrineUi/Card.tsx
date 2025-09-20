import { CardType } from "@/types";
import Image from "next/image";
import Link from "next/link";

const Card = ({ id, title, description, imageUrl, link, mail }: CardType) => {
  return (
    <article
      key={id}
      className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-[80vh] lg:h-[70vh] flex flex-col"
      style={{ background: "#e6f4fe" }}
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
      <div className="flex flex-col items-start justify-between flex-grow">
        <header>
          <h3 className="mb-4 text-xl font-bold" style={{ color: "#1f2d5c" }}>
            {title}
          </h3>
        </header>
        <p style={{ color: "#1f2d5c" }}>{description}</p>
        <footer className="w-full mt-4">
          {mail && (
            <Link
              href={`mailto:${mail}`}
              className="inline-block px-4 py-2 text-white transition-colors duration-300 rounded-md"
              style={{
                backgroundColor: "#2A3B61",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#422D68";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2A3B61";
              }}
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
              className="inline-block px-4 py-2 text-white transition-colors duration-300 rounded-md"
              style={{
                backgroundColor: "#2A3B61",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#422D68";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2A3B61";
              }}
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
