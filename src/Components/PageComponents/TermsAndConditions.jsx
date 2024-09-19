import React from 'react';
import { useLocation } from 'react-router-dom';

const TermsAndConditions = () => {
    const location = useLocation()
    const purchaseData = location.purchaseData
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Terms and Conditions</h1>
      
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>1. Introduction</h2>
        <p>
          These Terms and Conditions govern the purchase and use of digital products offered on this platform. By purchasing any digital product, you agree to these terms.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>2. License and Use</h2>
        <p>
          Upon purchase, you are granted a non-exclusive, non-transferable license to use the digital product for personal or professional use. Redistribution, reselling, or sharing of the digital product is strictly prohibited.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>3. Payment</h2>
        <p>
          All payments must be made in full before accessing the digital product. We accept payments through various methods as indicated at checkout. All transactions are secure and encrypted.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>4. Refund Policy</h2>
        <p>
          Due to the digital nature of the products, all sales are final. Refunds are not provided unless required by law. We recommend reviewing the product details and any provided samples before making a purchase.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>5. Intellectual Property</h2>
        <p>
          All digital products are the intellectual property of the respective creators. Unauthorized use, reproduction, or distribution of these products is prohibited and may result in legal action.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>6. Limitation of Liability</h2>
        <p>
          We are not liable for any damages resulting from the use or inability to use the digital products. Our maximum liability to you shall not exceed the amount you paid for the product.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. Continued use of the products after changes are posted constitutes your acceptance of the new terms.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>8. Contact Information</h2>
        <p>
          If you have any questions or concerns about these Terms and Conditions, please contact us at <a href="mailto:support@yourdomain.com" style={{ color: '#0066cc' }}>support@yourdomain.com</a>.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p>
          By purchasing our digital products, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;