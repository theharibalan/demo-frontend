import React, { useEffect, useState } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';
import "../../admin.css"
import { Button, Form, Input, message, Modal } from 'antd';

function AllSellersProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profitCount, setProfitCount] = useState(0);
  const [lossCount, setLossCount] = useState(0);
  const [poModal,setPoModal] = useState(false)
  const [productsInfo,setProductsInfo] = useState([])
  const [quantity,setQuantity] = useState('')
  const [priceOfProduct,setPriceOfProduct] = useState('')
  const [selectedProduct,setSelectedproduct] = useState()
  useEffect(()=>{
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/getProducts`
    axios.post(url,{})
    .then(response => {
      setProductsInfo(response.data)
    })
    .catch(err=>{
      console.log(err)
    })
  })
  // const productsInfo = [
  //   {
  //     name: "MoongDal",
  //     QualityAvailable: "A Grade",
  //     costPerUnit: [
  //       { grade: "Green ToorDal", PricePerUnit: 96 },
  //       { grade: "Imported MoongDal", PricePerUnit: 111 },
  //       { grade: "Desi MoongDal", PricePerUnit: 90 },
  //     ],
  //   },
  //   {
  //     name: "ToorDal",
  //     QualityAvailable: "A Grade",
  //     costPerUnit: [
  //       { grade: "Fatka ToorDal", PricePerUnit: 155 },
  //       { grade: "Green ToorDal", PricePerUnit: 165 },
  //       { grade: "Imported ToorDal", PricePerUnit: 145 },
  //       { grade: "Polished ToorDal", PricePerUnit: 145 },
  //     ],
  //   },
  //   {
  //     name: "UradDal",
  //     QualityAvailable: "A Grade",
  //     costPerUnit: [
  //       { grade: "Black UradDal", PricePerUnit: 104 },
  //       { grade: "Desi UradDal", PricePerUnit: 128 },
  //       { grade: "Imported UradDal", PricePerUnit: 111 },
  //     ],
  //   },
  //   {
  //     name: "GramDal",
  //     QualityAvailable: "A Grade",
  //     costPerUnit: [
  //       { grade: "Premium GramDal", PricePerUnit: 120 },
  //       { grade: "Gold GramDal", PricePerUnit: 105 },
  //     ],
  //   },
  // ];

  const getMRP = (productName, productType) => {
    const productInfo = productsInfo.find(
      (info) => info.name === productName
    );
  
    if (productInfo) {
      const gradeInfo = productInfo.costPerUnit.find(
        (unit) => unit.grade === productType
      );
      
      return gradeInfo ? gradeInfo.PricePerUnit : 200;
    }
  
    return 200;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/seller/getAllProducts`,
          []
        );
        const productData = response.data;

        let profit = 0;
        let loss = 0;

        const mappedProducts = productData.map((item) => {
          const MRP = getMRP(item.productName, item.productType);
          
          
          const profitOrLoss = MRP - item.price;
          const isProfit = profitOrLoss >= 0;

          // Count profits and losses
          if (isProfit) {
            profit++;
          } else {
            loss++;
          }

          return {
            ...item,
            MRP,
            profitOrLoss,
            isProfit,
          };
        });

        // Set sorted products and counts
        setProducts(
          mappedProducts.sort((a, b) => b.profitOrLoss - a.profitOrLoss)
        );
        setProfitCount(profit);
        setLossCount(loss);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products data');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  const handleRequestPO = ()=>{
    setPoModal(true)
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }
  const sendRequestPO = (vals)=>{
    
    const poData = {
      productId : selectedProduct.productId,
      customerId : selectedProduct.customerId,
      quantity : vals.quantity,
      price : vals.price,
      productName : selectedProduct.productName
    }
    console.log(poData);
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/po/addpo`,poData)
    .then(res=>{
      message.success('PO Request sent successfully')
    })
    .catch(err=>{
      message.error('Error sending PO request')
    })
  }
  return (
    <div className='order-tables'>
      <h2>
        All Sellers Products &nbsp;
        <span style={{ fontSize: '16px' }}>
          (Profits: {profitCount}, Losses: {lossCount})
        </span>
      </h2>
      <table className='table yellow-table'>
        <thead>
          <tr>
            <th>Seller </th>
            <th>Product </th>
            <th>Quantity</th>
            <th>Seller's Price/KG</th>
            <th>Our MRP Price/KG</th>
            <th>Profit or Loss (₹)</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Request PO</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.productId}>
              <td>{item.CompanyName}</td>
              <td>{item.productName} [{item.productType}]</td>
              <td>{item.units}</td>
              <td>Rs.{item.price}</td>
              <td>Rs.{item.MRP}</td>
              <td
                style={{
                  width:"fit-content",
                  color: item.isProfit ? 'green' : 'red',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />} &nbsp;₹&nbsp;
                {Math.abs(item.profitOrLoss)} /-
              </td>
              <td>{item.phoneNo}</td>
              <td>{item.Email}</td>
              <td>{<button className='button-7' onClick={()=>{
                setSelectedproduct(item)
                handleRequestPO()

              }}>Request PO</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title={<span><InfoCircleTwoTone /> Publish Product</span>}
        visible={poModal}
        onOk={() => sendRequestPO()}
        onCancel={()=>setPoModal(false)}
        okText="Request PO"
        cancelText="Cancel"
      >
        <p>Are you sure want to Request PO to this Seller?</p>
        <Form

                  layout="vertical"
                  onFinish={sendRequestPO}
                >
                  <Form.Item label="Price/KG" name="price" >
                    <Input onChange={(e)=>setPriceOfProduct(e.target.value)} placeholder={""} required/>
                  </Form.Item>
                  
                  <Form.Item label="Quantity * (in TONNES)" name="quantity">
                    <Input onChange={e=>setQuantity(e.target.value)} required/>
                  </Form.Item>
                  <Button  type="primary" htmlType="submit">
                    Request PO
                  </Button>
                </Form>
      </Modal>
    </div>
  );
}

export default AllSellersProducts;