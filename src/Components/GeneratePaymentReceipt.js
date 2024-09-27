import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaSortAmountDown } from "react-icons/fa";
import pnb from "../assets/PNB.png";
import logo from "../assets/b2blogo.png";
const GenerateReceipt = async (order, pid) => {
  const name = order.companyname;
  const email = order.email;
  const amount = parseInt(order.total_amount);
  const mobile = order.phone_no;
  const gst_no = order.gst_no;

  function formatIndianNumber(number) {
    const numStr = number.toString();
    let lastThreeDigits = numStr.slice(-3);
    const otherDigits = numStr.slice(0, -3);

    if (otherDigits !== "") {
      lastThreeDigits = "," + lastThreeDigits;
    }

    const formattedNumber =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
    return formattedNumber;
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  function getCurrentDateWithoutTime() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
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

  const htmlContent = `
    <div id="printdf" style="background-color: #f5f5f5; width: fit-content; min-height: 297mm; margin-left: auto; margin-right: auto;">
     
   <div style="font-family: Arial, sans-serif; color: #000000; margin: 0; padding: 20px; line-height: 1;">

    <div style="border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <img src=${logo} alt="B2BHub Logo" style="height: 60px;">
            <div style="text-align: center;">
                <p style="margin: 10px; font-size: 11px; color:#d9232d">B2Bhub</p>
                <p style="margin: 5px; font-size: 11px;">Email Id:<a href="mailto:support@b2bhubinida.com" style="color: #000; text-decoration: none;">  support@b2bhubindia.com</a></p>
                <p style="margin: 0 30px 0 0px; font-size: 11px;">Contact Number: 7824036322</p>
            </div>
            <img src=${pnb} alt="Axis Bank Logo" style="height: 50px;">
        </div>
        <hr>
        <h4 style="text-align: center; color: #d9232d; margin: 30px 0;">PAYMENT SLIP</h4>
        <div style="text-align: center; margin-bottom: 30px; font-size: 11px;">
          <p style="margin: 0;"><strong>Generation Date :</strong> ${getCurrentDate()}</p>
      </div>

        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; line-height: 24px;">
                <div style="font-size: 11px;margin-right:10px">
                    <p style="margin: 0;"><strong>Entity Name :</strong> ${name}</p>
                    <p style="margin: 0;"><strong>Entity GST NO. :</strong> ${gst_no}</p>
                    <p style="margin: 0;"><strong>Actual Amount :</strong>	₹ ${formatIndianNumber(
    amount
  )}</p>
                    <p style="margin: 0;"><strong>GST Amount :</strong> ₹ 0</p>
                    <p style="margin: 0;"><strong>Amount :</strong>	₹ ${formatIndianNumber(
    amount
  )}</p>
                    <p style="margin: 0;"><strong>Payment Approved Date :</strong> ${getCurrentDateWithoutTime()}</p>
                </div>
                <div style="font-size: 11px;">
                  <!-- <p style="margin: 0;"><strong>Generation Date :</strong> ${getCurrentDate()}</p> -->
                  <p style="margin: 0;"><strong>Mobile No :</strong> ${mobile}</p>
                  <p style="margin: 0;"><strong>Email Id :</strong> ${email}</p>
                  <div style="font-size: 11px;">
                    <p style="margin: 0;"><strong>GST @ 18% :</strong> NO</p>
                    <p style="margin: 0;"><strong>Remarks :</strong> Master agreement E signing fees</p>
                    <p style="margin: 0;"><strong>Amount (incl. service charges) :</strong> ₹ ${formatIndianNumber(
    amount
  )}</p>
                </div>
              </div>
            </div>
        </div>

        <div style="margin-top: 25px; padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center; background-color: #f3f3f3;"><strong>URN</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center; background-color: #f3f3f3;"><strong>Status</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center; background-color: #f3f3f3;"><strong>Mode of Payment</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${pid}</td>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">Success</td>
                    <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">NET BANKING</td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 20px;">
            <p style="font-size: 11px; color: #d9232d; margin-bottom: 5px;"><strong>Please note :</strong></p>
            <ul style="font-size: 11px; padding-left: 20px; color: #d9232d; margin: 0;">
                <li>This is a system-generated receipt. Hence it does not require signatures.</li>
            </ul>
        </div>
    </div>

</div>

    </div>
  `;

  const hiddenElement = document.createElement("div");
  hiddenElement.style.position = "fixed";
  hiddenElement.style.left = "-9999px";
  hiddenElement.innerHTML = htmlContent;
  document.body.appendChild(hiddenElement);

  const element = document.getElementById("printdf");

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const imgWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
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
    console.log(response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    if (error.response) {
      console.error("Error uploading image:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }

  document.body.removeChild(hiddenElement);
};

export default GenerateReceipt;
