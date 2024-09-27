import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

const Proforma = () => {
	const [pdfUrl, setPdfUrl] = useState('')
	const [proformaId, setProformaId] = useState(null)
	const navigate = useNavigate()
	useEffect(() => {
		if (!localStorage.getItem('admin-role')) {
			navigate("/admin@b2b/b2bhubindia")
		}
	})
	const [form, setForm] = useState(true)
	const [amtData, setAmtData] = useState({
		amount: 0,
		sgst: 0,
		cgst: 0
	})
	const [formData, setFormData] = useState({
		companyName: '',
		companyAddress: '',
		mobile: '',
		email: '',
		gstin: '',
		pan: '',
		date: new Date().toISOString().split('T')[0], // today's date
		dueDate: '',
		description: '',
		hsn: '',
		qty: 0,
		unit: '',
		weight: 0,
		rate: 0,
		sgst: 0,
		cgst: 0,
		bankName: '',
		accountNumber: '',
		ifsc: '',
		branch: ''
	});
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
		
		axios.put(`${process.env.REACT_APP_BACKEND_URL}/slips/updateProformaInvoice/${proformaId}`, data, {
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

	const generatePDF = async () => {
		const htmlElement = document.getElementById('proforma');
		console.log(pdfUrl);

		if (!pdfUrl) {
			try {
				const canvas = await html2canvas(htmlElement, { scale: 3 });
				const imgData = canvas.toDataURL('image/png');

				const pdf = new jsPDF('p', 'mm', 'a4');
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
	};
	const handleGenerate = async () => {
		try {
			if (!proformaId) {
				const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/slips/getProformaId`, {}, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
						"Content-Type": "application/json",
					}
				})
				setProformaId(res.data[0].ProformaInvoiceId);
				console.log('id generated :', res.data[0].ProformaInvoiceId);
				setForm(false);
			}
		} catch (err) {
			console.log(err);
		}
	}
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		handleGenerate();
		setAmtData({
			amount: (parseInt(formData.qty) * parseFloat(formData.rate)).toFixed(2),
			sgst: (parseInt(formData.qty) * parseFloat(formData.rate) * parseFloat((formData.sgst) / 100)).toFixed(2),
			cgst: (parseInt(formData.qty) * parseFloat(formData.rate) * parseFloat((formData.cgst) / 100)).toFixed(2)
		})
	};

	return (
		<div style={styles.container}>
			<IoArrowBackCircleOutline style={styles.back} onClick={() => navigate(-1)} />
			{form ?
				<div>
					<h1 style={{ textAlign: 'center', marginBottom: '4rem' }}>Proforma Invoice Form</h1>
					<form onSubmit={handleSubmit} style={styles.form}>
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Company Name:</label>
								<input style={styles.input} type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Company Address:</label>
								<textarea style={styles.textarea} name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Mobile:</label>
								<input style={styles.input} type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Email:</label>
								<input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} required />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>GSTIN:</label>
								<input style={styles.input} type="text" name="gstin" value={formData.gstin} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>PAN No:</label>
								<input style={styles.input} type="text" name="pan" value={formData.pan} onChange={handleChange} required />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Date:</label>
								<input style={styles.input} type="date" name="date" value={formData.date} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Due Date:</label>
								<input style={styles.input} type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Description of Good:</label>
								<input style={styles.input} type="text" name="description" value={formData.description} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>HSN/SAC:</label>
								<input style={styles.input} type="number" name="hsn" value={formData.hsn} onChange={handleChange} min={0} required />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Quantity:</label>
								<input style={styles.input} type="number" name="qty" value={formData.qty} onChange={handleChange} min={0} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Unit:</label>
								<select
									style={styles.input}
									name="unit"
									value={formData.unit}
									onChange={handleChange}

								>
									<option value="">Select Unit</option>
									<option value="PAC">PAC</option>
									<option value="KG">Kilogram (KG)</option>
									<option value="G">Gram (G)</option>
									<option value="LIT">Liter (L)</option>
									<option value="ML">Milliliter (ML)</option>
									<option value="T">Ton (T)</option>
									<option value="GAL">Gallon (GAL)</option>
									<option value="BOX">Box</option>
									<option value="DOZEN">Dozen</option>
									<option value="BAG">Bag</option>
								</select>
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Weight:</label>
								<input style={styles.input} type="number" name="weight" value={formData.weight} onChange={handleChange} min={0} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Rate:</label>
								<input style={styles.input} type="number" name="rate" value={formData.rate} onChange={handleChange} min={0} required />
							</div>
						</div>

						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>SGST (%):</label>
								<input style={styles.input} type="number" name="sgst" value={formData.sgst} onChange={handleChange} min={0} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>CGST (%):</label>
								<input style={styles.input} type="number" name="cgst" value={formData.cgst} onChange={handleChange} min={0} required />
							</div>
						</div>
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>Bank Name:</label>
								<input style={styles.input} type="text" name="bankName" value={formData.bankName} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Account Number:</label>
								<input style={styles.input} type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
							</div>
						</div>
						<div style={styles.row}>
							<div style={styles.column}>
								<label style={styles.label}>IFSC Code:</label>
								<input style={styles.input} type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} required />
							</div>
							<div style={styles.column}>
								<label style={styles.label}>Branch:</label>
								<input style={styles.input} type="text" name="branch" value={formData.branch} onChange={handleChange} required />
							</div>
						</div>

						<button type="submit" style={styles.button}>Submit</button>
					</form>
				</div>
				:
				<>
					<div style={{
						boxSizing: 'border-box',
						fontFamily: 'Arial, sans-serif',
						width: '650px',
						backgroundColor: 'white',
						padding: '20px',
						border: '1px solid #000',
						boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
						height: '700px',
						fontSize: '12px', fontWeight: 500
					}}
						id='proforma'>
						<div style={{
							textAlign: 'center',
							fontSize: '18px',
							fontWeight: 'bold',
							marginBottom: '10px'
						}}>
							PROFORMA INVOICE
						</div>
						<div style={{ display: 'flex' }}>
							<div style={{ flex: 1, border: '1px solid black', padding: '10px', textAlign: 'left', lineHeight: '18px' }}>
								<strong>{formData.companyName}</strong><br />
								{formData.companyAddress.toUpperCase().split('\n').map((line, index) => (
									<p style={{ margin: 0 }} key={index}>{line}</p>
								))}
								<strong>Mobile:</strong> +91 {formData.mobile}<br />
								<strong>Email:</strong> {formData.email}
							</div>
							<div style={{ width: '35%', border: '1px solid black', padding: '10px', textAlign: 'left' }}>
								<strong>G.S.TIN:</strong> {formData.gstin}<br />
								<strong>PAN No:</strong> {formData.pan}
							</div>
						</div>

						<div style={{ display: 'flex' }}>
							<div style={{ flex: 1, border: '1px solid black', padding: '10px', textAlign: 'left', lineHeight: "18px" }}>
								<strong>VTS ENTERPRISES INDIA PRIVATE LIMITED</strong><br />
								No 33 3RD FLOOR, NO 25<br />
								PNB CENTER, VENKATANARAYANA ROAD<br />
								T NAGAR, CHENNAI 600017<br />
								<strong>G.S.TIN:</strong> 33AAACV0782B1ZT
							</div>
							<div style={{ width: '35%', border: '1px solid black', padding: '10px', textAlign: 'left' }}>
								<strong>P.I No:</strong> {proformaId}<br />
								<strong>Date:</strong> {formData.date}<br />
								<strong>Due Date:</strong> {formData.dueDate}
							</div>
						</div>

						<div>
							<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
								<thead>
									<tr>
										<th style={{ border: '1px solid black', padding: '5px' }}>SNo</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Description Of Goods/Services</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>HSN/SAC</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Qty</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Unit</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Weight</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Rate</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Tax%</th>
										<th style={{ border: '1px solid black', padding: '5px' }}>Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>1</td>
										<td style={{ border: '1px solid black', padding: '5px' }}>{formData.description.toUpperCase()}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{formData.hsn}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{formData.qty}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{formData.unit}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{formData.weight}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{formData.rate}</td>
										<td style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>{parseInt(formData.sgst) + parseInt(formData.cgst)}</td>
										<td style={{ border: '1px solid black', textAlign: 'right', padding: '5px' }}>{formatIndianNumber(parseInt(amtData.amount))}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left' }}>
							<div style={{ width: '50%', fontWeight: 'bold', marginTop: '20px' }}>
								Amount in Words: INR {numberToWords(parseInt(amtData.amount) + parseInt(amtData.sgst) + parseInt(amtData.cgst))}
							</div>
							<div style={{ width: '35%', border: '1px solid black', padding: '10px', lineHeight: '18px' }}>
								<strong>Sub Total:</strong> {formatIndianNumber(parseInt(amtData.amount))}<br />
								<strong>Total SGST:</strong> {amtData.sgst}<br />
								<strong>Total CGST:</strong> {amtData.cgst}<br />
								<hr />
								<strong>Total:{formatIndianNumber(parseInt(amtData.amount) + parseInt(amtData.sgst) + parseInt(amtData.cgst))}</strong>
							</div>
						</div>

						<div>
							<table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
								<thead>
									<tr>
										<th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>Tax Summary</th>
										<th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>Taxable Amt</th>
										<th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>SGST Summary</th>
										<th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>CGST Summary</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>GST {parseInt(formData.sgst) + parseInt(formData.cgst)}%</td>
										<td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{formatIndianNumber(parseInt(amtData.amount))}</td>
										<td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{amtData.sgst}</td>
										<td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{amtData.cgst}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={{ width: '70%', border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'left' }}>
								<strong>Bank Details:</strong><br />
								{formData.bankName}<br />
								A/C No: {formData.accountNumber}<br />
								IFSC Code: {formData.ifsc}<br />
								Branch: {formData.branch}
							</div>
							<div style={{ width: '35%', border: '1px solid black', padding: '10px', textAlign: 'right' }}>
								<strong>For ASSRM AND CO</strong><br /><br /><br /><br />
								Authorized Signatory
							</div>
						</div>

						<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
							<div style={{
								width: '100%',
								borderTop: '1px solid black',
								paddingTop: '10px',
								textAlign: 'right'
							}}>
								Receiver's Sign
							</div>
						</div>
					</div>
					<button onClick={() => setForm(true)} className='button-7' style={{ marginRight: "20px", marginTop: "20px" }}>Edit PDF</button>
					<button onClick={generatePDF} className='button-7' style={{ marginTop: "20px" }}>Generate PDF</button>
				</>
			}
		</div>
	);
};

const styles = {
	container: {
		maxWidth: '650px',
		position: 'relative',
		margin: window.innerWidth < 780 ? '20px' : '20px auto',
		fontFamily: 'Arial, sans-serif',
		border: "2px solid grey",
		borderRadius: "10px",
		padding: " 30px 40px",
		textAlign: "center",
		overflowX: 'scroll',
		scrollbarWidth: 'none',
	},
	back: {
		display: window.innerWidth < 900 ? 'block' : 'none',
		position: 'absolute',
		top: '25px',
		left: '20px',
		color: 'red',
		fontSize: '30px'
	},
	row: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '15px',
		marginBottom: '15px',
	},
	column: {
		flex: '1 1 100px',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		minWidth: '200px',
	},
	label: {
		fontWeight: 'bold',
		marginBottom: '5px',
		textAlign: 'left',
		fontSize: '14px'
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


export default Proforma;