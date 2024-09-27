import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import stamp from "../../assets/mudra.jpg"
import vtslogo from "./logo.png"
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import { message } from 'antd';

const Invoice = () => {
	const navigate = useNavigate()
	useEffect(() => {
		if (!localStorage.getItem('admin-role')) {
			navigate("/admin@b2b/b2bhubindia")
		}
	})
	const [pdfUrl, setPdfUrl] = useState('')
	const [salesInvoiceId, setSalesInvoiceId] = useState(null)
	const [form, setForm] = useState(null)
	const [formData, setFormData] = useState({
		billingAddress: '',
		shipmentAddress: '',
		cin: '',
		pan: '',
		pf: '',
		esic: '',
		poDate: '',
		deliveryDate: '',
		vendorName: '',
		warranty: '',
		vendorAddress: '',
		paymentTerms: '',
		deliveryTerms: '',
		freight: '',
		description: '',
		quantity: '',
		rate: '',
		cgst: '',
		sgst: '',
		igst: '',
		netAmount: 0,
	});
	// Function to calculate net amount
	const calculateNetAmount = () => {
		const { rate, quantity, cgst, sgst, igst } = formData;
		const amount = rate * quantity;
		const netAmount =
			amount +
			(amount * (parseFloat(cgst) || 0)) / 100 +
			(amount * (parseFloat(sgst) || 0)) / 100 +
			(amount * (parseFloat(igst) || 0)) / 100;
		setFormData((prevState) => ({
			...prevState,
			netAmount: (netAmount * 1000).toFixed(2),
		}));
	};
	useEffect(() => {
		if (pdfUrl) {
			updatePdfLink();
		}
	}, [pdfUrl]);
	const updatePdfLink = async () => {
		const data = {
			dateofgeneration: new Date().toISOString().split('T')[0],
			generationlink: pdfUrl
		}
		console.log(1);

		console.log(data);
		axios.put(`${process.env.REACT_APP_BACKEND_URL}/slips/updateSalesInvoice/${salesInvoiceId}`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
				"Content-Type": "application/json",
			}
		})
			.then(response => {
				message.success(response.data.message);
			})
			.catch(error => {
				if (error.response) {
					console.error('Error updating proforma invoice:', error.response.data);
				} else {
					console.error('Error:', error.message);
				}
			});
	}
	const handleGenerate = async () => {
		try {
			if (!salesInvoiceId) {
				const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/slips/getSalesId`, {}, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
						"Content-Type": "application/json",
					}
				})
				setSalesInvoiceId(res.data[0].salesinvoiceId);
				console.log('id generated');
			}
		} catch (err) {
			console.log(err);
		}
	}
	useEffect(() => {
		calculateNetAmount();
	}, [formData.rate, formData.quantity, formData.cgst, formData.sgst, formData.igst]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		handleGenerate()
		console.log(formData);
		setForm(true)
	};
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
	const generatePDF = async () => {
		const htmlElement = document.getElementById('purchase-order');
		console.log(pdfUrl);

		const pdf = new jsPDF('p', 'mm', 'a4');
		if (!pdfUrl) {
			try {
				const canvas = await html2canvas(htmlElement, { scale: 3 });
				const imgData = canvas.toDataURL('image/png');

				const imgWidth = 210;
				const pageHeight = 295;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;

				pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

				const pdfBlob = pdf.output('blob');

				const formData = new FormData();
				formData.append('file', pdfBlob, 'invoice');
				formData.append('upload_preset', 'payslips');

				const response = await axios.post(
					'https://api.cloudinary.com/v1_1/dtgnotkh7/auto/upload',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				setPdfUrl(response.data.secure_url);
				window.open(response.data.secure_url, '_blank');
			} catch (error) {
				if (error.response) {
					console.error('Error uploading PDF:', error.response.data);
				} else {
					console.error('Error:', error.message);
				}
			}
		} else {
			window.open(pdfUrl, '_blank');
		}
		message.success('Pdf Generated')
	};
	return (
		<div style={styles.container}>
			{!form &&
				<>
					<IoArrowBackCircleOutline style={styles.back} onClick={() => navigate(-1)} />
					<h1 style={{ textAlign: 'center', marginBottom: '4rem' }}>Invoice Form</h1 >
					<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>

						{/* Row -2 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>CIN No:</label>
								<input style={styles.input} type="text" name="cin" value={formData.cin} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>PAN No:</label>
								<input style={styles.input} type="text" name="pan" value={formData.pan} onChange={handleChange} req/>
							</div>
						</div>
						{/* Row -1 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>PF No:</label>
								<input style={styles.input} type="text" name="pf" value={formData.pf} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>ESIC No:</label>
								<input style={styles.input} type="text" name="esic" value={formData.esic} onChange={handleChange} req/>
							</div>
						</div>
						{/* Row 0 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Billing Address:</label>
								<textarea style={styles.textarea} name="billingAddress" value={formData.billingAddress} onChange={handleChange} />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Shipment Address:</label>
								<textarea style={styles.textarea} name="shipmentAddress" value={formData.shipmentAddress} onChange={handleChange} />
							</div>
						</div>
						{/* Row 1 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>PO Date:</label>
								<input style={styles.input} type="date" name="poDate" value={formData.poDate} onChange={handleChange} req/>
							</div>
						</div>

						{/* Row 2 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Delivery Date:</label>
								<input style={styles.input} type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Vendor Name:</label>
								<input style={styles.input} type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} req/>
							</div>
						</div>

						{/* Row 3 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Warranty:</label>
								<input style={styles.input} type="text" name="warranty" value={formData.warranty} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Vendor Address:</label>
								<textarea style={styles.textarea} name="vendorAddress" value={formData.vendorAddress} onChange={handleChange} />
							</div>
						</div>

						{/* Row 4 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Payment Terms:</label>
								<input style={styles.input} type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Delivery Terms:</label>
								<input style={styles.input} type="text" name="deliveryTerms" value={formData.deliveryTerms} onChange={handleChange} req/>
							</div>
						</div>

						{/* Row 5 */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Freight:</label>
								<input style={styles.input} type="text" name="freight" value={formData.freight} onChange={handleChange} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Description:</label>
								<input style={styles.input} type="text" name="description" value={formData.description} onChange={handleChange} req/>
							</div>
						</div>

						{/* Row 6: Quantity, Rate, Taxes */}
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Quantity:</label>
								<input style={styles.input} type="number" name="quantity" value={formData.quantity} onChange={handleChange} min={0} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Rate:</label>
								<input style={styles.input} type="number" name="rate" value={formData.rate} onChange={handleChange} min={0} req/>
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>CGST (%):</label>
								<input style={styles.input} type="number" name="cgst" value={formData.cgst} onChange={handleChange} min={0} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>SGST (%):</label>
								<input style={styles.input} type="number" name="sgst" value={formData.sgst} onChange={handleChange} min={0} req/>
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>IGST (%):</label>
								<input style={styles.input} type="number" name="igst" value={formData.igst} onChange={handleChange} min={0} req/>
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Net Amount:</label>
								<input style={styles.input} type="text" name="netAmount" value={formData.netAmount} readOnly req/>
							</div>
						</div>

						<button type="submit" style={styles.button}>Submit</button>
					</form></>}
			{
				form &&
				<div style={{ width: 'fit-content', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
					<div id="purchase-order" style={{ padding: "30px 10px" }}>
						<div style={{ fontSize: '18px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', lineHeight: '1.5' }}>
							INVOICE
						</div>
						<table style={{ width: '600px', borderCollapse: 'collapse', margin: '0 auto' }}>
							<tr>
								<td rowSpan="3" colSpan="3" style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>
									<img src={vtslogo} alt="Logo" width="120" /><br />
									<strong>VTS India Private Limited</strong><br />
								</td>
								<td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>BILL TO ADDRESS</td>
								<td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>SHIP TO ADDRESS</td>
							</tr >
							<tr>
								<td colSpan="5" style={{ border: '1px solid black', padding: '6px', lineHeight: '18px' }}>
									{formData.billingAddress.toUpperCase().split('\n').map((line, index) => (
										<p style={{ margin: 0 }} key={index}>{line}</p>
									))}
								</td>
								<td colSpan="5" style={{ border: '1px solid black', padding: '6px', lineHeight: '18px' }}>
									{formData.shipmentAddress.toUpperCase().split('\n').map((line, index) => (
										<p style={{ margin: 0 }} key={index}>{line}</p>
									))}
								</td>
							</tr>
							<tr>
								<td colSpan="10" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
									CIN No: {formData.cin} <br />
									PAN No: {formData.pan} <br />
									PF No: {formData.pf} <br />
									ESIC No: {formData.esic}
								</td>
							</tr>
							<tr>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>PO No:</td>
								<td colSpan="2" style={{ border: '1px solid black', padding: '6px' }}>{salesInvoiceId}</td>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>PO Date:</td>
								<td colSpan="2" style={{ border: '1px solid black', padding: '6px' }}>{formData.poDate}</td>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Delivery Date:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.deliveryDate}</td>
							</tr>
							<tr>
								<td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Vendor Name:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.vendorName}</td>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Warranty:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.warranty}</td>
							</tr>
							<tr>
								<td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Vendor Address:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.vendorAddress.toUpperCase().split('\n').map((line, index) => (
									<p style={{ margin: 0 }} key={index}>{line}</p>
								))}</td>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Payment Terms:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.paymentTerms}</td>
							</tr>
							<tr>
								<td colSpan="2" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Delivery Terms:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.deliveryTerms}</td>
								<td style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Freight:</td>
								<td colSpan="4" style={{ border: '1px solid black', padding: '6px' }}>{formData.freight}</td>
							</tr>
							<tr>
								<td colSpan="11" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>ITEM DETAILS</td>
							</tr >
							<tr>
								<th style={{ border: '1px solid black', padding: '6px' }}>S.No</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>Description</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>Quantity (Tonnes)</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>Rate / Tonne</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>Amount</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>CGST (%)</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>SGST (%)</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>IGST (%)</th>
								<th style={{ border: '1px solid black', padding: '6px' }}>Net Amount</th>
							</tr>
							<tr>
								<td style={{ border: '1px solid black', padding: '6px' }}>1</td>
								<td style={{ border: '1px solid black', padding: '6px' }}>{formData.description}</td>
								<td className="quantity" style={{ border: '1px solid black', padding: '6px' }}>{formData.quantity}</td>
								<td className="rate" style={{ border: '1px solid black', padding: '6px' }}>{formData.rate * 1000}</td>
								<td style={{ border: '1px solid black', padding: '6px' }}>{parseInt(formData.quantity) * parseInt(formData.rate) * 1000}</td>
								<td className="cgst" style={{ border: '1px solid black', padding: '6px' }}>{formData.cgst}</td>
								<td className="sgst" style={{ border: '1px solid black', padding: '6px' }}>{formData.sgst}</td>
								<td className="igst" style={{ border: '1px solid black', padding: '6px' }}>{formData.igst}</td>
								<td className="net-amount" style={{ border: '1px solid black', padding: '6px' }}>{formData.netAmount}</td>
							</tr>
							{/* Add more rows as needed */}
							<tr>
								<td colSpan="8" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>Total Amount (INR):</td>
								<td colSpan="3" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }} id="total-amount">{formData.netAmount}</td>
							</tr>
							<tr>
								<td colSpan="11" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
									Amount in Words:
									<div id="amount-in-words">{numberToWords(parseInt(formData.netAmount)).toString()}</div>
								</td>
							</tr>
							<tr>
								<td colSpan="11" style={{ fontWeight: 'bold', border: '1px solid black', padding: '6px' }}>
									Remarks: The application is going to utilities by b2bhubindia.com
								</td>
							</tr>
							<tr>
								<td colSpan="11" style={{ textAlign: 'right', border: '1px solid black', padding: '6px' }}>
									<strong>For VTS India Private Limited</strong><br /><br />
									<img src={stamp} alt="Signature" width="100" /><br />
									<strong>Authorized Signatory</strong>
								</td>
							</tr >
						</table >
					</div >
					<button onClick={() => setForm(false)} style={{ display: 'inline-block', margin: '20px 10px', padding: '10px 20px', fontSize: '16px' }}>Edit PDF</button>
					<button onClick={generatePDF} style={{ display: 'inline-block', margin: '20px 10px', padding: '10px 20px', fontSize: '16px' }}>Generate PDF</button>
				</div >
			}
		</div >
	);
};

const styles = {
	container: {
		position: 'relative',
		maxWidth: '650px',
		margin: window.innerWidth < 780 ? '20px' : '20px auto',
		fontFamily: 'Arial, sans-serif',
		border: "2px solid grey",
		borderRadius: "10px",
		padding: "30px 40px",
		textAlign: "center",
		overflowX: 'scroll',
		scrollbarWidth: 'none',
	},
	back: {
		display: window.innerWidth < 900 ? 'block' : 'none',
		position: 'absolute',
		top: '25px',
		left: '25px',
		fontSize: '30px',
		color: 'red'
	},
	row: {
		display: 'flex',
		flexWrap: 'wrap',         // Enables wrapping when the width is insufficient
		gap: '15px',              // Adds space between input fields
		marginBottom: '15px',
	},
	column: {
		flex: '1 1 100px',        // Allows columns to take up at least 300px and grow with available space
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		minWidth: '200px',        // Ensures a minimum width for each column
	},
	label: {
		fontWeight: 'bold',
		marginBottom: '5px',
		textAlign: 'left'
	},
	input: {
		margin: '0',
		boxSizing: 'border-box',
		padding: '10px',
		border: '1px solid #ccc',
		borderRadius: '7px',
		outline: 'none',
		fontSize: '16px'
	},
	textarea: {
		boxSizing: 'border-box',
		padding: '8px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		resize: 'vertical',
		outline: 'none',
		fontSize: '16px'
	},
	button: {
		backgroundColor: '#4CAF50',
		color: 'white',
		padding: '10px 20px',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		textAlign: 'center',
		marginTop: '20px',
		boxSizing: 'border-box',
		fontSize: '16px'
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		gap: '20px',
	},
};


export default Invoice;
