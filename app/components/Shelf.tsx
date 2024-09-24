import React from "react";
import { motion, MotionValue } from "framer-motion";

interface ShelfProps {
  children: React.ReactNode;
  scale: MotionValue<number>;
  translateY: MotionValue<string>;
  bgColor: string;
  position: string;
  height: string; // New prop
}

const Shelf: React.FC<ShelfProps> = ({
  children,
  scale,
  translateY,
  bgColor,
  position,
  height, // New prop
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${bgColor} rounded flex items-center justify-center overflow-hidden p-4`}
      style={{
        top: position,
        height: height, // Use the new height prop
        scale,
        translateY,
        boxShadow:
          "inset 0 0 0 2px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1)",
        perspective: "1000px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-10"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 3D shelf bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "20px",
            background: `linear-gradient(to bottom, ${bgColor}, rgba(0,0,0,0.3))`,
            transform: "rotateX(60deg)",
            transformOrigin: "bottom",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          }}
        ></div>
        {/* Children (objects on the shelf) */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default Shelf;
