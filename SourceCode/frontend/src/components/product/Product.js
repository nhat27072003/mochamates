import React from 'react'

const Product = () => {
  return (
    <div class="container py-5">
      <h2 class="text-center mb-4">Our Products</h2>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1598618826732-fb2fdf367775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw1fHxzbWFydHBob25lfGVufDB8MHx8fDE3MjEzMDU4NTZ8MA&ixlib=rb-4.0.3&q=80&w=1080" class="card-img-top" alt="Product 1" />
            <div class="card-body">
              <h5 class="card-title">Product 1</h5>
              <p class="card-text">A brief description of Product 1 and its features.</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">$19.99</span>
                <button class="btn btn-outline-primary"><i class="bi bi-cart-plus"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1720048171731-15b3d9d5473f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MXwxfHNlYXJjaHwxfHxzbWFydHBob25lfGVufDB8MHx8fDE3MjEzMDU4NTZ8MA&ixlib=rb-4.0.3&q=80&w=1080" class="card-img-top" alt="Product 2" />
            <div class="card-body">
              <h5 class="card-title">Product 2</h5>
              <p class="card-text">A brief description of Product 2 and its features.</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">$24.99</span>
                <button class="btn btn-outline-primary"><i class="bi bi-cart-plus"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1600087626120-062700394a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxzbWFydHBob25lfGVufDB8MHx8fDE3MjEzMDU4NTZ8MA&ixlib=rb-4.0.3&q=80&w=1080" class="card-img-top" alt="Product 3" />
            <div class="card-body">
              <h5 class="card-title">Product 3</h5>
              <p class="card-text">A brief description of Product 3 and its features.</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">$29.99</span>
                <button class="btn btn-outline-primary"><i class="bi bi-cart-plus"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1598965402089-897ce52e8355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxzbWFydHBob25lfGVufDB8MHx8fDE3MjEzMDU4NTZ8MA&ixlib=rb-4.0.3&q=80&w=1080" class="card-img-top" alt="Product 4" />
            <div class="card-body">
              <h5 class="card-title">Product 4</h5>
              <p class="card-text">A brief description of Product 4 and its features.</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 mb-0">$34.99</span>
                <button class="btn btn-outline-primary"><i class="bi bi-cart-plus"></i> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product