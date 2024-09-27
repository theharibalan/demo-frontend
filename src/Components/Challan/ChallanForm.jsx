import React, { useEffect } from "react";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./logo.png";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChallanForm = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [challanId, setChallanId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("admin-role")) {
      navigate("/admin@b2b/b2bhubindia");
    }
  });

  const [viewPdf, setViewPdf] = useState(false);
  const [formData, setFormData] = useState({
    fromAdd: "",
    toAddr: "",
    fromGstIn: "",
    toGstIn: "",
    vehicleNo: "",
    tendorNo: "",
    dt: "",
    tNCSC: "",
    description: "",
    noofbags: 0,
    totalQuantity: 0,
  });
  const handleUpdate = async () => {
    const data = {
      dateofgeneration: new Date().toISOString().split("T")[0],
      generationlink: pdfUrl,
    };

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/slips/updateDeliveryChallan/${challanId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Delivery Challan updated successfully:", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            "Error updating Delivery Challan:",
            error.response.data
          );
        } else {
          console.error("Error:", error.message);
        }
      });
  };
  useEffect(() => {
    if (!pdfUrl) {
      handleUpdate();
    }
  }, [pdfUrl]);
  const downloadPdf = async () => {
    const htmlElement = document.getElementById("Challan");

    const pdf = new jsPDF("p", "mm", "a4");

    if (!pdfUrl) {
      try {
        const canvas = await html2canvas(htmlElement, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        const pdfBlob = pdf.output("blob");

        const formData = new FormData();
        formData.append("file", pdfBlob, "invoice");
        formData.append("upload_preset", "payslips");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dtgnotkh7/auto/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPdfUrl(response.data.secure_url);
        window.open(response.data.secure_url, "_blank");
      } catch (error) {
        if (error.response) {
          console.error("Error uploading PDF:", error.response.data);
        } else {
          console.error("Error:", error.message);
        }
      }
    } else {
      window.open(pdfUrl, "_blank");
    }
  };
  const handleGeneratepdf = async () => {
    try {
      if (!challanId) {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/slips/getDeliveryChallanId`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setChallanId(res.data.challanId);
        console.log("id generated", res.data);
      }
      // downloadPdf();
    } catch (err) {
      console.log(err);
    }
  };
  const styles = {
    container: {
      position: "relative",
      maxWidth: "650px",
      margin: window.innerWidth < 780 ? "20px" : "20px auto",
      fontFamily: "Arial, sans-serif",
      border: "2px solid grey",
      borderRadius: "10px",
      padding: "30px 40px",
      textAlign: "center",
      overflowX: "scroll",
      scrollbarWidth: "none",
    },
    back: {
      display: window.innerWidth < 900 ? "block" : "none",
      position: "absolute",
      top: "25px",
      left: "25px",
      fontSize: "30px",
      color: "red",
    },
    row: {
      display: "flex",
      flexWrap: "wrap", // Enables wrapping when the width is insufficient
      gap: "15px", // Adds space between input fields
      marginBottom: "15px",
    },
    column: {
      flex: "1 1 100px", // Allows columns to take up at least 300px and grow with available space
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      minWidth: "200px", // Ensures a minimum width for each column
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
      textAlign: "left",
    },
    input: {
      margin: "0",
      boxSizing: "border-box",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "7px",
      outline: "none",
      fontSize: "16px",
    },
    textarea: {
      boxSizing: "border-box",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      resize: "vertical",
      outline: "none",
      fontSize: "16px",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textAlign: "center",
      marginTop: "20px",
      boxSizing: "border-box",
      fontSize: "16px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleGeneratepdf();
    setFormData(formData);
    console.log(formData);
    setViewPdf(true);
  };
  return (
    <div>
      {!viewPdf ? (
        <div style={styles.container}>
          <IoArrowBackCircleOutline
            style={styles.back}
            onClick={() => navigate(-1)}
          />
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            <h1>Challan Form</h1>

            {/* Row -2 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>From Address:</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="fromAdd"
                  value={formData.fromAdd.toUpperCase()}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* <h1>Seller's Details</h1> */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>To Address:</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="toAddr"
                  value={formData.toAddr.toUpperCase()}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>from GSTIN:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="fromGstIn"
                  value={formData.fromGstIn}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row -1 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>To GSTIN:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="toGstIn"
                  value={formData.toGstIn}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}> Vehicle No:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row 0 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Tendor No:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="tendorNo"
                  value={formData.tendorNo}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>DT:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="dt"
                  value={formData.dt}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row 1 */}
            {/* <h1>Buyer's Details</h1> */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>TNCSC :</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="tNCSC"
                  value={formData.tNCSC}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Description:</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>No.of Bags:</label>
                <input
                  required
                  style={styles.input}
                  type="number"
                  min={0}
                  name="noofbags"
                  value={formData.noofbags}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Total Quantity in kg/Mts:</label>
                <input
                  required
                  style={styles.input}
                  type="text"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <>
          <div
            style={{
              width: "800px",
              margin: "20px auto",
              border: "1px solid black",
              fontFamily: "Arial, sans-serif",
              padding: "10px",
            }}
            id="Challan"
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                borderBottom: "2px solid black",
                paddingBottom: "5px",
                margin: "10px 0 10px 0",
              }}
            >
              DELIVERY CHALLAN
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <tbody>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "14px",
                      textAlign: "left",
                      lineHeight: "30px",
                    }}
                  >
                    DELIVERY CHALLAN No. {challanId}
                  </td>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "14px",
                      textAlign: "left",
                      lineHeight: "30px",
                    }}
                  >
                    DATE:{" "}
                    {new Date()
                      .toISOString()
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </td>
                </tr>
                <tr style={{ fontSize: "12px" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      verticalAlign: "top",
                      textAlign: "left",
                      borderRight: 0,
                    }}
                  >
                    <strong>FROM</strong>
                    <br />
                    {formData.fromAdd.split("\n").map((line, index) => (
                      <p style={{ margin: 0 }} key={index}>
                        {line}
                      </p>
                    ))}
                    <br />
                    GSTIN: {formData.fromGstIn}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                      textAlign: "center",
                      padding: "8px",
                      verticalAlign: "middle",
                    }}
                  >
                    <img src={logo} alt="VTS Logo" style={{ width: "80px" }} />
                  </td>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      verticalAlign: "top",
                      textAlign: "left",
                    }}
                  >
                    <strong>TO</strong>
                    <br />
                    {formData.fromAdd.split("\n").map((line, index) => (
                      <p style={{ margin: 0 }} key={index}>
                        {line}
                      </p>
                    ))}{" "}
                    <br />
                    TNCSC GSTIN: {formData.toGstIn}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <tbody>
                <tr style={{ fontSize: "12px" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Vehicle No. :
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.vehicleNo}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Tender No: {formData.tendorNo} DT:{formData.dt}{" "}
                    {formData.tNCSC}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "gray", fontSize: "13px" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    Sl. No.
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    No. of Bags
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    Total Qty. Kgs / Mts
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontSize: "12px" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    1
                  </td>
                  <td style={{ border: "1px solid black", padding: "10px" }}>
                    {formData.description}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.noofbags}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.totalQuantity}
                  </td>
                </tr>
                <tr style={{ fontSize: "12px" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "left",
                      padding: "10px",
                    }}
                    colSpan={2}
                  >
                    Total
                  </td>

                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.noofbags}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.totalQuantity}
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{ textAlign: "left", marginTop: "10px", fontSize: "12px" }}
            >
              <div>Thanking you,</div>
              <div
                style={{
                  marginTop: "30px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                VTS Enterprises India Private Limited
              </div>
              <div style={{ marginTop: "60px", fontSize: "12px" }}>
                Authorised Signatory
              </div>
              <div
                style={{
                  marginTop: "50px",
                  textAlign: "right",
                  fontSize: "14px",
                }}
              >
                Signature of the Transporter
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <button
              className="Button7"
              onClick={() => setViewPdf(false)}
              style={{
                padding: "10px",
                color: "white",
                backgroundColor: "blue",
                width: "50px",
              }}
            >
              Edit
            </button>
            <button
              className="Button7"
              onClick={downloadPdf}
              style={{
                padding: "10px",
                color: "white",
                backgroundColor: "blue",
              }}
            >
              Upload PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallanForm;
