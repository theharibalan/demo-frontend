import { useNavigate } from "react-router-dom";
import playstore from "./../assests/icons/playstore.png";
import appstore from "./../assests/icons/store.png";
import "./download.css";
import { BsArrowRight } from "react-icons/bs";

function Download() {
  const navigate = useNavigate();
  return (
    <di27v className="download-app--section">
      <div>
        <h2 className="download--heading dh">Download B2B Hub app now!</h2>
        <p>Khole Munafe Ka Shutter</p>
        <div className="appstore--icons">
          <img src={playstore} alt="" />
          <img src={appstore} alt="" />
        </div>
      </div>
      <button className="reg-btnn" onClick={() => navigate("/reg")}>
        <span>Register </span>
        <BsArrowRight />
      </button>
    </di27v>
  );
}

export default Download;
