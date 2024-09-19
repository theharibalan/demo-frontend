import React, { useState, useEffect } from "react";
import Header from "./../features/Header";
import "./HeroSection.css";
import poster1 from "./../assests/images/frame2.jpg";
import poster2 from "./../assests/images/frame3.jpg";
import poster0 from "./../assests/images/Frame1.png";
import { useNavigate } from "react-router-dom";
function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const posters = [poster0, poster1];
  const navigate = useNavigate();

  // Function to go to the next slide
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === posters.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? posters.length - 1 : prevIndex - 1
      );
    }
  };

  // Automatic slide change every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle transition end
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="hero--section">
      <div className="hero--section-img">
        <div
          className={`slider-wrapper ${isTransitioning ? "transitioning" : ""}`}
          onTransitionEnd={handleTransitionEnd}
          onClick={() => navigate("/products")}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Move wrapper to show the correct image
        >
          {posters.map((poster, index) => (
            <img
              onClick={() => navigate("/products")}
              key={index}
              src={poster}
              alt={`Slide ${index}`}
              className={`slider-image`}
            />
          ))}
        </div>
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
