import { useEffect, useRef, useState } from "react";
import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useSelected } from "../../hooks/useSelected";
import { TextEditor } from "./TextEditor";

export type TextsType = {
  text: string
  x: number
  y: number
  width: number
  height: number
  size: number
  weight: string
  color: string
  outline: string
  textCase: string
}

export const MemeGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [texts, setTexts] = useState<TextsType[]>([]);
  const [text, setText] = useState<string>("");
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const { selectedImage, setSelectedImage } = useSelected();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const draggingIndexRef = useRef<number>(-1);
  const isDraggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const [editorStyle, setEditorStyle] = useState({
    color: "#FFFFFF",
    outlineColor: "#000000",
    fontSize: "40",
    fontWeight: "800",
    textCase: "uppercase",
  });

  useEffect(() => {
    if (!selectedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
    img.onload = () => setImageObj(img);
  }, [selectedImage]);

  // Update selected text when editor style changes
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < texts.length) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = parseInt(editorStyle.fontSize || "40", 10);
      ctx.font = `${editorStyle.fontWeight} ${size}px Poppins`;

      setTexts(prev => {
        if (selectedIndex < 0 || selectedIndex >= prev.length) return prev;

        const updated = [...prev];
        const item = updated[selectedIndex];
        if (!item) return prev;

        updated[selectedIndex] = {
          ...item,
          size,
          weight: editorStyle.fontWeight,
          color: editorStyle.color,
          outline: editorStyle.outlineColor,
          textCase: editorStyle.textCase,
          width: ctx.measureText(item.text).width,
          height: size,
        };

        return updated;
      });

    }
  }, [editorStyle, selectedIndex]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imageObj) {
      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    }

    texts.forEach((t, idx) => {
      ctx.font = `${t.weight} ${t.size}px Poppins`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = t.outline;
      ctx.fillStyle = t.color;

      const content =
        t.textCase === "uppercase"
          ? t.text.toUpperCase()
          : t.text.toLowerCase();

      ctx.strokeText(content, t.x, t.y);
      ctx.fillText(content, t.x, t.y);

      // Draw selection indicator
      if (idx === selectedIndex) {
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = 1;
        ctx.strokeRect(t.x, t.y - t.size, t.width + 21, t.size);
      }
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    draw();

    const rect = canvas.getBoundingClientRect();
    const offsetX = rect.left + window.scrollX;
    const offsetY = rect.top + window.scrollY;

    function getOffset() {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      };
    }

    function getHittest(x: number, y: number, index: number): boolean {
      const t = texts[index];
      if (!t) return false;

      const left = t.x;
      const right = t.x + t.width;
      const top = t.y - t.size;
      const bottom = t.y;

      return x >= left && x <= right && y >= top && y <= bottom;
    }

    function handleMouseDown(e: MouseEvent) {
      e.preventDefault();

      const mouseX = e.clientX - offsetX;
      const mouseY = e.clientY - offsetY;

      let found = false;
      for (let i = texts.length - 1; i >= 0; i--) {
        if (getHittest(mouseX, mouseY, i)) {
          draggingIndexRef.current = i;
          setSelectedIndex(i);
          isDraggingRef.current = true;
          startRef.current = { x: mouseX, y: mouseY };
          found = true;

          // Update editor style to match selected text
          const selectedText = texts[i];
          if (!selectedText) return;
          setEditorStyle({
            color: selectedText.color,
            outlineColor: selectedText.outline,
            fontSize: selectedText.size.toString(),
            fontWeight: selectedText.weight,
            textCase: selectedText.textCase,
          });
          break;
        }
      }

      if (!found) {
        setSelectedIndex(-1);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      e.preventDefault();

      if (!isDraggingRef.current) return;

      const idx = draggingIndexRef.current;
      if (idx < 0) return;

      const mouseX = e.clientX - offsetX;
      const mouseY = e.clientY - offsetY;

      const dx = mouseX - startRef.current.x;
      const dy = mouseY - startRef.current.y;

      startRef.current = { x: mouseX, y: mouseY };

      setTexts(prev => {
        if (idx < 0 || idx >= prev.length) return prev;

        const updated = [...prev];
        const item = updated[idx];

        if (!item) return prev;

        updated[idx] = {
          ...item,
          x: item.x + dx,
          y: item.y + dy,
        };

        return updated;
      });

    }
    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      const offset = getOffset();
      const touchX = touch.clientX - offset.x;
      const touchY = touch.clientY + 10 - offset.y;

      let found = false;
      for (let i = texts.length - 1; i >= 0; i--) {
        if (getHittest(touchX, touchY, i)) {
          draggingIndexRef.current = i;
          setSelectedIndex(i);
          isDraggingRef.current = true;
          startRef.current = { x: touchX, y: touchY };
          found = true;

          // Update editor style to match selected text
          const selectedText = texts[i];
          if (!selectedText) return;
          setEditorStyle({
            color: selectedText.color,
            outlineColor: selectedText.outline,
            fontSize: selectedText.size.toString(),
            fontWeight: selectedText.weight,
            textCase: selectedText.textCase,
          });
          break;
        }
      }

      if (!found) {
        setSelectedIndex(-1);
      }
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();

      if (!isDraggingRef.current) return;

      const idx = draggingIndexRef.current;
      if (idx < 0) return;

      const touch = e.touches[0];
      if (!touch) return;

      const offset = getOffset();
      const touchX = touch.clientX - offset.x;
      const touchY = touch.clientY - offset.y;

      const dx = touchX - startRef.current.x;
      const dy = touchY - startRef.current.y;

      startRef.current = { x: touchX, y: touchY };

      setTexts(prev => {
        if (idx < 0 || idx >= prev.length) return prev;

        const updated = [...prev];
        const item = updated[idx];
        if (!item) return prev;

        updated[idx] = {
          ...item,
          x: item.x + dx,
          y: item.y + dy,
        };

        return updated;
      });

    }

    function endDrag() {
      isDraggingRef.current = false;
      draggingIndexRef.current = -1;
    }

    // Add mouse event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", endDrag);
    canvas.addEventListener("mouseleave", endDrag);

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", endDrag);
    canvas.addEventListener("touchcancel", endDrag);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", endDrag);
      canvas.removeEventListener("mouseleave", endDrag);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", endDrag);
      canvas.removeEventListener("touchcancel", endDrag);
    };
  }, [texts, imageObj]);

  function AddText() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!text.trim()) return;

    const size = parseInt(editorStyle.fontSize || "40", 10);
    ctx.font = `${editorStyle.fontWeight} ${size}px Poppins`;

    const value: TextsType = {
      text: text,
      x: 150,
      y: 200,
      width: ctx.measureText(text).width,
      height: size,
      size,
      weight: editorStyle.fontWeight,
      color: editorStyle.color,
      outline: editorStyle.outlineColor,
      textCase: editorStyle.textCase,
    };

    setTexts((prev) => [...prev, value]);
    setText("");
    setSelectedIndex(texts.length);
  }

  const Download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  const CopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          alert("Copied to clipboard!");
        }
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const DeleteSelected = () => {
    if (selectedIndex >= 0) {
      setTexts((prev) => prev.filter((_, idx) => idx !== selectedIndex));
      setSelectedIndex(-1);
    }
  };
  return (
    <div className="flex text-black px-4 py-2 md:py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-center max-w-8xl mx-auto flex-wrap z-10 relative">
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
            className="max-w-full"
          />
        </div>

        <div className="w-full md:max-w-lg flex flex-col gap-4">
          {/* <div 
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
          </div> */}
          {/* <div className="">
            <button
              className="py-2
            px-4
          bg-neutral-600
            rounded-md
            text-white
            cursor-pointer
            text-sm
            flex
            gap-2
            justify-between
            items-center
          "

          onClick={handleAddText}
            >
              <Plus className="w-4"/>
              Add Text
            </button>
          </div> */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between gap-2">
              <TextEditor
                editorStyle={editorStyle}
                setEditorStyle={setEditorStyle}
              />

              <input
                type="text"
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="
                p-2
                w-full
                sm:flex-1
              bg-neutral-800
                border border-gray-600
                rounded-md
              placeholder:text-white
              text-white
                focus:outline-none
                focus:ring-1
              "
              />

              <button
                className="py-2
                px-4
            md:px-4
            w-fit
            sm:w-auto
          bg-neutral-800
            rounded-md
            text-white
            cursor-pointer
          "
                onClick={AddText}
              >
                Add
              </button>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <button
              onClick={Download}
              className="w-full bg-green-700 hover:bg-green-800 transition text-white py-2 px-4 rounded-lg cursor-pointer"
            >
              Download
            </button>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 transition text-white text-sm border py-2 px-4 rounded-lg cursor-pointer"
              onClick={CopyToClipboard}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};
