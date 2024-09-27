import React, { useEffect, useState } from "react";
import { message, Spin, Tabs, Modal } from "antd";
import AdminPage from "../Admin";
import SellerPage from "./SellerPage";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import "antd/dist/reset.css";
import * as pending from "../../../assets/pendingLottie.json";
import Lottie from "react-lottie";
import "./SuperAdmin.css";
import GenerateCommercialDocs from "./SuperAdminComponents/GenerateCommercialDocs";

const SuperAdmin = () => {
  const [adminemail, setAdminEmail] = useState("");
  const [adminpassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noOfPending, setNoOfPending] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminLogin, setAdminLogin] = useState(
    localStorage.getItem("admin-token")
  );

  const [valid, setValid] = useState(false);
  const [otp, setOtp] = useState("");
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.error("Admin token not found");
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/getorders`;
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orders = res.data.reverse();

      const currentDate = new Date().toLocaleDateString("en-GB");

      const todayPendingOrders = orders.filter((order) => {
        const orderDate = order.date_of_order;

        return orderDate === currentDate && order.payment_status === 0;
      });

      setNoOfPending(todayPendingOrders.length);

      console.log(
        "Number of pending orders for today:",
        todayPendingOrders.length
      );
      setIsModalVisible(true);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const defaultOptions1 = {
    loop: false,
    autoplay: true,
    animationData: pending,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/admin/adminLoginVerify`, {
        email: adminemail,
        otp: otp,
        password: adminpassword,
      })
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          localStorage.setItem("admin-token", res.data.token);
          localStorage.setItem("admin-role", res.data.role);
          localStorage.setItem("adminEmpId", res.data.empId);
          localStorage.setItem('activeTab', "1")
          setAdminLogin(true);
          message.success("Login Successful..!");
          setIsLoading(false);
        }
        if (res.status === 401) {
          console.log(res.error);
          message.error(res.error);
          setIsLoading(false);
        }
      }).catch((err) => {
        console.log(err);
        message.error('Failed to Login');
        setIsLoading(false);
      });
  };
  const handleAdminLogin = () => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/adminLoginRequest`;
    axios
      .post(url, { email: adminemail })
      .then((res) => {

        setValid(true);
        setIsLoading(false);
      })
      .catch((err) => {
        message.error("Invalid Credentials");
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {adminLogin ? (
        <div>
          <Tabs defaultActiveKey={localStorage.getItem('activeTab')} className="custom-tabs">
            <Tabs.TabPane tab="Buyers" key="1">
              <AdminPage />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Sellers" key="2">
              <SellerPage />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Commercial Docs" key="3">
              <GenerateCommercialDocs />
            </Tabs.TabPane>
          </Tabs>
        </div>
      ) : (
        <div className="login_form_container">
          {valid ? (
            <div className="login--form_">
              <form onSubmit={verifyOtp}>
                <div className="login_form_container__input-box">
                  <label>OTP</label>
                  <input
                    className="login_form_container__input"
                    type="text"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="login_form_container__input-box">
                  <label>Password</label>
                  <input
                    className="login_form_container__input"
                    type="password"
                    placeholder="Enter Admin Password"
                    value={adminpassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
                <button
                  className="login_form_container__btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spin
                        indicator={<LoadingOutlined spin />}
                        size="small"
                        color="white"
                        style={{ marginRight: '10px' }}
                      />Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="login--form_">
              <h1 className="login_form_contianer__title">Admin Login</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdminLogin();
                }}
              >
                <div className="login_form_container__input-box">
                  <label>Email</label>
                  <input
                    className="login_form_container__input"
                    type="text"
                    placeholder="Enter Admin Email"
                    value={adminemail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <button
                  className="login_form_container__btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spin
                        indicator={<LoadingOutlined spin />}
                        size="small"
                        color="white"
                        style={{ marginRight: '10px' }}
                      />Verifying...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SuperAdmin;
