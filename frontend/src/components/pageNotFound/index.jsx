import React from "react";

const PageNotFound = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcttatiuj/image/upload/v1756441756/snow-removal-machine-working-high-ski-slope-snowstorm_454047-2149_1_es55po.png')", 
      }}
    >
      {/* Title */}
      <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
        Lost Your Way ?
      </h1>

      {/* Subtitle */}
      <p className="text-white text-base sm:text-lg md:text-xl max-w-lg mb-6">
        We are sorry the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>

      {/* Button */}
      <a
        href="/"
        className="bg-white text-black px-5 py-2 rounded-md shadow-md hover:bg-gray-200 transition"
      >
        Go to Home
      </a>
    </div>
  );
};

export default PageNotFound;
