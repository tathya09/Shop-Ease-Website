import React from 'react'
import Layout from "./../components/Layout/Layout";
import { useSearch } from '../context/Search'; 
import toast from "react-hot-toast";
import { useCart } from "../context/Cart";
import "../styles/CategoryProductStyles.css";
import {useNavigate} from 'react-router-dom'
const Search = () => {
    const [values,setValues]=useSearch()
    const [cart,setCart]=useCart();
    const navigate = useNavigate();
  return (
    <Layout title={'Search results'}>
        <div className="container">
        <div className="text-center">
          <h1>
            Search Results
          </h1>
            <h6>
                {values?.results.length<1 ? "No products Found" :`Found ${values?.results.length}`}
            </h6>
            <div className="d-flex flex-wrap mt-4">
        {values?.results.map((p) => (
               
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0,30)}...</p>
                    <p className="card-text">$ {p.price}</p>
                    <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button  class="btn btn-secondary ms-1" onClick={()=>{
  setCart([...cart,p]);
  localStorage.setItem('cart',JSON.stringify([...cart,p]))
toast.success("Item added to cart")
}



}>Add to cart</button>
                  </div>
                </div>
            
            ))}
        </div>

        </div>
        
        </div>
    </Layout>
   
  )
}

export default Search