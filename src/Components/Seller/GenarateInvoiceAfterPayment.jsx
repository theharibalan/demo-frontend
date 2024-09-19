import { React, useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, Form, message, Upload, InputNumber } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import stamp from "../../assets/mudra.jpg";

const GenarateInvoiceAfterPayment = ({ poId, totalPrice, quantity, productId, PurchaseOrderURL, productType }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // For the button loading state
  const [generated, setGenerated] = useState(false); // For showing the View button after generation
  const [pdfUrl, setPdfUrl] = useState(PurchaseOrderURL);
  const [submitted, setSubmitted] = useState(false);
  const totalAmount = totalPrice * quantity;

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Entered Values", values);
        setModalVisible(false);
        setSubmitted(true);
        setLoading(true);
        setTimeout(async () => {
          try {
            const purchaseOrderURL = await generateAndUploadInvoice(values); // Generate and upload PDF
            setPdfUrl(purchaseOrderURL); // Store the generated PDF URL
            setGenerated(true); // Show the View PDF button
            const updatedAt = new Date().toISOString();

            axios.put(`${process.env.REACT_APP_BACKEND_URL}/po/uploadPo`, {
              poId, updatedAt, purchaseOrderURL, productId
            })
              .then(response => {
                message.success("Invoice generated successfully!", 8);
                console.log("PO uploaded successfully:", response.data);
              })
              .catch(error => {
                message.error("Invoice didn't generated!", 8);
                console.error("Error uploading PO:", error);
              });
          } catch (error) {
            message.error("Error generating invoice!");
            setSubmitted(false);
          } finally {
            setLoading(false);
          }
        }, 3000);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[today.getMonth()]; // Get the month name
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function numberToWords(amount) {
    var words = "";
    var fraction = Math.round((amount - Math.floor(amount)) * 100);
    var units = [
      "Zero",
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
    var teens = [
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
    var tens = [
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    var thousands = ["", "Thousand", "Lakh", "Crore"];

    function convertChunk(num) {
      var str = "";
      var hundred = Math.floor(num / 100);
      num = num % 100;
      if (hundred > 0) {
        str += units[hundred] + " Hundred ";
      }
      if (num > 10 && num < 20) {
        str += teens[num - 11] + " ";
      } else {
        var ten = Math.floor(num / 10);
        num = num % 10;
        if (ten > 0) {
          str += tens[ten - 1] + " ";
        }
        if (num > 0) {
          str += units[num] + " ";
        }
      }
      return str.trim();
    }

    if (amount === 0) {
      words = "Zero";
    } else {
      var crore = Math.floor(amount / 10000000);
      var lakh = Math.floor((amount % 10000000) / 100000);
      var thousand = Math.floor((amount % 100000) / 1000);
      var hundred = Math.floor((amount % 1000) / 100);
      var remainder = amount % 100;

      if (crore > 0) {
        words += convertChunk(crore) + " Crore ";
      }
      if (lakh > 0) {
        words += convertChunk(lakh) + " Lakh ";
      }
      if (thousand > 0) {
        words += convertChunk(thousand) + " Thousand ";
      }
      if (hundred > 0) {
        words += convertChunk(hundred) + " Hundred ";
      }
      if (remainder > 0) {
        words += convertChunk(remainder);
      }
    }

    if (fraction > 0) {
      words += " and " + fraction + "/100";
    }

    return words.trim();
  }

  const generateAndUploadInvoice = async (invoiceFormData) => {
    const hiddenElement = document.createElement("div");
    hiddenElement.style.position = "fixed";
    hiddenElement.style.left = "-9999px";
    console.log(invoiceFormData);
    const total = (totalAmount * parseInt(invoiceFormData.cgst) / 100) + (totalAmount * parseInt(invoiceFormData.sgst) / 100) + (totalAmount * parseInt(invoiceFormData.igst) / 100)
    const htmlContent = `
              <div id="printdf" style="background-color: #fff; width: fit-content; min-height: 320mm; margin: 0 auto;padding: 5px 5px 10px">
              <div style="font-family: Arial, sans-serif; font-size: 6px; line-height:1; margin: 0; padding: 0;">
          
              <div style="width: 97%; margin: 0 auto;border:1px solid #000;padding:4px;">
                  <center style="margin : 0 0">
                      <h1>${invoiceFormData.invoiceTitle || "Invoice Note"}</h1>
                  </center>
                  <table border="1px" width="100%" style="border-collapse: collapse;">
                      <tr>
                          <td rowspan="3" style="border-right: none;border-bottom:none;line-height: 1.5; padding: 2px 0px 2px 2px;">
                              Consignee (Bill From)<br>
                              ${invoiceFormData.Address.toUpperCase().replace(/\n/g, "<br />")}
                          </td>
                          <td style="border-right: none;border-bottom:none;padding: 2px;">Credit Note No. 
                          ${invoiceFormData.creditNote}</td>
                          <td style="border-right: none;border-bottom:none;padding: 2px;">Dated: ${getCurrentDate()}</td>
                      </tr>
                      <tr>
                          <td style="border-right: none;border-bottom:none;font-weight: bold; padding: 2px;">Invoice No.: #10024 <br><br>Date:${getCurrentDate()}</td>
                          <td style="border-right: none;border-bottom:none;padding: 2px;">Other Reference</td>
                      </tr>
                      <tr>
                          <td style="border-right: none;border-bottom:none;padding: 2px">Mode/Terms of Payment</td>
                          <td style="border-right: none;border-bottom:none;padding: 2px">${invoiceFormData.modeOfPayment || ""
      }</td>
                      </tr>
                      <tr>
                          <td rowspan="3" style="border-right: none;border-bottom:none;line-height: 1.5;padding: 2px 0px 2px 2px;">
                            Consignee (Ship To)<br>
                            <strong>VTS ENTERPRISES INDIA PVT LTD</strong><br>
                            No 3B, 3RD FLOOR,<br>
                            25 PARK CENTER VENKATARAYANA ROAD<br>
                            T.NAGAR CHENNAI 600017<br>
                            GSTIN/UIN: 33AAHCV0173B12T<br>
                            STATE NAME : TAMIL NADU, CODE : 33
                          </td>
                          <td style="border-right: none;border-bottom:none;padding: 2px">Dispatched No.</td>
                          <td style="border-right: none;border-bottom:none;padding: 2px">${invoiceFormData.dispatchedDocNo || ""
      }</td>
                      </tr>
                      <tr>
                          <td style="border-right: none;border-bottom:none;padding: 2px">Buyer’s Order No.</td>
                          <td style="border-right: none;border-bottom:none;padding: 2px">Dated</td>
                      </tr>
                      <tr>
                          <td style="border-right: none;border-bottom:none;padding: 2px">Dispatched through</td>
                          <td style="border-right: none;border-bottom:none;font-weight: bold;padding: 2px;">CHENNAI</td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                          <td style="border-bottom:none;border-right: none; line-height: 1.5; padding: 2px 0px 2px 2px;">
                            Bill (Bill To)<br>
                            <strong>VTS ENTERPRISES INDIA PVT LTD</strong><br>
                            No 3B, 3RD FLOOR,<br>
                            25 PARK CENTER VENKATARAYANA ROAD<br>
                            T.NAGAR CHENNAI 600017<br>
                            GSTIN/UIN: 33AAHCV0173B12T<br>
                            STATE NAME : TAMIL NADU, CODE : 33
                          </td>
                          <td colspan="2" style="border-right: none;border-bottom:none;padding: 2px;"><strong>Terms & Conditions :</strong><br><p style="margin:0px">1. X-FACTORY TRANSPORT CHARGES ARE ADDITIONAL, THEY ARE NOT INCLUDED IN THE PAYABLE PRICE.</p> ${(
        invoiceFormData.termsConditions.toUpperCase() || "N/A"
      ).replace(/\n/g, "<br />")}</td>
                      </tr>
                  </table>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  </div>
          
                  <table border="1px" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                      <thead>
                          <tr>
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: left;">S.No.</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: left;">Product Name</th>
          
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: left;">Quantity</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: left;">Rate</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: left;">Per</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td style="border-right: none;border-bottom:none;padding: 5px;">1</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px;">${productType
      } </td>
                              <td style="border-right: none;border-bottom:none;padding: 5px;">${quantity
      } TONNES</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px;">₹ ${formatIndianNumber(
        parseInt(totalPrice) || "0"
      )}.00</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px;">TONNE</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(
        totalAmount
      )}</td>
                          </tr>				
                          <tr>
                              <td style="border-right: none;border-bottom:none;padding: 5px;" colspan="5">Total (GST Exempted)</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">INR ${formatIndianNumber(
        totalAmount
      )}</td>
                          </tr>
                      </tbody>
                  </table>
          
          
                  <div style="display: flex;flex-direction: column; justify-content: space-between;">
                <strong>GST Exempted</strong>
                      <table border="1px" style="width: 100%; border-collapse: collapse; margin-bottom: 3px;">
                          <tr>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">HSN/SAC</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">CGST @ ${invoiceFormData.cgst || "0.00"
      }%</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">SGST @ ${invoiceFormData.sgst || "0.00"
      }%</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">IGST @ ${invoiceFormData.igst || "0.00"
      }%</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">Total Tax Amount</th>
                              <th style="border-right: none;border-bottom:none;padding: 5px;">Total Amount With Tax</th>
                          </tr>
                          <tr>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">07133100</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(totalAmount * parseInt(invoiceFormData.cgst) / 100) || "0.00"
      }</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(totalAmount * parseInt(invoiceFormData.sgst) / 100) || "0.00"
      }</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(totalAmount * parseInt(invoiceFormData.igst) / 100) || "0.00"
      }</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(total) || "0.00"
      }</td>
                              <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">INR ${formatIndianNumber(totalAmount + total) ||
      formatIndianNumber(totalAmount)
      }.00</td>
                          </tr>
                      </table>
                      
                      <div style="border:none;padding:6px  3px;">
                          Total Amount (in words):<br><br>
                          <strong style="margin-top:7px;">INR ${numberToWords(formatIndianNumber(totalAmount + total)).toUpperCase() ||
      numberToWords(totalAmount).toUpperCase()
      } ONLY</strong><br><br>
                          <strong>Company’s Bank Details :</strong><br>
                          Bank Name: PUNJAB NATIONAL BANK<br>
                          A/C No.: 3940002100057010<br>
                  IFSC Code.: PUNB0394000<br>
                          Branch : Tiruvanmiyur,CHENNAI<br>
                      </div>
                  </div>
                  <div style="border:none; padding: 3px; margin-bottom: 4px;">
                      <strong>Declaration :</strong><br><br>
                      We declare that this invoice shows the actual price of the goods described and that all particulars are true
                      and correct.<br>
                  </div>
                  <hr>
                  <div style="text-align: right;">
                      <strong>For VTS ENTERPRISES INDIA PVT LTD</strong><br>
                      <img src="${stamp}" alt="stamp" width="50px">
                      <br>
                      Authorised Signatory
                  </div>
              </div>
          </div>
              </div>
            `;
    hiddenElement.innerHTML = htmlContent;
    document.body.appendChild(hiddenElement);

    const element = document.getElementById("printdf");

    const canvas = await html2canvas(element, { scale: 2.5 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imgWidth = pdf.internal.pageSize.getWidth();

    // const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgHeight = 700;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("file", pdfBlob, "invoice");
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

      const pdfUrl = response.data.secure_url;
      console.log("PDF uploaded to Cloudinary:", pdfUrl);
      return pdfUrl;

    } catch (error) {
      if (error.response) {
        console.error("Error uploading image:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
    document.body.removeChild(hiddenElement);
  };

  return (
    <div>
      {!PurchaseOrderURL && !loading && (
        <Button type="primary" onClick={() => { setModalVisible(true) }}>
          Enter Invoice Details
        </Button>
      )}
      <Modal
        title="Enter Invoice Details"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={loading ? "Generating..." : generated ? "View PDF" : "Generate & Upload"}
        confirmLoading={loading}
      >
        <Form
          form={form}
          className="poModal"
          style={{ height: "60vh", overflowY: "auto" }}
          layout="vertical" initialValues={{ totalAmountWithTax: totalPrice }}
        >
          <Form.Item
            name="invoiceTitle"
            label="Enter Invoice Title"
            rules={[{ required: true, message: "Please enter Invoice Title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Address"
            label="Enter Your Address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="creditNote"
            label="Enter Credit Note no"
            rules={[
              { required: true, message: "Please enter Credit Note no." },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="modeOfPayment"
            label="Mode/Terms of Payment"
            rules={[
              {
                required: true,
                message: "Please enter mode/terms of payment!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dispatchedDocNo"
            label="Dispatched No."
            rules={[
              {
                required: true,
                message: "Please enter dispatched document number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="termsConditions"
            label="Terms & Conditions"
            rules={[
              { required: true, message: "Please enter terms and conditions!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="totalAmountWithTax"
            label="Total Amount Without Tax"
            rules={[
              {
                required: true,
                message: "Please enter total amount with tax!",
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Form.Item
              name="cgst"
              label="CGST"
              rules={[{ required: true, message: "Please enter CGST amount!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="sgst"
              label="SGST"
              rules={[{ required: true, message: "Please enter SGST amount!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="igst"
              label="IGST"
              rules={[{ required: true, message: "Please enter IGST amount!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </div>

          {/* <Form.Item
            name="uploadstamp"
            label="Upload Stamp"
            rules={[{ required: true, message: "Please Upload Stamp" }]}
          >
            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />} loading={loading}>
                Upload Image
              </Button>
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>

      {submitted && loading && (
        <Button type="primary" disabled>
          Generating...
        </Button>
      )}

      {/* Show "View PDF" button when the PDF is successfully generated */}
      {PurchaseOrderURL && (
        <Button
          type="primary"
          onClick={() => window.open(pdfUrl, "_blank")} // Open the PDF in a new tab
        >
          View PDF
        </Button>
      )}
    </div>
  );
};

export default GenarateInvoiceAfterPayment;