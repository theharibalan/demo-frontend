import React from 'react'

const ProductCard = ({name,product}) => {
  return (
    <div className='ProductCard-container'>
      <img src={product[1].CommonImage} alt="Dal Image Here " />
      <h4>{product[0].name}</h4>
      <h3>Description</h3>
      <table>
        <thead>
            <tr>
                <th>Product Type</th>
                <th>Product Cost Per Unit</th>
            </tr>
        </thead>
        <tbody>
            product[]
        </tbody>
      </table>
    </div>
  )
}

export default ProductCard
