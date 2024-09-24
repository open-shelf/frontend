import React from "react";
import { motion, MotionValue } from "framer-motion";

interface ShelfProps {
  children: React.ReactNode;
  scale: MotionValue<number>;
  translateY: MotionValue<string>;
  bgColor: string;
  position: string;
}

const Shelf: React.FC<ShelfProps> = ({
  children,
  scale,
  translateY,
  bgColor,
  position,
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${bgColor} rounded flex items-center justify-center overflow-hidden p-4`}
      style={{
        top: position,
        height: "50%",
        scale,
        translateY,
        boxShadow:
          "inset 0 0 0 2px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-10"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export default Shelf;
