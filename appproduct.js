import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from 'axios';

const AddProduct = ({ context }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [flash, setFlash] = useState(null);

  const save = async (e) => {
    e.preventDefault();

    if (name && price) {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);

      await axios.post(
        'http://localhost:3001/products',
        { id, name, price, stock, shortDesc, description },
      )

      context.addProduct(
        {
          name,
          price,
          shortDesc,
          description,
          stock: stock || 0
        },
        () => {
          setName("");
          setPrice("");
          setStock("");
          setShortDesc("");
          setDescription("");
          setFlash({ status: 'is-success', msg: 'Product created successfully' });
        }
      );
    } else {
      setFlash({ status: 'is-danger', msg: 'Please enter name and price' });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "shortDesc":
        setShortDesc(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }

    setFlash(null);
  };

  const { user } = context;

  return !(user && user.accessLevel < 1) ? (
    <Navigate to="/" />
  ) : (
    <>
      <div className="hero is-primary ">
        <div className="hero-body container">
          <h4 className="title">Add Product</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={save}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Product Name: </label>
              <input
                className="input"
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Price: </label>
              <input
                className="input"
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Available in Stock: </label>
              <input
                className="input"
                type="number"
                name="stock"
                value={stock}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Short Description: </label>
              <input
                className="input"
                type="text"
                name="shortDesc"
                value={shortDesc}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Description: </label>
              <textarea
                className="textarea"
                type="text"
                rows="2"
                style={{ resize: "none" }}
                name="description"
                value={description}
                onChange={handleChange}
              />
            </div>
            {flash && (
              <div className={`notification ${flash.status}`}>
                {flash.msg}
              </div>
            )}
            <div className="field is-clearfix">
              <button
                className="button is-primary is-outlined is-pulled-right"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
