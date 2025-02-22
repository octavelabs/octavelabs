import React from "react";
import { motion } from "framer-motion";
import LogoLarge from "./../assets/logoLarge.png";

const Footer = () => {
  return (
    <motion.footer className="bg-primary-bg text-white">
      {/* CTA Section */}
      <motion.div
        className="py-40 px-6 md:px-12 text-center md:text-left"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left Text */}
          <motion.h2
            className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent lg:max-w-3xl"
            style={{
              background:
                "linear-gradient(90.2deg, #E0E0E0 -5.02%, #898989 84.65%, #757575 212.07%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Building from scratch can be difficult, let’s help you
          </motion.h2>

          {/* Right Side */}
          <motion.div
            className="mt-6 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-gray text-lg mb-4 lg:max-w-md">
              *Warning: Collaborating with Octave Labs may lead to game-changing
              results. Think big!*
            </p>
            <motion.button
              className="px-4 sm:px-8 py-2.5 lg:py-3.5 text-[#0E0F10] rounded-2xl shadow-md transition cursor-pointer"
              style={{
                background:
                  "linear-gradient(177.74deg, #DEDEFF -29.85%, #E9E9E9 61.42%)",
                transition: "all 0.3s ease-in-out",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book an intro call
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        className="py-12 px-6 md:px-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
          {/* Left Side - Description */}
          <motion.p
            className="text-gray text-lg max-w-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Turn bold ideas into impactful solutions with Octave Labs. Let’s
            help you stand out, scale, outpace the competition, and create
            impactful solutions.
          </motion.p>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg text-gray mb-2">Contact us</h4>
            <ul className="space-y-1 text-2xl">
              <li>
                <a
                  href="mailto:hello@octavelabs.io"
                  className="hover:text-white"
                >
                  Send a mail
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Book a call
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg text-gray mb-2">Follow us</h4>
            <ul className="space-y-1 text-2xl">
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Logo */}
        <motion.div
          className="mt-32 container mx-auto flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <img src={LogoLarge} alt="Octave Logo" className="lg:w-[200%]" />
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
