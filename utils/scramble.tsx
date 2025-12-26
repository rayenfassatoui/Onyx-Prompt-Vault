import React, { useEffect, useState, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface ScrambleTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, speed = 15, className }) => {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<number | null>(null);
  const targetTextRef = useRef(text);

  useEffect(() => {
    targetTextRef.current = text;
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplay((prev) => {
        const next = text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        
        if (iteration >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        
        // Increase step size for faster completion
        iteration += 1; 
        return next;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return <span className={className}>{display}</span>;
};