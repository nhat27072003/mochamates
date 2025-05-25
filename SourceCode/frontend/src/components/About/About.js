import React from 'react';

const About = () => {
  return (
    <section className="about-us py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="font-weight-bold mb-4 text-brown">About Mochamates</h2>
            <p className="text-muted mb-4">
              At Mochamates, we are passionate about crafting the perfect cup of coffee. From hand-picked beans to sustainable roasting, our journey began in Hanoi in 2018, aiming to bring authentic Vietnamese coffee to every home.
            </p>
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-green">Our Mission</h5>
                <ul className="list-unstyled">
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Quality Coffee Beans</li>
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Customer Delight</li>
                  <li><i className="bi bi-check-circle me-2 text-green"></i>Sustainable Sourcing</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5 className="text-green">Our Vision</h5>
                <ul className="list-unstyled">
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Global Coffee Culture</li>
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Coffee Excellence</li>
                  <li><i className="bi bi-bullseye me-2 text-green"></i>Community Connection</li>
                </ul>
              </div>
            </div>
            <a href="#" className="btn btn-custom mt-4">Discover Our Story</a>
          </div>
          <div className="col-md-6">
            <img
              src="/img/img_about.jpg"
              alt="Mochamates Coffee Shop"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center">
              <i className="bi bi-cup-straw fs-1 text-brown mb-2"></i>
              <h2 className="fw-bold">200+</h2>
              <p className="text-muted">Coffee Varieties</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center">
              <i className="bi bi-bag fs-1 text-brown mb-2"></i>
              <h2 className="fw-bold">5000+</h2>
              <p className="text-muted">Orders Served</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center">
              <i className="bi bi-star fs-1 text-brown mb-2"></i>
              <h2 className="fw-bold">100+</h2>
              <p className="text-muted">Positive Reviews</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-4">
            <div className="text-center">
              <i className="bi bi-geo-alt fs-1 text-brown mb-2"></i>
              <h2 className="fw-bold">10+</h2>
              <p className="text-muted">Cities Served</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;