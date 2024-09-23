import React, { useEffect, useRef, useState } from "react";
import "../CSS/Products.css";
import Lottie from "react-lottie";
import * as loading from "./../../assets/loadingLottie.json";
import moongdal_GradeA from "../../assets/moong dal grade 1.jpg";
import moongdal_GradeB from "../../assets/moong dal grade 2 (1).jpg";
import moongdal_GradeC from "../../assets/moong dal grade 3.jpg";
import toordal_GradeC from "../../assets/toor dal grade-3.jpeg";
import uraddal_GradeB from "../../assets/uradDal_updated.png";
import gramdal_GradeB from "../../assets/gram dal grade-2.jpg";
import { FcBookmark } from "react-icons/fc";
import platinum from "../../assets/platinum.png";
import gold from "../../assets/gold.png";
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
  Spin,
  Empty
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../PageComponents/Navbar";
import axios from "axios";

const locationOffers = {
  Chennai: "20%",
  Bangalore: "15%",
  AndhraPradesh: "10%",
  Hyderabad: "20%",
  Delhi: "12%",
  Mumbai: "18%",
};

const gunnyBagCost = 50;

// const products = [
//   {
//     name: "MoongDal",
//     CommonImage: moongdal_GradeA,
//     costPerUnit: [
//       { grade: "GradeA", PricePerUnit: 100, Image: moongdal_GradeA },
//       { grade: "GradeB", PricePerUnit: 95, Image: moongdal_GradeB },
//       { grade: "GradeC", PricePerUnit: 90, Image: moongdal_GradeC },
//     ],
//   },
//   {
//     name: "ToorDal",
//     CommonImage: toordal_GradeC,
//     costPerUnit: [
//       { grade: "GradeA", PricePerUnit: 90, Image: toordal_GradeC },
//       { grade: "GradeB", PricePerUnit: 86, Image: toordal_GradeC },
//       { grade: "GradeC", PricePerUnit: 82, Image: toordal_GradeC },
//     ],
//   },
//   {
//     name: "UradDal",
//     CommonImage: uraddal_GradeB,
//     costPerUnit: [
//       { grade: "GradeA", PricePerUnit: 120, Image: uraddal_GradeB },
//       { grade: "GradeB", PricePerUnit: 110, Image: uraddal_GradeB },
//       { grade: "GradeC", PricePerUnit: 104, Image: uraddal_GradeB },
//     ],
//   },
//   {
//     name: "GramDal",
//     CommonImage: gramdal_GradeB,
//     costPerUnit: [
//       { grade: "GradeA", PricePerUnit: 98, Image: gramdal_GradeB },
//       { grade: "GradeB", PricePerUnit: 90, Image: gramdal_GradeB },
//       { grade: "GradeC", PricePerUnit: 89, Image: gramdal_GradeB },
//     ],
//   },
// ];

const formatIndianNumber = (num) => {
  const numStr = num.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== "") {
    return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
  } else {
    return lastThree;
  }
};

const remainingTime = (product) => {
  const now = new Date();
  const offerStart = new Date(
    `${product.offerStartDate}T${product.offerStartTime}`
  );
  const offerEnd = new Date(
    offerStart.getTime() + product.offerDuration * 60 * 60 * 1000
  );

  const timeRemaining = offerEnd - now;

  function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours} : ${minutes} : ${seconds} `;
  }

  // console.log(timeRemaining);
  // console.log(formatTime(timeRemaining));

  if (timeRemaining > 0) {
    return formatTime(timeRemaining);
  } else {
    return "";
  }
};

const checkNoTime = (product) => {
  const now = new Date();
  const offerStart = new Date(
    `${product.offerStartDate}T${product.offerStartTime}`
  );
  const offerEnd = new Date(
    offerStart.getTime() + product.offerDuration * 60 * 60 * 1000
  );

  const timeRemaining = offerEnd - now;

  if (timeRemaining > 0) {
    return false;
  } else {
    return true;
  }
};

// const products = [
//   {
//     name: "Moong Dal",
//     CommonImage: moongdal_GradeA,
//     description: {
//       Speciality: "High in Protein",
//       Moisture: "",
//       IsOrganic: "Organic",
//       QualityAvailable: "A Grade",
//       ShelfLife: "6 Months",
//     },
//     offerStartDate: "2024-09-06",
//     offerStartTime: "08:00:00",
//     offerDuration: 72,
//     costPerUnit: [
//       { grade: "Polished MoongDal", PricePerUnit: 96, Image: moongdal_GradeA },
//       { grade: "Imported MoongDal", PricePerUnit: 111, Image: moongdal_GradeB },
//       { grade: "Desi MoongDal", PricePerUnit: 90, Image: moongdal_GradeC },
//     ],
//   },

//   {
//     name: "Toor Dal",
//     CommonImage: toordal_GradeC,
//     description: {
//       Speciality: "High in Protein",
//       IsOrganic: "Organic",
//       QualityAvailable: "A Grade",
//       Moisture: "Dry",
//       ShelfLife: "6 Months",
//     },
//     offerStartDate: "2024-09-07",
//     offerStartTime: "08:00:00",
//     offerDuration: 72, // duration in hours
//     costPerUnit: [
//       { grade: "Fatka ToorDal", PricePerUnit: 155, Image: toordal_GradeC },
//       { grade: "Desi ToorDal", PricePerUnit: 165, Image: toordal_GradeC },
//       { grade: "Imported ToorDal", PricePerUnit: 145, Image: toordal_GradeC },
//       { grade: "Polished ToorDal", PricePerUnit: 145, Image: toordal_GradeC },
//     ],
//   },
//   {
//     name: "Urad Dal",
//     CommonImage: uraddal_GradeB,
//     description: {
//       Speciality: "High in Protein",
//       IsOrganic: "Organic",
//       Moisture: "",
//       QualityAvailable: "A Grade",
//       ShelfLife: "6 Months",
//       StorageInstruction: "Cool  And Dry Place",
//     },
//     offerStartDate: "2024-09-10",
//     offerStartTime: "23:00:00",
//     offerDuration: 72, // duration in hours
//     costPerUnit: [
//       { grade: "Black UradDal", PricePerUnit: 104, Image: uraddal_GradeB },
//       { grade: "Desi UradDal", PricePerUnit: 128, Image: uraddal_GradeB },
//       { grade: "Imported UradDal", PricePerUnit: 111, Image: uraddal_GradeB },
//     ],
//   },
//   {
//     name: "Gram Dal",
//     CommonImage: gramdal_GradeB,
//     description: {
//       Speciality: "High in Protein",
//       IsOrganic: "Organic",
//       QualityAvailable: "A Grade",
//       Moisture: "",
//       ShelfLife: "6 Months",
//       StorageInstruction: "Cool  And Dry Place",
//     },
//     offerStartDate: "2024-09-10",
//     offerStartTime: "01:00:00",
//     offerDuration: 72, // duration in hours
//     costPerUnit: [
//       { grade: "Premium GramDal", PricePerUnit: 120, Image: gramdal_GradeB },
//       { grade: "Gold GramDal", PricePerUnit: 105, Image: gramdal_GradeB },
//     ],
//   },
// ];

const Products = ({ location }) => {
  const [modalContent, setModalContent] = useState({});
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const gstRate = 0.05;
  const [isChecked, setIsChecked] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [termsAndConsModal, setTermsAndConsModal] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [gradeSelected, setGradeSelected] = useState("");
  const [quantitySelected, setQuantitySelected] = useState("");
  const [blur, setBlur] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/getProducts`;
    axios
      .post(url, {})
      .then((response) => {
        // console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err);
      });
  });
  const [breakdown, setBreakdown] = useState({
    totalPrice: 0,
    gunnyBagTotal: 0,
    gstAmount: 0,
    checkoutAmount: 0,
  });
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(55 * 60);
  const timerRef = useRef(timer);

  const openTermsAndConsModal = () => {
    setTermsAndConsModal(true);
  };

  const openTermsModal = () => {
    setTermsModalVisible(true);
  };
  const closeTermsandConsModal = () => {
    setTermsAndConsModal(false);
  };
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
    if (quantityTons < 25) {
      setErrorMessage("Quantity must be at least 25 tons.");
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

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    const updateTimer = () => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 55 * 60));
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatIndianNumber = (number) => {
    return number.toLocaleString("en-IN");
  };

  const closeTermsModal = () => {
    setTermsModalVisible(false);
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

  const loc = useLocation();
  const currentPath = loc.pathname;
  return (
    <div className="product-container-holder">
      <ToastContainer />
      <h2 style={{ marginTop: "30px" }} className=" offerHeading">
        Exclusive Offers available here{" "}
      </h2>
      <div className="products-container">
        {/* Show spinner while loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          // Show Empty component if there are no products
          <Empty description="No Offers Available" />
        ) : (
          products.map((product) => {
            const gradeAUnit = product.costPerUnit[0]; // Default to first item in costPerUnit

            return gradeAUnit ? (
              <div className="product-card" key={product.name}>
                <div className="membership--badge">
                  {console.log(product)}
                  { product.category === "PLATINUM" ? (
                    <>
                  <img src={platinum} alt="" className="badge-img" />
                  <span>{product.category}</span>
                    </>
                  ) : (<>
                  <img src={gold} alt="" className="badge-img" />
                  <span>{product.category}</span></>)}
                </div>

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
                    <p className="offer-price1">
                      <span>₹</span>
                      <span>{gradeAUnit.PricePerUnit.toFixed(2)}</span>
                      <span>/kg</span>
                    </p>
                  </div>

                  <p style={{ display: "none" }} className="timer1">
                    {!checkNoTime(product) ? (
                      <>
                        <p>Offer ends in</p>
                        <span>{remainingTime(product)}</span>
                      </>
                    ) : (
                      <>Offer ended</>
                    )}
                  </p>

                  <p
                    style={{
                      fontSize: "1rem",
                      marginTop: "10px",
                      padding: "0.5rem 0.8rem",
                      backgroundColor: "#f81d1d",
                      color: "white",
                      borderRadius: "50px",
                    }}
                  >
                    Loaction: {product.location}
                  </p>


                  <span className="line-divider"></span>
                  <div className="button--price">
                    <p className="offer-price">
                      <span>₹</span>
                      <span>{gradeAUnit.PricePerUnit.toFixed(2)}</span>
                      <span>/kg</span>
                    </p>
                    <button
                      onClick={() => openOrderModal(product)}
                      className="place-order-btn"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            );
          })
        )}
      </div>

      <Modal
        style={{ top: "4vh" }}
        title="Purchase Information"
        visible={isOrderModalVisible}
        onCancel={closeModal}
        footer={
          <div className="modal-footer">
            <Button onClick={closeModal}>Close</Button>
          </div>
        }
      >
        {/* <h4>Product Description :</h4> */}
        {/* <p> Speciality : <strong>{modalContent.description.Speciality}</strong></p>
       <p> IsOrganic : <strong>{modalContent.description.IsOrganic}</strong></p>
       <p> QualityAvailable : <strong>{modalContent.description.QualityAvailable}</strong></p>
       <p> Moisture :<strong>{modalContent.description.Moisture}</strong> </p>
       <p> ShelfLife : <strong>{modalContent.description.ShelfLife}</strong> </p> 
       <p> StorageInstruction:<strong>{modalContent.description.StorageInstruction}</strong> </p> */}

        <Form form={form} onFinish={handleOrderSubmit} layout="vertical">
          <Form.Item
            name="grade"
            label="Select Type"
            rules={[{ required: true, message: "Please select a type!" }]}
          >
            <Select placeholder="Select Type">
              {modalContent.costPerUnit &&
                modalContent.costPerUnit.map((item) => (
                  <Select.Option key={item.grade} value={item.grade}>
                    {`${item.grade} ${" "}₹ ${formatIndianNumber(
                      item.PricePerUnit
                    )} `}<span>/KG </span>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity (in tons)"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}

          <Button type="primary" htmlType="submit">
            Continue
          </Button>
        </Form>
        {totalAmount > 0 && (
          <div className="order-summary">
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Total Price:</td>
                  <td>₹ {formatIndianNumber(breakdown.totalPrice)}</td>
                </tr>

                <tr>
                  <td>GST (Exempted):</td>
                  <td>₹ 0</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Amount:</strong>
                  </td>
                  <td>
                    <strong>
                      ₹ {formatIndianNumber(breakdown.checkoutAmount)}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }} colSpan="2">
                    <button className="button-7" onClick={openTermsModal}>
                      Proceed to Payment
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      <Modal
        open={termsAndConsModal}
        onCancel={closeTermsandConsModal}
        onOk={closeTermsandConsModal}
        style={{ overflowY: "auto", top: "2vh" }}
      >
        <div
          style={{ marginTop: "25px", height: "70vh", overflowY: "auto" }}
          className="terms"
        >
          <h4>Terms & Conditions</h4>
          <p>
            <strong>1. Introduction</strong> These Terms and Conditions govern
            the use of our B2B trading platform, specifically for the purchase
            of Moong Dal, Toor Dal, Urad Dal, and Gram Dal. By creating an
            account and purchasing products through our platform, you agree to
            these terms.
          </p>
          <p>
            <strong>2. Eligibility</strong> This platform is intended for use by
            businesses only. By registering, you confirm that you are authorized
            to enter into a binding agreement on behalf of your business and
            that your business is legally permitted to buy and trade
            agricultural commodities.
          </p>
          <p>
            <strong>3. Account Creation</strong> To access our platform, you
            must create a business account. You are responsible for maintaining
            the confidentiality of your account information and for all
            activities that occur under your account. You agree to provide
            accurate and up-to-date information during the registration process.
          </p>
          <p>
            <strong>4. Purchase and Order Requirements</strong> All purchases
            made through our platform must be for a minimum of 25 tons of any of
            the available dal varieties (Moong Dal, Toor Dal, Urad Dal, Gram
            Dal). Orders below this quantity will not be processed. Upon placing
            an order, you agree to pay the total amount as specified at
            checkout.
          </p>
          <p>
            <strong>5. Pricing and Payment</strong> Pricing for all dal
            varieties is provided at the time of purchase and is subject to
            change without prior notice. All payments must be made in full
            before the order is processed. We accept various payment methods as
            indicated during checkout. All transactions are secure and
            encrypted.
          </p>
          <p>
            <strong>6. Shipping and Delivery</strong> We will arrange for the
            shipping of your order to the address specified during checkout.
            Shipping times may vary based on location and availability of the
            products. We are not responsible for any delays caused by
            third-party shipping services.
          </p>
          <p>
            <strong>7. Returns and Refunds</strong> Due to the nature of bulk
            agricultural products, all sales are final. We do not accept returns
            or provide refunds once the order has been processed. Please review
            your order carefully before finalizing your purchase.
          </p>
          <p>
            <strong>8. Intellectual Property</strong> All content on our
            platform, including product descriptions, images, and trademarks, is
            the intellectual property of our company or our licensors.
            Unauthorized use, reproduction, or distribution of this content is
            prohibited and may result in legal action.
          </p>
          <p>
            <strong>9. Limitation of Liability</strong> We are not liable for
            any indirect, incidental, or consequential damages arising out of or
            in connection with your use of the platform or the purchase of
            products. Our maximum liability to you shall not exceed the amount
            you paid for the products.
          </p>
          <p>
            <strong>10. Changes to Terms</strong> We reserve the right to modify
            these Terms and Conditions at any time. Any changes will be
            effective immediately upon posting on this page. Continued use of
            the platform after changes are posted constitutes your acceptance of
            the new terms.
          </p>
          <p>
            <strong>11. Governing Law</strong> These Terms and Conditions are
            governed by and construed in accordance with the laws of Chennai.
            Any disputes arising under these terms shall be subject to the
            exclusive jurisdiction of the courts in Chennai.
          </p>
          <p>
            <strong>12. Contact Information</strong> If you have any questions
            or concerns about these Terms and Conditions, please contact us at
            support@b2bhubindia.com.
          </p>

          <Checkbox checked={isChecked} onChange={handleCheckboxinput}>
            <span style={{ marginLeft: "8px" }}>
              By purchasing our digital products, you acknowledge that you have
              read, understood, and agree to these Terms and Conditions.
            </span>
          </Checkbox>
        </div>
      </Modal>
      <Modal
        open={termsModalVisible}
        footer={null}
        onCancel={closeTermsModal}
        width="90vw"
        style={{ top: "2vh" }}
        bodyStyle={{ height: "80vh", overflowY: "auto" }}
        closeIcon={
          <CloseOutlined style={{ fontSize: "20px", color: "#333" }} />
        }
        centered
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Terms and Conditions
          </h1>

          <p>
            <strong>1. Introduction</strong> <br /> These Terms and Conditions
            govern the use of our B2B platform for the purchase and trade of
            Moong Dal, Toor Dal, Urad Dal, and Gram Dal. By creating an account
            and placing an order through our platform, you agree to comply with
            these terms.
          </p>
          <p>
            <strong>2. License and Use</strong> <br /> Upon creating an account
            and making a purchase, you are granted a non-exclusive,
            non-transferable right to use our platform for your business needs.
            You may not redistribute, resell, or share access to our platform or
            any materials provided therein with any unauthorized third parties.
            The platform is intended solely for the trading of dal varieties in
            quantities exceeding 25 tons per order.
          </p>
          <a
            href="#"
            onClick={openTermsAndConsModal}
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "20px",
              color: "#0066cc",
            }}
          >
            Read More
          </a>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Button
              disabled={!isChecked}
              type="primary"
              onClick={handlePaymentCheckout}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
