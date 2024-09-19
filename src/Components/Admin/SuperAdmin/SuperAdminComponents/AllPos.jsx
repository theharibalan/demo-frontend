import React, { useEffect, useState } from 'react'
import "../../admin.css"
import axios from 'axios';

const AllPos = () => {
const [data,setData]=useState([]);
const handleFetchPos = async() =>{
  
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/po/getAllPos`,{}).then(res=>{
          console.log(res.data)
            setData(res.data)
        })
        .catch(err=>{console.log(err)})
}
useEffect(()=>{
  handleFetchPos()
},[])
  return (
    <div className="order-tables">
      <h2>
        All Purchase Orders
      </h2>
      <table className="table yellow-table">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Seller's ID</th>
            <th>Quantity</th>
            <th>PO Status</th>
          </tr>
        </thead>
        {data.length===0?(<h1>No POs yet</h1>):(
          <tbody>
          {data.map((item,index)=>{
            return(<tr key = {item.poId}>
              <td>{item.poId}</td>
              <td>{item.customerId}</td>
              <td>{item.quantity}</td>
              <td>{item.poStatus===1 ? (<a target='_blank' href={item.PurchaseOrderURL}>View PO</a>):(<p>Pending</p>)}</td>
          </tr>)
          })}
        </tbody>
        )}
      </table>
    </div>
  )
}

export default AllPos
