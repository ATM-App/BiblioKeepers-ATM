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
  LayoutGrid, UserCheck, CloudRain, Settings, MoveUp, MoveDown, Sun, TrendingUp
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, collection, doc, setDoc, addDoc, updateDoc, 
  deleteDoc, onSnapshot, query, getDocs 
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

// --- 1. DATOS INICIALES Y CONSTANTES ESTÉTICAS ---
const LOGO_ATM_URL = "/escudo.PNG"; 
const LOGO_APP_ICON = "/bibliokeepers.PNG";
const FALLBACK_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2b56"/><text x="50" y="55" font-family="sans-serif" font-size="20" fill="white" font-weight="bold" text-anchor="middle">ATM</text></svg>`;
const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23ffffff"/><text x="300" y="200" font-family="sans-serif" font-size="20" fill="%23cc2b2b" text-anchor="middle">Gráfico</text></svg>`;

// Constante para el efecto Glassmorphism Premium
const GLASS_CARD = "bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

// Constante del Catálogo de Materiales
const MATERIAL_CATALOG = [
  { name: 'BALONES' },
  { name: 'PELOTAS TENIS' },
  { name: 'BALÓN MEDICINAL' },
  { name: 'PICAS CON BASE' },
  { name: 'PICAS SIN BASE' },
  { name: 'ESCALERA' },
  { name: 'BANCO' },
  { name: 'STEP' },
  { name: 'REBOTEADOR' },
  { name: 'MUÑECO HINCHABLE' },
  { name: 'MINI PORTERÍAS' },
  { name: 'GOMAS ELÁSTICAS' },
  { name: 'BANDA ELÁSTICA' },
  { name: 'AROS' },
  { name: 'VALLAS ALTAS' },
  { name: 'VALLAS BAJAS' },
  { name: 'VALLAS MEDIANAS' },
  { name: 'CONOS' },
  { name: 'CONOS PEQUEÑOS' },
  { name: 'SETAS' },
  { name: 'SETAS GRANDES' },
  { name: 'FITBALL' },
  { name: 'CHALECO PESO' },
  { name: 'CHALECO BANDA' },
  { name: 'BOSU' },
  { name: 'BANCOS SALTO' },
  { name: 'PARACAÍDAS' }
];

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

const DEFAULT_SESSION_DATA = { 
  clubName: 'CD ÁLCALA', team: 'ALEVIN B - F11', coach: 'JHON ALEXANDER ARROYAVE CARDENAS', 
  goalkeepers: '', gkIds: [], material: '', materialsList: [],
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
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(37,99,235,0.7)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.3)" />
        </linearGradient>
      </defs>
      {[10, 8, 6, 4, 2].map(level => (
        <polygon key={`level-${level}`} points={getPoints(() => level, radius)} fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="0.5" />
      ))}
      <polygon points={dataPoints} fill="url(#radarFill)" stroke="#3b82f6" strokeWidth="1.5" filter="url(#neonGlow)" />
      {statKeys.map((k, i) => {
        const angle = (Math.PI * 2 * i / 5) - (Math.PI / 2);
        const x = center + (radius + 10) * Math.cos(angle);
        const y = center + (radius + 10) * Math.sin(angle);
        return <text key={`label-${k}`} x={x} y={y+1} fontSize="5" textAnchor="middle" alignmentBaseline="middle" fill="#475569" fontWeight="bold">{labels[i]}</text>
      })}
    </svg>
  );
}

function PdfHeader({ sessionData, isInteractive = false, onUpdate }) {
  const [imgSrc, setImgSrc] = useState(LOGO_ATM_URL);

  const renderInput = (value, field, placeholder, className = "", pbClass = "pb-[2px]") => {
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
    return <span className={`w-full h-full flex items-center justify-center text-center px-1 truncate leading-none ${pbClass} ${className}`}>{String(value || '')}</span>;
  };

  const InputRow = ({ label, field, placeholder, bgClass="bg-white", textClass="text-[8.5px]" }) => (
    <div className="flex gap-1.5 h-[22px]">
      <div className="w-[90px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase shrink-0 leading-none pb-[1px]">
        {label}
      </div>
      <div className={`flex-1 ${bgClass} border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center overflow-hidden ${textClass} font-bold text-[#1a2b56]`}>
        {renderInput(sessionData[field], field, placeholder)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5 shrink-0 w-full mb-1 text-left">
      <div className="flex gap-1.5 h-[82px]">
        <div className="w-[90px] flex flex-col shrink-0 border-[1.5px] border-[#1a2b56] rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="flex-1 p-1 flex items-center justify-center">
             <img src={imgSrc} crossOrigin="anonymous" className="max-h-[44px] object-contain" alt="ATM" onError={() => setImgSrc(FALLBACK_LOGO)} />
          </div>
          <div className="bg-[#1a2b56] text-white text-[8px] font-bold h-[22px] flex items-center justify-center leading-none pb-[1px]">
            {renderInput(sessionData.clubName, 'clubName', 'CLUB...', 'text-white placeholder:text-blue-300')}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 justify-between">
          <div className="bg-[#cc2b2b] text-white font-black rounded-lg tracking-widest text-[14px] uppercase shadow-sm flex items-center justify-center h-[26px] overflow-hidden">
            {renderInput(sessionData.team, 'team', 'EQUIPO / CATEGORÍA...', 'text-white placeholder:text-red-300', 'pb-[5px] pt-[2px]')}
          </div>
          <InputRow label="ENTRENADOR" field="coach" placeholder="Nombre Entrenador..." textClass="text-[8.5px] uppercase" />
          <InputRow label="PORTEROS" field="goalkeepers" placeholder="Nombres Porteros..." textClass="text-[8.5px] uppercase" />
        </div>

        <div className="w-[150px] flex flex-col gap-1.5 shrink-0 justify-between">
          <div className="flex gap-1.5 h-[26px]">
             <div className="flex-1 bg-[#1a2b56] rounded-lg flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-widest shadow-sm leading-none pb-[1px]">
                SESIÓN
             </div>
             <div className="w-[50px] bg-[#1a2b56] rounded-lg flex items-center justify-center text-[12px] text-white font-black shadow-sm leading-none pb-[2px]">
                {renderInput(sessionData.sessionNumber, 'sessionNumber', 'Nº...', 'text-white placeholder:text-blue-300')}
             </div>
          </div>
          <div className="flex gap-1.5 h-[22px]">
            <div className="w-[70px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase leading-none pb-[1px]">
               FECHA
            </div>
            <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center overflow-hidden text-[8.5px] font-bold text-[#1a2b56]">
               {renderInput(sessionData.date, 'date', 'DD-MM-YY...')}
            </div>
          </div>
          <div className="flex gap-1.5 h-[22px]">
            <div className="w-[70px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase leading-none pb-[1px]">
               DURACIÓN
            </div>
            <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center overflow-hidden text-[8.5px] font-bold text-[#1a2b56]">
               {renderInput(sessionData.duration, 'duration', 'Min...')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 h-[26px] w-full shrink-0">
        <div className="w-[90px] bg-slate-200 border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center text-[7px] font-bold text-[#1a2b56] uppercase shrink-0 leading-none pb-[1px]">
           MATERIAL
        </div>
        <div className="flex-1 bg-white border-[1.5px] border-[#1a2b56] rounded-md flex items-center justify-center overflow-hidden text-[#1a2b56] uppercase px-3">
           {sessionData.materialsList && sessionData.materialsList.length > 0 ? (
               <div className="w-full flex flex-wrap items-center justify-center gap-x-2.5 gap-y-[3px] text-[6.5px] font-black leading-none pb-[1px]">
                   {sessionData.materialsList.map((m, i) => (
                       <span key={i} className="whitespace-nowrap inline-flex items-center">
                          {m.name} x{m.qty}{i < sessionData.materialsList.length - 1 ? <span className="ml-2.5 text-[#1a2b56]/60 font-black">•</span> : ''}
                       </span>
                   ))}
               </div>
           ) : (
               <div className="w-full h-full text-[8.5px] font-bold">
                 {renderInput(sessionData.material, 'material', 'Añade material desde el panel superior...', 'text-[#1a2b56] w-full', 'pb-[3px] pt-[1px]')}
               </div>
           )}
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
      <div className="bg-[#cc2b2b] text-white text-center flex items-center justify-center font-bold text-[12px] h-[24px] rounded-lg tracking-widest uppercase shadow-sm mb-1.5 leading-none pb-[2px]">
        OBJETIVOS
      </div>
      <div className="flex gap-1.5 items-stretch min-h-[90px]">
        {cols.map((col, i) => (
          <div key={`col-${i}`} className="flex-1 flex flex-col border-[1.5px] border-[#1a2b56] rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-[#1a2b56] text-white flex items-center justify-center text-center text-[8px] font-bold h-[20px] uppercase shrink-0 leading-none pb-[1px]">
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
                <div className="text-[8.5px] text-[#1a2b56] font-medium leading-tight whitespace-pre-line px-0.5 text-center flex flex-col items-center justify-center h-full pt-1">
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
         <div className="absolute top-1.5 right-1.5 bg-[#1a2b56] text-white text-[9px] font-bold px-2 h-[18px] rounded shadow-sm z-10 border border-[#1a2b56]/20 flex items-center justify-center leading-none pb-[4px] pt-[1px]">Tarea {num}</div>
         <img src={task.imageUrl} className="w-full h-full object-contain" alt="Task" crossOrigin="anonymous" onError={(e)=>{e.target.src=FALLBACK_IMG}}/>
      </div>
    </div>
  );
}

function HomeView({ tasks, calendarEvents, messages, onSendMessage, users, squad, setActiveTab, currentUser, onLoadSession, showToast, savedSessions, setIsChatOpen, setShowFavoritesOnly }) {
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
  
  // Layout BENTO BOX perfecto
  const [layout, setLayout] = useState(['welcome', 'coachStats', 'nextSession', 'chat', 'weather', 'quickActions']);
  const [weatherData, setWeatherData] = useState({ temp: '--', desc: 'Cargando clima...', city: 'Buscando...', isRainy: false, code: 0 });

  // Cálculos para el Widget de Estadísticas Propias
  const myFavoriteTasksCount = tasks.filter(t => t.likes?.includes(currentUser.username)).length;
  const myGksCount = squad.filter(gk => gk.assignedCoach === currentUser.username).length;
  const mySessionsCount = savedSessions?.length || 0;

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
           desc = 'Lluvioso';
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

  // Configuración de tamaños para lograr el puzle Bento Box: 3 Columnas principales (md)
  const availableWidgets = [
    { id: 'welcome', name: 'Banner Bienvenida', colSpan: 'md:col-span-3 row-span-1' },
    { id: 'coachStats', name: 'Estadísticas Propias', colSpan: 'md:col-span-3 row-span-1' },
    { id: 'nextSession', name: 'Próxima Sesión', colSpan: 'md:col-span-2 row-span-2' }, // Gigante 2x2
    { id: 'chat', name: 'Chat Reciente', colSpan: 'md:col-span-1 row-span-2' }, // Vertical 1x2
    { id: 'weather', name: 'Clima y Superficie', colSpan: 'md:col-span-2 row-span-1' }, // Horizontal 2x1
    { id: 'quickActions', name: 'Accesos Rápidos', colSpan: 'md:col-span-1 row-span-1' } // Cuadrado 1x1
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
    coachStats: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
         <div className={`${GLASS_CARD} p-5 rounded-[2rem] flex flex-col justify-center gap-2 hover:bg-white/80 transition-all group`}>
            <div className="flex justify-between items-center z-10 mb-2">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sesiones Diseñadas</h4>
               <div className="bg-blue-50 text-blue-500 p-2 rounded-xl group-hover:scale-110 transition-transform"><FolderArchive size={16}/></div>
            </div>
            <div className="z-10 flex items-baseline">
               <span className="text-3xl font-black text-blue-950 leading-none">{mySessionsCount}</span>
               <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">En total</span>
            </div>
         </div>
         
         <div className={`${GLASS_CARD} p-5 rounded-[2rem] flex flex-col justify-center gap-2 hover:bg-white/80 transition-all group cursor-pointer`} onClick={() => {setActiveTab('library'); setShowFavoritesOnly(true);}} title="Ver mis favoritos">
            <div className="flex justify-between items-center z-10 mb-2">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tareas Favoritas</h4>
               <div className="bg-yellow-50 text-yellow-500 p-2 rounded-xl group-hover:scale-110 transition-transform"><Star size={16} fill="currentColor"/></div>
            </div>
            <div className="z-10 flex items-baseline">
               <span className="text-3xl font-black text-blue-950 leading-none">{myFavoriteTasksCount}</span>
               <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">Guardadas</span>
            </div>
         </div>

         <div className={`${GLASS_CARD} p-5 rounded-[2rem] flex flex-col justify-center gap-2 hover:bg-white/80 transition-all group`}>
            <div className="flex justify-between items-center z-10 mb-2">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Porteros a Cargo</h4>
               <div className="bg-emerald-50 text-emerald-500 p-2 rounded-xl group-hover:scale-110 transition-transform"><Users size={16}/></div>
            </div>
            <div className="z-10 flex items-baseline">
               <span className="text-3xl font-black text-blue-950 leading-none">{myGksCount}</span>
               <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">Activos</span>
            </div>
         </div>
      </div>
    ),
    quickActions: (
      <div className="flex flex-col gap-4 h-full">
          <button onClick={() => setActiveTab('create')} className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform shadow-md text-center group">
             <div className="bg-white/20 p-2.5 rounded-xl group-hover:bg-white/30 transition-colors"><Edit2 size={24} strokeWidth={2.5} /></div>
             <div><h4 className="font-black uppercase tracking-widest text-[10px] mt-1">Crear Tarea</h4></div>
          </button>
          <button onClick={() => setActiveTab('builder')} className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-500 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-white hover:scale-[1.02] transition-transform shadow-md text-center group">
             <div className="bg-white/20 p-2.5 rounded-xl group-hover:bg-white/30 transition-colors"><FileStack size={24} strokeWidth={2.5}/></div>
             <div><h4 className="font-black uppercase tracking-widest text-[10px] mt-1">Montar Sesión</h4></div>
          </button>
       </div>
    ),
    weather: (
      <div className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-center text-white relative overflow-hidden h-full min-h-[160px] ${weatherData.isRainy ? 'bg-gradient-to-r from-slate-700 to-slate-900 border border-slate-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500 border border-blue-400'}`}>
         <style>{`
            @keyframes bentoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes bentoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
         `}</style>
         <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-20 pointer-events-none z-0">
            {weatherData.isRainy 
              ? <CloudRain size={160} style={{animation: 'bentoFloat 6s ease-in-out infinite'}}/> 
              : <Sun size={160} style={{animation: 'bentoSpin 25s linear infinite'}}/>}
         </div>
         <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-inner">
               {weatherData.isRainy ? <CloudRain size={40} className="text-white"/> : <Sun size={40} className="text-white"/>}
            </div>
            <div className="flex flex-col">
               <h4 className="font-black uppercase tracking-widest text-[10px] md:text-xs mb-1 text-white/80">{String(weatherData.city)}</h4>
               <div className="flex items-end gap-3">
                 <p className="text-4xl md:text-5xl font-black leading-none drop-shadow-md">{String(weatherData.temp)}º</p>
                 <p className="text-sm font-bold uppercase tracking-widest text-white/90 pb-1">{String(weatherData.desc)}</p>
               </div>
            </div>
         </div>
      </div>
    ),
    nextSession: (
      <div className={`relative rounded-[2.5rem] p-6 flex flex-col justify-between h-full min-h-[350px] overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-br from-blue-900 to-blue-950`}>
         
         <div className="relative z-20 flex justify-between items-start mb-4">
           <div className="bg-red-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg">
             <CalendarIcon size={14}/> Siguiente Evento
           </div>
           
           {nextSessions.length > 0 && (() => {
                const [yyyy, mm, dd] = nextDate.split('-');
                const sDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                const todayNoTime = new Date(todayYear, todayDate.getMonth(), todayDate.getDate());
                const targetNoTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
                const diffTime = targetNoTime - todayNoTime;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                let countdown = diffDays === 0 ? "¡ES HOY!" : diffDays === 1 ? "MAÑANA" : `EN ${diffDays} DÍAS`;
                return (
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] animate-pulse flex items-center gap-2 shadow-sm">
                    <Clock size={12}/> {countdown}
                  </div>
                );
           })()}
         </div>

         <div className="relative z-20 flex-1 flex flex-col justify-end">
           {nextSessions.length > 0 ? (
              nextSessions.slice(0, 1).map(s => {
                const sessionGks = squad.filter(gk => s.data?.gkIds?.includes(gk.id));
                // Parseamos la fecha de manera segura usando la clave del calendario
                const [yyyy, mm, dd] = nextDate.split('-');
                const safeDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
                
                return (
                  <div key={`next-giant-${s.id}`} className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 flex flex-col gap-4 shadow-sm hover:bg-white/20 transition-colors mt-2">
                    <div>
                       <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                         {safeDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                       </span>
                       <h4 className="font-black text-white text-2xl md:text-3xl uppercase tracking-tight leading-tight mt-1 truncate" title={String(s.name)}>{String(s.name)}</h4>
                    </div>
                    {sessionGks.length > 0 && (
                       <div className="flex items-center">
                         <div className="flex -space-x-3 mr-3">
                           {sessionGks.slice(0, 4).map((gk, i) => (
                             <img key={`gk-giant-${i}`} src={gk.avatar} className="w-8 h-8 rounded-full border-2 border-white/20 object-cover shadow-sm" title={String(gk.name)} alt="avatar"/>
                           ))}
                           {sessionGks.length > 4 && <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border-2 border-white/20 flex items-center justify-center text-[8px] text-white font-black">+{sessionGks.length - 4}</div>}
                         </div>
                         <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">{sessionGks.length} Convocados</span>
                       </div>
                    )}
                    <div className="flex gap-2 shrink-0 mt-2">
                       <button onClick={() => onLoadSession(s)} className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-950 px-4 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-colors shadow-md">
                         <FileDown size={14}/> Abrir Sesión
                       </button>
                       <button onClick={() => handleSendToChat(s)} className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1ebd5c] transition-colors shadow-md">
                         <Send size={14}/> Avisar al Grupo
                       </button>
                    </div>
                  </div>
                )
              })
           ) : (
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-dashed border-white/20 text-center flex-1 flex flex-col items-center justify-center">
                <CalendarIcon size={40} className="text-white/30 mb-4"/>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">No hay sesiones próximas en el planificador.</p>
                <button onClick={() => setActiveTab('calendar')} className="mt-4 bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Planificar Ahora</button>
              </div>
           )}
         </div>
      </div>
    ),
    chat: (
      <div className={`${GLASS_CARD} rounded-[2.5rem] p-6 flex flex-col gap-4 h-full min-h-[350px]`}>
         <div className="flex items-center justify-between shrink-0 mb-2">
           <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest">
             <MessageCircle size={16}/> Muro del Equipo
           </div>
         </div>
         <div className="flex-1 flex flex-col gap-4 justify-end overflow-hidden">
            {recentMessages.length > 0 ? (
                recentMessages.map(msg => {
                  const sender = users.find(u => String(u.id) === String(msg.senderId)) || { name: 'Desconocido', avatar: '' };
                  const isMe = String(msg.senderId) === String(currentUser?.id);
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                       <img src={sender.avatar || FALLBACK_LOGO} className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" alt="avatar"/>
                       <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                          <div className={`px-4 py-3 rounded-2xl shadow-sm text-[11px] font-medium leading-relaxed ${isMe ? 'bg-blue-950 text-white rounded-tr-sm' : 'bg-white border border-white text-slate-700 rounded-tl-sm'}`}>
                            {String(msg.text)}
                          </div>
                          <span className="text-[8px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest px-1">
                            {!isMe && `${String(sender?.name || 'User').split(' ')[0]} • `}{String(msg.timestamp)}
                          </span>
                       </div>
                    </div>
                  )
                })
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                   <MessageSquare size={32} className="mb-2"/>
                   <span className="text-[10px] font-bold uppercase tracking-widest">No hay mensajes recientes</span>
                </div>
            )}
         </div>
         <button onClick={() => setIsChatOpen(true)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest py-3.5 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 mt-2">
           <Layers size={14}/> Abrir Chat Completo
         </button>
      </div>
    )
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-28 text-left animate-in fade-in">
       <div className="flex justify-end">
         <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${isEditing ? 'bg-blue-950 text-white border-blue-950' : 'bg-white/80 text-slate-500 border-white hover:bg-white'}`}>
           <Settings size={14}/> {isEditing ? 'Finalizar Edición' : 'Editar Panel'}
         </button>
       </div>

       {/* BENTO GRID LAYOUT */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-row-dense auto-rows-[minmax(140px,auto)]">
          {layout.map((widgetId) => {
             const widgetConfig = availableWidgets.find(w => w.id === widgetId);
             if (!widgetConfig) return null;
             const widgetContent = widgets[widgetId];
             
             return (
               <div key={`widget-${widgetId}`} className={`${widgetConfig.colSpan} relative group h-full ${isEditing ? 'border-[3px] border-dashed border-blue-400 p-2 rounded-[3rem] bg-blue-50/30' : ''}`}>
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

       {isEditing && hiddenWidgets.length > 0 && (
         <div className="mt-8 p-6 bg-white/40 border-2 border-dashed border-slate-300 rounded-[2.5rem] animate-in slide-in-from-bottom-5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Widgets Ocultos (Haz clic para añadir)</h4>
            <div className="flex flex-wrap gap-3">
               {hiddenWidgets.map(w => (
                 <button key={w.id} onClick={() => addWidget(w.id)} className="bg-white border border-white shadow-sm px-4 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-bold text-blue-950 hover:bg-blue-50 transition-colors uppercase">
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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in pb-28 md:pb-10 text-left">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6`}>
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
            <div key={gk.id} onClick={() => setSelectedGk(gk)} className={`${GLASS_CARD} rounded-[2.5rem] hover:shadow-xl transition-all cursor-pointer overflow-hidden group flex flex-col relative`}>
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 transition-opacity">
                <button onClick={(e)=>{ e.stopPropagation(); setEditingGk(gk); setIsFormOpen(true); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-blue-600 hover:bg-blue-50" title="Editar Portero">
                  <Edit2 size={14} strokeWidth={3}/>
                </button>
                <button onClick={(e)=>{ e.stopPropagation(); if(window.confirm('¿Eliminar a este portero?')) { onDeleteGk(gk.id); showToast("Portero eliminado"); } }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-red-600 hover:bg-red-50" title="Eliminar Portero">
                  <Trash2 size={14} strokeWidth={3}/>
                </button>
              </div>

              <div className="bg-white/40 p-6 flex flex-col items-center border-b border-white/50 relative">
                <img src={gk.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover group-hover:scale-105 transition-transform" alt={gk.name}/>
                <h4 className="mt-4 font-black text-blue-950 text-sm uppercase">{String(gk.name || '')}</h4>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{String(gk.category || '')} • Año {String(gk.year || '')}</span>
              </div>
              <div className="p-4 flex items-center justify-center flex-1">
                 <div className="w-32 h-32 opacity-90 group-hover:opacity-100 transition-opacity">
                   <RadarChart stats={gk.stats} />
                 </div>
              </div>
              <div className="bg-white/40 border-t border-white/50 p-3 text-center">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Asignado a: <span className="text-blue-950">{String(assignedCoachName)}</span></p>
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
  
  (gk.attendanceRecord || []).forEach(record => {
    if (record.attended === true) present++;
    else if (record.attended === false) absent++;
  });

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col md:flex-row gap-8`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10">
          <X size={20}/>
        </button>
        
        <div className="w-full md:w-1/2 flex flex-col items-center text-center">
           <img src={gk.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover mb-4" alt={gk.name}/>
           <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter leading-none">{String(gk.name || '')}</h3>
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{String(gk.category || '')} • Año {String(gk.year || '')}</span>
           
           <div className="w-full aspect-square mt-6 bg-white/50 rounded-[2rem] border border-white p-4">
             <RadarChart stats={gk.stats} />
           </div>

           <div className="flex justify-around w-full mt-4 bg-white/50 p-3 rounded-2xl border border-white shadow-sm">
             <div className="text-center">
               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Asistencia</div>
               <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1"><Check size={16}/> {present}</div>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div className="text-center">
               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Faltas</div>
               <div className="text-xl font-black text-red-600 flex items-center justify-center gap-1"><X size={16}/> {absent}</div>
             </div>
           </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Evolución y Evaluaciones</h4>
           <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] max-h-[350px] pr-2">
             {(gk.history && gk.history.length > 0) ? gk.history.slice().reverse().map((h, i) => (
                 <div key={`eval-${i}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400">{String(h.date || '')}</span>
                      <span className="font-black text-blue-950 flex items-center gap-1 text-xs bg-slate-50 px-2 py-1 rounded-lg">
                        <Star size={12} className="text-yellow-500" fill="currentColor"/> {String(h.rating || '')}/10
                      </span>
                    </div>
                    {h.comment && <p className="text-xs font-medium text-slate-600 leading-relaxed italic">"{String(h.comment || '')}"</p>}
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
      stats: { reflexes: 5, aerial: 5, oneVone: 5, blocking: 5, footwork: 5 }, history: [], attendanceRecord: []
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
      history: editingGk ? editingGk.history : [],
      attendanceRecord: editingGk ? (editingGk.attendanceRecord || []) : []
    }); 
  };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 relative text-left`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
          <X size={20}/>
        </button>
        <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-6">{editingGk ? 'Editar Portero' : 'Nuevo Portero'}</h3>
        
        <div className="flex items-center gap-4 py-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
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
            <label htmlFor="gk-avatar-upload" className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl block text-center transition-colors text-xs w-full shadow-sm">
              Subir Foto
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/>
          <div className="flex gap-3">
            <input type="number" placeholder="Año (Ej: 2012)" className="w-1/3 p-4 bg-white/80 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})}/>
            <input type="text" placeholder="Categoría (Ej: Alevín B)" className="flex-1 p-4 bg-white/80 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-xs" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}/>
          </div>
          <div>
            <select value={formData.assignedCoach} onChange={e=>setFormData({...formData, assignedCoach: e.target.value})} className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 text-xs appearance-none cursor-pointer">
              <option value="">Asignar a un Entrenador...</option>
              {users.filter(u => u.role === 'coach').map(c => <option key={c.id} value={c.username}>{c.name}</option>)}
            </select>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atributos (Radar)</h4>
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

function SessionBuilderView({ sessionCart, setSessionCart, sessionData, setSessionData, showToast, onSaveTemplate, currentUser, squad, onNewSession, editingSessionId }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [customMaterial, setCustomMaterial] = useState('');
  const [pdfOrientation, setPdfOrientation] = useState('landscape');
  const pdfRef = useRef(null);

  // Soporte Touch para mover entre slots sin Drag&Drop
  const [selectedTouchIdx, setSelectedTouchIdx] = useState(null);

  const allowedSquad = squad ? squad.filter(gk => gk.assignedCoach === currentUser.username || currentUser.role === 'admin') : [];
  const updateField = (field, value) => setSessionData(prev => ({ ...prev, [field]: String(value) }));
  
  const toggleGk = (gk) => {
    const currentIds = sessionData.gkIds || [];
    const newIds = currentIds.includes(gk.id) ? currentIds.filter(id => id !== gk.id) : [...currentIds, gk.id];
    const newNames = allowedSquad.filter(s => newIds.includes(s.id)).map(s => s.name).join(' - ');
    setSessionData(prev => ({ ...prev, gkIds: newIds, goalkeepers: newNames }));
  };

  const updateMaterialQty = (name, delta) => {
    setSessionData(prev => {
      const current = prev.materialsList || [];
      return {
        ...prev,
        materialsList: current.map(m => 
          m.name === name ? { ...m, qty: Math.max(1, m.qty + delta) } : m
        )
      };
    });
  };

  const toggleMaterial = (mat) => {
    setSessionData(prev => {
      const current = prev.materialsList || [];
      const exists = current.find(m => m.name === mat.name);
      return {
        ...prev,
        materialsList: exists 
          ? current.filter(m => m.name !== mat.name)
          : [...current, { ...mat, qty: 1 }]
      };
    });
  };

  const handleAddCustomMaterial = () => {
    if (!customMaterial.trim()) return;
    const mat = { name: customMaterial.trim().toUpperCase() };
    toggleMaterial(mat);
    setCustomMaterial('');
  };

  const handleSaveTemplateClick = () => {
    if (sessionCart.filter(Boolean).length === 0) return showToast("Añade al menos una tarea.", "error");
    const sessionId = editingSessionId || Date.now().toString();
    const newSession = { 
      id: sessionId, 
      name: `Sesión ${sessionData.sessionNumber || ''} - ${sessionData.team || ''}`, 
      date: new Date().toLocaleDateString(), 
      authorId: currentUser.id, 
      data: { ...sessionData }, 
      cart: sessionCart.map(t => t ? { ...t } : null),
      trashed: false
    };
    onSaveTemplate(newSession);
  };

  const handleSlotClick = (idx) => {
    if (selectedTouchIdx === null) {
        if (sessionCart[idx]) setSelectedTouchIdx(idx);
    } else {
        if (selectedTouchIdx !== idx) {
            const newCart = [...sessionCart];
            const temp = newCart[selectedTouchIdx];
            newCart[selectedTouchIdx] = newCart[idx];
            newCart[idx] = temp;
            setSessionCart(newCart);
        }
        setSelectedTouchIdx(null);
    }
  };

  const generatePdfBlob = async () => {
    const element = pdfRef.current;
    element.style.visibility = 'visible'; element.style.position = 'fixed'; element.style.left = '0px'; element.style.top = '0px'; element.style.zIndex = '-1000';
    await new Promise(r => setTimeout(r, 800));
    try {
      const { default: html2canvas } = await import('https://esm.sh/html2canvas@1.4.1');
      const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1');
      
      const pdf = new jsPDF(pdfOrientation, 'mm', 'a4');
      const pages = element.querySelectorAll('.pdf-page');
      const pdfWidth = pdfOrientation === 'portrait' ? 210 : 297;
      const pdfHeight = pdfOrientation === 'portrait' ? 297 : 210;
      
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 5, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      return pdf;
    } catch (e) { return null; } finally { element.style.visibility = 'hidden'; element.style.position = 'absolute'; element.style.left = '-20000px'; }
  };

  const handleExport = async () => {
    setIsGenerating(true); showToast("Preparando PDF...");
    const pdf = await generatePdfBlob();
    if (pdf) { pdf.save(`Sesion_ATM_${sessionData.sessionNumber || 'Nueva'}.pdf`); showToast("PDF descargado."); } else { showToast("Error al generar PDF.", "error"); }
    setIsGenerating(false);
  };

  const handleShareWhatsApp = async () => {
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
    <div className="max-w-[1200px] mx-auto space-y-8 md:pb-10 pb-28 text-left animate-in fade-in">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] flex flex-col lg:flex-row justify-between items-center gap-6`}>
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Constructor de Sesión</h3>
          <p className="text-slate-500 text-sm mt-1">Rellena la plantilla y exporta el documento oficial.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onNewSession} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs transition-colors">
            <Plus size={16}/> Nueva Sesión
          </button>
          <button onClick={handleSaveTemplateClick} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-white bg-white/80 text-slate-700 hover:bg-white text-xs transition-colors">
            <Save size={16}/> Guardar
          </button>
          <button onClick={() => setShowQR(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-sm border border-white bg-white/80 text-slate-700 hover:bg-white text-xs transition-colors">
            <QrCode size={16}/> QR
          </button>
          <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase shadow-md bg-[#25D366] text-white hover:bg-[#1ebd5c] text-xs transition-colors">
            {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Share2 size={16}/>} WhatsApp
          </button>
          
          <select 
            value={pdfOrientation} 
            onChange={(e) => setPdfOrientation(e.target.value)}
            className="px-4 py-3 rounded-xl font-black uppercase shadow-sm border border-white bg-white/80 text-slate-700 text-xs outline-none cursor-pointer transition-colors hover:bg-white"
          >
            <option value="landscape">Horizontal</option>
            <option value="portrait">Vertical</option>
          </select>

          <button onClick={handleExport} disabled={isGenerating} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase shadow-lg ${isGenerating ? 'bg-slate-300 text-slate-500' : 'bg-red-600 text-white hover:bg-red-700'} text-xs transition-colors`}>
            {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Download size={16}/>} Exportar PDF
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* KANBAN BOARD SECTION */}
        <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] w-full mb-8`}>
           <div className="flex justify-between items-center mb-6">
               <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                 <Layers size={20}/> Estructura de la Sesión (Kanban)
               </h4>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-xl border border-white">
                 Puedes Arrastrar O Tocar para mover
               </span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {KANBAN_COLS.map((col, idx) => {
                 const taskItem = sessionCart[idx];
                 const isTouchSelected = selectedTouchIdx === idx;
                 
                 return (
                    <div
                       key={`kanban-${idx}`}
                       onClick={() => handleSlotClick(idx)}
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
                          setSelectedTouchIdx(null);
                       }}
                       className={`rounded-[2rem] border-2 border-dashed p-4 flex flex-col gap-4 min-h-[260px] transition-all cursor-pointer ${taskItem ? 'bg-blue-50/50 border-blue-300' : 'bg-white/40 border-slate-300'} ${isTouchSelected ? 'ring-4 ring-blue-500 border-transparent shadow-lg transform scale-[1.02]' : ''}`}
                    >
                       <div className="text-center pb-3 border-b border-blue-900/10">
                          <h5 className="font-black text-blue-950 text-[10px] uppercase tracking-widest leading-tight">{String(col.title)}</h5>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{String(col.subtitle)}</span>
                       </div>
                       
                       {taskItem ? (
                          <div 
                             draggable 
                             onDragStart={(e) => e.dataTransfer.setData('taskIdx', String(idx))}
                             className="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full"
                          >
                             <button onClick={(e)=>{
                                e.stopPropagation();
                                const newCart = [...sessionCart];
                                newCart[idx] = null;
                                setSessionCart(newCart);
                                setSelectedTouchIdx(null);
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
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                             <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center bg-white/50 transition-colors ${selectedTouchIdx !== null ? 'border-blue-400 text-blue-500 animate-pulse' : 'border-slate-300 text-slate-300'}`}>
                               <Plus size={20}/>
                             </div>
                             <span className="text-[9px] font-bold uppercase tracking-widest text-center px-4">
                               {selectedTouchIdx !== null ? 'Toca aquí para mover' : 'Vacío'}
                             </span>
                          </div>
                       )}
                    </div>
                 )
              })}
           </div>
        </div>

        {/* PDF FORM SECTION */}
        <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] w-full overflow-x-auto`}>
           <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
             <FileText size={18}/> Plantilla de Cabecera
           </h4>
           {allowedSquad.length > 0 && (
             <div className="mb-6 bg-white/60 p-4 rounded-3xl border border-white">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Convocatoria Rápida</h4>
               <div className="flex flex-wrap gap-2">
                 {allowedSquad.map(gk => {
                    const isSelected = sessionData.gkIds?.includes(gk.id);
                    return (
                      <button key={gk.id} onClick={() => toggleGk(gk)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest shadow-sm ${isSelected ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-500 border-white hover:border-blue-300 hover:text-blue-950'}`}>
                        <img src={gk.avatar} className="w-5 h-5 rounded-full object-cover" alt="avatar"/> {String(gk.name || '')}
                      </button>
                    );
                 })}
               </div>
             </div>
           )}

           {/* GESTOR DE MATERIAL */}
           <div className="mb-6 bg-white/60 p-5 rounded-3xl border border-white shadow-sm">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
               <ListPlus size={14}/> Gestor de Material
             </h4>
             
             {/* Selected Materials Stepper */}
             {(sessionData.materialsList || []).length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/50 rounded-2xl border border-white/50">
                    {sessionData.materialsList.map(m => (
                       <div key={m.name} className="flex items-center bg-blue-950 text-white rounded-xl overflow-hidden shadow-sm">
                          <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-900/50 flex items-center">
                             {m.name}
                          </span>
                          <div className="flex items-center px-1">
                              <button onClick={() => updateMaterialQty(m.name, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors">-</button>
                              <span className="w-6 text-center text-[10px] font-black">{m.qty}</span>
                              <button onClick={() => updateMaterialQty(m.name, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors">+</button>
                          </div>
                          <button onClick={() => toggleMaterial(m)} className="w-8 h-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
                             <X size={12} strokeWidth={3}/>
                          </button>
                       </div>
                    ))}
                 </div>
             )}

             {/* Catalog */}
             <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 scrollbar-hide">
                 {MATERIAL_CATALOG.map(m => {
                     const isSelected = (sessionData.materialsList || []).some(x => x.name === m.name);
                     return (
                         <button 
                             key={m.name} 
                             onClick={() => toggleMaterial(m)}
                             className={`flex items-center px-4 py-1.5 rounded-full border transition-all text-[9px] font-black uppercase tracking-widest shadow-sm ${isSelected ? 'bg-blue-200 border-blue-300 text-blue-800 opacity-50' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-950'}`}
                         >
                             {m.name}
                         </button>
                     )
                 })}
             </div>

             {/* Custom Input */}
             <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/50">
                  <input 
                      type="text" 
                      placeholder="Otro material... (Ej: Lonas de rebote)" 
                      value={customMaterial}
                      onChange={e => setCustomMaterial(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddCustomMaterial()}
                      className="flex-1 bg-white/80 border border-white text-xs font-bold px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400/50 shadow-sm text-slate-700 placeholder:text-slate-400"
                  />
                  <button onClick={handleAddCustomMaterial} className="bg-blue-950 text-white p-2.5 rounded-xl hover:bg-blue-900 shadow-sm transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                     <Plus size={14}/> Añadir
                  </button>
             </div>
           </div>

           <div className="min-w-[700px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
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

      {/* PLANTILLA PDF DINÁMICA CON VERTICAL/HORIZONTAL */}
      <div id="pdf-root-stable-final" style={{ visibility: 'hidden', position: 'absolute', left: '-20000px', top: '-20000px', zIndex: -1000 }} ref={pdfRef}>
        
        {pdfOrientation === 'portrait' ? (
          /* --- FORMATO VERTICAL (2 PÁGINAS) --- */
          <>
            {/* PÁGINA 1 */}
            <div className="pdf-page bg-white flex flex-col gap-3 overflow-hidden mb-10" style={{ width: '793px', height: '1122px', boxSizing: 'border-box', padding: '15px' }}>
               <PdfHeader sessionData={sessionData} />
               <PdfObjectives sessionData={sessionData} />
               
               <div className="bg-white flex justify-between items-center shrink-0 mt-2">
                 <div className="bg-[#cc2b2b] text-white px-4 h-[30px] rounded-md font-bold text-[12px] tracking-widest uppercase shadow-sm flex-1 mr-2 flex items-center justify-center leading-none pb-[1px]">
                   <span>TAREAS FÍSICO-TÉCNICAS</span>
                 </div>
                 <div className="bg-[#1a2b56] text-white font-black text-[12px] w-[90px] h-[30px] rounded-md shadow-sm flex items-center justify-center leading-none pb-[1px]">
                   <span>45 min</span>
                 </div>
               </div>
               
               <div className="flex-1 flex flex-col gap-4 min-h-0 pb-2">
                 <PdfTaskItem task={sessionCart[0]} num={1} />
                 <PdfTaskItem task={sessionCart[1]} num={2} />
               </div>
            </div>

            {/* PÁGINA 2 */}
            <div className="pdf-page bg-white flex flex-col gap-3 overflow-hidden" style={{ width: '793px', height: '1122px', boxSizing: 'border-box', padding: '15px' }}>
               
               <div className="bg-white flex justify-between items-center shrink-0 mt-2">
                 <div className="bg-[#1a2b56] text-white px-4 h-[30px] rounded-md font-bold text-[12px] tracking-widest uppercase shadow-sm flex-1 mr-2 flex items-center justify-center leading-none pb-[1px]">
                   <span>TAREAS TÉCNICO - TÁCTICAS</span>
                 </div>
                 <div className="bg-[#cc2b2b] text-white font-black text-[12px] w-[90px] h-[30px] rounded-md shadow-sm flex items-center justify-center leading-none pb-[1px]">
                   <span>20 min</span>
                 </div>
               </div>
               
               <div className="flex-1 flex flex-col gap-4 min-h-0">
                 <PdfTaskItem task={sessionCart[2]} num={3} />
                 <PdfTaskItem task={sessionCart[3]} num={4} />
               </div>
               
               <div className="bg-[#cc2b2b] text-white px-3 h-[28px] rounded-md shadow-sm shrink-0 flex items-center justify-center mt-2 leading-none pb-[1px]">
                 <span className="font-bold text-[12px] tracking-widest uppercase pb-[1px]">OBSERVACIONES</span>
               </div>
               <div className="h-[200px] bg-slate-50 border-[1.5px] border-[#cc2b2b] rounded-xl p-4 text-[10px] text-slate-800 font-medium whitespace-pre-line shrink-0 overflow-hidden mb-2">
                 {String(sessionData.observaciones || "Añade notas u observaciones a la sesión...")}
               </div>
            </div>
          </>
        ) : (
          /* --- FORMATO HORIZONTAL (1 PÁGINA) --- */
          <div className="pdf-page bg-white flex gap-3 overflow-hidden" style={{ width: '1122px', height: '793px', boxSizing: 'border-box', padding: '15px' }}>
            <div className="w-[48%] flex flex-col h-full gap-2 shrink-0">
               <PdfHeader sessionData={sessionData} />
               <PdfObjectives sessionData={sessionData} />
               <div className="bg-white flex justify-between items-center shrink-0">
                 <div className="bg-[#cc2b2b] text-white px-3 h-[24px] rounded-md font-bold text-[10px] tracking-widest uppercase shadow-sm flex-1 mr-2 flex items-center justify-center leading-none pb-[1px]">
                   <span>TAREAS FÍSICO-TÉCNICAS</span>
                 </div>
                 <div className="bg-[#1a2b56] text-white font-black text-[10px] w-[70px] h-[24px] rounded-md shadow-sm flex items-center justify-center leading-none pb-[1px]">
                   <span>30 MIN</span>
                 </div>
               </div>
               <div className="flex-1 flex flex-col gap-2 min-h-0">
                 <PdfTaskItem task={sessionCart[0]} num={1} />
                 <PdfTaskItem task={sessionCart[1]} num={2} />
               </div>
            </div>
            <div className="w-[52%] flex flex-col h-full gap-2 shrink-0">
               <div className="bg-white flex justify-between items-center shrink-0">
                 <div className="bg-[#1a2b56] text-white px-3 h-[24px] rounded-md font-bold text-[10px] tracking-widest uppercase shadow-sm flex-1 mr-2 flex items-center justify-center leading-none pb-[1px]">
                   <span>TAREAS TÉCNICO - TÁCTICAS</span>
                 </div>
                 <div className="bg-[#cc2b2b] text-white font-black text-[10px] w-[70px] h-[24px] rounded-md shadow-sm flex items-center justify-center leading-none pb-[1px]">
                   <span>15 MIN</span>
                 </div>
               </div>
               <div className="flex-1 flex flex-col gap-2 min-h-0">
                 <PdfTaskItem task={sessionCart[2]} num={3} />
                 <PdfTaskItem task={sessionCart[3]} num={4} />
               </div>
               <div className="bg-[#cc2b2b] text-white px-3 h-[22px] rounded-md shadow-sm shrink-0 flex items-center justify-center leading-none pb-[1px]">
                 <span className="font-bold text-[10px] tracking-widest uppercase pb-[1px]">OBSERVACIONES</span>
               </div>
               <div className="h-[90px] bg-slate-50 border-[1.5px] border-[#cc2b2b] rounded-xl p-3 text-[8.5px] text-slate-800 font-medium whitespace-pre-line shrink-0 overflow-hidden">
                 {String(sessionData.observaciones || "Añade notas u observaciones a la sesión...")}
               </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

function CalendarView({ savedSessions, calendarEvents, onAddEvent, onRemoveEvent, onLoadSession, showToast, onDeleteSession, onCloneSession, onSaveAttendance, squad }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignDate, setAssignDate] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [attendanceSession, setAttendanceSession] = useState(null);
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear(); 
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < (startDay < 0 ? 6 : startDay); i++) days.push(null);
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
    <>
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-28 text-left h-full flex flex-col animate-in fade-in">
      <div className={`${GLASS_CARD} p-6 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6 shrink-0`}>
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Planificador Semanal</h3>
          <p className="text-slate-500 text-sm mt-1">Arrastra tus sesiones al calendario.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl border border-white shadow-sm">
           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"><ChevronUp className="-rotate-90" size={20}/></button>
           <h4 className="font-black text-blue-950 uppercase tracking-widest w-40 text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"><ChevronDown className="-rotate-90" size={20}/></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className={`${GLASS_CARD} flex-1 rounded-[2.5rem] p-6 flex flex-col min-h-[500px] overflow-hidden`}>
           <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
             {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={`header-${d}`} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/60 py-2 rounded-xl border border-white hidden md:block">{String(d)}</div>)}
             {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => <div key={`header-m-${i}`} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/60 py-2 rounded-xl border border-white md:hidden">{String(d)}</div>)}
           </div>
           
           <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1 min-h-0" style={{ gridTemplateRows: `repeat(${Math.ceil(days.length / 7)}, minmax(0, 1fr))` }}>
             {days.map((date, idx) => {
               if (!date) return <div key={`empty-${idx}`} className="bg-transparent rounded-xl border border-dashed border-slate-200"></div>;
               const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
               const dayEvents = calendarEvents[dateString] || [];
               
               const todayDateObj = new Date();
               const isToday = date.getDate() === todayDateObj.getDate() && date.getMonth() === todayDateObj.getMonth() && date.getFullYear() === todayDateObj.getFullYear();

               return (
                 <div key={`day-${idx}-${dateString}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, date)} className={`bg-white/60 rounded-xl border border-white shadow-sm p-1 md:p-2 flex flex-col transition-all overflow-hidden h-full min-h-0 ${isToday ? 'border-red-400 shadow-inner bg-red-50/50' : 'hover:bg-white'}`}>
                   <span className={`text-[10px] md:text-xs font-black text-center shrink-0 mb-1 ${isToday ? 'text-red-600' : 'text-slate-500'}`}>{date.getDate()}</span>
                   
                   <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 min-h-0">
                     {dayEvents.map((sessionItem, sIdx) => {
                       let sessionNum = sessionItem.data?.sessionNumber;
                       if (!sessionNum || String(sessionNum).trim() === '') {
                         const match = String(sessionItem.name || '').match(/\d+º?/);
                         sessionNum = match ? match[0] : '--';
                       }
                       return (
                         <div key={`event-${sessionItem.id}-${dateString}-${sIdx}`} onClick={() => onLoadSession(sessionItem)} className="bg-blue-950 rounded-md md:rounded-lg p-1 shadow-md relative cursor-pointer hover:bg-blue-900 transition-colors flex flex-col items-center justify-center shrink-0 min-h-[40px] group border border-blue-800" title={String(sessionItem.name || 'Ver Sesión')}>
                           <div className="absolute top-0.5 left-0.5 right-0.5 flex justify-between z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
          <div className={`${GLASS_CARD} p-6 rounded-[2.5rem] flex flex-col h-full min-h-[300px] overflow-hidden`}>
            <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-2 shrink-0 flex items-center gap-2">
              <FolderArchive size={18}/> Mis Sesiones
            </h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 shrink-0">
              Arrastra o selecciona fecha
            </p>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {(!savedSessions || savedSessions.length === 0) ? (
                <div className="py-10 text-slate-400 font-bold uppercase tracking-widest text-[10px] text-center border-2 border-dashed border-white/60 rounded-[1.5rem] bg-white/30">
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
                    className="bg-white/70 p-4 rounded-[1.5rem] border border-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="cursor-grab active:cursor-grabbing flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-blue-950 text-xs uppercase truncate group-hover:text-blue-600 transition-colors" title={String(s.name)}>
                          {String(s.name)}
                        </h5>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Clock size={10}/> {s.cart?.filter(Boolean).length || 0} tareas
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-200">
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
                    </div>
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      <button onClick={() => onLoadSession(s)} title="Editar" className="flex items-center justify-center p-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"><Edit2 size={11}/></button>
                      <button onClick={() => onCloneSession(s)} title="Clonar" className="flex items-center justify-center p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"><Copy size={11}/></button>
                      <button onClick={() => setAttendanceSession(s)} title="Asistencia" className="flex items-center justify-center p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors shadow-sm border border-emerald-200"><UserCheck size={11}/></button>
                      <button onClick={() => setConfirmDelete(s)} title="Eliminar" className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><Trash2 size={11}/></button>
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    {confirmDelete && (
      <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
        <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200`}>
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100"><Trash2 size={32}/></div>
          <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-2">¿Eliminar Sesión?</h3>
          <p className="text-slate-500 font-medium text-sm mb-1">Se moverá a la papelera:</p>
          <p className="text-blue-950 font-black text-sm mb-6 uppercase truncate px-4">{String(confirmDelete.name || '')}</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase text-xs tracking-widest">Cancelar</button>
            <button onClick={() => { onDeleteSession(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3.5 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg uppercase text-xs tracking-widest">Sí, Eliminar</button>
          </div>
        </div>
      </div>
    )}
    {attendanceSession && (
      <AttendanceModal session={attendanceSession} squad={squad||[]} onClose={() => setAttendanceSession(null)} onSaveAttendance={onSaveAttendance} />
    )}
    </>
  );
}

function AttendanceModal({ session, squad, onClose, onSaveAttendance }) {
  const sessionGkIds = session.data?.gkIds || [];
  const sessionGks = (squad || []).filter(gk => sessionGkIds.includes(gk.id));
  
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    sessionGks.forEach(gk => { init[gk.id] = session.attendance?.[gk.id] ?? null; });
    return init;
  });

  const [evaluations, setEvaluations] = useState(() => {
    const init = {};
    sessionGks.forEach(gk => { init[gk.id] = { rating: 5, comment: '' }; });
    return init;
  });

  const toggle = (id, val) => setAttendance(prev => ({ ...prev, [id]: prev[id] === val ? null : val }));
  
  const updateEval = (id, field, value) => {
    setEvaluations(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = () => { onSaveAttendance(session, attendance, evaluations); onClose(); };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-20"><X size={20}/></button>
        <div className="flex items-center gap-3 mb-1 shrink-0"><div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center"><UserCheck size={20}/></div><h3 className="text-lg font-black text-blue-950 uppercase tracking-tighter">Asistencia y Evaluación</h3></div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1 shrink-0 border-b border-slate-200 pb-2">{String(session.name || '')}</p>
        
        <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-3 scrollbar-hide">
          {sessionGks.length === 0 ? (
            <div className="py-10 text-center text-slate-400"><Users size={40} className="mx-auto mb-3 opacity-30"/><p className="text-xs font-bold uppercase tracking-widest">No hay porteros convocados.<br/>Edita la sesión primero.</p></div>
          ) : (
            sessionGks.map(gk => (
              <div key={gk.id} className="bg-white/60 p-4 rounded-2xl border border-white shadow-sm flex flex-col transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={gk.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow object-cover" alt={gk.name}/>
                    <span className="text-sm font-black text-blue-950 uppercase">{String(gk.name)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(gk.id, true)} className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${attendance[gk.id] === true ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-300 border-slate-200 hover:border-emerald-400'}`}><Check size={16} strokeWidth={3}/></button>
                    <button onClick={() => toggle(gk.id, false)} className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${attendance[gk.id] === false ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-slate-300 border-slate-200 hover:border-red-400'}`}><X size={16} strokeWidth={3}/></button>
                  </div>
                </div>

                {attendance[gk.id] === true && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">Puntuación: <span className="text-blue-950">{evaluations[gk.id]?.rating}/10</span></span>
                      <input type="range" min="0" max="10" value={evaluations[gk.id]?.rating || 0} onChange={e => updateEval(gk.id, 'rating', Number(e.target.value))} className="flex-1 accent-emerald-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                      <input type="text" placeholder="Observaciones del entrenamiento..." value={evaluations[gk.id]?.comment || ''} onChange={e => updateEval(gk.id, 'comment', e.target.value)} className="w-full text-xs font-medium p-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-700" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase text-xs tracking-widest">Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg uppercase text-xs tracking-widest flex items-center justify-center gap-2"><Save size={14}/> Guardar</button>
        </div>
      </div>
    </div>
  );
}

function SessionsHistoryView({ savedSessions, onLoadSession, onDeleteSession, onCloneSession, onSaveAttendance, squad }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [attendanceSession, setAttendanceSession] = useState(null);
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in md:pb-10 pb-28 text-left">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div><h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Mis Sesiones</h3><p className="text-slate-500 text-sm mt-1">Historial de plantillas guardadas.</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(!savedSessions || savedSessions.length === 0) ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 text-slate-400 bg-white/40 rounded-[3rem] border border-dashed border-white"><FolderArchive size={60} strokeWidth={1}/><span className="font-bold uppercase tracking-widest text-sm">No tienes plantillas guardadas</span></div>
        ) : (
          savedSessions.map((s) => {
            const sessionGkIds = s.data?.gkIds || [];
            const sessionGks = (squad || []).filter(gk => sessionGkIds.includes(gk.id));
            const hasAttendance = s.attendance && Object.keys(s.attendance).length > 0;
            const presentCount = hasAttendance ? Object.values(s.attendance).filter(v => v === true).length : 0;
            return (
              <div key={s.id} className={`${GLASS_CARD} p-6 rounded-[2.5rem] flex flex-col hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0"><FolderArchive size={20}/></div>
                    <div className="min-w-0">
                      <h4 className="font-black text-blue-950 uppercase text-sm truncate">{String(s.name || '')}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{String(s.date || '')} · {s.cart?.filter(Boolean).length || 0} tareas</p>
                    </div>
                  </div>
                  {hasAttendance && (
                    <span className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Check size={10} strokeWidth={3}/> {presentCount}/{sessionGkIds.length}
                    </span>
                  )}
                </div>
                {sessionGks.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 bg-white/50 p-2 rounded-2xl border border-white">
                    <div className="flex -space-x-2">{sessionGks.slice(0,5).map((gk,i) => <img key={i} src={gk.avatar} className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover" title={gk.name} alt="gk"/>)}</div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">{sessionGks.length} portero{sessionGks.length!==1?'s':''}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => onLoadSession(s)} className="flex items-center justify-center gap-1.5 p-2.5 bg-blue-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-900 transition-colors shadow-sm"><Edit2 size={12}/> Editar</button>
                  <button onClick={() => onCloneSession(s)} className="flex items-center justify-center gap-1.5 p-2.5 bg-white text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors border border-slate-200"><Copy size={12}/> Clonar</button>
                  <button onClick={() => setAttendanceSession(s)} className="flex items-center justify-center gap-1.5 p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors border border-emerald-100"><UserCheck size={12}/> Asistencia</button>
                  <button onClick={() => setConfirmDelete(s)} className="flex items-center justify-center gap-1.5 p-2.5 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100"><Trash2 size={12}/> Eliminar</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {confirmDelete && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200`}>
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-100"><Trash2 size={32}/></div>
            <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter mb-2">¿Eliminar Sesión?</h3>
            <p className="text-slate-500 font-medium text-sm mb-1">Se moverá a la papelera:</p>
            <p className="text-blue-950 font-black text-sm mb-6 uppercase truncate px-4">{String(confirmDelete.name || '')}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={() => { onDeleteSession(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3.5 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-lg uppercase text-xs tracking-widest">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
      {attendanceSession && (
        <AttendanceModal session={attendanceSession} squad={squad||[]} onClose={() => setAttendanceSession(null)} onSaveAttendance={onSaveAttendance} />
      )}
    </div>
  );
}

function TrashView({ trashedTasks, onRestoreTask, onDeleteTaskForever, trashedSessions, onRestoreSession, onDeleteSessionForever }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 md:pb-10 pb-28 text-left animate-in fade-in">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div><h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">Papelera</h3><p className="text-slate-500 text-sm mt-1">Recupera elementos o bórralos definitivamente.</p></div>
      </div>
      <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest pl-4 mt-6">Tareas Eliminadas</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-6">
        {trashedTasks.length === 0 ? (<div className="col-span-full py-16 flex flex-col items-center gap-4 text-slate-400 bg-white/40 rounded-[3rem] border border-dashed border-white"><Trash2 size={60} strokeWidth={1}/><span className="font-bold uppercase tracking-widest text-sm text-center">La papelera está vacía</span></div>) : (
          trashedTasks.map(t => (
            <div key={t.id} className={`${GLASS_CARD} relative group rounded-[2.5rem] flex flex-col text-left opacity-75 hover:opacity-100 transition-opacity`}>
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-100"><button onClick={() => onRestoreTask(t)} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-emerald-500 text-white"><ArchiveRestore size={14}/></button><button onClick={() => { if(window.confirm('¿Borrar definitivamente?')) onDeleteTaskForever(t); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-red-600 text-white"><Trash2 size={14}/></button></div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-[2.5rem]"><img src={t.imageUrl} className="w-full h-full object-cover grayscale" alt="img"/></div>
              <div className="p-5 flex-1 flex flex-col bg-white/50 rounded-b-[2.5rem]"><div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{String(t.category)}</div><h3 className="font-black text-slate-400 uppercase text-sm line-through">{String(t.mainObjective)}</h3></div>
            </div>
          ))
        )}
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-28 text-left">
      <div className={`${GLASS_CARD} p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div>
          <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">{editingTask ? 'Editar Tarea' : 'Crear Tarea Manual'}</h3>
          <p className="text-slate-500 text-sm mt-1">Añade o edita los campos y el gráfico de la tarea.</p>
        </div>
        <div className="flex items-center gap-3">
          {editingTask && <button onClick={onCancelEdit} className="px-6 py-4 rounded-2xl font-black uppercase text-slate-500 bg-white/80 hover:bg-white border border-slate-200">Cancelar</button>}
          <button onClick={handleSubmit} className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase shadow-xl bg-red-600 text-white hover:bg-red-700"><Save size={20}/> Guardar Tarea</button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-4 flex flex-col">
           <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={18}/> Gráfico</h4>
           <div className={`${GLASS_CARD} p-2 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]`}>
             {formData.imageUrl ? (
               <>
                 <img src={formData.imageUrl} className="w-full h-full object-cover rounded-[2rem]" alt="Preview"/>
                 <div className="absolute inset-0 bg-blue-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => document.getElementById('task-image-manual').click()}><RefreshCw className="text-white w-10 h-10" /></div>
               </>
             ) : (
               <div className="cursor-pointer flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 rounded-[2rem] hover:border-red-400 hover:bg-red-50/50 bg-white/50" onClick={() => document.getElementById('task-image-manual').click()}>
                 <div className="text-slate-400 w-12 h-12 mb-3"><ImageIcon size={48}/></div>
                 <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Subir Imagen</span>
               </div>
             )}
             <input type="file" id="task-image-manual" accept="image/*" onChange={handleImageUpload} className="hidden" />
           </div>
           <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className={`${GLASS_CARD} w-full p-4 mt-1 rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 cursor-pointer`}>
             <option value="TÉCNICA">Técnica</option>
             <option value="TÁCTICA">Táctica</option>
             <option value="FÍSICA">Física</option>
             <option value="EMOCIONAL">Emocional</option>
           </select>
        </div>
        <div className={`w-full md:w-2/3 ${GLASS_CARD} p-8 rounded-[2.5rem] space-y-5`}>
           <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objetivo Principal *</label>
             <input type="text" className="w-full p-4 mt-1 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 shadow-sm" placeholder="Ej: Blocaje Frontal Raso..." value={formData.mainObjective} onChange={e=>setFormData({...formData, mainObjective: e.target.value})} />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objetivos Secundarios</label>
             <input type="text" className="w-full p-4 mt-1 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700 shadow-sm" placeholder="Ej: Perfilamiento, control orientado..." value={formData.secondaryContents} onChange={e=>setFormData({...formData, secondaryContents: e.target.value})} />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción de Tarea</label>
             <textarea className="w-full p-4 mt-1 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700 h-32 resize-none shadow-sm" placeholder="1. Coordinación en escalera..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
           </div>
           <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Variante</label>
               <textarea className="w-full p-4 mt-1 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-700 h-20 resize-none shadow-sm" placeholder="Ej: Cambiar lateralidad..." value={formData.variant} onChange={e=>setFormData({...formData, variant: e.target.value})} />
             </div>
             <div className="md:w-1/3 flex flex-col gap-4">
               <div>
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duración</label>
                 <input type="text" className="w-full p-4 mt-1 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 shadow-sm" placeholder="Ej: 15 minutos" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visibilidad</label>
                 <div className="flex gap-2 mt-1">
                   <button type="button" onClick={() => setFormData({...formData, visibility: 'public'})} className={`flex-1 py-3 px-1 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${formData.visibility === 'public' ? 'bg-blue-950 text-white shadow-md' : 'bg-white/50 text-slate-500 border border-slate-200 hover:bg-white'}`}><Globe size={12}/> Pública</button>
                   <button type="button" onClick={() => setFormData({...formData, visibility: 'private'})} className={`flex-1 py-3 px-1 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${formData.visibility === 'private' ? 'bg-red-600 text-white shadow-md' : 'bg-white/50 text-slate-500 border border-slate-200 hover:bg-white'}`}><Lock size={12}/> Privada</button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose }) {
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
        <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8 text-left bg-texture">
          <div className="flex-1 flex flex-col gap-4">
            <div className={`${GLASS_CARD} p-4 rounded-[2.5rem] flex-1 flex items-center justify-center overflow-hidden relative`}>
              <img src={task.imageUrl} alt={task.title} className="w-full h-full object-contain max-h-[500px]" />
            </div>
            <button onClick={handleDownload} className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg transition-all"><Download size={20} /> Descargar Gráfico</button>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            <div className="col-span-1 md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-3"><Target size={16} /> Objetivo Principal</div>
              <p className="text-xl font-black text-emerald-950 leading-tight">{String(task.mainObjective || '')}</p>
            </div>
            <div className={`${GLASS_CARD} col-span-1 md:col-span-2 rounded-[2rem] p-6`}>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-3"><List size={16} /> Objetivos Secundarios</div>
              <p className="text-sm font-bold text-blue-950 leading-relaxed">{String(task.secondaryContents || 'No se han especificado contenidos secundarios.')}</p>
            </div>
            <div className={`${GLASS_CARD} col-span-1 md:col-span-2 rounded-[2rem] p-6`}>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-4"><BookOpen size={16} /> Descripción de Tarea</div>
              <p className="text-sm font-medium text-slate-700 whitespace-pre-line leading-loose">{String(task.description || '')}</p>
            </div>
            <div className="col-span-1 md:col-span-2 border-2 border-dashed border-slate-300 bg-white/40 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-3"><RefreshCw size={16} /> Variantes Sugeridas</div>
              <p className="text-sm font-medium text-slate-600 italic whitespace-pre-line leading-relaxed">{String(task.variant || 'No se han añadido variantes.')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatView({ messages, onSendMessage, currentUser, users, onClose }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={`${GLASS_CARD} w-[340px] md:w-[400px] h-[500px] rounded-[2.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200 shadow-2xl`}>
      <div className="bg-blue-950 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center"><MessageCircle size={16} className="text-white"/></div>
          <div>
            <p className="text-white font-black text-sm uppercase tracking-tighter">Chat del Equipo</p>
            <p className="text-blue-300 text-[9px] font-bold uppercase tracking-widest">{users.filter(u=>u.active).length} miembros</p>
          </div>
        </div>
        <button onClick={onClose} className="text-blue-300 hover:text-white p-1.5 rounded-xl hover:bg-blue-900 transition-colors"><X size={18}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <MessageCircle size={40} strokeWidth={1}/>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">Sé el primero en enviar un mensaje</p>
          </div>
        ) : messages.map(msg => {
          const sender = users.find(u => String(u.id) === String(msg.senderId)) || { name: 'Usuario', avatar: FALLBACK_LOGO };
          const isMe = String(msg.senderId) === String(currentUser?.id);
          return (
            <div key={msg.id} className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : ''}`}>
              <img src={sender.avatar || FALLBACK_LOGO} className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0 mb-1" alt="av"/>
              <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 pl-1">{String(sender.name || '').split(' ')[0]}</span>}
                <div className={`px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed break-words shadow-sm ${isMe ? 'bg-blue-950 text-white rounded-br-sm' : 'bg-white border border-white text-slate-700 rounded-bl-sm'}`}>
                  {String(msg.text)}
                </div>
                <span className="text-[8px] text-slate-500 mt-1 px-1">{String(msg.timestamp || '')}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t border-slate-200/60 bg-white shrink-0 flex gap-2 items-center">
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-700"
        />
        <button onClick={send} disabled={!text.trim()} className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-all shadow-sm shrink-0">
          <Send size={14}/>
        </button>
      </div>
    </div>
  );
}

function LoginView({ users, onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  
  const submit = (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    // Simulamos un pequeño tiempo de validación para ejecutar el efecto fluido de carga
    setTimeout(() => {
      const user = users.find(x => String(x.username) === String(u) && String(x.password) === String(p));
      if (user) { 
        if(!user.active) {
          setError("Cuenta desactivada.");
          setIsAuthenticating(false);
        } else {
          // Activamos la transición "Seamless"
          setIsEntering(true);
          // Esperamos a que la pantalla haga Zoom-Out antes de montar el Dashboard principal
          setTimeout(() => onLogin(user), 700);
        }
      } else {
        setError("Usuario o contraseña incorrectos");
        setIsAuthenticating(false);
      }
    }, 600);
  };
  
  return (
    <div className={`h-screen w-full flex bg-blue-950 overflow-hidden transition-all duration-700 ease-in-out ${isEntering ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Lado Izquierdo: Formulario "Split-Screen" */}
      <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col justify-center px-10 md:px-16 py-12 bg-white/5 backdrop-blur-3xl z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] border-r border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-blue-600"></div>
        
        <div className="flex flex-col items-center text-center mb-12">
          <img src={LOGO_ATM_URL} className="h-24 mb-6 drop-shadow-2xl hover:scale-105 transition-transform" alt="ATM" onError={(e)=>e.target.src=FALLBACK_LOGO}/>
          <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">BiblioKeepers <span className="text-red-500">ATM</span></h1>
          <div className="flex flex-col items-center">
            <span className="text-blue-200/80 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              Departamento de porteros
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 text-sm md:text-base font-black tracking-widest uppercase mt-1 drop-shadow-[0_2px_10px_rgba(220,38,38,0.5)]">
              Atlético de Madrid
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="w-full space-y-8">
          {/* Floating Label Input Ultrarrápido (CSS-only) */}
          <div className="relative group">
            <input type="text" id="user" required className="peer w-full bg-transparent border-b-2 border-white/20 text-white px-1 py-3 pt-6 outline-none focus:border-red-500 transition-colors placeholder-transparent" placeholder="Usuario" value={u} onChange={e=>setU(e.target.value)} disabled={isAuthenticating}/>
            <label htmlFor="user" className="absolute left-1 top-3 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-red-400 pointer-events-none">
              Usuario
            </label>
          </div>

          <div className="relative group">
            <input type="password" id="pass" required className="peer w-full bg-transparent border-b-2 border-white/20 text-white px-1 py-3 pt-6 outline-none focus:border-red-500 transition-colors placeholder-transparent" placeholder="Contraseña" value={p} onChange={e=>setP(e.target.value)} disabled={isAuthenticating}/>
            <label htmlFor="pass" className="absolute left-1 top-3 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-red-400 pointer-events-none">
              Contraseña
            </label>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="text-red-400 shrink-0"/>
              <p className="text-red-400 text-xs font-bold">{String(error)}</p>
            </div>
          )}
          
          <div className="pt-6">
            <button type="submit" disabled={isAuthenticating || isEntering} className="relative w-full bg-red-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-[0_8px_25px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] hover:bg-red-500 overflow-hidden group disabled:opacity-80 disabled:scale-100 flex items-center justify-center h-14">
              {/* Brillo dinámico (Shimmer) acelerado por hardware */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shimmer"></div>
              
              {isAuthenticating ? (
                <RefreshCw className="animate-spin text-white" size={20} />
              ) : (
                <span className="relative z-10">Acceder</span>
              )}
            </button>
            
            <div className="mt-8 text-center flex items-center justify-center gap-3 opacity-90">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-red-500/80"></div>
              <p className="text-blue-100/90 text-[10px] font-black italic tracking-widest uppercase drop-shadow-md">
                "Convierte ideas en sesiones."
              </p>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500/80"></div>
            </div>
          </div>
        </form>
      </div>

      {/* Lado Derecho: Imagen de Fondo Espectacular Optimizada */}
      <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-blue-900 to-blue-950">
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-24">
          <h3 className="text-3xl xl:text-4xl font-black text-red-500/90 italic uppercase tracking-tighter mb-4 drop-shadow-xl">
            "Nunca dejes de creer"
          </h3>
          <h2 className="text-6xl xl:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
            Crea.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Desarrolla.</span><br/>Mejora.
          </h2>
          <div className="border-l-4 border-red-500 pl-6 max-w-xl backdrop-blur-sm bg-blue-950/20 p-4 rounded-r-2xl">
            <p className="text-blue-100 text-lg font-medium">
              Exclusivo ecosistema para la gestión y evolución técnico-táctica de nuestros porteros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminView({ users, onSaveUser, onToggleUserActive }) {
  const [isModal, setIsModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', avatar: '', role: 'coach' });

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
    const userToSave = editUser ? {...editUser, name: formData.name, username: formData.username, password: formData.password, avatar: finalAvatar, role: formData.role} : { id: Date.now().toString(), name: formData.name, username: formData.username, password: formData.password, role: formData.role, active: true, avatar: finalAvatar };
    onSaveUser(userToSave);
    setIsModal(false); setFormData({ name: '', username: '', password: '', avatar: '', role: 'coach' }); setEditUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-28 text-left">
      <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-950">Gestión de Entrenadores</h3>
          <p className="text-slate-500 text-sm">Control de accesos y perfiles técnicos.</p>
        </div>
        <button onClick={()=>{setEditUser(null); setFormData({name:'', username:'', password:'', avatar:'', role: 'coach'}); setIsModal(true)}} className="bg-blue-950 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 uppercase text-xs shadow-md">
          <UserPlus size={16}/> Nuevo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={`user-${u.id}`} className={`${GLASS_CARD} p-4 rounded-[2rem] flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <img src={u.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" alt="avatar"/>
              <div className="text-left">
                <p className="font-black text-sm text-blue-950">{String(u.name || '')}</p>
                <p className="text-xs font-medium text-slate-500">@{String(u.username || '')}</p>
                <p className="text-[8px] text-red-600 font-black uppercase tracking-widest">{String(u.role || '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pr-2">
              <button onClick={()=>{setEditUser(u); setFormData({name:u.name, username:u.username, password:u.password, avatar: '', role: u.role || 'coach'}); setIsModal(true)}} className="p-2 text-slate-500 hover:text-blue-600 bg-white rounded-lg shadow-sm"><Edit2 size={16}/></button>
              {u.role !== 'admin' && <button onClick={()=>onToggleUserActive(u.id, !u.active)} className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${u.active?'bg-emerald-500':'bg-slate-300'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${u.active?'left-[26px]':'left-0.5'}`}/></button>}
            </div>
          </div>
        ))}
      </div>

      {isModal && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`${GLASS_CARD} p-8 md:p-10 rounded-[3rem] max-w-sm w-full space-y-5 shadow-2xl relative`}>
             <h4 className="font-black uppercase italic text-blue-950 border-b border-slate-200 pb-3">{editUser ? 'Editar Perfil' : 'Nuevo Entrenador'}</h4>
             <div className="flex items-center gap-4 py-2">
               <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
                 {formData.avatar || (editUser && editUser.avatar) ? <><img src={formData.avatar || editUser.avatar} className="w-full h-full object-cover" alt="avatar" /><div onClick={() => setFormData({...formData, avatar: ''})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"><X size={20} className="text-white" /></div></> : <ImageIcon size={20} className="text-slate-400" />}
               </div>
               <div className="flex-1">
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
                 <label htmlFor="avatar-upload" className="cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl block text-center text-xs w-full shadow-sm">Subir Foto</label>
               </div>
             </div>
             <div className="space-y-3">
               <input className="w-full p-4 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Nombre completo" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/>
               <input className="w-full p-4 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Usuario" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})}/>
               <input className="w-full p-4 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-medium" placeholder="Contraseña" type="text" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})}/>
               
               <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-white/80 border border-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-900 font-bold text-blue-950 cursor-pointer appearance-none">
                  <option value="coach">Entrenador</option>
                  <option value="admin">Administrador</option>
               </select>

             </div>
             <div className="pt-4 space-y-2">
               <button onClick={save} className="w-full bg-blue-950 text-white font-black py-4 rounded-2xl uppercase shadow-lg hover:bg-blue-900">Guardar Cambios</button>
               <button onClick={()=>{setIsModal(false); setFormData({name:'', username:'', password:'', avatar:'', role:'coach'}); setEditUser(null);}} className="w-full text-slate-500 font-bold py-3 hover:text-red-600 uppercase text-xs tracking-widest">Cancelar</button>
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
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(0);
  const prevMessagesLength = useRef(0);
  const [toasts, setToasts] = useState([]);
  const [sessionData, setSessionData] = useState({ ...DEFAULT_SESSION_DATA });
  const [editingSessionId, setEditingSessionId] = useState(null);
  
  // REF PARA MANTENER LAS SESIONES LOCALES EN CASO DE BLOQUEO DE RED
  const localSessionsRef = useRef({});
  const localEventsRef = useRef({});

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg: String(msg), type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    // Comprobar si la app ya está instalada o ejecutándose en modo standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    const handler = (e) => { 
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // INYECTAR EL FAVICON
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/escudo.PNG';
    document.head.appendChild(link);
    document.title = "BiblioKeepers ATM";
  }, []);

  // Load lastReadTimestamp from Firebase when user logs in
  useEffect(() => {
    if (!currentUser || !fbUser) return;
    const ref = getDocRef('userMeta', String(currentUser.id));
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setLastReadTimestamp(snap.data().lastReadTimestamp || 0);
      }
    }, err => console.error("Error cargando userMeta:", err));
    return () => unsub();
  }, [currentUser, fbUser]);

  // Compute unread count from messages newer than lastReadTimestamp sent by others
  useEffect(() => {
    if (!currentUser || isChatOpen) return;
    const count = messages.filter(m =>
      String(m.senderId) !== String(currentUser.id) &&
      (m.createdAt || 0) > lastReadTimestamp
    ).length;
    setUnreadCount(count);
  }, [messages, lastReadTimestamp, currentUser, isChatOpen]);

  // When chat opens, mark all as read in Firebase
  useEffect(() => {
    if (isChatOpen && currentUser && fbUser) {
      const now = Date.now();
      setLastReadTimestamp(now);
      setUnreadCount(0);
      setDoc(getDocRef('userMeta', String(currentUser.id)), { lastReadTimestamp: now }, { merge: true }).catch(() => {});
    }
  }, [isChatOpen]);

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

  const handleDbError = (err) => console.error("Firestore Error:", err);

  useEffect(() => {
     if(!fbUser) return;
     
     const unsubUsers = onSnapshot(getColl('users'), snap => setUsers(snap.docs.map(d => ({...d.data(), id: Number(d.id)||d.id}))), handleDbError);
     
     const unsubTasks = onSnapshot(getColl('tasks'), snap => {
        const all = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setTasks(all.filter(t => !t.trashed));
        setTrashedTasks(all.filter(t => t.trashed));
     }, handleDbError);
     
     const unsubSquad = onSnapshot(getColl('goalkeepers'), snap => setSquad(snap.docs.map(d => ({ id: d.id, ...d.data() }))), handleDbError);
     
     const unsubMessages = onSnapshot(getColl('messages'), snap => {
         const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
         msgs.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
         setMessages(msgs);
     }, handleDbError);

     return () => { unsubUsers(); unsubTasks(); unsubSquad(); unsubMessages(); }
  }, [fbUser]);

  useEffect(() => {
     if(!fbUser || !currentUser) {
         return; 
     }
     
     const unsubSessions = onSnapshot(getColl('sessions'), snap => {
        const serverSessions = snap.docs.map(d => ({id: d.id, ...d.data()}));
        const allMap = {};
        
        // Filter by currentUser
        const userSessions = serverSessions.filter(s => String(s.authorId) === String(currentUser.id));
        userSessions.forEach(s => allMap[s.id] = s);
        
        // Forzar la permanencia en la interfaz de lo guardado en esta sesión localmente
        Object.values(localSessionsRef.current).forEach(ls => {
            if (String(ls.authorId) === String(currentUser.id)) {
                if (allMap[ls.id]) {
                    allMap[ls.id] = { ...allMap[ls.id], ...ls }; 
                } else {
                    allMap[ls.id] = ls;
                }
            }
        });
        
        const all = Object.values(allMap);
        setSavedSessionsState(all.filter(s => !s.trashed));
        setTrashedSessions(all.filter(s => s.trashed));
     }, handleDbError);
     
     const unsubEvents = onSnapshot(getColl('calendarEvents'), snap => {
        const globalEvents = {};
        snap.docs.forEach(d => { 
            const parts = d.id.split('_');
            if (parts.length === 2) {
                const date = parts[0];
                const userId = parts[1];
                if (String(userId) === String(currentUser.id)) {
                    globalEvents[date] = d.data().events || []; 
                }
            }
        });
        
        // Forzar la permanencia de eventos locales
        Object.keys(localEventsRef.current).forEach(date => {
            const localList = localEventsRef.current[date] || [];
            if (localList.length > 0) {
               const serverList = globalEvents[date] || [];
               const merged = [...serverList];
               localList.forEach(ls => {
                  if (!merged.find(s => s.id === ls.id)) {
                     merged.push(ls);
                  }
               });
               globalEvents[date] = merged;
            }
        });

        setCalendarEventsState(globalEvents);
     }, handleDbError);

     return () => { unsubSessions(); unsubEvents(); }
  }, [fbUser, currentUser]);

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
  
  const handleSaveGk = async (gkData) => await setDoc(getDocRef('goalkeepers', gkData.id), cleanData(gkData));
  const handleDeleteGk = async (id) => await deleteDoc(getDocRef('goalkeepers', id));

  const stripLargeData = (session) => {
    if (!session) return session;
    const newSession = cleanData(session);
    if (newSession.cart) {
      newSession.cart = newSession.cart.map(t => {
        if (!t) return null;
        const { imageUrl, ...rest } = t;
        return rest;
      });
    }
    return newSession;
  };

  const handleSaveTemplate = (session) => {
    if (!currentUser) return;

    const strippedSession = stripLargeData(session);
    setDoc(getDocRef('sessions', session.id), strippedSession, { merge: true })
      .catch(e => console.error("Error guardando en background:", e));
    
    // GUARDAR LOCALMENTE: Asegura que aparezca en el planificador inmediatamente
    localSessionsRef.current[session.id] = session;
    setSavedSessionsState(prev => {
        const exists = prev.find(s => s.id === session.id);
        if (exists) return prev.map(s => s.id === session.id ? session : s);
        return [session, ...prev];
    });
    
    setEditingSessionId(session.id);
    showToast("Plantilla guardada.");
  };

  const handleTrashSession = async (sessionId) => { 
      if (!currentUser) return;

      updateDoc(getDocRef('sessions', sessionId), { trashed: true }).catch(()=>{});
      if(localSessionsRef.current[sessionId]) localSessionsRef.current[sessionId].trashed = true;
      setSavedSessionsState(prev => prev.filter(s => s.id !== sessionId));
      showToast("Sesión enviada a papelera", "success"); 
  };

  const handleRestoreSession = async (session) => { 
      if (!currentUser) return;

      updateDoc(getDocRef('sessions', session.id), { trashed: false }).catch(()=>{}); 
      if(localSessionsRef.current[session.id]) localSessionsRef.current[session.id].trashed = false;
      setTrashedSessions(prev => prev.filter(s => s.id !== session.id));
      setSavedSessionsState(prev => [session, ...prev]);
      showToast("Sesión restaurada"); 
  };

  const handleDeleteSessionForever = async (session) => { 
      if (!currentUser) return;

      deleteDoc(getDocRef('sessions', session.id)).catch(()=>{}); 
      if(localSessionsRef.current[session.id]) delete localSessionsRef.current[session.id];
      setTrashedSessions(prev => prev.filter(s => s.id !== session.id));
      showToast("Sesión eliminada para siempre", "success"); 
  };

  const handleCloneSession = async (session) => {
    if (!currentUser) return;

    const clonedId = Date.now().toString();
    const cloned = { ...cleanData(session), id: clonedId, name: `${session.name} (Copia)`, date: new Date().toLocaleDateString(), attendance: {}, trashed: false };
    
    setDoc(getDocRef('sessions', clonedId), stripLargeData(cloned)).catch(()=>{});
    
    // Actualizar caché local para la vista inmediata
    localSessionsRef.current[clonedId] = cloned;
    setSavedSessionsState(prev => [cloned, ...prev]);

    showToast("Sesión clonada correctamente");
  };

  const handleSaveAttendance = async (session, attendance, evaluations) => {
    if (!currentUser) return;

    try {
      updateDoc(getDocRef('sessions', session.id), { attendance: cleanData(attendance) }).catch(()=>{});
      
      // Actualizar caché local
      if (localSessionsRef.current[session.id]) {
          localSessionsRef.current[session.id].attendance = attendance;
      }
      setSavedSessionsState(prev => prev.map(s => s.id === session.id ? { ...s, attendance } : s));

      const sessionGkIds = session.data?.gkIds || [];
      
      for (const gkId of sessionGkIds) {
        const gk = squad.find(g => g.id === gkId);
        if (!gk) continue;

        const existingRecords = gk.attendanceRecord || [];
        // Quitamos si ya existía una entrada para esta sesión específica para evitar duplicados
        const filteredRecords = existingRecords.filter(r => r.sessionId !== session.id);

        if (attendance[gkId] !== null && attendance[gkId] !== undefined) {
            filteredRecords.push({
                sessionId: session.id,
                date: session.date || new Date().toLocaleDateString(),
                sessionName: session.name || `Sesión ${session.data?.sessionNumber}`,
                attended: attendance[gkId]
            });
            
            // Si el jugador asistió y además hay evaluación, actualizamos su history general de puntuaciones
            if (attendance[gkId] === true && evaluations && evaluations[gkId]) {
                const existingHistory = gk.history || [];
                const filteredHistory = existingHistory.filter(h => h.sessionId !== session.id);
                filteredHistory.push({
                    sessionId: session.id,
                    date: session.date || new Date().toLocaleDateString(),
                    rating: evaluations[gkId].rating,
                    comment: evaluations[gkId].comment
                });
                updateDoc(getDocRef('goalkeepers', gkId), { attendanceRecord: cleanData(filteredRecords), history: cleanData(filteredHistory) }).catch(()=>{});
                continue; // Ya guardó ambos
            }
        }
        // Si no hay evaluación o no asistió, solo guarda la asistencia
        updateDoc(getDocRef('goalkeepers', gkId), { attendanceRecord: cleanData(filteredRecords) }).catch(()=>{});
      }
      showToast("Asistencia y Evaluaciones guardadas");
    } catch(e) { showToast("Error guardando datos", "error"); }
  };

  const handleAddEvent = async (dateString, session) => {
    if (!currentUser) return;
    const docId = `${dateString}_${currentUser.id}`;

    const existing = calendarEventsState[dateString] || [];
    if(!existing.find(s => String(s.id) === String(session.id))) {
       const strippedSession = stripLargeData(session);
       
       setDoc(getDocRef('calendarEvents', docId), { events: [...existing.map(stripLargeData), strippedSession] }, { merge: true })
           .catch(e => console.error("Error guardando evento:", e));

       // Actualizar caché local
       localEventsRef.current[dateString] = [...(localEventsRef.current[dateString] || []), session];
           
       setCalendarEventsState(prev => ({
           ...prev,
           [dateString]: [...(prev[dateString] || []), session]
       }));
    }
  };

  const handleRemoveEvent = async (dateString, sessionId) => {
    if (!currentUser) return;
    const docId = `${dateString}_${currentUser.id}`;

    const existing = calendarEventsState[dateString] || [];
    const newEvents = existing.filter(s => String(s.id) !== String(sessionId));
    
    setDoc(getDocRef('calendarEvents', docId), { events: newEvents.map(stripLargeData) }, { merge: true })
        .catch(e => console.error("Error borrando evento:", e));

    if (localEventsRef.current[dateString]) {
        localEventsRef.current[dateString] = localEventsRef.current[dateString].filter(s => String(s.id) !== String(sessionId));
    }

    setCalendarEventsState(prev => ({
        ...prev,
        [dateString]: newEvents
    }));
    showToast("Sesión desasignada del día");
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
    { divider: true, adminOnly: true },
    { id: 'admin', label: 'Entrenadores', icon: Users, adminOnly: true },
    { id: 'trash', label: 'Papelera', icon: Trash2, adminOnly: true }
  ];

  const handleNavClick = (item) => {
    if (item.action) { item.action(); return; }
    setActiveTab(item.id); setEditingTask(null);
  };

  const handleLogout = () => { 
    setCurrentUser(null); 
    setActiveTab('home'); 
    setIsChatOpen(false); 
    setEditingTask(null); 
    setSessionCart([null, null, null, null]); 
    setSessionData({ ...DEFAULT_SESSION_DATA }); 
    setUnreadCount(0); 
    setEditingSessionId(null); 
    setLastReadTimestamp(0); 
    setSavedSessionsState([]); 
    setTrashedSessions([]); 
    setCalendarEventsState({});
    localSessionsRef.current = {};
    localEventsRef.current = {};
  };
  
  const loadSession = (session) => { 
    setSessionData(session.data); 
    const newCart = [null, null, null, null];
    (session.cart || []).forEach((t, i) => { 
        if (i < 4 && t) {
            const fullTask = tasks.find(x => String(x.id) === String(t.id));
            newCart[i] = fullTask ? { ...t, imageUrl: fullTask.imageUrl } : { ...t, imageUrl: FALLBACK_IMG };
        }
    });
    setSessionCart(newCart);
    setEditingSessionId(session.id);
    setActiveTab('builder'); 
    showToast('Sesión cargada en el constructor'); 
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-800 relative animate-in fade-in zoom-in-[0.98] duration-700">
      <style>{`
        .bg-texture {
          background-color: #f8fafc;
          background-image: radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={`toast-${toast.id}`} className={`bg-white/90 backdrop-blur-md border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-emerald-500'} shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-right-8 pointer-events-auto min-w-[250px]`}>
            {toast.type === 'error' ? <AlertCircle className="text-red-500 shrink-0" /> : <CheckCircle2 className="text-emerald-500 shrink-0" />}
            <p className="font-bold text-slate-700 text-xs tracking-wide">{String(toast.msg)}</p>
          </div>
        ))}
      </div>

      {deferredPrompt && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className={`${GLASS_CARD} p-8 md:p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300`}>
            <button onClick={() => setDeferredPrompt(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10">
              <X size={20} />
            </button>
            
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-[2rem] rotate-6 animate-pulse"></div>
              <img src={LOGO_APP_ICON} className="relative w-full h-full rounded-[1.5rem] shadow-lg border-2 border-white object-cover bg-white" alt="icon" onError={(e) => { e.target.src = FALLBACK_LOGO; }}/>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <Download size={16} strokeWidth={3}/>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter mb-2">¡Instala la App!</h3>
            <p className="text-slate-500 font-medium text-xs mb-8 leading-relaxed">
              Añade <strong className="text-blue-900">BiblioKeepers ATM</strong> a tu pantalla de inicio. Disfruta de una experiencia más rápida, a pantalla completa y como una app nativa.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { 
                  deferredPrompt.prompt(); 
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      showToast("¡Gracias por instalar la app!");
                    }
                    setDeferredPrompt(null);
                  }); 
                }} 
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-4 rounded-2xl hover:scale-105 transition-transform shadow-[0_10px_25px_rgba(220,38,38,0.4)] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                <Download size={18}/> Instalar Ahora
              </button>
              <button onClick={() => setDeferredPrompt(null)} className="w-full py-3 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">
                Quizás más tarde
              </button>
            </div>
          </div>
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

      {/* MOBILE NAV: Floating Pill Style (iOS) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-blue-950/90 backdrop-blur-xl text-white flex justify-around items-center px-2 py-3 z-[100] rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-white/10">
         <button onClick={()=>{setActiveTab('home'); setShowFavoritesOnly(false);}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='home'?'text-red-500':'text-blue-200'}`}><Home size={22}/><span className="text-[8px] font-bold tracking-widest">Inicio</span></button>
         <button onClick={()=>{setActiveTab('library'); setShowFavoritesOnly(false);}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='library' && !showFavoritesOnly ?'text-red-500':'text-blue-200'}`}><Search size={22}/><span className="text-[8px] font-bold tracking-widest">Biblioteca</span></button>
         <button onClick={()=>{setActiveTab('builder');}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='builder'?'text-red-500':'text-blue-200'} relative`}><FileStack size={22}/>{activeCartCount>0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full font-black flex items-center justify-center">{activeCartCount}</span>}<span className="text-[8px] font-bold tracking-widest">Sesión</span></button>
         <button onClick={()=>{setActiveTab('calendar');}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='calendar'?'text-red-500':'text-blue-200'}`}><CalendarIcon size={22}/><span className="text-[8px] font-bold tracking-widest">Plan</span></button>
         {liveUser.role === 'admin' ? 
           <button onClick={()=>{setActiveTab('squad');}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='squad'?'text-red-500':'text-blue-200'}`}><Shield size={22}/><span className="text-[8px] font-bold tracking-widest">Plantilla</span></button>
         : 
           <button onClick={()=>{setActiveTab('sessions');}} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab==='sessions'?'text-red-500':'text-blue-200'}`}><FolderArchive size={22}/><span className="text-[8px] font-bold tracking-widest">Mis PDF</span></button>
         }
      </nav>

      {/* Main Container with Background Texture */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-texture relative text-center">
        <div className="pb-28 h-full">
          {activeTab === 'home' && <HomeView tasks={tasks} calendarEvents={calendarEventsState} messages={messages} onSendMessage={handleSendMessage} users={users} squad={squad} setActiveTab={setActiveTab} currentUser={liveUser} onLoadSession={loadSession} savedSessions={savedSessionsState} showToast={showToast} setIsChatOpen={setIsChatOpen} setShowFavoritesOnly={setShowFavoritesOnly} />}
          {activeTab === 'squad' && liveUser.role === 'admin' && <SquadView squad={squad} onSaveGk={handleSaveGk} onDeleteGk={handleDeleteGk} showToast={showToast} users={users} calendarEvents={calendarEventsState} />}
          {activeTab === 'library' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
              <div className={`${GLASS_CARD} p-6 rounded-[2.5rem] space-y-4`}>
                <div className="relative w-full group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600" />
                  <input className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/80 border border-white outline-none focus:ring-2 focus:ring-red-500/20 font-medium text-slate-700 shadow-sm" placeholder="Buscar por título, objetivo o descripción..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-4 items-center pl-2">
                   <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className="bg-transparent text-xs font-bold uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:text-blue-950">
                     <option value="">Todas las Categorías</option>
                     <option value="TÉCNICA">Técnica</option>
                     <option value="TÁCTICA">Táctica</option>
                     <option value="FÍSICA">Física</option>
                     <option value="EMOCIONAL">Emocional</option>
                   </select>
                   <span className="text-slate-300 hidden md:inline">|</span>
                   <select value={filterAuthor} onChange={e=>setFilterAuthor(e.target.value)} className="bg-transparent text-xs font-bold uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:text-blue-950">
                     <option value="">Todos los Entrenadores</option>
                     {[...new Set(tasks.map(t => t.author?.name).filter(Boolean))].map(author => <option key={`author-${author}`} value={String(author)}>{String(author)}</option>)}
                   </select>
                   <div className="flex gap-1 ml-auto bg-white/60 p-1 rounded-xl border border-white">
                     <button onClick={() => setLibraryView('grid')} className={`p-1.5 rounded-lg transition-colors ${libraryView === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-blue-950'}`} title="Vista Cuadrícula"><LayoutGrid size={14}/></button>
                     <button onClick={() => setLibraryView('list')} className={`p-1.5 rounded-lg transition-colors ${libraryView === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-blue-950'}`} title="Vista Lista"><List size={14}/></button>
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
                      <div key={`grid-task-${t.id}`} className="relative group h-full">
                        {canEditOrDelete && (
                          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e)=>{ e.stopPropagation(); setEditingTask(t); setActiveTab('create'); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-blue-600 hover:bg-blue-50"><Edit2 size={14} strokeWidth={3}/></button>
                            <button onClick={(e)=>{ e.stopPropagation(); setTaskToDelete(t); }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl bg-white text-red-600 hover:bg-red-50"><Trash2 size={14} strokeWidth={3}/></button>
                          </div>
                        )}
                        <button onClick={(e) => toggleFavorite(t.id, e)} className={`absolute top-4 ${canEditOrDelete ? 'right-14' : 'right-4'} w-8 h-8 rounded-full flex items-center justify-center shadow-md z-30 transition-all ${isFav ? 'bg-yellow-400 text-white' : 'bg-white/80 backdrop-blur text-slate-400 hover:text-yellow-400'}`}>
                          <Star size={14} strokeWidth={2.5} fill={isFav ? "currentColor" : "none"}/>
                        </button>
                        {t.visibility === 'private' && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-30 flex items-center gap-1 uppercase tracking-widest border-2 border-white"><Lock size={10} /> Privada</div>}
                        <div onClick={() => setSelectedTask(t)} className={`${GLASS_CARD} rounded-[2.5rem] hover:shadow-xl transition-all flex flex-col text-left cursor-pointer h-full ${inCart?'border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]':''}`}>
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
                                     showToast("Tarea añadida al constructor");
                                  } else {
                                     showToast("La sesión ya está llena (4 tareas)", "error");
                                  }
                               }
                            }} className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-xl z-20 transition-all ${inCart?'bg-red-600 text-white shadow-red-600/40':'bg-white/80 backdrop-blur text-slate-500 hover:bg-red-500 hover:text-white'}`}>
                              {inCart ? <Check size={20} strokeWidth={3}/> : <Plus size={20} strokeWidth={3}/>}
                            </button>
                          </div>
                          <div className="p-5 flex-1 flex flex-col bg-white/40 rounded-b-[2.5rem]">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{String(t.category || 'Técnica')}</div>
                            <h3 className="font-black text-blue-950 uppercase text-sm line-clamp-2">{String(t.mainObjective || t.title || '')}</h3>
                            <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center gap-2">
                              <img src={taskAuthor?.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm object-cover" alt="avatar" />
                              <span className="text-[10px] font-black uppercase text-slate-600 truncate">{String(taskAuthor?.name || '')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`list-task-${t.id}`} onClick={() => setSelectedTask(t)} className={`relative group ${GLASS_CARD} rounded-3xl hover:shadow-xl transition-all flex text-left cursor-pointer overflow-hidden h-32 ${inCart?'border-red-500':''}`}>
                        <div className="w-40 shrink-0 relative bg-white/50 border-r border-white/50">
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
                                     showToast("Tarea añadida al constructor");
                                  } else {
                                     showToast("La sesión ya está llena (4 tareas)", "error");
                                  }
                               }
                           }} className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20 transition-all ${inCart?'bg-red-600 text-white shadow-red-600/40':'bg-white/80 backdrop-blur text-slate-500 hover:bg-red-500 hover:text-white'}`}>
                             {inCart ? <Check size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>}
                           </button>
                        </div>
                        <div className="flex-1 p-4 flex flex-col min-w-0 bg-white/40">
                           <div className="flex justify-between items-start mb-1">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{String(t.category || 'Técnica')}</div>
                             {t.visibility === 'private' && <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200"><Lock size={8} /> Privada</div>}
                           </div>
                           <h3 className="font-black text-blue-950 uppercase text-sm truncate leading-normal pb-0.5 shrink-0">{String(t.mainObjective || t.title || '')}</h3>
                           <p className="text-xs text-slate-600 truncate mt-0.5 shrink-0">{String(t.secondaryContents || t.description || '')}</p>
                           <div className="mt-auto pt-2 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <img src={taskAuthor?.avatar} className="w-6 h-6 rounded-full border-2 border-white shadow-sm object-cover" alt="avatar" />
                                <span className="text-[9px] font-black uppercase text-slate-600 truncate">{String(taskAuthor?.name || '')}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={(e) => toggleFavorite(t.id, e)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}>
                                  <Star size={16} strokeWidth={2.5} fill={isFav ? "currentColor" : "none"}/>
                                </button>
                                {canEditOrDelete && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={(e)=>{ e.stopPropagation(); setEditingTask(t); setActiveTab('create'); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 shadow-sm border border-slate-100"><Edit2 size={12} strokeWidth={3}/></button>
                                     <button onClick={(e)=>{ e.stopPropagation(); setTaskToDelete(t); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-red-600 hover:bg-red-50 shadow-sm border border-slate-100"><Trash2 size={12} strokeWidth={3}/></button>
                                  </div>
                                )}
                             </div>
                           </div>
                        </div>
                      </div>
                    );
                  }
                })}
                {filteredTasks.length === 0 && <div className="col-span-full py-20 text-slate-400 font-bold uppercase tracking-widest text-center border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white/40">No hay resultados</div>}
              </div>
            </div>
          )}
          
          {activeTab === 'builder' && <SessionBuilderView sessionCart={sessionCart} setSessionCart={setSessionCart} sessionData={sessionData} setSessionData={setSessionData} showToast={showToast} onSaveTemplate={handleSaveTemplate} currentUser={liveUser} squad={squad} editingSessionId={editingSessionId} onNewSession={()=>{setSessionCart([null, null, null, null]); setSessionData({...DEFAULT_SESSION_DATA}); setEditingSessionId(null);}} />}
          {activeTab === 'calendar' && <CalendarView savedSessions={savedSessionsState} calendarEvents={calendarEventsState} onAddEvent={handleAddEvent} onRemoveEvent={handleRemoveEvent} onLoadSession={loadSession} showToast={showToast} onDeleteSession={(s) => handleTrashSession(s.id)} onCloneSession={handleCloneSession} onSaveAttendance={handleSaveAttendance} squad={squad} />}
          {activeTab === 'create' && <CreateTaskView editingTask={editingTask} onCancelEdit={() => { setEditingTask(null); setActiveTab('library'); }} onTaskSaved={task => { handleSaveTask(task); setEditingTask(null); setActiveTab('library'); showToast("Tarea Guardada"); }} currentUser={liveUser} showToast={showToast} />}
          {activeTab === 'sessions' && <SessionsHistoryView savedSessions={savedSessionsState} onLoadSession={loadSession} onDeleteSession={(s) => handleTrashSession(s.id)} onCloneSession={handleCloneSession} onSaveAttendance={handleSaveAttendance} squad={squad} />}
          {activeTab === 'admin' && liveUser.role === 'admin' && <AdminView users={users} onSaveUser={handleSaveUser} onToggleUserActive={handleToggleUserActive}/>}
          {activeTab === 'trash' && liveUser.role === 'admin' && <TrashView trashedTasks={trashedTasks} onRestoreTask={handleRestoreTask} onDeleteTaskForever={handleDeleteTaskForever} trashedSessions={trashedSessions} onRestoreSession={handleRestoreSession} onDeleteSessionForever={handleDeleteSessionForever} />}
        </div>
      </main>
      
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} users={users} />}

      {taskToDelete && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative`}>
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
          <div className={`${GLASS_CARD} p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl relative`}>
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

      <div className="fixed bottom-[100px] md:bottom-8 right-4 md:right-8 z-[101] flex flex-col items-end gap-4">
        {isChatOpen && <ChatView messages={messages} onSendMessage={handleSendMessage} currentUser={liveUser} users={users} onClose={() => setIsChatOpen(false)} />}
        <button onClick={() => { setIsChatOpen(!isChatOpen); }} className="relative w-14 h-14 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(220,38,38,0.5)] hover:scale-105 transition-all">
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
