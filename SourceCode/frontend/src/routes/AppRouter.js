import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from '../layouts/UserLayout'
import Home from '../pages/user/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ProductList from '../pages/user/productList/ProductList'
import SearchPage from '../pages/user/searchPage/SearchPage'
import PackCoffeePage from '../pages/user/categories/PackageCoffeePage'
import ReadyCoffeePage from '../pages/user/categories/ReadyCoffeePage'
import GroundCoffeePage from '../pages/user/categories/GroundCoffeePage'
import Contact from '../pages/user/contact/Contact'
import About from '../pages/user/about/About'
import VerifyOTP from '../pages/auth/VerifyOTP'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/package-coffee' element={<PackCoffeePage />} />
          <Route path='/ready-coffee' element={<ReadyCoffeePage />} />
          <Route path='/ground-coffee' element={<GroundCoffeePage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
