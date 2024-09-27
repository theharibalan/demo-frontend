import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "react-lottie";
import MembershipCards from "./MembershipCards/MembershipCards";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { message, Spin } from "antd";
import { Modal, Checkbox, Button, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import * as success from "../assets/success_lottie.json";
const LoginForm = () => {
  const navigate = useNavigate();
  localStorage.setItem("loginstate", "false");
  const location = useLocation();
  const [email, setEmial] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [Locationofuser, setLocationofuser] = useState();
  const [isResetting, setIsResetting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const state = location.state;

  const [verifyemail, setVerifyEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAndConsModal, setTermsAndConsModal] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  // const [isLottieVisible, setIsLottieVisible] = useState(false);
  const [isLottieModalVisible, setIsLottieModalVisible] = useState(false);
  const [sellerRegModal, setSellerRegModal] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const validateRegEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const locations = [
    "Select the city",
    "Chennai",
    "Bangalore",
    "Andhra Pradesh",
    "Hyderabad",
    "Delhi",
    "Mumbai",
  ];
  const handlesendotp = () => {
    if (validateRegEmail(email)) {
      alert("ok");
    } else {
      setIsEmailValid(false);
      return;
    }
  };
  const openTermsModal = () => {
    setTermsModalVisible(true);
  };

  const handleCheckboxinput = (e) => {
    setIsChecked(e.target.checked);
  };
  const closeTermsModal = () => {
    setTermsModalVisible(false);
  };
  const closeTermsandConsModal = () => {
    setTermsAndConsModal(false);
  };
  const openTermsandConsModal = () => {
    setTermsAndConsModal(true);
  };
  const handleOpenLottieModal = () => {
    setIsLottieModalVisible(true)
  }

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
  };

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
      .post(url, { email: email, pwd: password, isSeller: true })
      .then((res) => {
        console.log(res.status)
        if (res.status === 200) {
          const customer = res.data.user;
          toast.success("Login Successful!", { position: "top-center" });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("loggedas", "Seller Page");
          localStorage.setItem("loginstate", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("customerId", customer.customerId);
          localStorage.setItem("companyname", customer.CompanyName);
          localStorage.setItem("phone", customer.phoneNo);
          localStorage.setItem("gst", customer.gstNo);
          localStorage.setItem("email", customer.Email);

          if (state.navigateTo === "seller") {
            setTimeout(() => {
              navigate("/listofproducts");
            }, 1000);
          }
          if (state.navigateTo === "products") {
            setTimeout(() => {
              navigate("/listofproducts");
            }, 1000);
          }
          if (state.navigateTo === "orders") {
            setTimeout(() => {
              navigate("/orders");
            }, 1000);
          }
          if (state.navigateTo === "payments") {
            navigate("/payments/upload-payment");
          } else {
            setTimeout(() => {
              navigate("/listofproducts");
            }, 1000);
          }
        } else {
          toast.error(res.data, { position: "top-center" });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("err status is here ", err.status)
        if (err.status === 400) {
          setIsLoading(false);
          message.error("Please provide all the fields.")
        }
        if (err.status === 401) {
          setIsLoading(false);
          message.error("Incorrect Password")
        }
        if (err.status === 404) {
          setIsLoading(false);
          message.error("Invalid Credentials")
        }
        if (err.status === 403) {
          setIsLoading(false);
          message.error("Register as SELLER before you try logging in ")
        }
        if (err.status === 500) {
          setIsLoading(false);
          message.error("Internal server error.")
        }
      });
  };
  const defaultOptions1 = {
    loop: false,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleClosing = () => {
    navigate("/seller-login");
  };
  const handleLottieCancel = () => {
    // setIsLottieModalVisible(false);

    setTermsModalVisible(false);
    setIsLottieModalVisible(false);
  };
  const handleTermsClose = () => {
    setTermsModalVisible(false);
  };
  const [regEmail, setRegEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleRegEmailChange = (e) => {
    setRegEmail(e.target.value);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(e.target.value));
  };

  const handleSendOtp = async () => {
    if (otpSent) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/upgradeToSeller`;
        const res = await axios.put(url, { otp: otp, email: regEmail });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          setIsOtpVerified(true);
        }
      } catch (error) {
        console.log(error);
        toast.error("");
      }
    } else {
      if (isEmailValid && regEmail) {
        // const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/reqToUpgradeSeller`;
        const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/reqToUpgradeSeller`;
        console.log(regEmail);
        axios
          .post(url, { email: regEmail })
          .then((res) => {
            console.log("-----------", res.data.message);
            setOtpSent(true);

          })
          .catch((err) => {
            if (err.status === 404) {
              toast.error("Email Not Found  ", { position: "top-center" });
            } else {
              toast.error("Error Sending OTP", { position: "top-center" });
            }
          });
      }
    }
  };

  const handlesellerRegModal = () => {
    setSellerRegModal(false)
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const handleSellerRegistration = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/subcribe`;
    axios
      .put(
        url,
        { category: "GOLD", location: Locationofuser },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLottieModalVisible(true);
        message.success("Registered as Seller Successfully");
      })
      .catch((err) => {
        message.error("Error Registering as Seller");
      });
  };
  return (
    <>
      <ToastContainer />
      <div className="bggram">
        <div className="login_form_contianer" style={{padding: '20px 40px'}}>
          <p
            className="seller-login-newreg"
            style={{ fontSize: "1.2em", textAlign: "left", margin: "2em" }}
          >
          Don't have a B2BHub Account ? <br />
          <br />
          Click <a href="/reg">New Registration</a> for creating a B2BHub
          Account
        </p>
        <h1 className="admin-login_form_contianer__title">Seller Login</h1>
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
                      <p className="password-error-message">
                        {passwordError}
                      </p>
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
                        />
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

          <Modal
            title="Seller Registration"
            open={sellerRegModal}
            onCancel={() => setSellerRegModal(false)}
            footer={null}
          >
            {isOtpVerified ? (
              <>
                <MembershipCards location={Locationofuser} openLottieModal={handleOpenLottieModal} />
              </>
            ) : (
              <>
                <div>
                  <label style={{ marginRight: "20px", fontWeight: "bold" }}>
                    <span style={{ color: "red" }}>**</span>Enter Your Business Location:
                  </label>
                  <select
                    required
                    className="location-select"
                    onChange={(e) => {
                      setLocationofuser(e.target.value)
                    }}
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select> <br />
                  <label style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Enter Your Registered email:
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Mail"
                    value={regEmail}
                    onChange={handleRegEmailChange}
                  />
                </div>
                {(!isEmailValid || !regEmail) && (
                  <p style={{ color: "red" }}>Please input a valid email</p>
                )}

                {otpSent && (
                  <div style={{ marginTop: "20px" }}>
                    <label style={{ marginTop: "10px", fontWeight: "bold" }}>
                      Enter OTP:
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={handleOtpChange}
                    />
                  </div>
                )}
                <button
                  style={{ marginTop: "20px" }}
                  disabled={!isEmailValid || !regEmail}
                  onClick={handleSendOtp}
                  className="button-7"
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </>
            )}
          </Modal>

          <Modal
            open={termsAndConsModal}
            onCancel={() => setTermsAndConsModal(false)}
            onOk={() => {
              setTermsAndConsModal(false);
            }}
            style={{ overflowY: "auto", top: "2vh" }}
          >
            <div
              style={{ marginTop: "25px", height: "70vh", overflowY: "auto" }}
              className="terms"
            >
              <h2 style={{ textAlign:'center'}}>Mandate Terms & Conditions</h2 >
            <p>
              <strong>1. Introduction:</strong> These Terms and Conditions
              govern the use of the B2B Hub platform by sellers. By
              registering and selling products through B2B Hub, you agree to
              these terms and conditions as outlined below.
            </p>
            <p>
              <strong>2. Definitions:</strong> In this document, "Seller"
              refers to the individual or business entity offering products
              for sale on the B2B Hub platform, and "B2B Hub" refers to the
              platform operator. The term "Products" refers to any goods
              listed for sale by the Seller on the platform.
            </p>
            <p>
              <strong>3. Registration and Account Creation:</strong> Sellers
              must create an account to list products on B2B Hub. By
              registering, you confirm that you are authorized to sell
              products and conduct business on behalf of your entity. You
              agree to provide accurate and up-to-date information, and are
              responsible for maintaining the confidentiality of your
              account credentials.
            </p>
            <p>
              <strong>4. Product Listings and Compliance:</strong> Sellers
              are responsible for ensuring that their product listings are
              accurate, complete, and comply with applicable laws. All
              product descriptions, prices, and related information must be
              clearly presented. B2B Hub reserves the right to remove
              listings that are found to be misleading, fraudulent, or
              non-compliant with platform policies.
            </p>
            <p>
              <strong>5. Pricing and Payments:</strong> Sellers set the
              prices for their products. All transactions processed through
              the platform must adhere to B2B Hub’s payment policies.
              Sellers will receive payment for their sales according to the
              payment schedule outlined by B2B Hub, and the platform may
              deduct fees or commissions as applicable.
            </p>
            <p>
              <strong>6. Shipping and Fulfillment:</strong> Sellers are
              responsible for the timely fulfillment of orders. Products
              must be shipped according to the shipping terms specified at
              the time of sale. B2B Hub is not responsible for any delays in
              shipping or fulfillment caused by the Seller or third-party
              shipping services.
            </p>
            <p>
              <strong>7. Returns and Refunds:</strong> Sellers must
              establish clear return and refund policies for their products.
              Sellers are responsible for handling returns, refunds, and
              exchanges directly with buyers in accordance with their stated
              policies. B2B Hub may intervene in disputes between buyers and
              sellers at its discretion.
            </p>
            <p>
              <strong>8. Intellectual Property:</strong> Sellers retain
              ownership of any intellectual property related to their
              products but grant B2B Hub a non-exclusive license to use
              product images, descriptions, and trademarks for promotional
              and operational purposes on the platform.
            </p>
            <p>
              <strong>9. Seller Conduct:</strong> Sellers must adhere to
              professional standards when conducting business on B2B Hub.
              Any fraudulent, unethical, or illegal activity may result in
              the suspension or termination of your account and removal from
              the platform.
            </p>
            <p>
              <strong>10. Limitation of Liability:</strong> B2B Hub is not
              liable for any direct, indirect, or incidental damages arising
              from your use of the platform. Our total liability to you is
              limited to the amount of fees paid by the Seller for using the
              platform.
            </p>
            <p>
              <strong>11. Termination and Account Suspension:</strong> B2B
              Hub reserves the right to suspend or terminate any seller
              account at its discretion, including for violations of these
              Terms and Conditions or other platform policies. Sellers may
              also terminate their accounts, but outstanding orders must be
              fulfilled.
            </p>
            <p>
              <strong>12. Governing Law:</strong> These Terms and Conditions
              are governed by and construed in accordance with the laws of
              . Any disputes arising from these terms
              will be subject to the exclusive jurisdiction of the courts in
              Chennai.
            </p>
            <p>
              <strong>13. Amendments:</strong> B2B Hub reserves the right to
              modify these Terms and Conditions at any time. Any changes
              will be communicated to Sellers, and continued use of the
              platform constitutes acceptance of the revised terms.
            </p>
            <p>
              <strong>14. Contact Information:</strong> For any questions or
              concerns regarding these Terms and Conditions, please contact
              B2BHub at +91 7305096473.
            </p>

            <Checkbox checked={isChecked} onChange={handleCheckboxinput}>
              <span style={{ marginLeft: "8px" }}>
              By continuing to use the B2B Hub platform, you acknowledge
              that you have read, understood, and agree to these Terms and
              Conditions.
            </span>
          </Checkbox>
      </div>
    </Modal >

        <Modal
          open={termsModalVisible}
          footer={null}
          onCancel={() => setTermsModalVisible(false)}
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
            <h1
              style={{
                marginTop: "10px",
                textAlign: "center",
            marginBottom: "20px",
            color:"red"
                  }}
                >
            Mandate Terms & Conditions
          </h1>

          <p>
            <strong>1. Introduction:</strong> These Terms and Conditions
            govern the use of the B2B Hub platform by sellers. By
            registering and selling products through B2B Hub, you agree to
            these terms and conditions as outlined below.
          </p>
          <p>
            <strong>2. Definitions:</strong> In this document, "Seller"
            refers to the individual or business entity offering products
            for sale on the B2B Hub platform, and "B2B Hub" refers to the
            platform operator. The term "Products" refers to any goods
            listed for sale by the Seller on the platform.
          </p>
          <span
            onClick={openTermsandConsModal}
            style={{
              display: "block",
              textAlign: "center",
          marginBottom: "20px",
          color: "#0066cc",
          cursor: "pointer",
                  }}
                >
          Read More
        </span>

        <div style={{ textAlign: "center", marginTop: "30px"
}}>
  <Button
    disabled={!isChecked}
    type="primary"
    onClick={() => {
      setSellerRegModal(true);
    }}
  >
    Continue for Seller Registration
  </Button>
      </div >
    </div >
            </Modal >
            <Modal
              title="Success"
              open={isLottieModalVisible}
              onCancel={() => {

                setTermsModalVisible(false);
                setSellerRegModal(false)
                setIsLottieModalVisible(false);
              }}
              onOk={() => {
                setTermsModalVisible(false);
                setSellerRegModal(false)
                setIsLottieModalVisible(false);
              }}
            >
              <div className="success-lottie-modal">
                <Lottie options={defaultOptions1} height={100} width={100} />
                <p>
                  <b>Successfully Registered as Seller</b>
                </p>
                <p>Use Your Existing Credentials to login</p>
              </div>
            </Modal>
            <div className="login_form_contianer__register-link">
              
              <p>
                Already have B2Bhub Account ?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={openTermsModal}
                  className="login_form_contianer__register-link-anchor"
                >
                  Register as Seller Here.
                </span>
              </p>
            </div>
          </form >
        </div >
      </div >
    </>
  );
};

export default LoginForm;
