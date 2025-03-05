import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.livingroom,
    title: "Unparalleled African Art",
    description: "Experience the beauty of African art in this collection.",
  },
  {
    id: 2,
    image: assets.furn1,
    title: "Art That Tells A Story",
    description: "Discover African art through the stories it tells.",
  },
  {
    id: 3,
    image: assets.outdoor,
    title: "Power in Every Art Piece",
    description: "Experience the power of African art in this collection of art pieces.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-full object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <div className="relative p-4 rounded-lg">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg"></div>
                    <p className="font-medium text-xl lg:text-2xl text-white relative z-10">{title}</p>
                    <p className="text-sm lg:text-base leading-5 max-w-60 text-white relative z-10">
                    {description}
                    </p>
              </div>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
