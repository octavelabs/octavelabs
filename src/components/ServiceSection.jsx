import React from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "./../utils/motion";

const ServiceSection = ({ title, description, services }) => {
  return (
    <motion.section
      className="bg-primary-bg text-white px-6 md:px-12 py-16"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-6xl max-w-2xl font-bold leading-tight"
            style={{
              background:
                "linear-gradient(90.2deg, #E0E0E0 -5.02%, #898989 84.65%, #757575 212.07%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {title}
          </h2>
          <p className="mt-4 lg:mt-0 text-lg text-gray max-w-lg">
            {description}
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-black bg-opacity-50 rounded-lg backdrop-filter backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-auto rounded-lg mb-4"
              />

              {/* Text */}
              <div className="p-6 md:p-8 lg:p-12">
                <h3
                  className="text-3xl font-medium bg-clip-text text-transparent"
                  style={{
                    background:
                      "linear-gradient(90.2deg, #E0E0E0 -5.02%, #898989 84.65%, #757575 212.07%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  }}
                >
                  {service.title}
                </h3>
                <p className="text-gray text-lg mt-2">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServiceSection;
