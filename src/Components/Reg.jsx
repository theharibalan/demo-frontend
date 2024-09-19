import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Success_icon from "../assets/succesful_json.json";
import Lottie from "react-lottie";
import whatsappQR from "../assets/whatsappQr.png";
import { FaWhatsapp } from "react-icons/fa";

const defaultOptions2 = {
  loop: false,
  autoplay: true,
  animationData: Success_icon,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const Reg = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setModelOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const purchaseData = location.state;
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (values) => {
    setIsLoading(true);
    localStorage.setItem("loginstate", "true");

    console.log(values);
    localStorage.setItem("companyname", values.name);
    localStorage.setItem("email", values.email);
    localStorage.setItem("gst", values.gst);
    localStorage.setItem("phone", values.phone);

    localStorage.setItem("userEmail", values.email);
    const regData = {
      Email: values.email,
      Pan_No: values.pan_no,
      GST_No: values.gst,
      Mobile_No: values.phone,
      Company_Name: values.name,
      Pwd: values.password,
    };
    const erpRegData = {
      Email: values.email,
      PAN: values.pan_no,
      gstNo: values.gst,
      phoneNo: values.phone,
      CompanyName: values.name,
      Password: values.password,
    };
    const erp_reg_url = `${process.env.REACT_APP_BACKEND_URL}/b2b/customer-registration`;

    axios
      .post(erp_reg_url, erpRegData)
      .then((res) => {
        localStorage.setItem("customerId", res.data.customerId);
        localStorage.setItem("token", res.data.token);

        setModelOpen(true);
      })
      .catch((err) => {
        if (err.status === 409) {
          toast.error("Email or Pan or GST already exist.", { position: "top-center" });
        } else {
          toast.error("Error Registering the User", { position: "top-center" });
        }
      });
  };

  return (
    <div
      className="bggram"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5rem",
        padding: "2rem",
      }}
    >
      <div className="resp-reg new-reg-class">
        {localStorage.getItem("loginstate") === "false" &&
        localStorage.getItem("ispayment") === "true" ? (
          <h3>Please Register Before you Proceed with Payment</h3>
        ) : (
          <>
          <h1>New Registration</h1><br /></>
        )}

        <Form
          className="resp-form"
          form={form}
          layout="horizontal"
          labelCol={{ span: 8, style: { textAlign: "left" } }}
          onFinish={handleRegister}
        >
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pan_no"
            label="PAN No"
            rules={[
              { required: true, message: "Please enter your PAN number" },
              {
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message:
                  "PAN number must follow the proper format (e.g., ABCDE1234F)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gst"
            label="GST No"
            rules={[
              { required: true, message: "Please enter your GST number" },
              {
                pattern:
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message:
                  "Enter Valid GST number. GST format (e.g., 22ABCDE1234F1Z5)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Form.Item>
              <Button
                className="responsive-reg-btn"
                type="primary"
                htmlType="submit"
              >
                {isLoading ? (
                  <>
                    <Spin
                      indicator={<LoadingOutlined spin />}
                      size="small"
                      color="white"
                    />{" "}
                    {"Registering ..."}
                  </>
                ) : (
                  "Register"
                )}
              </Button>
              <br />
              <br />
              <div>
                Click here for {" "}
                <span
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() =>
                    navigate("/b2b-terms-&-Conditions", { state: { navigateTo: "products" } })
                  }
                >
                  **Terms & Conditions
                </span>
              </div>
              <div>
                Already Registered?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() =>
                    navigate("/login", { state: { navigateTo: "products" } })
                  }
                >
                  login here
                </span>
              </div>
            </Form.Item>
          </div>
        </Form>
        <ToastContainer />
      </div>
      <Modal
        onCancel={() => {
          setModelOpen(false);
        }}
        open={isModalOpen}
        footer={null}
      >
        <>
          <div className="success-box">
            <h2>Registered Successfully</h2>
            <Lottie options={defaultOptions2} height={100} width={100} />
            <h4 style={{ color: "blue" }}>
              Please Scan the QR Code below to Receive the whatsapp updates
            </h4>
            <div style={{ marginBottom: "1em" }}>
              <img
                style={{ width: "40%", height: "auto" }}
                src={whatsappQR}
                alt="whatsappQr"
              />
              <br />
            </div>
            <div className="Reg-Success-buttons">
              <button
                style={{ marginRight: "1em" }}
                onClick={() =>
                  window.open(
                    "http://wa.me/+14155238886?text=join%20bear-behavior"
                  )
                }
                className="button-7"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    gap: "2rem",
                  }}
                >
                  <FaWhatsapp style={{ fontSize: "1.2em" }} /> Open Whatsapp
                </span>
              </button>
              <button
                onClick={() => {
                  if (localStorage.getItem("ispayment") === "true") {
                    setIsLoading(false);
                    navigate("/payments", { state: purchaseData });
                  } else {
                    navigate("/products");
                  }
                }}
                className="button-7"
              >
                Explore Products
              </button>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default Reg;
