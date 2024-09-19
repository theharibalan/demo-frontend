import jsPDF from 'jspdf';
import 'jspdf-autotable';
export const downloadTermsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(8);
    
    doc.text('Terms and Conditions', 20, 20);
    
    const termsContent = `
      1. Introduction
      These Terms and Conditions govern the purchase and use of digital products offered on this platform. By purchasing any digital product, you agree to these terms.
      
      2. License and Use
      Upon purchase, you are granted a non-exclusive, non-transferable license to use the digital product for personal or professional use. Redistribution, reselling, or sharing of the digital product is strictly prohibited.
      
      3. Payment
      All payments must be made in full before accessing the digital product. We accept payments through various methods as indicated at checkout. All transactions are secure and encrypted.
      
      4. Refund Policy
      Due to the digital nature of the products, all sales are final. Refunds are not provided unless required by law. We recommend reviewing the product details and any provided samples before making a purchase.
      
      5. Intellectual Property
      All digital products are the intellectual property of the respective creators. Unauthorized use, reproduction, or distribution of these products is prohibited and may result in legal action.
      
      6. Limitation of Liability
      We are not liable for any damages resulting from the use or inability to use the digital products. Our maximum liability to you shall not exceed the amount you paid for the product.
      
      7. Changes to Terms
      We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. Continued use of the products after changes are posted constitutes your acceptance of the new terms.
      
      8. Contact Information
      If you have any questions or concerns about these Terms and Conditions, please contact us at support@yourdomain.com.
    `;

    doc.text(termsContent, 20, 50);
    doc.save('VTSb2bTerms&Conditions.pdf');
  };