import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { useSelected } from "../../hooks/useSelected";
import { MemeGenerator } from "./MemeGenerator";
import { MainContainer } from "./MainContainer";


export const Landing = () => {
  const { selectedImage } = useSelected() 

  return (
    <div className="relative w-full min-h-screen bg-gray-200 text-gray-800">
      <motion.div
        className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-500 opacity-30 blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 100, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Navbar />
      </div>
      {

        selectedImage === "" ? <MainContainer/> : <MemeGenerator/>

      }   
    </div>
  );
};
