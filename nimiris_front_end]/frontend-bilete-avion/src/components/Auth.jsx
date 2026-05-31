import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setIsLoggedIn, setUserId }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', parola: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    
    const response = await fetch(`http://localhost:8080/api/auth${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const data = await response.json(); 
      
      const idUtilizator = data.id || data.userId; 
        console.log(idUtilizator);
      setUserId(idUtilizator);
      setIsLoggedIn(true);
      
      localStorage.setItem('userId', idUtilizator);
      localStorage.setItem('isLoggedIn', 'true');
      
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-glassBg border border-glassBorder rounded-3xl backdrop-blur-md">
      <h2 className="text-2xl text-white font-bold mb-6">{isLogin ? 'Login' : 'Înregistrare'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="p-3 rounded-lg bg-black/20 text-white border border-white/10" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="p-3 rounded-lg bg-black/20 text-white border border-white/10" type="password" placeholder="Parolă" onChange={(e) => setFormData({...formData, parola: e.target.value})} />
        <button className="py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors">
          {isLogin ? 'Intră în cont' : 'Creează cont'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-gray-400 underline">
        {isLogin ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Login'}
      </button>
    </div>
  );
};

export default Auth;