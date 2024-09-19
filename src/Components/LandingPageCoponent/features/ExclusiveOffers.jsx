import "./ExclusiveOffers.css";
import udardal from "./../assests/images/uraddal.png";
import moongdal from "./../assests/images/moongdal.png";
import gramdal from "./../assests/images/gramdal.png";
import toordal from "./../assests/images/toordal.png";

import discountTag from "./../assests/icons/discounttag.png";

function ExclusiveOffers() {
  return (
    <div className="exclusive-offers--section">
      <h1 className="heading-secondary hsll">Exclusive Offers</h1>
      <div className="cards">
        <div className="card-wrapper">
          <p className="discount-tag">
            <img src={discountTag} alt="" />
            <p>
              20% <br />
              off
            </p>
          </p>
          <div className="item--card">
            {/* <div className="discounttag-wrapper"> */}
            {/* </div> */}
            <p className="deco1"></p>
            <div className="product-image">
              <img src={udardal} alt="" />
            </div>
            <p className="product-name">Urad Dal</p>
            <p className="product-price">
              <span>₹100</span>
              ₹80
            </p>
            <button className="order-btn">order now</button>
          </div>
        </div>

        <div className="card-wrapper">
          <p className="discount-tag">
            <img src={discountTag} alt="" />
            <p>
              20% <br />
              off
            </p>
          </p>
          <div className="item--card">
            <p className="deco1"></p>
            <span className="decoration1"></span>
            <span className="decoration2"></span>
            <div className="product-image">
              <img src={moongdal} alt="" />
            </div>
            <p className="product-name">Moong Dal</p>
            <p className="product-price">
              <span>₹100</span>
              ₹80
            </p>
            <button className="order-btn">order now</button>
          </div>
        </div>

        <div className="card-wrapper">
          <p className="discount-tag">
            <img src={discountTag} alt="" />
            <p>
              20% <br />
              off
            </p>
          </p>
          <div className="item--card">
            <p className="deco1"></p>
            <span className="decoration1"></span>
            <span className="decoration2"></span>
            <div className="product-image">
              <img src={gramdal} alt="" />
            </div>
            <p className="product-name">Gram Dal</p>
            <p className="product-price">
              <span>₹100</span>
              ₹80
            </p>
            <button className="order-btn">order now</button>
          </div>
        </div>

        <div className="card-wrapper">
          <p className="discount-tag">
            <img src={discountTag} alt="" />
            <p>
              20% <br />
              off
            </p>
          </p>
          <div className="item--card">
            <p className="deco1"></p>

            <span className="decoration2"></span>
            <div className="product-image">
              <img src={toordal} alt="" />
            </div>
            <p className="product-name">Toor Dal</p>
            <p className="product-price">
              <span>₹100</span>
              ₹80
            </p>
            <button className="order-btn">order now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExclusiveOffers;
