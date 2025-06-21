import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface PreviewProps {
  lottieData: object | null;
}

const Preview: React.FC<PreviewProps> = ({ lottieData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && lottieData) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottieData,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [lottieData]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Preview;
