import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductCard = ({ grade, price, image, description }) => {
  return (
    <div style={styles.card}>
      <img src={image} alt={grade} style={styles.image} />
      <h2>{grade}</h2>
      <div>{description}</div>
      <p style={styles.price}>Price: ₹{price}</p>
      <button style={styles.button} onClick={() => alert(`Order placed for ${grade}`)}>
        Place Order
      </button>
    </div>
  );
};

const Cart = () => {
  const location = useLocation();
  const product = location.state;

  return (
    <div style={styles.container}>
      <h1>{product.name}</h1>
      <div style={styles.cardContainer}>
        {product.costPerUnit.map((item, index) => (
          <ProductCard
            key={index}
            grade={item.grade}
            price={item.PricePerUnit}
            image={item.Image}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  },
  price: {
    fontWeight: 'bold',
    marginTop: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Cart;
