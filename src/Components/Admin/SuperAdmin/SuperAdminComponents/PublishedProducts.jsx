
// import { message, Modal } from 'antd'; // Import Modal for confirmation box
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const PublishedProducts = () => {
//   const [data, setData] = useState([]);
//   const [isremoving ,setisRemoving] = useState(false)
//   const url = `${process.env.REACT_APP_BACKEND_URL}/admin/getProducts`;

//   useEffect(() => {
//     axios.post(url, {})
//       .then(res => {
//         setData(res.data);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }, []);

//   const handleRemovePublish = (id) => {
//     setisRemoving(true)
//     axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteProduct/${id}`)
//       .then(res => {
//         message.success('Product Removed Successfully');
//         setData(prevData => prevData.filter(item => item.productId !== id)); // Remove item from UI after deletion
//         setisRemoving(false)
//       })
//       .catch(err => {
//         message.error('Failed to Remove Product');
//       });
//   };

//   const showConfirm = (id) => {
//     Modal.confirm({
//       title: 'Are you sure you want to delete this product?',
//       content: 'Once deleted, this action cannot be undone.',
//       okText: 'Yes',
//       okType: 'danger',
//       cancelText: 'No',
//       onOk() {
//         handleRemovePublish(id);
//       },
//     });
//   };

//   return (
//     <div className="order-tables">
//       <h2>All Published Products</h2>
//       <table className="table yellow-table">
//         <thead>
//           <tr>
//             <th>Product Id</th>
//             <th>Product Name</th>
//             {/* <th>Product Price</th> */}
//             <th>Date of Publish</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         {data.length === 0 ? (
//           <h3>No Products Published yet</h3>
//         ) : (
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={item.productId}>
//                 <td>{item.productId}</td>
//                 <td>{item.name}</td>
//                 {/* <td>{item.CostPerUnit.perUnit}</td> */}
//                 <td>{item.offerStartDate}</td>
//                 <td>
//                   <button className='button-7' disabled={isremoving} onClick={() => showConfirm(item.productId)}>{isremoving?"Removing":"Remove"}</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         )}
//       </table>
//     </div>
//   );
// };

// export default PublishedProducts;

import { message, Modal } from 'antd'; // Import Modal for confirmation box
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PublishedProducts = () => {
  const [data, setData] = useState([]);
  const [removingId, setRemovingId] = useState(null); // Track which product is being removed
  const url = `${process.env.REACT_APP_BACKEND_URL}/admin/getProducts`;

  useEffect(() => {
    axios.post(url, {})
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleRemovePublish = (id) => {
    setRemovingId(id); // Set the ID of the product being removed
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteProduct/${id}`)
      .then(res => {
        message.success('Product Removed Successfully');
        setData(prevData => prevData.filter(item => item.productId !== id)); // Remove item from UI after deletion
        setRemovingId(null); // Reset the removing ID
      })
      .catch(err => {
        message.error('Failed to Remove Product');
        setRemovingId(null); // Reset the removing ID in case of failure
      });
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'Once deleted, this action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRemovePublish(id);
      },
    });
  };

  return (
    <div className="order-tables">
      <h2>All Published Products</h2>
      <table className="table yellow-table">
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Product Name</th>
            <th>Date of Publish</th>
            <th>Action</th>
          </tr>
        </thead>
        {data.length === 0 ? (
          <h3>No Products Published yet</h3>
        ) : (
          <tbody>
            {data.map((item) => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>{item.name}</td>
                <td>{item.offerStartDate}</td>
                <td>
                  <button
                    className='button-7'
                    disabled={removingId === item.productId}
                    onClick={() => showConfirm(item.productId)}
                  >
                    {removingId === item.productId ? "Removing" : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default PublishedProducts;
