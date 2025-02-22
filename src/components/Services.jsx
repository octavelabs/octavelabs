import React from "react";
import ServiceSection from "./ServiceSection";
import Services1 from "./../assets/services1.png";
import Services2 from "./../assets/services2.png";

const servicesData = [
  {
    id: 1,
    title: "Product and Web Design",
    description:
      "User-centered design that transforms your ideas into engaging, market-ready experiences.",
    image: Services1,
  },
  {
    id: 2,
    title: "Brand Design",
    description:
      "User-centered design that transforms your ideas into engaging, market-ready experiences.",
    image: Services2,
  },
];

const Services = () => {
  return (
    <ServiceSection
      title="Have an idea? Let us work together"
      description="We craft world-class digital products, brand identities, and scalable solutions for forward-thinking businesses. As a venture studio, we identify challenges, incubate ideas, and help you build."
      services={servicesData}
    />
  );
};

export default Services;
