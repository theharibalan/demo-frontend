import React, { useState } from "react";
import { Modal, Button, Table, Image } from "antd";

const ProductComparisonModal = ({ isOpen, onRequestClose, products, locationOffers }) => {
  const calculatePriceWithOffer = (price, location) => {
    const discount = locationOffers[location] || 0;
    return price - (price * discount) / 100;
  };

  const allLocations = Object.keys(locationOffers).reduce((acc, loc) => {
    if (typeof locationOffers[loc] === "object") {
      return [...acc, ...Object.keys(locationOffers[loc])];
    }
    return [...acc, loc];
  }, []);

  const comparisonData = allLocations.flatMap((location) =>
    products.flatMap((product) =>
      product.costPerUnit.map((unit) => ({
        key: `${product.name}-${unit.grade}-${location}`, // Unique key for each row
        productName: `${product.name} - ${unit.grade}`,
        location,
        image: unit.Image || product.CommonImage,
        price: unit.PricePerUnit,
        calculatedPrice: calculatePriceWithOffer(unit.PricePerUnit, location).toFixed(2),
      }))
    )
  );

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.image}
            alt={record.productName}
            width={50}
            height={50}
            style={{ marginRight: "10px" }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Price with Offer (₹)",
      dataIndex: "calculatedPrice",
      key: "calculatedPrice",
      sorter: (a, b) => a.calculatedPrice - b.calculatedPrice,
    },
  ];

  return (
    <Modal
      title="Product Comparison"
      visible={isOpen}
      onCancel={onRequestClose}
      footer={[
        <Button key="close" onClick={onRequestClose}>
          Close
        </Button>,
      ]}
      width="70vw"
    //   style={{ top: "6vh" }}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <Table
        dataSource={comparisonData}
        columns={columns}
        pagination={false}
        scroll={{ y: "calc(70vh - 150px)" }} // Adjust scrolling inside table
      />
    </Modal>
  );
};

export default ProductComparisonModal;
