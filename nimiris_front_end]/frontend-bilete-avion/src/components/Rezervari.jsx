import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Rezervari = () => {
  const [rezervari, setRezervari] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const userId = localStorage.getItem('userId');
    
    if (!userId || userId === 'null') {
      navigate('/login');
      return;
    }

    const fetchRezervari = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/rezervari/user/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setRezervari(data);
        } else {
          setError("Nu am putut încărca rezervările.");
        }
      } catch (err) {
        console.error(err);
        setError("Eroare de conexiune la server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRezervari();
  }, [navigate]);

  if (isLoading) {
    return <div className="text-center text-blue-400 py-20 text-xl animate-pulse">Se încarcă rezervările tale...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-20 text-xl">{error}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-32 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Biletele Mele</h1>
        <span className="text-blue-400 font-medium">{rezervari.length} rezervări găsite</span>
      </div>

      {rezervari.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center backdrop-blur-md">
          <h2 className="text-2xl text-white mb-4">Nu ai nicio rezervare activă</h2>
          <p className="text-gray-400 mb-6">Se pare că nu ai planificat nicio călătorie încă.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Caută un zbor acum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rezervari.map((rezervare) => (
            <div 
              key={rezervare.id} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-colors"
            >
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center bg-blue-500/20 border border-blue-500/30 w-20 h-20 rounded-xl text-blue-400">
                  <span className="text-xs font-bold uppercase">Zbor</span>
                  <span className="text-xl font-black">{rezervare.zbor?.codCursa || 'N/A'}</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-white text-xl font-bold">
                    <span>{rezervare.zbor?.orasPlecare?.numeOras || 'Plecare'}</span>
                    <span className="text-blue-500">→</span>
                    <span>{rezervare.zbor?.orasDestinatie?.numeOras || 'Destinație'}</span>
                  </div>
                  <span className="text-gray-400 mt-1">
                    Plecare: <b className="text-white">{rezervare.zbor?.oraZborului?.substring(0, 5) || '--:--'}</b>
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 w-full md:px-8 border-t md:border-t-0 md:border-l md:border-r border-white/10 pt-4 md:pt-0">
                <span className="text-gray-400 text-sm">Titular: <b className="text-white">{rezervare.numePasager}</b></span>
                <span className="text-gray-400 text-sm">
                  Clasa: <b className={`uppercase ${
                    rezervare.clasa === 'FIRST' ? 'text-yellow-500' : 
                    rezervare.clasa === 'BUSINESS' ? 'text-blue-400' : 'text-gray-300'
                  }`}>{rezervare.clasa}</b>
                </span>
                <span className="text-gray-400 text-sm">Pasageri: <b className="text-white">{rezervare.numarPasageri}</b></span>
              </div>

              <div className="flex flex-col items-end w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                <span className="text-2xl font-bold text-white">{rezervare.pretFinal?.toFixed(2)} €</span>
                <div className="flex items-center gap-2 mt-2">
                  {rezervare.platit ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase">
                      Achitat ({rezervare.metodaPlata})
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase">
                      Plată la aeroport
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rezervari;