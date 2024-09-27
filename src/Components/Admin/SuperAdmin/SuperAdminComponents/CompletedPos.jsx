import React, { useEffect, useState } from "react";
import "../../admin.css";
import axios from "axios";
import { Input } from "antd";

const AllPos = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleFetchPos = async () => {
    const token = localStorage.getItem("admin-token");
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/po/getAllPos`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const completedPos = res.data.filter((item) => item.poStatus);
        setData(completedPos);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleFetchPos();
  }, []);
  const filteredCompletedPos = data.filter((item) => {
    return (
      (item.CompanyName ? item.CompanyName.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      (item.productName ? item.productName.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      )
    );
  });
  return (
    <div className="order-tables">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>All Purchase Orders </h2>
        <Input
          style={{ width: "400px" }}
          type="text"
          placeholder="Search by Company or Product Name or Po Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table yellow-table">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Company Name</th>
            <th>Product Name</th>
            <th>Price </th>
            <th>Quantity</th>
            <th>View PO</th>
          </tr>
        </thead>
        {filteredCompletedPos.length === 0 ? (
          <h3>No Received POs yet</h3>
        ) : (
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={item.poId}>
                  <td>{item.poId}</td>
                  <td>{item.CompanyName}</td>
                  <td>{item.productName}</td>

                  <td>{item.totalPrice}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.poStatus === 1 ? (
                      <a target="_blank" href={item.PurchaseOrderURL}>
                        View PO
                      </a>
                    ) : (
                      <p>Pending</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default AllPos;
