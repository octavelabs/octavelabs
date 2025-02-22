import React from "react";
import Hero from "./components/Hero";
import Services from "./components/Services";
import MoreServices from "./components/MoreServices";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Hero />
      <Services />
      <MoreServices />
      <Footer />
    </div>
  );
};

export default App;
