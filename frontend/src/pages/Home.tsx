import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Specialties from '../components/Specialties';
import Testimonials from '../components/Testimonials';
import BookingInfo from '../components/BookingInfo';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Specialties />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
