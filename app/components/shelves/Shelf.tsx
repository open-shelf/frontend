import React, { useRef, useEffect, useState } from "react";
import { motion, MotionValue } from "framer-motion";

interface ShelfProps {
  children: React.ReactNode;
  scale: MotionValue<number>;
  translateY: MotionValue<string>;
  position: string;
  height: string;
}

const Shelf: React.FC<ShelfProps> = ({
  children,
  scale,
  translateY,
  position,
  height,
}) => {
  const [contentScale, setContentScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeContent = () => {
      if (contentRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = Array.from(contentRef.current.children).reduce(
          (total, child) => total + (child as HTMLElement).offsetWidth,
          0
        );

        // Add some padding to ensure objects don't touch the edges
        const scaleFactor = (containerWidth - 20) / contentWidth;

        // Limit the minimum scale to avoid making objects too small
        const minScale = 0.5;
        const newScale = Math.max(minScale, Math.min(1, scaleFactor));

        setContentScale(newScale);
      }
    };

    resizeContent();
    window.addEventListener("resize", resizeContent);
    return () => window.removeEventListener("resize", resizeContent);
  }, [children]);

  return (
    <motion.div
      className="absolute inset-0 rounded flex items-center justify-center overflow-hidden p-4"
      style={{
        top: position,
        height: height,
        scale,
        translateY,
        perspective: "1000px",
      }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 3D shelf bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "20px",
            background: "white",
            transform: "rotateX(60deg)",
            transformOrigin: "bottom",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        ></div>
        {/* Children (objects on the shelf) */}
        <div
          ref={contentRef}
          className="relative z-10 w-full flex items-center justify-center"
          style={{ transform: `scale(${contentScale})` }}
        >
          <div className="flex flex-nowrap items-center justify-center w-full">
            {React.Children.map(children, (child) => (
              <div className="flex-shrink-0 mx-2">{child}</div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Shelf;
