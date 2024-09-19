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
import axios from "axios";
import "../../admin.css";
import { InfoCircleTwoTone } from "@ant-design/icons";
import "./sellerEachcard.css";

const Listofproducts = () => {
  const [data, setData] = useState([]);
  const [token, settoken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJhbmtvbmRhQGdtYWlsLmNvbSIsImlhdCI6MTcyNjA1NDQ3NywiZXhwIjoxNzI2MTQwODc3fQ.4NC-sOl3BSLxi_Ca1BK-h6ILPs1IGLoG5S4eAuh3lBM"
  );
  const [publishModelOpen, setPublishModelOPen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const handleFetch = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/seller/getAllProducts`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("you want all products ", res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching products by seller ID:", error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const [products, setProducts] = useState(data);
  const [isEditing, setIsEditing] = useState(null);

  const handleEdit = (index) => {
    const productToEdit = data[index];
    if (productToEdit) {
      setIsEditing({ price: productToEdit.price, index });
    } else {
      console.error("Product not found at index:", index);
    }
  };

  const handleSave = async (values) => {
    const updatedProducts = [...products];
    updatedProducts[isEditing.index] = {
      ...data[isEditing.index],
      price: values.price,
    };
    setProducts(updatedProducts);
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
      if (!productID) {
        throw new Error("Product ID is undefined");
      }
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/seller/updateProduct/${productID}`,
        JSON.stringify(formData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
      message.success("Product Deleted Successfully");
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
  const handlePublishProduct = (vals) => {
    const adminAddProductUrl = `${process.env.REACT_APP_BACKEND_URL}/admin/addProduct`;

    const publishData = {
      name: selectedProduct.productName,
      CommonImage: selectedProduct.productImg,
      description: {
        Speciality: "High in Protein",
        Moisture: "",
        IsOrganic: selectedProduct.isOrganic,
        QualityAvailable: "A Grade",
        ShelfLife: "6 Months",
      },
      offerStartDate: vals.offerStartDate,
      offerStartTime: vals.offerStartTime,
      offerDuration: parseInt(vals.offerDuration), // duration in hours
      costPerUnit: [
        {
          grade: selectedProduct.productType,
          PricePerUnit: parseFloat(vals.price),
          Image: selectedProduct.productImg,
        },
      ],
      productId: selectedProduct.productId,
    };
    axios
      .post(adminAddProductUrl, publishData)
      .then((res) => {
        message.success("Product Published Successfully");
        setPublishModelOPen(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("failed to publish product");
      });
  };
  const handlePublish = () => {
    setPublishModelOPen(true);
  };
  const handlePublishCancel = () => {
    setPublishModelOPen(false);
  };
  return (
    <>
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
                        maxWidth: "100%",
                        maxHeight: "250px",
                        objectFit: "fill",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                }
                actions={[
                  <Button
                    key="decline"
                    danger
                    onClick={() => showDeleteConfirm(product.productId)}
                  >
                    Delete
                  </Button>,
                  <Button
                    onClick={() => {
                      setSelectedProduct(product);
                      handlePublish();
                    }}
                    key="approve"
                    type="primary"
                  >
                    Publish
                  </Button>,
                ]}
              >
                {isEditing && isEditing.index === index ? (
                  <Form
                    layout="vertical"
                    initialValues={isEditing}
                    onFinish={handleSave}
                  >
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
                    {/* <div className="slr-product--img">
                    <img src={product.productImg} alt="dff" />
                  </div> */}
                  <h3>{product.CompanyName}</h3>
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
                            {kg}: {product.packaging[kg]} TONNES
                          </li>
                        ))
                      ) : (
                        <li>No packaging information available</li>
                      )}
                    </ul>
                  </div>
                )}
              </Card>
            </Col>
          ))}
          <FloatButton.BackTop style={{ marginBottom: "40px" }} />
        </div>
      </Row>
      <Modal
        title={
          <span>
            <InfoCircleTwoTone /> Confirm Deletion
          </span>
        }
        open={isModalVisible}
        onOk={() => handleDelete(productToDelete)}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>Publish the product</p>
      </Modal>
      <Modal
        title={
          <span>
            <InfoCircleTwoTone /> Publish Product
          </span>
        }
        open={publishModelOpen}
        onOk={() => handlePublishProduct()}
        onCancel={handlePublishCancel}
        cancelText="Cancel"
        footer={null}
      >
        <p>Are you sure you want to Publish this product?</p>
        <Form
          layout="vertical"
          initialValues={isEditing}
          onFinish={handlePublishProduct}
        >
          <Form.Item label="Price/KG" name="price">
            <Input placeholder={selectedProduct?.price} required />
          </Form.Item>
          <Form.Item label="Date Of publish" name="offerStartDate">
            <Input required />
          </Form.Item>
          <Form.Item label="Time Of publish" name="offerStartTime">
            <Input required />
          </Form.Item>
          <Form.Item label="Expiry time (in hrs)" name="offerDuration">
            <Input required />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Publish
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Listofproducts;
