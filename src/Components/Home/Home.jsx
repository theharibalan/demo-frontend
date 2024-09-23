import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import LocationOffersSlider from "./LocationOffersSlider";
import Products from "../ProductPage/Products";
import trade from "../../assets/startTrading.jpeg";
import CustomerReviews from "../PageComponents/Reviews";
import Popupp from "../launchPopup/Popupp";
import NavBar from "../PageComponents/Navbar";
import GoogleTag from "../GoogleTag";


export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  if (!localStorage.getItem("userEmail")) {
    localStorage.setItem("loginstate", "false");
    localStorage.setItem("ispayment", "false");
  }
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleImageClick = () => {
    navigate("/reg");
  };

  return (
    <div>
      <GoogleTag/>
      {/* <NavBar/> */}
      {localStorage.getItem('loggedas')?"":(<>
        <Popupp
        onLocationChange={handleLocationChange}
        setSelectedLocation={setSelectedLocation}
      /></>)}
      <LocationOffersSlider onLocationChange={handleLocationChange} />
      <Products location={selectedLocation} />
      <img
        className="reg-image-container"
        src={trade}
        alt="Start Trading"
        width={"60%"}
        onClick={handleImageClick} // Add click handler to the image
        style={{ cursor: "pointer" }} // Change cursor to pointer on hover
      />
      <br />
      <button
        onClick={handleImageClick}
        style={{
          backgroundColor: "#55B67E",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
          marginBottom: "6vh",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#44915f")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#55B67E")}
      >
        Register
      </button>{" "}
      <br />
      <br />
      {/* <CustomerReviews /> */}
      {/* Add Register button */}
    </div>
  );
}
