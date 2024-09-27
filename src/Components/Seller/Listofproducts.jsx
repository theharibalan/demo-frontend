import React, { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Col,
  Row,
  Button,
  FloatButton,
  Modal,
  message,
  Table,
  Spin, Empty
} from "antd";
import "./Listofproducts.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InfoCircleTwoTone } from '@ant-design/icons';
import Invoice from "./Invoice";
import GenarateInvoiceAfterPayment from "./GenarateInvoiceAfterPayment";

const Listofproducts = () => {
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState({});
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState({});
  const [visibleInvoice, setVisibleInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [noData, setNoData] = useState(false);

  const handleFetch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("User is not authenticated.");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/seller/getProductsBySellerId`,
        { customerId: localStorage.getItem("customerId") },
        {
          headers: {
            Authorization: ` Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );


      if (res.data.length === 0) {
        setNoData(true); // If no data, set noData to true
      } else {
        setData(res.data); // Set data if there is a response
        setNoData(false); // Reset noData if data is present
      }
    } catch (error) {
      console.error("Error fetching products by seller ID:", error);
      setNoData(true); // If there's an error, also set noData to true
    } finally {
      setLoading(false); // End loading after fetching
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);


  const formatDate = (isoDate) => {
    if (!isoDate) return ''; // Handle case where date is null or undefined

    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const handleDelete = async (productID) => {
    setLoadingDelete((prevState) => ({ ...prevState, [productID]: true }));
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("User is not authenticated.");
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/seller/deleteProduct/${productID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setData((prevData) => prevData.filter((product) => product.productId !== productID));
      message.success("Product Deleted Successfully")
      handleCancel()
      handleFetch()
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error("Error Deleting Product")
    } finally {
      setLoadingDelete((prevState) => ({ ...prevState, [productID]: false }));
    }
  };
  const showDeleteConfirm = (productID) => {
    setProductToDelete(productID);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setProductToDelete(null);
  };

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/po/getPoById`, [], {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        // console.log(response.data);

        const fetchedOrders = response.data.map((order, index) => ({
          poId: order.poId,
          date: order.createdAt,
          totalPrice: parseInt(order.totalPrice),
          quantity: parseInt(order.quantity),
          PurchaseOrderURL: order.PurchaseOrderURL,
          productId: order.productId,
          productType: order.productType,
          key: index.toString(),
        }));
        // console.log(fetchedOrders);

        setPurchaseOrders(fetchedOrders);
      } catch (error) {
        message.error("Failed to fetch purchase orders");
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Table columns definition
  const purchaseOrderColumns = [
    {
      title: "PO_ID",
      dataIndex: "poId",
      key: "poId",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isLoading = loadingOrder[record.poId] || false;
        // console.log(record);

        return (
          <GenarateInvoiceAfterPayment loading={isLoading} poId={record.poId} totalPrice={record.totalPrice} quantity={record.quantity} PurchaseOrderURL={record.PurchaseOrderURL} productId={record.productId} productType={record.productType} />
        );
      },
    },
  ];

  return (
    <>
      <button className="addProd" onClick={() => navigate("/addProduct")}>
        Add Products
      </button>
      <Tabs defaultActiveKey="1" className="custom-tabs">
        <items tab="My Products" key="1">
          <Row gutter={16}>

            {loading ? (
              <div style={{ textAlign: "center", marginTop: "50px", width: "100vw" }}>
                <Spin size="large" />
              </div>
            ) : noData ? (
              <div style={{ textAlign: "center", marginTop: "50px", width: "100vw" }}>
                <Empty description="No products available" />
              </div>
            ) : (
              <Row gutter={[16, 16]} style={{ width: "100%", marginTop: "20px" }}>
                {data.map((product, index) => {
                  const matchingOrder = purchaseOrders.find(order => order.productId === product.productId);
                  const price = matchingOrder ? matchingOrder.totalPrice : product.price;
                  return (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card className="card" style={{ textAlign: 'center', borderRadius: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center", // Centering items horizontally
                        justifyContent: "space-between", // Spacing between content and button
                        height: "100%"
                      }}
                    >
                      {/* Image Section */}
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <img
                          alt={product.productName}
                          src={product.productImg}
                          style={{
                            width: "100%",
                            height: "180px",
                            backgroundPosition: "center",
                            objectFit: "fill",
                            borderRadius: "10px",
                          }}
                        />
                      </div>

                      {/* Content Section */}
                      <div style={{ textAlign: "left", width: "100%", padding: "10px" }}>
                        <h3 style={{ textAlign: "center" }}>{product.productName}</h3>
                        <p>
                          <strong>Price:</strong> {price} per KG
                        </p>
                        <p>
                          <strong>Quantity:</strong> {product.units}
                        </p>
                        <p>
                          <strong>Organic:</strong> {product.isOrganic ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Moisture:</strong> {product.moisture}
                        </p>
                        <p>
                          <strong>Shelf Life:</strong> {product.shelfLife}
                        </p>
                        <p>
                          <strong>Validity:</strong> {formatDate(product.validity)}
                        </p>
                        <p>
                          <strong>Description:</strong> {product.description}
                        </p>
                        <p>
                          <strong>Packaging:</strong>
                        </p>
                        <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginBottom: "16px" }}>
                          {Object.keys(product.packaging).map((kg) => (
                            <li key={kg} style={{ marginBottom: "4px" }}>
                              {kg}: {product.packaging[kg]} TONNES
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Delete Button Section */}
                      <Button
                        key="decline"
                        danger
                        onClick={() => showDeleteConfirm(product.productId)}
                        disabled={loadingDelete[product.productId]}
                        style={{ marginTop: "10px" }} // Add margin to separate the button from the content
                      >
                        {loadingDelete[product.productId] ? (
                          <>
                            <Spin /> Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </Card >
                </Col >
                )})}
              </Row >
            )}
            <FloatButton.BackTop style={{ marginBottom: "40px" }} />
          </Row >
          <Modal
            title={<span><InfoCircleTwoTone /> Confirm Deletion</span>}
            open={isModalVisible}
            onOk={() => handleDelete(productToDelete)}
            onCancel={handleCancel}
            okText="Yes, Delete"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete this product?</p>
          </Modal>
        </items >
        <items tab="Purchase Orders" key="2" style={{ padding: "0 30px" }}>
          <Table
            dataSource={purchaseOrders}
            columns={purchaseOrderColumns}
            rowKey="orderId"
          />
          {visibleInvoice && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="close-btn" onClick={() => setVisibleInvoice(null)}>
                  Close
                </button>
                <Invoice />
              </div>
            </div>
          )}
        </items>
      </Tabs >
    </>
  );
};

export default Listofproducts;