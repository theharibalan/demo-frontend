import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../admin.css";
import axios from "axios";
import { Empty, Spin } from "antd";

const GenerateCommercialDocs = () => {
  const [selectedType, setSelectedType] = useState("All");
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/slips/getAllInvoicesLinks`,
          [],
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const formatInvoices = (invoices, type) => {
          return invoices
            .filter(
              (invoice) =>
                (invoice.DateOfGeneration || invoice.dateofgeneration) &&
                invoice.GenerationLink
            )
            .map((invoice) => ({
              id:
                invoice.ProformaInvoiceId ||
                invoice.salesinvoiceId ||
                invoice.purchaseorderId ||
                invoice.workorderId,
              type: type,
              date:
                invoice.DateOfGeneration || invoice.dateofgeneration || null,
              url: invoice.GenerationLink,
            }));
        };

        const proformaInvoices = formatInvoices(
          response.data.proformaInvoices,
          "Proforma Invoice"
        );
        const salesInvoices = formatInvoices(
          response.data.salesInvoices,
          "Sales Invoice"
        );
        const purchaseOrders = formatInvoices(
          response.data.purchaseOrders,
          "Purchase Order"
        );
        const workOrders = formatInvoices(
          response.data.workOrders,
          "Work Order"
        );

        const combinedInvoices = [
          ...proformaInvoices,
          ...salesInvoices,
          ...purchaseOrders,
          ...workOrders,
        ];

        setInvoiceData(combinedInvoices);
        console.log(combinedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", "3");
  }, []);

  const handleFilterChange = (event) => {
    setSelectedType(event.target.value);
  };

  const filteredData =
    selectedType === "All"
      ? invoiceData
      : invoiceData.filter((pdf) => pdf.type === selectedType);
  return (
    <div>
      <p>Generate Commercial Docs</p>
      <div style={{ width: "fit-content", margin: "auto" }}>
        <label htmlFor="typeFilter">Filter by Type: </label>
        <select
          id="typeFilter"
          value={selectedType}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Sales Invoice">Sales Invoice</option>
          <option value="Proforma Invoice">Proforma Invoice</option>
          <option value="Delivery Challan">Delivery Challan</option>
          <option value="Work Order">Work Order</option>
          <option value="Purchase Order">Purchase Order</option>
        </select>
        <button
          onClick={() =>
            navigate("/admin@b2b/b2bhubindia/commercial/proformaInvoice")
          }
          style={{ margin: "1em" }}
          className="button-7"
        >
          + PROFORMA INVOICE
        </button>
        <button
          onClick={() =>
            navigate("/admin@b2b/b2bhubindia/commercial/salesInvoice")
          }
          style={{ margin: "1em" }}
          className="button-7"
        >
          + SALE INVOICE
        </button>
        <button
          onClick={() =>
            navigate("/admin@b2b/b2bhubindia/commercial/deliveryChallan")
          }
          style={{ margin: "1em" }}
          className="button-7"
        >
          + DELIVERY CHALLAN{" "}
        </button>
        <button
          onClick={() =>
            navigate("/admin@b2b/b2bhubindia/commercial/workOrder")
          }
          style={{ margin: "1em" }}
          className="button-7"
        >
          + WORK ORDER
        </button>
        <button
          onClick={() =>
            navigate("/admin@b2b/b2bhubindia/commercial/purchaseOrder")
          }
          style={{ margin: "1em" }}
          className="button-7"
        >
          + PURCHASE ORDER{" "}
        </button>
      </div>
      <div className="order-tables">
        <table className="table yellow-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>ID</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </td>
              </tr>
            ) : (
              <>
                {filteredData.length > 0 ? (
                  filteredData.map((pdf, index) => (
                    <tr key={pdf.id}>
                      <td>{index + 1}</td>
                      <td>{pdf.id}</td>
                      <td>{pdf.type}</td>
                      <td>
                        <button
                          className="button-7"
                          onClick={() => window.open(pdf.url, "_blank")}
                        >
                          view
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan={4} style={{ textAlign: "center" }}>
                      <Empty description="No Invoice available" />
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerateCommercialDocs;
