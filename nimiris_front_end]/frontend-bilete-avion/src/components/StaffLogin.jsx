import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [companii, setCompanii] = useState([]);
  const [companieSelectata, setCompanieSelectata] = useState('');
  const [codPersonal, setCodPersonal] = useState('');
  
  const [eroare, setEroare] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Preia companiile din baza de date la încărcarea paginii
  useEffect(() => {
    const fetchCompanii = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/companii');
        if (response.ok) {
          setCompanii(await response.json());
        }
      } catch (err) {
        console.error("Eroare la preluarea companiilor", err);
      }
    };
    fetchCompanii();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setEroare('');

    if (!companieSelectata) {
      setEroare('Te rugăm să selectezi compania aeriană.');
      return;
    }

    if (!codPersonal.trim()) {
      setEroare('Te rugăm să introduci codul de acces.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/personal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod: codPersonal })
      });

      if (response.ok) {
        // Salvăm permisiunea ȘI ID-ul companiei alese
        localStorage.setItem('isStaffLoggedIn', 'true');
        localStorage.setItem('companieId', companieSelectata);
        
        // Opțional: salvăm și numele pentru a-l afișa frumos în Dashboard
        const numeCompanie = companii.find(c => c.id.toString() === companieSelectata)?.nume;
        localStorage.setItem('companieNume', numeCompanie);

        navigate('/personal-dashboard');
      } else {
        setEroare('Cod personal invalid sau respins de server.');
      }
    } catch (error) {
      setEroare('Eroare de conexiune la server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-darkBg/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden mx-auto mt-20">
      
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 mb-4">
          <span className="text-2xl">🏢</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acces Personal</h1>
        <p className="text-sm text-gray-400">Autentificare rețea companii aeriene</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
        
        {/* NOU: Dropdown pentru Compania Aeriană */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Compania Aeriană</label>
          <select 
            value={companieSelectata}
            onChange={(e) => setCompanieSelectata(e.target.value)}
            className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 focus:bg-black/60 outline-none transition-all"
          >
            <option value="">-- Alege compania --</option>
            {companii.map(c => (
              <option key={c.id} value={c.id}>{c.nume} ({c.codIata})</option>
            ))}
          </select>
        </div>

        {/* INPUT: Cod Personal */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Cod Personal (ID Angajat)</label>
          <input 
            type="password" 
            placeholder="Ex: NIMIRIS2026"
            value={codPersonal}
            onChange={(e) => setCodPersonal(e.target.value)}
            className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 focus:bg-black/60 outline-none transition-all tracking-widest font-mono text-lg"
          />
        </div>

        {eroare && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {eroare}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 flex justify-center items-center h-[56px]"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Intră în Sistem'
          )}
        </button>

      </form>
    </div>
  );
};

export default StaffLogin;