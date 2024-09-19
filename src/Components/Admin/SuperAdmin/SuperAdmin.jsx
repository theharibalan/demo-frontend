import React, { useState } from "react";
import { message, Spin, Tabs } from "antd";
import AdminPage from "../Admin";
import SellerPage from "./SellerPage";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

import "./SuperAdmin.css";
import "./sa.css";

const SuperAdmin = () => {
  const [adminLogin, setAdminLogin] = useState(
    localStorage.getItem("admin-token") ? true : false
  );

  const [adminemail, setAdminEmail] = useState("");
  const [adminpassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [getOtp, setGetOtp] = useState("");

  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (otp === String(getOtp)) {
      setTimeout(() => {
        message.success("Login Successful");
        setAdminLogin(true);
        setIsLoading(false);
      }, 500);
    } else {
      message.error("Invalid OTP");
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleAdminLogin = () => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/adminLogin`;
    axios
      .post(url, { email: adminemail, password: adminpassword })
      .then((res) => {
        setGetOtp(res.data.otp);
        setIsLoading(false);
        localStorage.setItem("admin-token", res.data.token);
      })
      .catch((err) => {
        message.error("Invalid Credentials");
        setIsLoading(false); // Ensure loading state is reset
      });
  };

  return (
    <>
      {adminLogin ? (
        <div>
          <Tabs defaultActiveKey="1" className="custom-tabs">
            <Tabs.TabPane tab="Buyers" key="1">
              <AdminPage />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Sellers" key="2">
              <SellerPage />
            </Tabs.TabPane>
          </Tabs>
        </div>
      ) : (
        <div className="login_form_container ">
          {getOtp ? (
            <form onSubmit={verifyOtp}>
              <div className="login_form_container__input-box">
                <input
                  className="login_form_container__input"
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                    />{" "}
                    Verifying ...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          ) : (
            <div className="login--form_">
              <h1 className="login_form_contianer__title">Admin Login</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdminLogin();
                }}
              >
                <div
                  className="login_form_container__input-box"
                >
                  <label>Email</label>
                  <input
                    className="login_form_container__input"
                    type="text"
                    placeholder="Enter Admin Email"
                    value={adminemail}
                    onChange={(e) => setAdminEmail(e.target.value)}
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
                      />{" "}
                      Logging In..
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
