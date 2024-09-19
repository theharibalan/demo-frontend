import React, { useState, useEffect, useRef } from 'react';
import '../CSS/LocationOffersSlider.css';
import slide1 from '../../assets/1.png'; // Import your images
import slide2 from '../../assets/2.png'; // Import your images
import slide3 from '../../assets/3.png'; // Import your images
import slide4 from '../../assets/4.png'; // Import your images
import offer from '../../assets/offer.png'; // Import your images
import moongdal from "../../assets/moongdal_main.jpg"
import moongdal_GradeA from "../../assets/moong dal grade 1.jpg"
import moongdal_GradeB from "../../assets/moong dal grade 2 (1).jpg"
import moongdal_GradeC from "../../assets/moong dal grade 3.jpg"
import toordal from "../../assets/toor dal main.jpeg"
import toordal_GradeA from "../../assets/toor dal grade-1.jpeg"
import toordal_GradeB from "../../assets/toor dal grade-2.jpg"
import toordal_GradeC from "../../assets/toor dal grade-3.jpeg"
import uraddal from "../../assets/urad dal main.png"
import uraddal_GradeA from "../../assets/urad dal grade 1.jpeg"
import uraddal_GradeB from "../../assets/urad dal grade 2.jpeg"
import uraddal_GradeC from "../../assets/urad dal grade 3.jpeg"
import gramdal from "../../assets/gram dal main.webp"
import gramdal_GradeA from "../../assets/gram dal grade-1.jpg"
import gramdal_GradeB from "../../assets/gram dal grade-2.jpg"
import gramdal_GradeC from "../../assets/gram dal grade-3.jpg"
const LocationOffersSlider = () => {
    const [timer, setTimer] = useState(55 * 60); // 55 minutes in seconds
    const timerRef = useRef(timer);

    useEffect(() => {
        timerRef.current = timer;
    }, [timer]);

    useEffect(() => {
        const updateTimer = () => {
            setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 55 * 60));
        };

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };

    const navigateToProducts = () => {
        window.location.href = "/products";  // Update with your actual products page route
    };

    return (
        <div className="slider">
            <div className="slides">
                <div className="slide" style={{ backgroundImage: `url(${slide1})` }}>
                    {/* <div className="blurBg"></div> */}
                    <div className="content">
                        <div className="offerCont">
                            <img className='offerTag' src={offer} width={'180px'} height={'120px'}/>
                            <p className="offerTimer">Offer Ends in<br/>{formatTime(timer)}</p>
                        </div>
                        <button onClick={navigateToProducts}>Explore</button>
                    </div>
                </div>
                <div className="slide" style={{ backgroundImage: `url(${slide2})` }}>
                    <div className="content">
                        <div className="offerCont">
                            <img className='offerTag' src={offer} width={'180px'} height={'120px'}/>
                            <p className="offerTimer">Offer Ends in<br/>{formatTime(timer)}</p>
                        </div>
                        <button onClick={navigateToProducts}>Explore</button>
                    </div>
                </div>
                <div className="slide" style={{ backgroundImage: `url(${slide3})` }}>
                    <div className="content">
                        <div className="offerCont">
                            <img className='offerTag' src={offer} width={'180px'} height={'120px'}/>
                            <p className="offerTimer">Offer Ends in<br/>{formatTime(timer)}</p>
                        </div>
                        <button onClick={navigateToProducts}>Explore</button>
                    </div>
                </div>
                <div className="slide" style={{ backgroundImage: `url(${slide4})` }}>
                    <div className="content">
                        <div className="offerCont">
                            <img className='offerTag' src={offer} width={'180px'} height={'120px'}/>
                            <p className="offerTimer">Offer Ends in<br/>{formatTime(timer)}</p>
                        </div>
                        <button onClick={navigateToProducts}>Explore</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationOffersSlider;
