import React, { useState } from "react";
// import QRCode from "qrcode.react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../PageComponents/Navbar";
import Lottie from "react-lottie";
import Success_icon from "../../assets/succesful_json.json";
import { Modal } from "antd";
import axios from "axios";
import generateInvoice from "../GenerateInvoice";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../PageComponents/Navbar";
const cityToStateMap = {
  Chennai: "Tamil Nadu",
  Bangalore: "Karnataka",
  Hyderabad: "Telangana",
  Delhi: "Delhi",
  Mumbai: "Maharashtra",
};

function formatIndianNumber(num) {
  const number = Math.round(num);
  const numStr = number.toString();
  let lastThreeDigits = numStr.slice(-3);
  const otherDigits = numStr.slice(0, -3);

  if (otherDigits !== "") {
    lastThreeDigits = "," + lastThreeDigits;
  }

  const formattedNumber =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
  return formattedNumber;
}

const PaymentPage = () => {
  const [proceedPaymentText, setProceedPaymentText] =
    useState("Pre Book Order");

  const [disableBtn, setDisableBtn] = useState(false);

  const location = useLocation();
  const [isModalOpen, setModelOpen] = useState(false);
  const purchaseData = location.state;
  const [isOrderSuccesful, setIsOrderSuccessful] = useState(false);
  const [sample_request, setSampleRequest] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: localStorage.getItem("companyname")
      ? localStorage.getItem("companyname")
      : "",
    mobile: localStorage.getItem("phone") ? localStorage.getItem("phone") : "",
    email: localStorage.getItem("email") ? localStorage.getItem("email") : "",
    GST_No: localStorage.getItem("gst") ? localStorage.getItem("gst") : "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    doorNo: "",
    streetName: "",
    city: "",
    state: "",
    zip: "",
    landmark: "",
  });

  const [errors, setErrors] = useState({});

  const handleSampleRequest = (e) => {
    console.log(e.target.checked);
    setSampleRequest(e.target.checked);
  };

  const handleConfirmOrder = async () => {
    const orderUrl = `${process.env.REACT_APP_BACKEND_URL}/sales/addorder`;
    setProceedPaymentText("Processing...");
    let newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const invoiceIdRequest = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/sales/getInoivceId`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const invoiceUrl = await generateInvoice(
          getInvoiceData(invoiceIdRequest.data[0].invoiceId)
        );
        const orderDetails = getOrderDetails(
          invoiceUrl,
          invoiceIdRequest.data[0].invoiceId
        );
        console.log("orrder sample data", orderDetails);
        await axios.post(orderUrl, orderDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setProceedPaymentText("Thanks For Business");
        setIsOrderSuccessful(true);
        setModelOpen(true);

        console.log("Order Confirmed and email sent");
      } catch (error) {
        console.error("Error processing the order:", error);
        setProceedPaymentText("Failed. Try Again");
      }
    } else {
      toast.error("Error with making purchase", { position: "top-center" });
      setProceedPaymentText("Failed. Try Again");
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!buyerInfo.name) newErrors.name = "Company Name is required";
    if (!buyerInfo.mobile) newErrors.mobile = "Contact No is required";
    else if (!validateMobile(buyerInfo.mobile))
      newErrors.mobile = "Invalid Contact No";
    if (!buyerInfo.email) newErrors.email = "Email is required";
    else if (!validateEmail(buyerInfo.email)) newErrors.email = "Invalid Email";
    if (!buyerInfo.GST_No) newErrors.GST_No = "GST No is required";
    if (!deliveryAddress.doorNo) newErrors.doorNo = "Address 1 is required";
    if (!deliveryAddress.streetName)
      newErrors.streetName = "Address 2 is required";
    if (!deliveryAddress.city) newErrors.city = "City is required";
    if (!deliveryAddress.zip) newErrors.zip = "ZIP Code is required";
    return newErrors;
  };

  const getInvoiceData = (invoiceId) => ({
    invoiceId: invoiceId,
    name: buyerInfo.name,
    address1: deliveryAddress.doorNo,
    address2: deliveryAddress.streetName,
    city: deliveryAddress.city,
    state: deliveryAddress.state,
    landmark: deliveryAddress.landmark,
    pincode: deliveryAddress.zip,
    gst_no: buyerInfo.GST_No,
    product_name: purchaseData.productName,
    product_type: purchaseData.grade,
    product_quantity: purchaseData.quantity,
    total_amount: purchaseData.totalPrice,
    unitprice: purchaseData.totalPrice / purchaseData.quantity,
  });

  const getOrderDetails = (invoiceUrl, invoiceId) => ({
    invoiceId: invoiceId,
    companyname: buyerInfo.name,
    phone_no: buyerInfo.mobile,
    address1: deliveryAddress.doorNo,
    address2: deliveryAddress.streetName,
    city: deliveryAddress.city,
    state: deliveryAddress.state,
    email: buyerInfo.email,
    landmark: deliveryAddress.landmark,
    zip_code: deliveryAddress.zip,
    gst_no: buyerInfo.GST_No,
    requested_sample: sample_request,
    product_name: purchaseData.productName,
    product_type: purchaseData.grade,
    product_quantity: purchaseData.quantity,
    total_amount: purchaseData.totalPrice,
    payment_status: false,
    delivery_status: false,
    payment_verified: false,
    invoiceUrl,
  });

  const generateUpiUrl = () => {
    const totalAmountWithGST = purchaseData.totalPrice;
    const upiId = "8639656196@ybl";
    const name = "kotesh";
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${totalAmountWithGST}&cu=INR`;
  };

  const [locationError, setLocationError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;

    let updatedData = { [name]: value };

    if (name === "city") {
      const state = cityToStateMap[value] || "";
      updatedData = { ...updatedData, state };
    }

    if (section === "buyerInfo") {
      setBuyerInfo({ ...buyerInfo, ...updatedData });
    } else if (section === "deliveryAddress") {
      setDeliveryAddress({ ...deliveryAddress, ...updatedData });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateLocation = (city) => {
    const locations = [
      "Chennai",
      "Bangalore",
      "AndhraPradesh",
      "Hyderabad",
      "Delhi",
      "Mumbai",
    ];
    if (!locations.includes(city)) {
      setLocationError("Sorry, delivery not possible at your location");
    } else {
      setLocationError("");
    }
  };
  const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: Success_icon,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="paymentpage-container">
      {/* <NavBar/> */}
      <ToastContainer />
      <h2 className="paymentpage--h2">Payment Summary</h2>

      <Modal
        onCancel={() => {
          setModelOpen(false);
        }}
        open={isModalOpen}
        footer={null}
      >
        <>
          <div className="success-box">
            <Lottie options={defaultOptions2} height={200} width={200} />
            <h2>Ordered Placed Successfully</h2>
            <h4 style={{ color: "blue" }}>
              Our Business Associate will reach out to you shortly via mail
            </h4>
            <div style={{ marginLeft: "150px" }}>
              <p style={{ color: "gray", textAlign: "left" }}>
                For Queries contact us :<br />
                Mobile : +91 8723745747 <br /> Email : support@b2bhubindia.com
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="modal-button"
            >
              Explore Products
            </button>
          </div>
        </>
      </Modal>
      <div className="payment-page">
        {/* <div className="payment--details--summary"> */}
        <div className="payment-summary">
          <h3>order summary</h3>
          <div className="summary-item">
            <span>Total Price:</span>{" "}
            <span>₹ {formatIndianNumber(purchaseData.totalPrice)}</span>
          </div>

          <div className="summary-item">
            <span>GST (Exempted):</span>{" "}
            <span>₹ {formatIndianNumber(purchaseData.gstAmount)}</span>
          </div>
          <span className="line---divider"></span>
          <div className="summary-item total-amount">
            <span>Total Amount:</span>{" "}
            <span className="res-total">
              ₹ {formatIndianNumber(purchaseData.totalPrice)}
            </span>
          </div>
        </div>

        <div className="payment-details">
          {/* <div className="qr-code"> */}
          {/* <QRCode
              value={generateUpiUrl()}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                height: 40,
                width: 40,
                excavate: true,
              }}
            /> */}
          {/* <p htmlFor="qrcode">Scan the QR to Proceed with the Payment</p> */}
          {/* </div> */}
          <div className="bank-details">
            <h3>Bank Details</h3>
            <p>
              <strong>Account Number:</strong> 3940002100057010
            </p>
            <p>
              <strong>IFSC Code:</strong> PUNB03940000
            </p>
            <p>
              <strong>Bank Name:</strong> Punjab National Bank
            </p>
          </div>
        </div>
        {/* </div> */}

        {/* <div className="container"> */}
        <div className="buyer-info">
          <h3>Buyer Information</h3>
          <div className="form-section">
            <label>
              <span style={{ color: "red" }}>*</span>Company Name:
            </label>
            <input
              readOnly
              type="text"
              name="name"
              value={buyerInfo.name}
              onChange={(e) => handleInputChange(e, "buyerInfo")}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-section">
            <label>
              <span style={{ color: "red" }}>*</span>Phone No:
            </label>
            <input
              readOnly
              type="text"
              name="mobile"
              value={buyerInfo.mobile}
              onChange={(e) => handleInputChange(e, "buyerInfo")}
            />
            {errors.mobile && <p className="error-message">{errors.mobile}</p>}
          </div>
          <div className="form-section">
            <label>
              <span style={{ color: "red" }}>*</span>Email:
            </label>
            <input
              readOnly
              type="email"
              name="email"
              value={buyerInfo.email}
              onChange={(e) => handleInputChange(e, "buyerInfo")}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-section">
            <label>
              <span style={{ color: "red" }}>*</span>GST No:
            </label>
            <input
              readOnly
              type="text"
              name="GST_No"
              value={buyerInfo.GST_No}
              onChange={(e) => handleInputChange(e, "buyerInfo")}
            />
            {errors.GST_No && <p className="error-message">{errors.GST_No}</p>}
          </div>
        </div>

        <div className="delivery-address">
          <h3>Delivery Address</h3>
          <div className="row">
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>Address Line 1:
              </label>
              <input
                type="text"
                placeholder="Door No. , Street Address , c/o"
                name="doorNo"
                value={deliveryAddress.doorNo}
                onChange={(e) => handleInputChange(e, "deliveryAddress")}
              />
              {errors.doorNo && (
                <p className="error-message">{errors.doorNo}</p>
              )}
            </div>
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>Address Line 2:
              </label>
              <input
                placeholder="Apartment, Building , floor"
                type="text"
                name="streetName"
                value={deliveryAddress.streetName}
                onChange={(e) => handleInputChange(e, "deliveryAddress")}
              />
              {errors.streetName && (
                <p className="error-message">{errors.streetName}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>City:
              </label>
              <select
                id="select-fieldforCity"
                name="city"
                value={deliveryAddress.city}
                onChange={(e) => handleInputChange(e, "deliveryAddress")}
              >
                <option value="">Select City</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
              </select>
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>State:
              </label>
              <input
                type="text"
                name="state"
                value={deliveryAddress.state}
                readOnly
              />
            </div>
          </div>
          <div className="zip-landmark-row">
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>Landmark:
              </label>
              <input
                type="text"
                name="landmark"
                value={deliveryAddress.landmark}
                onChange={(e) => handleInputChange(e, "deliveryAddress")}
              />
            </div>
            <div className="form-section">
              <label>
                <span style={{ color: "red" }}>*</span>PIN Code:
              </label>
              <input
                type="text"
                name="zip"
                value={deliveryAddress.zip}
                onChange={(e) => handleInputChange(e, "deliveryAddress")}
              />
              {errors.zip && <p className="error-message">{errors.zip}</p>}
            </div>
          </div>
          <div className="sample--request--radioBtn">
            <input
              type="checkbox"
              name="sample_request"
              value={sample_request}
              onChange={(e) => handleSampleRequest(e)}
            />
            <label>Request for Sample (optional)</label>
          </div>
        </div>
        {/* </div> */}

        {/* <div className="payment--info--remainder"> */}
        <div className="info-container">
          <h3>Delivery Details</h3>
          <p>Delivery Takes 3 to 7 business days from the date of Payment</p>
          <b>
            <p style={{ color: "red" }}>**Conditions Apply</p>
          </b>
          <b>
            <p>The samples can be sent to the provided address on request</p>
          </b>
          {!isOrderSuccesful ? (
            <button disabled={disableBtn} onClick={handleConfirmOrder}>
              {proceedPaymentText}
            </button>
          ) : (
            <h3 style={{ color: "green" }}>Thank you for the Business</h3>
          )}
        </div>
        <div className="remainder-container">
          <p>Send the Payment Transaction Details to this Mail </p>
          <div className="remainder-email">
            <input
              type="email"
              readOnly
              placeholder="support@b2bhubindia.com"
            />
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default PaymentPage;
