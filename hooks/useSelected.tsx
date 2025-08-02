import { useContext } from "react";
import { ImageContextType, SelectedContext } from "../src/context/SelectedContext";

export const useSelected = (): ImageContextType => {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error("useSelected must be used within an SelectedProvider");
  }
  return context;
};
