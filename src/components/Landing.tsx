import { Navbar } from "./Navbar";
import { useSelected } from "../../hooks/useSelected";
import { MemeGenerator } from "./MemeGenerator";
import { MainContainer } from "./MainContainer";


export const Landing = () => {
  const { selectedImage } = useSelected() 

  return (
    <div className="relative w-full min-h-[100svh] bg-gray-200 text-gray-800 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Navbar />
      </div>
      {

        selectedImage === "" ? <MainContainer/> : <MemeGenerator/>

      }   
    </div>
  );
};
