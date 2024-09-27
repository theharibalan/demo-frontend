import React, { useEffect, useState } from "react";
import "../CartPage/orders.css";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Tabs, Modal, message, Input } from "antd";
import GenerateReceipt from "../GeneratePaymentReceipt";
import Dashboard from "./Dashboard";
import { Form } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Search } = Input;
// import { Spin, Empty } from "antd";

const AdminPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [approveBtnText, setApprovedBtnText] = useState("Approve");
  const [noOfRecent, setNoOfRecent] = useState(0);
  const [noOfPending, setNoOfPending] = useState(0);
  const [noOfApprove, setNoOfApprove] = useState(0);
  const [noOfConfirmed, setNoOfConfirmed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [isFetching, setIsFetching] = useState(true);

  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    transactionDate: "",
    accountId: "",
    amount: "",
  });

  const [adminLogin, setAdminLogin] = useState(true);

  const [loginBtn, setLoginBtn] = useState("Login");
  const [verifyBtnText, setVerifyBtnText] = useState("Verify OTP");
  const [searchRecentOrders, setSearchRecentOrders] = useState("");
  const [searchPendingPayments, setSearchPendingPayments] = useState("");
  const [searchCompletedOrders, setSearchCompletedOrders] = useState("");
  const [searchAllOrders, setSearchAllOrders] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(true);

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

  const [adminemail, setAdminEmail] = useState();
  const [adminpassword, setAdminPassword] = useState();

  const fetchOrders = async () => {
    setIsFetching(true);
    try {
      setIsFetching(true);

      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.error("Admin token not found");
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/getorders`;
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orders = res.data.reverse();
      setOrderDetails(orders);
      setNoOfRecent(orders.length);

      const thependingPayments = orders.filter(
        (order) => !order.payment_status
      );
      setNoOfPending(thependingPayments.length);
      console.log("no.of pending", noOfPending);

      const thePaidPayments = orders.filter(
        (order) => order.payment_status && !order.payment_verified
      );
      setNoOfApprove(thePaidPayments.length);

      const completedPayments = orders.filter(
        (order) => order.payment_verified
      );
      setNoOfConfirmed(completedPayments.length);
      setIsFetching(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };
  // useEffect = () => {
  //   alert("No.of Orders Pending", noOfPending)}
  // [adminLogin]};

  useEffect(() => {
    fetchOrders();
  }, [adminLogin]);

  const navigate = useNavigate();
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const handleViewPaymentDetails = (order) => {
    setSelectedOrder(order);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/finance/getTransaction/${order.orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setPaymentDetails(res.data);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error fetching payment details:", err);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowContactsModal(false);
    setSelectedOrder(null);
  };
  const [form] = Form.useForm();

  const handleApproveOrder = (order) => {
    Modal.confirm({
      title: "Are you sure you want to proceed with this action?",
      content: (
        <Form
          form={form}
          layout="vertical"
          name="warehouseForm"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Enter Warehouse Address"
            name="warehouseLocation"
            rules={[
              {
                required: true,
                message: "Please enter the warehouse location",
              },
            ]}
          >
            <Input.TextArea
              style={{
                width: "100%",
                height: "70px",
                border: "1px solid grey",
              }}
              placeholder="Enter full address (Street, Area/LandMark, District, State)"
            />
          </Form.Item>
          <Form.Item
            label="Warehouse URL"
            name="warehouseURL"
            rules={[
              { required: true, message: "Please enter the warehouse URL" },
            ]}
          >
            <Input
              style={{ border: "1px solid grey" }}
              placeholder="Enter warehouse URL"
            />
          </Form.Item>
          This action will approve the order. Once approved, it cannot be
          undone.
        </Form>
      ),
      okText: "Yes, Approve",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const values = await form.validateFields();

          const pid = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/finance/getPaymentReceiptId`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const receipt_url = await GenerateReceipt(order, pid.data);

          const orderdata = {
            pid: pid.data,
            order_id: order.orderId,
            email: order.email,
            name: order.companyname,
            receipt_url: receipt_url,
            amount: order.total_amount,
            quantity: order.product_quantity,
            product_name: `${order.product_name} [${order.product_type}]`,
            warehouseLocation: values.warehouseLocation,
            warehouseURL: values.warehouseURL,
          };

          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/finance/approve-payment`,
            orderdata,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            fetchOrders();
            setApprovedBtnText("Approved");
            message.success("Order approved successfully!");
          } else {
            message.error("Failed to approve the order. Please try again.");
          }
        } catch (error) {
          if (error.errorFields) {
            message.error("Please fill in all the required fields.");
          } else {
            message.error("An error occurred. Please try again.");
          }
        }
      },
      onCancel() {
        message.info("Order approval cancelled.");
      },
    });
  };

  const [otp, setOtp] = useState("");
  const [getOtp, setgetOtp] = useState("");
  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (otp === String(getOtp)) {
      setTimeout(() => {
        message.success("Login Successful");
        // message.success("No.of Orders Pending", noOfPending);
        setAdminLogin(true);
        setIsLoading(false);
      }, 500);
      // alert("No.of Orders Pending", noOfPending);
    } else {
      message.error("Invalid OTP");
    }
  };
  const handleAdminLogin = () => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/adminLogin`;
    axios
      .post(url, { email: adminemail, password: adminpassword })
      .then((res) => {
        setgetOtp(res.data.otp);
        setIsLoading(false);
        localStorage.setItem("admin-token", res.data.token);
      })
      .catch((err) => {
        message.error("Invalid Credentials");
      });
  };

  const thependingPayments = orderDetails.filter(
    (order) => order.payment_status
  );
  const pendingPayments = thependingPayments.filter(
    (order) => !order.payment_verified
  );
  const recentorders = orderDetails.filter((order) => !order.payment_status);
  const completedPayments = orderDetails.filter(
    (order) => order.payment_verified
  );

  const filteredRecentOrders = recentorders.filter(
    (order) =>
      order.companyname
        ?.toLowerCase()
        .includes(searchRecentOrders.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchRecentOrders.toLowerCase())
  );

  const filteredPendingPayments = pendingPayments.filter(
    (order) =>
      order.companyname
        ?.toLowerCase()
        .includes(searchPendingPayments.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchPendingPayments.toLowerCase())
  );

  const filteredCompletedOrders = completedPayments.filter(
    (order) =>
      order.companyname
        ?.toLowerCase()
        .includes(searchCompletedOrders?.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchCompletedOrders.toLowerCase())
  );
  const filteredAllOrders = orderDetails.filter(
    (order) =>
      order.companyname
        ?.toLowerCase()
        .includes(searchAllOrders?.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchAllOrders.toLowerCase())
  );

  const handleViewContacts = (order) => {
    setSelectedOrder(order);
    setShowContactsModal(true);
  };

  const handleUpdateOrderStatus = (orderId) => {
    Modal.confirm({
      title: "Are you sure you want to proceed with this action?",
      content:
        "This action will update the order status to Delievred. Once Updaed, it cannot be undone.",
      okText: "Yes, Update",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/sales/updateorderstatus/${orderId}`,
            [],
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            fetchOrders();
            setApprovedBtnText("Updated");
            message.success("Order Status Updated successfully!");
          } else {
            message.error(
              "Failed to update the order status. Please try again."
            );
          }
        } catch (error) {
          message.error("An error occurred. Please try again.");
        }
      },
      onCancel() {
        message.info("Order status Update cancelled.");
      },
    });
  };
  return (
    <>
      {/* <NavBar/> */}
      {adminLogin ? (
        <>
          <Tabs defaultActiveKey="1" className="custom-tabs">
            <Tabs.TabPane tab="Dashboard" key="1">
              <Dashboard data={orderDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Recent Orders - (${noOfRecent})`} key="2">
              <div className="order-tables">
                <div className="table-header-top">
                  <h2>Recent Orders</h2>
                  <Search
                    placeholder="Search by Order ID or Customer Name"
                    onChange={(e) => setSearchAllOrders(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <button
                    style={{ height: "30px" }}
                    onClick={() => fetchOrders()}
                    className="refreshBtn"
                  >
                    {isFetching ? (
                      <>
                        <div className="circle" /> Fetching
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
                <table className="table yellow-table">
                  <thead>
                    <tr>
                      <th>OrderID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Product Type</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Ordered Date</th>
                      <th style={{ textAlign: "center" }}>Payment Status</th>
                      <th style={{ textAlign: "center" }}>Delivery Status</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllOrders.length > 0 ? (
                      filteredAllOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.orderId}</td>
                          <td>{order.companyname}</td>
                          <td>{order.product_name}</td>
                          <td>{order.product_type}</td>
                          <td>{order.product_quantity}</td>
                          <td>
                            ₹ {formatIndianNumber(parseInt(order.total_amount))}
                          </td>
                          <td>{order.date_of_order}</td>
                          <td style={{ textAlign: "center" }}>
                            {order.payment_status ? "Paid" : "Pending"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {order.deliveryStatus ? (
                              "Delivered"
                            ) : (
                              <>
                                {order.payment_status ? (
                                  <>
                                    {order.payment_verified
                                      ? "Delivery Pending"
                                      : "Payment Not Approved"}
                                  </>
                                ) : (
                                  "Payment Pending"
                                )}
                              </>
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              display: "flex",
                            }}
                          >
                            <button
                              onClick={() => handleViewContacts(order)}
                              className="button-7"
                            >
                              View Contact Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <h2 style={{ textAlign: "center" }}>
                            No Recent Orders / No Pending Payments
                          </h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Pending Payments - (${noOfPending})`} key="3">
              <div className="order-tables">
                <div className="table-header-top">
                  <h2>Pending Payments</h2>
                  <Search
                    placeholder="Search by Order ID or Customer Name"
                    onChange={(e) => setSearchRecentOrders(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <button
                    style={{ height: "30px" }}
                    onClick={() => fetchOrders()}
                    className="refreshBtn"
                  >
                    {isFetching ? (
                      <>
                        <div className="circle" /> Fetching
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
                <table className="table yellow-table">
                  <thead>
                    <tr>
                      <th>OrderID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Product Type</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Order Date</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentOrders.length > 0 ? (
                      filteredRecentOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.orderId}</td>
                          <td>{order.companyname}</td>
                          <td>{order.product_name}</td>
                          <td>{order.product_type}</td>
                          <td>{order.product_quantity}</td>
                          <td>
                            ₹ {formatIndianNumber(parseInt(order.total_amount))}
                          </td>
                          <td>{order.date_of_order}</td>
                          <td
                            style={{
                              textAlign: "center",
                              display: "flex",
                              alignItems: "stretch",
                            }}
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
                              onClick={() => handleViewContacts(order)}
                              className="button-7"
                            >
                              View Contact Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <h2 style={{ textAlign: "center" }}>
                            No Recent Orders / No Pending Payments
                          </h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Approve Payments - (${noOfApprove})`} key="4">
              <div className="order-tables">
                <div className="table-header-top">
                  <h2>Approve Payments</h2>
                  <Search
                    placeholder="Search by Order ID or Customer Name"
                    onChange={(e) => setSearchPendingPayments(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <button
                    style={{ height: "30px" }}
                    onClick={() => fetchOrders()}
                    className="refreshBtn"
                  >
                    {isFetching ? (
                      <>
                        <div className="circle" /> Fetching
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
                <table className="table yellow-table">
                  <thead>
                    <tr>
                      <th>OrderID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Product Type</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendingPayments.length > 0 ? (
                      filteredPendingPayments.map((order, index) => (
                        <tr key={index}>
                          <td>{order.orderId}</td>
                          <td>{order.companyname}</td>
                          <td>{order.product_name}</td>
                          <td>{order.product_type}</td>
                          <td>{order.product_quantity}</td>
                          <td>
                            ₹ {formatIndianNumber(parseInt(order.total_amount))}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              style={{ marginRight: "10px" }}
                              className="button-7"
                              onClick={() => handleViewPaymentDetails(order)}
                            >
                              View Payment Details
                            </button>
                            <button
                              className="button-7"
                              onClick={() => handleApproveOrder(order)}
                            >
                              Approve Order
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <h2 style={{ textAlign: "center" }}>
                            No Payments to Approve
                          </h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Confirmed Orders - (${noOfConfirmed})`} key="5">
              <div className="order-tables">
                <div className="table-header-top">
                  <h2>Confirmed Orders</h2>
                  <Search
                    placeholder="Search by Order ID or Customer Name"
                    onChange={(e) => setSearchCompletedOrders(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  <button
                    style={{ height: "30px" }}
                    onClick={() => fetchOrders()}
                    className="refreshBtn"
                  >
                    {isFetching ? (
                      <>
                        <div className="circle" /> Fetching
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
                <table className="table yellow-table">
                  <thead>
                    <tr>
                      <th>OrderID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Product Type</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th style={{ textAlign: "center" }}>Status</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompletedOrders.length > 0 ? (
                      filteredCompletedOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.orderId}</td>
                          <td>{order.companyname}</td>
                          <td>{order.product_name}</td>
                          <td>{order.product_type}</td>
                          <td>{order.product_quantity}</td>
                          <td>
                            ₹ {formatIndianNumber(parseInt(order.total_amount))}
                          </td>
                          <td>
                            {order.deliveryStatus
                              ? "Delivered"
                              : "Not Delivered"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {order.deliveryStatus ? (
                              "--"
                            ) : (
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(order.orderId)
                                }
                                className="button-7"
                              >
                                Update Order Status
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <h2 style={{ textAlign: "center" }}>
                            No completed orders found
                          </h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </>
      ) : (
        <>
          <div className="login_form_contianer">
            {getOtp ? (
              <>
                <h1 className="login_form_contianer__title">Enter OTP</h1>
                <form>
                  <div className="login_form_contianer__input-box">
                    <input
                      className="login_form_contianer__input"
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>

                  <button
                    className="login_form_contianer__btn"
                    type="button"
                    disabled={isLoading}
                    onClick={verifyOtp}
                  >
                    {isLoading ? (
                      <>
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size="small"
                          color="white"
                        />{" "}
                        Verifying ...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="login_form_contianer__title">Admin Login</h1>
                <form>
                  <div className="login_form_contianer__input-box">
                    <input
                      className="login_form_contianer__input"
                      type="text"
                      placeholder="Enter Admin Email"
                      value={adminemail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="login_form_contianer__input-box">
                    <input
                      className="login_form_contianer__input"
                      type="password"
                      placeholder="Enter Admin Password"
                      value={adminpassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="login_form_contianer__btn"
                    type="button"
                    disabled={isLoading}
                    onClick={handleAdminLogin}
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
                </form>
              </>
            )}
          </div>
        </>
      )}
      <ToastContainer />
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="paymentDetailsModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header payment">
              <h3>Payment Details for {selectedOrder.product_name}</h3>
              <button className="closeBtn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <p>
                  <strong>Product Name:</strong> {selectedOrder.product_name}
                </p>
                <p>
                  <strong>Product Type:</strong> {selectedOrder.product_type}
                </p>
                <p>
                  <strong>Price:</strong> ₹{" "}
                  {formatIndianNumber(parseInt(selectedOrder.total_amount))}
                </p>
              </div>
              <div className="payment-details-table">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Transaction ID:</strong>
                      </td>
                      <td>{paymentDetails.transactionId}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Transaction Date:</strong>
                      </td>
                      <td>{formatDate(paymentDetails.dateOfTransaction)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Account ID:</strong>
                      </td>
                      <td>{paymentDetails.accountNo}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Amount:</strong>
                      </td>
                      <td>
                        ₹ {formatIndianNumber(parseInt(paymentDetails.amount))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                style={{ marginTop: "10px" }}
                disabled={approveBtnText === "Approved"}
                className="button-7"
                onClick={() => handleApproveOrder(selectedOrder)}
              >
                {approveBtnText}
              </button>
            </div>
          </div>
        </div>
      )}
      {showContactsModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="paymentDetailsModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Contact Details for {selectedOrder.product_name}</h3>
              <button
                style={{ color: "black" }}
                className="closeBtn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <p>
                  <strong>Customer Name:</strong> {selectedOrder.companyname}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p>
                  <strong>Mobile No. :</strong> {selectedOrder.phone_no}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
