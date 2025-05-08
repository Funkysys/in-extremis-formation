import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="max-w-screen-xl mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} In Extremis Formation. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
