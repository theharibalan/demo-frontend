import React, { useState } from "react";
import "./MembershipCards.css";
// import "./MembershipCards.css";

import gold from "./../../assets/gold.png";
import platinum from "./../../assets/platinum.png";
import axios from "axios";
import { message } from "antd";

function MembershipCards({ location, openLottieModal, handlesellerRegModal }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (membership) => {
    setSelectedCard(membership);
  };
  const handleSellerRegistration = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/subcribe`;
    axios
      .put(
        url,
        { category: selectedCard, location: location },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        openLottieModal();

        message.success("Registered as Seller Successfully");
      })
      .catch((err) => {
        console.log(err);
        message.error("Error Registering as Seller");
      });
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Choose Your Category</h2>
        <div className="cards-container">
          <div
            className={` premiun--card card ${
              selectedCard === "PLATINUM" ? "active" : ""
            }`}
            onClick={() => handleCardClick("PLATINUM")}
          >
            <div className="platinum--img">
              <img src={platinum} alt="dfdf" />
            </div>

            <div>
              <h3>PLATINUM SELLER</h3>
              <p>Eligibility: Business is more than 50Crore</p>
            </div>
          </div>

          <div
            className={`gold--card card ${
              selectedCard === "GOLD" ? "active" : ""
            }`}
            onClick={() => handleCardClick("GOLD")}
          >
            <div className="gold--img">
              <img src={gold} alt="gold" />
            </div>
            <div>
              <h3>GOLD SELLER</h3>
              <p>Eligibility: Eligibility: Business is less than 50Crore</p>
            </div>
          </div>
        </div>
        <button onClick={handleSellerRegistration} className="register-button">
          Register as {selectedCard ? `${selectedCard} member` : "member"}
        </button>
      </div>
    </div>
  );
}

export default MembershipCards;
