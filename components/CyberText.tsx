import React, { useState, useEffect } from 'react';

interface CyberTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  triggerKey?: string | number; // Change this to restart animation
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export const CyberText: React.FC<CyberTextProps> = ({ 
    text, 
    as: Tag = 'span', 
    className = '', 
    triggerKey 
}) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2; // Speed control
    }, 30);

    return () => clearInterval(interval);
  }, [text, triggerKey]);

  return <Tag className={className}>{displayText}</Tag>;
};