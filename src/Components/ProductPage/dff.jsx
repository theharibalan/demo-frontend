import React, { useEffect, useRef, useState } from "react";
import "../CSS/Products.css";
import moongdal_GradeA from "../../assets/moong dal grade 1.jpg";
import moongdal_GradeB from "../../assets/moong dal grade 2 (1).jpg";
import moongdal_GradeC from "../../assets/moong dal grade 3.jpg";
import toordal_GradeC from "../../assets/toor dal grade-3.jpeg";
import uraddal_GradeB from "../../assets/urad dal grade 2.jpeg";
import gramdal_GradeB from "../../assets/gram dal grade-2.jpg";
import { FcBookmark } from "react-icons/fc";
import bookmark from "../../assets/bookmark-removebg-preview.png";
import {
  Modal,
  Button,
  Form,
  Select,
  Input,
  Alert,
  Checkbox,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../PageComponents/Navbar";

const locationOffers = {
  Chennai: "20%",
  Bangalore: "15%",
  AndhraPradesh: "10%",
  Hyderabad: "20%",
  Delhi: "12%",
  Mumbai: "18%",
};

const gunnyBagCost = 50;

const products = [
  {
    name: "MoongDal",
    CommonImage: moongdal_GradeA,
    description: {
      Speciality: "High in Protein",
      Moisture: "",
      IsOrganic: "Organic",
      QualityAvailable: "A Grade",
      ShelfLife: "6 Months",
    },
    offerStartDate: "2024-09-10",
    offerStartTime: "08:00:00",
    offerDuration: 72,
    costPerUnit: [
      { grade: "Polished MoongDal", PricePerUnit: 96, Image: moongdal_GradeA },
      { grade: "Imported MoongDal", PricePerUnit: 111, Image: moongdal_GradeB },
      { grade: "Desi MoongDal", PricePerUnit: 90, Image: moongdal_GradeC },
    ],
  },
  {
    name: "ToorDal",
    CommonImage: toordal_GradeC,
    description: {
      Speciality: "High in Protein",
      IsOrganic: "Organic",
      QualityAvailable: "A Grade",
      Moisture: "Dry",
      ShelfLife: "6 Months",
    },
    offerStartDate: "2024-09-10",
    offerStartTime: "08:00:00",
    offerDuration: 72,
    costPerUnit: [
      { grade: "Fatka ToorDal", PricePerUnit: 155, Image: toordal_GradeC },
      { grade: "Desi ToorDal", PricePerUnit: 165, Image: toordal_GradeC },
      { grade: "Imported ToorDal", PricePerUnit: 145, Image: toordal_GradeC },
      { grade: "Polished ToorDal", PricePerUnit: 145, Image: toordal_GradeC },
    ],
  },
  {
    name: "UradDal",
    CommonImage: uraddal_GradeB,
    description: {
      Speciality: "High in Protein",
      IsOrganic: "Organic",
      Moisture: "",
      QualityAvailable: "A Grade",
      ShelfLife: "6 Months",
      StorageInstruction: "Cool  And Dry Place",
    },
    offerStartDate: "2024-09-10",
    offerStartTime: "08:00:00",
    offerDuration: 72,
    costPerUnit: [
      { grade: "Black UradDal", PricePerUnit: 104, Image: uraddal_GradeB },
      { grade: "Desi UradDal", PricePerUnit: 128, Image: uraddal_GradeB },
      { grade: "Imported UradDal", PricePerUnit: 111, Image: uraddal_GradeB },
    ],
  },
  {
    name: "GramDal",
    CommonImage: gramdal_GradeB,
    description: {
      Speciality: "High in Protein",
      IsOrganic: "Organic",
      QualityAvailable: "A Grade",
      Moisture: "",
      ShelfLife: "6 Months",
      StorageInstruction: "Cool  And Dry Place",
    },
    offerStartDate: "2024-09-10",
    offerStartTime: "08:00:00",
    offerDuration: 72,
    costPerUnit: [
      { grade: "Premium GramDal", PricePerUnit: 120, Image: gramdal_GradeB },
      { grade: "Gold GramDal", PricePerUnit: 105, Image: gramdal_GradeB },
    ],
  },
];

const formatIndianNumber = (num) => {
  return num.toLocaleString("en-IN");
};

const calculateRemainingTime = (startDate, startTime, duration) => {
  const offerStart = new Date(`${startDate}T${startTime}`);
  const currentTime = new Date();
  const endTime = new Date(offerStart.getTime() + duration * 60 * 60 * 1000);

  const remainingTime = endTime - currentTime;

  if (remainingTime < 0) {
    return "Offer has ended";
  }

  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const Products = ({ location }) => {
  const [modalContent, setModalContent] = useState({});
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [termsAndConsModal, setTermsAndConsModal] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [gradeSelected, setGradeSelected] = useState("");
  const [quantitySelected, setQuantitySelected] = useState("");
  const [breakdown, setBreakdown] = useState({
    totalPrice: 0,
    gunnyBagTotal: 0,
    gstAmount: 0,
    checkoutAmount: 0,
  });
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState("Loading...");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      const product = modalContent;
      if (product) {
        setRemainingTime(
          calculateRemainingTime(
            product.offerStartDate,
            product.offerStartTime,
            product.offerDuration
          )
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [modalContent]);

  const openOrderModal = (product) => {
    setModalContent(product);
    setIsOrderModalVisible(true);
  };

  const handleOrderSubmit = (values) => {
    const { grade, quantity } = values;
    setProductName(modalContent.name);
    setGradeSelected(grade);
    setQuantitySelected(quantity);
    const selectedGrade = modalContent.costPerUnit.find(
      (item) => item.grade === grade
    );
    if (!selectedGrade) return;

    const quantityTons = parseFloat(quantity);
    if (quantityTons < 100) {
      setErrorMessage("Quantity must be at least 100 tons.");
      return;
    } else {
      setErrorMessage("");
    }

    const pricePerUnit = selectedGrade.PricePerUnit;
    const totalPrice = pricePerUnit * quantityTons * 1000;
    const gunnyBagsRequired = Math.ceil((quantityTons * 1000) / 50);
    const gunnyBagTotal = gunnyBagsRequired * gunnyBagCost;
    const gstAmount = (totalPrice + gunnyBagTotal) * gstRate;
    const checkoutAmount = totalPrice;

    setTotalAmount(checkoutAmount);

    setBreakdown({
      totalPrice,
      gunnyBagTotal,
      gstAmount,
      checkoutAmount,
    });
  };

  const handleCheckboxinput = (e) => {
    setIsChecked(e.target.checked);
  };

  const closeModal = () => {
    setIsOrderModalVisible(false);
    setErrorMessage("");
  };

  const offerPercentage = locationOffers[location] || locationOffers["Delhi"];

  const handlePaymentCheckout = () => {
    if (isChecked) {
      const data = {
        productName: productName,
        grade: gradeSelected,
        quantity: quantitySelected,
        totalPrice: breakdown.totalPrice,
        gunnyBagTotal: breakdown.gunnyBagTotal,
        gstAmount: 0,
        checkoutAmount: breakdown.checkoutAmount,
      };
      console.log(data);
      closeModal();
      if (localStorage.getItem("loginstate") === "false") {
        localStorage.setItem("ispayment", "true");
        navigate("/reg", { state: data });
      } else {
        navigate("/payments", { state: data });
      }
    } else {
      message.error(
        "Please agree to the terms and conditions to proceed to payment."
      );
    }
  };

  return (
    <div className="product-container-holder">
      <ToastContainer />
      <h2 style={{ marginTop: "30px" }} className=" offerHeading">
        Exclusive Offers{" "}
      </h2>
      <div className="products-container">
        {products.map((product) => {
          const gradeAUnit = product.costPerUnit[0]; // Default to first item in costPerUnit

          return gradeAUnit ? (
            <div className="product-card" key={product.name}>
              <div className="product-image-container">
                <img
                  src={product.CommonImage}
                  alt={product.name}
                  className="product-image"
                />
                <img
                  style={{ width: "60px", height: "auto" }}
                  className="bookmark-tag"
                  src={bookmark}
                  alt="Bookmark"
                />
              </div>
              <div className="product-details">
                <h4 className="product--name">{product.name}</h4>
                <div className="product-unit">
                  <p className="offer-price">
                    <span>₹</span> <p>{gradeAUnit.PricePerUnit.toFixed(2)}</p>{" "}
                    <span>/KG</span>
                  </p>
                </div>
                <div className="timer1">
                  <span>Offer Ends in</span>{" "}
                  {calculateRemainingTime(
                    product.offerStartDate,
                    product.offerStartTime,
                    product.offerDuration
                  )}
                </div>
                <span className="line-divider"></span>
                <button
                  onClick={() => openOrderModal(product)}
                  className="place-order-btn"
                >
                  Order Now
                </button>
              </div>
            </div>
          ) : null;
        })}
      </div>
      {/* Modal code */}
    </div>
  );
};

export default Products;
