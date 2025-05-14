import React from 'react';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <div className="contact-section home-section">
      <h2 className="home-title">Get in Touch</h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form className="contact-form">
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Your Email" required />
              </div>
              <div className="mb-3">
                <textarea className="form-control" placeholder="Your Message" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn btn-custom">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;