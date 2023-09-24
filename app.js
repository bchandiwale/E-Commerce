import React, { useState, useEffect, useContext, useRef } from "react";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';

import Context from "./Context";

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const routerRef = useRef();

  useEffect(() => {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");

    axios.get('http://localhost:3001/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));

    user = user ? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};

    setUser(user);
    setCart(cart);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:3001/login',
      { email, password },
    ).catch((res) => {
      return { status: 401, message: 'Unauthorized' }
    })

    if(res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken)
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === 'admin@example.com' ? 0 : 1
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  const logout = e => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
  };

  const addProduct = (product, callback) => {
    let newProducts = [...products, product];
    setProducts(newProducts);
    if (callback) callback();
  };

  const addToCart = cartItem => {
    let newCart = { ...cart };
    if (newCart[cartItem.id]) {
      newCart[cartItem.id].amount += cartItem.amount;
    } else {
      newCart[cartItem.id] = cartItem;
    }
    if (newCart[cartItem.id].amount > newCart[cartItem.id].product.stock) {
      newCart[cartItem.id].amount = newCart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const removeFromCart = cartItemId => {
    let newCart = { ...cart };
    delete newCart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart({});
  };

  const checkout = () => {
    if (!user) {
      routerRef.current.history.push("/login");
      return;
    }

    const newCart = { ...cart };

    const newProducts = products.map(p => {
      if (newCart[p.name]) {
        p.stock = p.stock - newCart[p.name].amount;

        axios.put(
          `http://localhost:3001/products/${p.id}`,
          { ...p },
        )
      }
      return p;
    });

    setProducts(newProducts);
    clearCart();
  };

  return (
    <Context.Provider
      value={{
        user,
        cart,
        products,
        removeFromCart,
        addToCart,
        login,
        addProduct,
        clearCart,
        checkout
      }}
    >
      <Router ref={routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">ecommerce</b>
              <label
                role="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
            <div className={`navbar-menu ${showMenu ? "is-active" : ""}`}>
              <Link to="/products" className="navbar-item">
                Products
              </Link>
              {user && user.accessLevel < 1 && (
                <Link to="/add-product" className="navbar-item">
                  Add Product
                </Link>
              )}
              <Link to="/cart" className="navbar-item">
                Cart
                <span
                  className="tag is-primary"
                  style={{ marginLeft: "5px" }}
                >
                  { Object.keys(cart).length }
                </span>
              </Link>
              {!user ? (
                <Link to="/login" className="navbar-item">
                  Login
                </Link>
              ) : (
                <Link to="/" onClick={logout} className="navbar-item">
                  Logout
                </Link>
              )}
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </Router>
    </Context.Provider>
  );
}
