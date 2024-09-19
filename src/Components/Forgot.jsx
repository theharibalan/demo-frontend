import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/forgotpassword.css';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [originalOtp, setOriginalOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(300);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  useEffect(() => {
    if (timer > 0 && isEmailSubmitted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isEmailSubmitted]);

  const handleEmailSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/b2b/sendOtp`, { email });
      console.log(res.data); // Log the response for debugging

      setIsEmailSubmitted(true); // Proceed to OTP verification
      toast.success('OTP sent to your email!', { position: "top-center" });
    } catch (error) {
      toast.error('Failed to send OTP', { position: "top-center" });
      console.log(error);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || !password || !confirmPassword) {
      toast.error('Please fill in all fields', { position: "top-center" });
      return;
    }

    // Check if the passwords match before sending the request
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { position: "top-center" });
      return;
    }

    try {
      setLoading(true); // Show loading spinner

      // Send the entered OTP along with other data to the backend for verification and password reset
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/b2b/resetpassword`, {
        email,
        otp, // Send the entered OTP
        password,
        confirmPassword,
      });
      console.log({
        email,
        otp, // Send the entered OTP
        password,
        confirmPassword,
      });
      
      toast.success('Password changed successfully!', { position: "top-center" });

      // Redirect to login after success
      setTimeout(() => {
        navigate('/login', { state: { navigateTo: "products" } });
      }, 3000);
    } catch (error) {
      toast.error('Failed to change password or OTP is incorrect', { position: "top-center" });
      console.log(error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className='forgotPasswordmain'>
      <div className="forget-password-main-container1">
        <ToastContainer />
        <div className="forget-password-row justify-content-center">
          <div className="forget-password-card">
            <div className="forget-password-card-body">
              <div className="forget-password-text-center">
                <h1>Forget Password</h1>
              </div>
              <>
                {!isEmailSubmitted ? (
                  <>
                    <div className="forget-password-form-group">
                      <label htmlFor="email">Enter Email:</label>
                      <input
                        type="email"
                        id="email"
                        className="forget-password-form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} // Disable input during loading
                      />
                    </div>
                    {loading ? (
                      <button className="forget-password-btn-loading" disabled>
                        <span className="spinner"></span>
                        Sending OTP...
                      </button>
                    ) : (
                      <button onClick={handleEmailSubmit} className="forget-password-btn-verify">
                        Submit Email
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="forget-password-form-group">
                      <label htmlFor="otp">Enter OTP:</label>
                      <input
                        type="text"
                        id="otp"
                        className="forget-password-form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="forget-password-form-group">
                      <label htmlFor="password">New Password:</label>
                      <input
                        type="password"
                        id="password"
                        className="forget-password-form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="forget-password-form-group">
                      <label htmlFor="confirmPassword">Confirm Password:</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="forget-password-form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <button
                      onClick={handleOtpVerification}
                      className="forget-password-btn-verify"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span> Processing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;