import React from "react";
import ServiceSection from "./ServiceSection";
import Services3 from "./../assets/services3.png";
import Services4 from "./../assets/services4.png";

const servicesData = [
  {
    id: 1,
    title: "Product and Web Development",
    description:
      "Robust engineering expertise and professionals to turn prototypes into scalable, high-performing products.",
    image: Services3,
  },
  {
    id: 2,
    title: "Design Systems",
    description:
      "Custom web solutions built for performance, scalability, and seamless user experiences.",
    image: Services4,
  },
];

const MoreServices = () => {
  return (
    <ServiceSection
      title="Explore and Scale with a dedicated team"
      description="Collaborate with us to turn bold ideas into impactful ventures—through strategic design, agile development, and hands-on support, we help you build, launch, and scale with confidence."
      services={servicesData}
    />
  );
};

export default MoreServices;
