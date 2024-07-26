import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import { useCart } from "../context/Cart";
import { Rate } from "antd";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRating = async (productId, value) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/rate-product`, {
        productId,
        rating: value,
      });
      if (data.success) {
        toast.success("Product rated successfully");
        setProduct(data.product);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error rating product");
    }
  };

  const addToCart = () => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    toast.success("Item added to cart");
  };

  const handleQuantityChange = (value) => {
    if (value < 1) value = 1;
    setQuantity(value);
  };

  return (
    <Layout>
      <div className="container product-details">
        <div className="product-details-grid">
          <div className="product-image">
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
            />
          </div>
          <div className="product-details-info">
            <h1 className="text-center">Product Details</h1>
            <hr />
            <h6><span>Name :</span> {product.name}</h6>
            <h6><span>Description :</span> {product.description}</h6>
            <h5>
              Rating: <Rate allowHalf value={product.ratings} disabled />
            </h5>
            <h6>
              <span>Price :</span>
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h6>
            <h6><span>Category :</span> {product?.category?.name}</h6>

            <div className="quantity-selector">
              <button className="quantity-button" onClick={() => handleQuantityChange(quantity - 1)}>-</button>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="quantity-input"
              />
              <button className="quantity-button" onClick={() => handleQuantityChange(quantity + 1)}>+</button>
            </div>

            <button
              className="btn btn-secondary ms-1 mt-3"
              onClick={addToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success("Item added to cart");
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
