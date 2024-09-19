import "./App.css";
import Footer from "./features/Footer";
import HeroSection from "./features/HeroSection";
import ExclusiveOffers from "./features/ExclusiveOffers";
import Summary from "./features/Summary";
import Advantages from "./features/Advantages";
import Download from "./features/Download";
import Testimonials from "./features/Testimonials";
import Process from "./features/Process";
import Divider from "./ui/Dividerr";
import "./b2bRespo.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Products from "../ProductPage/Products"
import Popupp from "../launchPopup/Popupp";
import Feedback from "./features/feedback"
function App() {
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  if (!localStorage.getItem("userEmail")) {
    localStorage.setItem("loginstate", "false");
    localStorage.setItem("ispayment", "false");
  }
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };


  return (
    <div className="App">
      <Popupp style={{fontSize:"120%"}}
        onLocationChange={handleLocationChange}
        setSelectedLocation={setSelectedLocation}
      />
      <div className="b2b-landingPage">
        <HeroSection />
        <Divider />
        {/* <ExclusiveOffers /> */}
        <Products />
        <Divider />
        <Process />
        {/* <Divider /> */}
        <Summary />
        <Advantages />
        {/* <Divider /> */}
        <Feedback />
        <Download />
        {/* <Divider /> */}
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}

export default App;
