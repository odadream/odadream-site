import { useState, useEffect } from "react";

type ImageState = "initial" | "dead";

/**
 * Keep a failed real asset failed. A missing photograph must never be hidden
 * by a generated Lotus tile: the UI can show its explicit No Signal state and
 * the content audit can report the missing source.
 */
export const useImageFallback = (originalUrl?: string, nodeId?: string) => {
  const [imageState, setImageState] = useState<ImageState>("initial");
  const [activeSrc, setActiveSrc] = useState<string | undefined>(originalUrl);

  useEffect(() => {
    setImageState("initial");
    setActiveSrc(originalUrl);
  }, [originalUrl, nodeId]);

  return {
    src: activeSrc,
    state: imageState,
    handleError: () => setImageState("dead"),
    isDead: imageState === "dead",
  };
};
