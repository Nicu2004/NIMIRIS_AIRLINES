import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();
  
  // Stările pentru datele din baza de date
  const [zboruri, setZboruri] = useState([]);
  const [orase, setOrase] = useState([]);
  const [avioane, setAvioane] = useState([]);
  
  const [pretSugerat, setPretSugerat] = useState(0);

  // Starea formularului
  const [formZbor, setFormZbor] = useState({
    orasPlecareId: '', 
    orasDestinatieId: '', 
    oraZborului: '', 
    modelAvionId: '',
    pretEconomy: 0, 
    pretBusiness: 0, 
    pretFirst: 0
  });

 // În StaffDashboard.jsx, în interiorul funcției fetchDateInitiale:
  const fetchDateInitiale = async () => {
    
    // 1. Luăm orașele (rămâne la fel)
    fetch('http://localhost:8080/api/orase').then(r => r.json()).then(setOrase).catch(console.error);
    
    // 2. Luăm avioanele (rămâne la fel)
    fetch('http://localhost:8080/api/avioane').then(r => r.json()).then(setAvioane).catch(console.error);

    // 3. MODIFICAT: Luăm DOAR zborurile companiei curente
    const companieId = localStorage.getItem('companieId');
    if (companieId) {
      fetch(`http://localhost:8080/api/zboruri/companie/${companieId}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Eroare HTTP la filtrarea zborurilor');
        })
        .then(data => setZboruri(data))
        .catch(err => console.error("Eroare la preluarea zborurilor filtrate:", err));
    } else {
      console.warn("Nu s-a găsit niciun ID de companie în localStorage. Re-loghează-te!");
    }
  };

  useEffect(() => {
    fetchDateInitiale();
  }, []);


  useEffect(() => {
    const fetchPretSugerat = async () => {
      // Dacă angajatul a ales plecarea, destinația și avionul, cerem prețul de la Java
      if (formZbor.orasPlecareId && formZbor.orasDestinatieId && formZbor.modelAvionId) {
        try {
          const response = await fetch('http://localhost:8080/api/zboruri/admin/sugestie-pret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orasPlecareId: formZbor.orasPlecareId,
              orasDestinatieId: formZbor.orasDestinatieId,
              modelAvionId: formZbor.modelAvionId
            })
          });
          
          if (response.ok) {
            const cost = await response.json();
            setPretSugerat(cost);
            
            // Auto-completăm formularul cu prețurile sugerate (rotunjite)
            setFormZbor(prev => ({
                ...prev,
                pretEconomy: cost,
                pretBusiness: Math.round(cost * 2.5), // Business mai scump
                pretFirst: Math.round(cost * 5.0)     // First class premium
            }));
          }
        } catch (error) {
          console.error("Eroare preț sugerat:", error);
        }
      }
    };

    fetchPretSugerat();
  }, [formZbor.orasPlecareId, formZbor.orasDestinatieId, formZbor.modelAvionId]);



  const handleAdaugaZbor = async (e) => {
    e.preventDefault();

    if (formZbor.orasPlecareId === formZbor.orasDestinatieId) {
      alert("Orașul de plecare nu poate fi același cu destinația!");
      return;
    }

    try {

      const payload = {
        orasPlecare: { id: formZbor.orasPlecareId },
        orasDestinatie: { id: formZbor.orasDestinatieId },
        oraZborului: formZbor.oraZborului + ":00",
        modelAvion: { id: formZbor.modelAvionId },
        companieAeriana: { id: parseInt(localStorage.getItem('companieId')) || 1 },
        pret_economy: formZbor.pretEconomy || 0,
        pret_business: formZbor.pretBusiness || 0,
        pret_first_class: formZbor.pretFirst || 0,
        tipZbor: "REGULAT"
      };
      const response = await fetch('http://localhost:8080/api/zboruri/admin/adauga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Zborul a fost adăugat în flotă!");
        fetchDateInitiale();
        setFormZbor({
          orasPlecareId: '', orasDestinatieId: '', oraZborului: '', modelAvionId: '',
          pretEconomy: 0, pretBusiness: 0, pretFirst: 0
        });
        setPretSugerat(0);
      } else {
        alert("A apărut o eroare la salvarea zborului.");
      }
    } catch (err) { console.error(err); }
  };

  const handleModificaOra = async (zborId) => {
    const oraNoua = prompt("Introdu noua oră de zbor (HH:mm):");
    if (!oraNoua) return;

    try {
      const response = await fetch(`http://localhost:8080/api/zboruri/admin/${zborId}/modifica-ora`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oraZborului: oraNoua })
      });
      if (response.ok) {
        alert("Ora a fost modificată!");
        fetchDateInitiale();
      }
    } catch (err) { console.error(err); }
  };

  const handleStergeZbor = async (zborId) => {
    if (!window.confirm("Ești sigur? Această acțiune va șterge ireversibil zborul și TOATE rezervările făcute pentru el!")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/zboruri/admin/${zborId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert("Zbor anulat și rezervări șterse!");
        fetchDateInitiale();
      }
    } catch (err) { console.error(err); }
  };


  const handleLogout = () => {
    localStorage.removeItem('isStaffLoggedIn');
    navigate('/personal-login');
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 pb-32">
      
    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-4xl font-bold text-white">
          🛠️ Dashboard Staff - <span className="text-blue-400">{localStorage.getItem('companieNume') || 'Nimiris'}</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 rounded-xl transition-all"
        >
          Deconectare
        </button>
      </div>
      
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-12 shadow-lg backdrop-blur-md">
        <h2 className="text-2xl text-blue-400 mb-6 font-bold">Adaugă Zbor Nou</h2>
        
        <form onSubmit={handleAdaugaZbor} className="flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Oraș Plecare</label>
              <select 
                required
                value={formZbor.orasPlecareId}
                onChange={(e) => setFormZbor(prev => ({ ...prev, orasPlecareId: e.target.value }))}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              >
                <option value="">-- Alege plecarea --</option>
                {orase.map(o => <option key={o.id} value={o.id}>{o.numeOras}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Oraș Destinație</label>
              <select 
                required
                value={formZbor.orasDestinatieId}
                onChange={(e) => setFormZbor(prev => ({ ...prev, orasDestinatieId: e.target.value }))}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              >
                <option value="">-- Alege destinația --</option>
                {orase.map(o => <option key={o.id} value={o.id}>{o.numeOras}</option>)}
              </select>
            </div>
          </div>

          {/* RÂNDUL 2: Avion și Oră */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/10 pb-6">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Model Avion</label>
              <select 
                required
                value={formZbor.modelAvionId}
                onChange={(e) => setFormZbor(prev => ({ ...prev, modelAvionId: e.target.value }))}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              >
                <option value="">-- Alege aeronava --</option>
                {avioane.map(a => <option key={a.id} value={a.id}>{a.numeModel} ({a.totalLocuri} locuri)</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Ora Zborului (HH:mm)</label>
              <input 
                type="time" 
                required
                value={formZbor.oraZborului}
                onChange={(e) => setFormZbor(prev => ({ ...prev, oraZborului: e.target.value }))}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* RÂNDUL 3: Prețuri */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-400">Preț sugerat de sistem pentru acest traseu: <b className="text-blue-400 text-xl">{pretSugerat} €</b></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Preț Economy (€)</label>
              <input 
                type="number" min="0" required
                value={formZbor.pretEconomy}
                onChange={(e) => setFormZbor(prev => ({ ...prev, pretEconomy: parseFloat(e.target.value) || 0 }))}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Preț Business (€)</label>
              <input 
                type="number" min="0" required
                value={formZbor.pretBusiness}
                onChange={(e) => setFormZbor(prev => ({ ...prev, pretBusiness: parseFloat(e.target.value) || 0 }))}
                className="p-3 rounded-xl bg-black/40 text-blue-300 border border-blue-500/30 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2">Preț First Class (€)</label>
              <input 
                type="number" min="0" required
                value={formZbor.pretFirst}
                onChange={(e) => setFormZbor(prev => ({ ...prev, pretFirst: parseFloat(e.target.value) || 0 }))}
                className="p-3 rounded-xl bg-black/40 text-yellow-500 border border-yellow-500/30 focus:border-yellow-500 outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            ➕ Adaugă Zborul în Baza de Date
          </button>
        </form>
      </div>

      {/* SECȚIUNEA DE MANAGEMENT (TABELUL) */}
      <h2 className="text-2xl text-white mb-6 font-bold">Zboruri Active în Flotă</h2>
      {zboruri.length === 0 ? (
        <div className="text-center p-8 border border-white/10 rounded-xl bg-white/5 text-gray-400">
          Nu există zboruri în baza de date. Adaugă unul folosind formularul de mai sus.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {zboruri.map(zbor => (
            <div key={zbor.id} className="bg-black/40 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/5 transition-all">
              <div className="text-white flex items-center gap-4">
                <span className="font-black text-2xl text-blue-500">{zbor.codCursa}</span> 
                <div className="flex flex-col">
                  <span>{zbor.orasPlecare?.numeOras} → {zbor.orasDestinatie?.numeOras}</span>
                  <span className="text-sm text-gray-400">Avion: {zbor.modelAvion?.numeModel}</span>
                </div>
                <span className="ml-4 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-mono">
                  🕒 {zbor.oraZborului ? zbor.oraZborului.substring(0, 5) : '--:--'}
                </span>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => handleModificaOra(zbor.id)}
                  className="flex-1 px-4 py-2 bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 rounded-lg hover:bg-yellow-600 hover:text-white transition-all"
                >
                  Modifică Ora
                </button>
                <button 
                  onClick={() => handleStergeZbor(zbor.id)}
                  className="flex-1 px-4 py-2 bg-red-600/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                >
                  Anulează Zbor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;