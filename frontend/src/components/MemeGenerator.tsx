import React, { useEffect, useRef, useState } from "react";
import { useImage } from "../providers/image-provider";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const MemeGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [texts, setTexts] = useState<textsType[]>([])
  const [text, setText] = useState<string>("");
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<string>("white");
  const { image } = useImage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => setImageObj(img);
  }, []);

  type textsType = {
    text: string,
    x: number,
    y: number,
    width: number,
    height: number
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height)
    }

    ctx.font = "bold 27px Poppins";
    ctx.letterSpacing = "1px"
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;


    texts.forEach((t) => {
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height)
    }

    ctx.font = "16px Poppins";
    ctx.textAlign = "left";

    draw()

    let startX;
    let startY;
    let offsetX;
    let offsetY;
    let selectedIndex = -1;

    const rect = canvas.getBoundingClientRect()
    offsetX = rect.left + window.scrollX
    offsetY = rect.top + window.scrollY

    function getHittest(x, y, index) {
      let text = texts[index]
      return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
    }

    canvas.addEventListener("mousedown", (e) => {
      e.preventDefault()
      startX = e.clientX - offsetX
      startY = e.clientY - offsetY

      for (let i = 0; i < texts.length; i++) {
        if (getHittest(startX, startY, i)) {
          selectedIndex = i;
        }
      }

    })

    canvas.addEventListener("mouseup", (e) => {
      e.preventDefault()
      selectedIndex = -1;
    })

    canvas.addEventListener("mouseout", (e) => {
      e.preventDefault()
      selectedIndex = -1;
    })

    canvas.addEventListener("mousemove", (e) => {
      if (selectedIndex < 0) return
      e.preventDefault()

      const mouseX = e.clientX - offsetX
      const mouseY = e.clientY - offsetY

      const dx = mouseX - startX
      const dy = mouseY - startY

      startX = mouseX
      startY = mouseY

      let text = texts[selectedIndex]

      text.x += dx
      text.y += dy
      draw()
    })

  }, [texts, imageObj, color])


  function AddText() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const y = texts.length * 20 + 20;

    const value = {
      text: text,
      x: 20,
      y,
      width: ctx.measureText(text).width,
      height: 17
    }

    setTexts(prev => [...prev, value])
    setText("")
  }

  const Download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative min-h-screen bg-gray-200 text-black px-4 sm:px-8 lg:px-20 xl:px-40 py-10 sm:py-20 overflow-hidden">
      <motion.div
        className="absolute -top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 md:w-[300px] md:h-[300px] rounded-full bg-indigo-500 opacity-30 blur-3xl z-0"
        animate={{ x: [0, 100, 0], y: [0, 100, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-[250px] md:h-[250px] rounded-full bg-pink-500 opacity-20 blur-3xl z-0"
        animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-28 sm:w-44 sm:h-44 md:w-[200px] md:h-[200px] rounded-full bg-blue-500 opacity-20 blur-3xl z-0"
        animate={{ y: [0, -60, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      <h2 className="text-3xl md:text-5xl font-semibold font-['Poppins'] text-center mb-5 md:mb-16 z-10 relative">
        Create Your Meme
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-center max-w-6xl mx-auto flex-wrap z-10 relative">
        <div className="flex flex-col gap-7 items-center">
          <MoveLeft
            className="cursor-pointer self-start"
            onClick={() => navigate("/")}
          />
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-lg max-w-full w-[320px] h-[320px] sm:w-[400px] sm:h-[380px]"
          />
        </div>

        <div className="w-full md:max-w-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <input
              type="text"
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="p-2 w-full bg-neutral-700 border border-gray-600 rounded-lg placeholder:text-white text-white focus:outline-none focus:ring-1"
            />
            <button
              className="sm:w-auto sm:px-6 h-11 bg-neutral-700 hover:bg-neutral-800 rounded-lg text-white cursor-pointer"
              onClick={AddText}
            >
              Add
            </button>
          </div>

          <p className="text-sm text-neutral-600">Add your text and place anywhere.</p>

          <div className="flex gap-2 flex-wrap">
            {["white", "black", "red", "green", "blue"].map((clr) => (
              <div
                key={clr}
                className="w-7 h-7 rounded-sm border border-gray-300 cursor-pointer"
                style={{ backgroundColor: clr }}
                onClick={() => setColor(clr)}
              ></div>
            ))}
          </div>

          <button
            onClick={Download}
            className="bg-green-600 hover:bg-green-700 transition text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Download Meme
          </button>
        </div>
      </div>
    </div>

  );
};
