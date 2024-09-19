// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { FaSortAmountDown } from "react-icons/fa";

// const GeneratePayslips = async (invoicedata) => {
// console.log("invoive data ..............................................................")
// console.log(invoicedata)


// function formatDate(dateString) {
// 	const dateParts = dateString.split("/");
// 	const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
	
// 	const options = { day: 'numeric', month: 'short', year: '2-digit' };
// 	return date.toLocaleDateString('en-GB', options);
//   }
// const name = invoicedata.name
// const address1 = invoicedata.address1
//  const address2 = invoicedata.address2
//  const city = invoicedata.city
//  const state = invoicedata.state
//  const landmark = invoicedata.landmark
//  const pincode = invoicedata.pincode
//  const gst_no= invoicedata.gst_no
//  const product_name= invoicedata.product_name
//  const product_type= invoicedata.product_type
//  const product_quantity= invoicedata.product_quantity
//  const total_amount = invoicedata.total_amount
//  const unitprice = invoicedata.unitprice




//  const formatIndianNumber = (num) => {
//     const numStr = num.toString();
//     const lastThree = numStr.substring(numStr.length - 3);
//     const otherNumbers = numStr.substring(0, numStr.length - 3);
//     if (otherNumbers !== "") {
//       return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
//     } else {
//       return lastThree;
//     }
//   };


//   function convertToWords() {
//     var amount = parseFloat(document.getElementById('amount').value);
//     var words = numberToWords(amount);
//     document.getElementById('amount_in_words').value = 'INR ' + words + ' Only';
// }
// // function getCurrentDate() {
// //     const today = new Date();
// //     const day = String(today.getDate()).padStart(2, '0');
// //     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
// //     const year = today.getFullYear();
// //     return `${day}-${month}-${year}`;
// // }

// function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const month = monthNames[today.getMonth()]; // Get the month name
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
// }


// function numberToWords(amount) {
//     var words = '';
//     var fraction = Math.round((amount - Math.floor(amount)) * 100);
//     var units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     var teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     var tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//     var thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//     function convertChunk(num) {
//         var str = '';
//         var hundred = Math.floor(num / 100);
//         num = num % 100;
//         if (hundred > 0) {
//             str += units[hundred] + ' Hundred ';
//         }
//         if (num > 10 && num < 20) {
//             str += teens[num - 11] + ' ';
//         } else {
//             var ten = Math.floor(num / 10);
//             num = num % 10;
//             if (ten > 0) {
//                 str += tens[ten - 1] + ' ';
//             }
//             if (num > 0) {
//                 str += units[num] + ' ';
//             }
//         }
//         return str.trim();
//     }

//     if (amount === 0) {
//         words = 'Zero';
//     } else {
//         var crore = Math.floor(amount / 10000000);
//         var lakh = Math.floor((amount % 10000000) / 100000);
//         var thousand = Math.floor((amount % 100000) / 1000);
//         var hundred = Math.floor((amount % 1000) / 100);
//         var remainder = amount % 100;

//         if (crore > 0) {
//             words += convertChunk(crore) + ' Crore ';
//         }
//         if (lakh > 0) {
//             words += convertChunk(lakh) + ' Lakh ';
//         }
//         if (thousand > 0) {
//             words += convertChunk(thousand) + ' Thousand ';
//         }
//         if (hundred > 0) {
//             words += convertChunk(hundred) + ' Hundred ';
//         }
//         if (remainder > 0) {
//             words += convertChunk(remainder);
//         }
//     }

//     if (fraction > 0) {
//         words += ' and ' + fraction + '/100';
//     }

//     return words.trim();
// }

 

//   const htmlContent = `
//     <div id="printdf" style="background-color: #f5f5f5; width: fit-content; min-height: 320mm; margin-left: auto; margin-right: auto;">
//      <div style="font-family: Arial, sans-serif; font-size: 6px; line-height:1; margin: 0; padding: 0;">

// 	<div style="width: 100%; margin: 0 auto;border:1px solid #000;padding:10px;">
// 		<center>
// 			<h1>Invoice Note</h1>
// 		</center>
// 		<table border="1px" width="100%" style="border-collapse: collapse;">
// 			<tr>
// 				<td rowspan="3" style="border-right: none;line-height: 1.5;padding: 7px;"><strong>VTS ENTERPRISES INDIA PVT
// 						LTD</strong><br>
// 					No 3B, 3rd Floor,<br>
// 					25 Park Center Venkatarayanan Road<br>
// 					T.Nagar Chennai<br>
// 					600017<br>
// 					GSTIN/UIN: 33AAHCV0173B12T<br>
// 					State Name : Tamil Nadu, Code : 33
// 				</td>
// 				<td style="padding: 6px;">Credit Note No. 130</td>
// 				<td style="padding: 6px;">Dated: ${getCurrentDate()}</td>
// 			</tr>
// 			<tr>
// 				<td style="font-weight: bold; padding: 6px;">Original Invoice No & Date:<br>619 dt.${getCurrentDate()}</td>
// 				<td style="padding: 6px;">Other Reference</td>
// 			</tr>
// 			<tr>
// 				<td style="padding: 6px">Mode/Terms of Payment</td>
// 				<td></td>
// 			</tr>
// 			<tr>
// 				<td rowspan="4" style="border-right: none;line-height: 1.5;padding: 6px;">Consignee (Ship To)<br>
// 					<strong>${name}</strong><br>
// 					${address1},<br>
// 					${address2}, ${landmark}<br>
// 					${city} - ${pincode}, ${state}.<br>
// 					GSTIN/UIN: ${gst_no}<br>
// 					State Name : ${state}, Code : 33
// 				</td>
// 				<td style="padding: 6px">Dispatched Doc No</td>
// 				<td></td>
// 			</tr>
// 			<tr>
// 				<td style="padding: 6px">Buyer’s Order No.</td>
// 				<td style="padding: 6px">Dated</td>
// 			</tr>
// 			<tr>
// 				<td style="padding: 6px">Dispatched through</td>
// 				<td style="font-weight: bold;padding: 6px;">Destination:<br>CHENNAI</td>
// 			</tr>
// 			<tr>
// 			</tr>
// 			<tr>
// 				<td style="line-height: 1.5;padding: 6px;">
// 					Buyer (Bill to)<br>
// 					<strong>${name}</strong><br>
// 					${address1},<br>
// 					${address2}, ${landmark}<br>
// 					${city} - ${pincode}, ${state}.<br>
// 					GSTIN/UIN: ${gst_no}<br>
// 					State Name : ${state}, Code : 33
// 				</td>
// 				<td colspan="2" style="border-left: none;padding: 6px;">Terms & Conditions</td>
// 			</tr>
// 		</table>
// 		<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
// 		</div>

// 		<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #000;">
// 			<thead>
// 				<tr>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">S.No.</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">Description of Goods</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">HSN/SAC</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">Quantity</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">Rate</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: left;">per</th>
// 					<th style="border: 1px solid #000; padding: 5px; text-align: right;">Amount</th>
// 				</tr>
// 			</thead>
// 			<tbody>
// 				<tr>
// 					<td style="border: 1px solid #000; padding: 5px;">1</td>
// 					<td style="border: 1px solid #000; padding: 5px;">${product_type} </td>
// 					<td style="border: 1px solid #000; padding: 5px;">07133100</td>
// 					<td style="border: 1px solid #000; padding: 5px;">${product_quantity} TONNES</td>
// 					<td style="border: 1px solid #000; padding: 5px;">₹ ${formatIndianNumber(parseInt(unitprice))}.00</td>
// 					<td style="border: 1px solid #000; padding: 5px;">TONNE</td>
// 					<td style="border: 1px solid #000; padding: 5px; text-align: right;">${formatIndianNumber(parseInt(total_amount))}</td>
// 				</tr>

				
// 				<tr>
// 					<td style="border: 1px solid #000; padding: 5px;" colspan="6">Total</td>
// 					<td style="border: 1px solid #000; padding: 5px; text-align: right;">${formatIndianNumber(parseInt(total_amount))}</td>
// 				</tr>
// 			</tbody>
// 		</table>


// 		<div style="display: flex;flex-direction: column; justify-content: space-between;">
            
// 			<table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-bottom: 6px;">
//                 <tr>
//                     <th style="border: 1px solid #000; padding: 5px;">HSN/SAC</th>
//                     <th style="border: 1px solid #000; padding: 5px;">CGST @ 0.0%</th>
//                     <th style="border: 1px solid #000; padding: 5px;">SGST @ 0.0%</th>
//                     <th style="border: 1px solid #000; padding: 5px;">IGST @ 0.0%</th>
//                     <th style="border: 1px solid #000; padding: 5px;">Total Tax Amount</th>
//                     <th style="border: 1px solid #000; padding: 5px;">Total Amount After Tax</th>
//                 </tr>
//                 <tr>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">07133100</td>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">0.00</td>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">0.00</td>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">0.00</td>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">0.00</td>
//                     <td style="border: 1px solid #000; padding: 5px; text-align: right;">${formatIndianNumber(total_amount)}.00</td>
//                 </tr>
//             </table>
            
// 			<div style="padding:6px  3px;">
// 				Total Amount (in words):<br>
// 				<strong style="margin-top:7px;">INR ${numberToWords(total_amount)} ONLY</strong><br><br>
// 				<strong>Company’s Bank Details</strong><br>
// 				Bank Name: PUNJAB NATIONAL BANK<br>
// 				A/C No.: 3940002100057010<br>
// 				Branch & IFS Code: CHENNAI & PUNB03940000<br>
// 			</div>
// 		</div>
// 		<div style=" padding: 3px; margin-bottom: 7px;">
// 			<strong>Declaration</strong><br>
// 			We declare that this invoice shows the actual price of the goods described and that all particulars are true
// 			and correct.<br><br>
// 		</div>
// 		<hr>
// 		<div style="text-align: right;">
// 			<strong>For VTS ENTERPRISES INDIA PVT LTD</strong><br><br><br>
// 			Authorised Signatory
// 		</div>
// 	</div>
// </div>
//     </div>
//   `;

//   const hiddenElement = document.createElement('div');
//   hiddenElement.style.position = 'fixed';
//   hiddenElement.style.left = '-9999px';
//   hiddenElement.innerHTML = htmlContent;
//   document.body.appendChild(hiddenElement);

//   const element = document.getElementById("printdf");

//     const canvas = await html2canvas(element, { scale: 2});
//     const imgData = canvas.toDataURL("image/png");
  
//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//       compress: true,
//     });

//     const imgWidth = pdf.internal.pageSize.getWidth();
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

//     const pdfBlob = pdf.output("blob");
 
//     const formData = new FormData();
//     formData.append("file", pdfBlob, "invoice");
//     formData.append("upload_preset", "payslips");
   
//     try {
//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dtgnotkh7/auto/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       ); 
//       console.log(response.data.secure_url);
//       return response.data.secure_url;
//       // const url = `${process.env.REACT_APP_BACKEND_URL}/admin/savepayslips`
//     //   await axios.post(url,{empId:Employee.empId,payslipUrl:response.data.secure_url})
//     } catch (error) {
//       if (error.response) {
//         console.error("Error uploading image:", error.response.data);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     document.body.removeChild(hiddenElement);
  
// };


// export default GeneratePayslips

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaSortAmountDown } from "react-icons/fa";

const GeneratePayslips = async (invoicedata) => {
console.log("invoive data ..............................................................")
console.log(invoicedata)


function formatDate(dateString) {
	const dateParts = dateString.split("/");
	const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
	
	const options = { day: 'numeric', month: 'short', year: '2-digit' };
	return date.toLocaleDateString('en-GB', options);
  }
  const invoiceId = invoicedata.invoiceId
const name = invoicedata.name
const address1 = invoicedata.address1
 const address2 = invoicedata.address2
 const city = invoicedata.city
 const state = invoicedata.state
 const landmark = invoicedata.landmark
 const pincode = invoicedata.pincode
 const gst_no= invoicedata.gst_no
 const product_name= invoicedata.product_name
 const product_type= invoicedata.product_type
 const product_quantity= invoicedata.product_quantity
 const total_amount = invoicedata.total_amount
 const unitprice = invoicedata.unitprice




 const formatIndianNumber = (num) => {
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== "") {
      return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
    } else {
      return lastThree;
    }
  };


  function convertToWords() {
    var amount = parseFloat(document.getElementById('amount').value);
    var words = numberToWords(amount);
    document.getElementById('amount_in_words').value = 'INR ' + words + ' Only';
}
// function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = today.getFullYear();
//     return ${day}-${month}-${year};
// }

function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[today.getMonth()]; // Get the month name
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
}


function numberToWords(amount) {
    var words = '';
    var fraction = Math.round((amount - Math.floor(amount)) * 100);
    var units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    var teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    var thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    function convertChunk(num) {
        var str = '';
        var hundred = Math.floor(num / 100);
        num = num % 100;
        if (hundred > 0) {
            str += units[hundred] + ' Hundred ';
        }
        if (num > 10 && num < 20) {
            str += teens[num - 11] + ' ';
        } else {
            var ten = Math.floor(num / 10);
            num = num % 10;
            if (ten > 0) {
                str += tens[ten - 1] + ' ';
            }
            if (num > 0) {
                str += units[num] + ' ';
            }
        }
        return str.trim();
    }

    if (amount === 0) {
        words = 'Zero';
    } else {
        var crore = Math.floor(amount / 10000000);
        var lakh = Math.floor((amount % 10000000) / 100000);
        var thousand = Math.floor((amount % 100000) / 1000);
        var hundred = Math.floor((amount % 1000) / 100);
        var remainder = amount % 100;

        if (crore > 0) {
            words += convertChunk(crore) + ' Crore ';
        }
        if (lakh > 0) {
            words += convertChunk(lakh) + ' Lakh ';
        }
        if (thousand > 0) {
            words += convertChunk(thousand) + ' Thousand ';
        }
        if (hundred > 0) {
            words += convertChunk(hundred) + ' Hundred ';
        }
        if (remainder > 0) {
            words += convertChunk(remainder);
        }
    }

    if (fraction > 0) {
        words += ' and ' + fraction + '/100';
    }

    return words.trim();
}

 

  const htmlContent = `
    <div id="printdf" style="background-color: #f5f5f5; width: fit-content; min-height: 320mm; margin-left: auto; margin-right: auto;">
     <div style="font-family: Arial, sans-serif; font-size: 4px; line-height:1; margin: 0; padding: 0;">

	<div style="width: 100%; margin: 0 auto;border:1px solid #000;padding:6px;">
		<center>
			<h1>Invoice Note</h1>
		</center>
		<table border="1px" width="95%" style="border-width:1px;border-color:black,border-collapse: collapse;">
			<tr>
				<td rowspan="3" style="border-right: none;border-bottom:none;line-height: 1.5;padding: 2px 0px 2px 2px;"><strong>VTS ENTERPRISES INDIA PVT
						LTD</strong><br>
					No 3B, 3RD FLOOR,<br>
					25 PARK CENTER VENKATARAYANA ROAD<br>
					T.NAGAR CHENNAI<br>
					600017<br>
					GSTIN/UIN: 33AAHCV0173B12T<br>
					STATE NAME : TAMIL NADU, CODE : 33
				</td>
				<td style="border-right: none;border-bottom:none;padding: 2px;">Credit Note No. ${invoiceId.replace('B2BINV','')}</td>
				<td style="border-right: none;border-bottom:none;padding: 2px;">Dated: ${getCurrentDate()}</td>
			</tr>
			<tr>
				<td style="border-right: none;border-bottom:none;font-weight: bold; padding: 2px;">Invoice No.: ${invoiceId.replace('B2B','')} <br><br>Date:${getCurrentDate()}</td>
				<td style="border-right: none;border-bottom:none;padding: 2px;">Other Reference</td>
			</tr>
			<tr>
				<td style="border-right: none;border-bottom:none;padding: 2px">Mode/Terms of Payment</td>
				<td style="border-right: none;border-bottom:none;padding: 2px"></td>
			</tr>
			<tr>
				<td rowspan="3" style="border-right: none;border-bottom:none;line-height: 1.5; padding: 2px 0px 2px 2px;">
            Consignee (Ship To)<br>
            <strong>${name.toUpperCase()}</strong><br>
            ${address1.toUpperCase()},<br>
            ${address2.toUpperCase()}, ${landmark.toUpperCase()}<br>
            ${city.toUpperCase()} - ${pincode}, ${state.toUpperCase()}.<br>
            GSTIN/UIN: ${gst_no.toUpperCase()}<br>
            State Name: ${state.toUpperCase()}, Code: 33
        </td>
				<td style="border-right: none;border-bottom:none;padding: 2px"> Dispatched Doc No.</td>
				<td style="border-right: none;border-bottom:none;padding: 2px"></td>
			</tr>
			<tr>
				<td style="border-right: none;border-bottom:none;padding: 2px"> Buyer’s Order No.</td>
				<td style="border-right: none;border-bottom:none;padding: 2px">Dated</td>
			</tr>
			<tr>
				<td style="border-right: none;border-bottom:none;padding: 2px"> Dispatched through</td>
				<td style="border-right: none;border-bottom:none;font-weight: bold;padding: 2px;">CHENNAI</td>
			</tr>
			<tr>
			</tr>
			<tr>
				<td style="border-bottom:none;border-right: none; line-height: 1.5; padding: 2px 0px 2px 2px;">
            Bill (Bill To)<br>
            <strong>${name.toUpperCase()}</strong><br>
            ${address1.toUpperCase()},<br>
            ${address2.toUpperCase()}, ${landmark.toUpperCase()}<br>
            ${city.toUpperCase()} - ${pincode}, ${state.toUpperCase()}.<br>
            GSTIN/UIN: ${gst_no.toUpperCase()}<br>
            State Name: ${state.toUpperCase()}, Code: 33
        </td>
				<td colspan="2" style="border-right: none;border-bottom:none;padding: 2px;">Terms & Conditions</td>
			</tr>
		</table>
		<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
		</div>

		<table border="1px" style="width: 95%; border-collapse: collapse; margin-bottom: 10px;">
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
					<td style="border-right: none;border-bottom:none;padding: 5px;">${product_type} </td>
					<td style="border-right: none;border-bottom:none;padding: 5px;">${product_quantity} TONNES</td>
					<td style="border-right: none;border-bottom:none;padding: 5px;">₹ ${formatIndianNumber(parseInt(unitprice))}.00</td>
					<td style="border-right: none;border-bottom:none;padding: 5px;">TONNE</td>
					<td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(parseInt(total_amount))}</td>
				</tr>				
				<tr>
					<td style="border-right: none;border-bottom:none;padding: 5px;" colspan="5">Total (GST Exempted)</td>
					<td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(parseInt(total_amount))}</td>
				</tr>
			</tbody>
		</table>


		<div style="display: flex;flex-direction: column; justify-content: space-between;">
      <strong>GST Exempted</strong>
			<table border="1px" style="width: 95%; border-collapse: collapse; margin-bottom: 3px;margin-top:2px">
                <tr>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">HSN/SAC</th>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">CGST @ 0.0%</th>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">SGST @ 0.0%</th>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">IGST @ 0.0%</th>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">Total Tax Amount</th>
                    <th style="border-right: none;border-bottom:none;padding: 5px;">Total Amount With Tax</th>
                </tr>
                <tr>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">07133100</td>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">0.00</td>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">0.00</td>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">0.00</td>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">0.00</td>
                    <td style="border-right: none;border-bottom:none;padding: 5px; text-align: right;">${formatIndianNumber(total_amount)}.00</td>
                </tr>
            </table>
            
			<div style="border:none;padding:6px  3px;">
				Total Amount (in words):<br><br>
				<strong style="margin-top:7px;">INR ${numberToWords(total_amount).toUpperCase()} ONLY</strong><br><br>
				<strong>Company’s Bank Details :</strong><br>
				Bank Name: PUNJAB NATIONAL BANK<br>
				A/C No.: 3940002100057010<br>
        IFSC Code.: PUNB0394000<br>
				Branch : Tiruvanmiyur,CHENNAI<br>
			</div>
		</div>
		<div style="border:none; padding: 3px; margin-bottom: 3px;">
			<strong>Declaration :</strong><br><br>
			We declare that this invoice shows the actual price of the goods described and that all particulars are true
			and correct.<br>
		</div>
		<hr>
		<div  style="text-align: right;width:95%">
			<strong>For VTS ENTERPRISES INDIA PVT LTD</strong><br><br><br>
			Authorised Signatory
		</div>
	</div>
</div>
    </div>
  `;

  const hiddenElement = document.createElement('div');
  hiddenElement.style.position = 'fixed';
  hiddenElement.style.left = '-9999px';
  hiddenElement.innerHTML = htmlContent;
  document.body.appendChild(hiddenElement);

  const element = document.getElementById("printdf");

    const canvas = await html2canvas(element, { scale: 3});
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


export default GeneratePayslips