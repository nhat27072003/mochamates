import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import UserLayout from '../layouts/UserLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyOTP from '../pages/auth/VerifyOTP'
import Home from '../pages/user/Home'
import ProductList from '../pages/user/productList/ProductList'
import SearchPage from '../pages/user/searchPage/SearchPage'
import PackCoffeePage from '../pages/user/categories/PackageCoffeePage'
import ReadyCoffeePage from '../pages/user/categories/ReadyCoffeePage'
import GroundCoffeePage from '../pages/user/categories/GroundCoffeePage'
import Contact from '../pages/user/contact/Contact'
import About from '../pages/user/about/About'

import adminRoutes from './adminRoutes'
import PrivateRoute from './PrivateRoute'

export const AppRouter = () => {
  const user = useSelector((state) => state.user.currentUser)
  console.log('check user redux', user)
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth routes */}
        <Route path="/signin" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* User layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="package-coffee" element={<PackCoffeePage />} />
          <Route path="ready-coffee" element={<ReadyCoffeePage />} />
          <Route path="ground-coffee" element={<GroundCoffeePage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route
          element={
            <PrivateRoute
              isAuthenticated={!!user}
              allowedRoles={['ADMIN']} // Chỉ cho phép vai trò ADMIN
            />
          }
        >
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((childRoute, childIndex) => (
                <Route
                  key={childIndex}
                  index={childRoute.index}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))}
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
