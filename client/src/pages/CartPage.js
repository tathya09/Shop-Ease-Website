import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartPage.css"; // Import the CSS file

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * item.quantity; // Consider quantity here
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Total quantity
  const totalQuantity = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.quantity; // Sum of all quantities
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  };

  // Update item quantity
  const updateCartItemQuantity = (pid, amount) => {
    try {
      let myCart = cart.map((item) => {
        if (item._id === pid) {
          let newQuantity = item.quantity + amount;
          if (newQuantity <= 0) return null; // Remove item if quantity is 0 or less
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null); // Remove null items
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = cart.filter((item) => item._id !== pid);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${totalQuantity()} items in your cart ${auth?.token ? "" : "please login to checkout"}`
                : "Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="cart-items-container">
              {cart?.map((p) => (
                <div className="cart-item card flex-row" key={p._id}>
                  <div className="cart-item-image">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="cart-item-details">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p className="cart-item-price">Price: ${p.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        className="btn btn-secondary"
                        onClick={() => updateCartItemQuantity(p._id, -1)}
                        disabled={p.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{p.quantity}</span>
                      <button
                        className="btn btn-secondary"
                        onClick={() => updateCartItemQuantity(p._id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4 className="cart-total">Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
