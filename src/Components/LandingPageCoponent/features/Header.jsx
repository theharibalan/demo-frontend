import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { LuBaggageClaim } from "react-icons/lu";
import { MdLogin, MdOutlineInstallDesktop } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import "./Header.css";
import b2blogo from "../assests/images/b2b-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import personicon from "../../../assets/personIcon.png";

function Header({ isadmin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActivetab, setisActiveTab] = useState(location.pathname);
  const [showRegistrationCard, setShowRegistrationCard] = useState(false);

  useEffect(() => {
    setisActiveTab(location.pathname);

    // Check sessionStorage to determine if the card was shown in this tab
    const cardShownInSession = sessionStorage.getItem("registrationCardShown");
    if (!cardShownInSession) {
      // Check localStorage to determine if the card should be shown initially
      const cardShown = localStorage.getItem("registrationCardShown");
      if (!cardShown) {
        setShowRegistrationCard(true);
      }
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (link) => {
    navigate(link);
    toggleMenu();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeRegistrationCard = () => {
    setShowRegistrationCard(false);
    sessionStorage.setItem("registrationCardShown", "true");
  };

  return (
    <>
      {location.pathname === "/admin@b2b/b2bhubindia" ? (
        <header className="header">
          <img
            className="logo logo-border--right"
            src={b2blogo}
            alt="B2B Logo"
            onClick={() => navigate("/")}
          />
          <h1 className="adminPage--h2">Admin Page</h1>
          {localStorage.getItem("admin-token") ? (
            <ul className={`nav-ul ${isMenuOpen ? "active" : ""}`}>
              <li
                className={isActivetab === "/" ? "active-header" : ""}
                onClick={() => handleLogout()}
              >
                <FaSignInAlt style={{ marginRight: "10px" }} />
                Logout
              </li>
            </ul>
          ) : (
            ""
          )}
        </header>
      ) : (
        <header className="header">
          <img
            className={`logo ${
              localStorage.getItem("loggedas") === "Seller Page" ||
              localStorage.getItem("loggedas") === "Buyer Page"
                ? "logo-border--right"
                : ""
            }`}
            src={b2blogo}
            alt="B2B Logo"
            onClick={() => navigate("/")}
          />
          <div className="WelcomeText">
            {localStorage.getItem("loggedas") ? (
              <h1 className="sellerpage--h2">
                {localStorage.getItem("loggedas")}
              </h1>
            ) : (
              ""
            )}
          </div>

          <ul className={`nav-ul ${isMenuOpen ? "active" : ""}`}>
            <li
              className={isActivetab === "/" ? "active-header" : ""}
              onClick={() => handleNavigation("/")}
            >
              <AiOutlineHome /> Home
            </li>
            {localStorage.getItem("loggedas") === "Seller Page" &&
            localStorage.getItem("loggedas") ? (
              <li
                className={
                  isActivetab === "/listofproducts" ? "active-header" : ""
                }
                onClick={() => handleNavigation("/listofproducts")}
              >
                <LuBaggageClaim /> My Products
              </li>
            ) : (
              <li
                className={isActivetab === "/products" ? "active-header" : ""}
                onClick={() => handleNavigation("/products")}
              >
                <LuBaggageClaim /> Products
              </li>
            )}

            {localStorage.getItem("loginstate") === "true" ? (
              ""
            ) : (
              <>
                <li
                  className={isActivetab === "/login" ? "active-header" : ""}
                  onClick={() => {
                    toggleMenu();
                    navigate("/login", { state: { navigateTo: "products" } });
                  }}
                >
                  <MdLogin /> Buyer Login
                </li>
                <li
                  className={
                    isActivetab === "/seller-login" ? "active-header" : ""
                  }
                  onClick={() => {
                    toggleMenu();
                    navigate("/seller-login", {
                      state: { navigateTo: "seller" },
                    });
                  }}
                >
                  <MdLogin /> Seller Login
                </li>
                <li
                  className={isActivetab === "/reg" ? "active-header" : ""}
                  onClick={() => handleNavigation("/reg")}
                >
                  <MdOutlineInstallDesktop /> New Registration
                </li>
              </>
            )}

            {localStorage.getItem("loginstate") === "true" ? (
              <>
                {localStorage.getItem("loggedas") === "Buyer Page" ? (
                  <li
                    className={isActivetab === "/orders" ? "active-header" : ""}
                    onClick={() => handleNavigation("/orders")}
                  >
                    <MdOutlineInstallDesktop /> Orders
                  </li>
                ) : (
                  ""
                )}
                <li onClick={handleLogout}>
                  <FaSignInAlt style={{ marginRight: "10px" }} /> Logout
                </li>
              </>
            ) : (
              ""
            )}
          </ul>

          {showRegistrationCard && (
            <div className="registration-highlight-card">
              <span className="rhc-close--btn" onClick={closeRegistrationCard}>
                x
              </span>
              <p>Register into B2bHubindia.com</p>
              <p>Register now for best deals</p>
              <p>
                Register now and unlock exclusive access to premium deals and
                offers. Whether you're looking for bulk purchases or unique
                business solutions, B2bHubIndia has you covered.
              </p>
              <button
                onClick={() => {
                  navigate("/reg");
                  closeRegistrationCard();
                }}
              >
                New Registration
              </button>
            </div>
          )}

          {localStorage.getItem("loggedas") === "Seller Page" ||
          localStorage.getItem("loggedas") === "Buyer Page" ? (
            <p className="welcone---note">
              <img className="personIcon" src={personicon} alt="" />
              <span className="welcome--name">
                {localStorage.getItem("companyname")}
              </span>
            </p>
          ) : (
            <></>
          )}

          <div className="menu-icon" onClick={toggleMenu}>
            <HiMenuAlt3 />
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
