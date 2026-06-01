import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PassengerDetails = ({ userId }) => {


const [promoCode, setPromoCode] = useState('');
const [discount, setDiscount] = useState(0);
const [promoStatus, setPromoStatus] = useState('');


const handleApplyPromo = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/zboruri/aplica-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cod: promoCode })
    });
    if (res.ok) {
      const data = await res.json();
      setDiscount(data); // data este procentul (ex: 0.20)
      setPromoStatus('Cod aplicat!');
    } else {
      setPromoStatus('Cod invalid.');
      setDiscount(0);
    }
  } catch (err) { console.error(err); }
};
  const location = useLocation();
  const navigate = useNavigate();

  const {
    pretTur = 150,
    pretRetur = 120,
    esteRetur = true,
    pretTotalFinal = null,
    discountAplicat = 0
  } = location.state || {};

  const [contact, setContact] = useState({ nume: '', telefon: '' });
  const [pasageri, setPasageri] = useState({ adulti: 1, copii: 0, seniori: 0 });
  const [optiuni, setOptiuni] = useState({ masa: false, bagaj: false });
  const [metodaPlata, setMetodaPlata] = useState('CARD');

  const totalPasageri = pasageri.adulti + pasageri.copii + pasageri.seniori;

  const calculeazaPret = () => {
    let pretBazaZboruri = pretTur + (esteRetur ? pretRetur : 0);
    let pretBazaTotal = pretBazaZboruri * totalPasageri;
    
    let discountPromo = pretBazaTotal * discount; // 'discount' este starea locală (0.20, 0.10 etc)
    
    let discountRetur = 0;
    if (esteRetur) {
        discountRetur = pretBazaTotal * 0.10;
    }

    let taxeExtra = 0;
    if (optiuni.masa) taxeExtra += pretBazaTotal * 0.05;
    if (optiuni.bagaj) taxeExtra += pretBazaTotal * 0.05;

    const totalFinal = pretBazaTotal - discountPromo - discountRetur + taxeExtra;

    return { pretBazaTotal, discountPromo, discountRetur, taxeExtra, totalFinal };
  };

  const { pretBazaTotal, discountPromo, discountRetur, taxeExtra, totalFinal } = calculeazaPret();

const handleFinalizare = async (e) => {
    e.preventDefault();
    
    if (!contact.nume || !contact.telefon || totalPasageri === 0) {
      alert("Te rugăm să completezi datele de contact și să adaugi cel puțin un pasager.");
      return;
    }

    const storedUserId = localStorage.getItem('userId');
    const esteLogat = storedUserId && storedUserId !== 'null';
    const endpointURL = esteLogat 
        ? 'http://localhost:8080/api/rezervari/creaza' 
        : 'http://localhost:8080/api/rezervari/creaza-fara-cont';

    const rezervariDeFacut = [];

    if (location.state?.rutaTur && Array.isArray(location.state.rutaTur)) {
      location.state.rutaTur.forEach(zbor => {
        rezervariDeFacut.push({
          zbor: zbor,
          clasa: location.state?.clasaTur
        });
      });
    }

    if (location.state?.esteRetur && location.state?.rutaRetur && Array.isArray(location.state.rutaRetur)) {
      location.state.rutaRetur.forEach(zbor => {
        rezervariDeFacut.push({
          zbor: zbor,
          clasa: location.state?.clasaRetur
        });
      });
    }

    if (rezervariDeFacut.length === 0) {
      alert("Eroare: Nu a fost selectat niciun zbor valid.");
      return;
    }

    try {
      const cereriRezervare = rezervariDeFacut.map(({ zbor, clasa }) => {
        const payload = {
          zborId: zbor.id?.toString(), 
          clasa: clasa,
          userId: esteLogat ? storedUserId : null,
          numePasager: contact.nume,
          telefon: contact.telefon,
          adulti: pasageri.adulti,
          copii: pasageri.copii,
          seniori: pasageri.seniori,
          numarPasageri: totalPasageri,
          areMasa: optiuni.masa,
          areBagaj: optiuni.bagaj,
          metodaPlata: metodaPlata,
          pretFinal: totalFinal / rezervariDeFacut.length, 
          codPromo: location.state?.codPromo || null,
          isPlatit: metodaPlata === 'CARD'
        };

        console.log(`Trimitem rezervare pentru segmentul [${zbor.id}] către:`, endpointURL);
        
        return fetch(endpointURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      });

      const responses = await Promise.all(cereriRezervare);

      const hasErrors = responses.some(res => !res.ok);

      if (!hasErrors) {
        alert(`Rezervările pentru cele ${rezervariDeFacut.length} segmente de zbor au fost finalizate cu succes!`);
        navigate('/'); 
      } else {
        alert("Unele segmente de zbor nu au putut fi rezervate. Verifică sistemul!");
      }

    } catch (error) {
      console.error("Eroare la trimiterea cererilor:", error);
      alert("A apărut o eroare de conexiune la salvarea rezervărilor.");
    }
  };

  const actualizeazaPasageri = (tip, valoare) => {
    const newVal = parseInt(valoare) || 0;
    if (newVal >= 0) {
      setPasageri({ ...pasageri, [tip]: newVal });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pb-12">
      
      <div className="flex-1 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8">Detalii Pasageri și Opțiuni</h2>
        
        <form onSubmit={handleFinalizare} className="flex flex-col gap-8">
          
          <section>
            <h3 className="text-xl text-blue-400 mb-4 border-b border-white/10 pb-2">1. Date de Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Nume și Prenume" required
                value={contact.nume} onChange={(e) => setContact({ ...contact, nume: e.target.value })}
                className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              />
              <input 
                type="tel" placeholder="Număr de Telefon" required
                value={contact.telefon} onChange={(e) => setContact({ ...contact, telefon: e.target.value })}
                className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none"
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl text-blue-400 mb-4 border-b border-white/10 pb-2">2. Categorie Pasageri</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Adulți (18-64)</label>
                <input type="number" min="0" value={pasageri.adulti} onChange={(e) => actualizeazaPasageri('adulti', e.target.value)}
                  className="p-4 rounded-xl bg-black/40 text-white border border-white/10 text-center" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Copii (2-17)</label>
                <input type="number" min="0" value={pasageri.copii} onChange={(e) => actualizeazaPasageri('copii', e.target.value)}
                  className="p-4 rounded-xl bg-black/40 text-white border border-white/10 text-center" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Seniori (65+)</label>
                <input type="number" min="0" value={pasageri.seniori} onChange={(e) => actualizeazaPasageri('seniori', e.target.value)}
                  className="p-4 rounded-xl bg-black/40 text-white border border-white/10 text-center" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl text-blue-400 mb-4 border-b border-white/10 pb-2">3. Servicii Suplimentare</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={optiuni.masa} onChange={(e) => setOptiuni({ ...optiuni, masa: e.target.checked })} className="w-5 h-5 accent-blue-600" />
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Masă Inclusă în timpul zborului</span>
                  <span className="text-xs text-gray-400">+5% din valoarea biletelor</span>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={optiuni.bagaj} onChange={(e) => setOptiuni({ ...optiuni, bagaj: e.target.checked })} className="w-5 h-5 accent-blue-600" />
                <div className="flex flex-col">
                  <span className="text-white font-semibold">Spațiu de Bagaj Suplimentar (Cala)</span>
                  <span className="text-xs text-gray-400">+5% din valoarea biletelor</span>
                </div>
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-xl text-blue-400 mb-4 border-b border-white/10 pb-2">4. Metoda de Plată</h3>
            <select value={metodaPlata} onChange={(e) => setMetodaPlata(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none">
              <option value="CARD">Plată Online (Card) - Confirmare instantă</option>
              <option value="CASH">Plată Cash - La aeroport</option>
            </select>
          </section>

        </form>
      </div>

      <div className="w-full lg:w-96">
        <div className="sticky top-8 bg-darkBg border border-blue-500/30 p-6 rounded-3xl shadow-[0_0_30px_rgba(37,99,235,0.15)]">
          <h3 className="text-2xl font-bold text-white mb-6">Sumar Rezervare</h3>
          
          <div className="flex flex-col gap-4 text-sm mb-6 border-b border-white/10 pb-6">
           <div className="flex flex-col gap-3 mb-6 border-b border-white/10 pb-6">
              <div className="flex gap-2">
                  <input 
                      type="text" 
                      placeholder="Cod promoțional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/10 outline-none"
                  />
                  <button onClick={handleApplyPromo} className="px-4 bg-blue-600 rounded-xl text-white font-bold">Aplică</button>
              </div>
              {promoStatus && <span className={`text-xs ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>{promoStatus}</span>}
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
                <span>Reducere Promo ({discount * 100}%):</span>
                <span>-{discountPromo.toFixed(2)} €</span>
            </div>
        )}
            
            <div className="flex justify-between text-gray-300">
              <span>Preț Bază ({totalPasageri} pers):</span>
              <span className="text-white">{pretBazaTotal.toFixed(2)} €</span>
            </div>

            {esteRetur && (
              <div className="flex justify-between text-green-400">
                <span>Discount Tur-Retur (10%):</span>
                <span>-{discount.toFixed(2)} €</span>
              </div>
            )}

            {taxeExtra > 0 && (
              <div className="flex justify-between text-yellow-500">
                <span>Taxe Servicii (Masa/Bagaj):</span>
                <span>+{taxeExtra.toFixed(2)} €</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mb-8">
            <span className="text-gray-400">Total de Plată:</span>
            <span className="text-3xl font-bold text-white">{totalFinal.toFixed(2)} €</span>
          </div>

          <button 
            onClick={handleFinalizare}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Finalizează Rezervarea
          </button>
        </div>
      </div>

    </div>
  );
};

export default PassengerDetails;