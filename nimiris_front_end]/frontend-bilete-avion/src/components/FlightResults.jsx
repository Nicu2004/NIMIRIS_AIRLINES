import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RouteCard = ({ ruta, tip, onSelect, selectedRoute }) => {
  const rutaArray = Array.isArray(ruta) ? ruta : [ruta];
  const isSelected = selectedRoute?.ruta?.[0]?.id === rutaArray[0]?.id;

  const primulZbor = rutaArray[0];
  const ultimulZbor = rutaArray[rutaArray.length - 1];

  const pretTotalEconomy = rutaArray.reduce((sum, zbor) => sum + (zbor.pret_economy || 0), 0);
  const pretTotalBusiness = rutaArray.reduce((sum, zbor) => sum + (zbor.pret_business || 0), 0);
  const pretTotalFirst = rutaArray.reduce((sum, zbor) => sum + (zbor.pret_first_class || 0), 0);

  const getLocuri = (ruta, campLocuri) => {
    let minim = 99999;
    let areDateDespreLocuri = false;
    
    ruta.forEach(zbor => {

      const locuri = zbor.disponibilitate ? zbor.disponibilitate[campLocuri] : null;
      if (locuri !== null && locuri !== undefined) {
        if (locuri < minim) minim = locuri;
        areDateDespreLocuri = true;
      }
    });
    
    return areDateDespreLocuri ? minim : 'N/A';
  };

  const locuriEconomy = getLocuri(rutaArray, 'locuriLibereEconomy');
  const locuriBusiness = getLocuri(rutaArray, 'locuriLibereBusiness');
  const locuriFirst = getLocuri(rutaArray, 'locuriLibereFirstClass');

  return (
    <div className={`w-full bg-white/5 border ${isSelected ? 'border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-white/10'} rounded-2xl p-6 mb-4 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col xl:flex-row justify-between items-center gap-6 cursor-default`}>
      
      <div className="flex flex-col min-w-[250px] w-full xl:w-auto">
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-white">{primulZbor.oraZborului?.substring(0, 5) || "N/A"}</span>
          <span className="text-sm text-blue-400 font-semibold mb-1">
            {rutaArray.length === 1 ? 'Zbor Direct' : `${rutaArray.length - 1} Escală(e)`}
          </span>
        </div>
        
        <div className="text-sm text-gray-300 mt-2 flex flex-wrap items-center gap-2">
          {rutaArray.map((zbor, index) => (
            <React.Fragment key={zbor.id}>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{zbor.orasPlecare?.numeOras || 'N/A'}</span>
                <span className="text-xs text-gray-500">{zbor.oraZborului?.substring(0, 5) || '--:--'}</span>
              </div>
              <span className="text-blue-500/50">→</span>
              {index === rutaArray.length - 1 && (
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{zbor.orasDestinatie?.numeOras || 'N/A'}</span>
                  <span className="text-xs text-gray-500">Sosire</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        
        {pretTotalEconomy > 0 && (
          <button 
            type="button"
            onClick={() => onSelect({ ruta: rutaArray, clasa: 'ECONOMY', pret: pretTotalEconomy, tip })}
            className={`flex flex-col items-center p-3 rounded-xl border min-w-[120px] transition-all cursor-pointer ${
              isSelected && selectedRoute?.clasa === 'ECONOMY' 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-black/20 border-white/5 hover:border-blue-500/50'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-gray-300">Economy</span>
            <span className="text-xl font-bold my-1">{pretTotalEconomy} €</span>
            <span className="text-xs text-green-400">
              {locuriEconomy} {locuriEconomy !== 'N/A' ? 'locuri rămase' : ''}
            </span>
          </button>
        )}

        {pretTotalBusiness > 0 && (
          <button 
            type="button"
            onClick={() => onSelect({ ruta: rutaArray, clasa: 'BUSINESS', pret: pretTotalBusiness, tip })}
            className={`flex flex-col items-center p-3 rounded-xl border min-w-[120px] transition-all cursor-pointer ${
              isSelected && selectedRoute?.clasa === 'BUSINESS' 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-black/20 border-blue-500/30 hover:border-blue-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-blue-300">Business</span>
            <span className="text-xl font-bold my-1">{pretTotalBusiness} €</span>
            <span className="text-xs text-green-400">
              {locuriBusiness} {locuriBusiness !== 'N/A' ? 'locuri' : ''}
            </span>
          </button>
        )}

        {pretTotalFirst > 0 && (
          <button 
            type="button"
            onClick={() => onSelect({ ruta: rutaArray, clasa: 'FIRST', pret: pretTotalFirst, tip })}
            className={`flex flex-col items-center p-3 rounded-xl border min-w-[120px] transition-all cursor-pointer ${
              isSelected && selectedRoute?.clasa === 'FIRST' 
                ? 'bg-yellow-600 border-yellow-400 text-white shadow-lg' 
                : 'bg-gradient-to-br from-yellow-500/10 to-yellow-700/5 border-yellow-500/30 hover:border-yellow-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-yellow-500">First Class</span>
            <span className="text-xl font-bold my-1">{pretTotalFirst} €</span>
            <span className="text-xs text-green-400">
              {locuriFirst} {locuriFirst !== 'N/A' ? 'locuri' : ''}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
const FlightResults = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const plecare = queryParams.get('plecare');
  const destinatie = queryParams.get('destinatie');
  const esteRetur = queryParams.get('retur') === 'true';
  const pasageri = queryParams.get('pasageri') || 1;
  const dataPlecare = queryParams.get('dataPlecare');

  const [zboruriTur, setZboruriTur] = useState([]);
  const [zboruriRetur, setZboruriRetur] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTur, setSelectedTur] = useState(null);
  const [selectedRetur, setSelectedRetur] = useState(null);

  const handleSelectRoute = (selectionObj) => {
    if (selectionObj.tip === 'TUR') setSelectedTur(selectionObj);
    if (selectionObj.tip === 'RETUR') setSelectedRetur(selectionObj);
  };

  useEffect(() => {
    const fetchZboruri = async () => {
      setIsLoading(true);
      try {
        // CĂUTARE TUR
        const resTur = await fetch(`http://localhost:8080/api/zboruri/cauta?plecare=${plecare}&destinatie=${destinatie}`);
        if (resTur.ok) {
          const data = await resTur.json();

          if (data.length > 0 && !Array.isArray(data[0])) {
            setZboruriTur([data]);
          } else {
            setZboruriTur(data);
          }
        }


        if (esteRetur) {
          const resRetur = await fetch(`http://localhost:8080/api/zboruri/cauta?plecare=${destinatie}&destinatie=${plecare}`);
          if (resRetur.ok) {
            const dataRetur = await resRetur.json();
            if (dataRetur.length > 0 && !Array.isArray(dataRetur[0])) {
              setZboruriRetur([dataRetur]);
            } else {
              setZboruriRetur(dataRetur);
            }
          }
        }
      } catch (err) { 
        console.error("Eroare la încărcarea zborurilor:", err); 
      } finally { 
        setIsLoading(false); 
      }
    };

    if (plecare && destinatie) fetchZboruri();
  }, [plecare, destinatie, esteRetur]);

  const handleContinua = () => {
    if (!isLoggedIn) {
      alert("Trebuie să fii logat pentru a putea rezerva un zbor!");
      navigate('/login'); 
      return;
    }

    if (!selectedTur) {
      alert("Te rugăm să selectezi un zbor de Tur pentru a continua.");
      return;
    }
    if (esteRetur && !selectedRetur) {
      alert("Te rugăm să selectezi și un zbor de Retur pentru a continua.");
      return;
    }

    navigate('/detalii-pasageri', {
      state: {
        rutaTur: selectedTur.ruta, 
        clasaTur: selectedTur.clasa,
        pretTur: selectedTur.pret,
        
        rutaRetur: selectedRetur ? selectedRetur.ruta : null,
        clasaRetur: selectedRetur ? selectedRetur.clasa : null,
        pretRetur: selectedRetur ? selectedRetur.pret : 0,
        
        esteRetur: esteRetur,
        numarPasageri: parseInt(pasageri)
      }
    });
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 pb-32">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-glassBg border border-glassBorder p-6 rounded-3xl backdrop-blur-md shadow-lg">
        <div>
          <h1 className="text-3xl font-light text-white">Rezultate: {plecare} → {destinatie}</h1>
          <p className="text-gray-400 mt-2">Pasageri: <span className="text-white font-bold">{pasageri}</span> | Data: <span className="text-white font-bold">{dataPlecare}</span></p>
        </div>
        <button onClick={() => navigate('/')} className="mt-4 md:mt-0 px-5 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors">
          ← Modifică Căutarea
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-blue-400 py-12 text-xl animate-pulse">Se generează rutele disponibile...</div>
      ) : (
        <div className="flex flex-col gap-12">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">🛫 Traseu Tur ({plecare} → {destinatie})</h2>
            {zboruriTur.length === 0 ? (
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-red-200">
                Nu s-au găsit rute disponibile pentru tur în acest moment.
              </div>
            ) : (
              zboruriTur.map((rutaZboruri, index) => (
                <RouteCard 
                  key={index} 
                  ruta={rutaZboruri} 
                  tip="TUR" 
                  onSelect={handleSelectRoute} 
                  selectedRoute={selectedTur} 
                />
              ))
            )}
          </section>

          {esteRetur ? (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">🛬 Traseu Retur ({destinatie} → {plecare})</h2>
              {zboruriRetur.length === 0 ? (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-red-200">
                  Nu s-au găsit rute de retur disponibile.
                </div>
              ) : (
                zboruriRetur.map((rutaZboruri, index) => (
                  <RouteCard 
                    key={index} 
                    ruta={rutaZboruri} 
                    tip="RETUR" 
                    onSelect={handleSelectRoute} 
                    selectedRoute={selectedRetur} 
                  />
                ))
              )}
            </section>
          ) : (
            <section className="opacity-50 pointer-events-none">
              <h2 className="text-2xl font-bold text-gray-500 mb-6 border-b border-white/10 pb-2">🛬 Traseu Retur</h2>
              <p className="text-gray-500">Nu ai optat pentru zbor de retur.</p>
            </section>
          )}
        </div>
      )}

      {(selectedTur || selectedRetur) && (
        <div className="fixed bottom-0 left-0 w-full bg-darkBg/90 border-t border-white/10 p-4 backdrop-blur-lg z-50 flex justify-center">
          <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300">
              {selectedTur && <span className="mr-4">Tur: <b className="text-white">{selectedTur.clasa} ({selectedTur.pret}€)</b></span>}
              {selectedRetur && <span>Retur: <b className="text-white">{selectedRetur.clasa} ({selectedRetur.pret}€)</b></span>}
            </div>
            <button 
              onClick={handleContinua}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
            >
              Continuă spre Detalii Pasageri →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FlightResults;