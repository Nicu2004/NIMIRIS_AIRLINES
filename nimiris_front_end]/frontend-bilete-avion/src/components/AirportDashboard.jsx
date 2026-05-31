import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AirportDashboard = () => {
  const navigate = useNavigate();
  const [rezervari, setRezervari] = useState([]);

  const fetchRezervari = () => {

    fetch('http://localhost:8080/api/airport-staff/toate-rezervarile')
      .then(r => r.json())
      .then(setRezervari)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRezervari();
  }, []);

  const handleValideazaPlata = async (rezervareId) => {
    if (!window.confirm("Confirmi încasarea sumei la ghișeu?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/rezervari/admin/valideaza-plata/${rezervareId}`, { method: 'PUT' });
      if (response.ok) {
        alert("Plată validată! Biletul este activ.");
        fetchRezervari();
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAirportStaffLoggedIn');
    navigate('/aeroport/login');
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 pb-32 animate-fadeIn">
      <div className="flex justify-between items-center mb-8 border-b border-green-500/30 pb-4">
        <h1 className="text-4xl font-bold text-white">
          🛂 Terminal <span className="text-green-400">Departures</span>
        </h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 rounded-xl transition-all">
          Închide Ghișeul
        </button>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-green-900/20 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl text-green-400 font-bold">Pasageri în Așteptare & Plăți</h2>
          <span className="text-sm text-gray-400">Total înregistrări: {rezervari.length}</span>
        </div>
        
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
            <tr>
              <th className="p-4">Pasager</th>
              <th className="p-4">Zbor</th>
              <th className="p-4">Preț</th>
              <th className="p-4">Metoda</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Acțiune</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rezervari.map(rez => (
              <tr key={rez.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">
                  {rez.numePasager || rez.utilizator?.nume || 'Necunoscut'}
                  <div className="text-xs text-gray-400 font-normal">Tel: {rez.telefon || '-'}</div>
                </td>
                <td className="p-4">
                  <span className="text-blue-400 font-mono">{rez.zbor?.codCursa}</span>
                </td>
                <td className="p-4 font-bold">€{rez.pretFinal}</td>
                <td className="p-4">
                  {rez.metodaPlata === 'CARD' ? (
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">💳 CARD</span>
                  ) : (
                    <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">💵 CASH</span>
                  )}
                </td>
                <td className="p-4">
                  {(rez.platit || rez.isPlatit) ? (
                    <span className="text-green-400">✅ Achitat</span>
                  ) : (
                    <span className="text-red-400 animate-pulse">⚠️ Neachitat</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {rez.metodaPlata === 'CASH' && !(rez.platit || rez.isPlatit) ? (
                    <button onClick={() => handleValideazaPlata(rez.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-xl transition-all text-sm">
                      Validează
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">Validat Automat</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AirportDashboard;