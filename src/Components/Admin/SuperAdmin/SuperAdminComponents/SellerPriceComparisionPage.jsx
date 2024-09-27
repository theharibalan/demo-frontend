import React, { useEffect, useState } from "react";
import { InfoCircleTwoTone } from "@ant-design/icons";
import axios from "axios";
import "../../admin.css";
import { Button, Form, Cascader, Input, message, Modal } from "antd";

function AllSellersProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(null);
  const [poModal, setPoModal] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [priceOfProduct, setPriceOfProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ltoh"); // Default sort order

  const options = [
    {
      code: "ltoh",
      name: "Least to Highest",
    },
    {
      code: "htol",
      name: "Highest to Least",
    },
  ];

  const token = localStorage.getItem("admin-token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/seller/getAllProducts`,
          [],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedProducts = response.data;

        // Apply default sorting (least to highest)
        const sortedProducts = sortProducts(fetchedProducts, sortOrder);
        setProducts(sortedProducts);
        setLoading(false);
      } catch (err) {
        setError("Error fetching products data");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, sortOrder]);

  // Sorting function
  const sortProducts = (items, order) => {
    const sortedItems = [...items];
    if (order === "ltoh") {
      return sortedItems.sort((a, b) => a.price - b.price); // Least to highest
    } else if (order === "htol") {
      return sortedItems.sort((a, b) => b.price - a.price); // Highest to least
    }
    return sortedItems; // Return unsorted if no match
  };

  const handleSortChange = (value) => {
    setSortOrder(value[0]); // Update the sort order when the user selects an option
  };

  const handleRequestPO = () => {
    setPoModal(true);
  };

  const sendRequestPO = (vals) => {
    setRequesting(true);
    const poData = {
      productId: selectedProduct.productId,
      customerId: selectedProduct.customerId,
      quantity: vals.quantity,
      price: vals.priceOfProduct,
      productName: selectedProduct.productName,
    };
    console.log(poData);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/po/addpo`, poData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        message.success("PO Request sent successfully");
        setRequesting(false);
      })
      .catch(() => {
        message.error("Error sending PO request");
        setRequesting(false);
      });
  };

  const filteredProducts = products.filter((item) => {
    return (
      (item.productType ? item.productType.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      (item.CompanyName ? item.CompanyName.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      )
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-tables">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>All Sellers Products</h2>
        <div>
          <Cascader
            style={{ width: "150px" }}
            fieldNames={{ label: "name", value: "code" }}
            defaultValue={["ltoh"]} // Default sort order
            options={options}
            onChange={handleSortChange} // Trigger sort on change
            placeholder="Sort by Price"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Input
            style={{ width: "200px" }}
            type="text"
            placeholder="Search by Seller or Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table yellow-table">
        <thead>
          <tr>
            <th>Seller</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Seller's Price/KG</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Request PO</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item) => (
            <tr key={item.productId}>
              <td>{item.CompanyName}</td>
              <td>
                {item.productName} [{item.productType}]
              </td>
              <td>{item.units}</td>
              <td>Rs.{item.price}</td>
              <td>{item.phoneNo}</td>
              <td>{item.Email}</td>
              <td>
                <button
                  className="button-7"
                  onClick={() => {
                    setSelectedProduct(item);
                    handleRequestPO();
                  }}
                >
                  Request PO
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title={
          <span>
            <InfoCircleTwoTone /> Publish Product
          </span>
        }
        visible={poModal}
        onCancel={() => setPoModal(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <p>Are you sure you want to request PO to this seller?</p>
        <Form layout="vertical" onFinish={sendRequestPO}>
          <Form.Item label="Price/KG" name="priceOfProduct">
            <Input
              onChange={(e) => setPriceOfProduct(e.target.value)}
              type="number"
              required
            />
          </Form.Item>
          <Form.Item label="Quantity * (in TONNES)" name="quantity">
            <Input
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              required
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={requesting}>
            {requesting ? (
              <>
                <div className="spinner" />
                <p style={{ paddingLeft: "20px", margin: "0" }}>
                  Requesting Po
                </p>
              </>
            ) : (
              "Request PO"
            )}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default AllSellersProducts;
