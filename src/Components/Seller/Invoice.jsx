import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { message, Upload } from 'antd';
import { Input } from 'antd';
import html2canvas from 'html2canvas';
import axios from "axios"
import jsPDF from 'jspdf';

const { TextArea } = Input;
const Invoice = () => {
	const [loading, setLoading] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [currentDate, setCurrentDate] = useState('');
	const [formData, setFormData] = useState({
		HSN: "",
		SGST: "",
		IGST: "",
		CGST: "",
		TotalAmount: 0,
		productPrice: 0,
		productQty: 0,
		productType: "",
		termsandCondition: "",
		dispatchnumber: "",
		state: "",
		pincode: "",
		city: "",
		landmark: "",
		address1: "",
		address2: "",
		InvoiceTitle: 'PO INVOICE',
		Modeofpayment: "",
		CreditNote: '',
		companyName: ``,
		companyAddress: ``,
		invoiceNumber: '',
		customerName: '',
		invoiceDate: '',
		clientdp: ``,
		gstin: ``,
		billingAddress: '',
		shippingAddress: '',
		placeToSupply: '',
		gstPercentage: '',
		bankDetails: {
			bankName: '',
			accountNumber: '',
			ifsc: '',
			branch: '',
		},
		recipientCompany: '',
		items: [{ itemName: '', mrp: '', sellingPrice: '', qty: '' }],
	});

	const [billToText, setBillToText] = useState('');
	const [shipTo, setShipTo] = useState('')

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.post(
					'${process.env.REACT_APP_BACKEND_URL}/b2b/getorders',
					[],
					{
						headers: {
							Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1YmJ1ZHVzYW5hcHVkaUBnbWFpbC5jb20iLCJpYXQiOjE3MjU4NzU5ODMsImV4cCI6MTcyNzE3MTk4M30.-RKGJlGEWPtqVxD45sSbhAhAG_7TEbFQXGYgZSwlWDg',
							'Content-Type': 'application/json',
						},
					}
				);

				const data = response.data[2];
				setFormData((prevData) => ({
					...prevData,
					TotalAmount: data.total_amount || 0,
					productQty: data.product_quantity || 0,
					productType: data.product_type || "",
					state: data.state || "",
					pincode: data.zip_code || "",
					city: data.city || "",
					landmark: data.landmark || "",
					address1: data.address1 || "",
					address2: data.address2 || "",
					invoiceNumber: data.orderId || "",
					customerName: data.companyname || "",
					invoiceDate: data.date_of_order || "",
					billingAddress: data.address1 || "",
					shippingAddress: data.address2 || "",
					placeToSupply: data.state || "",
					gstPercentage: "",
					productPrice: data.total_amount / data.product_quantity || 0,
					bankDetails: {
						bankName: '',
						accountNumber: '',
						ifsc: '',
						branch: '',
					},
					recipientCompany: data.companyname || "",
					items: [{
						itemName: data.product_name || '',
						mrp: '',
						sellingPrice: '',
						qty: data.product_quantity || '0'
					}]
				}));
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const onChanged = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	const downloadInvoice = () => {
		setLoading(true);
		new Promise((resolve) => setTimeout(resolve, 2000));
		const addButton = document.querySelector('#addItemButton');
		const removeButtons = document.querySelectorAll('td button');

		if (addButton) addButton.style.display = 'none';
		removeButtons.forEach(button => {
			button.style.display = 'none';
		});

		const inputs = document.querySelectorAll('input, textarea');
		const originalBorders = [];
		const originalPlaceholders = [];

		inputs.forEach(input => {
			originalBorders.push(input.style.border);
			originalPlaceholders.push(input.placeholder);
			input.style.border = 'none';
			input.placeholder = '';

			const inputValue = input.value.toUpperCase();

			const parentDiv = document.createElement('div');
			parentDiv.style.textAlign = input.style.textAlign;
			parentDiv.style.color = input.style.color;
			parentDiv.style.fontWeight = input.style.fontWeight;
			parentDiv.style.fontSize = input.style.fontSize;

			const formattedInputValue = inputValue.replace(/\n/g, '<br/>');
			parentDiv.innerHTML = formattedInputValue;

			input.parentNode.replaceChild(parentDiv, input);
		});

		const formattedElements = document.querySelectorAll('#invoice div, #invoice p, #invoice span');
		formattedElements.forEach(element => {
			element.innerHTML = element.innerHTML.replace(/\n/g, '<br/>');
		});

		html2canvas(document.querySelector('#invoice'), { useCORS: true, scale: 1.5 }).then((canvas) => {
			const imgData = canvas.toDataURL('image/jpeg');
			const pdf = new jsPDF('p', 'pt', 'a4');

			const imgWidth = 600;
			const imgHeight = 850;
			if (imgHeight) {
				pdf.addImage(imgData, 'jpeg', 0, 0, imgWidth, imgHeight);
			}

			pdf.save('invoice.pdf');
			const pdfBlob = pdf.output("blob");

			const formData = new FormData();
			formData.append("file", pdfBlob, "invoice.pdf");
			formData.append("upload_preset", "invoices");

			try {
				axios.post(
					"https://api.cloudinary.com/v1_1/dlo7urgnj/auto/upload",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				)
					.then(res => {
						const cloudinaryUrl = res.data.secure_url;
						console.log(cloudinaryUrl);
						const today = new Date().toLocaleDateString();
						setCurrentDate(today);
					})
					.catch(err => console.log(err));

				if (addButton) addButton.style.display = 'block';
				removeButtons.forEach(button => {
					button.style.display = 'block';
				});

			} catch (err) {
				console.log(err);
			}
		});
		setLoading(false);
	};

	useEffect(() => {
		setBillToText(
			`${(formData.customerName || "").toUpperCase()}\n
		${(formData.address1 || "").toUpperCase()}${(formData.address2 || "").toUpperCase()},
		${(formData.landmark || "").toUpperCase()}
		${(formData.city || "").toUpperCase()} - ${(formData.pincode || "")},
		${(formData.state || "").toUpperCase()}
		GSTIN/UIN: ${(formData.gstin || "N/A").toUpperCase()}
		State Name: ${(formData.state || "").toUpperCase()}, Code: 33`
		);
	}, [formData]);

	useEffect(() => {
		setShipTo(
			`${(formData.customerName || "").toUpperCase()}
${(formData.address1 || "").toUpperCase()}
${(formData.address2 || "").toUpperCase()}, ${(formData.landmark || "").toUpperCase()}
${(formData.city || "").toUpperCase()} - ${(formData.pincode || "")}, ${(formData.state || "").toUpperCase()}
GSTIN/UIN: ${(formData.gstin || "N/A").toUpperCase()}
State Name: ${(formData.state || "").toUpperCase()}, Code: 33`
		)
	}, [formData]);



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

	const calculateGST = () => {
		const { TotalAmount, CGST, SGST, IGST } = formData;

		const cgstPercentage = parseFloat(CGST) || 0;
		const sgstPercentage = parseFloat(SGST) || 0;
		const igstPercentage = parseFloat(IGST) || 0;
		const cgstAmount = (TotalAmount * cgstPercentage) / 100;
		const sgstAmount = (TotalAmount * sgstPercentage) / 100;
		const igstAmount = (TotalAmount * igstPercentage) / 100;

		const totalGST = cgstAmount + sgstAmount + igstAmount;

		const totalAmountWithGst = parseFloat(TotalAmount) + totalGST;

		return { totalGST, totalAmountWithGst, cgstAmount, sgstAmount, igstAmount };
	};

	useEffect(() => {
		const { cgstAmount, sgstAmount, igstAmount, totalGST, totalAmountWithGst } = calculateGST();

		// Set these calculated values in your state
		setFormData({
			...formData,
			cgstAmount: cgstAmount, // Store CGST amount with 2 decimal places
			sgstAmount: sgstAmount, // Store SGST amount with 2 decimal places
			igstAmount: igstAmount, // Store IGST amount with 2 decimal places
			totalGST: totalGST, // Store total GST with 2 decimal places
			totalAmountWithGst: totalAmountWithGst, // Store total amount with GST
		});
	}, [formData.CGST, formData.SGST, formData.IGST, formData.TotalAmount]);



	function getCurrentDate() {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = monthNames[today.getMonth()]; // Get the month name
		const year = today.getFullYear();
		return `${day}-${month}-${year}`;
	}
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
	const [from, setFrom] = useState('')

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', width: '100vw', maxWidth: '100%' }}>
			<div className="Invoice-page" id="invoice" style={{ width: '100%', padding: '10px' }}>
				<center style={{ textAlign: "center", color: "black", fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}>
					{formData.InvoiceTitle}
				</center>
				<table border={"1px"} width={"100%"} style={{ borderCollapse: "collapse", fontSize: "14px", tableLayout: 'fixed' }}>
					<tr>
						<td rowSpan={'3'} style={{ borderRight: "none", borderBottom: 'none', padding: "5px", width: '35%' }}>
							<strong>From</strong><br />
							<TextArea
								name="from"
								placeholder="Enter From Address"
								autoSize={{ minRows: 5 }}
								value={from}
								onChange={(e) => setFrom(e.target.value)}
							/>
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>Credit Note No.
							<Input name="CreditNo" placeholder="Enter Credit Note" value={formData.CreditNote} onChange={(e) => setFormData({ ...formData, CreditNote: e.target.value })} />
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>Credit Date No. <br />
							{getCurrentDate()}
						</td>
					</tr>
					<tr>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>Invoice No. <br />
							{formData.invoiceNumber}
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>Other References
						</td>
					</tr>
					<tr>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>Mode/Terms of Payment
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							<Input name="Modeofpayment" placeholder="Enter Mode of Payment" value={formData.Modeofpayment} onChange={(e) => setFormData({ ...formData, Modeofpayment: e.target.value })} />
						</td>
					</tr>
					<tr>
						<td rowSpan={"3"} style={{ borderRight: "none", borderBottom: 'none', padding: "5px" }}>
							<strong>Consignee (Ship To)</strong><br />
							<strong>VTS ENTERPRISES INDIA PVT LTD</strong><br />
							NO 3B, 3RD FLOOR,<br />
							25 PARK CENTER VENKATARAYANA ROAD<br />
							T.NAGAR CHENNAI<br />
							600017
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							Dispatched No.
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							<Input name="dispatchNumber" placeholder="Enter Dispatch Number" value={formData.dispatchnumber} onChange={(e) => setFormData({ ...formData, dispatchnumber: e.target.value })} />
						</td>
					</tr>
					<tr>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							Buyer's Order No.
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							Dated
						</td>
					</tr>
					<tr>
						<td style={{ borderRight: "none", borderBottom: "none", padding: "5px" }}>
							Dispatched
						</td>
						<td style={{ borderRight: "none", borderBottom: "none", fontWeight: "bold", padding: "5px" }}>
							CHENNAI
						</td>
					</tr>
				</table>
				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
				</div>
				<table border={"1px"} style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: "10px" }}>
					<thead>
						<tr>
							<th style={{ padding: "5px", textAlign: "left" }}>S.no.</th>
							<th style={{ padding: "5px", textAlign: "left" }}>Product Name</th>
							<th style={{ padding: "5px", textAlign: "left" }}>Quantity</th>
							<th style={{ padding: "5px", textAlign: "left" }}>Rate</th>
							<th style={{ padding: "5px", textAlign: "left" }}>Per</th>
							<th style={{ padding: "5px", textAlign: "right" }}>Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style={{ padding: "5px" }}>1</td>
							<td style={{ padding: "5px" }}>{formData.productType}</td>
							<td style={{ padding: "5px" }}>{formData.productQty}</td>
							<td style={{ padding: "5px" }}>{formatIndianNumber(parseInt(formData.productPrice))}</td>
							<td style={{ padding: "5px" }}>TONNE</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.TotalAmount))}</td>
						</tr>
						<tr>
							<td colSpan={5} style={{ padding: "5px" }}>Total (GST Exempted)</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.TotalAmount))}</td>
						</tr>
					</tbody>
				</table>
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<strong>GST Exempted</strong>
					<table border={"1px"} style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "14px" }}>
						<tr>
							<th style={{ padding: "5px", textAlign: "left" }}>HSN/SAC</th>
							<th style={{ padding: "5px", textAlign: "right" }}>
								CGST @ <Input name="CGST" style={{ textAlign: "center", width: "50px" }} placeholder="CGST" value={formData.CGST} onChange={(e) => setFormData({ ...formData, CGST: e.target.value })} />%
							</th>
							<th style={{ padding: "5px", textAlign: "right" }}>
								SGST @ <Input name="SGST" style={{ textAlign: "center", width: "50px" }} placeholder="SGST" value={formData.SGST} onChange={(e) => setFormData({ ...formData, SGST: e.target.value })} />%
							</th>
							<th style={{ padding: "5px", textAlign: "right" }}>
								IGST @ <Input name="IGST" style={{ textAlign: "center", width: "50px" }} placeholder="IGST" value={formData.IGST} onChange={(e) => setFormData({ ...formData, IGST: e.target.value })} />%
							</th>
							<th style={{ padding: "5px", textAlign: "right" }}>Total Tax Amount</th>
							<th style={{ padding: "5px", textAlign: "right" }}>Total Amount with Tax</th>
						</tr>
						<tr>
							<td style={{ padding: "5px" }}><Input name="HSN/SAC" placeholder="Enter HSN/SAC" value={formData.HSN} onChange={(e) => setFormData({ ...formData, HSN: e.target.value })} /></td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.cgstAmount))}</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.sgstAmount))}</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.igstAmount))}</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.totalGST))}</td>
							<td style={{ padding: "5px", textAlign: "right" }}>{formatIndianNumber(parseInt(formData.totalAmountWithGst))}</td>
						</tr>
					</table>

					<div style={{ border: "none", padding: "6px 3px" }}>
						Total Amount (in words): <br /> <br />
						<strong style={{ marginTop: "7px" }}>INR {numberToWords(formData.totalAmountWithGst).toUpperCase()} ONLY</strong> <br /> <br />
						<strong>Company's Bank Details :</strong> <br />
						Bank Name: PUNJAB NATIONAL BANK <br />
						A/C No.: 3940002100057010 <br />
						IFSC Code.: PUNB0394000 <br />
						Branch : Tiruvanmiyur,CHENNAI <br />
					</div>
				</div>
				<div style={{ border: "none", padding: "3px", marginBottom: "4px" }}>
					<strong>Declaration:</strong> <br /> <br />
					We declare that this invoice shows the actual price of the goods described and that all particulars are true
					and correct. <br />
				</div>
				<hr />
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
					<strong>For VTS ENTERPRISES INDIA PVT LTD</strong> <br />
					<Upload
						className='custom-upload'
						listType="picture-card"
						fileList={fileList}
						onChange={onChanged}
						onPreview={onPreview}
					>
						{fileList.length < 1 && '+ Upload'}
					</Upload> <br />
					Authorised Signature
				</div>

			</div>
			<Button style={{ marginBottom: "50px", borderRadius: "10px" }} type='primary' onClick={downloadInvoice} loading={loading}>{loading ? "Generating..." : "Generate Invoice"}</Button>
		</div>
	);
};


export default Invoice;