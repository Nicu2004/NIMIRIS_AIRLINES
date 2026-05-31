import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FlightSearch from './components/FlightSearch';
import FlightResults from './components/FlightResults';
import PassengerDetails from './components/PassengerDetails';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Rezervari from './components/Rezervari';
import AirportDashboard from './components/AirportDashboard'
import AirportLogin from './components/AirportLogin'

import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  return (
    <Router>
      <div className="min-h-screen bg-darkBg relative overflow-hidden font-sans text-white">

       <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="z-10 w-full min-h-screen flex items-center justify-center p-4">
          <Routes>
            <Route path="/airport-dashboard" element={<AirportDashboard />} />
            <Route path="/aeroport/login" element={<AirportLogin/>}/>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/rezultate" element={<FlightResults isLoggedIn={isLoggedIn} />} />
            <Route path="/detalii-pasageri" element={<PassengerDetails userId={userId} />} />
            <Route 
              path="/login" 
              element={<Auth setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} 
            />
            <Route path="/rezervarile-mele" element={<Rezervari />} />
            <Route path="/personal-login" element={<StaffLogin />} />
            <Route path="/personal-dashboard" element={<StaffDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;