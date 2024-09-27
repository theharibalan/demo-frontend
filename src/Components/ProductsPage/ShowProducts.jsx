import React, { useState } from "react";
import {
  Select,
  Card,
  Modal,
  Button,
  Input,
  Form,
  Alert,
  message,
  Checkbox,
} from "antd";
import "./ProductsStyle.css";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { openTermsnd } from "../PageComponents/DownoadTANDC";
import moongdal from "../../assets/moongdal_main.jpg";
import moongdal_GradeA from "../../assets/moong dal grade 1.jpg";
import moongdal_GradeB from "../../assets/moong dal grade 2 (1).jpg";
import moongdal_GradeC from "../../assets/moong dal grade 3.jpg";
import toordal from "../../assets/toor dal main.jpeg";
import toordal_GradeA from "../../assets/toor dal grade-1.jpeg";
import toordal_GradeB from "../../assets/toor dal grade-2.jpg";
import toordal_GradeC from "../../assets/toor dal grade-3.jpeg";
import uraddal from "../../assets/urad dal main.png";
import uraddal_GradeA from "../../assets/urad dal grade 1.jpeg";
import uraddal_GradeB from "../../assets/urad dal grade 2.jpeg";
import uraddal_GradeC from "../../assets/urad dal grade 3.jpeg";
import gramdal from "../../assets/gram dal main.webp";
import gramdal_GradeA from "../../assets/gram dal grade-1.jpg";
import gramdal_GradeB from "../../assets/gram dal grade-2.jpg";
import gramdal_GradeC from "../../assets/gram dal grade-3.jpg";
import ProductComparisonModal from "./ComparisionTable";
import Navbar from "../PageComponents/Navbar";
const { Option } = Select;
const data = {
  LocationOffers: {
    Chennai: 20,
    Bangalore: 15,
    AndhraPradesh: 10,
    Hyderabad: 20,
    OtherLocations: {
      Delhi: 12,
      Mumbai: 18,
    },
  },
  Products: [
    {
      name: "MoongDal",
      CommonImage: moongdal,
      costPerUnit: [
        {
          grade: "GradeA",
          PricePerUnit: 99,
          Image: moongdal_GradeA,
          description: (
            <p>
              Highest quality Moong Dal.
              <br /> Harvested Best before 3 months
            </p>
          ),
        },
        {
          grade: "GradeB",
          PricePerUnit: 90,
          Image: moongdal_GradeB,
          description: (
            <p>
              Highest quality Moong Dal.
              <br /> Harvested Best before 9 months
            </p>
          ),
        },
        {
          grade: "GradeC",
          PricePerUnit: 80,
          Image: moongdal_GradeC,
          description: (
            <p>
              Highest quality Moong Dal.
              <br /> Harvested Best before 12 months
            </p>
          ),
        },
      ],
    },
    {
      name: "ToorDal",
      CommonImage: toordal,
      costPerUnit: [
        {
          grade: "GradeA",
          PricePerUnit: 100,
          Image: toordal_GradeA,
        },
        {
          grade: "GradeB",
          PricePerUnit: 90,
          Image: toordal_GradeB,
        },
        {
          grade: "GradeC",
          PricePerUnit: 80,
          Image: toordal_GradeC,
        },
        {
          grade: "GradeD",
          PricePerUnit: 75,
          Image: toordal_GradeA,
        },
      ],
    },
    {
      name: "UradDal",
      CommonImage: uraddal_GradeC,
      costPerUnit: [
        {
          grade: "GradeA",
          PricePerUnit: 100,
          Image: uraddal_GradeA,
        },
        {
          grade: "GradeB",
          PricePerUnit: 90,
          Image: uraddal_GradeB,
        },
        {
          grade: "GradeC",
          PricePerUnit: 80,
          Image: uraddal_GradeC,
        },
        {
          grade: "GradeD",
          PricePerUnit: 75,
          Image: uraddal,
        },
      ],
    },
    {
      name: "GramDal",
      CommonImage: gramdal,
      costPerUnit: [
        {
          grade: "GradeA",
          PricePerUnit: 100,
          Image: gramdal_GradeA,
        },
        {
          grade: "GradeB",
          PricePerUnit: 90,
          Image: gramdal_GradeB,
        },
        {
          grade: "GradeC",
          PricePerUnit: 80,
          Image: gramdal_GradeC,
        },
        {
          grade: "GradeD",
          PricePerUnit: 75,
          Image: gramdal_GradeA,
        },
      ],
    },
    // Add other products here...
  ],
};

// Utility function to format numbers as Indian currency
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

const ProductPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [gradeDetails, setGradeDetails] = useState({});
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const gunnyBagCost = 5;
  const gstRate = 0.05;
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [termsAndConsModal, setTermsAndConsModal] = useState(false);

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };
  const openTermsAndConsModal = () => {
    setTermsAndConsModal(true);
  };

  const openTermsModal = () => {
    setTermsModalVisible(true);
  };
  const closeTermsandConsModal = () => {
    setTermsAndConsModal(false);

  }
  const closeTermsModal = () => {
    setTermsModalVisible(false);
  };
  const calculateDiscountedPrice = (price) => {
    const discount =
      data.LocationOffers[selectedLocation] ||
      data.LocationOffers.OtherLocations[selectedLocation] ||
      0;
    return (price - (price * discount) / 100).toFixed(2);
  };
  const showGradeDetails = (grade) => {
    setGradeDetails(grade);
    setGradeModalVisible(true);
  };
  const showMoreDetails = (product) => {
    setModalContent(product);
    setIsDetailsModalVisible(true);
  };

  const openOrderModal = (product) => {
    setModalContent(product);
    setIsOrderModalVisible(true);
  };

  const closeModal = () => {
    setGradeModalVisible(false);

    setIsDetailsModalVisible(false);
    setIsOrderModalVisible(false);
    setErrorMessage(""); // Reset error message on close
  };

  const handleOrderSubmit = (values) => {
    const { grade, quantity } = values;
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

    const pricePerUnit = parseFloat(
      calculateDiscountedPrice(selectedGrade.PricePerUnit)
    );
    const totalPrice = pricePerUnit * quantityTons * 1000; // Convert tons to kg
    const gunnyBagsRequired = Math.ceil((quantityTons * 1000) / 50); // 50 kg per gunny bag
    const gunnyBagTotal = gunnyBagsRequired * gunnyBagCost;
    const gstAmount = (totalPrice + gunnyBagTotal) * gstRate;
    const checkoutAmount = totalPrice + gunnyBagTotal + gstAmount;

    setTotalAmount(checkoutAmount);
    setBreakdown({
      totalPrice,
      gunnyBagTotal,
      gstAmount,
      checkoutAmount,
    });
  };

  const toggleTableExpand = (productName) => {
    setExpandedProduct(expandedProduct === productName ? null : productName);
  };

  const renderTableRows = (costPerUnit, productName) => {
    const isExpanded = expandedProduct === productName;
    const visibleRows = isExpanded ? costPerUnit : costPerUnit.slice(0, 2);

    return (
      <>
        {visibleRows.map((item, index) => (
          <tr key={index}>
            <td>{item.grade}</td>
            <td>₹ {calculateDiscountedPrice(item.PricePerUnit)}</td>
            <td>
              <Button type="link" onClick={() => showGradeDetails(item)}>
                Show Details
              </Button>
            </td>
          </tr>
        ))}
        {costPerUnit.length > 2 && (
          <tr>
            <td
              colSpan={3}
              className="show-more-link"
              onClick={() => toggleTableExpand(productName)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </td>
          </tr>
        )}
      </>
    );
  };

  const handleCheckboxinput = (e) => {
    // if(!isDownloaded){
    //   message.error("Please go through all the terms and conditions")
    // }

    setIsChecked(e.target.checked);
  };
  const handlePaymentCheckout = () => {
    if (isChecked) {
      const data = {
        totalPrice: breakdown.totalPrice,
        gunnyBagTotal: breakdown.gunnyBagTotal,
        gstAmount: breakdown.gstAmount,
        checkoutAmount: breakdown.checkoutAmount,
      };
      closeModal();
      navigate("/payments", { state: data });
    } else {
      message.error(
        "Please agree to the terms and conditions to proceed to payment."
      );
    }
  };

  return (
    <div className="allproductspage-container">
      <div className="Productspage-container">
        <div style={{ textAlign: "right" }} className="region-container">
        <Button
          type="primary"
          style={{ marginRight: "40px" }}
          onClick={() => setModalIsOpen(true)}
        >
          Compare Products
        </Button>
        <ProductComparisonModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          products={data.Products}
          locationOffers={data.LocationOffers}
        />
        <label style={{ fontWeight: "500" }} htmlFor="Select">
          Select your Region :{" "}
        </label>
        <Select
          className="location-selector"
          defaultValue={selectedLocation}
          onChange={handleLocationChange}
        >
          {Object.keys(data.LocationOffers).map((location) => (
            <Option key={location} value={location}>
              {location}
            </Option>
          ))}
        </Select>
      </div>
      <div className="product-grid">
        {data.Products.map((product, index) => (
          <Card
            className="product-card"
            key={index}
            cover={
              <img
                className="product-image"
                alt={product.name}
                src={product.CommonImage}
              />
            }
          >
            <div className="card-content">
              <h3>{product.name}</h3>
            </div>
            <Button
              onClick={() => openOrderModal(product)}
              // onClick={() => navigate("/cart",{state:product})}
              className="checkout-button "
            >
              Place Order
            </Button>
          </Card>
        ))}
      </div>
      <Modal
        title="Product Details"
        visible={isDetailsModalVisible}
        onCancel={closeModal}
        footer={
          <div className="modal-footer">
            <Button onClick={closeModal}>Close</Button>
          </div>
        }
      >
        {modalContent.costPerUnit &&
          modalContent.costPerUnit.map((item, index) => (
            <div className="modal-content" key={index}>
              <img
                className="modal-image"
                alt={item.grade}
                src={item.Image}
              />
              <div>
                <h4>{item.grade}</h4>
                <p>
                  Price Per Unit: ₹{" "}
                  {calculateDiscountedPrice(item.PricePerUnit)}
                </p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
      </Modal>
      <Modal
        title="Order Summary"
        visible={isOrderModalVisible}
        onCancel={closeModal}
        footer={
          <div className="modal-footer">
            <Button onClick={closeModal}>Close</Button>
          </div>
        }
      >
        <Form form={form} onFinish={handleOrderSubmit} layout="vertical">
          <Form.Item
            name="grade"
            label="Select Grade"
            rules={[{ required: true, message: "Please select a grade!" }]}
          >
            <Select placeholder="Select Grade">
              {modalContent.costPerUnit &&
                modalContent.costPerUnit.map((item) => (
                  <Option key={item.grade} value={item.grade}>
                    {item.grade}
                  </Option>
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
            Calculate Total
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
                  <td>Price Charged for Gunny Bags:</td>
                  <td>₹ {formatIndianNumber(breakdown.gunnyBagTotal)}</td>
                </tr>
                <tr>
                  <td>GST:</td>
                  <td>₹ {formatIndianNumber(breakdown.gstAmount)}</td>
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
                  <td colSpan="2">
                    <button
                      className="checkout-button"
                      onClick={openTermsModal}
                    >
                      Checkout to Payment
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      <Modal
        title={`Details of ${gradeDetails.grade}`}
        open={gradeModalVisible}
        onCancel={closeModal}
        footer={
          <div className="modal-footer">
            <Button onClick={closeModal}>Close</Button>
          </div>
        }
      >
        <div className="grade-details">
          <img
            style={{ width: "450px", textAlign: "center" }}
          src={gradeDetails.Image}
          alt={gradeDetails.grade}
            />
          <div>
            <h4>{gradeDetails.grade}</h4>
            <p>
              Price Per Unit: ₹{" "}
              {calculateDiscountedPrice(gradeDetails.PricePerUnit)}
            </p>
            <p className="description">{gradeDetails.description}</p>
          </div>
        </div>
      </Modal>{" "}
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

        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>
            1. Introduction
          </h2>
          <p>
            These Terms and Conditions govern the purchase and use of
            digital products offered on this platform. By purchasing any
            digital product, you agree to these terms.
          </p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>
            2. License and Use
          </h2>
          <p>
            Upon purchase, you are granted a non-exclusive, non-transferable
            license to use the digital product for personal or professional
            use. Redistribution, reselling, or sharing of the digital
            product is strictly prohibited.
          </p>
        </section>

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
      >
        {/* <Checkbox
                disabled={isDownloaded}
                checked={isChecked}
                onChange={handleCheckboxinput}
              >
                <span style={{ margin-left: "8px" }}>
                  By purchasing our digital products, you acknowledge that you
                  have read, understood, and agree to these Terms and
                  Conditions.
                </span>
              </Checkbox> */}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
      <Button
        disabled={!isChecked}
        type="primary"
        onClick={handlePaymentCheckout}
      >
        Proceed to Payment
      </Button>
    </div>
          </div >
        </Modal >
  <Modal
    open={termsAndConsModal}
    onCancel={closeTermsandConsModal}
    onOk={closeTermsandConsModal}
    bodyStyle={{ height: "80vh", overflowY: "auto", top: "1vh" }}
  >
    <div className="terms">
      <h4>Terms & Conditions</h4>
      <p>
        1. Introduction These Terms and Conditions govern the purchase and
        use of digital products offered on this platform. By purchasing
        any digital product, you agree to these terms.
      </p>
      <p>
        2. License and Use Upon purchase, you are granted a non-exclusive,
        non-transferable license to use the digital product for personal
        or professional use. Redistribution, reselling, or sharing of the
        digital product is strictly prohibited.
      </p>
      <p>
        3. Payment All payments must be made in full before accessing the
        digital product. We accept payments through various methods as
        indicated at checkout. All transactions are secure and encrypted.
      </p>
      <p>
        4. Refund Policy Due to the digital nature of the products, all
        sales are final. Refunds are not provided unless required by law.
        We recommend reviewing the product details and any provided
        samples before making a purchase.
      </p>
      <p>
        5. Intellectual Property All digital products are the intellectual
        property of the respective creators. Unauthorized use,
        reproduction, or distribution of these products is prohibited and
        may result in legal action.
      </p>
      <p>
        6. Limitation of Liability We are not liable for any damages
        resulting from the use or inability to use the digital products.
        Our maximum liability to you shall not exceed the amount you paid
        for the product.
      </p>
      <p>
        7. Changes to Terms We reserve the right to modify these Terms and
        Conditions at any time. Any changes will be effective immediately
        upon posting on this page. Continued use of the products after
        changes are posted constitutes your acceptance of the new terms.
      </p>
      <p>
        8. Contact Information If you have any questions or concerns about
        these Terms and Conditions, please contact us at
        support@yourdomain.com.
      </p>
      <Checkbox
        disabled={isDownloaded}
        checked={isChecked}
        onChange={handleCheckboxinput}
      >
        <span style={{ marginLeft: "8px" }}>
        By purchasing our digital products, you acknowledge that you
        have read, understood, and agree to these Terms and
        Conditions.
      </span>
    </Checkbox>
  </div>
  </Modal >
      </div >
    </div >
  );
};

export default ProductPage;
