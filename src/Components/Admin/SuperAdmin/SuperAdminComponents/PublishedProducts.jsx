import { message, Modal, Input } from "antd"; // Import Input for the price input
import axios from "axios";
import React, { useEffect, useState } from "react";

const PublishedProducts = () => {
  const [data, setData] = useState([]);
  const [removingId, setRemovingId] = useState(null); // Track which product is being removed
  const [editingId, setEditingId] = useState(null); // Track which product's price is being edited
  const [newPrice, setNewPrice] = useState(""); // Track the new price input
  const [searchTerm, setSearchTerm] = useState("");
  const url = `${process.env.REACT_APP_BACKEND_URL}/admin/getAllProductsForAdmin`;

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
        console.log("published", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const filteredPublishedPos = data.filter((item) => {
    return (
      (item.name ? item.name : "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.productId ? item.productId : "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const handleRemovePublish = (id) => {
    setRemovingId(id); // Set the ID of the product being removed
    const token = localStorage.getItem("admin-token");
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/admin/deleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        message.success("Product Removed Successfully");
        setData((prevData) => prevData.filter((item) => item.productId !== id));
        setRemovingId(null);
      })
      .catch((err) => {
        message.error("Failed to Remove Product");
        setRemovingId(null);
      });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "Once deleted, this action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleRemovePublish(id);
      },
    });
  };

  // Show modal to input new price
  const showEditPriceModal = (id, price) => {
    setEditingId(id); // Set the ID of the product being edited
    Modal.confirm({
      title: "Edit Product Price",
      content: (
        <Input
          // type="number"
          placeholder={price}
          // value={price}
          onChange={(e) => setNewPrice(e.target.value)}
        />
      ),
      okText: "Change Price",
      onOk() {
        handleChangePrice(id,newPrice);
      },
      onCancel() {
        setNewPrice("");
      },
    });
  };

  const handleChangePrice = (id,newPrice) => {
    console.log("new Price ra bhayya", newPrice);
    if (!newPrice || isNaN(newPrice)) {
      message.error("Please enter a valid price.");
      return;
    }
    const token = localStorage.getItem("admin-token");
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/updatePrice/${id}`,
        {
          price: newPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.productId === id ? { ...item, price: newPrice } : item
              )
            );
            message.success(`Price updated to ${newPrice} for product ID: ${id}`);
          })
      .catch((err) => {
        console.error(err);
        message.error("Failed to update product price");
      })
      .finally(() => {
        setNewPrice(""); // Clear the price input
        setEditingId(null); // Reset the editing ID
      });
  };

  return (
    <div className="order-tables">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>All Published Products </h2>
        <Input
          style={{ width: "400px" }}
          type="text"
          placeholder="Search by Product Name or Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table yellow-table">
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Product Name</th>
            <th>Date of Publish</th>
            <th>Price Per Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        {data.length === 0 ? (
          <h3>No Products Published yet</h3>
        ) : (
          <tbody>
            {filteredPublishedPos.map((item) => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>
                  {item.name} {item.productType}
                </td>
                <td>{item.offerStartDate}</td>
                <td>{item.costPerUnit[0].PricePerUnit}</td>
                <td>
                  <button
                    className="button-7"
                    disabled={removingId === item.productId}
                    onClick={() => showConfirm(item.productId)}
                  >
                    {removingId === item.productId ? "Removing" : "Remove"}
                  </button>
                  &nbsp;
                  <button
                    className="button-7"
                    onClick={() =>
                      showEditPriceModal(
                        item.productId,
                        item.costPerUnit[0].PricePerUnit
                      )
                    }
                  >
                    Edit Price
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default PublishedProducts;
