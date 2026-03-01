import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;       // typing speed in ms
  loop?: boolean;
  className?: string;
};

export default function Typewriter({
  text,
  speed = 30,
  loop = false,
  className = "",
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    if (loop) {
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 1500);

      return () => clearTimeout(resetTimeout);
    }
  }, [index, text, speed, loop]);

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  return (
    <span className={`whitespace-pre-wrap  ${className}`}>
      {displayedText}
      
    </span>
  );
}