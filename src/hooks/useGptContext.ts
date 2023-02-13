import { useContext } from "react";
import { GptContext } from "../context/gptContext";

export const useGptContext = () => {
  const context = useContext(GptContext);

  if (context === undefined) {
    throw new Error("useGptContext was null");
  }

  return context;
};
