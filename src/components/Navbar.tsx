import React from "react";

export const Navbar = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between text-xs md:text-sm font-semibold">
      <div className="text-sm md:text-lg flex gap-1 items-center">
        <span className="text-zinc-800 tracking-tighter">Meme</span>
        <span className="px-3 py-[1px] bg-neutral-700 text-white rounded-lg">mine</span>
      </div>

      <div className="flex gap-3">
        <a className="px-4 py-2 flex gap-1 text-xs md:text-sm font-semibold text-white bg-zinc-700 cursor-pointer rounded-lg transition"
        href="https://github.com/karsh0/meme-mine">
          ⭐ Star on GitHub 
        </a>
      </div>
    </nav>
  );
};
