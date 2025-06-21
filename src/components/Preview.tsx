import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface PreviewProps {
  jsonData: object | null;
}

const Preview: React.FC<PreviewProps> = ({ jsonData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && jsonData) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: jsonData,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [jsonData]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Preview;
