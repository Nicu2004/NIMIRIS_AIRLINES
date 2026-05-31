import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchableDropdown = ({ label, placeholder, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col relative w-full">
      <label className="text-sm text-gray-300 mb-2 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
        className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors w-full"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 top-full mt-2 w-full bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-52 overflow-y-auto custom-scrollbar">
          {filteredOptions.map((opt, idx) => (
            <li 
              key={idx}
              onClick={() => {
                onChange(opt);
                setSearchTerm(opt);
                setIsOpen(false);
              }}
              className="p-4 hover:bg-blue-600/40 cursor-pointer text-white border-b border-white/5 last:border-0 transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FlightSearch = () => {
  const navigate = useNavigate();
  
  const [oraseDisponibile, setOraseDisponibile] = useState([]);

  const [plecare, setPlecare] = useState('');
  const [destinatie, setDestinatie] = useState('');
  const [dataPlecare, setDataPlecare] = useState('');
  const [numarPersoane, setNumarPersoane] = useState(1);
  
  const [esteRetur, setEsteRetur] = useState(false);
  const [dataRetur, setDataRetur] = useState('');


  useEffect(() => {
    const fetchOrase = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orase');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0 && typeof data[0] === 'object') {

            setOraseDisponibile(data.map(oras => oras.numeOras || oras.nume));
          } else {

            setOraseDisponibile(data);
          }
        }
      } catch (error) {
        console.error("Eroare la preluarea orașelor:", error);
      }
    };

    fetchOrase();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!plecare || !destinatie || !dataPlecare || !numarPersoane) {
      alert("Te rugăm să completezi toate câmpurile obligatorii pentru zborul tur!");
      return;
    }
    if (esteRetur && !dataRetur) {
      alert("Ai selectat opțiunea de retur. Te rugăm să introduci și data de retur!");
      return;
    }
    if (plecare.toLowerCase() === destinatie.toLowerCase()) {
      alert("Orașul de plecare nu poate fi același cu cel de destinație!");
      return;
    }

    let queryParams = `/rezultate?plecare=${plecare}&destinatie=${destinatie}&dataPlecare=${dataPlecare}&pasageri=${numarPersoane}&retur=${esteRetur}`;
    if (esteRetur) queryParams += `&dataRetur=${dataRetur}`;

    navigate(queryParams);
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Caută Zborul Tău</h1>
        <p className="text-gray-400">Descoperă lumea cu Nimiris Airlines. Fără cont necesar.</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableDropdown 
            label="Din (Plecare)" 
            placeholder="Ex: București"
            value={plecare}
            onChange={setPlecare}
            options={oraseDisponibile}
          />
          <SearchableDropdown 
            label="Către (Destinație)" 
            placeholder="Ex: Paris"
            value={destinatie}
            onChange={setDestinatie}
            options={oraseDisponibile}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Data Tur</label>
            <input 
              type="date" 
              value={dataPlecare}
              onChange={(e) => setDataPlecare(e.target.value)}
              className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors [color-scheme:dark]"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-2 uppercase tracking-wider">Număr Persoane</label>
            <input 
              type="number" 
              min="1" max="9"
              value={numarPersoane}
              onChange={(e) => setNumarPersoane(parseInt(e.target.value))}
              className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center h-[58px] px-4 bg-black/20 rounded-xl border border-white/5">
            <label className="flex items-center cursor-pointer gap-3 w-full">
              <input 
                type="checkbox" 
                checked={esteRetur}
                onChange={(e) => {
                  setEsteRetur(e.target.checked);
                  if (!e.target.checked) setDataRetur('');
                }}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
              <span className="text-white font-semibold">Doresc zbor de Retur</span>
            </label>
          </div>
        </div>
        {esteRetur && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <div className="flex flex-col md:col-start-1">
              <label className="text-sm text-blue-300 mb-2 uppercase tracking-wider">Data Retur</label>
              <input 
                type="date" 
                value={dataRetur}
                min={dataPlecare} 
                onChange={(e) => setDataRetur(e.target.value)}
                className="p-4 rounded-xl bg-blue-900/20 text-white border border-blue-500/30 focus:border-blue-400 outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="md:col-span-2 flex items-center pt-8">
              <p className="text-sm text-gray-400 italic">
                * Zborul de retur va fi căutat automat pe ruta: <span className="text-white font-bold">{destinatie || 'Destinație'}</span> → <span className="text-white font-bold">{plecare || 'Plecare'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Buton Submit */}
        <div className="mt-4">
          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
          >
            Caută Zboruri
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/personal-login')} 
          className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
        >
          Acces Personal Aeroport
        </button>
      </div>
    </div>
  );
};

export default FlightSearch;