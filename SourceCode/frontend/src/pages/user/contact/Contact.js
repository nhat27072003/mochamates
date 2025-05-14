import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-section home-section">
      <div className="container">
        <h1 className="home-title text-center py-3 text-white">Contact Us</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="contact-info">
              <h2 className="contact-subtitle">Get in Touch</h2>
              <p className="contact-text">
                <i className="bi bi-geo-alt me-2"></i> 123 Coffee Street, Ho Chi Minh City, Vietnam
              </p>
              <p className="contact-text">
                <i className="bi bi-envelope me-2"></i> info@mochamates.com
              </p>
              <p className="contact-text">
                <i className="bi bi-telephone me-2"></i> +84 123 456 789
              </p>
              <p className="contact-text">
                <i className="bi bi-clock me-2"></i> Mon-Fri: 8:00 AM - 6:00 PM
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <form className="contact-form">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Your Email</label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea className="form-control" id="message" rows="4" placeholder="Your message" required></textarea>
              </div>
              <button type="submit" className="btn btn-custom">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;