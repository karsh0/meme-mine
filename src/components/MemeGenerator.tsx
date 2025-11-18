import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, MoveLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useSelected } from "../../hooks/useSelected";

export const MemeGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fontSize, setFontSize] = useState<string>("27");
  const [texts, setTexts] = useState<textsType[]>([])
  const [text, setText] = useState<string>("");
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<string>("white");
  const { selectedImage, setSelectedImage } = useSelected();
  const uploadRef = useRef<HTMLInputElement | null>(null)
  const [uploadImage, setUploadImage] = useState<string | null>(null)
  const [uploadImageObj, setUploadImageObj] = useState<HTMLImageElement | null>(null)
  const [uploadImagePosition, setUploadImagePosition] = useState({ x: 0, y: 0 });



  useEffect(() => {
  }, [uploadImagePosition])

  useEffect(() => {
    if (!selectedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
    img.onload = () => setImageObj(img);
  }, []);

  const updateUploadObj = (uploadImage: string) => {
    if (!uploadImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = uploadImage;
    img.onload = () => setUploadImageObj(img);
  }

  type textsType = {
    text: string,
    x: number,
    y: number,
    width: number,
    height: number
  }

  useEffect(() => {
    if (!fontSize || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = parseInt(fontSize, 10);
    ctx.font = `bold ${size}px Poppins`;

    const updatedTexts = texts.map((t) => ({
      ...t,
      width: ctx.measureText(t.text).width,
      height: size,
    }));

    setTexts(updatedTexts);
  }, [fontSize]);


  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height)
    }

    if (uploadImageObj) {
      ctx.drawImage(uploadImageObj, uploadImagePosition.x, uploadImagePosition.y, 100, 100);
    }

    const textSize = parseInt(fontSize, 10);


    ctx.font = `bold ${textSize}px Poppins`;
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
    draw()

    let startX;
    let startY;
    let offsetX;
    let offsetY;
    let selectedIndex = -1;
    let isDraggingUploadImage = false;


    const rect = canvas.getBoundingClientRect()
    offsetX = rect.left + window.scrollX
    offsetY = rect.top + window.scrollY

    function getHittest(x: number, y: number, index: number): boolean {
      const text = texts[index];
      const textSize = parseInt(fontSize || "27", 10);

      const left = text.x;
      const right = text.x + text.width;
      const top = text.y - textSize;
      const bottom = text.y;

      return x >= left && x <= right && y >= top && y <= bottom;
    }

    function isOnUploadImage(x: number, y: number): boolean {
  const width = 100;
  const height = 100;

  const left = uploadImagePosition.x;
  const right = uploadImagePosition.x + width;
  const top = uploadImagePosition.y;
  const bottom = uploadImagePosition.y + height;

  return x >= left && x <= right && y >= top && y <= bottom;
}


    canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();

      const mouseX = e.clientX - offsetX;
      const mouseY = e.clientY - offsetY;

      if (isOnUploadImage(mouseX, mouseY)) {
        isDraggingUploadImage = true;
        startX = mouseX;
        startY = mouseY;
      } else {
        for (let i = 0; i < texts.length; i++) {
          if (getHittest(mouseX, mouseY, i)) {
            selectedIndex = i;
            startX = mouseX;
            startY = mouseY;
            break;
          }
        }
      }

    });


    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();

      const touchX = e.touches[0].clientX - offsetX;
      const touchY = e.touches[0].clientY - offsetY;

      selectedIndex = -1;

      for (let i = 0; i < texts.length; i++) {
        if (getHittest(touchX, touchY, i)) {
          selectedIndex = i;
          startX = touchX;
          startY = touchY;
          break;
        }
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();

      if (selectedIndex < 0) return;

      const touchX = e.touches[0].clientX - offsetX;
      const touchY = e.touches[0].clientY - offsetY;

      const dx = touchX - startX;
      const dy = touchY - startY;

      startX = touchX;
      startY = touchY;

      const updated = [...texts];
      updated[selectedIndex].x += dx;
      updated[selectedIndex].y += dy;
      setTexts(updated);
      draw();
    });


    function endDrag() {
      selectedIndex = -1;
      isDraggingUploadImage = false;
    }


    canvas.addEventListener("mouseup", endDrag)

    canvas.addEventListener("mouseout", endDrag)

    function drag(clientX: number, clientY: number) {
      const mouseX = clientX - offsetX;
      const mouseY = clientY - offsetY;

      const dx = mouseX - startX;
      const dy = mouseY - startY;

      startX = mouseX;
      startY = mouseY;

      if (isDraggingUploadImage) {
        setUploadImagePosition((pos) => ({
          x: pos.x + dx,
          y: pos.y + dy,
        }));
      } else if (selectedIndex >= 0) {
        const updated = [...texts];
        updated[selectedIndex].x += dx;
        updated[selectedIndex].y += dy;
        setTexts(updated);
      }

      draw();
    }


    canvas.addEventListener("mousemove", (e) => {
      e.preventDefault()
      drag(e.clientX, e.clientY)
      draw()
    })



  }, [texts, imageObj, color, fontSize, uploadImageObj, uploadImagePosition])


  function AddText() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = parseInt(fontSize || "27", 10);
    ctx.font = `bold ${size}px Poppins`;

    const value = {
      text: text,
      x: 120,
      y: texts.length * 30 + 35,
      width: ctx.measureText(text).width,
      height: size,
    };

    setTexts(prev => [...prev, value]);
    setText("");
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
    <div className="relative text-black px-4 sm:px-8 lg:px-20 xl:px-40 py-10 sm:py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-center max-w-6xl mx-auto flex-wrap z-10 relative">
        <div className="flex flex-col gap-7 items-center">
          <motion.div
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer self-start"
          >
            <MoveLeft
              onClick={() => setSelectedImage("")}
            />
          </motion.div>
          <canvas
            ref={canvasRef}
            className="max-w-full w-[320px] h-[320px] sm:w-[400px] sm:h-[380px]"
          />
        </div>

        <div className="w-full md:max-w-sm flex flex-col gap-4">
          <div 
            className="text-white bg-neutral-700 rounded-md w-fit p-2 text-sm cursor-pointer flex gap-1"
            onClick={() => uploadRef.current?.click()}>
              <ImageIcon className="w-5 h-5"/>
            Upload image
            <input type="file" ref={uploadRef} className="hidden" onChange={(e) => {
              const selectedFile = e.target.files;

              if (!selectedFile) {
                return
              }
              const reader = new FileReader();

              reader.onload = () => {
                const base64 = reader.result as string;
                setUploadImage(base64);
                updateUploadObj(base64)
              };

              reader.readAsDataURL(selectedFile[0]);
            }} />
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <input
              type="text"
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="p-2 w-full bg-neutral-800 border border-gray-600 rounded-md placeholder:text-white text-white focus:outline-none focus:ring-1"
            />
            <button
              className="p-2 w-fit bg-neutral-800 rounded-md text-white cursor-pointer"
              onClick={AddText}
            >
              <Plus />
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

          <div className="w-full">
            <input type="range" className="w-full" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
          </div>

          <div className="w-full flex gap-4">
            <button
            onClick={Download}
            className="w-full bg-green-700 hover:bg-green-800 transition text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Download
          </button>
          <button
            className="w-full transition text-black text-sm border py-2 px-4 rounded-lg cursor-pointer"
          >
            Copy
          </button>
          </div>
        </div>
      </div>
    </div>

  );
};
