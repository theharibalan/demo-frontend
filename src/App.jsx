import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import AdminPage from "./Components/Admin/Admin";
import PaymentDetailPage from "./Components/Admin/PaymentDetailsPage";
import Orders from "./Components/CartPage/Orders";
import Forgot from "./Components/Forgot";
import Home from "./Components/Home/Home";
import LoginForm from "./Components/Login";
import Footer from "./Components/PageComponents/Footer";
import Payments from "./Components/PaymentPage/Payments";
import Products from "./Components/ProductPage/Products";
import Reg from "./Components/Reg";
import Register from "./Components/Register";
import LandingPage from "./Components/LandingPageCoponent/App";
import Header from "./Components/LandingPageCoponent/features/Header";
import ShowPrducts from "./Components/ProductsPage/ShowProducts";
import Form from "./Components/Seller/Form";
import List_of_sellers from "./Components/Seller/List_of_sellers";
import SellerLogin from "./Components/SellerLogin";
import Listofproducts from "./Components/Seller/Listofproducts";
// import Invoice from "./Components/Seller/Invoice";
import SuperAdmin from "./Components/Admin/SuperAdmin/SuperAdmin";
import Sellerproducts from "./Components/Admin/SuperAdmin/SuperAdminComponents/SellerProducts";
import TermsAndCons from "./Components/TermsAndCons";
import ToggleBox from "./Components/ChatBot/ToggleBox";

import PoForm from "./Components/Po/PoForm";
import Proforma from "./Components/Invoice/Profroma";
import Invoice from "./Components/Invoice/Invoice";
import WorkOrder from "./Components/Invoice/WorkOrder";
import ChallanForm from "./Components/Challan/ChallanForm";
export const store = createContext();

function App() {
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  if (!localStorage.getItem("userEmail")) {
    localStorage.setItem("loginstate", "false");
  }
  const [noOfOrders, setNoOfOrders] = useState(0);

  return (
    <store.Provider value={[noOfOrders, setNoOfOrders]}>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route
              path="/depreciated"
              element={
                <Home
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              }
            />
            <Route
              path="/"
              element={
                <LandingPage
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reg" element={<Reg />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/admin@b2b/b2bhubindia" element={<SuperAdmin />} />
            <Route
              path="/payments/upload-payment"
              element={<PaymentDetailPage />}
            />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/addProduct" element={<Form />} />
            <Route path="/seller" element={<List_of_sellers />} />
            <Route path="/listofproducts" element={<Listofproducts />} />
            <Route path="/myproducts" element={<ShowPrducts />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/admin@b2b/b2bhubindia/commercial/purchaseOrder" element={<PoForm />} />
            <Route
              path="/admin@b2b/b2bhubindia/commercial/deliveryChallan"
              element={<ChallanForm />}
            />

            <Route
              path="/admin@b2b/b2bhubindia/seller-products"
              element={<Sellerproducts />}
            />
            <Route path="/b2b-terms-&-Conditions" element={<TermsAndCons />} />
            <Route path="/admin@b2b/b2bhubindia/commercial/proformaInvoice" element={<Proforma/>} />
            <Route path="/admin@b2b/b2bhubindia/commercial/salesInvoice" element={<Invoice/>} />
            <Route path="/admin@b2b/b2bhubindia/commercial/workorder" element={<WorkOrder/>} />
          </Routes>
          <ToggleBox />
          <Footer className="footer-res" />
        </BrowserRouter>
      </div> 
    </store.Provider>
  );
}

export default App;
