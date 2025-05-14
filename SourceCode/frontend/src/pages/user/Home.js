import React from 'react'
import './Home.css'
import Banner from '../../components/banner/Banner'
import About from '../../components/About/About'
import MenuPreview from '../../components/MenuPreview/MenuPreview'
import NewArrivals from '../../components/newArrivals/NewArrivals'
import Testimonials from '../../components/testimonials/Testimonials'
import ContactSection from '../../components/contactSection/ContactSection'
const Home = () => {

  return (
    <>
      <Banner />
      <About />
      <MenuPreview />
      <NewArrivals />
      <Testimonials />
      <ContactSection />
    </>
  )
}

export default Home