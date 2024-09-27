import React, { useEffect, useState } from "react";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdArrowUp } from "react-icons/io";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../admin.css";
import { Button } from "antd";
import { Input } from "antd";

import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List_of_sellers = () => {
  const navigate = useNavigate();
  // sorting and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("ascend");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/b2b/getAllSellers`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(res.data); // Set the fetched data to the state
        console.log("sellerdata", res.data); // Log the actual data
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching customers data.", {
          position: "top-center",
        });
      }
    };

    fetchData(); // Automatically call the async function when the component mounts
  }, []);

  console.log("Fetched Data:", data);

  const exportToExcel = () => {
    // Format the data for Excel export
    const formattedData = data.map((item) => ({
      Name: item.Name,
      "GST No": item.GST_No,
      PAN: item.PAN,
      "Phone Number": item.Phone_number,
      // View: item.status,
      // "Shipping Address": item.shippingAddress,
    }));

    // Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set uniform column widths
    const wscols = [
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 17 },
      { wch: 50 },
    ];
    worksheet["!cols"] = wscols;

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sellers Details");

    // Append current date and time to the filename
    const now = new Date();
    const date =
      `${now.getFullYear()}` -
      `${String(now.getMonth() + 1).padStart(2, "0")}` -
      `${String(now.getDate()).padStart(2, "0")}`;
    const time =
      `${String(now.getHours()).padStart(2, "0")}` -
      `${String(now.getMinutes()).padStart(2, "0")}` -
      `${String(now.getSeconds()).padStart(2, "0")}`;
    const timestamp = `${date}_${time}`;
    const filename = `Sellers_Report_${timestamp}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
  };
  // ------------------------------------------------------------------------------

  const handleSort = () => {
    data.reverse();
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "ascend" ? "descend" : "ascend"
    );
  };

  // When "View" is clicked, show Listofproducts component
  const handleViewClick = (seller) => {
    console.log(seller);
    navigate("/admin@b2b/b2bhubindia/seller-products", { state: { seller } });
  };
  const filteredSellers = data.filter((item) => {
    return (item.CompanyName ? item.CompanyName : "").includes(searchQuery);
  });

  return (
    <div className="seller-cont">
      <div className="  order-tables ">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>
              Sellers
              <Button className="sort-button" onClick={handleSort}>
                {sortOrder === "ascend" ? (
                  <IoMdArrowUp />
                ) : (
                  <IoArrowDownOutline />
                )}
              </Button>
            </p>
          </div>

          <div>
            <Input
              style={{ width: "400px" }}
              type="text"
              placeholder="Search by Seller Name "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
            ></Button>
          </div>
        </div>
        <table className="table yellow-table ">
          <thead>
            <tr>
              <th>Name</th>
              <th>GST No</th>
              <th>PAN</th>
              <th>Phone number</th>
              <th>View Products</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.map((e, index) => (
              <tr key={index}>
                <td>{e.CompanyName}</td>
                <td>{e.gstNo}</td>
                <td>{e.PAN}</td>
                <td>{e.phoneNo}</td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button onClick={() => handleViewClick(e)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List_of_sellers;
