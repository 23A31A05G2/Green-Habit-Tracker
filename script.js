/* ---------- Data model & storage keys ---------- */
const STORAGE = {
  USER: 'ght_username_v1',
  POINTS: 'ght_points_v1',
  CO2: 'ght_co2_v1',
  LOGS: 'ght_logs_v1',
  CUSTOM: 'ght_custom_v1'
};

const PRESET_HABITS = [
  { id:'h1', icon:'🚴', color:'#66bb6a', name:'Biked instead of driving', points:10, co2:0.36 },
  { id:'h2', icon:'🚌', color:'#8bc34a', name:'Used public transport', points:8, co2:0.20 },
  { id:'h3', icon:'🚗', color:'#7cb342', name:'Carpooled with others', points:7, co2:0.25 },
  { id:'h4', icon:'🛍️', color:'#5aa14b', name:'Used reusable bag/bottle', points:5, co2:0.05 },
  { id:'h5', icon:'🚿', color:'#4caf50', name:'Reduced shower time', points:6, co2:0.40 },
  { id:'h6', icon:'💡', color:'#43a047', name:'Turned off lights', points:3, co2:0.02 },
  { id:'h7', icon:'🔌', color:'#388e3c', name:'Unplugged electronics', points:2, co2:0.01 },
  { id:'h8', icon:'♻️', color:'#66bb6a', name:'Recycled waste', points:6, co2:0.15 },
  { id:'h9', icon:'🌳', color:'#2e7d32', name:'Planted a tree', points:20, co2:21.77 },
  { id:'h10', icon:'🍽️', color:'#7ac142', name:'Vegetarian/Vegan meal', points:12, co2:2.00 },
  { id:'h11', icon:'🧺', color:'#77c76b', name:'Composted food waste', points:8, co2:0.10 },
  { id:'h12', icon:'⚡', color:'#6bc36a', name:'Used energy-efficient appliance', points:9, co2:0.12 },
  { id:'h13', icon:'🚶', color:'#74c16a', name:'Walked instead of driving', points:9, co2:0.30 },
  { id:'h14', icon:'💧', color:'#60b657', name:'Saved water (shorter faucet use)', points:4, co2:0.05 },
  { id:'h15', icon:'🧴', color:'#53a94d', name:'Avoided single-use plastic', points:5, co2:0.03 },
  { id:'h16', icon:'📦', color:'#5fbf60', name:'Bought second-hand items', points:7, co2:0.50 },
  { id:'h17', icon:'🌞', color:'#8bc34a', name:'Used Solar Energy', points:15, co2:1.50 },
  { id:'h18', icon:'📱', color:'#66bb6a', name:'Used Digital Notes Instead of Paper', points:4, co2:0.08 },
  { id:'h19', icon:'👕', color:'#4caf50', name:'Donated Old Clothes', points:10, co2:0.75 },
  { id:'h20', icon:'🌱', color:'#43a047', name:'Maintained Home Garden', points:12, co2:0.60 },
  { id:'h21', icon:'🔋', color:'#2e7d32', name:'Used Rechargeable Batteries', points:6, co2:0.10 },
  { id:'h22', icon:'🍃', color:'#81c784', name:'Participated in Clean-up Drive', points:18, co2:1.20 }
];

const BADGES = [
  {id:'b1', name:'Bronze', threshold:100, color:'#b07b3b'},
  {id:'b2', name:'Silver', threshold:250, color:'#9aa4af'},
  {id:'b3', name:'Gold', threshold:500, color:'#d4af37'},
  {id:'b4', name:'Platinum', threshold:1000, color:'#6dd0c6'},
  {id:'b5', name:'Green Champion', threshold:2000, color:'#2e7d32'}
];

let username = localStorage.getItem(STORAGE.USER) || '';
let totalPoints = parseInt(localStorage.getItem(STORAGE.POINTS) || '0',10);
let totalCo2 = parseFloat(localStorage.getItem(STORAGE.CO2) || '0');
let logs = JSON.parse(localStorage.getItem(STORAGE.LOGS) || '[]');
let customHabits = JSON.parse(localStorage.getItem(STORAGE.CUSTOM) || '[]');
let weeklyGoal = 100;

/* ---------- UI refs ---------- */
const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const nameInput = document.getElementById('nameInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const habitGrid = document.getElementById('habitGrid');
const customName = document.getElementById('customName');
const customPoints = document.getElementById('customPoints');
const customCo2 = document.getElementById('customCo2');
const addCustomBtn = document.getElementById('addCustomBtn');
const logsList = document.getElementById('logsList');
const progressInner = document.getElementById('progressInner');
const pointsText = document.getElementById('pointsText');
const co2Text = document.getElementById('co2Text');
const statPoints = document.getElementById('statPoints');
const statCo2 = document.getElementById('statCo2');
const badgesArea = document.getElementById('badgesArea');
const allBadges = document.getElementById('allBadges');
const greeting = document.getElementById('greeting');
const goalText = document.getElementById('goalText');

/* ---------- Initialization ---------- */
goalText.textContent = weeklyGoal;
renderLoginOrApp();
renderAllBadges();

/* ---------- Functions ---------- */
function renderLoginOrApp(){
  if(username){
    loginView.style.display = 'none';
    appView.style.display = 'block';
    greeting.textContent = `Welcome, ${username}`;
    renderHabits();
    renderStats();
    renderLogs();
  }else{
    loginView.style.display = 'block';
    appView.style.display = 'none';
  }
}

loginBtn.addEventListener('click', ()=>{
  const val = nameInput.value.trim();
  if(!val){ alert('Please enter your name'); return; }
  username = val;
  localStorage.setItem(STORAGE.USER, username);
  nameInput.value = '';
  renderLoginOrApp();
});

logoutBtn.addEventListener('click', ()=>{
  if(confirm('Logout?')) {
    username='';
    localStorage.removeItem(STORAGE.USER);
    renderLoginOrApp();
  }
});

clearAllBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all saved data (points, logs, custom habits)?')) return;
  totalPoints = 0;
  totalCo2 = 0;
  logs = [];
  customHabits = [];
  localStorage.removeItem(STORAGE.POINTS);
  localStorage.removeItem(STORAGE.CO2);
  localStorage.removeItem(STORAGE.LOGS);
  localStorage.removeItem(STORAGE.CUSTOM);
  renderStats(); renderLogs(); renderHabits(); renderAllBadges();
});

/* Render habits: presets + customs */
function renderHabits(){
  habitGrid.innerHTML = '';
  const all = PRESET_HABITS.concat(customHabits);
  all.forEach(h=>{
    const card = document.createElement('div');
    card.className='habitCard';
    card.onclick = ()=>handleAddHabit(h);
    const icon = document.createElement('div');
    icon.className='habitIcon';
    icon.style.background = h.color || '#66bb6a';
    icon.textContent = h.icon || '✅';
    const meta = document.createElement('div');
    meta.className='habitMeta';
    const title = document.createElement('b');
    title.textContent = h.name;
    const small = document.createElement('small');
    small.textContent = `${h.points} pts • ${h.co2} kg CO₂`;
    meta.appendChild(title); meta.appendChild(small);
    card.appendChild(icon); card.appendChild(meta);
    habitGrid.appendChild(card);
  });
}

/* Add habit action */
function handleAddHabit(habit){
  totalPoints += Number(habit.points || 0);
  totalCo2 += Number(habit.co2 || 0);
  const entry = {
    id: 'log_' + Date.now(),
    name: habit.name,
    points: Number(habit.points || 0),
    co2: Number(habit.co2 || 0),
    date: new Date().toLocaleString()
  };
  logs.unshift(entry);
  // keep logs reasonable
  if(logs.length>200) logs = logs.slice(0,200);
  persistData();
  renderStats(); renderLogs(); renderAllBadges();
}

/* Custom habit add */
addCustomBtn.addEventListener('click', ()=>{
  const name = customName.value.trim();
  const pts = parseInt(customPoints.value || '0',10);
  const co = parseFloat(customCo2.value || '0');
  if(!name || !pts){ alert('Enter habit name and points'); return; }
  const newH = { id:'c_'+Date.now(), icon:'✨', color:'#82c97a', name, points:pts, co2:co || 0 };
  customHabits.unshift(newH);
  localStorage.setItem(STORAGE.CUSTOM, JSON.stringify(customHabits));
  customName.value=''; customPoints.value=''; customCo2.value='';
  renderHabits();
});

/* Render stats & progress */
function renderStats(){
  pointsText.textContent = `Points: ${totalPoints}`;
  statPoints.textContent = totalPoints;
  co2Text.textContent = `${totalCo2.toFixed(2)} kg`;
  statCo2.textContent = `${totalCo2.toFixed(2)} kg`;
  const pct = Math.min(100, Math.round((totalPoints/weeklyGoal)*100));
  progressInner.style.width = pct + '%';
}

/* Render logs */
function renderLogs(){
  logsList.innerHTML = '';
  if(logs.length===0){
    logsList.innerHTML = '<div style="color:var(--muted)">No activity yet — tap a habit to add one.</div>';
    return;
  }
  logs.forEach(l=>{
    const d = document.createElement('div');
    d.className='logItem';
    d.innerHTML = `<strong>${l.name}</strong><small>${l.points} pts • ${l.co2.toFixed(2)} kg CO₂ • ${l.date}</small>`;
    logsList.appendChild(d);
  });
}

/* Persist to storage */
function persistData(){
  localStorage.setItem(STORAGE.POINTS, totalPoints);
  localStorage.setItem(STORAGE.CO2, totalCo2);
  localStorage.setItem(STORAGE.LOGS, JSON.stringify(logs));
}

/* Badges rendering */
function renderAllBadges(){
  badgesArea.innerHTML = '';
  allBadges.innerHTML = '';
  BADGES.forEach(b=>{
    const earned = totalPoints >= b.threshold;
    const el = document.createElement('div');
    el.className = 'badge';
    el.style.border = earned ? `2px solid ${b.color}` : '1px dashed rgba(0,0,0,0.04)';
    el.style.background = earned ? `linear-gradient(90deg, ${b.color}, #ffffff20)` : 'linear-gradient(90deg,#fff,#f7fff7)';
    el.style.color = earned ? '#000' : 'var(--accent)';
    el.textContent = `${b.name} (${b.threshold} pts)`;
    badgesArea.appendChild(el);

    const el2 = el.cloneNode(true);
    allBadges.appendChild(el2);
  });
}

/* On load: recover stored values */
(function initFromStorage(){
  totalPoints = parseInt(localStorage.getItem(STORAGE.POINTS) || totalPoints,10);
  totalCo2 = parseFloat(localStorage.getItem(STORAGE.CO2) || totalCo2);
  logs = JSON.parse(localStorage.getItem(STORAGE.LOGS) || JSON.stringify(logs));
  customHabits = JSON.parse(localStorage.getItem(STORAGE.CUSTOM) || JSON.stringify(customHabits));
  username = localStorage.getItem(STORAGE.USER) || username;
  renderLoginOrApp();
})();