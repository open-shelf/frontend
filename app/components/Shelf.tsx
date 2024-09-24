import React from "react";
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
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 3D shelf bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "20px",
            background: "white",
            transform: "rotateX(60deg)",
            transformOrigin: "bottom",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            borderRadius: "10px", // Added rounded corners
            overflow: "hidden", // Ensure the content doesn't overflow the rounded corners
          }}
        ></div>
        {/* Children (objects on the shelf) */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default Shelf;
