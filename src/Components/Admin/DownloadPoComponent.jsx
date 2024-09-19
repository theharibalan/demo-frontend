import React, { useState } from "react";
import { Modal, Button, DatePicker, Checkbox, message } from "antd";
import moment from "moment";
import generatePo from "../GeneratePO";
const PoModal = ({ visible, onClose, data }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [downloadEntirePo, setDownloadEntirePo] = useState(false);
  const [poBtnText, setPoBtnText] = useState("Download PO");

  const filterPoData = () => {
    let filteredData = data;

    if (!downloadEntirePo && fromDate && toDate) {
      const from = moment(fromDate).startOf('day');
      const to = moment(toDate).endOf('day');
      
      filteredData = data.filter(item => {
        const orderDate = moment(item.date_of_order, "DD/MM/YYYY");
        return orderDate.isBetween(from, to, null, "[]");
      });
    }

    return filteredData;
  };

  const processPoData = async (filteredData) => {
    setPoBtnText("Generating...");
    
    // Call your existing function to generate and download the PO
    const url = await generatePo(filteredData);

    setPoBtnText("Download PO");
    message.success("Purchase Order downloaded successfully!");
  };

  const handleDownloadClick = () => {
    const filteredData = filterPoData();
    processPoData(filteredData);
    onClose(); // Close the modal after processing
  };

  return (
    <Modal
      title="Download Purchase Order"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="download"
          type="primary"
          onClick={handleDownloadClick}
        >
          {poBtnText}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "16px" }}>
        <DatePicker
          placeholder="From Date"
          onChange={(date) => setFromDate(date)}
          style={{ marginRight: "8px" }}
        />
        <DatePicker
          placeholder="To Date"
          onChange={(date) => setToDate(date)}
        />
      </div>
      <Checkbox
        checked={downloadEntirePo}
        onChange={(e) => setDownloadEntirePo(e.target.checked)}
      >
        Download Entire Purchase Order
      </Checkbox>
    </Modal>
  );
};

export default PoModal;
