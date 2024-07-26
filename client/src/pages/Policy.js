import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus" style={{ padding: '20px' }}>
        <div className="col-md-6">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%", borderRadius: '10px' }}
          />
        </div>
        <div className="col-md-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Privacy Policy</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            1. **Information Collection**: We collect personal information such as name, email address, and payment details when you register, place an order, or interact with our services.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            2. **Data Usage**: Your information is used to process orders, improve our services, and personalize your shopping experience.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            3. **Cookies**: We use cookies to enhance site functionality, analyze site usage, and assist in our marketing efforts.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            4. **Third-Party Sharing**: We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            5. **Security**: We implement robust security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            6. **User Rights**: You have the right to access, update, or delete your personal information. Contact us for any privacy-related requests.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            7. **Policy Updates**: We may update our privacy policy from time to time. Any changes will be posted on this page with the updated date.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
