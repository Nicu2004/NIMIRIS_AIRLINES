import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AirportLogin = () => {
  const [codPersonal, setCodPersonal] = useState('');
  const [eroare, setEroare] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEroare('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/aeroport/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod: codPersonal })
      });

      if (response.ok) {
        localStorage.setItem('isAirportStaffLoggedIn', 'true');
        navigate('/airport-dashboard');
      } else {
        setEroare('Cod invalid sau acces interzis.');
      }
    } catch (error) {
      setEroare('Eroare de conexiune cu serverul aeroportului.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-8 bg-black/80 border border-green-500/30 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 border border-green-500/30 mb-4 text-3xl">
          🛂
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ghișeu Aeroport</h1>
        <p className="text-sm text-gray-400">Portal validare plăți Nimiris Terminal</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
        <div className="flex flex-col">
          <label className="text-xs text-green-400 uppercase tracking-wider mb-2">Cod Angajat Aeroport</label>
          <input 
            type="password" 
            placeholder="Ex: PORTA2026"
            value={codPersonal}
            onChange={(e) => setCodPersonal(e.target.value)}
            className="p-4 rounded-xl bg-black/60 text-white border border-white/10 focus:border-green-500 outline-none transition-all tracking-widest font-mono text-lg text-center"
          />
        </div>

        {eroare && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{eroare}</div>}

        <button type="submit" disabled={isLoading} className="w-full mt-2 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] h-[56px]">
          {isLoading ? 'Se verifică...' : 'Deschide Ghișeul'}
        </button>
      </form>
    </div>
  );
};

export default AirportLogin;