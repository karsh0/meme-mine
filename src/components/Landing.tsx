import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { CircleArrowOutDownRight, Loader2 } from "lucide-react";

interface AllImages {
  id: string;
  imageUrl: string;
  title: string;
}

export const Landing = () => {
  const [images, setImages] = useState<AllImages[]>([]);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredImages, setFilteredImages] = useState<AllImages[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetch(import.meta.env.VITE_API_URL);
        const data = await res.json();
        setImages(data.images);
        setLoading(false)
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    })();
  }, []);

  function FilterContents(value: string) {
    setFilteredImages(
      images.filter((i) =>
        i.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

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

      <main className="max-w-5xl mx-auto px-4 py-5 md:py-16">
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
              onChange={(e) => {
                if (e.target.value !== "") {
                  setSearch(true);
                  FilterContents(e.target.value);
                } else {
                  setSearch(false);
                }
              }}
              className="w-full pr-12 px-5 py-3 bg-zinc-900 text-white placeholder:text-gray-400 border border-zinc-700 rounded-full"
            />
            <CircleArrowOutDownRight
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              size={20}
            />
          </div>
        </section>
        {loading ? <Loader2 className="mx-auto my-30 w-16 h-16 animate-spin transition duration-200" /> :
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(search ? filteredImages : images).map((i) => (
              <Card key={i.id} imageUrl={i.imageUrl} title={i.title} />
            ))}
          </section>

        }
      </main>
    </div>
  );
};
