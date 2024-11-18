import Link from "next/link";
import React from "react";

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
    </div>
  );
};

export default ThirdPart;
