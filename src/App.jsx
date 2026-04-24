import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, UploadCloud, Plus, FileText, Clock, Target, List, 
  RefreshCw, X, Image as ImageIcon, Activity, Download, 
  Shield, Zap, BookOpen, LogOut, Users, UserPlus, Edit2, 
  Check, Heart, MessageCircle, Send, MessageSquare,
  ChevronUp, ChevronDown, ListPlus, FileDown, Layers, FileStack,
  Bell, Lock, Globe, Trash2, Star, GripVertical, Save, FolderArchive,
  CheckCircle2, AlertCircle, Share2, QrCode, Calendar as CalendarIcon,
  Copy, ArchiveRestore, MessageSquareQuote, BrainCircuit, Menu, Home,
  LayoutGrid, UserCheck, CloudRain, Settings, MoveUp, MoveDown, Sun
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, collection, doc, setDoc, addDoc, updateDoc, 
  deleteDoc, onSnapshot, query, orderBy, getDocs 
} from "firebase/firestore";

// --- CONFIGURACIÓN DE FIREBASE ---
let config;
try {
  config = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
} catch(e) {
  config = {};
}
if (!config.apiKey) {
  config = {
    apiKey: "AIzaSyCO1ZbzPQG9QD3osbaB7zw6tcQumG228L4",
    authDomain: "bibliokeepers-atm.firebaseapp.com",
    databaseURL: "https://bibliokeepers-atm-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bibliokeepers-atm",
    storageBucket: "bibliokeepers-atm.firebasestorage.app",
    messagingSenderId: "518402931815",
    appId: "1:518402931815:web:36602448a555e0935128c2"
  };
}

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = typeof __app_id !== 'undefined' ? __app_id : 'bibliokeepers-atm';
const getColl = (name) => collection(db, 'artifacts', appId, 'public', 'data', name);
const getDocRef = (name, id) => doc(db, 'artifacts', appId, 'public', 'data', name, String(id));

// --- 1. DATOS INICIALES Y LOGOS ---
const LOGO_ATM_URL = "/escudo.PNG"; 
const LOGO_APP_ICON = "/bibliokeepers.PNG";
const FALLBACK_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2b56"/><text x="50" y="55" font-family="sans-serif" font-size="20" fill="white" font-weight="bold" text-anchor="middle">ATM</text></svg>`;
const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23ffffff"/><text x="300" y="200" font-family="sans-serif" font-size="20" fill="%23cc2b2b" text-anchor="middle">Gráfico</text></svg>`;

const mockUsersInitial = [
  { id: 1, name: 'Admin Principal', username: 'admin', password: '123', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin+ATM&background=0A1C40&color=fff', active: true },
  { id: 2, name: 'Diego Pablo Simeone', username: 'cholo', password: '123', role: 'coach', avatar: 'https://ui-avatars.com/api/?name=Diego+Simeone&background=CB3524&color=fff', active: true },
  { id: 3, name: 'Germán Burgos', username: 'mono', password: '123', role: 'coach', avatar: 'https://ui-avatars.com/api/?name=German+Burgos&background=64748b&color=fff', active: true },
];

const initialTasksData = [
  {
    id: 'ej-1',
    title: 'Blocaje Lateral Raso Estático',
    source: 'Sesión Extraída',
    mainObjective: 'Blocaje Lateral Raso Estático',
    secondaryContents: 'Caída lateral en estático + perfilamiento',
    description: 'Trabajo individual caída lateral en estático\n1. Blocaje lateral raso lado derecho\n2. Blocaje lateral raso lado izquierdo',
    variant: 'Sin variante',
    duration: '10 minutos',
    category: 'TÉCNICA',
    imageUrl: FALLBACK_IMG,
    author: { name: 'Diego Pablo Simeone', avatar: 'https://ui-avatars.com/api/?name=Diego+Simeone&background=CB3524&color=fff' },
    likes: ['cholo'],
    comments: [],
    visibility: 'public',
    trashed: false
  }
];

const initialGoalkeepers = [
  { id: 'gk-1', name: 'Jorge Santiago', year: '2012', category: 'Alevín B', assignedCoach: 'cholo', avatar: 'https://ui-avatars.com/api/?name=Jorge+Santiago&background=0D8ABC&color=fff', stats: { reflexes: 8, aerial: 5, oneVone: 7, blocking: 9, footwork: 6 }, history: [{date: '01/04/2026', rating: 8, comment: 'Buen entreno'}, {date: '08/04/2026', rating: 9, comment: 'Excelente blocaje'}] },
  { id: 'gk-2', name: 'Francisco Redondo', year: '2012', category: 'Alevín B', assignedCoach: 'cholo', avatar: 'https://ui-avatars.com/api/?name=Francisco+Redondo&background=4CAF50&color=fff', stats: { reflexes: 7, aerial: 6, oneVone: 8, blocking: 7, footwork: 7 }, history: [{date: '01/04/2026', rating: 6, comment: 'Falta reacción'}] }
];

const mockOcrDatabase = [
  { 
    mainObjective: 'Blocaje Frontal Raso + Pase mano picado', 
    secondaryContents: 'Blocaje lateral raso + Perfilamiento, control orientado y pase + reincorporación tras blocaje', 
    description: '1. Coordinación en escalera (frontal-lateral) + Chut + Blocaje frontal raso\n2. Pase mano (Picado-alto-raso) identificar según altura y posición EDP\n3. Chut + blocaje lateral raso + Reincorporación tras Blocaje + Pase mano picado', 
    variant: 'Cambiar lateralidad\nCambiar Blocaje lateral por perfilamiento, control y pase a mini portería',
    duration: '15 minutos', 
    category: 'TÉCNICA' 
  }
];

const DEFAULT_SESSION_DATA = { 
  clubName: 'CD ÁLCALA', team: 'ALEVIN B - F11', coach: 'JHON ALEXANDER ARROYAVE CARDENAS', 
  goalkeepers: '', gkIds: [], material: 'BALONES + MARCAS + PICAS-BASE (2) + ESCALERA(1)', 
  sessionNumber: '52º', date: '12-01-26', duration: '40 min', 
  objCondicional: '• Lateralidad\n• Velocidad\n• Reacción\n• Activación\n• Fuerza', 
  objTecnico: '• Barrida\n• 1vs1 balón dividido\n• Blocaje frontal media altura\n• Blocaje lateral raso\n• Perfilamiento\n• Control orientado\n• Pase corto\n• Reincorporación PB\n• Reincorporación lado contrario', 
  objTactico: '• Bisectriz\n• Reubicación\n• Evitar 2ª jugadas\n• Coberturas\n• Transiciones', 
  objEmocional: '• Seguridad\n• Concentración\n• Valentía\n• Presión\n• Determinación', 
  objCalentamiento: '• Activación Pre-sesión',
  observaciones: '• Tarea-1: Blocar correctamente y reincorporar con fuerza para realizar barrida en el 1vs1\n• Tarea-2: Incidir en atacar el balón con valentía, sin dudar y evitar las segundas jugadas'
};

const cleanData = (obj) => JSON.parse(JSON.stringify(obj));

// --- COMPONENTES SECUNDARIOS ---
function RadarChart({ stats, className = "w-full h-full" }) {
  const statKeys = ['reflexes', 'aerial', 'oneVone', 'blocking', 'footwork'];
  const labels = ['REF', 'AER', '1v1', 'BLOC', 'PIE'];
  const center = 50;
  const radius = 35;

  const getPoints = (valMap, rScale) => {
    return statKeys.map((k, i) => {
      const angle = (Math.PI * 2 * i / 5) - (Math.PI / 2);
      const val = typeof valMap === 'function' ? valMap(k) : (valMap[k] || 0);
      const r = (val / 10) * rScale;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const dataPoints = getPoints(stats, radius);
  
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {[10, 8, 6, 4, 2].map(level => (
        <polygon key={`level-${level}`} points={getPoints(() => level, radius)} fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
      ))}
      <polygon points={dataPoints} fill="rgba(37,99,235,0.4)" stroke="#2563eb" strokeWidth="1.5" />
      {statKeys.map((k, i) => {
        const angle = (Math.PI * 2 * i / 5) - (Math.PI / 2);
        const x = center + (radius + 10) * Math.cos(angle);
        const y = center + (radius + 10) * Math.sin(angle);
        return <text key={`label-${k}`} x={x} y={y+1} fontSize="5" textAnchor="middle" alignmentBaseline="middle" fill="#64748b" fontWeight="bold">{labels[i]}</text>
      })}
    </svg>
  );
}

function PdfHeader({ sessionData, isInteractive = false, onUpdate }) {
  const [imgSrc, setImgSrc] = useState(LOGO_ATM_URL);

  const renderInput = (value, field, placeholder, className = "") => {
    if (isInteractive) {
      return (
        <input 
          type="text" 
          value={value || ''} 
          onChange={e => onUpdate(field, e.target.value)} 
          placeholder={placeholder} 
          className={`bg-transparent outline-none w-full h-full text-center placeholder:text-slate-400/70 ${className}`} 
        />
      );
    }
    return <span className={`w-full h-full flex items-center justify-center text-center px-1 truncate ${className}`}>{String(value || '')}</span>;
  };

  const InputRow = ({ label, field, placeholder, bgClass="bg-white", textClass="text-[8.5px]" }) => (
    <div className="flex gap-1.5 h-[20px]">
      <div className="w-[90px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase shrink-0">
        {label}
      </div>
      <div className={`flex-1 ${bgClass} border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center ${textClass} font-bold text-[#1a2b56]`}>
        {renderInput(sessionData[field], field, placeholder)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5 shrink-0 w-full mb-1 text-left">
      <div className="flex gap-1.5 h-[70px]">
        <div className="w-[90px] flex flex-col shrink-0 border-[1.5px] border-[#1a2b56] rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="flex-1 p-1 flex items-center justify-center">
             <img src={imgSrc} crossOrigin="anonymous" className="max-h-[40px] object-contain" alt="ATM" onError={() => setImgSrc(FALLBACK_LOGO)} />
          </div>
          <div className="bg-[#1a2b56] text-white text-[8px] font-bold h-[20px] flex items-center justify-center">
            {renderInput(sessionData.clubName, 'clubName', 'CLUB...', 'text-white placeholder:text-blue-300')}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 justify-between">
          <div className="bg-[#cc2b2b] text-white font-black rounded-lg tracking-widest text-[14px] uppercase shadow-sm flex items-center justify-center h-[24px]">
            {renderInput(sessionData.team, 'team', 'EQUIPO / CATEGORÍA...', 'text-white placeholder:text-red-300')}
          </div>
          <InputRow label="ENTRENADOR" field="coach" placeholder="Nombre Entrenador..." textClass="text-[8.5px] uppercase" />
          <InputRow label="PORTEROS" field="goalkeepers" placeholder="Nombres Porteros..." textClass="text-[8.5px] uppercase" />
        </div>

        <div className="w-[150px] flex flex-col gap-1.5 shrink-0 justify-between">
          <div className="flex gap-1.5 h-[24px]">
             <div className="flex-1 bg-[#1a2b56] rounded-lg flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-widest shadow-sm">SESIÓN</div>
             <div className="w-[50px] bg-[#1a2b56] rounded-lg flex items-center justify-center text-[12px] text-white font-black shadow-sm">
                {renderInput(sessionData.sessionNumber, 'sessionNumber', 'Nº...', 'text-white placeholder:text-blue-300')}
             </div>
          </div>
          <div className="flex gap-1.5 h-[20px]">
            <div className="w-[70px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase">FECHA</div>
            <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[8.5px] font-bold text-[#1a2b56]">
               {renderInput(sessionData.date, 'date', 'DD-MM-YY...')}
            </div>
          </div>
          <div className="flex gap-1.5 h-[20px]">
            <div className="w-[70px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase">DURACIÓN</div>
            <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[8.5px] font-bold text-[#1a2b56]">
               {renderInput(sessionData.duration, 'duration', 'Min...')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 h-[20px] w-full shrink-0">
        <div className="w-[90px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase shrink-0">MATERIAL</div>
        <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[8.5px] font-bold text-[#1a2b56] uppercase">
           {renderInput(sessionData.material, 'material', 'Balones, conos, picas...')}
        </div>
      </div>
    </div>
  );
}

function PdfObjectives({ sessionData, isInteractive = false, onUpdate }) {
  const cols = [
    { title: 'CONDICIONAL', field: 'objCondicional' },
    { title: 'TÉCNICO', field: 'objTecnico' },
    { title: 'TÁCTICO', field: 'objTactico' },
    { title: 'EMOCIONAL', field: 'objEmocional' },
    { title: 'CALENTAMIENTO', field: 'objCalentamiento' }
  ];

  return (
    <div className="flex flex-col shrink-0 w-full mb-2">
      <div className="bg-[#cc2b2b] text-white text-center flex items-center justify-center font-bold text-[12px] py-1.5 rounded-lg tracking-widest uppercase shadow-sm mb-1.5">
        OBJETIVOS
      </div>
      <div className="flex gap-1.5 items-stretch min-h-[90px]">
        {cols.map((col, i) => (
          <div key={`col-${i}`} className="flex-1 flex flex-col border-[1.5px] border-[#1a2b56] rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-[#1a2b56] text-white flex items-center justify-center text-center text-[8px] font-bold py-1.5 uppercase shrink-0">
              {col.title}
            </div>
            <div className="p-1.5 flex-1">
              {isInteractive ? (
                <textarea 
                  value={sessionData[col.field] || ''} 
                  onChange={e => onUpdate(col.field, e.target.value)}
                  placeholder={`Objetivos de ${col.title.toLowerCase()}...`}
                  className="w-full h-full min-h-[70px] bg-transparent outline-none resize-none text-[8.5px] text-[#1a2b56] font-medium leading-tight p-0.5 placeholder:text-slate-300 text-center"
                />
              ) : (
                <div className="text-[8.5px] text-[#1a2b56] font-medium leading-tight whitespace-pre-line px-0.5 text-center flex flex-col items-center justify-center h-full">
                  {String(sessionData[col.field] || '')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PdfTaskItem({ task, num }) {
  if (!task) return (
    <div className="flex-1 rounded-xl border-[1.5px] border-dashed border-slate-300 flex items-center justify-center bg-slate-50 min-h-0">
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Espacio Tarea {num}</p>
    </div>
  );

  return (
    <div className="flex-1 flex rounded-xl overflow-hidden border-[1.5px] border-[#1a2b56] bg-white shadow-sm min-h-0" style={{ pageBreakInside: 'avoid' }}>
      <div className="w-[30px] bg-[#1a2b56] relative flex items-center justify-center shrink-0 border-r border-[#1a2b56]">
        <div className="text-white font-black text-[12px] tracking-[4px] uppercase whitespace-nowrap absolute" 
             style={{ transform: 'rotate(-90deg)' }}>
          TAREA {num}
        </div>
      </div>
      
      <div className="w-[42%] pl-3 pr-2.5 pt-3 pb-3 flex flex-col border-r border-[#1a2b56] bg-slate-50/30 text-left">
        <div className="text-[8.5px] leading-snug text-slate-800 shrink-0 mb-1">
          <span className="text-[#cc2b2b] font-bold underline">Objetivo principal:</span> <span className="font-bold text-[#cc2b2b]">{String(task.mainObjective || '')}</span>
        </div>
        
        {task.secondaryContents && (
          <div className="text-[7.5px] leading-snug text-slate-800 shrink-0 mb-1">
            <span className="font-bold underline">Contenidos secundarios:</span> <span className="font-bold">{String(task.secondaryContents || '')}</span>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-1">
          <div className="text-[7px] leading-tight text-slate-800 break-words">
            <span className="font-bold underline block mb-0.5">Descripción:</span>
            <p className="whitespace-pre-line">{String(task.description || '')}</p>
          </div>
          
          {task.variant && (
            <div className="text-[7px] leading-tight text-slate-800 break-words mt-0.5">
              <span className="font-bold underline block mb-0.5">Variante:</span>
              <p className="whitespace-pre-line">{String(task.variant || '')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-2 text-[8.5px] font-bold text-slate-800 pt-1 shrink-0 border-t border-[#1a2b56]/20">
          <span className="underline">Duración:</span> {String(task.duration || '')}
        </div>
      </div>
      
      <div className="flex-1 bg-white flex items-center justify-center relative p-1.5 overflow-hidden">
         <div className="absolute top-1.5 right-1.5 bg-[#1a2b56] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10 border border-[#1a2b56]/20">Tarea {num}</div>
         <img src={task.imageUrl} className="w-full h-full object-contain" alt="Task" crossOrigin="anonymous" onError={(e)=>{e.target.src=FALLBACK_IMG}}/>
      </div>
    </div>
  );
}

// --- VISTAS ---

function HomeView({ tasks, calendarEvents, messages, onSendMessage, users, squad, setActiveTab, setIsAIOpen, currentUser, onLoadSession, showToast, savedSessions }) {
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
  const todayDay = String(todayDate.getDate()).padStart(2, '0');
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  const futureDates = Object.keys(calendarEvents || {})
    .filter(date => date >= todayStr && calendarEvents[date].length > 0)
    .sort();
  const nextDate = futureDates[0];
  const nextSessions = nextDate ? calendarEvents[nextDate] : [];

  const recentMessages = messages.slice(-4);

  const hour = todayDate.getHours();
  let greeting = "Buenos días";
  if (hour >= 13 && hour < 20) greeting = "Buenas tardes";
  else if (hour >= 20 || hour < 5) greeting = "Buenas noches";

  const handleSendToChat = (session) => {
    const text = `¡Chicos! Revisad la sesión programada: ${session.name}`;
    onSendMessage(text);
    showToast("Sesión enviada al chat");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState(['welcome', 'quickActions', 'weather', 'nextSession', 'chat']);
  const [weatherData, setWeatherData] = useState({ temp: '--', desc: 'Cargando clima...', city: 'Buscando...', isRainy: false, code: 0 });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const geoData = await geoRes.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Tu Ubicación';

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const wData = await weatherRes.json();
        const current = wData.current_weather;
        
        let desc = 'Despejado';
        let isRainy = false;
        if ([51,53,55,61,63,65,80,81,82,95,96,99].includes(current.weathercode)) {
           desc = 'Probabilidad de lluvia';
           isRainy = true;
        } else if ([71,73,75,85,86].includes(current.weathercode)) {
           desc = 'Nieve';
           isRainy = true;
        } else if ([1,2,3].includes(current.weathercode)) {
           desc = 'Nublado';
        }
        
        setWeatherData({ temp: Math.round(current.temperature), desc, city, isRainy, code: current.weathercode });
      } catch (e) {
        console.error(e);
        setWeatherData({ temp: '--', desc: 'Error al cargar', city: 'Desconocida', isRainy: false, code: 0 });
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        (error) => fetchWeather(40.4168, -3.7038) 
      );
    } else {
      fetchWeather(40.4168, -3.7038);
    }
  }, []);

  const availableWidgets = [
    { id: 'welcome', name: 'Banner Bienvenida', colSpan: 'xl:col-span-3' },
    { id: 'quickActions', name: 'Accesos Rápidos', colSpan: 'xl:col-span-3' },
    { id: 'weather', name: 'Clima y Superficie', colSpan: 'xl:col-span-3' },
    { id: 'nextSession', name: 'Próxima Sesión', colSpan: 'xl:col-span-2' },
    { id: 'chat', name: 'Chat Reciente', colSpan: 'xl:col-span-1' }
  ];

  const moveWidget = (index, direction) => {
    const newLayout = [...layout];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLayout.length) return;
    const temp = newLayout[index];
    newLayout[index] = newLayout[targetIndex];
    newLayout[targetIndex] = temp;
    setLayout(newLayout);
  };

  const removeWidget = (id) => setLayout(layout.filter(w => w !== id));
  const addWidget = (id) => setLayout([...layout, id]);

  const hiddenWidgets = availableWidgets.filter(w => !layout.includes(w.id));

  const WidgetWrapper = ({ id, children, colSpan }) => (
    <div className={`${colSpan} relative group ${isEditing ? 'border-[3px] border-dashed border-blue-400 p-2 rounded-[2.5rem] bg-blue-50/30' : ''}`}>
       {isEditing && (
         <div className="absolute -top-3 -right-3 z-50 flex gap-1 bg-white shadow-lg p-1.5 rounded-xl border border-blue-100">
            <button onClick={() => moveWidget(layout.indexOf(id), -1)} disabled={layout.indexOf(id)===0} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-md hover:bg-blue-100 disabled:opacity-30"><MoveUp size={12}/></button>
            <button onClick={() => moveWidget(layout.indexOf(id), 1)} disabled={layout.indexOf(id)===layout.length-1} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-md hover:bg-blue-100 disabled:opacity-30"><MoveDown size={12}/></button>
            <button onClick={() => removeWidget(id)} className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 ml-2"><X size={12}/></button>
         </div>
       )}
       {children}
    </div>
  );

  const widgets = {
    welcome: (
       <div className="bg-gradient-to-br from-blue-950 to-blue-900 p-8 rounded-[3rem] border border-blue-800 shadow-xl flex flex-col justify-between gap-2 text-white relative overflow-hidden h-full min-h-[150px]">
         <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
           <Shield size={250} />
         </div>
         <div className="relative z-10">
           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
             {greeting}, {String(currentUser?.name || '').split(' ')[0]}
           </h2>
           <p className="text-blue-200 font-medium mt-1">Es un buen momento para planificar la semana y revisar tus tareas.</p>
         </div>
       </div>
    ),
    quickActions: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <button onClick={() => setIsAIOpen(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-[2rem] flex items-center gap-4 text-white hover:scale-[1.02] transition-transform shadow-md h-full">
             <div className="bg-white/20 p-3 rounded-2xl"><BrainCircuit size={24} /></div>
             <div className="text-left"><h4 className="font-black uppercase tracking-widest text-sm">Generar Sesión IA</h4><p className="text-[10px] font-medium text-purple-100">Creación automática</p></div>
          </button>
          <button onClick={() => setActiveTab('upload')} className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-[2rem] flex items-center gap-4 text-white hover:scale-[1.02] transition-transform shadow-md h-full">
             <div className="bg-white/20 p-3 rounded-2xl"><ImageIcon size={24} /></div>
             <div className="text-left"><h4 className="font-black uppercase tracking-widest text-sm">Escanear Ficha</h4><p className="text-[10px] font-medium text-emerald-100">Sube fotos o gráficos</p></div>
          </button>
          <button onClick={() => setActiveTab('create')} className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-[2rem] flex items-center gap-4 text-white hover:scale-[1.02] transition-transform shadow-md h-full">
             <div className="bg-white/20 p-3 rounded-2xl"><Edit2 size={24} /></div>
             <div className="text-left"><h4 className="font-black uppercase tracking-widest text-sm">Crear Tarea</h4><p className="text-[10px] font-medium text-orange-100">Añadir ficha manual</p></div>
          </button>
       </div>
    ),
    weather: (
      <div className={`p-6 rounded-[2.5rem] border shadow-sm flex items-center justify-between text-white relative overflow-hidden h-full ${weatherData.isRainy ? 'bg-gradient-to-r from-slate-700 to-slate-900 border-slate-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500 border-blue-400'}`}>
         <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4 pointer-events-none">
            {weatherData.isRainy ? <CloudRain size={120} /> : <Sun size={120} />}
         </div>
         <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 w-full">
            <div className="flex items-center gap-6 flex-1">
                <div className="bg-white/20 p-4 rounded-3xl shrink-0 backdrop-blur-sm">
                   {weatherData.isRainy ? <CloudRain size={36} className="text-white"/> : <Sun size={36} className="text-white"/>}
                </div>
                <div>
                   <h4 className="font-black uppercase tracking-widest text-sm mb-1 flex items-center gap-2">{String(weatherData.city)} <span className="text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded-full">{String(weatherData.temp)}ºC</span></h4>
                   <p className="text-xl font-bold leading-tight">{String(weatherData.desc)}</p>
                </div>
            </div>
         </div>
      </div>
    ),
    nextSession: (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm flex flex-col gap-4 h-full min-h-[300px]">
         <div className="flex items-center gap-2 text-red-600 font-black uppercase text-xs tracking-widest shrink-0">
           <CalendarIcon size={16}/> Próxima Sesión Programada
         </div>
         <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
           {nextSessions.length > 0 ? (
              nextSessions.map(s => {
                const [yyyy, mm, dd] = nextDate.split('-');
                const sDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                
                const todayNoTime = new Date(todayYear, todayDate.getMonth(), todayDate.getDate());
                const targetNoTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
                const diffTime = targetNoTime - todayNoTime;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                let countdown = diffDays === 0 ? "Hoy" : diffDays === 1 ? "Mañana" : `Faltan ${diffDays} días`;

                const sessionGks = squad.filter(gk => s.data?.gkIds?.includes(gk.id));

                return (
                  <div key={`next-${s.id}`} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{countdown}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {sDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                         </span>
                       </div>
                       <h4 className="font-black text-blue-950 text-xl uppercase tracking-tight">{String(s.name)}</h4>
                       {sessionGks.length > 0 && (
                         <div className="flex items-center mt-4">
                           <div className="flex -space-x-3 mr-3">
                             {sessionGks.map((gk, i) => (
                               <img key={`gk-${i}`} src={gk.avatar} className="w-8 h-8 rounded-full border-2 border-slate-50 object-cover shadow-sm" title={String(gk.name)} alt="avatar"/>
                             ))}
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sessionGks.length} Porteros convocados</span>
                         </div>
                       )}
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                       <button onClick={() => onLoadSession(s)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-950 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-900 transition-colors shadow-md">
                         <FileDown size={14}/> Ver / Editar
                       </button>
                       <button onClick={() => handleSendToChat(s)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1ebd5c] transition-colors shadow-md">
                         <Send size={14}/> Avisar al Chat
                       </button>
                    </div>
                  </div>
                )
              })
           ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center flex-1 flex items-center justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay sesiones próximas</p>
              </div>
           )}
         </div>
         <button onClick={() => setActiveTab('calendar')} className="mt-2 text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest text-left flex items-center gap-1 shrink-0">
           Ir al Planificador <ChevronDown className="-rotate-90" size={14}/>
         </button>
      </div>
    ),
    chat: (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm flex flex-col gap-4 h-full min-h-[300px]">
         <div className="flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest">
             <MessageCircle size={16}/> Chat Reciente
           </div>
         </div>
         <div className="flex-1 flex flex-col gap-3 justify-end bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100 min-h-[200px] overflow-hidden">
            {recentMessages.map(msg => {
              const sender = users.find(u => String(u.id) === String(msg.senderId)) || { name: 'Desconocido', avatar: '' };
              const isMe = String(msg.senderId) === String(currentUser?.id);
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                   <img src={sender.avatar || FALLBACK_LOGO} className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200" alt="avatar"/>
                   <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[8px] font-black text-slate-500 uppercase">{isMe ? 'Tú' : String(sender?.name || 'User').split(' ')[0]}</span>
                        <span className="text-[7px] font-bold text-slate-400">{String(msg.timestamp)}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-2xl shadow-sm text-[10px] font-medium leading-relaxed ${isMe ? 'bg-blue-950 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                        {String(msg.text)}
                      </div>
                   </div>
                </div>
              )
            })}
         </div>
      </div>
    )
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-24 text-left animate-in fade-in">
       {/* Edit Panel Button */}
       <div className="flex justify-end">
         <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${isEditing ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
           <Settings size={14}/> {isEditing ? 'Finalizar Edición' : 'Editar Panel'}
         </button>
       </div>

       {/* Render Widgets Loop */}
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {layout.map((widgetId) => {
             const widgetConfig = availableWidgets.find(w => w.id === widgetId);
             if (!widgetConfig) return null;
             const widgetContent = widgets[widgetId];
             
             return (
               <div key={`widget-${widgetId}`} className={`${widgetConfig.colSpan} relative group ${isEditing ? 'border-[3px] border-dashed border-blue-400 p-2 rounded-[2.5rem] bg-blue-50/30' : ''}`}>
                 {isEditing && (
                   <div className="absolute -top-3 -right-3 z-50 flex gap-1 bg-white shadow-lg p-1.5 rounded-xl border border-blue-100">
                      <button onClick={() => moveWidget(layout.indexOf(widgetId), -1)} disabled={layout.indexOf(widgetId)===0} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-md hover:bg-blue-100 disabled:opacity-30"><MoveUp size={12}/></button>
                      <button onClick={() => moveWidget(layout.indexOf(widgetId), 1)} disabled={layout.indexOf(widgetId)===layout.length-1} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-md hover:bg-blue-100 disabled:opacity-30"><MoveDown size={12}/></button>
                      <button onClick={() => removeWidget(widgetId)} className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 ml-2"><X size={12}/></button>
                   </div>
                 )}
                 {widgetContent}
               </div>
             );
          })}
       </div>

       {/* Hidden Widgets Tray */}
       {isEditing && hiddenWidgets.length > 0 && (
         <div className="mt-8 p-6 bg-slate-200/50 border-2 border-dashed border-slate-300 rounded-[2.5rem] animate-in slide-in-from-bottom-5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Widgets Ocultos (Haz clic para añadir)</h4>
            <div className="flex flex-wrap gap-3">
               {hiddenWidgets.map(w => (
                 <button key={w.id} onClick={() => addWidget(w.id)} className="bg-white border border-slate-300 shadow-sm px-4 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-bold text-blue-950 hover:bg-blue-50 transition-colors uppercase">
                   <Plus size={14} className="text-blue-500"/> {String(w.name)}
                 </button>
               ))}
            </div>
         </div>
       )}
    </div>
  )
}

function SquadView({ squad, onSaveGk, onDeleteGk, showToast, users, calendarEvents }) {
  const [selectedGk, setSelectedGk] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGk, setEditingGk] = useState(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in pb-24 md:pb-10 text-left">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Plantilla de Porteros</h3>
          <p className="text-slate-500 text-sm mt-1">Gestiona perfiles, estadísticas y evolución de tus guardametas.</p>
        </div>
        <button onClick={() => { setEditingGk(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase transition-all shadow-xl bg-blue-600 text-white hover:bg-blue-700 text-xs">
          <UserPlus size={16}/> Añadir Portero
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {squad.map(gk => {
          const assignedCoachName = users.find(u => u.username === gk.assignedCoach)?.name || 'Sin asignar';
          return (
            <div key={gk.id} onClick={() => setSelectedGk(gk)} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group flex flex-col relative">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 transition-opacity">
                <button onClick={(e)=>{ e.stopPropagation(); setEditingGk(gk); setIsFormOpen(true); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-blue-600 hover:bg-blue-50" title="Editar Portero">
                  <Edit2 size={14} strokeWidth={3}/>
                </button>
                <button onClick={(e)=>{ e.stopPropagation(); if(window.confirm('¿Eliminar a este portero?')) { onDeleteGk(gk.id); showToast("Portero eliminado"); } }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-red-600 hover:bg-red-50" title="Eliminar Portero">
                  <Trash2 size={14} strokeWidth={3}/>
                </button>
              </div>

              <div className="bg-slate-50 p-6 flex flex-col items-center border-b border-slate-100 relative">
                <img src={gk.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover group-hover:scale-105 transition-transform" alt={gk.name}/>
                <h4 className="mt-4 font-black text-blue-950 text-sm uppercase">{String(gk.name || '')}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{String(gk.category || '')} • Año {String(gk.year || '')}</span>
              </div>
              <div className="p-4 flex items-center justify-center flex-1">
                 <div className="w-32 h-32 opacity-80 group-hover:opacity-100 transition-opacity">
                   <RadarChart stats={gk.stats} />
                 </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Asignado a: <span className="text-blue-950">{String(assignedCoachName)}</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedGk && (
        <GoalkeeperProfileModal gk={selectedGk} onClose={() => setSelectedGk(null)} calendarEvents={calendarEvents} />
      )}

      {isFormOpen && (
        <GoalkeeperFormModal 
           users={users} 
           editingGk={editingGk} 
           onClose={() => { setIsFormOpen(false); setEditingGk(null); }} 
           onSave={(gkData) => { 
             onSaveGk(gkData);
             showToast(editingGk ? "Perfil actualizado" : "Portero añadido");
             setIsFormOpen(false); 
             setEditingGk(null); 
           }}
        />
      )}
    </div>
  );
}

function GoalkeeperProfileModal({ gk, onClose, calendarEvents }) {
  let present = 0;
  let absent = 0;
  Object.values(calendarEvents || {}).forEach(dayEvents => {
    dayEvents.forEach(event => {
      if (event.attendance && event.attendance[gk.id] !== undefined) {
        if (event.attendance[gk.id]) present++;
        else absent++;
      }
    });
  });

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[3rem] max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col md:flex-row gap-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10">
          <X size={20}/>
        </button>
        
        <div className="w-full md:w-1/2 flex flex-col items-center text-center">
           <img src={gk.avatar} className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-md object-cover mb-4" alt={gk.name}/>
           <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter leading-none">{String(gk.name || '')}</h3>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{String(gk.category || '')} • Año {String(gk.year || '')}</span>
           
           <div className="w-full aspect-square mt-6 bg-slate-50 rounded-[2rem] border border-slate-100 p-4">
             <RadarChart stats={gk.stats} />
           </div>

           <div className="flex justify-around w-full mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
             <div className="text-center">
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asistencia</div>
               <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1"><Check size={16}/> {present}</div>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div className="text-center">
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Faltas</div>
               <div className="text-xl font-black text-red-600 flex items-center justify-center gap-1"><X size={16}/> {absent}</div>
             </div>
           </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Evaluaciones Recientes</h4>
           <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[350px] pr-2">
             {(gk.history && gk.history.length > 0) ? gk.history.slice(-6).reverse().map((h, i) => (
                 <div key={`eval-${i}`} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400">{String(h.date || '')}</span>
                      <span className="font-black text-blue-950 flex items-center gap-1 text-xs">
                        <Star size={12} className="text-yellow-500" fill="currentColor"/> {String(h.rating || '')}/10
                      </span>
                    </div>
                    {h.comment && <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">"{String(h.comment || '')}"</p>}
                 </div>
               ))
             : (
               <p className="text-xs text-slate-400 italic text-center mt-10">Aún no hay evaluaciones para este portero.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

function GoalkeeperFormModal({ onClose, onSave, users, editingGk }) {
  const [formData, setFormData] = useState(
    editingGk ? { ...editingGk } : { 
      name: '', year: '', category: 'Alevín', avatar: '', assignedCoach: '', 
      stats: { reflexes: 5, aerial: 5, oneVone: 5, blocking: 5, footwork: 5 }, history: [] 
    }
  );

  const handleImageUpload = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => { setFormData({ ...formData, avatar: String(reader.result) }); }; 
      reader.readAsDataURL(file); 
    } 
  };

  const save = () => { 
    if(!formData.name.trim()) return; 
    const finalAvatar = formData.avatar || (editingGk ? editingGk.avatar : `https://ui-avatars.com/api/?name=${formData.name.replace(/\s+/g, '+')}&background=0D8ABC&color=fff`); 
    onSave({ 
      ...formData, 
      id: editingGk ? editingGk.id : `gk-${Date.now()}`, 
      avatar: finalAvatar, 
      history: editingGk ? editingGk.history : [] 
    }); 
  };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 relative text-left">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
          <X size={20}/>
        </button>
        <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-6">{editingGk ? 'Editar Portero' : 'Nuevo Portero'}</h3>
        
        <div className="flex items-center gap-4 py-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
            {formData.avatar ? (
              <>
                <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                <div onClick={() => setFormData({...formData, avatar: ''})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  <X size={20} className="text-white" />
                </div>
              </>
            ) : <ImageIcon size={20} className="text-slate-400" />}
          </div>
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="gk-avatar-upload" />
            <label htmlFor="gk-avatar-upload" className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl block text-center transition-colors text-xs w-full shadow-sm">
              Subir Foto
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/>
          <div className="flex gap-3">
            <input type="number" placeholder="Año (Ej: 2012)" className="w-1/3 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})}/>
            <input type="text" placeholder="Categoría (Ej: Alevín B)" className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}/>
          </div>
          <div>
            <select value={formData.assignedCoach} onChange={e=>setFormData({...formData, assignedCoach: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 text-xs appearance-none cursor-pointer">
              <option value="">Asignar a un Entrenador...</option>
              {users.filter(u => u.role === 'coach').map(c => <option key={c.id} value={c.username}>{c.name}</option>)}
            </select>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atributos (Radar)</h4>
            {Object.entries({reflexes: 'Reflejos', aerial: 'Juego Aéreo', oneVone: '1 vs 1', blocking: 'Blocaje', footwork: 'Juego de Pies'}).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-20 text-[10px] font-bold text-slate-600 uppercase">{label}</span>
                <input type="range" min="1" max="10" value={formData.stats[key]} onChange={(e) => setFormData({...formData, stats: {...formData.stats, [key]: Number(e.target.value)}})} className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <span className="w-4 text-xs font-black text-blue-950 text-right">{formData.stats[key]}</span>
              </div>
            ))}
          </div>
          <button onClick={save} className="w-full py-4 mt-2 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg uppercase text-xs tracking-widest">
            Guardar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionBuilderView({ sessionCart, setSessionCart, sessionData, setSessionData, showToast, onSaveTemplate, currentUser, squad, onNewSession }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const pdfRef = useRef(null);

  const allowedSquad = squad ? squad.filter(gk => gk.assignedCoach === currentUser.username || currentUser.role === 'admin') : [];
  const updateField = (field, value) => setSessionData(prev => ({ ...prev, [field]: String(value) }));
  
  const toggleGk = (gk) => {
    const currentIds = sessionData.gkIds || [];
    const newIds = currentIds.includes(gk.id) ? currentIds.filter(id => id !== gk.id) : [...currentIds, gk.id];
    const newNames = allowedSquad.filter(s => newIds.includes(s.id)).map(s => s.name).join(' - ');
    setSessionData(prev => ({ ...prev, gkIds: newIds, goalkeepers: newNames }));
  };

  const handleSaveTemplateClick = () => {
    if (sessionCart.filter(Boolean).length === 0) return showToast("Añade al menos una tarea.", "error");
    const newSession = { id: Date.now().toString(), name: `Sesión ${sessionData.sessionNumber} - ${sessionData.team}`, date: new Date().toLocaleDateString(), authorId: currentUser.id, data: { ...sessionData }, cart: [...sessionCart] };
    onSaveTemplate(newSession);
  };

  const generatePdfBlob = async () => {
    const element = pdfRef.current;
    element.style.visibility = 'visible'; element.style.position = 'fixed'; element.style.left = '0px'; element.style.top = '0px'; element.style.zIndex = '-1000';
    await new Promise(r => setTimeout(r, 800));
    try {
      const pdf = new window.jspdf.jsPDF('landscape', 'mm', 'a4');
      const pages = element.querySelectorAll('.pdf-page');
      for (let i = 0; i < pages.length; i++) {
        const canvas = await window.html2canvas(pages[i], { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 297, 210);
      }
      return pdf;
    } catch (e) { return null; } finally { element.style.visibility = 'hidden'; element.style.position = 'absolute'; element.style.left = '-20000px'; }
  };

  const handleExport = async () => {
    if (!window.html2canvas) return showToast("Librerías cargando...", "error");
    setIsGenerating(true); showToast("Preparando PDF...");
    const pdf = await generatePdfBlob();
    if (pdf) { pdf.save(`Sesion_ATM_${sessionData.sessionNumber || 'Nueva'}.pdf`); showToast("PDF descargado."); } else { showToast("Error al generar PDF.", "error"); }
    setIsGenerating(false);
  };

  const handleShareWhatsApp = async () => {
    if (!window.html2canvas) return;
    setIsGenerating(true); showToast("Preparando PDF para WhatsApp...");
    const pdf = await generatePdfBlob();
    if (pdf) {
      try {
        const pdfBlob = pdf.output('blob'); const file = new File([pdfBlob], `Sesion_ATM_${sessionData.sessionNumber || 'Nueva'}.pdf`, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ title: `Sesión ATM ${sessionData.sessionNumber}`, text: 'Aquí tienes la sesión.', files: [file] }); showToast("Compartido con éxito"); } else { pdf.save(`Sesion_ATM_${sessionData.sessionNumber || 'Nueva'}.pdf`); showToast("El PDF se ha descargado.", "error"); }
      } catch (err) { console.error(err); }
    }
    setIsGenerating(false);
  };

  const KANBAN_COLS = [
    { title: 'ANALÍTICA', subtitle: '(tarea-1)' },
    { title: 'SEMI-ANALÍTICA', subtitle: '(Físico-Técnica) (tarea-2)' },
    { title: 'Transferencia al juego Técnico-Táctica', subtitle: '(tarea-3)' },
    { title: 'Transferencia al juego Técnico-Táctica', subtitle: '(tarea-4)' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 md:pb-10 pb-24 text-left animate-in fade-in">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Constructor de Sesión</h3>
          <p className="text-slate-500 text-sm mt-1">Rellena la plantilla y exporta el documento oficial.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onNewSession} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
            <Plus size={16}/> Nueva Sesión
          </button>
          <button onClick={handleSaveTemplateClick} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs">
            <Save size={16}/> Guardar
          </button>
          <button onClick={() => setShowQR(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs">
            <QrCode size={16}/> QR
          </button>
          <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-md bg-[#25D366] text-white hover:bg-[#1ebd5c] text-xs">
            {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Share2 size={16}/>} WhatsApp
          </button>
          <button onClick={handleExport} disabled={isGenerating} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase shadow-lg ${isGenerating ? 'bg-slate-300 text-slate-500' : 'bg-red-600 text-white hover:bg-red-700'} text-xs`}>
            {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Download size={16}/>} Exportar PDF
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* KANBAN BOARD SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm w-full mb-8">
           <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
             <Layers size={20}/> Estructura de la Sesión (Kanban)
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {KANBAN_COLS.map((col, idx) => {
                 const taskItem = sessionCart[idx];
                 return (
                    <div
                       key={`kanban-${idx}`}
                       onDragOver={(e) => e.preventDefault()}
                       onDrop={(e) => {
                          e.preventDefault();
                          const sourceIdx = parseInt(e.dataTransfer.getData('taskIdx'));
                          if (!isNaN(sourceIdx) && sourceIdx !== idx) {
                             const newCart = [...sessionCart];
                             const temp = newCart[sourceIdx];
                             newCart[sourceIdx] = newCart[idx];
                             newCart[idx] = temp;
                             setSessionCart(newCart);
                          }
                       }}
                       className={`rounded-[2rem] border-2 border-dashed p-4 flex flex-col gap-4 min-h-[260px] transition-colors ${taskItem ? 'bg-blue-50/30 border-blue-200' : 'bg-slate-50 border-slate-200'}`}
                    >
                       <div className="text-center pb-3 border-b border-slate-200/60">
                          <h5 className="font-black text-blue-950 text-[10px] uppercase tracking-widest leading-tight">{String(col.title)}</h5>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{String(col.subtitle)}</span>
                       </div>
                       
                       {taskItem ? (
                          <div 
                             draggable 
                             onDragStart={(e) => e.dataTransfer.setData('taskIdx', String(idx))}
                             className="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative group flex flex-col h-full"
                          >
                             <button onClick={()=>{
                                const newCart = [...sessionCart];
                                newCart[idx] = null;
                                setSessionCart(newCart);
                             }} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10">
                                <X size={14} strokeWidth={3}/>
                             </button>
                             <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 mb-3 border border-slate-100">
                                <img src={taskItem.imageUrl} className="w-full h-full object-cover" alt="img"/>
                             </div>
                             <div className="flex-1 flex flex-col justify-center">
                               <h5 className="font-black text-blue-950 text-[10px] uppercase tracking-tight text-center line-clamp-2">{String(taskItem.mainObjective || taskItem.title || '')}</h5>
                             </div>
                          </div>
                       ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-2">
                             <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white"><Plus size={20}/></div>
                             <span className="text-[9px] font-bold uppercase tracking-widest text-center px-4">Arrastra aquí una tarea de la biblioteca</span>
                          </div>
                       )}
                    </div>
                 )
              })}
           </div>
        </div>

        {/* PDF FORM SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm w-full overflow-x-auto">
           <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
             <FileText size={18}/> Plantilla de Cabecera
           </h4>
           {allowedSquad.length > 0 && (
             <div className="mb-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Convocatoria Rápida</h4>
               <div className="flex flex-wrap gap-2">
                 {allowedSquad.map(gk => {
                    const isSelected = sessionData.gkIds?.includes(gk.id);
                    return (
                      <button key={gk.id} onClick={() => toggleGk(gk)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest shadow-sm ${isSelected ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-950'}`}>
                        <img src={gk.avatar} className="w-5 h-5 rounded-full object-cover" alt="avatar"/> {String(gk.name || '')}
                      </button>
                    );
                 })}
               </div>
             </div>
           )}
           <div className="min-w-[700px]">
             <PdfHeader sessionData={sessionData} isInteractive={true} onUpdate={updateField} />
             <PdfObjectives sessionData={sessionData} isInteractive={true} onUpdate={updateField} />
             <div className="mt-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-2">Observaciones Generales</h4>
               <textarea value={sessionData.observaciones || ''} onChange={e => updateField('observaciones', e.target.value)} placeholder="Notas generales..." className="w-full p-3 bg-slate-50 rounded-xl text-xs h-20 border-none focus:ring-2 focus:ring-blue-900 resize-none outline-none text-slate-700 font-medium"/>
             </div>
           </div>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl relative">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
            <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-2">QR de la Sesión</h3>
            <p className="text-slate-500 font-medium text-xs mb-6">Muestra este código a tus porteros.</p>
            <div className="bg-slate-50 p-4 rounded-3xl inline-block border border-slate-200 mb-4">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://app.bibliokeepers.com/visor?sesion=${sessionData.sessionNumber}`)}`} alt="QR Code" className="w-[200px] h-[200px] object-contain rounded-xl mix-blend-multiply" />
            </div>
            <p className="text-blue-950 font-black uppercase text-sm tracking-widest">{String(sessionData.team || '')}</p>
          </div>
        </div>
      )}

      {/* PLANTILLA PDF 1 PÁGINA */}
      <div id="pdf-root-stable-final" style={{ visibility: 'hidden', position: 'absolute', left: '-20000px', top: '-20000px', zIndex: -1000 }} ref={pdfRef}>
        <div className="pdf-page bg-white flex gap-3 overflow-hidden" style={{ width: '1122px', height: '793px', boxSizing: 'border-box', padding: '15px' }}>
          <div className="w-[48%] flex flex-col h-full gap-2 shrink-0">
             <PdfHeader sessionData={sessionData} />
             <PdfObjectives sessionData={sessionData} />
             <div className="bg-white flex justify-between items-center shrink-0">
               <span className="bg-[#cc2b2b] text-white px-3 py-1.5 rounded-md font-bold text-[10px] tracking-widest uppercase shadow-sm flex-1 mr-2 text-left">TAREAS FÍSICO-TÉCNICAS</span>
               <span className="bg-[#1a2b56] text-white font-black text-[10px] px-4 py-1.5 rounded-md shadow-sm">30 MIN</span>
             </div>
             <div className="flex-1 flex flex-col gap-2 min-h-0">
               <PdfTaskItem task={sessionCart[0]} num={1} />
               <PdfTaskItem task={sessionCart[1]} num={2} />
             </div>
          </div>
          <div className="w-[52%] flex flex-col h-full gap-2 shrink-0">
             <div className="bg-white flex justify-between items-center shrink-0">
               <span className="bg-[#1a2b56] text-white px-3 py-1.5 rounded-md font-bold text-[10px] tracking-widest uppercase shadow-sm flex-1 mr-2 text-left">TAREAS TÉCNICO - TÁCTICAS</span>
               <span className="bg-[#cc2b2b] text-white font-black text-[10px] px-4 py-1.5 rounded-md shadow-sm">15 MIN</span>
             </div>
             <div className="flex-1 flex flex-col gap-2 min-h-0">
               <PdfTaskItem task={sessionCart[2]} num={3} />
               <PdfTaskItem task={sessionCart[3]} num={4} />
             </div>
             <div className="bg-[#cc2b2b] text-white px-3 py-1.5 rounded-md shadow-sm shrink-0 flex items-center justify-center">
               <span className="font-bold text-[10px] tracking-widest uppercase">OBSERVACIONES</span>
             </div>
             <div className="h-[90px] bg-slate-50 border-[1.5px] border-[#cc2b2b] rounded-xl p-3 text-[8.5px] text-slate-800 font-medium whitespace-pre-line shrink-0 overflow-hidden">
               {String(sessionData.observaciones || "Añade notas u observaciones a la sesión...")}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, users }) {
  const author = users.find(u => u.name === task.author?.name) || task.author;
  const handleDownload = () => { const link = document.createElement('a'); link.href = task.imageUrl; link.download = `Grafico_${String(task.mainObjective || 'Tarea').replace(/\s+/g, '_')}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  
  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="bg-slate-50 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10">
        <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-black text-blue-950 uppercase tracking-tighter leading-tight">{String(task.mainObjective || task.title || '')}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">{String(task.category || 'Técnica')}</span>
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1"><Clock size={12}/> {String(task.duration || '')}</span>
              {task.visibility === 'private' && (<span className="bg-red-50 text-red-600 border border-red-200 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1"><Lock size={10}/> Privada</span>)}
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors"><X size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8 text-left">
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 flex items-center justify-center overflow-hidden relative">
              <img src={task.imageUrl} alt={task.title} className="w-full h-full object-contain max-h-[500px]" />
            </div>
            <button onClick={handleDownload} className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg transition-all"><Download size={20} /> Descargar Gráfico</button>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 mt-auto">
              <img src={author?.avatar} className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-sm" alt="author"/>
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarea creada por</p>
                <p className="text-sm font-black text-blue-950 uppercase">{String(author?.name || '')}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            <div className="col-span-1 md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-3"><Target size={16} /> Objetivo Principal</div>
              <p className="text-xl font-black text-emerald-950 leading-tight">{String(task.mainObjective || '')}</p>
            </div>
            <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-3"><List size={16} /> Objetivos Secundarios</div>
              <p className="text-sm font-bold text-blue-950 leading-relaxed">{String(task.secondaryContents || 'No se han especificado contenidos secundarios.')}</p>
            </div>
            <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-4"><BookOpen size={16} /> Descripción de Tarea</div>
              <p className="text-sm font-medium text-slate-700 whitespace-pre-line leading-loose">{String(task.description || '')}</p>
            </div>
            <div className="col-span-1 md:col-span-2 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-3"><RefreshCw size={16} /> Variantes Sugeridas</div>
              <p className="text-sm font-medium text-slate-500 italic whitespace-pre-line leading-relaxed">{String(task.variant || 'No se han añadido variantes.')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTaskView({ onTaskSaved, currentUser, editingTask, onCancelEdit, showToast }) {
  const [formData, setFormData] = useState(
    editingTask || { mainObjective: '', secondaryContents: '', description: '', variant: '', duration: '', category: 'TÉCNICA', imageUrl: '', visibility: 'public' }
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => { setFormData({ ...formData, imageUrl: String(reader.result) }); }; 
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.mainObjective.trim() || !formData.imageUrl) return showToast("El Objetivo y el Gráfico son obligatorios.", "error");
    onTaskSaved({ ...formData, id: editingTask ? editingTask.id : `manual-${Date.now()}`, title: formData.mainObjective, author: formData.author || { name: currentUser.name, avatar: currentUser.avatar }, likes: formData.likes || [], comments: [] });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-20 text-left">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">{editingTask ? 'Editar Tarea' : 'Crear Tarea Manual'}</h3>
          <p className="text-slate-500 text-sm mt-1">Añade o edita los campos y el gráfico de la tarea.</p>
        </div>
        <div className="flex items-center gap-3">
          {editingTask && <button onClick={onCancelEdit} className="px-6 py-4 rounded-2xl font-black uppercase text-slate-500 bg-slate-100 hover:bg-slate-200">Cancelar</button>}
          <button onClick={handleSubmit} className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase shadow-xl bg-red-600 text-white hover:bg-red-700"><Save size={20}/> Guardar Tarea</button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-4 flex flex-col">
           <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={18}/> Gráfico</h4>
           <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]">
             {formData.imageUrl ? (
               <>
                 <img src={formData.imageUrl} className="w-full h-full object-cover rounded-[2rem]" alt="Preview"/>
                 <div className="absolute inset-0 bg-blue-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => document.getElementById('task-image-manual').click()}><RefreshCw className="text-white w-10 h-10" /></div>
               </>
             ) : (
               <div className="cursor-pointer flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-red-400 hover:bg-red-50/30" onClick={() => document.getElementById('task-image-manual').click()}>
                 <UploadCloud className="text-slate-300 w-12 h-12 mb-3" />
                 <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Subir Imagen</span>
               </div>
             )}
             <input type="file" id="task-image-manual" accept="image/*" onChange={handleImageUpload} className="hidden" />
           </div>
           <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 shadow-sm cursor-pointer">
             <option value="TÉCNICA">Técnica</option>
             <option value="TÁCTICA">Táctica</option>
             <option value="FÍSICA">Física</option>
             <option value="EMOCIONAL">Emocional</option>
           </select>
        </div>
        <div className="w-full md:w-2/3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-5">
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo Principal *</label>
             <input type="text" className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950" placeholder="Ej: Blocaje Frontal Raso..." value={formData.mainObjective} onChange={e=>setFormData({...formData, mainObjective: e.target.value})} />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivos Secundarios</label>
             <input type="text" className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700" placeholder="Ej: Perfilamiento, control orientado..." value={formData.secondaryContents} onChange={e=>setFormData({...formData, secondaryContents: e.target.value})} />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción de Tarea</label>
             <textarea className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700 h-32 resize-none" placeholder="1. Coordinación en escalera..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
           </div>
           <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Variante</label>
               <textarea className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700 h-20 resize-none" placeholder="Ej: Cambiar lateralidad..." value={formData.variant} onChange={e=>setFormData({...formData, variant: e.target.value})} />
             </div>
             <div className="md:w-1/3 flex flex-col gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duración</label>
                 <input type="text" className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950" placeholder="Ej: 15 minutos" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibilidad</label>
                 <div className="flex gap-2 mt-1">
                   <button type="button" onClick={() => setFormData({...formData, visibility: 'public'})} className={`flex-1 py-3 px-1 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 ${formData.visibility === 'public' ? 'bg-blue-950 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}><Globe size={12}/> Pública</button>
                   <button type="button" onClick={() => setFormData({...formData, visibility: 'private'})} className={`flex-1 py-3 px-1 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 ${formData.visibility === 'private' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}><Lock size={12}/> Privada</button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function CalendarView({ savedSessions, calendarEvents, onAddEvent, onRemoveEvent, onLoadSession, showToast, onDeleteSession, onCloneSession, onEvaluateSession, onMarkAttendance }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignDate, setAssignDate] = useState({});
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear(); 
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < (startDay < 0 ? 6 : startDay); i++) days.push(null);
    // Usamos las 12:00:00 para evitar que problemas con el horario de verano cambien la fecha
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i, 12, 0, 0));
    return days;
  };

  const handleDrop = (e, date) => {
    e.preventDefault(); if (!date) return;
    const sessionId = e.dataTransfer.getData('sessionId');
    const sessionToDrop = (savedSessions || []).find(s => String(s.id) === String(sessionId));
    if (sessionToDrop) {
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      onAddEvent(dateString, sessionToDrop);
      showToast("Sesión planificada en el calendario");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const days = getDaysInMonth();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-24 text-left h-full flex flex-col animate-in fade-in">
      <div className="bg-white p-6 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Planificador Semanal</h3>
          <p className="text-slate-500 text-sm mt-1">Arrastra tus sesiones al calendario.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"><ChevronUp className="-rotate-90" size={20}/></button>
           <h4 className="font-black text-blue-950 uppercase tracking-widest w-40 text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"><ChevronDown className="-rotate-90" size={20}/></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-[2.5rem] p-6 flex flex-col min-h-[500px] overflow-hidden">
           <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
             {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={`header-${d}`} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-2 rounded-xl hidden md:block">{String(d)}</div>)}
             {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => <div key={`header-m-${i}`} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-2 rounded-xl md:hidden">{String(d)}</div>)}
           </div>
           
           <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1 min-h-0" style={{ gridTemplateRows: `repeat(${Math.ceil(days.length / 7)}, minmax(0, 1fr))` }}>
             {days.map((date, idx) => {
               if (!date) return <div key={`empty-${idx}`} className="bg-transparent rounded-xl border border-dashed border-slate-100"></div>;
               const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
               const dayEvents = calendarEvents[dateString] || [];
               
               const todayDateObj = new Date();
               const isToday = date.getDate() === todayDateObj.getDate() && date.getMonth() === todayDateObj.getMonth() && date.getFullYear() === todayDateObj.getFullYear();

               return (
                 <div key={`day-${idx}-${dateString}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, date)} className={`bg-slate-50 rounded-xl border p-1 md:p-2 flex flex-col transition-all overflow-hidden h-full min-h-0 ${isToday ? 'border-red-400 shadow-inner bg-red-50/20' : 'border-slate-200 hover:bg-slate-100/50'}`}>
                   <span className={`text-[10px] md:text-xs font-black text-center shrink-0 mb-1 ${isToday ? 'text-red-600' : 'text-slate-400'}`}>{date.getDate()}</span>
                   
                   <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 min-h-0">
                     {dayEvents.map((sessionItem, sIdx) => {
                       let sessionNum = sessionItem.data?.sessionNumber;
                       if (!sessionNum || String(sessionNum).trim() === '') {
                         const match = String(sessionItem.name || '').match(/\d+º?/);
                         sessionNum = match ? match[0] : '--';
                       }
                       return (
                         <div key={`event-${sessionItem.id}-${dateString}-${sIdx}`} onClick={() => onLoadSession(sessionItem)} className="bg-blue-950 rounded-md md:rounded-lg p-1 shadow-sm relative cursor-pointer hover:bg-blue-900 transition-colors flex flex-col items-center justify-center shrink-0 min-h-[40px] group border border-blue-800" title={String(sessionItem.name || 'Ver Sesión')}>
                           <div className="absolute top-0.5 left-0.5 right-0.5 flex justify-between z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); onMarkAttendance(sessionItem, dateString); }} className="text-white hover:text-emerald-400 p-0.5" title="Pasar Lista">
                                 <UserCheck size={10} strokeWidth={2}/>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onRemoveEvent(dateString, sessionItem.id); }} className="text-white/50 hover:text-red-400 p-0.5" title="Quitar del calendario">
                                 <X size={10} strokeWidth={2}/>
                              </button>
                           </div>
                           <div className="flex flex-col items-center justify-center mt-2 pointer-events-none">
                              <span className="text-blue-300 text-[5px] md:text-[6px] font-bold uppercase leading-none tracking-widest mb-0.5">
                                SESIÓN
                              </span>
                              <span className="text-white text-[9px] md:text-[10px] font-black uppercase leading-none">
                                {String(sessionNum)}
                              </span>
                           </div>
                           {sessionItem.attendance && (
                              <div className="absolute bottom-0.5 right-0.5 text-emerald-400" title="Lista pasada">
                                 <CheckCircle2 size={8} strokeWidth={3} />
                              </div>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* --- BARRA LATERAL DE SESIONES GUARDADAS --- */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[300px] overflow-hidden">
            <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-2 shrink-0 flex items-center gap-2">
              <FolderArchive size={18}/> Mis Sesiones
            </h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 shrink-0">
              Arrastra o selecciona fecha
            </p>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {(!savedSessions || savedSessions.length === 0) ? (
                <div className="py-10 text-slate-300 font-bold uppercase tracking-widest text-[10px] text-center border-2 border-dashed border-slate-200 rounded-[1.5rem]">
                  Sin sesiones guardadas
                </div>
              ) : (
                savedSessions.map(s => {
                  const todayObj = new Date();
                  const localToday = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
                  
                  return (
                  <div 
                    key={`saved-${s.id}`} 
                    draggable={true} 
                    onDragStart={(e) => e.dataTransfer.setData('sessionId', String(s.id))}
                    className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="cursor-grab active:cursor-grabbing flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-blue-950 text-xs uppercase truncate group-hover:text-blue-600 transition-colors" title={String(s.name)}>
                          {String(s.name)}
                        </h5>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Clock size={10}/> {s.cart?.filter(Boolean).length || 0} tareas
                        </span>
                      </div>
                    </div>
                    
                    {/* Botones de acción siempre visibles */}
                    <div className="flex flex-col gap-2 mt-3">
                       <div className="flex gap-1">
                          <button onClick={() => onLoadSession(s)} className="flex items-center justify-center gap-1 p-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 shadow-md flex-1" title="Editar Sesión"><Edit2 size={12}/> <span className="text-[8px] font-bold uppercase">Editar</span></button>
                          <button onClick={() => onCloneSession && onCloneSession(s)} className="flex items-center justify-center gap-1 p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-100 shadow-sm flex-1" title="Duplicar Sesión"><Copy size={12}/> <span className="text-[8px] font-bold uppercase">Clonar</span></button>
                          <button onClick={() => onDeleteSession && onDeleteSession(s)} className="flex items-center justify-center gap-1 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 shadow-sm flex-1" title="Eliminar"><Trash2 size={12}/> <span className="text-[8px] font-bold uppercase">Borrar</span></button>
                       </div>
                       <div className="flex items-center gap-1 mt-1 border-t border-slate-200 pt-2">
                          <input 
                            type="date" 
                            value={assignDate[s.id] || ''} 
                            onChange={(e) => setAssignDate({...assignDate, [s.id]: e.target.value})} 
                            className="text-[10px] font-bold text-slate-600 p-1.5 border border-slate-200 rounded-lg flex-1 outline-none focus:border-blue-400 bg-white"
                          />
                          <button 
                            onClick={() => {
                               if(assignDate[s.id]) {
                                  onAddEvent(assignDate[s.id], s);
                                  showToast("Sesión añadida al " + assignDate[s.id]);
                                  setAssignDate({...assignDate, [s.id]: ''});
                               } else {
                                  showToast("Selecciona una fecha primero", "error");
                               }
                            }}
                            className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1 px-2"
                            title="Añadir a fecha seleccionada"
                          >
                            <Plus size={14}/>
                          </button>
                          {/* 6 puntos (GripVertical) para la asistencia */}
                          <button onClick={() => onMarkAttendance(s, assignDate[s.id] || localToday)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors" title="Pasar Asistencia">
                            <GripVertical size={16} />
                          </button>
                       </div>
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceModal({ sessionObj, squad, onClose, onSave, showToast }) {
  const { sessionItem, dateString } = sessionObj;
  const sessionGks = squad.filter(gk => sessionItem.data?.gkIds?.includes(gk.id));
  const [attendance, setAttendance] = useState(sessionItem.attendance || sessionGks.reduce((acc, gk) => ({...acc, [gk.id]: true}), {}));

  const handleSave = () => {
     onSave(sessionItem.id, dateString, attendance);
     showToast("Asistencia guardada con éxito");
     onClose();
  };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[400] flex items-center justify-center p-4">
       <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative text-left animate-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100"><UserCheck size={18}/></div>
             <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter leading-none">Pasar Lista</h3>
          </div>
          <p className="text-slate-500 font-medium text-xs mb-6 truncate pl-13">{String(sessionItem.name || '')}</p>

          {sessionGks.length === 0 ? (
             <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs py-8 border-2 border-dashed border-slate-200 rounded-[2rem]">No hay porteros convocados</p>
          ) : (
             <div className="space-y-3 mb-6">
                {sessionGks.map(gk => (
                   <div key={`att-${gk.id}`} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                         <img src={gk.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200" alt="avatar" />
                         <span className="text-[10px] font-black text-blue-950 uppercase">{String(gk.name || '')}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setAttendance({...attendance, [gk.id]: true})} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${attendance[gk.id] ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-200 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'}`} title="Asistió"><Check size={14} strokeWidth={3}/></button>
                         <button onClick={() => setAttendance({...attendance, [gk.id]: false})} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!attendance[gk.id] ? 'bg-red-500 text-white shadow-md' : 'bg-slate-200 text-slate-400 hover:bg-red-100 hover:text-red-600'}`} title="No Asistió"><X size={14} strokeWidth={3}/></button>
                      </div>
                   </div>
                ))}
             </div>
          )}
          <button onClick={handleSave} className="w-full py-4 rounded-2xl font-black text-white bg-blue-950 hover:bg-blue-900 shadow-lg uppercase text-xs tracking-widest transition-colors">Guardar Asistencia</button>
       </div>
    </div>
  )
}

function AIAssistantModal({ onClose, tasks, setSessionCart, sessionData, setSessionData, setActiveTab, showToast }) {
  const [goalkeepers, setGoalkeepers] = useState('');
  const [mainObj, setMainObj] = useState('');
  const [tacticalObj, setTacticalObj] = useState('');
  const [taskCount, setTaskCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSession = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let scoredTasks = tasks.map(t => {
        let score = 0;
        const textToSearch = `${t.title} ${t.mainObjective} ${t.secondaryContents} ${t.category} ${t.description}`.toLowerCase();
        if (mainObj && textToSearch.includes(mainObj.toLowerCase())) score += 3;
        if (tacticalObj && textToSearch.includes(tacticalObj.toLowerCase())) score += 2;
        score += Math.random(); 
        return { ...t, score };
      });
      scoredTasks.sort((a, b) => b.score - a.score);
      const pickedTasks = scoredTasks.slice(0, taskCount).map(t => { const { score, ...rest } = t; return rest; });
      if (pickedTasks.length === 0) { showToast("No hay suficientes tareas", "error"); setIsGenerating(false); return; }
      
      setSessionData({ 
        ...sessionData, 
        goalkeepers: goalkeepers || sessionData.goalkeepers, 
        objTecnico: mainObj ? `• Trabajo Principal: ${mainObj}\n• Perfilamiento\n• Blocajes` : sessionData.objTecnico, 
        objTactico: tacticalObj ? `• Concepto: ${tacticalObj}\n• Reubicación\n• Lectura de juego` : sessionData.objTactico 
      });
      
      const newCart = [null, null, null, null];
      pickedTasks.forEach((t, i) => { if(i < 4) newCart[i] = t; });
      setSessionCart(newCart); 
      
      setIsGenerating(false); 
      showToast(`¡Sesión generada con ${pickedTasks.length} tareas!`, "success"); 
      setActiveTab('builder'); 
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
       <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          <div className="bg-blue-950 p-6 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><BrainCircuit size={20} className="text-blue-200"/></div>
              <div><h3 className="font-black uppercase tracking-widest text-sm">Asistente Inteligente</h3><p className="text-[10px] text-blue-300">Generador Automático</p></div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500 rounded-full transition-colors"><X size={16}/></button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-5 text-left">
             <p className="text-xs font-medium text-slate-500 mb-2">Rellena los criterios y montaré la sesión completa al instante buscando en tu biblioteca.</p>
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Porteros Convocados</label>
                  <input type="text" className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 text-xs" placeholder="Ej: Jorge, Francisco..." value={goalkeepers} onChange={e=>setGoalkeepers(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Objetivo Principal (Técnico)</label>
                  <input type="text" className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 text-xs" placeholder="Ej: Blocaje lateral raso..." value={mainObj} onChange={e=>setMainObj(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Objetivo Táctico (Opcional)</label>
                  <input type="text" className="w-full p-4 mt-1 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 text-xs" placeholder="Ej: Coberturas..." value={tacticalObj} onChange={e=>setTacticalObj(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex justify-between"><span>Cantidad de tareas</span><span className="text-blue-950 text-sm">{taskCount}</span></label>
                  <input type="range" min="1" max="4" value={taskCount} onChange={(e) => setTaskCount(Number(e.target.value))} className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <button onClick={generateSession} disabled={isGenerating} className="w-full py-4 mt-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 shadow-lg uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                  {isGenerating ? <RefreshCw size={16} className="animate-spin"/> : <Zap size={16}/>} {isGenerating ? 'Analizando...' : 'Generar Sesión'}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}

function UploadView({ onTasksExtracted, currentUser, showToast }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const fileInputRef = useRef(null);

  const getBase64 = (file) => new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
  
  const extractDataFromImage = async (base64Image) => {
    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.match(/data:(.*?);/)[1] || "image/png";

    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: "Extrae la información de esta ficha de entrenamiento de fútbol. Completa exactamente los campos en formato JSON: 'mainObjective' (Objetivo principal), 'secondaryContents' (Contenidos secundarios), 'description' (Descripción detallada con todos los pasos numéricos), 'variant' (Variante o Variantes), 'duration' (Duración en minutos). Si algún campo no aparece, devuélvelo vacío." },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            mainObjective: { type: "STRING" },
            secondaryContents: { type: "STRING" },
            description: { type: "STRING" },
            variant: { type: "STRING" },
            duration: { type: "STRING" }
          }
        }
      }
    };

    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let attempt = 0; attempt <= 5; attempt++) {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("API Error");
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
        return null;
      } catch (error) {
        if (attempt === 5) { console.error("Error al extraer texto de la imagen"); return null; }
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  };

  const cropImageReal = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const cropX = img.width * 0.385; 
        const cropWidth = img.width - cropX;
        canvas.width = cropWidth; canvas.height = img.height;
        ctx.drawImage(img, cropX, 0, cropWidth, img.height, 0, 0, cropWidth, img.height);
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const extractedTasks = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const fullBase64 = await getBase64(files[i]);
        const croppedUrl = await cropImageReal(files[i]);
        const ocrData = await extractDataFromImage(fullBase64);
        const fallbackData = mockOcrDatabase[i % mockOcrDatabase.length];
        const finalData = ocrData || fallbackData;
        extractedTasks.push({ 
          ...finalData, id: `ext-${Date.now()}-${i}`, title: finalData.mainObjective || 'Tarea sin título', 
          imageUrl: croppedUrl, visibility: visibility, category: 'TÉCNICA', author: { name: currentUser.name, avatar: currentUser.avatar }, likes: [], isAutoCropped: true 
        });
      } catch (err) { console.error("Error procesando fichero", err); }
    }
    setIsProcessing(false); onTasksExtracted(extractedTasks); showToast(`Se han procesado ${extractedTasks.length} tareas correctamente`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center md:pb-10 pb-24 animate-in fade-in">
      <div className="bg-white p-14 rounded-[3.5rem] border shadow-2xl border-slate-100">
        <UploadCloud size={60} className="text-blue-600 mx-auto mb-6" />
        <h3 className="text-3xl font-black text-blue-950 uppercase italic mb-3 leading-tight">Procesador de tareas</h3>
        <p className="text-slate-400 mb-8 font-medium px-4">Recorte inteligente de gráficos y extracción automática de datos con IA.</p>
        
        {!isProcessing && (
          <div className="mb-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Visibilidad de las tareas extraídas</label>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => setVisibility('public')} className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 ${visibility === 'public' ? 'bg-blue-950 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}><Globe size={14}/> Pública</button>
              <button type="button" onClick={() => setVisibility('private')} className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 ${visibility === 'private' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}><Lock size={14}/> Privada (Solo yo)</button>
            </div>
          </div>
        )}

        {!isProcessing ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 hover:border-red-500 cursor-pointer transition-all bg-slate-50/50 hover:bg-red-50/30 group">
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files)} />
            <p className="font-black text-slate-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">SUBIR CAPTURA DE TAREA</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <RefreshCw className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <h4 className="font-black text-xl uppercase italic">EXTRAYENDO DATOS...</h4>
          </div>
        )}
      </div>
    </div>
  );
}

function TrashView({ trashedTasks, onRestoreTask, onDeleteTaskForever, trashedSessions, onRestoreSession, onDeleteSessionForever }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-24 text-left animate-in fade-in">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div><h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Papelera de Reciclaje</h3><p className="text-slate-500 text-sm mt-1">Recupera elementos eliminados o bórralos definitivamente.</p></div>
      </div>
      
      {/* TAREAS */}
      <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest pl-4 mt-6">Tareas Eliminadas</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-6">
        {trashedTasks.length === 0 ? (<div className="col-span-full py-10 text-slate-300 font-bold uppercase tracking-widest text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">No hay tareas en la papelera</div>) : (
          trashedTasks.map(t => (
            <div key={`trash-task-${t.id}`} className="relative group bg-white rounded-[2.5rem] border-2 shadow-sm border-slate-100 flex flex-col text-left opacity-75 hover:opacity-100 transition-opacity">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-100 transition-opacity">
                <button onClick={() => { onRestoreTask(t); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-emerald-500 text-white hover:bg-emerald-600" title="Restaurar Tarea"><ArchiveRestore size={14} strokeWidth={3}/></button>
                <button onClick={() => { if(window.confirm('¿Eliminar DEFINITIVAMENTE? Esta acción no se puede deshacer.')) { onDeleteTaskForever(t); } }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-red-600 text-white hover:bg-red-700" title="Eliminar definitivamente"><Trash2 size={14} strokeWidth={3}/></button>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-[2.5rem]"><img src={t.imageUrl} className="w-full h-full object-cover grayscale" alt="img"/></div>
              <div className="p-5 flex-1 flex flex-col"><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{String(t.category || 'Técnica')}</div><h3 className="font-black text-slate-500 uppercase text-sm line-clamp-2 leading-tight min-h-[2.5rem] line-through">{String(t.mainObjective || t.title || '')}</h3></div>
            </div>
          ))
        )}
      </div>

      {/* SESIONES */}
      <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest pl-4 border-t border-slate-200 pt-6">Sesiones Eliminadas</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
         {trashedSessions.length === 0 ? (<div className="col-span-full py-10 text-slate-300 font-bold uppercase tracking-widest text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">No hay sesiones en la papelera</div>) : (
            trashedSessions.map(s => (
              <div key={`trash-sess-${s.id}`} className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col group opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0"><FolderArchive size={16} /></div>
                    <div>
                      <h4 className="font-black text-slate-500 uppercase text-sm tracking-tight line-through">{String(s.name || '')}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-1">Eliminada de: {String(s.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-100 transition-opacity">
                     <button onClick={() => { onRestoreSession(s); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-emerald-500 text-white hover:bg-emerald-600"><ArchiveRestore size={14} strokeWidth={3}/></button>
                     <button onClick={() => {
                         if(window.confirm('¿Eliminar DEFINITIVAMENTE la sesión? Esta acción no se puede deshacer.')) {
                           onDeleteSessionForever(s);
                         }
                     }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-red-600 text-white hover:bg-red-700"><Trash2 size={14} strokeWidth={3}/></button>
                  </div>
                </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
}

function SessionsHistoryView({ savedSessions, onLoadSession, onDeleteSession, onCloneSession, onEvaluateSession }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in md:pb-10 pb-24 text-left">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div><h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Mis Sesiones Guardadas</h3><p className="text-slate-500 text-sm mt-1">Historial de plantillas para reutilizar estructuras o evaluarlas.</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(!savedSessions || savedSessions.length === 0) ? (<div className="col-span-full p-10 text-center text-slate-300 font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-[2.5rem]">Aún no has guardado ninguna plantilla</div>) : (
          savedSessions.map((s, idx) => (
            <div key={`hist-${s.id}-${idx}`} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><FolderArchive size={20} /></div><div><h4 className="font-black text-blue-950 uppercase text-sm tracking-tight leading-tight">{String(s.name || '')}</h4><p className="text-xs font-medium text-slate-500 mt-1">Guardada el: {String(s.date || '')} • {s.cart?.filter(Boolean).length || 0} tareas</p></div></div>
              </div>
              <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center transition-opacity">
                   <button onClick={() => onEvaluateSession(s)} className="flex items-center justify-center gap-1.5 p-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 border border-yellow-100 shadow-sm flex-1" title="Evaluar Sesión"><MessageSquareQuote size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Evaluar</span></button>
                   <button onClick={() => onCloneSession(s)} className="flex items-center justify-center gap-1.5 p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 border border-emerald-100 shadow-sm flex-1" title="Duplicar Sesión"><Copy size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Clonar</span></button>
                   <button onClick={() => onLoadSession(s)} className="flex items-center justify-center gap-1.5 p-2 bg-blue-950 text-white rounded-xl hover:bg-blue-900 shadow-md flex-1" title="Editar Sesión"><Edit2 size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Editar</span></button>
                   <button onClick={() => onDeleteSession(s)} className="flex items-center justify-center gap-1.5 p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-100 shadow-sm flex-1" title="Eliminar"><Trash2 size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Borrar</span></button>
              </div>
              {s.rating && (
                <div className="mt-4 bg-slate-50 rounded-2xl p-3 border border-slate-100 animate-in fade-in">
                  <div className="flex items-center gap-1 mb-1"><Star size={12} fill="#eab308" className="text-yellow-500" /><span className="font-black text-xs text-blue-950">{s.rating}/10</span></div>
                  {s.evaluationComment && <p className="text-[10px] text-slate-500 italic line-clamp-2">"{String(s.evaluationComment)}"</p>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChatView({ messages, onSendMessage, currentUser, users, onClose }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (e) => {
    e.preventDefault(); if (!newMessage.trim()) return;
    onSendMessage(String(newMessage));
    setNewMessage('');
  };

  return (
    <div className="w-[360px] h-[550px] max-h-[80vh] flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-blue-950 p-4 text-white flex justify-between items-center shrink-0">
         <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><MessageSquare size={20} className="text-blue-200"/></div><div className="text-left"><h3 className="text-base font-black uppercase italic tracking-tighter leading-tight">Chat Departamento de Porteros</h3><p className="text-blue-300 text-[10px] font-medium mt-1">En línea</p></div></div>
         <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500 rounded-full md:hidden"><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => {
          const sender = users.find(u => String(u.id) === String(msg.senderId)) || { name: 'Desconocido', avatar: '' };
          const isMe = String(msg.senderId) === String(currentUser?.id);
          return (
            <div key={`msg-${msg.id}`} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}><img src={sender.avatar || FALLBACK_LOGO} className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200" alt="avatar"/><div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[8px] font-black text-slate-500 uppercase">{isMe ? 'Tú' : String(sender?.name || 'User').split(' ')[0]}</span>
                <span className="text-[7px] font-bold text-slate-400">{String(msg.timestamp)}</span>
              </div>
              <div className={`px-3 py-2 rounded-2xl shadow-sm text-[10px] font-medium leading-relaxed ${isMe ? 'bg-blue-950 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                {String(msg.text)}
              </div>
            </div></div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input type="text" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-blue-950 font-medium text-xs" placeholder="Mensaje..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
          <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white rounded-full flex items-center justify-center"><Send size={16} className="ml-0.5" /></button>
        </form>
      </div>
    </div>
  );
}

function LoginView({ users, onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState('');
  
  const submit = (e) => {
    e.preventDefault();
    const user = users.find(x => String(x.username) === String(u) && String(x.password) === String(p));
    if (user) { 
      if(!user.active) return setError("Cuenta desactivada."); 
      onLogin(user); 
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };
  
  return (
    <div className="h-screen w-full bg-blue-950 flex items-center justify-center px-4 relative overflow-hidden text-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(203,53,36,0.1),transparent_80%)] pointer-events-none"></div>
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl max-w-sm w-full flex flex-col items-center z-10">
        <img src={LOGO_ATM_URL} className="h-24 mb-6 drop-shadow-xl" alt="ATM" onError={(e)=>e.target.src=FALLBACK_LOGO}/>
        <h1 className="text-white text-2xl font-black italic uppercase mb-8 tracking-tighter">BiblioKeepers <span className="text-red-500">ATM</span></h1>
        <form onSubmit={submit} className="w-full space-y-4">
          <input type="text" placeholder="Usuario" className="w-full p-4 rounded-2xl bg-white/10 text-white border border-white/10 outline-none focus:ring-2 focus:ring-red-500" value={u} onChange={e=>setU(e.target.value)}/>
          <input type="password" placeholder="Contraseña" className="w-full p-4 rounded-2xl bg-white/10 text-white border border-white/10 outline-none focus:ring-2 focus:ring-red-500" value={p} onChange={e=>setP(e.target.value)}/>
          {error && <p className="text-red-400 text-xs font-bold text-center">{String(error)}</p>}
          <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 uppercase tracking-widest shadow-lg">Entrar</button>
        </form>
      </div>
    </div>
  );
}

function AdminView({ users, onSaveUser, onToggleUserActive }) {
  const [isModal, setIsModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', avatar: '' });

  const handleImageUpload = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => { setFormData({ ...formData, avatar: String(reader.result) }); }; 
      reader.readAsDataURL(file); 
    } 
  };
  
  const save = () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) return alert("Rellena todos los campos.");
    const finalAvatar = formData.avatar || (editUser ? editUser.avatar : `https://ui-avatars.com/api/?name=${formData.name.replace(/\s+/g, '+')}&background=CB3524&color=fff`);
    const userToSave = editUser ? {...editUser, name: formData.name, username: formData.username, password: formData.password, avatar: finalAvatar} : { id: Date.now().toString(), name: formData.name, username: formData.username, password: formData.password, role: 'coach', active: true, avatar: finalAvatar };
    onSaveUser(userToSave);
    setIsModal(false); setFormData({ name: '', username: '', password: '', avatar: '' }); setEditUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-20 text-left">
      <div className="bg-white p-8 rounded-[2.5rem] border flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-950">Gestión de Entrenadores</h3>
          <p className="text-slate-400 text-sm">Control de accesos y perfiles técnicos.</p>
        </div>
        <button onClick={()=>{setEditUser(null); setFormData({name:'', username:'', password:'', avatar:''}); setIsModal(true)}} className="bg-blue-950 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 uppercase text-xs shadow-md">
          <UserPlus size={16}/> Nuevo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={`user-${u.id}`} className="bg-white p-4 rounded-[2rem] border flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <img src={u.avatar} className="w-14 h-14 rounded-full border border-slate-200 object-cover" alt="avatar"/>
              <div className="text-left">
                <p className="font-black text-sm text-blue-950">{String(u.name || '')}</p>
                <p className="text-xs font-medium text-slate-500">@{String(u.username || '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pr-2">
              <button onClick={()=>{setEditUser(u); setFormData({name:u.name, username:u.username, password:u.password, avatar: ''}); setIsModal(true)}} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg"><Edit2 size={16}/></button>
              {u.role !== 'admin' && <button onClick={()=>onToggleUserActive(u.id, !u.active)} className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${u.active?'bg-emerald-500':'bg-slate-300'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${u.active?'left-[26px]':'left-0.5'}`}/></button>}
            </div>
          </div>
        ))}
      </div>

      {isModal && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] max-w-sm w-full space-y-5 shadow-2xl relative">
             <h4 className="font-black uppercase italic text-blue-950 border-b border-slate-100 pb-3">{editUser ? 'Editar Perfil' : 'Nuevo Entrenador'}</h4>
             <div className="flex items-center gap-4 py-2">
               <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
                 {formData.avatar || (editUser && editUser.avatar) ? <><img src={formData.avatar || editUser.avatar} className="w-full h-full object-cover" alt="avatar" /><div onClick={() => setFormData({...formData, avatar: ''})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"><X size={20} className="text-white" /></div></> : <ImageIcon size={20} className="text-slate-400" />}
               </div>
               <div className="flex-1">
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
                 <label htmlFor="avatar-upload" className="cursor-pointer bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl block text-center text-xs w-full shadow-sm">Subir Foto</label>
               </div>
             </div>
             <div className="space-y-3">
               <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Nombre completo" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/>
               <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Usuario" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})}/>
               <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Contraseña" type="text" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})}/>
             </div>
             <div className="pt-4 space-y-2">
               <button onClick={save} className="w-full bg-blue-950 text-white font-black py-4 rounded-2xl uppercase shadow-lg hover:bg-blue-900">Guardar Cambios</button>
               <button onClick={()=>{setIsModal(false); setFormData({name:'', username:'', password:'', avatar:''}); setEditUser(null);}} className="w-full text-slate-400 font-bold py-3 hover:text-red-500">Cancelar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE PRINCIPAL APP ---

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [fbUser, setFbUser] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [squad, setSquad] = useState([]);
  const [savedSessionsState, setSavedSessionsState] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);
  const [calendarEventsState, setCalendarEventsState] = useState({});
  const [messages, setMessages] = useState([]);
  
  const [activeTab, setActiveTab] = useState('home');
  const [libraryView, setLibraryView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sessionCart, setSessionCart] = useState([null, null, null, null]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [evaluatingSession, setEvaluatingSession] = useState(null); 
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessagesLength = useRef(0);
  const [toasts, setToasts] = useState([]);
  const [sessionData, setSessionData] = useState({ ...DEFAULT_SESSION_DATA });

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg: String(msg), type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    const script1 = document.createElement('script'); script1.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; script1.async = true; document.body.appendChild(script1);
    const script2 = document.createElement('script'); script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; script2.async = true; document.body.appendChild(script2);
    
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
      prevMessagesLength.current = messages.length;
    } else {
      const newMessagesCount = messages.length - prevMessagesLength.current;
      if (newMessagesCount > 0) {
        const newMsgs = messages.slice(prevMessagesLength.current);
        const unread = newMsgs.filter(m => String(m.senderId) !== String(currentUser?.id)).length;
        if (unread > 0) setUnreadCount(prev => prev + unread);
      }
      prevMessagesLength.current = messages.length;
    }
  }, [messages, isChatOpen, currentUser]);

  useEffect(() => {
    const initAuth = async () => {
       try {
           if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
               await signInWithCustomToken(auth, __initial_auth_token);
           } else {
               await signInAnonymously(auth);
           }
       } catch(e) { console.error("Firebase Auth Error", e); }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, user => {
       setFbUser(user);
       if(user) {
          const seed = async () => {
             try {
                 const snap = await getDocs(getColl('users'));
                 if(snap.empty) {
                    mockUsersInitial.forEach(u => setDoc(getDocRef('users', u.id), u));
                    initialTasksData.forEach(t => setDoc(getDocRef('tasks', t.id), t));
                    initialGoalkeepers.forEach(gk => setDoc(getDocRef('goalkeepers', gk.id), gk));
                 }
             } catch (err) { console.error("Error seeding DB", err); }
          };
          seed();
       }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
     if(!fbUser) return;
     const unsubUsers = onSnapshot(getColl('users'), snap => setUsers(snap.docs.map(d => ({...d.data(), id: Number(d.id)||d.id}))));
     const unsubTasks = onSnapshot(getColl('tasks'), snap => {
        const all = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setTasks(all.filter(t => !t.trashed));
        setTrashedTasks(all.filter(t => t.trashed));
     });
     const unsubSquad = onSnapshot(getColl('goalkeepers'), snap => setSquad(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
     const unsubSessions = onSnapshot(getColl('sessions'), snap => {
        const all = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setSavedSessionsState(all.filter(s => !s.trashed));
        setTrashedSessions(all.filter(s => s.trashed));
     });
     const unsubEvents = onSnapshot(getColl('calendarEvents'), snap => {
        const globalEvents = {};
        snap.docs.forEach(d => { globalEvents[d.id] = d.data().events || []; });
        setCalendarEventsState(globalEvents);
     });
     const unsubMessages = onSnapshot(query(getColl('messages'), orderBy('createdAt', 'asc')), snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

     return () => { unsubUsers(); unsubTasks(); unsubSquad(); unsubSessions(); unsubEvents(); unsubMessages(); }
  }, [fbUser]);

  const handleSaveUser = async (user) => await setDoc(getDocRef('users', user.id), cleanData(user));
  const handleToggleUserActive = async (id, active) => await updateDoc(getDocRef('users', id), { active });
  const handleSaveTask = async (task) => await setDoc(getDocRef('tasks', task.id), cleanData(task), { merge: true });
  const handleTrashTask = async (taskId) => { await updateDoc(getDocRef('tasks', taskId), { trashed: true }); showToast("Enviada a papelera", "success"); };
  const handleRestoreTask = async (task) => { await updateDoc(getDocRef('tasks', task.id), { trashed: false }); showToast("Tarea restaurada"); };
  const handleDeleteTaskForever = async (task) => { await deleteDoc(getDocRef('tasks', task.id)); showToast("Tarea eliminada para siempre", "success"); };

  const toggleFavorite = async (taskId, e) => {
    e.stopPropagation();
    const task = tasks.find(t => String(t.id) === String(taskId));
    if(!task) return;
    const likes = task.likes || [];
    const newLikes = likes.includes(liveUser.username) ? likes.filter(u => u !== liveUser.username) : [...likes, liveUser.username];
    await updateDoc(getDocRef('tasks', taskId), { likes: newLikes });
  };
  
  const handleCloneTask = async (task) => {
    const cloned = { ...task, id: `clone-${Date.now()}`, title: `${task.title} (Copia)`, mainObjective: `${task.mainObjective} (Copia)`, author: { name: liveUser.name, avatar: liveUser.avatar }, likes: [], comments: [] };
    await setDoc(getDocRef('tasks', cloned.id), cleanData(cloned));
    showToast("Tarea duplicada correctamente");
  };
  
  const handleSaveGk = async (gkData) => await setDoc(getDocRef('goalkeepers', gkData.id), cleanData(gkData));
  const handleDeleteGk = async (id) => await deleteDoc(getDocRef('goalkeepers', id));

  const handleSaveTemplate = async (session) => {
    try {
        await setDoc(getDocRef('sessions', session.id), cleanData(session));
        showToast("Plantilla guardada en la nube.");
    } catch(e) {
        showToast("Error guardando sesión.", "error");
    }
  };
  const handleTrashSession = async (sessionId) => { await updateDoc(getDocRef('sessions', sessionId), { trashed: true }); showToast("Sesión enviada a papelera", "success"); };
  const handleRestoreSession = async (session) => { await updateDoc(getDocRef('sessions', session.id), { trashed: false }); showToast("Sesión restaurada"); };
  const handleDeleteSessionForever = async (session) => { await deleteDoc(getDocRef('sessions', session.id)); showToast("Sesión eliminada para siempre", "success"); };
  const handleCloneSession = async (session) => {
    const cloned = { ...session, id: Date.now().toString(), name: `${session.name} (Copia)`, date: new Date().toLocaleDateString() };
    await setDoc(getDocRef('sessions', cloned.id), cleanData(cloned));
    showToast("Sesión duplicada correctamente");
  };
  const handleSaveEvaluation = async (sessionId, rating, comment, gkRatings) => {
    await updateDoc(getDocRef('sessions', sessionId), { rating, evaluationComment: comment, gkRatings: cleanData(gkRatings) });
    if(gkRatings) {
       for(let gkId in gkRatings) {
          const gk = squad.find(g => String(g.id) === String(gkId));
          if(gk) {
             const newHistory = [...(gk.history||[]), { sessionId, date: new Date().toLocaleDateString(), rating: gkRatings[gkId], comment }];
             await updateDoc(getDocRef('goalkeepers', gkId), { history: cleanData(newHistory) });
          }
       }
    }
    showToast("Evaluación guardada");
  };

  const handleAddEvent = async (dateString, session) => {
    const existing = calendarEventsState[dateString] || [];
    if(!existing.find(s => String(s.id) === String(session.id))) {
       await setDoc(getDocRef('calendarEvents', dateString), { events: cleanData([...existing, session]) }, { merge: true });
    }
  };
  const handleRemoveEvent = async (dateString, sessionId) => {
    const existing = calendarEventsState[dateString] || [];
    await setDoc(getDocRef('calendarEvents', dateString), { events: cleanData(existing.filter(s => String(s.id) !== String(sessionId))) }, { merge: true });
    showToast("Sesión desasignada del día");
  };
  const handleSaveAttendance = async (eventId, dateString, attendanceMap) => {
    const existing = calendarEventsState[dateString] || [];
    const newEvents = existing.map(s => String(s.id) === String(eventId) ? { ...s, attendance: attendanceMap } : s);
    await setDoc(getDocRef('calendarEvents', dateString), { events: cleanData(newEvents) }, { merge: true });
    showToast("Asistencia guardada con éxito");
  };

  const handleSendMessage = async (text) => {
    await addDoc(getColl('messages'), { senderId: currentUser.id, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), createdAt: Date.now() });
  };

  if (!currentUser) return <LoginView users={users} onLogin={setCurrentUser} />;
  const liveUser = users.find(u => u.id == currentUser.id) || currentUser;

  const filteredTasks = tasks.filter(task => {
    const s = String(searchQuery || "").toLowerCase();
    const matchesSearch = String(task.title || "").toLowerCase().includes(s) || String(task.mainObjective || "").toLowerCase().includes(s);
    const matchesCategory = filterCategory ? task.category === filterCategory : true;
    const matchesAuthor = filterAuthor ? task.author?.name === filterAuthor : true;
    const matchesFavorites = showFavoritesOnly ? task.likes?.includes(liveUser.username) : true;
    const isVisibleToUser = (!task.visibility || task.visibility === 'public') || task.author?.name === liveUser.name;
    return matchesSearch && matchesCategory && matchesAuthor && matchesFavorites && isVisibleToUser;
  });

  const activeCartCount = sessionCart.filter(Boolean).length;

  const NAV_ITEMS = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'squad', label: 'Plantilla', icon: Shield, adminOnly: true },
    { divider: true, adminOnly: true },
    { id: 'library', label: 'Biblioteca', icon: Search, action: () => { setActiveTab('library'); setShowFavoritesOnly(false); setEditingTask(null); } },
    { id: 'favs', label: 'Mis Favoritos', icon: Star, action: () => { setActiveTab('library'); setShowFavoritesOnly(true); setEditingTask(null); } },
    { divider: true },
    { id: 'builder', label: 'Sesión', icon: FileStack, badge: activeCartCount },
    { id: 'calendar', label: 'Planificador', icon: CalendarIcon },
    { divider: true },
    { id: 'create', label: 'Crear Tarea', icon: ListPlus },
    { id: 'upload', label: 'Subir Tarea', icon: UploadCloud },
    { divider: true, adminOnly: true },
    { id: 'admin', label: 'Entrenadores', icon: Users, adminOnly: true },
    { id: 'trash', label: 'Papelera', icon: Trash2, adminOnly: true }
  ];

  const handleNavClick = (item) => {
    if (item.action) { item.action(); return; }
    setActiveTab(item.id); setEditingTask(null);
  };

  const handleLogout = () => { setCurrentUser(null); setActiveTab('home'); setIsChatOpen(false); setIsAIOpen(false); setEditingTask(null); setSessionCart([null, null, null, null]); setSessionData({ ...DEFAULT_SESSION_DATA }); setUnreadCount(0); };
  
  const loadSession = (session) => { 
    setSessionData(session.data); 
    const newCart = [null, null, null, null];
    (session.cart || []).forEach((t, i) => { if (i < 4) newCart[i] = t; });
    setSessionCart(newCart); 
    setActiveTab('builder'); 
    showToast('Sesión cargada en el constructor'); 
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-800 relative">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={`toast-${toast.id}`} className={`bg-white border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-emerald-500'} shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-right-8 pointer-events-auto min-w-[250px]`}>
            {toast.type === 'error' ? <AlertCircle className="text-red-500 shrink-0" /> : <CheckCircle2 className="text-emerald-500 shrink-0" />}
            <p className="font-bold text-slate-700 text-xs tracking-wide">{String(toast.msg)}</p>
          </div>
        ))}
      </div>

      {deferredPrompt && (
        <div className="fixed bottom-24 left-4 right-4 md:bottom-8 md:left-auto md:right-[5.5rem] bg-white p-4 rounded-2xl shadow-2xl z-[8000] flex items-center justify-between gap-4 border-2 border-blue-900 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3">
            <img src="/bibliokeepers.PNG" className="w-10 h-10 rounded-xl shadow-sm border border-slate-100" alt="icon" onError={(e) => { e.target.src = FALLBACK_LOGO; }}/>
            <div className="text-left">
               <p className="font-black text-sm leading-tight text-blue-950 uppercase tracking-tighter">Instalar App</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Añadir a pantalla de inicio</p>
            </div>
          </div>
          <button onClick={() => { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => setDeferredPrompt(null)); }} className="bg-red-600 px-4 py-3 rounded-xl font-black text-white text-[10px] uppercase tracking-widest shadow-lg hover:bg-red-700">Instalar</button>
        </div>
      )}

      <aside className="hidden md:flex w-64 bg-blue-950 text-white flex-col shadow-2xl z-20 border-r border-blue-900 shrink-0">
        <div className="p-8 border-b border-blue-900/50 flex items-center gap-4">
          <img src={LOGO_ATM_URL} className="h-10" alt="logo" onError={(e) => { e.target.src = FALLBACK_LOGO; }}/>
          <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">BiblioKeepers <span className="text-red-600">ATM</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item, idx) => {
            if (item.adminOnly && liveUser.role !== 'admin') return null;
            if (item.divider) return <div key={`div-${idx}`} className="h-px bg-blue-900/50 my-2 mx-2"></div>;
            const isActive = (item.id === activeTab && !item.action) || (item.id === 'library' && activeTab === 'library' && !showFavoritesOnly) || (item.id === 'favs' && activeTab === 'library' && showFavoritesOnly);
            const NavIcon = item.icon;
            return (
              <button key={`nav-${item.id}-${idx}`} onClick={() => handleNavClick(item)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isActive ? 'bg-red-600 font-bold shadow-lg shadow-red-600/30' : 'hover:bg-blue-900 text-blue-200'}`}>
                 <div className="flex items-center gap-3"><NavIcon size={20}/> {item.label}</div>
                 {item.badge > 0 && <span className="bg-white text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">{Number(item.badge)}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-900/50 bg-blue-950 flex items-center justify-between">
           <div className="flex items-center gap-3 overflow-hidden text-left">
             <img src={liveUser.avatar} className="w-10 h-10 rounded-full border-2 border-blue-600 object-cover shadow-sm" alt="avatar"/>
             <div className="flex flex-col truncate max-w-[90px]">
               <span className="text-xs font-black text-white truncate">{String(liveUser.name || '')}</span>
               <span className="text-[9px] text-blue-300 font-bold uppercase">{String(liveUser.role || '')}</span>
             </div>
           </div>
           <button onClick={handleLogout} className="text-blue-300 hover:text-red-400 p-2 rounded-xl hover:bg-blue-900"><LogOut size={18}/></button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-blue-950 text-white flex justify-between items-center px-4 py-3 z-[100] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
         <button onClick={()=>{setActiveTab('home'); setShowFavoritesOnly(false);}} className={`flex flex-col items-center gap-1 ${activeTab==='home'?'text-red-500':'text-slate-400'}`}><Home size={22}/><span className="text-[8px] font-bold tracking-widest">Inicio</span></button>
         <button onClick={()=>{setActiveTab('library'); setShowFavoritesOnly(false);}} className={`flex flex-col items-center gap-1 ${activeTab==='library' && !showFavoritesOnly ?'text-red-500':'text-slate-400'}`}><Search size={22}/><span className="text-[8px] font-bold tracking-widest">Biblioteca</span></button>
         <button onClick={()=>{setActiveTab('builder');}} className={`flex flex-col items-center gap-1 ${activeTab==='builder'?'text-red-500':'text-slate-400'} relative`}><FileStack size={22}/>{activeCartCount>0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full font-black flex items-center justify-center">{activeCartCount}</span>}<span className="text-[8px] font-bold tracking-widest">Sesión</span></button>
         <button onClick={()=>{setActiveTab('calendar');}} className={`flex flex-col items-center gap-1 ${activeTab==='calendar'?'text-red-500':'text-slate-400'}`}><CalendarIcon size={22}/><span className="text-[8px] font-bold tracking-widest">Plan</span></button>
         {liveUser.role === 'admin' ? 
           <button onClick={()=>{setActiveTab('squad');}} className={`flex flex-col items-center gap-1 ${activeTab==='squad'?'text-red-500':'text-slate-400'}`}><Shield size={22}/><span className="text-[8px] font-bold tracking-widest">Plantilla</span></button>
         : 
           <button onClick={()=>{setActiveTab('sessions');}} className={`flex flex-col items-center gap-1 ${activeTab==='sessions'?'text-red-500':'text-slate-400'}`}><FolderArchive size={22}/><span className="text-[8px] font-bold tracking-widest">Mis PDF</span></button>
         }
      </nav>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50 relative text-center">
        <div className="pb-24 md:pb-0 h-full">
          {activeTab === 'home' && <HomeView tasks={tasks} calendarEvents={calendarEventsState} messages={messages} onSendMessage={handleSendMessage} users={users} squad={squad} setActiveTab={setActiveTab} setIsAIOpen={setIsAIOpen} currentUser={liveUser} onLoadSession={loadSession} savedSessions={savedSessionsState} showToast={showToast} />}
          {activeTab === 'squad' && liveUser.role === 'admin' && <SquadView squad={squad} onSaveGk={handleSaveGk} onDeleteGk={handleDeleteGk} showToast={showToast} users={users} calendarEvents={calendarEventsState} />}
          {activeTab === 'library' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                <div className="relative w-full group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600" />
                  <input className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-red-500/20 font-medium text-slate-700" placeholder="Buscar por título, objetivo o descripción..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-4 items-center pl-2">
                   <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className="bg-transparent text-xs font-bold uppercase tracking-widest text-slate-500 outline-none cursor-pointer hover:text-blue-950">
                     <option value="">Todas las Categorías</option>
                     <option value="TÉCNICA">Técnica</option>
                     <option value="TÁCTICA">Táctica</option>
                     <option value="FÍSICA">Física</option>
                     <option value="EMOCIONAL">Emocional</option>
                   </select>
                   <span className="text-slate-200 hidden md:inline">|</span>
                   <select value={filterAuthor} onChange={e=>setFilterAuthor(e.target.value)} className="bg-transparent text-xs font-bold uppercase tracking-widest text-slate-500 outline-none cursor-pointer hover:text-blue-950">
                     <option value="">Todos los Entrenadores</option>
                     {[...new Set(tasks.map(t => t.author?.name).filter(Boolean))].map(author => <option key={`author-${author}`} value={String(author)}>{String(author)}</option>)}
                   </select>
                   <div className="flex gap-1 ml-auto bg-slate-50 p-1 rounded-xl border border-slate-200">
                     <button onClick={() => setLibraryView('grid')} className={`p-1.5 rounded-lg transition-colors ${libraryView === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-blue-950'}`} title="Vista Cuadrícula"><LayoutGrid size={14}/></button>
                     <button onClick={() => setLibraryView('list')} className={`p-1.5 rounded-lg transition-colors ${libraryView === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-blue-950'}`} title="Vista Lista"><List size={14}/></button>
                   </div>
                   {showFavoritesOnly && <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200"><Star size={12} fill="currentColor"/> Viendo Favoritos</span>}
                </div>
              </div>
              <div className={libraryView === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-10" : "flex flex-col gap-4 pb-10"}>
                {filteredTasks.map(t => {
                  const inCart = sessionCart.some(x => x && String(x.id) === String(t.id)); 
                  const taskAuthor = users.find(u => u.name === t.author?.name) || t.author;
                  const canEditOrDelete = (t.author?.name === liveUser.name) || liveUser.role === 'admin';
                  const isFav = t.likes?.includes(liveUser.username);
                  
                  if (libraryView === 'grid') {
                    return (
                      <div key={`grid-task-${t.id}`} className="relative group">
                        {canEditOrDelete && (
                          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-100 transition-opacity">
                            <button onClick={(e)=>{ e.stopPropagation(); setEditingTask(t); setActiveTab('create'); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-blue-600 hover:bg-blue-50"><Edit2 size={14} strokeWidth={3}/></button>
                            <button onClick={(e)=>{ e.stopPropagation(); handleCloneTask(t); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-emerald-600 hover:bg-emerald-50"><Copy size={14} strokeWidth={3}/></button>
                            <button onClick={(e)=>{ e.stopPropagation(); setTaskToDelete(t); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-red-600 hover:bg-red-50"><Trash2 size={14} strokeWidth={3}/></button>
                          </div>
                        )}
                        <button onClick={(e) => toggleFavorite(t.id, e)} className={`absolute top-4 ${canEditOrDelete ? 'right-14' : 'right-4'} w-8 h-8 rounded-full flex items-center justify-center shadow-md z-30 transition-all ${isFav ? 'bg-yellow-400 text-white' : 'bg-white/80 backdrop-blur text-slate-300 hover:text-yellow-400'}`}>
                          <Star size={14} strokeWidth={2.5} fill={isFav ? "currentColor" : "none"}/>
                        </button>
                        {t.visibility === 'private' && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-30 flex items-center gap-1 uppercase tracking-widest border-2 border-white"><Lock size={10} /> Privada</div>}
                        <div onClick={() => setSelectedTask(t)} className={`bg-white rounded-[2.5rem] border-2 shadow-sm hover:shadow-xl transition-all flex flex-col text-left cursor-pointer h-full ${inCart?'border-red-500':'border-slate-100 hover:border-red-100'}`}>
                          <div className="relative aspect-[16/9] overflow-hidden rounded-t-[2.5rem]">
                            <img src={t.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="img"/>
                            <button onClick={(e)=>{
                               e.stopPropagation(); 
                               if(inCart){
                                  setSessionCart(sessionCart.map(x => String(x?.id) === String(t.id) ? null : x));
                               } else {
                                  const emptyIdx = sessionCart.findIndex(x => !x);
                                  if(emptyIdx !== -1) {
                                     const newCart = [...sessionCart];
                                     newCart[emptyIdx] = t;
                                     setSessionCart(newCart);
                                  } else {
                                     showToast("La sesión ya está llena (4 tareas)", "error");
                                  }
                               }
                            }} className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-xl z-20 transition-all ${inCart?'bg-red-600 text-white shadow-red-600/40':'bg-white text-slate-400 hover:bg-red-500 hover:text-white'}`}>
                              {inCart ? <Check size={20} strokeWidth={3}/> : <Plus size={20} strokeWidth={3}/>}
                            </button>
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{String(t.category || 'Técnica')}</div>
                            <h3 className="font-black text-blue-950 uppercase text-sm line-clamp-2 leading-tight min-h-[2.5rem]">{String(t.mainObjective || t.title || '')}</h3>
                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
                              <img src={taskAuthor?.avatar} className="w-8 h-8 rounded-full border shadow-sm object-cover" alt="avatar" />
                              <span className="text-[10px] font-black uppercase text-slate-500 truncate">{String(taskAuthor?.name || '')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`list-task-${t.id}`} onClick={() => setSelectedTask(t)} className={`relative group bg-white rounded-3xl border-2 shadow-sm hover:shadow-xl transition-all flex text-left cursor-pointer overflow-hidden h-28 ${inCart?'border-red-500':'border-slate-100 hover:border-red-100'}`}>
                        <div className="w-40 shrink-0 relative bg-slate-50 border-r border-slate-100">
                           <img src={t.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="img"/>
                           <button onClick={(e)=>{
                               e.stopPropagation(); 
                               if(inCart){
                                  setSessionCart(sessionCart.map(x => String(x?.id) === String(t.id) ? null : x));
                               } else {
                                  const emptyIdx = sessionCart.findIndex(x => !x);
                                  if(emptyIdx !== -1) {
                                     const newCart = [...sessionCart];
                                     newCart[emptyIdx] = t;
                                     setSessionCart(newCart);
                                  } else {
                                     showToast("La sesión ya está llena (4 tareas)", "error");
                                  }
                               }
                           }} className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20 transition-all ${inCart?'bg-red-600 text-white shadow-red-600/40':'bg-white/80 backdrop-blur text-slate-500 hover:bg-red-500 hover:text-white'}`}>
                             {inCart ? <Check size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>}
                           </button>
                        </div>
                        <div className="flex-1 p-4 flex flex-col min-w-0">
                           <div className="flex justify-between items-start mb-1">
                             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{String(t.category || 'Técnica')}</div>
                             {t.visibility === 'private' && <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200"><Lock size={8} /> Privada</div>}
                           </div>
                           <h3 className="font-black text-blue-950 uppercase text-sm truncate">{String(t.mainObjective || t.title || '')}</h3>
                           <p className="text-xs text-slate-500 truncate mt-1">{String(t.secondaryContents || t.description || '')}</p>
                           <div className="mt-auto flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <img src={taskAuthor?.avatar} className="w-6 h-6 rounded-full border shadow-sm object-cover" alt="avatar" />
                                <span className="text-[9px] font-black uppercase text-slate-500 truncate">{String(taskAuthor?.name || '')}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={(e) => toggleFavorite(t.id, e)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                                  <Star size={16} strokeWidth={2.5} fill={isFav ? "currentColor" : "none"}/>
                                </button>
                                {canEditOrDelete && (
                                  <div className="flex gap-1 opacity-100 transition-opacity">
                                     <button onClick={(e)=>{ e.stopPropagation(); setEditingTask(t); setActiveTab('create'); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-blue-600 hover:bg-blue-100"><Edit2 size={12} strokeWidth={3}/></button>
                                     <button onClick={(e)=>{ e.stopPropagation(); handleCloneTask(t); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-emerald-600 hover:bg-emerald-100"><Copy size={12} strokeWidth={3}/></button>
                                     <button onClick={(e)=>{ e.stopPropagation(); setTaskToDelete(t); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-red-600 hover:bg-red-100"><Trash2 size={12} strokeWidth={3}/></button>
                                  </div>
                                )}
                             </div>
                           </div>
                        </div>
                      </div>
                    );
                  }
                })}
                {filteredTasks.length === 0 && <div className="col-span-full py-20 text-slate-300 font-bold uppercase tracking-widest text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">No hay resultados</div>}
              </div>
            </div>
          )}
          
          {activeTab === 'builder' && <SessionBuilderView sessionCart={sessionCart} setSessionCart={setSessionCart} sessionData={sessionData} setSessionData={setSessionData} showToast={showToast} onSaveTemplate={handleSaveTemplate} currentUser={liveUser} squad={squad} onNewSession={() => { setSessionCart([null, null, null, null]); setSessionData({ ...DEFAULT_SESSION_DATA }); setActiveTab('library'); showToast("Lista para crear una nueva sesión", "success"); }} />}
          {activeTab === 'calendar' && <CalendarView savedSessions={savedSessionsState} calendarEvents={calendarEventsState} onAddEvent={handleAddEvent} onRemoveEvent={handleRemoveEvent} onLoadSession={loadSession} showToast={showToast} onDeleteSession={setSessionToDelete} onCloneSession={handleCloneSession} onEvaluateSession={setEvaluatingSession} onMarkAttendance={(sessionItem, dateString) => setAttendanceSession({ sessionItem, dateString })} />}
          {activeTab === 'create' && <CreateTaskView editingTask={editingTask} onCancelEdit={() => { setEditingTask(null); setActiveTab('library'); }} onTaskSaved={task => { handleSaveTask(task); setEditingTask(null); setActiveTab('library'); showToast("Tarea Guardada"); }} currentUser={liveUser} showToast={showToast} />}
          {activeTab === 'upload' && <UploadView onTasksExtracted={ts => { ts.forEach(t => handleSaveTask(t)); setActiveTab('library'); showToast(`Se han procesado ${ts.length} tareas correctamente`); }} currentUser={liveUser} showToast={showToast}/>}
          {activeTab === 'sessions' && <SessionsHistoryView savedSessions={savedSessionsState} onLoadSession={loadSession} onDeleteSession={setSessionToDelete} onCloneSession={handleCloneSession} showToast={showToast} onEvaluateSession={setEvaluatingSession} />}
          {activeTab === 'trash' && liveUser.role === 'admin' && <TrashView trashedTasks={trashedTasks} onRestoreTask={handleRestoreTask} onDeleteTaskForever={handleDeleteTaskForever} trashedSessions={trashedSessions} onRestoreSession={handleRestoreSession} onDeleteSessionForever={handleDeleteSessionForever} />}
          {activeTab === 'admin' && liveUser.role === 'admin' && <AdminView users={users} onSaveUser={handleSaveUser} onToggleUserActive={handleToggleUserActive}/>}
        </div>
      </main>
      
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} users={users} />}

      {attendanceSession && <AttendanceModal sessionObj={attendanceSession} squad={squad} onClose={() => setAttendanceSession(null)} onSave={handleSaveAttendance} showToast={showToast} />}

      {taskToDelete && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-2">¿Eliminar Tarea?</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">¿Desea enviar esta tarea a la papelera?</p>
            <div className="flex gap-3">
              <button onClick={() => setTaskToDelete(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={() => { handleTrashTask(taskToDelete.id); if (selectedTask?.id === taskToDelete.id) setSelectedTask(null); setTaskToDelete(null); }} className="flex-1 py-3.5 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg uppercase text-xs tracking-widest">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {sessionToDelete && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-2">¿Eliminar Sesión?</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">¿Desea enviar esta sesión a la papelera?</p>
            <div className="flex gap-3">
              <button onClick={() => setSessionToDelete(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={() => { handleTrashSession(sessionToDelete.id); setSessionToDelete(null); }} className="flex-1 py-3.5 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg uppercase text-xs tracking-widest">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {evaluatingSession && <EvaluationModal session={evaluatingSession} squad={squad} onClose={() => setEvaluatingSession(null)} onSave={handleSaveEvaluation} showToast={showToast} />}

      <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end gap-4">
        {isAIOpen && <AIAssistantModal onClose={() => setIsAIOpen(false)} tasks={tasks} setSessionCart={setSessionCart} sessionData={sessionData} setSessionData={setSessionData} setActiveTab={setActiveTab} showToast={showToast} />}
        {isChatOpen && <ChatView messages={messages} onSendMessage={handleSendMessage} currentUser={liveUser} users={users} onClose={() => setIsChatOpen(false)} />}
        <button onClick={() => { setIsAIOpen(!isAIOpen); setIsChatOpen(false); }} className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,99,235,0.5)] hover:scale-105 transition-all"><Zap size={24} /></button>
        <button onClick={() => { setIsChatOpen(!isChatOpen); setIsAIOpen(false); }} className="relative w-14 h-14 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(220,38,38,0.5)] hover:scale-105 transition-all">
           {isChatOpen ? <ChevronDown size={28} /> : <MessageCircle size={28} />}
           {!isChatOpen && unreadCount > 0 && (
             <span className="absolute top-0 right-0 w-5 h-5 bg-white border-2 border-red-600 text-red-600 rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
               {unreadCount}
             </span>
           )}
        </button>
      </div>
    </div>
  );
}
