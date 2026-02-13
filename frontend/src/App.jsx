import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ServicesPage from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Header from './components/Header'
import Footer from './components/Footer'
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import Signup from './pages/Signup'
import Login from './pages/Signin'
import AdminCreateService from './pages/AdminCreateService'


export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
             <Route path="/signup" element={<Signup />} />
             <Route path="/login" element={<Login />} />
             <Route path="/admin/create-service" element={<AdminCreateService />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
