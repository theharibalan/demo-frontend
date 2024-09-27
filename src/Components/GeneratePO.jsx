// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// function formatIndianNumber(number) {
//   const numStr = number.toString();
//   let lastThreeDigits = numStr.slice(-3);
//   const otherDigits = numStr.slice(0, -3);

//   if (otherDigits !== '') {
//     lastThreeDigits = ',' + lastThreeDigits;
//   }

//   const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits;
//   return formattedNumber;
// }
// function formatDate(dateString) {
//   const dateParts = dateString.split("/");
//   const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

//   const options = { day: 'numeric', month: 'short', year: '2-digit' };
//   return date.toLocaleDateString('en-GB', options);
// }

// function findFirstAndLastDate(orders) {
//   if (!orders || orders.length === 0) return "";

// const dates = orders.map(order => {
//   const [day, month, year] = order.date_of_order.split("/");
//   return new Date(`${year}-${month}-${day}`);
// });

// const minDate = new Date(Math.min(...dates));
// const maxDate = new Date(Math.max(...dates));

// const formattedMinDate = formatDate(minDate.toLocaleDateString('en-GB'));
// const formattedMaxDate = formatDate(maxDate.toLocaleDateString('en-GB'));

// return `${formattedMinDate} to ${formattedMaxDate}`;
// }
// const GenerateReceipt = async (tableData) => {

//       // Create HTML content for each page
//       const totalAmount = tableData.reduce((acc, row) => {
//         const orderAmount = parseFloat(row.total_amount.replace(/,/g, ''));
//         return acc + orderAmount;
//       }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

//       const generateTableHTML = (data) => {
//         return `
//           <table style="width: 100%; border-collapse: collapse;">
//             <thead>
//               <tr>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: left;">Date</th>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: left;">Particulars</th>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: left;">Vch Type</th>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: right;">Vch No.</th>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: right;">Order Ref.No.</th>
//                 <th style="border-bottom: 1px solid black; padding: 5px; text-align: right;">Order Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${
//                 data.map(row => `
//                   <tr>
//                     <td style="padding: 5px;">${formatDate(row.date_of_order)}</td>
//                     <td style="padding: 5px;">${row.companyname}</td>
//                     <td style="padding: 5px;">Purchase Order</td>
//                     <td style="padding: 5px; text-align: right;">${row.order_id}</td>
//                     <td style="padding: 5px; text-align: right;">${row.order_id}</td>
//                     <td style="padding: 5px; text-align: right; padding-right:20px">${formatIndianNumber(row.total_amount)}</td>
//                   </tr>
//                 `).join('')
//               }
//             </tbody>
//           </table>
//         `;
//       };

//       // Create HTML content for each page
//       const pages = [];
//       pages.push(`
//         <div style="padding: 10mm; box-sizing: border-box; height: calc(100% - 40mm);">
//           <!-- Header -->
//           <div style="text-align: center;  margin-bottom: 20px;">
//             <p style="margin: 0;font-weight:bold;">VTS ENTERPRISES INDIA PVT LTD</p>
//             <p style="margin: 0;">No.3B, 3 Rd Floor,</p>
//             <p style="margin: 0;">25 Park Center Venkatanarayanan Road</p>
//             <p style="margin: 0;">T.Nagar Chennai</p>
//             <p style="margin: 0;">600017</p>
//           </div>
//           <!-- Title -->
//           <div style="text-align: center; margin-bottom: 20px;">
//             <p style="margin: 0; font-weight: bold;">Purchase Order Register</p>
//             <p style="margin: 0;">${findFirstAndLastDate(tableData)}</p>
//           <hr style="border: none; border-top: 1px solid black; margin-top: 10px;">
//           </div>
//           ${generateTableHTML(tableData.slice(0, 24))}
//         </div>
//       `);

//       for (let i = 24; i < tableData.length; i += 30) {
//         pages.push(`
//           <div style="padding: 10mm; box-sizing: border-box;">
//             ${generateTableHTML(tableData.slice(i, i + 30))}
//           </div>
//         `);
//       }

//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//         compress: true,
//       });

//       for (let i = 0; i < pages.length; i++) {
//         const htmlContent = `
//           <div style="background-color: #f5f5f5; width: fit-content; min-height: 297mm; margin-left: auto; margin-right: auto;">
//             ${pages[i]}
//             ${i === pages.length - 1 ? `
//               <div>
//                 <hr style="border: none; border-top: 1px solid black; margin-top: 20px;">
//                 <p style="text-align: right; font-weight: bold;">Total Amount: ${formatIndianNumber(totalAmount)}</p>
//               </div>
//             ` : ''}
//           </div>
//         `;

//         const hiddenElement = document.createElement('div');
//         hiddenElement.style.position = 'fixed';
//         hiddenElement.style.left = '-9999px';
//         hiddenElement.innerHTML = htmlContent;
//         document.body.appendChild(hiddenElement);

//         const element = hiddenElement;

//         const canvas = await html2canvas(element, { scale: 2 });
//         const imgData = canvas.toDataURL("image/png");

//         const imgWidth = pdf.internal.pageSize.getWidth();
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

//         if (i < pages.length - 1) {
//           pdf.addPage();
//         }

//         document.body.removeChild(hiddenElement);
//       }

//       const pdfBlob = pdf.output("blob");

//       const formData = new FormData();
//       formData.append("file", pdfBlob, "invoice");
//       formData.append("upload_preset", "payslips");

//       try {
//         const response = await axios.post(
//           "https://api.cloudinary.com/v1_1/dtgnotkh7/auto/upload",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         console.log(response.data.secure_url);
//         return response.data.secure_url;
//       } catch (error) {
//         if (axios.isCancel(error)) {
//           console.log("Request canceled:", error.message);
//         } else {
//           console.error(error);
//         }
//         throw error;
//       }
//     };

//     export default GenerateReceipt;

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

function formatDate(dateString) {
  const dateParts = dateString.split("/");
  const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

  const options = { day: "numeric", month: "short", year: "2-digit" };
  return date.toLocaleDateString("en-GB", options);
}

function findFirstAndLastDate(orders) {
  if (!orders || orders.length === 0) return "";

  const dates = orders.map((order) => {
    const [day, month, year] = order.date_of_order.split("/");
    return new Date(`${year}-${month}-${day}`);
  });

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const formattedMinDate = formatDate(minDate.toLocaleDateString("en-GB"));
  const formattedMaxDate = formatDate(maxDate.toLocaleDateString("en-GB"));

  return `${formattedMinDate} to ${formattedMaxDate}`;
}

const GenerateReceipt = async (tableData) => {
  // Create HTML content for each page
  const totalAmount = tableData
    .reduce((acc, row) => {
      const orderAmount = parseFloat(row.total_amount.replace(/,/g, ""));
      return acc + orderAmount;
    }, 0)
    .toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const generateTableHTML = (data) => {
    return `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: left;">Date</th>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: left;">Particulars</th>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: left;">Vch Type</th>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: right;">Vch No.</th>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: right;">Order Ref.No.</th>
            <th style="font-size:14px;border-bottom: 1px solid black; padding: 5px 7px; text-align: right;">Order Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data
        .map(
          (row) => `
              <tr>
                <td style="padding: 5px;">${formatDate(row.date_of_order)}</td>
                <td style="padding: 5px;">${row.companyname}</td>
                <td style="padding: 5px;">Purchase Order</td>
                <td style="padding: 5px; text-align: right;">${row.order_id}</td>
                <td style="padding: 5px; text-align: right;">${row.order_id}</td>
                <td style="padding: 5px; text-align: right; padding-right:20px">${formatIndianNumber(
            parseInt(row.total_amount)
          )}</td>
              </tr>
            `
        )
        .join("")}
        </tbody>
      </table>
    `;
  };

  // Create HTML content for each page
  const pages = [];
  pages.push(`
    <div style="padding: 10mm; box-sizing: border-box; height: calc(100% - 40mm);">
      <!-- Header -->
      <div style="text-align: center;  margin-bottom: 20px;">
        <p style="margin: 0;font-weight:bold;">VTS ENTERPRISES INDIA PVT LTD</p>
        <p style="margin: 0;">No.3B, 3 Rd Floor,</p>
        <p style="margin: 0;">25 Park Center Venkatanarayanan Road</p>
        <p style="margin: 0;">T.Nagar Chennai</p>
        <p style="margin: 0;">600017</p>
      </div>
      <!-- Title -->
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="margin: 0; font-weight: bold;">Purchase Order Register</p>
        <p style="margin: 0;">${findFirstAndLastDate(tableData)}</p>
        <hr style="border: none; border-top: 1px solid black; margin-top: 10px;">
      </div>
      ${generateTableHTML(tableData.slice(0, 24))}
    </div>
  `);

  for (let i = 24; i < tableData.length; i += 30) {
    pages.push(`
      <div style="padding: 10mm; box-sizing: border-box;">
        ${generateTableHTML(tableData.slice(i, i + 30))}
      </div>
    `);
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const htmlContent = `
      <div style="background-color: #f5f5f5; width: fit-content; min-height: 297mm; margin-left: auto; margin-right: auto;">
        ${pages[i]}
        ${i === pages.length - 1
        ? `
          <div>
            <hr style="border: none; border-top: 1px solid black; margin-top: 20px;">
            <p style="text-align: right; font-weight: bold;padding-right:20px">Total Amount: ₹ ${totalAmount}</p>
          </div>
        `
        : ""
      }
      </div>
    `;

    const hiddenElement = document.createElement("div");
    hiddenElement.style.position = "fixed";
    hiddenElement.style.left = "-9999px";
    hiddenElement.innerHTML = htmlContent;
    document.body.appendChild(hiddenElement);

    const element = hiddenElement;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

    if (i < pages.length - 1) {
      pdf.addPage();
    }

    document.body.removeChild(hiddenElement);
  }

  // Save the PDF locally
  pdf.save("PO.pdf");

  // Create a blob from the PDF data
  const pdfBlob = pdf.output("blob");

  // Prepare form data for upload
  const formData = new FormData();
  formData.append("file", pdfBlob, "PO.pdf");
  formData.append("upload_preset", "payslips");

  try {
    // Upload the PDF to Cloudinary
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

    // Return the secure URL
    return response.data.secure_url;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export default GenerateReceipt;
