"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Shelf from "./Shelf";
import BookShelf from "./BookShelf"; // Importing BookShelf component
import VinylShelf from "./VinylShelf"; // Importing VinylShelf component
import ConsoleShelf from "./ConsoleShelf"; // Importing ConsoleShelf component

const Shelf3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Scroll the whole white box upwards after zooming is done
  const whiteBoxScrollY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0.1, 1],
    ["0%", "-300%"]
  );

  // Create scale transformations for each shelf
  const shelf1Scale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    [1, 0.9]
  ); // Shelf 1 zooms in
  const shelf2Scale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.3, 0.6],
    [1, 0.9]
  ); // Shelf 2 zooms in
  const shelf3Scale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.6, 1],
    [1, 0.9]
  ); // Shelf 3 zooms in

  const shelf1TranslateY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    ["0%", "-5%"]
  );
  const shelf2TranslateY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0.3, 0.6],
    ["0%", "-5%"]
  );
  const shelf3TranslateY: MotionValue<string> = useTransform(
    scrollYProgress,
    [0.6, 1],
    ["0%", "-5%"]
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
          className="text-6xl font-extrabold text-white absolute z-10"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
            left: "15%",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          OpenShelf
          <div className="text-2xl font-bold">
            Do what you like, Stake what you love!
          </div>
        </motion.div>

        {/* Main White Box */}
        <motion.div
          className="w-[33%] aspect-square bg-white rounded-lg shadow-lg flex flex-col justify-around p-4 relative origin-top"
          style={{
            scale: whiteBoxScale,
            x: whiteBoxX,
            y: whiteBoxY,
            opacity: whiteBoxOpacity,
            rotateY: useTransform(scrollYProgress, [0, 0.5], [20, 0]),
            transformStyle: "preserve-3d",
            perspective: "1000px",
            translateY: whiteBoxScrollY,
          }}
        >
          {/* Shelf 1 */}
          <Shelf
            scale={shelf1Scale}
            translateY={shelf1TranslateY}
            bgColor="bg-gray-100"
            position="0%"
          >
            <BookShelf /> {/* Custom BookShelf component */}
          </Shelf>

          {/* Shelf 2 */}
          <Shelf
            scale={shelf2Scale}
            translateY={shelf2TranslateY}
            bgColor="bg-gray-200"
            position="33.33%"
          >
            <VinylShelf /> {/* Custom VinylShelf component */}
          </Shelf>

          {/* Shelf 3 */}
          <Shelf
            scale={shelf3Scale}
            translateY={shelf3TranslateY}
            bgColor="bg-gray-300"
            position="66.66%"
          >
            <ConsoleShelf /> {/* Custom ConsoleShelf component */}
          </Shelf>
        </motion.div>
      </div>
    </div>
  );
};

export default Shelf3D;
