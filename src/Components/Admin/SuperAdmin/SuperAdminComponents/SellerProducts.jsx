import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  FloatButton,
  Input,
  Form,
  Select,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../admin.css";
import { InfoCircleTwoTone } from "@ant-design/icons";
const { Option } = Select;

const Listofproducts = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    if(!localStorage.getItem('admin-role'))
    {
      navigate("/admin@b2b/b2bhubindia")
    }
  })
  const location = useLocation();
  const seller = location.state?.seller;

  const [data, setData] = useState([]);
  const customerId = seller.customerId;
  console.log(customerId);
  // const [token,settoken]=useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJhbmtvbmRhQGdtYWlsLmNvbSIsImlhdCI6MTcyNjA1NDQ3NywiZXhwIjoxNzI2MTQwODc3fQ.4NC-sOl3BSLxi_Ca1BK-h6ILPs1IGLoG5S4eAuh3lBM")

  const handleFetch = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/seller/getProductsBySellerId/${seller.customerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching products by seller ID:", error);
    }
  };

  useEffect(() => {
    handleFetch(); // Fetch data when component mounts or seller.customerId changes
  }, []);

  console.log("Prducts for Seller : ", data);

  const [products, setProducts] = useState(data);
  const [isEditing, setIsEditing] = useState(null);

  // Convert packaging object to array of {kg, bags} pairs for editing
  const handleEdit = (index) => {
    const productToEdit = data[index];
    if (productToEdit) {
      setIsEditing({ price: productToEdit.price, index });
    } else {
      console.error("Product not found at index:", index);
    }
  };

  // Convert array of {kg, bags} pairs back to object when saving
  const handleSave = async (values) => {
    const updatedProduct = {
      ...isEditing,
      price: values.price, // Update only the price
    };

    const updatedProducts = [...products];
    updatedProducts[isEditing.index] = {
      ...data[isEditing.index],
      price: values.price,
    }; // Update price only
    setProducts(updatedProducts);
    console.log("Updated Products", updatedProducts[1]);

    setIsEditing(null);
    const formData = {
      customerId: updatedProducts[1].customerId,
      description: updatedProducts[1].description,
      index: updatedProducts[1].index,
      isOrganic: updatedProducts[1].isOrganic,
      moisture: updatedProducts[1].moisture,
      packaging: updatedProducts[1].packaging,
      price: updatedProducts[1].price,
      productId: updatedProducts[1].productId,
      productImg: updatedProducts[1].productImg,
      productName: updatedProducts[1].productName,
      shelfLife: updatedProducts[1].shelfLife,
      units: updatedProducts[1].units,
      validity: updatedProducts[1].validity,
    };

    try {
      const productID = data[isEditing.index].productId;
      console.log(data);

      if (!productID) {
        throw new Error("Product ID is undefined");
      }
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/seller/updateProduct/${productID}`,
        JSON.stringify(formData),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product updated successfully");
      message.success("Price updated successfully");
    } catch (error) {
      console.error("Error updating price:", error);
      message.error("Failed to update price");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleDelete = async (productID) => {
    try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/seller/deleteProduct/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setData((prevData) =>
          prevData.filter((product) => product.productId !== productID)
        );
        console.log("Product deleted successfully");
        message.success("Prodict Deleted Successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Error Deleting Product");
    }
  };
  const [productToDelete, setProductToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showDeleteConfirm = (productID) => {
    setProductToDelete(productID);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setProductToDelete(null);
  };

  return (
    <>
      <h2 className="title"> Products from {seller.CompanyName}</h2>
      <Row gutter={16}>
        <div className="all--seller--products">
          {data.map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                className="card"
                cover={
                  <div style={{ width: "100%", textAlign: "center" }}>
              <img
                alt={product.productName}
                src={product.productImg}
                style={{
                  borderRadius: "10px",
                }}
              />
            </div>
                }
          actions={[
            <Button key="approve" type="primary">
              Approve
            </Button>,
            <Button
              key="decline"
              danger
              onClick={() => showDeleteConfirm(product.productId)} // Show confirmation modal
            >
              Decline
            </Button>,
            <Button key="edit" onClick={() => handleEdit(index)}>
              Edit
            </Button>,
          ]}
              >
          {isEditing && isEditing.index === index ? (
            <Form
              layout="vertical"
              initialValues={isEditing}
              onFinish={handleSave}
            >
              {/* Only show the Price field */}
              <Form.Item label="Price/KG" name="price">
                <Input />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form>
          ) : (
            <div
              className="each--seller--card"
              style={{ textAlign: "left" }}
                  >
          <h3>{product.productName}</h3>
          <p>
            <strong>Price:</strong> {product.price} per KG
          </p>
          <p>
            <strong>Quantity:</strong> {product.units}
          </p>
          <p>
            <strong>Organic:</strong>{" "}
            {product.isOrganic ? "Yes" : "No"}
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
          <ul>
            {product.packaging &&
              Object.keys(product.packaging).length > 0 ? (
              Object.keys(product.packaging).map((kg) => (
                <li key={kg}>
                  {kg}: {product.packaging[kg]} bags
                </li>
              ))
            ) : (
              <li>No packaging information available</li>
            )}
          </ul>
        </div>
                )}
      </Card>
    </Col >
          ))}
<FloatButton.BackTop style={{ marginBottom: "40px" }} />
        </div >
      </Row >
  <Modal
    title={
      <span>
        <InfoCircleTwoTone /> Confirm Deletion
      </span>
    }
    visible={isModalVisible}
    onOk={() => handleDelete(productToDelete)}
    onCancel={handleCancel}
    okText="Yes, Delete"
    cancelText="Cancel"
  >
    <p>Are you sure you want to delete this product?</p>
  </Modal>
    </>
  );
};

export default Listofproducts;
