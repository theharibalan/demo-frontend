import React, { useState, useEffect } from 'react';

const PurchaseOrderForm = () => {
  const [formData, setFormData] = useState({
    poNo: '',
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
      netAmount: netAmount.toFixed(2),
    }));
  };

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
    console.log(formData);
  };

  return (
    <div style={{ width: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', border: "2px solid grey", borderRadius: "10px", padding: "40px", textAlign:"center"
}}>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}> Purchase Order Form</h2 >

    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
      {/* Row 1 */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>PO No:</label>
          <input style={styles.input} type="text" name="poNo" value={formData.poNo} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>PO Date:</label>
          <input style={styles.input} type="date" name="poDate" value={formData.poDate} onChange={handleChange} />
        </div>
      </div>

      {/* Row 2 */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Delivery Date:</label>
          <input style={styles.input} type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Vendor Name:</label>
          <input style={styles.input} type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} />
        </div>
      </div>

      {/* Row 3 */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Warranty:</label>
          <input style={styles.input} type="text" name="warranty" value={formData.warranty} onChange={handleChange} />
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
          <input style={styles.input} type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Delivery Terms:</label>
          <input style={styles.input} type="text" name="deliveryTerms" value={formData.deliveryTerms} onChange={handleChange} />
        </div>
      </div>

      {/* Row 5 */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Freight:</label>
          <input style={styles.input} type="text" name="freight" value={formData.freight} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Description:</label>
          <input style={styles.input} type="text" name="description" value={formData.description} onChange={handleChange} />
        </div>
      </div>

      {/* Row 6: Quantity, Rate, Taxes */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Quantity:</label>
          <input style={styles.input} type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Rate:</label>
          <input style={styles.input} type="number" name="rate" value={formData.rate} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>CGST (%):</label>
          <input style={styles.input} type="number" name="cgst" value={formData.cgst} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>SGST (%):</label>
          <input style={styles.input} type="number" name="sgst" value={formData.sgst} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>IGST (%):</label>
          <input style={styles.input} type="number" name="igst" value={formData.igst} onChange={handleChange} />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Net Amount:</label>
          <input style={styles.input} type="text" name="netAmount" value={formData.netAmount} readOnly />
        </div>
      </div>

      <button type="submit" style={styles.button}>Submit</button>
    </form>
    </div >
  );
};

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  column: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
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
},
};

export default PurchaseOrderForm;
