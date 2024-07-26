import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - ShopEase"}>
      <div className="row contactus" style={{ padding: '20px' }}>
        <div className="col-md-6">
          <img
            src="/images/about.jpeg"
            alt="about us"
            style={{ width: "100%", borderRadius: '10px' }}
          />
        </div>
        <div className="col-md-6" style={{ display: 'flex', alignItems: 'center' }}>
          <p className="text-justify mt-2" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333' }}>
            Welcome to ShopEase, where we transform your online shopping experience! Founded in 2024, our mission is to offer a seamless, enjoyable, and personalized journey for every shopper. We provide a diverse range of quality products, from fashion and electronics to home decor and beauty essentials. Our advanced algorithms personalize your shopping experience, making it efficient and tailored to your preferences.
            <br /><br />
            We partner with trusted sellers to ensure high standards of quality and reliability. Your security is our priority, using cutting-edge technology to protect your information and secure transactions. Our dedicated customer service team is always ready to assist you.
            <br /><br />
            At ShopEase, we value customer centricity, innovation, integrity, and community. Join us and explore a world of convenience, quality, and exceptional service. Happy shopping!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
