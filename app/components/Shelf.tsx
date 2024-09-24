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
      className={`absolute inset-0 ${bgColor} rounded flex items-center justify-center`}
      style={{
        top: position,
        height: "33.33%",
        scale,
        translateY,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Shelf;
