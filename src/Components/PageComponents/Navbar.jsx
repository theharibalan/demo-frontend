import React, { useContext, useEffect, useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../CSS/NavBar.css";
import Logo from '../../assets/b2blogo.png';
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import { store } from "../../App";

const NavBar = () => {
  let navbar = document.getElementById('res-nav-items');
  const [noOfOrders, setNoOfOrders] = useContext(store); // Getting the number of orders from context
  useEffect(() => {
    if (!localStorage.getItem("userEmail")) {
      localStorage.setItem("loginstate", "false");
    }
  }, []); // Add the empty dependency array to run only on mount

  const [navclick, setnavclick] = useState(false);

  const handlenav = () => {
    setnavclick(val => !val);
    if (navbar.style.visibility === "collapse") {
      navbar.style.visibility = "visible";
    } else {
      navbar.style.visibility = "collapse";
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <IoMdMenu onClick={handlenav} id="nav-btn" className="menu-icon-res" />
      <div style={{ margin: "10px" }} onClick={() => navigate("/")} className="logo">
        <img src={Logo} width={"auto"} height={"70px"} alt="" />
      </div>
      <div className="nav-items ">
        <span onClick={() => navigate('/')} className="nav-item navBtn">
          <FaHome style={{ marginRight: "10px" }} /> Home
        </span>
        <span onClick={() => navigate('/products')} className="nav-item navBtn">
          <FaCartShopping style={{ marginRight: "10px" }} /> Products
        </span>
        {localStorage.getItem('loginstate') === "true" ? "" : (
          <>
            <span onClick={() => { navigate("/login", { state: { navigateTo: "products" } }) }} className="nav-item navBtn">
              <FaSignInAlt style={{ marginRight: "10px" }} /> Login
            </span>
            <span onClick={() => navigate('/reg')} className="nav-item navBtn">
              <FaUserPlus style={{ marginRight: "10px" }} /> Register
            </span>
          </>
        )}
        {localStorage.getItem('loginstate') === "true" ? (
          <form action="">
            <button onClick={handleLogout} className="nav-item navBtn">
              <FaSignInAlt style={{ marginRight: "10px" }} /> Logout
            </button>
          </form>
        ) : ""}
        <span onClick={() => navigate('/orders')} className="nav-item navBtn">
          <BsFillCartCheckFill style={{ marginRight: "10px" }} /> Orders- <span color="red">({noOfOrders})</span>
        </span>
      </div>
      <div id="res-nav-items">
        <a onClick={() => navigate('/products')} className="res-nav-item">
          Products
        </a>
        <a onClick={() => { navigate("/login", { state: { navigateTo: "products" } }) }} className="res-nav-item">
          Login
        </a>
        <a onClick={() => navigate('/reg')} className="res-nav-item">
          Register
        </a>
        <a onClick={() => navigate('/orders')} className="res-nav-item">
          Orders <span style={{ backgroundColor: "red", color: "white", padding: "2px 5px", borderRadius: "3px" }}></span>
        </a>

      </div>
    </nav>
  );
};

export default NavBar;