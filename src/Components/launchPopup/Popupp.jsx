import "./popup.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Popupp({ onLocationChange, onLanguageChange, setSelectedLocation }) {
  const location = useLocation();
  const [popped, setpop] = useState(false);
  const [error, setError] = useState(""); // State to hold the error message
  const [isActivetab, setisActiveTab] = useState(location.pathname);

  useEffect(() => {
    setisActiveTab(location.pathname);

    // Check sessionStorage to determine if the card was shown in this tab
    const cardShownInSession = sessionStorage.getItem("popupshown");
    if (!cardShownInSession) {
      // Check localStorage to determine if the card should be shown initially
      const cardShown = localStorage.getItem("popupshown");
      if (!cardShown) {
        setpop(true);
      }
    }
  }, [location.pathname]);

  // Function to handle location change
  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;

    if (selectedLocation !== "Chennai") {
      setError("Currently we are not operating in this location."); // Set error message
    } else {
      setError("");
      setSelectedLocation(selectedLocation);
    }

    if (typeof onLocationChange === "function") {
      onLocationChange(selectedLocation);
    }
  };

  if (!popped) return null;
  const locations = [
    "Select the city",
    "Chennai",
    "Bangalore",
    "Andhra Pradesh",
    "Hyderabad",
    "Delhi",
    "Mumbai",
  ];

  const closeRegistrationCard = () => {
    setpop(false);
    sessionStorage.setItem("popupshown", "true");
  };

  return (
    <>
      {/* {localStorage.getItem("loggedas") ? (
        ""
      ) : ( */}
      <>
        {popped && (
          <div className="popup-container">
            <div className="popup-window">
              <button
                className="close--btn"
                onClick={() => closeRegistrationCard()}
              >
                &times;
              </button>
              <div className="select--location">
                <label htmlFor="place">Place</label>
                <select
                  className="location-select"
                  onChange={handleLocationChange}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {error && (
                  <div
                    className="error-message"
                    style={{ "margin-left": "20px" }}
                  >
                    {error}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="name">Select Your Language</label>
                <div className="nav-item">
                  <div className="google-translate">
                    <div className="" id="google_element"></div>
                  </div>
                </div>
              </div>
              <button onClick={() => setpop(false)} className="ctn-btn">
                continue
              </button>
              {/* <div>
                <button>Login</button>
                <button>New register</button>
              </div> */}
            </div>
          </div>
        )}
      </>
      {/* // )} */}
    </>
  );
}

export default Popupp;
