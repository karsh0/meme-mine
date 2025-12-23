
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";

export type TextsType = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  weight: string;
  color: string;
  outline: string;
  textCase: string;
};


export function TextEditor({
  editorStyle,
  setEditorStyle,
}: {
  editorStyle: any;
  setEditorStyle: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-fit p-2 bg-neutral-800 rounded-md text-white">
          <Settings />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 px-2 py-3" side="left"
    align="end">
        <DropdownMenuLabel>
          Default settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup className="text-sm space-y-3">
          <div>
            <p>Font size</p>
            <input
              type="range"
              className="w-full"
              min="10"
              max="100"
              value={editorStyle.fontSize}
              onChange={(e) =>
                setEditorStyle((prev: any) => ({
                  ...prev,
                  fontSize: e.target.value,
                }))
              }
            />
            <span className="text-xs text-muted-foreground">{editorStyle.fontSize}px</span>
          </div>

          <div>
            <span>Font weight</span>
            <Select
              value={editorStyle.fontWeight}
              onValueChange={(v) =>
                setEditorStyle((prev: any) => ({
                  ...prev,
                  fontWeight: v,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="100">Thin</SelectItem>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Normal</SelectItem>
                  <SelectItem value="600">Bold</SelectItem>
                  <SelectItem value="800">Extra Bold</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p>Text color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={editorStyle.color}
                onChange={(e) =>
                  setEditorStyle((prev: any) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
                className="w-7 h-7 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {editorStyle.color.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <span>Text case</span>
            <Select
              value={editorStyle.textCase}
              onValueChange={(v) =>
                setEditorStyle((prev: any) => ({
                  ...prev,
                  textCase: v,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="uppercase">UPPERCASE</SelectItem>
                  <SelectItem value="lowercase">LOWERCASE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p>Outline color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={editorStyle.outlineColor}
                onChange={(e) =>
                  setEditorStyle((prev: any) => ({
                    ...prev,
                    outlineColor: e.target.value,
                  }))
                }
                className="w-7 h-7 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {editorStyle.outlineColor.toUpperCase()}
              </span>
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}