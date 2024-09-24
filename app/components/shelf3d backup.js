"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const Shelf3D: React.FC = () => {
  const containerRef = useRef < HTMLDivElement > null;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const whiteBoxScale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 3]
  );
  const whiteBoxX: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["50%", "0%"]
  );
  const whiteBoxOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 1]
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#9c9e9d]"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-4xl font-bold text-white absolute left-8 z-10"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          Welcome to our 3D Shelf
        </motion.div>
        <motion.div
          className="w-[33%] aspect-square bg-white rounded-lg shadow-lg flex flex-col justify-around p-4 relative"
          style={{
            scale: whiteBoxScale,
            x: whiteBoxX,
            opacity: whiteBoxOpacity,
            rotateY: useTransform(scrollYProgress, [0, 0.1], [20, 0]),
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {[1, 2, 3].map((shelfNumber) => (
            <motion.div
              key={shelfNumber}
              className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [
                    0.33 * (shelfNumber - 1),
                    0.33 * shelfNumber - 0.05,
                    0.33 * shelfNumber,
                    0.33 * shelfNumber + 0.05,
                    0.33 * (shelfNumber + 1),
                  ],
                  [0.3, 0.3, 1, 0.3, 0.3]
                ),
              }}
            >
              <motion.span
                className="text-4xl font-bold text-gray-600"
                style={{
                  scale: useTransform(
                    scrollYProgress,
                    [0, 1],
                    [1 / whiteBoxScale.get(), 1 / whiteBoxScale.get()]
                  ),
                }}
              >
                Shelf {shelfNumber}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Shelf3D;
