import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import stamp from "../assets/vts-stamp.png"
import vtslogo from "../assets/vts-logo.jpg"
const PurchaseOrder = () => {
  useEffect(() => {
    calculateTotal();
  }, []);

  const numberToWords = (number) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
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

  const calculateTotal = () => {
    const quantities = document.querySelectorAll('.quantity');
    const rates = document.querySelectorAll('.rate');
    const cgsts = document.querySelectorAll('.cgst');
    const sgsts = document.querySelectorAll('.sgst');
    const igsts = document.querySelectorAll('.igst');
    let totalAmount = 0;

    quantities.forEach((qtyElem, index) => {
      const qty = parseFloat(qtyElem.innerText);
      const rate = parseFloat(rates[index].innerText);
      const cgst = parseFloat(cgsts[index].innerText) / 100;
      const sgst = parseFloat(sgsts[index].innerText) / 100;
      const igst = parseFloat(igsts[index].innerText) / 100;

      const amount = qty * rate;
      const taxAmount = amount + (amount * cgst) + (amount * sgst) + (amount * igst);
      totalAmount += taxAmount;

      const netAmountElem = document.querySelectorAll('.netAmount')[index];
      netAmountElem.innerText = taxAmount.toFixed(2);
    });

    document.getElementById('total-amount').innerText = totalAmount.toFixed(2);

    const totalInWords = numberToWords(Math.round(totalAmount));
    document.getElementById('amount-in-words').innerText = totalInWords;
  };

  const generatePDF = async () => {
    const htmlElement = document.getElementById('purchase-order');

    html2canvas(htmlElement, { scale: 3 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('purchase_order.pdf');
    });
  };

  return (
    <>
    <div style={{ width: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div id="purchase-order" style={{ padding: "30px 10px" }}>
        <div style={{ fontSize: '18px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', lineHeight: '1.5' }}>
        PURCHASE ORDER
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto' }}>
        <tr>
          <td rowSpan="3" colSpan="3" style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>
          <img src={vtslogo} alt="Logo" width="120" /><br />
          <strong>VTS India Private Limited</strong><br />
        </td>
        <td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>BILL TO ADDRESS</td>
      <td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>SHIP TO ADDRESS</td>
          </tr >
          <tr>
            <td colSpan="5" style={{ border: '1px solid black', padding: '6px' }}>
              <strong>Qodenext India Private Limited </strong><br />
              No. 915, Essae Pride, 3rd Floor, 80 Feet Road, 6th Block, Koramangala, Bangalore<br />
              Karnataka-560095<br />
              <strong>GSTIN No</strong>: 29AAACG5169M1ZT
            </td>
            <td colSpan="5" style={{ border: '1px solid black', padding: '6px' }}>
              <strong>Qodenext India Private Limited</strong> <br />
              240/236/237, Hosa Main Road, Opp Skoda Showroom, Singasandra Village, Kudlu Gate, Bangalore-560068<br />
              <strong>GSTIN No</strong>: 29AAACG5169M1ZT
            </td>
          </tr>
          <tr>
            <td colSpan="10" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
              CIN No: U29309MH2018PTC304610 <br />
              PAN No: AAACG5169M <br />
              PF No: 123456 <br />
              ESIC No: 654321
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>PO No:</td>
            <td colSpan="2" style={{ border: '1px solid black', padding: '6px' }}>123456</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>PO Date:</td>
            <td colSpan="2" style={{ border: '1px solid black', padding: '6px' }}>30/12/2023</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Delivery Date:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>15/02/2024</td>
          </tr>
          <tr>
            <td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Vendor Name:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>Doozy Robotics Pvt Ltd</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Warranty:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>12 Months</td>
          </tr>
          <tr>
            <td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Vendor Address:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>G174, Ground Floor Spencer Plaza, Chennai, Tamil Nadu</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Payment Terms:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>30 Days</td>
          </tr>
          <tr>
            <td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Delivery Terms:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>Door Delivery</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Freight:</td>
            <td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>Prepaid</td>
          </tr>
          <tr>
            <td colSpan="11" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>ITEM DETAILS</td>
          </tr >
          <tr>
            <th style={{ border: '1px solid black', padding: '6px' }}>S.No</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>Quantity</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>Rate</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>Amount</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>CGST (%)</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>SGST (%)</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>IGST (%)</th>
            <th style={{ border: '1px solid black', padding: '6px' }}>Net Amount</th>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '6px' }}>1</td>
            <td style={{ border: '1px solid black', padding: '6px' }}>Product A</td>
            <td className="quantity" style={{ border: '1px solid black', padding: '6px' }}>10</td>
            <td className="rate" style={{ border: '1px solid black', padding: '6px' }}>100</td>
            <td style={{ border: '1px solid black', padding: '6px' }}>1000</td>
            <td className="cgst" style={{ border: '1px solid black', padding: '6px' }}>9</td>
            <td className="sgst" style={{ border: '1px solid black', padding: '6px' }}>9</td>
            <td className="igst" style={{ border: '1px solid black', padding: '6px' }}>0</td>
            <td className="netAmount" style={{ border: '1px solid black', padding: '6px' }}></td>
          </tr>
{/* Add more rows as needed */ }
          <tr>
            <td colSpan="8" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Total Amount (INR):</td>
            <td colSpan="3" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }} id="total-amount"></td>
          </tr>
          <tr>
            <td colSpan="11" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
              Amount in Words:
              <div id="amount-in-words"></div>
            </td>
          </tr>
          <tr>
            <td colSpan="11" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
              Remarks: The application is going to utilities by Daimler India Commercial Vehicles Pvt. Ltd
            </td>
          </tr>
          <tr>
            <td colSpan="11" style={{ textAlign: 'right', border: '1px solid black', padding: '6px' }}>
              <strong>For VTS India Private Limited</strong><br/><br/>
              <img src={stamp} alt="Signature" width="100" /><br/>
              <strong>Authorized Signatory</strong>
            </td>
          </tr >
        </table >
      </div >
  <button onClick={generatePDF} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', fontSize: '16px' }}>Generate PDF</button>
    </div >
   </>
  );
};

export default PurchaseOrder;