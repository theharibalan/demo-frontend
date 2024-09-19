import React, { useContext, useEffect, useState } from "react";
import "./orders.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer, useToast } from "react-toastify";
import NavBar from "../PageComponents/Navbar";
import { store } from "../../App";
import { BsFillCartCheckFill } from "react-icons/bs";

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFetching ,setIsFetching] = useState(true)

  const [modeOfPayment, setModeOfPayment] = useState();
  const [errormsg, setErrorMsg] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    email: localStorage.getItem("userEmail"),
    transactionId: "",
    transactionDate: "",
    accountId: "",
    amount: "",
  });
  const [noOfOrders, setNoOfOrders] = useContext(store);

  const formatIndianNumber = (num) => {
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== "") {
      return `${otherNumbers.replace(
        /\B(?=(\d{2})+(?!\d))/g,
        ","
      )},${lastThree}`;
    } else {
      return lastThree;
    }
  };
  const fetchOrders = () => {
    setIsFetching(true)
    
    const url = `${
      process.env.REACT_APP_BACKEND_URL
    }/sales/viewOrders`;
    
    axios
      .post(url,{},{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }})
      .then((res) => {
        setOrderDetails(res.data.reverse());
        setNoOfOrders(res.data.length);
        console.log("data ochesindhey...",res.data)

      })
      .catch((err) => {
        console.log(err)});
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login", { state: { navigateTo: "orders" } });
  };

  const handlePaymentUpload = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleInputChange = (e) => {
    setErrorMsg(false);
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      parseInt(selectedOrder.total_amount) !== parseInt(paymentDetails.amount)
    ) {
      setErrorMsg(true);
      return;
    }
    console.log("Payment Details:", paymentDetails);
    // const url = `https://b2b-backend-uvpc.onrender.com/user/addTransaction/${selectedOrder.order_id}`;
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/addTransaction/${selectedOrder.orderId}`;
    axios
      .post(url, paymentDetails, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }})
      .then((res) => {
        fetchOrders();
        toast.success("Payment Details Added Successfully", {
          position: "top-center",
        });
      })
      .catch((err) => toast.error("Error adding payment Details"));

    handleCloseModal();
  };

  const pendingPayments = orderDetails.filter((order) => !order.payment_status);
  const completedPayments = orderDetails.filter(
    (order) => order.payment_status
  );

  return (
    <>
      {/* <NavBar/> */}
      <ToastContainer />
      {localStorage.getItem("loginstate") === "false" ? (
        <div className="login-remainder-for-orders">
          <h1 style={{ marginTop: "10%" }}>Please login to view your orders</h1>
          <button
            onClick={handleLogin}
            style={{ width: "200px" }}
            className="login_form_contianer__btn"
          >
            login
          </button>
        </div>
      ) : (
        <>
              <h1 style={{textAlign:"left",margin:"1em 0 0.3em 1em"}}><BsFillCartCheckFill />Orders</h1>

        {noOfOrders>0?(
          <>
          {orderDetails.length===0?(<h2>No Orders Yet</h2>):(
            <>
            {orderDetails.map((order,index)=>{
              return(
                <div className="Order-Details-container">
                <div className="order-detail-card-flex">
                <div className="order-card order-card-left">
                    <div className="headers">
                      <p>Order NO </p>
                      <p>Product </p>
                      <p>Price </p>
                    </div>
                    <div className="header-values">
                      <p>: {order.orderId}</p>
                      <p>: {order.product_type}</p>
                      <p>:  ₹ {formatIndianNumber(parseInt(order.total_amount))} </p>
                    </div>
    
                  </div>
                  <div className=" order-card order-card-right">
                    <div className="headers">
                      <p>Date</p>
                    </div>
                    <div className="header-values">
                      <p>: {order.date_of_order}</p>
                      {order.payment_status?(<>{order.payment_verified?(<>{order.deliveryStatus?(<p className="order-status status-green">Delivered</p>):(<p className="status-blue order-status">Shipped</p>)}</>):(<p className="status-yellow order-status">Processing</p>)}</>):(<p  className="status-red order-status">Payment Pending</p>)}
                    </div>
    
                  </div>
                
                </div>
                <div className="details-btn-ctn">
                {<button  className=""> <a href={order.invoiceUrl}>View Invoice</a></button>}
                  {order.payment_verified ? (<button ><a href={order.paymentUrl}>View Receipt</a></button>):""}
                  {!order.payment_status ? (<button onClick={()=>handlePaymentUpload(order)}>Upload Payment Details</button>):""}
                </div>
              </div>
              )
            })}</>
            
          )}
          </>
        ):("Loading...")}
        
          
          <div className="order-tables">
          

          <div className="tables-forweb" style={{ display: "flex", justifyContent: "space-around" }}>
            <h2>Pending Payments</h2>
            <button
              style={{ height: "30px" }}
              onClick={() => fetchOrders()}
              className="button-7"
            >
              Refresh
            </button>
          </div>
          <table className="table yellow-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Payment Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.length === 0 ? (
                <h2
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    width: "100%",
                  }}
                >
                  No Payments Pending
                </h2>
              ) : (
                <>
                  {pendingPayments.map((order, index) => (
                    <tr key={index}>
                      <td>{order.product_name}</td>
                      <td>{order.product_type}</td>
                      <td>{order.product_quantity}</td>
                      <td>
                        ₹ {formatIndianNumber(parseInt(order.total_amount))}
                      </td>
                      <td>{order.payment_status === 0 ? "Pending" : "Paid"}</td>
                      <td
                        className="table=roe-btn"
                        style={{ textAlign: "center" }}
                      >
                        <button
                          style={{ marginRight: "10px" }}
                          className="button-7"
                        >
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                            }}
                            href={order.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Invoice
                          </a>
                        </button>
                        <button
                          className="button-7"
                          onClick={() => handlePaymentUpload(order)}
                        >
                          Upload Payment Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          <h2>Your Orders</h2>
          <table className="table yellow-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>OrderDate</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>Invoice & Receipt</th>
              </tr>
            </thead>
            <tbody>
              {completedPayments.length === 0 ? (
                <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                  No Orders yet
                </h2>
              ) : (
                <>
                  {completedPayments.map((order, index) => (
                    <tr key={index}>
                      <td>{order.product_name}</td>
                      <td>{order.product_type}</td>
                      <td style={{ textAlign: "center" }}>
                        {order.product_quantity}
                      </td>
                      <td>
                        ₹ {formatIndianNumber(parseInt(order.total_amount))}
                      </td>
                      <td>{order.date_of_order}</td>
                      <td style={{ textAlign: "center" }}>
                        {order.payment_verified
                          ? order.delivery_status
                            ? "Delivered"
                            : "Payment Verified"
                          : "Payment Verification Under Process"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          style={{ marginRight: "20px" }}
                          className="button-7"
                        >
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                            }}
                            href={order.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Invoice
                          </a>
                        </button>
                        {order.payment_verified ? (
                          <button className="button-7">
                            <a
                              style={{
                                textDecoration: "none",
                                color: "white",
                              }}
                              href={order.paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Receipt
                            </a>
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div></>
        
      )}

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Payment Details for {selectedOrder.product_name}</h3>
              <button className="closeBtn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <p>
                  <strong>Product Name:</strong> {selectedOrder.product_type}
                </p>
                <p>
                  <strong>Product Quantity:</strong>{" "}
                  {selectedOrder.product_quantity} TONNES
                </p>
                <p>
                  <strong>Price:</strong> ₹{" "}
                  <span style={{ fontSize: "1.3em" }}>
                    {formatIndianNumber(parseInt(selectedOrder.total_amount))}
                  </span>
                </p>
              </div>
              <form onSubmit={handleFormSubmit} className="payment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="transactionId">
                      Transaction ID:<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      value={paymentDetails.transactionId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="transactionDate">
                      Date of Transaction:<span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="transactionDate"
                      name="transactionDate"
                      value={paymentDetails.transactionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="accountId">
                      Account Number:<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountId"
                      name="accountId"
                      value={paymentDetails.accountId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">
                      Amount:<span className="required">*</span>
                    </label>
                    <input
                      placeholder={selectedOrder.total_amount}
                      type="number"
                      id="amount"
                      name="amount"
                      value={paymentDetails.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {errormsg && (
                    <p
                      style={{
                        color: "red",
                        paddingTop: "5px",
                        fontSize: "12px",
                      }}
                    >
                      Invalid Amount
                    </p>
                  )}
                </div>
                <button
                  style={{ width: "80%" }}
                  className="button-7"
                  type="submit"
                >
                  Submit Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
