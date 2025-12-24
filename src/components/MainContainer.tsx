import { useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { CircleArrowOutDownRight, Upload } from "lucide-react";
import { templates } from "../../data/templates";
import { useSelected } from "../../hooks/useSelected";
import type { Template } from "types/template";
export const MainContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredImages, setFilteredImages] = useState<Template[] | []>([]);
    const customRef = useRef<HTMLInputElement | null>(null)
    const [customFile, setCustomFile] = useState()
    const { selectedImage, setSelectedImage } = useSelected()


    useEffect(() => {
        const filtered = Object.entries(templates)
            .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(([key, value]) => ({
                title: key,
                image: value.image,
            }));

        setFilteredImages(filtered);
    }, [searchQuery]);


    return <main className="max-w-6xl mx-auto px-3 py-5 md:py-16">
        <section className="text-center px-6 py-16 md:py-20">
            <div className="text-4xl md:text-7xl font-['poppins'] font-extrabold md:font-bold tracking-tight leading-[1.1] text-center">
                <span className="">Generate Memes in</span>
                <br />
                <span className="text-indigo-500">Seconds</span>
            </div>

            <p className="mt-2 md:mt-6 text-sm md:text-lg text-gray-600 max-w-xl mx-auto">
                It’s time to create and share your humor with the world.
            </p>

            <div className="relative max-w-lg mt-8 mx-auto">
                <input
                    type="text"
                    placeholder="Search template"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 px-5 py-2 md:py-3 bg-zinc-900 text-white placeholder:text-gray-400 border border-zinc-700 rounded-full"
                />
                <CircleArrowOutDownRight
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    size={20}
                />
            </div>
        </section>
        <div className="bg-neutral-700 text-white text-xs md:text-sm font-semibold w-fit rounded-sm md:rounded-lg p-2 md:px-3 md:py-2 flex gap-2 mb-2 items-center cursor-pointer"

            onClick={() => {
                customRef.current?.click()
            }}

        >
            <Upload className="w-3 h-3 md:w-5 md:h-5" />
            Use custom template
            <input type="file" ref={customRef} className="hidden" onChange={(e) => {
                const selectedFile = e.target.files;

                if (!selectedFile) {
                    return
                }
                const reader = new FileReader();

                reader.onload = () => {
                    const base64 = reader.result as string;
                    setSelectedImage(base64);
                };

                reader.readAsDataURL(selectedFile[0]!);
            }} />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4">
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
}