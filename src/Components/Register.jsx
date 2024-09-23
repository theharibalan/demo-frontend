import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import NavBar from "./PageComponents/Navbar";
import GoogleTag from "./GoogleTag";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = (values) => {
    // Example: Registration logic here
    console.log(values);

    toast.success("Successfully registered!");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5rem",
        padding: "2rem",
      }}
    >
      {/* <NavBar/> */}
      <div
        style={{ backgroundColor:"#f4f4f4", width: "400px", padding: "20px", border: "1px solid grey" }}
      >
        <GoogleTag/>
        <h2>Register Here</h2>
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="name"
            label="Name"
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
            name="gst"
            label="GST"
            rules={[
              { required: true, message: "Please enter your GST number" },
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;