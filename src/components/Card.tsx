import { useNavigate } from "react-router-dom";
import { useSelected } from "../../hooks/useSelected";

export const Card = ({imageUrl, title}: { imageUrl: string, title: string}) => {
  const navigate = useNavigate();
  const { setSelectedImage } = useSelected()

  return (
    <div
      className="flex flex-col items-center rounded-3xl overflow-hidden cursor-pointer group transition-all duration-200"
      onClick={() => {
        setSelectedImage(imageUrl)
      }}
    >
      <div className="rounded-2xl overflow-hidden w-40 h-40 md:w-52 md:h-52">
        <img
          src={imageUrl}
          alt="Meme Thumbnail"
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <span className="text-black text-md md:text-lg font-medium md:font-semibold text-center mt-2 px-2">
        {title.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
      </span>
    </div>
  );
};
