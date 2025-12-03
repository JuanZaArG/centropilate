// ========================
// app.js – Lógica de la Landing + Admin Dashboard (MD3)
// ========================

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const scrollToId = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});

const navItems = document.querySelectorAll('.bottom-nav__item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});




// Hero slideshow con efecto fade
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  let index = 0;
  const time = 5000; // tiempo entre imágenes

  function showNext() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }

  setInterval(showNext, time);
});


// Navegación suave
$$('#nav a, #drawer a').forEach(a=> a.addEventListener('click', e=>{
  const href = a.getAttribute('href');
  if(href?.startsWith('#')){ e.preventDefault(); scrollToId(href.slice(1)); }
}));

// ========================
// ADMIN PANEL
// ========================

function openAdmin(){
  const css = `:root{--p:#4ed2ad;--pv:#73d9bc;--surf:#edf1fa;--bg:#cffff1;--out:rgba(0,0,0,.12);--r:14px;--ffA:'Poppins',sans-serif;--ffB:'Open Sans',sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#0d1b17;font-family:var(--ffB)}.app{display:grid;grid-template-columns:260px 1fr;min-height:100dvh}.side{background:color-mix(in oklab,var(--surf) 80%,var(--p) 20%);border-right:1px solid var(--out);padding:16px;position:sticky;top:0;height:100dvh}.logo{display:flex;align-items:center;gap:10px;font-weight:700}.logo .sq{width:36px;height:36px;border-radius:10px;background:var(--p);display:grid;place-items:center;color:#06362c;box-shadow:0 4px 12px rgba(0,0,0,.12)}nav{margin-top:16px;display:grid;gap:8px}nav a{padding:12px 14px;border-radius:10px;font:600 14px/1 var(--ffA);color:#0d2c23;text-decoration:none;border:1px solid transparent}nav a.active,nav a:hover{background:color-mix(in oklab,var(--pv) 50%,white 50%);border-color:var(--out)}.top{display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--out);background:color-mix(in oklab,var(--surf) 90%,var(--p) 10%);position:sticky;top:0;z-index:10}.main{padding:22px;display:grid;gap:18px}.cards{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.card{grid-column:span 3;background:var(--surf);border:1px solid var(--out);border-radius:var(--r);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.card h3{margin:4px 0 8px}.table{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.06)}.table th,.table td{padding:12px;background:var(--surf);border-bottom:1px solid var(--out);text-align:left}.actions{display:flex;gap:8px;flex-wrap:wrap}.btn{background:var(--p);color:#06362c;border:1px solid color-mix(in oklab,var(--p) 60%, black 8%);padding:10px 12px;border-radius:12px;font:600 13px/1 var(--ffA);cursor:pointer}.btn.tonal{background:color-mix(in oklab,var(--pv) 60%, white 40%)}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.panel{grid-column:span 12;background:var(--surf);border:1px solid var(--out);border-radius:12px;padding:16px}
  form label{display:grid;gap:6px;font:600 13px var(--ffA)}input,select{padding:10px;border-radius:10px;border:1px solid var(--out);background:white}`;

  const js = `const $=(s,d=document)=>d.querySelector(s);const $$=(s,d=document)=>Array.from(d.querySelectorAll(s));const db={get(k,def){return JSON.parse(localStorage.getItem(k)||JSON.stringify(def))},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};const state={view:'dashboard'};function render(){ $$('.route').forEach(x=>x.style.display='none'); $('#'+state.view).style.display='block'; $$('.slink').forEach(a=>a.classList.toggle('active', a.dataset.view===state.view)); if(state.view==='clientes') drawClientes(); if(state.view==='turnos') drawTurnos(); }function nav(v){state.view=v; render()}function drawCards(){ $('#mClientes').textContent=db.get('clientes',[]).length; $('#mTurnos').textContent=db.get('turnos',[]).length;}function drawClientes(){ const data=db.get('clientes',[]); const tbody=$('#tClientes'); tbody.innerHTML=data.map(c=>` + "'" + `<tr><td>\${c.nombre}</td><td>\${c.email}</td><td>\${c.plan||'-'}</td><td><button class=btn onclick="delCliente('\${c.id}')">Borrar</button></td></tr>` + "'" + `).join('');}function drawTurnos(){ const data=db.get('turnos',[]); const tbody=$('#tTurnos'); tbody.innerHTML=data.map(t=>` + "'" + `<tr><td>\${t.alumno}</td><td>\${t.clase}</td><td>\${t.dia}</td><td>\${t.hora}</td><td><button class=btn onclick="delTurno(\${t.id})">Borrar</button></td></tr>` + "'" + `).join('');}function addCliente(){ const f=$('#fCliente'); const c={id:Date.now(),nombre:f.nombre.value.trim(),email:f.email.value.trim(),plan:f.plan.value}; if(!c.nombre||!c.email)return alert('Completar nombre y email'); const arr=db.get('clientes',[]); arr.push(c); db.set('clientes',arr); f.reset(); drawClientes(); drawCards(); }function delCliente(id){ const arr=db.get('clientes',[]).filter(x=>x.id!=id); db.set('clientes',arr); drawClientes(); drawCards(); }function addTurno(){ const f=$('#fTurno'); const t={id:Date.now(),alumno:f.alumno.value.trim(),clase:f.clase.value,dia:f.dia.value,hora:f.hora.value}; if(!t.alumno)return alert('Ingresar alumno'); const arr=db.get('turnos',[]); arr.push(t); db.set('turnos',arr); f.reset(); drawTurnos(); drawCards(); }function delTurno(id){ const arr=db.get('turnos',[]).filter(x=>x.id!=id); db.set('turnos',arr); drawTurnos(); drawCards(); }window.addEventListener('DOMContentLoaded',()=>{ render(); drawCards(); if(db.get('clientes',[]).length===0){ db.set('clientes',[{id:1,nombre:'Ana Pérez',email:'ana@mail.com',plan:'8 clases'},{id:2,nombre:'Martín Ruiz',email:'martin@mail.com',plan:'4 clases'}]); } drawClientes(); drawTurnos(); drawCards(); });`;

  const html = `<!DOCTYPE html><html lang=es><head><meta charset=utf-8><meta name=viewport content='width=device-width, initial-scale=1'><title>Admin Pilates Inspira</title><style>${css}</style></head><body><div class=app><aside class=side><div class=logo><div class=sq>PI</div><div>Pilates · Admin</div></div><nav><a class='slink active' data-view='dashboard' href='#' onclick='nav(\"dashboard\")'>Dashboard</a><a class='slink' data-view='clientes' href='#' onclick='nav(\"clientes\")'>Clientes</a><a class='slink' data-view='turnos' href='#' onclick='nav(\"turnos\")'>Turnos</a><a class='slink' data-view='reportes' href='#' onclick='nav(\"reportes\")'>Reportes</a></nav></aside><div><div class=top><div>Panel Administrativo</div><button class='btn tonal' onclick='localStorage.clear();location.reload()'>Reset Demo</button></div><main class=main><section id=dashboard class='route' style='display:block'><div class=cards><div class=card><h3>Clientes</h3><div id=mClientes>0</div></div><div class=card><h3>Turnos</h3><div id=mTurnos>0</div></div></div></section><section id=clientes class='route'><form id=fCliente onsubmit='event.preventDefault();addCliente()'><label>Nombre<input name=nombre required></label><label>Email<input type=email name=email required></label><label>Plan<select name=plan><option value='4 clases'>4 clases</option><option value='8 clases'>8 clases</option><option value='1 suelta'>1 suelta</option></select></label><button class=btn>Guardar</button></form><table class=table><thead><tr><th>Nombre</th><th>Email</th><th>Plan</th><th></th></tr></thead><tbody id=tClientes></tbody></table></section><section id=turnos class='route'><form id=fTurno onsubmit='event.preventDefault();addTurno()'><label>Alumno<input name=alumno required></label><label>Clase<select name=clase><option>Reformer Básico</option><option>Mat Flow</option><option>Clínica de Espalda</option></select></label><label>Día<select name=dia><option>Lun</option><option>Mar</option><option>Mié</option><option>Jue</option><option>Vie</option></select></label><label>Hora<select name=hora><option>08:00</option><option>10:00</option><option>14:00</option><option>18:00</option></select></label><button class=btn>Agregar</button></form><table class=table><thead><tr><th>Alumno</th><th>Clase</th><th>Día</th><th>Hora</th><th></th></tr></thead><tbody id=tTurnos></tbody></table></section><section id=reportes class='route'><p>Reportes y métricas aquí.</p></section></main></div></div><script>${js}<\/script></body></html>`;

  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
}

// Asignar botones Admin
const adminBtn = $('#adminBtn');
const drawerAdminBtn = $('#drawerAdminBtn');
[adminBtn, drawerAdminBtn].forEach(btn => btn?.addEventListener('click', openAdmin));