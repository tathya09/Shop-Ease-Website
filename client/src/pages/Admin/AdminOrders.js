import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { Select } from "antd";
import './AOrderPage.css';

const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`, { status: value });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All users detail"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Status</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Date</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Products</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Select bordered={false} onChange={(value) => handleChange(order._id, value)} defaultValue={order?.status}>
                        {status.map((s, i) => (
                          <Option key={i} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </td>
                    <td>{order?.buyer.name}</td>
                    <td>{moment(order?.createdAt).fromNow()}</td>
                    <td>{order?.payment.success ? "Success" : "Failed"}</td>
                    <td>{order?.products?.length}</td>
                    <td>
                      {order?.products?.map((product) => (
                        <div key={product._id} className="product-info">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            alt={product.name}
                            className="product-img"
                          />
                          <div className="product-details">
                            <p>{product?.name}</p>
                            <p>{product?.description?.substring(0, 30)}</p>
                            <p>Price: $ {product.price}</p>
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
    </Layout>
  );
};

export default AdminOrders;
