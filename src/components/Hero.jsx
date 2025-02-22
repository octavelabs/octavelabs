import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroImg from "./../assets/heroImg.png";
import FullLogo from "./../assets/logoF.svg";
import Ellipse1 from "./../assets/ellipse1.svg";
import Ellipse2 from "./../assets/ellipse2.svg";

const Hero = () => {
  const fullText = ["Designing Bold Ideas,", "Building the Future."];
  const [displayedText, setDisplayedText] = useState(["", ""]);
  const [index, setIndex] = useState(0);
  const [line, setLine] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (line < fullText.length) {
      if (index < fullText[line].length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const newText = [...prev];
            newText[line] += fullText[line][index];
            return newText;
          });
          setIndex(index + 1);
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        if (line === fullText.length - 1) {
          setTimeout(() => setAnimationComplete(true), 500);
        }
        setLine(line + 1);
        setIndex(0);
      }
    }
  }, [index, line]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 bg-primary-bg text-white">
      {/* Navbar */}
      <motion.div
        className="absolute top-6 lg:top-24 left-0 right-0"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="container mx-auto flex justify-between items-center px-6 lg:px-12 relative"
          style={{
            backgroundImage: `url(${Ellipse1})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            backgroundSize: "400px",
          }}
        >
          <div className="w-40">
            <img src={FullLogo} alt="Octave Labs Logo" className="w-full" />
          </div>

          <motion.button
            className="px-4 sm:px-8 py-2.5 lg:py-3.5 text-[#0E0F10] rounded-2xl shadow-md transition cursor-pointer"
            style={{
              background:
                "linear-gradient(177.74deg, #DEDEFF -29.85%, #E9E9E9 61.42%)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Book a call
          </motion.button>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between mt-32 gap-12 px-6">
        {/* Text Content */}
        <motion.div
          className="max-w-3xl text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1
            className="text-4xl font-bold md:text-6xl lg:text-[70px] leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90.2deg, #E0E0E0 -5.02%, #898989 84.65%, #757575 212.07%)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "inline-block",
            }}
          >
            {displayedText[0]}
            <br />
            {displayedText[1]}
            {!animationComplete && (
              <span className="text-white animate-blink">|</span>
            )}
          </h1>

          <p className="mt-4 text-lg lg:text-2xl text-gray">
            We are a team of professionals and entrepreneurs who create
            innovative solutions. We help businesses grow and turn ideas into
            successful ventures.
          </p>
        </motion.div>

        {/* Hero Image Container */}
        <motion.div
          className="relative w-full max-w-md lg:max-w-lg mb-10 lg:mb-0 flex justify-end lg:justify-center"
          style={{
            backgroundImage: `url(${Ellipse2})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "200%",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <img
            src={HeroImg}
            alt="Hero"
            className="relative w-full sm:w-3/5 lg:w-4/5 h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
