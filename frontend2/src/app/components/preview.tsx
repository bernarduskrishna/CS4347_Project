import React, { useEffect, useRef } from 'react';
import abcjs from "abcjs";

interface ABCNotationProps {
  abcString: string;
}

const ABCMusicPreview: React.FC<ABCNotationProps> = ({ abcString }) => {
  const abcRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (abcRef.current) {
      abcjs.renderAbc(abcRef.current, abcString);
    }
  }, [abcString]);

  return <div ref={abcRef}></div>;
};

export default ABCMusicPreview;