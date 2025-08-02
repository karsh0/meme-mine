import React from "react";

export const Navbar = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between">
      <span className="text-xl font-semibold text-zinc-800 tracking-tighter">Meme <span className="px-3 py-1 bg-neutral-700 text-white rounded-lg text-lg">mine</span></span>

      <div className="flex gap-3">
        <a className="px-4 py-2 flex gap-1 font-medium text-white bg-zinc-700 cursor-pointer rounded-lg transition"
        href="https://github.com/karsh0/meme-mine">
          ⭐ Star on GitHub 
        </a>
      </div>
    </nav>
  );
};
