import "./process.css";
import image from "./../assests/images/processImage.png";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Process() {
  const navigate = useNavigate();
  return (
    <div className="process-steps--sections">
      <h1 className="heading-secondary process--heading">
        Start trading in 3 simple steps
      </h1>
      <div className="process-image">
        <img src={image} alt="process steps" />
      </div>

      <div className="process-steps">
        <div className="point">
          <p>1</p>
          <div>
            <h5>Create an account</h5>
            <p>
              Register using your mobile number. Enter your Business Name, Email , GST Number and PAN Number 
            </p>
          </div>
        </div>
        <div className="point">
          <p>2</p>
          <div>
            <h5>Complete Seller Registration</h5>
            <p>
             Enter your Business Email ,Location and Start selling your products
            </p>
          </div>
        </div>
        <div className="point">
          <p>3</p>
          <div>
            <h5>Start Ordering & Selling</h5>
            <p>
              Browse and order products from top sellers & brands.
            </p>
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/reg")} className="reg-btn">
        <span>Register </span>
        <BsArrowRight />
      </button>
    </div>
  );
}

export default Process;
