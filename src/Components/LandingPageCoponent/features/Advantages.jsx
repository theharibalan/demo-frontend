import "./advantages.css";
import VectorIcon from "../ui/VectorIcon";
import Vi2 from "../ui/Vi2";
import Vi3 from "../ui/Vi3";
import Vi4 from "../ui/Vi4";
import Vi5 from "../ui/Vi5";
import Vi6 from "../ui/Vi6";
import Dividerr from "./../ui/Dividerrr";

function Advantages() {
  return (
    <div className="advantages--section">
      <Dividerr />
      <p>B2B Hub advantages</p>
      <h3>The platform built for future-proofing</h3>
      <p className="advDesp">
        B2B Hub is the platform for seamless trading between buyers and sellers
        in the dal industry. Built to streamline transactions and boost
        profitability, it adapts to market trends, enhances efficiency for both
        parties, and ensures you stay competitive without overspending.
      </p>

      <div className="advantages--cards">
        <div>
          <div className="adv-icons">
            <VectorIcon />
          </div>
          <h4>Accelerate innovation </h4>
          <p>
            Scale your business rapidly with B2B hub platform that always delivers
            the latest features, helping you stay ahead of the competition.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi2 />
          </div>
          <h4>Increase revenue </h4>
          <p>
            Drive higher revenue with an optimized checkout experience with B2B hub and
            expand your reach by connecting with more customers across multiple
            channels.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi3 />
          </div>
          <h4>Optimise performance </h4>
          <p>
            Manage high transaction volumes seamlessly with B2B hub, staying connected with
            99.95% uptime and lightning-fast response times under 50ms.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi4 />
          </div>
          <h4>Build with flexibility</h4>
          <p>
            {" "}
            B2B hub evolves your business processes and enhance customer interactions
            with a flexible platform designed for dynamic market needs.{" "}
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi5 />
          </div>
          <h4>Lower cost of ownership </h4>
          <p>
            B2B Hub offers a total cost of ownership (TCO) that's on average 33%
            lower than competitors, making it the most cost-effective solution
            in the industry.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi6 />
          </div>
          <h4>Improve development impact </h4>
          <p>
            {" "}
            Leverage your development team to create customized solutions while
            B2B Hub handles your infrastructure and platform needs.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;