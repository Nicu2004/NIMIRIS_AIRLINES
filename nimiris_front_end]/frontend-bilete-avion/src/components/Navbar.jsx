import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');

    setIsLoggedIn(false);

    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <Link to="/" className="text-2xl font-bold text-white tracking-tighter hover:text-blue-400 transition-colors">
        NIMIRIS
      </Link>
      
      <div className="flex gap-6 text-white font-medium items-center">
        <Link to="/" className="hover:text-blue-400 transition-colors">Caută Zboruri</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/rezervarile-mele" className="hover:text-blue-400 transition-colors">Rezervările Mele</Link>
            <button 
              onClick={handleLogout} 
              className="text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;