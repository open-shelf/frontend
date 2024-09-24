"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const Shelf3D: React.FC = () => {
  const containerRef = useRef < HTMLDivElement > null;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animations for the white box zoom and move
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
  const whiteBoxY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["0%", "-33.33%"]
  );
  const whiteBoxOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 1]
  );

  // Once the zooming is done, start moving the entire box upwards (after 0.1 scroll progress)
  const whiteBoxScrollY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    ["0%", "-300%"]
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#9c9e9d]"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Header Text */}
        <motion.div
          className="text-4xl font-bold text-white absolute left-8 z-10"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          Welcome to our 3D Shelf
        </motion.div>

        {/* Main White Box */}
        <motion.div
          className="w-[33%] aspect-square bg-white rounded-lg shadow-lg flex flex-col justify-around p-4 relative origin-top"
          style={{
            scale: whiteBoxScale,
            x: whiteBoxX,
            y: whiteBoxY,
            opacity: whiteBoxOpacity,
            rotateY: useTransform(scrollYProgress, [0, 0.1], [20, 0]),
            transformStyle: "preserve-3d",
            perspective: "1000px",
            // This moves the whole box up after zooming is finished
            translateY: whiteBoxScrollY,
          }}
        >
          {[1, 2, 3].map((shelfNumber) => (
            <motion.div
              key={shelfNumber}
              className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center"
              style={{
                top: `${(shelfNumber - 1) * 33.33}%`, // Keeps shelves in place
                height: "33.33%",
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
