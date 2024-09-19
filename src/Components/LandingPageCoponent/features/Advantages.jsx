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
          B2B Hub is the enterprise commerce operating system for immediate
          success and future resilience. Designed to optimise resources and
          maximise returns, it keeps you ahead of shifting customer needs,
          amplifies your development team's impact, and helps you outsmart
          competitors instead of outspending them.
        </p>

      <div className="advantages--cards">
        <div>
          <div className="adv-icons">
            <VectorIcon />
          </div>
          <h4>Accelerate innovation </h4>
          <p>
            Innovate and launch at lightning speed, on the only platform that’s
            consistently first-to-market with new capabilities.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi2 />
          </div>
          <h4>Increase revenue </h4>
          <p>
            Increase top-line revenue with the best-converting checkout on the
            planet, and reach more customers on more channels.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi3 />
          </div>
          <h4>Optimise performance </h4>
          <p>
            Handle the highest volumes possible and always stay connected with
            99.95% uptime and less than 50ms response time.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi4 />
          </div>
          <h4>Build with flexibility</h4>
          <p>
            Evolve your commerce architecture and transform your customer
            experiences with a flexible commerce operating system.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi5 />
          </div>
          <h4>Lower cost of ownership </h4>
          <p>
            2B Hub TCO is on average 33% better than its competitors’, making it
            the industry’s most cost- effective commerce platform.
          </p>
        </div>
        <div>
          <div className="adv-icons">
            <Vi6 />
          </div>
          <h4>Improve development impact </h4>
          <p>
            Use your developer resources to drive growth with unique builds,
            while relying on B2B Hub for your infrastructure and platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
