import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import { Modal } from "antd";
import GoogleTag from "./GoogleTag";
const LoginForm = () => {
  const navigate = useNavigate();
  localStorage.setItem("loginstate", "false");
  const location = useLocation();
  const [email, setEmial] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const state = location.state;

  const [verifyemail, setVerifyEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");


  
  const handleEmailChange = (e) => {
    setVerifyEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) setConfirmPasswordError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    if (!validateEmail(verifyemail)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (isValid) {
      // Create JSON object from state values
      const resetdata = {
        Email: verifyemail,
        password: newPassword,
        confirmPassword: confirmPassword,
      };

      axios
        .post(
          "https://b2b-backend-uvpc.onrender.com/user/resetpassword",
          resetdata
        )
        // axios.post("${process.env.REACT_APP_BACKEND_URL}/user/resetpassword",resetdata)
        .then((res) => {
          setShowForgot(false);
          toast.success("Password Reset Successful", {
            position: "top-center",
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error resetting password", { position: "top-center" });
        });
    }
  };

  const handleForgot = () => {
    navigate("/forgot");
  }

  const handleShowForgot = (e) => {
    e.preventDefault();
    setShowForgot(true);
  };

  const handleCloseForgot = () => {
    setShowForgot(false);
  };

  const handleLogin = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/login`;
    axios
      .post(url, 
        { email: email, pwd: password ,isSeller:false},
        )
      .then((res) => {
        if (res.status === 200) {
          console.log("user data antara babu",res.data.user)
          const customer = res.data.user;
          toast.success("Login Successful!", { position: "top-center" }); 
          localStorage.setItem("token", res.data.token); 
          localStorage.setItem("loggedas","Buyer Page");
          localStorage.setItem("loginstate", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("customerId", customer.customerId);
          localStorage.setItem("companyname", customer.CompanyName);
          localStorage.setItem("phone", customer.phoneNo);
          localStorage.setItem("gst", customer.gstNo);
          localStorage.setItem("email", customer.Email);

          if (state.navigateTo === "products") {
            setTimeout(() => {
              navigate("/products");
            }, 1000);
          }
          if (state.navigateTo === "orders") {
            setTimeout(() => {
              navigate("/orders");
            }, 1000);
          }
          if(state.navigateTo === "payments"){
            navigate("/payments/upload-payment")
          }
          
          else {
            setTimeout(() => {
              navigate("/products");
            }, 1000);
          }
        } else {
          console.log("Error ra ikkada");
          toast.error(res.data, { position: "top-center" });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("Error ra bhayya", err);
        setIsLoading(false);
        toast.error("Invalid Credentials", { position: "top-center" });
      });
  };

  return (
    <>
    <GoogleTag/>
      <ToastContainer />
      <div className="bggram">
      <div className="login_form_contianer">
        <h1 className="admin-login_form_contianer__title">Buyer Login</h1>
        <form className="login_form_contianer__form">
          <div className="login_form_contianer__input-box">
            <input
              onChange={(e) => setEmial(e.target.value)}
              type="text"
              placeholder="Email"
              required
              className="login_form_contianer__input"
            />
          </div>

          <div className="login_form_contianer__input-box">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={!showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="login_form_contianer__input password-input"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="login_form_contianer__btn"
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
          <a
            style={{ marginTop: "10px" }}
            href=""
            className="login_form_contianer__forgotPswd"
            onClick={handleForgot}
          >
            Forgot Password
          </a>

          <Modal
            open={showForgot}
            footer={null}
            onCancel={() => setShowForgot(false)}
          >
            <div style={{ margin: "0 auto" }} className="forgot-modal">
              <div className="forgot-modal-content">
                <h2 style={{ margin: "10px 0 30px" }}>Forgot password?</h2>
                <form
                  className="login_form_contianer__form"
                  onSubmit={handleSubmit}
                >
                  <div className="forgot-form-group">
                    <input
                      type="email"
                      id="forgot-email"
                      className={
                        emailError
                          ? "login_form_contianer__input-box forgot-error"
                          : "login_form_contianer__input-box"
                      }
                      value={verifyemail}
                      placeholder="Enter your email"
                      onChange={handleEmailChange}
                      required
                    />
                    {emailError && (
                      <p className="forgot-error-message">{emailError}</p>
                    )}
                  </div>
                  <div className="new-password-section">
                    <input
                      type="password"
                      id="new-password"
                      placeholder="New Password"
                      className={
                        passwordError
                          ? "new-password-error login_form_contianer__input-box"
                          : "login_form_contianer__input-box"
                      }
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                    {passwordError && (
                      <p className="password-error-message">{passwordError}</p>
                    )}
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="Confirm Password"
                      className={
                        confirmPasswordError
                          ? "confirm-password-error login_form_contianer__input-box"
                          : "login_form_contianer__input-box"
                      }
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    {confirmPasswordError && (
                      <p className="confirm-password-error-message">
                        {confirmPasswordError}
                      </p>
                    )}

                    {isResetting ? (
                      <>
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                          color="white"
                        />{" "}
                        Resetting Password ...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                    <button
                      style={{ width: "90%", margin: "0 auto" }}
                      type="submit"
                      className="login_form_contianer__btn "
                    ></button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>

          <div className="login_form_contianer__register-link">
            <p>
              Don't have an account?{" "}
              <span
                style={{color:'red'}}
                onClick={()=>navigate("/reg")}
                className="login_form_contianer__register-link-anchor"
              >
                New Registration
              </span>
            </p>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default LoginForm;
