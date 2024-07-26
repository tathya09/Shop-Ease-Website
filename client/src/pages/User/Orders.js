import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from 'axios';
import { useAuth } from "../../context/auth";
import moment from 'moment';
import { Rate, Modal, Input, Button } from "antd";
import toast from "react-hot-toast";
import './OrderPage.css'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const showRatingModal = (product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/rate-product`, {
        productId: currentProduct._id,
        rating,
        review,
      });
      if (data.success) {
        toast.success("Product rated successfully");
        setIsModalVisible(false);
        setRating(0);
        setReview("");
        getOrders(); 
      }
    } catch (error) {
      console.log(error);
      toast.error("Error rating product");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRating(0);
    setReview("");
  };

  return (
    <Layout title="Your Orders">
      <div className="container-fluid order-page">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Status</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Date</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Types of Product</th>
                  <th scope="col">Products</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order?.status}</td>
                    <td>{order?.buyer.name}</td>
                    <td>{moment(order?.createdAt).fromNow()}</td>
                    <td>{order?.payment.success ? "Success" : "Failed"}</td>
                    <td>{order?.products?.length}</td>
                    <td className="mt-0">
                      {order?.products?.map((product) => (
                        <div key={product._id} className="product-info" style={{ marginBottom: "0px",  }}>
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            className="product-img"
                          />
                          <div className="product-details">
                            <p>Name:-{product?.name}</p>
                            <p>About:-{product?.description?.substring(0, 30)}</p>
                            <p>Price: $ {product.price}</p>
                            <Rate
                              allowHalf
                              defaultValue={product.ratings}
                              onChange={(value) => setRating(value)}
                            />
                            <Button type="primary" onClick={() => showRatingModal(product)}>
                              Leave a Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal title="Rate and Review Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Rate allowHalf onChange={(value) => setRating(value)} value={rating} />
        <Input.TextArea
          rows={4}
          placeholder="Write your review here"
          onChange={(e) => setReview(e.target.value)}
          value={review}
        />
      </Modal>
    </Layout>
  );
};

export default Orders;