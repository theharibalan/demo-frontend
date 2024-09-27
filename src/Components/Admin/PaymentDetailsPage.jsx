import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "../CartPage/orders.css";
import { toast, ToastContainer } from 'react-toastify';
import NavBar from '../PageComponents/Navbar';
const formatIndianNumber = (num) => {
  const numStr = num.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== "") {
    return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
  } else {
    return lastThree;
  }
};
const PaymentDetailsPage = () => {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const [orderDetails, setOrderDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modeOfPayment, setModeOfPayment] = useState()
  const [errormsg, setErrorMsg] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    customerId: customerId,
    transactionId: "",
    transactionDate: "",
    accountId: "",
    amount: "",
  })

  const location = useLocation()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { state: { navigateTo: "payments" } })
    }
  })
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleInputChange = (e) => {
    setErrorMsg(false)
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };
  const fetchOrders = () => {
    // const url = `https://b2b-backend-uvpc.onrender.com/user/getorder/${localStorage.get("customerId")}`;
    const url = `${process.env.REACT_APP_BACKEND_URL}/sales/viewOrders`;
    axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    }).then((res) => {
      setOrderDetails(res.data);
    })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchOrders()
  }, []);
  const handlePaymentUpload = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (parseInt(selectedOrder.total_amount) !== parseInt(paymentDetails.amount)) {
      setErrorMsg(true)
      return
    }
    console.log("Payment Details:", paymentDetails); //
    // const url = `https://b2b-backend-uvpc.onrender.com/user/addTransaction/${selectedOrder.order_id}`
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/addTransaction/${selectedOrder.orderId}`
    axios.post(url, paymentDetails, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    }).then((res) => {
      fetchOrders()
      toast.success('Payment Details Added Successfully', { position: "top-center" })
    })
      .catch(err => toast.error("Error adding payment Details"))

    handleCloseModal();
  };

  const pendingPayments = orderDetails.filter((order) => !order.payment_status);
  const completedPayments = orderDetails.filter((order) => order.payment_status);
  return (
    <div className="order-tables">
      {/* <NavBar/> */}
      <ToastContainer />
      <h2>Pending Payments</h2>
      <table className="table yellow-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Product Type</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingPayments.length === 0 ? (<h2 style={{ textAlign: "center", marginTop:"20px",width:"100%"}}>No Pending Payments</h2>):(
        <>
          {pendingPayments.map((order, index) => (
            <tr key={index}>
              <td>{order.orderId}</td>
              <td>{order.product_name}</td>
              <td>{order.product_type}</td>
              <td>{order.product_quantity}</td>
              <td>₹ {formatIndianNumber(parseInt(order.total_amount))}</td>
              <td>
                <button className="button-7" onClick={() => handlePaymentUpload(order)}>
                  Upload Payment Details
                </button>
              </td>
            </tr>
          ))}</>
             )}
      </tbody>
    </table>
          {
    showModal && selectedOrder && (
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
                <strong>Product Quantity:</strong> {selectedOrder.product_quantity} {" "}TONNES
              </p>
              <p>
                <strong>Price:</strong> ₹{" "}
                <span style={{ fontSize: "1.3em" }}>{formatIndianNumber(parseInt(selectedOrder.total_amount))}</span>
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="payment-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="transactionId">Transaction ID:<span className="required">*</span></label>
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
                  <label htmlFor="transactionDate">Date of Transaction:<span className="required">*</span></label>
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
                  <label htmlFor="accountId">Account Number:<span className="required">*</span></label>
                  <input
                    type="text"
                    id="accountId"
                    name="accountId"
                    value={paymentDetails.accountId}
                    onChange={handleInputChange}
                    placeholder='ACC12345678987'
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount:<span className="required">*</span></label>
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
                {errormsg && (<p style={{ color: "red", paddingTop: "5px" }}>Incorrect Amount</p>)}
              </div>


              <button style={{ width: "80%" }} className="button-7" type="submit" >Submit Payment</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
    </div >
  )
}

export default PaymentDetailsPage
