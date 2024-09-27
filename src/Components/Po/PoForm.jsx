import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import stamp from "../../assets/mudra.jpg";

const PoForm = () => {
  const [poId, setPoId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("admin-role")) {
      navigate("/admin@b2b/b2bhubindia");
    }
  });
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [formData, setFormData] = useState({
    sellerName: "",
    poDate: "",
    sellerAddress: "",
    sellerpan: "",
    sellerGST: "",
    vendorCode: "",
    kindAttn: "",
    phNo: "",
    MbNo: "",
    sellerEmail: "",
    buyerName: "",
    buyerAddress: "",
    buyerpan: "",
    buyergst: "",
    buyerEmail: "",
    deliveryPoint: "",
    cin: "",
    IECNo: "",
    ourName: "",
    ourPhNO: "",
    ourEmail: "",
    basicPrice: 0,
    otherCharges: 0,
    taxes: 0,
    products: [
      { prodDesp: "", uom: "", prodQuantity: 0, prodUnitRate: 0, igst: 0 },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleProduct = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index][name] = value; // Update the specific product by index
    setFormData((prevFormData) => ({
      ...prevFormData, // Keep other formData fields intact
      products: updatedProducts, // Update only products field
    }));
  };

  const addProduct = () => {
    setFormData((prevFormData) => ({
      ...prevFormData, // Keep other formData fields intact
      products: [
        ...prevFormData.products,
        { prodDesp: "", uom: "", prodQuantity: 0, prodUnitRate: 0, igst: 0 },
      ],
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);

    setFormData((prevFormData) => ({
      ...prevFormData, // Keep other formData fields intact
      products: updatedProducts, // Update only products field
    }));
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
      alignItems: "center",
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
    add: {
      width: "200px",
      backgroundColor: "blue",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textAlign: "center",
      marginButton: "50px",
      boxSizing: "border-box",
      fontSize: "16px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    removeButton: {
      backgroundColor: "red",
      color: "white",
      padding: "5px 10px",
      border: "none",
      cursor: "pointer",
    },
  };
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

  const numberToWords = (number) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    if (number === 0) return "Zero";

    let words = "";

    function convertToWords(n, suffix) {
      if (n > 0) {
        if (n < 10) words += units[n] + " ";
        else if (n < 20) words += teens[n - 10] + " ";
        else {
          words += tens[Math.floor(n / 10)] + " " + units[n % 10] + " ";
        }
        words += suffix ? suffix + " " : "";
      }
    }

    let crore = Math.floor(number / 10000000);
    number %= 10000000;
    let lakh = Math.floor(number / 100000);
    number %= 100000;
    let thousand = Math.floor(number / 1000);
    number %= 1000;
    let hundred = Math.floor(number / 100);
    number %= 100;

    if (crore) convertToWords(crore, "Crore");
    if (lakh) convertToWords(lakh, "Lakh");
    if (thousand) convertToWords(thousand, "Thousand");
    if (hundred) convertToWords(hundred, "Hundred");
    if (number > 0) convertToWords(number, "");

    return words.trim() + " Rupees Only";
  };

  const downloadPdf = async () => {
    const elements = document.querySelectorAll(".poPdf");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    let canvasPromises = [];

    if (!pdfUrl) {
      elements.forEach((element, index) => {
        canvasPromises.push(
          html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.5); // Adjust quality (0 to 1)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to the PDF
            if (index === 0) {
              pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
            } else {
              pdf.addPage();
              pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
            }
          })
        );
      });

      // After all canvases are generated, save the PDF and upload it
      Promise.all(canvasPromises).then(async () => {
        const pdfBlob = pdf.output("blob");

        const formData = new FormData();
        formData.append("file", pdfBlob, "purchase_order.pdf");
        formData.append("upload_preset", "payslips");

        try {
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dtgnotkh7/auto/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Set the state with the single PDF URL
          setPdfUrl(response.data.secure_url);
          window.open(response.data.secure_url, "_blank");
        } catch (error) {
          if (error.response) {
            console.error("Error uploading PDF:", error.response.data);
          } else {
            console.error("Error:", error.message);
          }
        }
      });
    } else {
      window.open(pdfUrl, "_blank");
    }
  };
  const handleUpdate = async () => {
    const data = {
      dateofgeneration: new Date().toISOString().split("T")[0],
      generationlink: pdfUrl,
    };

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/slips/updatePurchaseOrder/${poId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Delivery Challan updated successfully..!");
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
    if (pdfUrl) {
      handleUpdate();
    }
  }, [pdfUrl]);

  const handleGeneratepdf = async () => {
    try {
      if (!poId) {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/slips/getPurchaseOrderId`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPoId(res.data.purchaseorderId);
        console.log("id generated", res.data.purchaseorderId);
        setViewPdf(true)
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleGeneratepdf();
    setFormData(formData);
    console.log(formData);
  };
  return (
    <div style={styles.container}>
      {!viewPdf ? (
        <>
          <IoArrowBackCircleOutline
            style={styles.back}
            onClick={() => navigate(-1)}
          />
          <h1 style={{ marginBottom: "2rem" }}>Purchase Order Form</h1>
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "15px" }}
          >
            {/* Row -2 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Po Date :</label>
                <input
                required
                  style={styles.input}
                  type="date"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <h1>Seller's Details</h1>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Name :</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Sellers Address:</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>PAN :</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="sellerpan"
                  value={formData.sellerpan}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row -1 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>GST :</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="sellerGST"
                  value={formData.sellerGST}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Vendor Code :</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="vendorCode"
                  value={formData.vendorCode}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Kind Attn:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="kindAttn"
                  value={formData.kindAttn}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row 0 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Phone Number:</label>
                <input
                required
                  style={styles.input}
                  type="tel"
                  name="phNo"
                  value={formData.phNo}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Mobile Number:</label>
                <input
                required
                  style={styles.input}
                  type="tel"
                  name="MbNo"
                  value={formData.MbNo}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Seller Email:</label>
                <input
                required
                  style={styles.input}
                  type="email"
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row 1 */}
            <h1>Buyer's Details</h1>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Name :</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Address:</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Email:</label>
                <input
                required
                  style={styles.input}
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>PAN:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="buyerpan"
                  value={formData.buyerpan}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>GST:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="buyergst"
                  value={formData.buyergst}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>CIN:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>IEC No:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="IECNo"
                  value={formData.IECNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3 */}
            <h1>Our Contact Details</h1>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Name:</label>
                <input
                required
                  style={styles.input}
                  type="text"
                  name="ourName"
                  value={formData.ourName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Phone Number:</label>
                <input
                required
                  style={styles.input}
                  type="tel"
                  name="ourPhNO"
                  value={formData.ourPhNO}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Email:</label>
                <input
                required
                  style={styles.input}
                  type="email"
                  name="ourEmail"
                  value={formData.ourEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h1>Order Summary</h1>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Basic Price:</label>
                <input
                required
                  style={styles.input}
                  type="number"
                  min={0}
                  name="basicPrice"
                  value={formData.basicPrice}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Other Charges:</label>
                <input
                required
                  style={styles.input}
                  type="number"
                  min={0}
                  name="otherCharges"
                  value={formData.otherCharges}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Taxes:</label>
                <input
                required
                  style={styles.input}
                  type="number"
                  min={0}
                  name="taxes"
                  value={formData.taxes}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Delivery Adddress</label>
                <textarea
                  required
                  style={styles.textarea}
                  name="deliveryPoint"
                  value={formData.deliveryPoint}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Row 4 */}
            <h1>Price Schedule</h1>
            {formData.products.map((product, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <div style={styles.row}>
                  <div style={styles.column}>
                    <label style={styles.label}>Product Description:</label>
                    <textarea
                      required
                      style={styles.textarea}
                      name="prodDesp"
                      onChange={(e) => handleProduct(e, index)}
                    />
                  </div>
                  <div style={styles.column}>
                    <label style={styles.label}>UOM:</label>
                    <input
                    required
                      style={styles.input}
                      type="text"
                      name="uom"
                      onChange={(e) => handleProduct(e, index)}
                    />
                  </div>
                  <div style={styles.column}>
                    <label style={styles.label}>Quantity:</label>
                    <input
                    required
                      style={styles.input}
                      type="number"
                      min={0}
                      name="prodQuantity"
                      onChange={(e) => handleProduct(e, index)}
                    />
                  </div>
                  <div style={styles.column}>
                    <label style={styles.label}>Unit Rate:</label>
                    <input
                    required
                      style={styles.input}
                      type="number"
                      min={0}
                      name="prodUnitRate"
                      onChange={(e) => handleProduct(e, index)}
                    />
                  </div>
                  <div style={styles.column}>
                    <label style={styles.label}>IGST:</label>
                    <input
                    required
                      style={styles.input}
                      type="number"
                      min={0}
                      name="igst"
                      onChange={(e) => handleProduct(e, index)}
                    />
                  </div>
                  <IconButton
                    sx={{
                      marginLeft: 2,
                      padding: "2px",
                      height: "30px",
                      width: "30px",

                      backgroundColor: "rgba(255, 0, 0, 0.3)",
                      color: "rgba(255, 0, 0, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.5)",
                      },
                    }}
                    onClick={() => removeProduct(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProduct} style={styles.add}>
              Add Another Product
            </button>

            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          {/* Page 1 Content */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
            // ref={purchaseOrderRef}
          >
            <h2
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                textDecoration: "underline",
                marginTop: 0,
              }}
            >
              Purchase Order
            </h2>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "48%" }}>
                <h3 style={{ margin: 0, fontSize: "14px" }}>
                  Seller's Details
                </h3>
                <p style={{ margin: "5px 0" }}> {formData.sellerAddress}</p>
              </div>

              <div style={{ width: "48%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>PO No:</strong>
                    {poId}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>PO Release Date:</strong> {formData.PoDate}
                  </p>
                </div>
                <h3 style={{ margin: "10px 0", fontSize: "14px" }}>
                  Buyer's details
                </h3>
                <p style={{ margin: "5px 0" }}> {formData.buyerAddress}</p>
                <h4 style={{ margin: "10px 0" }}>Our Contact Details</h4>
                <p>
                  Name:{formData.ourName}
                  <br />
                  Phone: {formData.ourPhNo}
                  <br />
                  Email: {formData.ourEmail}
                </p>
              </div>
            </div>
            <hr style={{ border: "1px solid black" }} />
            <h3 style={{ margin: "10px 0", fontSize: "14px" }}>
              Order Value Summary
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "left",
                    }}
                  >
                    Currency
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    Basic Price
                  </td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    INR
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {formData.basicPrice}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    Other Charges
                  </td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    INR
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {formData.otherCharges}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    Taxes
                  </td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    INR
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {formData.taxes}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    PO Price
                  </td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    INR
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {formatIndianNumber(
                      parseInt(formData.basicPrice) +
                        parseInt(formData.otherCharges) +
                        parseInt(formData.taxes)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: "10px" }}>
              <strong>In words:</strong>{" "}
              {numberToWords(
                formData.basicPrice + formData.otherCharges + formData.taxes
              )}
            </p>

            <h3 style={{ marginTop: "20px", fontSize: "14px" }}>
              Special Terms and Conditions (STC)
            </h3>
            <h4 style={{ marginBottom: "5px" }}>1.0 Scope of Work</h4>
            <p style={{ marginTop: "0" }}>
              Supply of dal products as per the agreed specifications and
              quantities outlined in the Purchase Order (PO). This includes all
              activities related to the packaging, handling, and delivery of the
              goods.
            </p>
            <h4 style={{ marginBottom: "5px" }}>2.0 Effective Date</h4>
            <p style={{ marginTop: "0" }}>15.09.2022</p>

            <hr />
            {/* Footer for Page 1 */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
                <p>Buyer's Authorised Signatory</p>
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
                <p>Seller's Authorised Signatory</p>
              </div>
            </div>
          </div>
          {/* --------------------------------------------------------------------------- */}

          {/* ------------------------------------------------------------------------------ */}
          {/* Page 2 Content  */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <h4 style={{ marginBottom: "5px" }}>3.0 Delivery Term</h4>
            <p style={{ marginTop: "0" }}>
              The delivery term shall be DAP (Delivered at Place), indicating
              that the seller is responsible for delivering the goods to the
              specified destination.
            </p>
            <h4 style={{ marginBottom: "5px" }}>4.0 Delivery Point</h4>
            <p style={{ marginTop: "0" }}>{formData.deliveryPoint} </p>
            <h4 style={{ marginBottom: "5px" }}>5.0 Delivery Schedule</h4>
            <p style={{ marginTop: "0" }}>
              The seller shall deliver the products within the timeframe
              specified in the Purchase Order. Any delays must be communicated
              in advance, and failure to meet the delivery schedule may result
              in penalties as outlined in the Liquidated Damages clause.
            </p>
            <h3 style={{ marginTop: "40px", fontSize: "14px" }}>6.0 Price</h3>
            <p>
              The prices for the products shall be as specified in Annexure I -
              Price Schedule and are inclusive of all applicable taxes (except
              GST), packaging, handling, freight, loading and unloading charges,
              and transit insurance up to the delivery point.
            </p>
            <h3 style={{ fontSize: "14px" }}>7.0 Taxes</h3>
            <p>
              GST shall be charged at actuals, as per the applicable rates. Any
              additional taxes, if applicable, will be mentioned in the Price
              Schedule attached to the Purchase Order.
            </p>
            <h3 style={{ fontSize: "14px" }}>8.0 Payment Terms</h3>
            <p>
              Sellers will receive payments based on the successful sale of
              their products through the B2B Hub platform. Payment will be
              disbursed as per the schedule outlined in the Seller's account,
              typically following the confirmation of product delivery and
              acceptance by the Buyer. B2B Hub may deduct applicable fees or
              commissions.
            </p>

            <h3 style={{ fontSize: "14px" }}>9.0 Dispatch Documents</h3>
            <p>
              The seller must provide all necessary dispatch documents,
              including but not limited to the invoice, packing list, and e-way
              bill, as applicable, at the time of delivery.
            </p>
            <h3 style={{ fontSize: "14px" }}>10.0 Liquidated Damages</h3>
            <p>
              In case of delay beyond the agreed delivery schedule, liquidated
              damages at the rate of 1% of the Purchase Order value per week of
              delay, up to a maximum of 10% of the total Purchase Order value,
              may be imposed.
            </p>

            <hr />
            {/* Footer for Page 2 */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <p>Buyer's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <p>Seller's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
            </div>
          </div>
          {/* ------------------------------------------------------------------------------ */}

          {/* --------------------------------------------------------------------------- */}
          {/* <!-- Page 3 Content --> */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <h3 style={{ fontSize: "14px" }}>11.0 Securities</h3>
            <p>Not Applicable</p>
            <h3 style={{ fontSize: "14px" }}>12.0 Defect Liability Period</h3>
            <p>
              The seller warrants that the goods supplied are free from defects
              in material and workmanship for a period of 6 months from the date
              of delivery. Any defects arising during this period must be
              rectified or replaced by the seller at no additional cost to the
              buyer.
            </p>
            <h3 style={{ fontSize: "14px" }}>13.0 Invoicing Address</h3>
            <p>
              The Contractor shall submit all invoices bearing the GST numbers,
              in original and copies and 2 (Two) copies to:
            </p>
            <p>
              Mumbai International Airport Limited, First floor, Terminal 1B,
              <br />
              Chhatrapati Shivaji Maharaj International Airport Santacruz (E),
              Mumbai - 400 099 Maharashtra, India
            </p>
            <h3 style={{ marginTop: "40px", fontSize: "14px" }}>14.0 Price</h3>
            <p>
              1.The unit prices stated are all-inclusive and shall remain firm
              and fixed until the completion of the entire scope of work as
              specified in the Purchase Order. No price escalation shall be
              permitted under any circumstances.
              <br />
              2. The vendor must submit duly certified invoices to the Vendor
              Help Desk (VHD) for further processing of payments.
              <br />
              3. Upon receipt of the Purchase Order, the vendor is requested to
              acknowledge acceptance of the order and its terms and conditions
              by signing the first page, along with the company's seal and
              stamp, if applicable. The signed acceptance should be sent back
              via email (scanned copy) or hard copy within 7 days from the
              issuance of the order. Failure to provide timely acknowledgment
              may result in payment delays
              <br />
              4. The vendor is encouraged to use recyclable packing materials
              for all items supplied, in alignment with sustainable and
              eco-friendly practices.
              <br />
              5. The vendor is expected to strictly adhere to the Environmental,
              Health, and Safety (EHS) policies of the Buyer within their
              operational premises and during the delivery and handling of
              goods.
              <br />
              6. All invoices must be submitted to the Vendor Help Desk (VHD) at
              the designated department. Any invoice not bearing the VHD inward
              number will not be considered for payment processing
            </p>
            <h3 style={{ fontSize: "12px" }}>
              GOODS AND SERVICE TAX LAW CLAUSES:
            </h3>
            <p>
              7. All supplies/services must be accompanied by a valid tax
              invoice in compliance with the GST regulations. The invoice must
              clearly state the GST registration numbers of both the Buyer and
              the Supplier, along with the applicable HSN/SAC codes and
              specified taxes as per the Purchase Order.
              <br />
              8. The vendor shall ensure timely filing of outward returns as per
              the GST law to enable the Buyer to claim timely input tax credits.
              <br />
              9. The vendor shall take all necessary steps, including amending,
              rectifying, and/or revising the GST returns, to ensure that the
              Buyer can avail of the full GST input tax credits.
              <br />
              10.The Buyer reserves the right to: (i) Raise a Debit Note to
              recover any interest liability at 18% incurred due to the
              non-availability of tax credits attributable to the supplier's
              actions or inactions. (ii) Withhold an appropriate amount to cover
              potential damages arising from non-compliance with GST laws. (iii)
              Terminate the Purchase Order or Work Order if tax credit issues
              persist for two consecutive months or if the supplier's GST
              compliance rating deteriorates significantly.
              <br />
              11. Payment is subject to applicable TDS/TCS provisions under the
              prevailing tax laws, including GST regulations in India.
              <br />
              12. The supplier/service provider must submit an invoice
              mentioning the vendor and Buyer's GST registration numbers,
              applicable SAC/HSN codes, and the GST rate with a detailed tax
              breakup.
              <br />
              13. The Buyer reserves the right to terminate or suspend the
              contract at any time within 30 days of giving notice, without
              assigning any reason. The Buyer also reserves the right to
              withdraw any item(s) from the scope of the Purchase Order, either
              partially or entirely, at any time during the contract period, and
              arrange for its procurement from any other source without any
              claim for compensatory payment from the Supplier on this account.
              <br />
              14.In case of any breach of the above conditions or any other term
              mentioned in the Purchase Order, the Buyer reserves the right to
              take appropriate actions, including but not limited to withholding
              payments or terminating the contract.
            </p>
            <hr />
            {/* Footer for Page 3 */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <p>Buyer's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <p>Seller's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
            </div>
          </div>
          {/* ------------------------------------------------------------------------------ */}

          {/* ---------------------------------------------------------------------------------- */}
          {/* Page 4 Content */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginTop: "40px", fontSize: "14px" }}>
              15.0 Notice and Communications
            </h3>
            <p>
              All notices and communications to be given under this Purchase
              Order by one party to the other shall be in writing, in English,
              and addressed to the relevant party at the address provided in the
              Purchase Order or as updated from time to time.
              <br />
              (i) Seller:
              <br />
              Attn. : {formData.sellerName}
              <br /> Address
              <br />
              Email : {formData.sellerEmail}
              <br />
              (ii) Buyer:
              <br />
              Attn:{formData.buyerName}
              <br />
              {formData.buyerEmail}
              <br />
              Email:{formData.buyerEmail}
              <br />
            </p>
            <h3>Enclosures:</h3>
            <p>General Terms & Conditions (GTC)</p>
            <hr />
            {/* Footer for Page 4 */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <p>Buyer's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <p>Seller's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
            </div>
          </div>
          {/* -------------------------------------------------------------- */}

          {/* ---------------------------------------------------------------------- */}
          {/* Page 5 Content: Annexure I - Price Schedule */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                textDecoration: "underline",
              }}
            >
              Annexure-I
              <br />
              Price Schedule
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    Sn. No.
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    Material Code/Description
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    UOM
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    Quantity
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    Unit Rate
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    IGST
                  </th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData &&
                formData.products &&
                formData.products.length > 0 ? (
                  formData.products.map((product, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {product.prodDesp}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {product.uom}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {product.prodQuantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {product.prodUnitRate}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {product.igst}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {(product.prodQuantity *
                          product.prodUnitRate *
                          product.igst) /
                          100}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* <!-- Footer for Page 5 --> */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <p>Buyer's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <p>Seller's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
            </div>
          </div>
          {/* ------------------------------------------------------------------------------------------ */}

          {/* ------------------------------------------------------------------------------------------------ */}
          {/* <!-- Page 6 Content --> */}
          <div
            className="poPdf"
            style={{
              width: "595px",
              height: "743.75px",
              padding: "20px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            <h4>Po no:</h4>
            {/* <!-- Summary Section --> */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  Total No. Of Items :
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "right",
                  }}
                >
                  {formData && Array.isArray(formData.products)
                    ? formData.products.length
                    : 0}
                </td>
              </tr>
            </table>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <tr>
                <th style={{ border: "1px solid black", padding: "5px" }}>
                  Currency
                </th>
                <th style={{ border: "1px solid black", padding: "5px" }}>
                  Amount
                </th>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  Basic Price
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "right",
                  }}
                >
                  {formData.basicPrice}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  Other Charges
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "right",
                  }}
                >
                  {formData.otherCharges}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  Taxes
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "right",
                  }}
                >
                  {formData.taxes}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  PO Price
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "right",
                  }}
                >
                  {formatIndianNumber(
                    parseInt(formData.basicPrice) +
                      parseInt(formData.otherCharges) +
                      parseInt(formData.taxes)
                  )}
                </td>
              </tr>
            </table>
            {/* <!-- Purchase Order Price --> */}
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>
              PURCHASE ORDER PRICE:
              {formData.basicPrice + formData.otherCharges + formData.taxes}
              <span style={{ float: "right" }}>
                {/* [Purchase Order Price] */}
              </span>
            </p>
            <hr />
            {/* <!-- Footer for Page 6 --> */}
            <div style={{ marginTop: "40px" }}>
              <div style={{ float: "left", width: "50%" }}>
                <p>Buyer's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Buyer's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
              <div style={{ float: "right", width: "50%", textAlign: "right" }}>
                <p>Seller's Authorised Signatory</p>
                <img
                  src={stamp}
                  alt="Seller's Stamp"
                  style={{ height: "50px" }}
                />
              </div>
            </div>
          </div>
          {/* <div style={{ clear: "both" }}></div> */}

          <button
            className="Button7"
            onClick={downloadPdf}
            style={{ padding: "10px", color: "white", backgroundColor: "blue" }}
          >
            Upload PDF
          </button>
        </>
      )}
    </div>
  );
};

export default PoForm;
