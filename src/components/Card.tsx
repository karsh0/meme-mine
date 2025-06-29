import React from "react";
import { useImage } from "../providers/image-provider";
import { useNavigate } from "react-router-dom";

export const Card = ({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) => {
  const navigate = useNavigate();
  const { setImage } = useImage();

  return (
    <div
      className="flex flex-col items-center rounded-3xl overflow-hidden cursor-pointer group transition-all duration-200"
      onClick={() => {
        setImage(imageUrl);
        navigate("/meme");
      }}
    >
      <div className="rounded-2xl overflow-hidden w-72 h-72">
        <img
          src={imageUrl}
          alt="Meme Thumbnail"
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <span className="text-black text-base sm:text-lg font-semibold text-center mt-2 px-2 break-words">
        {title}
      </span>
    </div>
  );
};
