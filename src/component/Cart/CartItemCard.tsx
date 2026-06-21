import React from 'react';
import './CartItemCard.css';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../types';

interface CartItemCardProps {
  item: CartItem;
  deleteCartItems: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt={item.name} />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <button
          className="removeBtn"
          onClick={() => deleteCartItems(item.product)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
