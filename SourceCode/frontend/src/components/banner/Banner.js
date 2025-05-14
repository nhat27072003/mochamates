import React from 'react'
import './Banner.css'
const Banner = () => {
  return (
    <div id="carouselExampleIndicators" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src='/img/banner1.jpg' class="d-block w-100" alt="..." />
          <div class="carousel-caption d-none d-md-block">

            <h4>Tận hưởng hương vị nguyên bản từ những hạt cà phê thượng hạng</h4>
          </div>
        </div>
        <div class="carousel-item">
          <img src='/img/banner2.jpg' class="d-block w-100" alt="..." />
          <div class="carousel-caption d-none d-md-block">
            <h4>Từng giọt latte - Tác phẩm nghệ thuật cho bạn</h4>
          </div>
        </div>
        <div class="carousel-item">
          <img src="/img/banner3.jpg" class="d-block w-100" alt="..." />
          <div class="carousel-caption d-none d-md-block">
            <h4>Thư giãn cùng cà phê tại không gian của bạn</h4>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Banner