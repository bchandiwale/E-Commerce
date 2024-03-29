import React from "react";

const CartItem = ({ cartItem, cartKey, removeFromCart }) => {
  const { product, amount } = cartItem;

  return (
    <div className="column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="https://bulma.io/images/placeholders/128x128.png"
                alt={product.shortDesc}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">${product.price}</span>
            </b>
            <div>{product.shortDesc}</div>
            <small>{`${amount} in cart`}</small>
          </div>
          <div className="media-right" onClick={() => removeFromCart(cartKey)}>
            <button className="delete is-large"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
