import React, { useEffect, useState } from 'react'
import "../../admin.css"
import axios from 'axios';

const PendingPos = () => {
const [data,setData]=useState([]);
const handleFetchPos = async() =>{
  
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/po/getAllPos`,{}).then(res=>{
            const completedPos = res.data.filter(item=>!item.poStatus)
            setData(completedPos)
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
        {data.length===0?(<h3>No Received POs yet</h3>):(
          <tbody>
          {data.map((item,index)=>{
            return(<tr key = {item.poId}>
              <td>{item.poId}</td>
              <td>{item.customerId}</td>
              <td>{item.quantity}</td>
              <td>{item.poStatus===1 ? (<p>Completed</p>):(<p>Pending</p>)}</td>
          </tr>)
          })}
        </tbody>
        )}
      </table>
    </div>
  )
}

export default PendingPos
