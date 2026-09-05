const API_URL = 'https://ybvohdsidkiobqcydupx.supabase.co/functions/v1/public-site-media';

const fallback = {
  hero: [
    'https://static.wixstatic.com/media/46300a_aa8cef1e57ac43998cc05f93a6eefe3b~mv2.jpg',
    'https://static.wixstatic.com/media/46300a_051824153b25499990472604f78e2cda~mv2.jpg',
    'https://static.wixstatic.com/media/46300a_cd764168e9a44ec0bbb6c73432bf5a99~mv2.jpg'
  ],
  simulator: ['https://static.wixstatic.com/media/46300a_3f21e15dc9214ffeb7a308ef2fbcc6e0~mv2.jpg'],
  board: [
    {name:'Sébastien Monger',role:'Président',photo:null},
    {name:'Pascal Mourgues',role:'Vice-président',photo:null},
    {name:'Jean-Paul Lapointe',role:'Trésorier',photo:null},
    {name:'Keaven Deroy',role:'Secrétaire',photo:null},
    {name:'Stéphan Bélanger',role:'Administrateur',photo:null},
    {name:'Pierre Decelles',role:'Administrateur',photo:null},
    {name:'Jacques Larouche',role:'Administrateur',photo:null},
  ],
  memberships: [
    {code:'etudiant',label:'Membre Étudiant',annual_fee:0},
    {code:'associe',label:'Membre Associé',annual_fee:60},
    {code:'regulier',label:'Membre Régulier',annual_fee:80},
    {code:'obnl',label:'Membre OBNL',annual_fee:100},
    {code:'corporatif',label:'Membre Corporatif',annual_fee:250},
    {code:'honoraire_80plus',label:'Membre Honoraire 80+',annual_fee:0},
    {code:'a_vie',label:'Membre à Vie',annual_fee:0},
  ],
  activities: [
    {title:'RVA - Lac a Paul 2027',activity_date:'2027-08-20',end_date:'2027-08-22',activity_time:'12:00:00',location:'Lac a Paul',description:'Date planifiée. Les détails seront précisés en 2027.',status:'planifie',cost_amount:0},
    {title:'MAJC 2027',activity_date:'2027-05-22',end_date:null,activity_time:'09:00:00',location:'Hangar APSL',description:'Le sujet et la date précise seront confirmés au premier trimestre 2027.',status:'planifie',cost_amount:0},
    {title:'Party de Noel 2026',activity_date:'2026-11-21',end_date:null,activity_time:'18:30:00',location:'Hangar APSL',description:'Le format de l’activité sera confirmé par l’APSL.',status:'planifie',cost_amount:65},
    {title:'Lac a Paul 2026',activity_date:'2026-08-21',end_date:'2026-08-23',activity_time:null,location:'Lac a Paul',description:'RVA APSL.',status:'termine',cost_amount:0},
    {title:'MAJC 2026',activity_date:'2026-06-18',end_date:null,activity_time:'20:00:00',location:'Hangar APSL',description:'Présentation par Pierre Decelles.',status:'termine',cost_amount:null},
    {title:'Souper crabe 2026',activity_date:'2026-05-09',end_date:null,activity_time:'18:00:00',location:'Hangar APSL',description:'Souper annuel de l’APSL.',status:'termine',cost_amount:125}
  ]
};

const founders = ['Gérard Dallaire','Claude Dery','Ghislain Dery','Hugues-Eric Desbiens','Herman Kohler','Ghislain Lavoie','François Lessard'];
const simulatorPrices = [
  {name:'Vol d’initiation',price:'45 $',detail:'Activité d’environ 1 h, ouverte au public à partir de 12 ans.'},
  {name:'Vol membre',price:'30 $ / h',detail:'Tarif à l’heure pour un membre APSL à jour de cotisation.'},
  {name:'Licence simulateur — non-membre',price:'60 $',detail:'Accès annuel au simulateur selon les conditions de la section.'},
  {name:'Licence simulateur — membre APSL',price:'0 $',detail:'Inscription annuelle à la section simulation incluse pour le membre.'},
  {name:'Bloc 10 heures',price:'250 $',detail:'Crédit de 300 $ — économie de 50 $.'},
  {name:'Bloc 20 heures',price:'450 $',detail:'Crédit de 600 $ — économie de 150 $.'},
  {name:'Bloc 30 heures',price:'600 $',detail:'Crédit de 900 $ — économie de 300 $.'},
];

let data = structuredClone(fallback);
let heroTimer = null;
const app = document.getElementById('app');
const menu = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');

function esc(value=''){
  return String(value).replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
}

function money(value){
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return n === 0 ? 'Gratuit' : `${n.toLocaleString('fr-CA',{maximumFractionDigits:0})} $`;
}

function fmtDate(dateStr){
  if(!dateStr) return '';
  return new Intl.DateTimeFormat('fr-CA',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${dateStr}T12:00:00Z`));
}

function fmtShortDate(dateStr){
  if(!dateStr) return {day:'',month:''};
  const d = new Date(`${dateStr}T12:00:00Z`);
  return {
    day:new Intl.DateTimeFormat('fr-CA',{day:'2-digit',timeZone:'UTC'}).format(d),
    month:new Intl.DateTimeFormat('fr-CA',{month:'short',timeZone:'UTC'}).format(d).replace('.','')
  };
}

function fmtTime(t){ return t ? t.slice(0,5).replace(':',' h ') : ''; }
function initials(name){ return name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase(); }

async function loadData(){
  try{
    const res = await fetch(API_URL,{cache:'no-store'});
    if(!res.ok) throw new Error(`API ${res.status}`);
    const fresh = await res.json();
    data = {...fallback,...fresh};
  }catch(err){
    console.warn('Données APSL en mode secours :',err);
  }
}

function setActiveNav(route){
  document.querySelectorAll('.main-nav a[href^="#/"]').forEach(a=>{
    const target=a.getAttribute('href').slice(1) || '/';
    a.classList.toggle('active',target===route);
  });
}

function closeMenu(){ menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); }
menuToggle.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
});
document.addEventListener('click',e=>{
  if(e.target.closest('.main-nav a')) closeMenu();
});

function pageShell(content){ return `<div class="page">${content}</div>`; }

function home(){
  const heroPhotos = data.hero?.length ? data.hero : fallback.hero;
  const upcoming = data.activities.filter(a=>new Date(`${a.activity_date}T23:59:59`) >= new Date() && a.status !== 'annule').sort((a,b)=>a.activity_date.localeCompare(b.activity_date)).slice(0,3);
  return pageShell(`
    <section class="hero">
      <div class="hero-bg" id="heroBg" style="background-image:url('${heroPhotos[0]}')"></div>
      <div class="hero-overlay"></div>
      <div class="shell hero-content">
        <div class="kicker">Association des Pilotes du Saguenay–Lac-Saint-Jean</div>
        <h1>Vivre l’aviation.<br>Ensemble.</h1>
        <p>Une communauté régionale pour les pilotes, les passionnés, les jeunes et tous ceux qui veulent découvrir l’aviation sous toutes ses formes.</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#/activites">Voir les activités</a>
          <a class="btn btn-glass" href="https://portail.apslpilotes.com/" target="_blank" rel="noopener">Accéder au portail membres</a>
        </div>
      </div>
      <div class="hero-note"><i></i> Photos APSL — rotation automatique</div>
    </section>

    <div class="shell quick-grid">
      <a class="quick-card" href="#/activites"><span>Sorties et événements</span><strong>Activités APSL</strong><div class="quick-arrow">→</div></a>
      <a class="quick-card" href="#/simulateur"><span>Expérience immersive</span><strong>Simulateur de vol</strong><div class="quick-arrow">→</div></a>
      <a class="quick-card" href="#/tarifs"><span>Cotisations et services</span><strong>Tarifs annuels</strong><div class="quick-arrow">→</div></a>
      <a class="quick-card" href="https://meteo.apslpilotes.com/" target="_blank" rel="noopener"><span>Préparation de vol</span><strong>Météo VFR CYRC</strong><div class="quick-arrow">↗</div></a>
    </div>

    <section class="section tint">
      <div class="shell about-grid">
        <div>
          <div class="eyebrow">Depuis 1989</div>
          <h2>La communauté aéronautique du Saguenay–Lac-Saint-Jean.</h2>
          <p class="lead">L’APSL regroupe les passionnés d’aviation de la région, favorise les rencontres, le partage des connaissances et l’accessibilité des jeunes au monde aéronautique.</p>
        </div>
        <div class="info-card">
          <h3>Un point de rencontre pour les pilotes</h3>
          <p>Local à Saint-Honoré, activités, réservoir libre-service, simulateur, formations, réseau de partenaires et services aux membres.</p>
          <div class="stats">
            <div class="stat"><strong>1989</strong><span>année de création</span></div>
            <div class="stat"><strong>CYRC</strong><span>ancrage à Saint-Honoré</span></div>
            <div class="stat"><strong>COPA #214</strong><span>association membre</span></div>
            <div class="stat"><strong>6+</strong><span>disciplines aéronautiques</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-head"><div><div class="eyebrow">Prochainement</div><h2>Nos prochaines activités</h2></div><p>Les dates et lieux sont synchronisés avec le portail APSL. Une modification faite dans le portail apparaît automatiquement ici.</p></div>
        ${renderActivityCards(upcoming)}
        <div style="margin-top:26px"><a class="btn btn-outline" href="#/activites">Toutes les activités →</a></div>
      </div>
    </section>

    <section class="section tint">
      <div class="shell">
        <div class="section-head"><div><div class="eyebrow">Toutes les façons de voler</div><h2>Nos sections aéronautiques</h2></div><p>Avion sur roues, hydravion, planeur, simulateur, autogyre et drone : chacun peut trouver son univers.</p></div>
        ${sectionsCards()}
      </div>
    </section>
  `);
}

function sectionsCards(){
  const cards=[
    ['✈️','Avion sur roues','Sorties, sécurité, partage d’expérience et aviation générale.'],
    ['🌊','Hydravion','Vol sur flotteurs, aviation de brousse et activités régionales.'],
    ['🪂','Planeur','Vol à voile, motoplaneur et découverte du pilotage sans moteur.'],
    ['🎮','Simulateur','Entraînement, découverte et expérience immersive APSL.','#/simulateur'],
    ['🌀','Autogyre','Une autre façon de découvrir le vol léger et les machines atypiques.'],
    ['📡','Drone','Technologies aériennes et découverte des aéronefs télépilotés.']
  ];
  return `<div class="cards">${cards.map(([icon,title,text,href])=>`<article class="card"><div class="card-icon">${icon}</div><h3>${title}</h3><p>${text}</p>${href?`<a class="card-link" href="${href}">Découvrir →</a>`:''}</article>`).join('')}</div>`;
}

function sectionsPage(){
  return pageShell(`
    <section class="page-hero soft"><div class="shell"><div class="kicker">Univers APSL</div><h1>Nos sections aéronautiques</h1><p>Des disciplines différentes, une même passion : faire vivre l’aviation dans la région et créer des occasions de partager l’expérience.</p></div></section>
    <section class="section"><div class="shell">${sectionsCards()}</div></section>
  `);
}

function renderActivityCards(items){
  if(!items.length) return `<div class="empty">Aucune activité publiée pour cette période.</div>`;
  return `<div class="activity-grid">${items.map(a=>{
    const d=fmtShortDate(a.activity_date);
    const range=a.end_date && a.end_date!==a.activity_date ? `${fmtDate(a.activity_date)} au ${fmtDate(a.end_date)}` : fmtDate(a.activity_date);
    const price=a.cost_amount!==null && a.cost_amount!==undefined ? money(a.cost_amount) : '';
    const statusClass=a.status==='termine'?'termine':a.status==='annule'?'annule':'';
    return `<article class="activity-card">
      <div class="activity-top"><div class="date-badge"><b>${d.day}</b><span>${d.month}</span></div><div><h3>${esc(a.title)}</h3><div class="meta"><span>📅 ${esc(range)}</span>${a.activity_time?`<span>🕒 ${esc(fmtTime(a.activity_time))}</span>`:''}${a.location?`<span>📍 ${esc(a.location)}</span>`:''}</div></div></div>
      <div class="activity-body">${esc(a.description || 'Les détails de cette activité seront précisés par l’APSL.')}</div>
      <div class="activity-foot"><span class="status ${statusClass}">${esc(a.status || 'planifié')}</span>${price?`<span class="price-small">${price}</span>`:''}</div>
    </article>`;
  }).join('')}</div>`;
}

function activitiesPage(){
  const now=new Date();
  const future=data.activities.filter(a=>new Date(`${a.activity_date}T23:59:59`)>=now && a.status!=='termine').sort((a,b)=>a.activity_date.localeCompare(b.activity_date));
  const past=data.activities.filter(a=>new Date(`${a.activity_date}T23:59:59`)<now || a.status==='termine').sort((a,b)=>b.activity_date.localeCompare(a.activity_date));
  return pageShell(`
    <section class="page-hero"><div class="shell"><div class="kicker">Calendrier APSL</div><h1>Activités</h1><p>Cette page reprend uniquement les activités de l’association — pas les réunions du CA ni les réunions internes. Les informations viennent directement du portail APSL.</p></div></section>
    <section class="section"><div class="shell"><div class="section-head"><div><div class="eyebrow">À venir</div><h2>Prochaines activités</h2></div><p>Dates, lieux et descriptions se mettent à jour automatiquement lorsque l’information est modifiée dans le portail.</p></div>${renderActivityCards(future)}</div></section>
    <section class="section tint"><div class="shell"><div class="section-head"><div><div class="eyebrow">Archives</div><h2>Activités passées</h2></div><p>Un historique simple pour garder une trace de la vie de l’association.</p></div>
      <div class="archive-list">${past.slice(0,12).map(a=>`<div class="archive-row"><time>${fmtDate(a.activity_date)}</time><strong>${esc(a.title)}</strong><span>${esc(a.location||'')}</span></div>`).join('')}</div>
    </div></section>
  `);
}

function tariffsPage(){
  const publicMemberships=data.memberships.filter(m=>m.code!=='a_vie');
  return pageShell(`
    <section class="page-hero"><div class="shell"><div class="kicker">Adhésion et services</div><h1>Tarifs APSL</h1><p>Une seule page pour comprendre les cotisations annuelles et les principaux tarifs du simulateur.</p></div></section>
    <section class="pricing-section"><div class="shell"><div class="section-head"><div><div class="eyebrow">Cotisations</div><h2>Adhésion annuelle</h2></div><p>Les cotisations sont lues depuis le portail APSL. Une modification du tarif dans le portail sera automatiquement reprise ici.</p></div>
      <div class="pricing-grid">${publicMemberships.map(m=>{
        const featured=m.code==='regulier';
        const desc={regulier:'Membre individuel de l’APSL.',associe:'Pour une personne associée à la communauté APSL.',obnl:'Pour les organismes à but non lucratif partenaires.',corporatif:'Pour les entreprises et organisations corporatives.',etudiant:'Adhésion gratuite pour les étudiants admissibles.',honoraire_80plus:'Statut honorifique selon les règles de l’association.'}[m.code]||'';
        return `<article class="price-card ${featured?'featured':''}">${featured?'<span class="tag">Le plus courant</span>':''}<h3>${esc(m.label)}</h3><div class="price-value">${money(m.annual_fee)}</div><div class="price-unit">${Number(m.annual_fee)===0?'selon admissibilité':'par année'}</div><p>${desc}</p></article>`;
      }).join('')}</div>
      <div class="special-note"><strong>Membres à vie — les 7 fondateurs de l’APSL</strong>Ce statut particulier est réservé aux sept membres créateurs de l’APSL lors de sa fondation. Il ne s’agit pas d’une catégorie d’adhésion ouverte au public.</div>
    </div></section>
    <section class="section tint"><div class="shell"><div class="section-head"><div><div class="eyebrow">Section simulation</div><h2>Tarifs du simulateur</h2></div><p>Initiation, vol membre, licence et blocs d’heures.</p></div>
      <div class="sim-price-table">${simulatorPrices.map(x=>`<div class="sim-price"><div><b>${x.name}</b><small>${x.detail}</small></div><strong>${x.price}</strong></div>`).join('')}</div>
      <div style="margin-top:28px"><a class="btn btn-dark" href="#/simulateur">Découvrir le simulateur →</a></div>
    </div></section>
  `);
}

function simulatorPage(){
  const photos=data.simulator?.length?data.simulator:fallback.simulator;
  return pageShell(`
    <section class="sim-hero"><div class="shell sim-layout"><div class="sim-main-photo" style="background-image:url('${photos[0]}')"></div><div class="sim-copy"><div class="kicker">Section Simulation APSL</div><h1>Prendre les commandes avant de quitter le sol.</h1><p>Le simulateur APSL permet de découvrir le pilotage, de s’entraîner et de partager une expérience immersive dans un cockpit conçu pour reproduire l’environnement d’un avion léger.</p><div class="btn-row"><a class="btn btn-primary" href="https://portail.apslpilotes.com/" target="_blank" rel="noopener">Portail / réservation</a><a class="btn btn-glass" href="mailto:simulation@apslpilotes.com">Nous écrire</a></div></div></div></section>
    <section class="section"><div class="shell"><div class="section-head"><div><div class="eyebrow">Album Simulateur</div><h2>Le cockpit APSL en images</h2></div><p>Ces images proviennent directement de l’album « Simulateur » du portail APSL.</p></div>
      <div class="photo-grid">${photos.map(url=>`<div class="photo-tile" style="background-image:url('${url}')"></div>`).join('')}</div>
    </div></section>
    <section class="section tint"><div class="shell"><div class="section-head"><div><div class="eyebrow">Tarification</div><h2>Voler sur le simulateur</h2></div><p>Des formules simples pour découvrir le simulateur ou voler régulièrement.</p></div><div class="sim-price-table">${simulatorPrices.map(x=>`<div class="sim-price"><div><b>${x.name}</b><small>${x.detail}</small></div><strong>${x.price}</strong></div>`).join('')}</div>
      <div class="info-card" style="margin-top:28px"><h3>Responsable de la section</h3><p><strong>Pascal Mourgues</strong><br><a href="mailto:simulation@apslpilotes.com" style="color:#207fae;font-weight:800">simulation@apslpilotes.com</a><br>1 855 847-0154 poste 25</p></div>
    </div></section>
  `);
}

function boardPage(){
  const people=data.board?.length?data.board:fallback.board;
  return pageShell(`
    <section class="page-hero soft"><div class="shell"><div class="kicker">Gouvernance 2026</div><h1>Notre conseil d’administration</h1><p>Les membres qui donnent de leur temps pour faire vivre l’APSL, ses activités et ses services aux pilotes de la région.</p></div></section>
    <section class="section"><div class="shell"><div class="board-grid">${people.map(p=>`<article class="person-card"><div class="person-photo" ${p.photo?`style="background-image:url('${p.photo}')"`:''}>${p.photo?'':initials(p.name)}</div><div class="person-info"><div class="person-role">${esc(p.role)}</div><div class="person-name">${esc(p.name)}</div></div></article>`).join('')}</div></div></section>
  `);
}

function foundersPage(){
  return pageShell(`
    <section class="page-hero soft"><div class="shell"><div class="kicker">Histoire de l’APSL</div><h1>Les fondateurs</h1><p>Un panneau d’honneur consacré aux sept membres qui ont créé l’Association des Pilotes du Saguenay–Lac-Saint-Jean en 1989.</p></div></section>
    <section class="section"><div class="shell about-grid"><div class="founder-panel"><h2>Les 7 fondateurs de l’APSL</h2><div class="founder-sub">Depuis 1989</div><div class="founder-grid">${founders.map(n=>`<div class="founder-name">${n}</div>`).join('')}</div></div><div><div class="eyebrow">Un héritage vivant</div><h2 style="font-size:40px;line-height:1.05;margin:0 0 16px">Ceux qui ont lancé l’aventure.</h2><p class="lead">Ce tableau ne se veut pas une stèle, mais un panneau d’honneur de type aéroclub : une façon simple et chaleureuse de reconnaître les personnes à l’origine de l’association.</p></div></div></section>
    <section class="section tint"><div class="shell"><div class="section-head"><div><div class="eyebrow">Quelques repères</div><h2>Une association née pour rassembler</h2></div></div><div class="timeline"><div class="timeline-item"><div class="timeline-year">1989</div><div><h3>Création de l’APSL</h3><p>L’association est créée avec l’objectif de regrouper les passionnés d’aviation du Saguenay–Lac-Saint-Jean et de favoriser l’accès des jeunes au monde aéronautique.</p></div></div><div class="timeline-item"><div class="timeline-year">CYRC</div><div><h3>Ancrage à Saint-Honoré</h3><p>L’APSL est aujourd’hui établie au 720, chemin du Volair, à Saint-Honoré.</p></div></div><div class="timeline-item"><div class="timeline-year">Aujourd’hui</div><div><h3>Une communauté multidisciplinaire</h3><p>Avion, hydravion, planeur, simulateur, autogyre, drone, formation et activités sociales composent maintenant la vie de l’association.</p></div></div></div></div></section>
  `);
}

const routes={
  '/':home,
  '/activites':activitiesPage,
  '/sections':sectionsPage,
  '/simulateur':simulatorPage,
  '/tarifs':tariffsPage,
  '/ca':boardPage,
  '/fondateurs':foundersPage,
};

function currentRoute(){
  const raw=location.hash.replace(/^#/,'') || '/';
  return routes[raw]?raw:'/';
}

function startHeroRotation(){
  clearInterval(heroTimer);
  const el=document.getElementById('heroBg');
  const photos=data.hero?.length?data.hero:fallback.hero;
  if(!el||photos.length<2) return;
  let i=0;
  heroTimer=setInterval(()=>{
    i=(i+1)%photos.length;
    el.style.opacity='.25';
    setTimeout(()=>{el.style.backgroundImage=`url('${photos[i]}')`;el.style.opacity='1';},350);
  },8000);
}

function render(){
  const route=currentRoute();
  setActiveNav(route);
  app.innerHTML=(routes[route]||home)();
  window.scrollTo({top:0,behavior:'instant'});
  if(route==='/') startHeroRotation(); else clearInterval(heroTimer);
  document.title = route==='/' ? 'APSL — Association des Pilotes du Saguenay–Lac-Saint-Jean' : `${document.querySelector('h1')?.textContent || 'APSL'} — APSL`;
  requestAnimationFrame(()=>app.focus({preventScroll:true}));
}

async function boot(){
  app.innerHTML='<div class="loading"><div class="loading-box"><div class="spinner"></div><div>Chargement du site APSL…</div></div></div>';
  await loadData();
  render();
}

window.addEventListener('hashchange',render);
boot();
