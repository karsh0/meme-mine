import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { CircleArrowOutDownRight } from "lucide-react";
import { templates } from "../../data/templates";
import { Template } from "../../types/template";

export const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState<Template[] | []>([]);

  useEffect(() => {
    const filtered = Object.entries(templates)
      .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([key, value]) => ({
        title: key,
        image: value.image,
      }));

    setFilteredImages(filtered);
  }, [searchQuery]);


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

      <main className="max-w-6xl mx-auto px-4 py-5 md:py-16">
        <section className="text-center py-16 sm:py-20">
          <div className="text-4xl sm:text-5xl md:text-7xl font-['poppins'] font-semibold tracking-tight leading-[1.1] text-center">
            <span className="">Generate Memes in</span>
            <br />
            <span className="text-indigo-500">Seconds</span>
          </div>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            It’s time to create and share your humor with the world.
          </p>

          <div className="relative max-w-lg mt-8 mx-auto">
            <input
              type="text"
              placeholder="Search template"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 px-5 py-3 bg-zinc-900 text-white placeholder:text-gray-400 border border-zinc-700 rounded-full"
            />
            <CircleArrowOutDownRight
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              size={20}
            />
          </div>
        </section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {
          (searchQuery.length > 0 ? filteredImages : Object.entries(templates).map(([key, tpl]) => ({
            title: key,
            image: tpl.image,
          }))).map((tpl) => (
            <Card key={tpl.title} imageUrl={tpl.image} title={tpl.title} />
          ))
        }
        </div>

      </main>
    </div>
  );
};
