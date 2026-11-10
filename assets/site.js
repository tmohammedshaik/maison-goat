// Maison Goat : accueil, page de bien, calendrier, visionneuse. Sans bibliothèque.

// ---------- Calcul des séjours (fonctions pures, testées par test.mjs) ----------
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const versDate = s => { const [y,m,j] = s.split("-").map(Number); return new Date(y, m-1, j); };
const plus = (s, n) => { const d = versDate(s); d.setDate(d.getDate()+n); return iso(d); };
function nuits(arr, dep){ const r=[]; for(let s=arr; s<dep; s=plus(s,1)) r.push(s); return r; }
function prixNuit(MG, b, s){
  const o = MG.offre;
  return o && o.bien===b.id && s>=o.du && s<=o.au ? o.prix : b.prix;
}
function estPris(MG, b, s){ return (MG.bloquees[b.id]||[]).includes(s); }
function libre(MG, b, arr, dep){ return nuits(arr,dep).every(s => !estPris(MG,b,s)); }
function devis(MG, b, arr, dep){
  const ns = nuits(arr, dep), lignes = {};
  ns.forEach(s => { const p = prixNuit(MG,b,s); lignes[p] = (lignes[p]||0)+1; });
  return { n: ns.length, lignes, total: ns.reduce((t,s)=>t+prixNuit(MG,b,s),0) };
}
if (typeof module !== "undefined") { module.exports = { iso, plus, nuits, prixNuit, libre, devis }; }

// ---------- Page ----------
if (typeof window !== "undefined") (() => {
const R = document.body.dataset.page === "bien" ? "../" : "";
const MG = window.MG, $ = (s,r=document) => r.querySelector(s), $$ = (s,r=document) => [...r.querySelectorAll(s)];
const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
const economie = navigator.connection && navigator.connection.saveData;
const fin = matchMedia("(pointer: fine)").matches;
const eur = n => n.toLocaleString("fr-FR") + " €";
const fr = s => versDate(s).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});
const lienWA = t => `https://wa.me/${MG.whatsapp}?text=${encodeURIComponent(t)}`;
const icoWA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

// En-tête qui se remplit, barre d'avancement
const top = $("header.top"), barre = $(".barre");
addEventListener("scroll", () => {
  top && top.classList.toggle("plein", scrollY > 60);
  if (barre) { const h = document.documentElement.scrollHeight - innerHeight; barre.style.width = (h>0 ? scrollY/h*100 : 0) + "%"; }
}, {passive:true});

// Apparitions et étoiles de zellige
const vu = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); vu.unobserve(e.target); } }), {threshold:.2});
const armer = () => $$(".ap, .zellige").forEach(x => vu.observe(x));

// Vidéos : lues seulement quand on les voit
const lancer = v => { v.muted = true; v.play().then(() => v.classList.remove("kb"), () => v.classList.add("kb")); };
const lecteur = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting && !calme && !economie) { if (!v.src) v.src = v.dataset.src; lancer(v); }
  else v.pause();
}), {threshold:.15});
const video = (id, cls="") => `<video class="${cls}" data-src="${R}assets/video/${id}.mp4" poster="${R}assets/video/${id}.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>`;
const armerVideos = () => $$("video[data-src]").forEach(v => lecteur.observe(v));
// L'iPhone remet les vidéos en pause quand on revient sur la page (bouton retour, retour dans Safari)
// sans qu'aucune n'« entre » dans l'écran : on relance celles qui sont visibles.
// Le premier toucher relance aussi (mode économie d'énergie, qui bloque la lecture automatique).
const relancer = () => { if (calme || economie || document.hidden) return; $$("video").forEach(v => {
  const r = v.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || !r.height) return;
  if (!v.src && v.dataset.src) v.src = v.dataset.src; if (v.paused) lancer(v); }); };
addEventListener("pageshow", relancer);
document.addEventListener("visibilitychange", relancer);
addEventListener("touchend", relancer, {passive:true});
addEventListener("click", relancer);
relancer();

// L'étoile à huit branches (deux carrés croisés)
const ZEL = '<svg class="zellige" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 62 38 92 50 62 62 50 92 38 62 8 50 38 38Z"/><path d="M20 20 50 32 80 20 68 50 80 80 50 68 20 80 32 50Z"/><path d="M50 36a14 14 0 1 1 0 28a14 14 0 1 1 0-28"/></svg>';

const bouton = $(".cta");

// ================= ACCUEIL =================
if (document.body.dataset.page === "accueil") {
  // Ouverture : l'arche s'ouvre en plein écran
  const ouv = $(".ouv"), arche = $(".arche"), h1 = $(".ouv h1"), caps = $$(".ouv .cap");
  let p0 = -1;
  const ouvrir = () => {
    const r = ouv.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    if (Math.abs(p - p0) < .002) return; p0 = p;
    arche.style.setProperty("--p", calme ? 1 : Math.min(1, p*1.6).toFixed(3));
    h1.style.opacity = p < .2 ? 1 : 0; h1.style.transform = `translateY(${-p*60}px)`;
    caps[0].classList.toggle("on", p >= .3 && p < .68);
    caps[1].classList.toggle("on", p >= .68);
  };
  addEventListener("scroll", () => requestAnimationFrame(ouvrir), {passive:true}); ouvrir();

  // Ruban
  const mots = ["Sept maisons à Marrakech","Réservation directe sur WhatsApp","Paiement sur place, espèces ou virement","Conciergerie Maison Goat"];
  $(".ruban").innerHTML = `<div>${[...mots,...mots].map(m=>`<span>${m}</span>`).join("")}</div>`;

  // En ce moment
  const o = MG.offre, ob = o && MG.biens.find(b => b.id === o.bien);
  $("#moment").innerHTML = (ob ? `<a class="carte-offre ap" href="${R}${ob.slug}/#dates" style="--o-sig:${ob.sig};--o-deep:${ob.deep};--o-clair:${ob.clair}">
      ${video(ob.id)}<span class="lbl">Offre du moment${MG.demo?" · exemple":""}</span><h3>${ob.nom}</h3>
      <span class="prix">${o.prix} €<s>${ob.prix} €</s></span><span>la nuit, du ${fr(o.du)} au ${fr(o.au)}</span></a>` : "") +
    `<div class="saison ap"><span class="lbl" style="color:var(--gris)">Marrakech en ce moment</span><h3>Novembre, la belle saison.</h3><ul>
      <li><svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="5"/><path d="M14 2v4M14 22v4M2 14h4M22 14h4M5.5 5.5l2.8 2.8M19.7 19.7l2.8 2.8M5.5 22.5l2.8-2.8M19.7 8.3l2.8-2.8"/></svg><span><b>Autour de 22 °C l'après-midi.</b> Des journées douces, des soirées fraîches au bord de l'eau.</span></li>
      <li><svg viewBox="0 0 28 28"><path d="M14 3 17 11 25 14 17 17 14 25 11 17 3 14 11 11Z"/></svg><span><b>${ob ? o.texte : "Pas d'offre en cours."}</b></span></li>
      <li><svg viewBox="0 0 28 28"><path d="M4 6h20v13H11l-5 4v-4H4Z"/></svg><span><b>Sans plateforme.</b> Vous choisissez vos dates, nous vous répondons sur WhatsApp.</span></li></ul></div>`;

  // Les sept maisons
  $("#maisons").innerHTML = MG.biens.map((b,i) => `<a class="band gut" id="b-${b.id}" href="${R}${b.slug}/" style="--b-sig:${b.sig};--b-deep:${b.deep};--b-clair:${b.clair}">
    <div class="txt ap"><span class="n">0${i+1} / 07 · ${b.type}</span><h3>${b.nom}</h3><span class="meta">${b.amb}</span>
      <span class="prix meta">dès ${b.prix} € / nuit · ${b.pers} pers.</span><span class="voir">Entrer dans la maison</span></div>
    <div class="media"><div class="cadre">${video(b.id)}</div></div></a>`).join("");
  const px = MG.biens.map(b => b.prix); $("#fourchette").innerHTML = `De <b>${Math.min(...px)} €</b> à <b>${Math.max(...px)} €</b> la nuit`;
  const idx = $(".index");
  idx.innerHTML = MG.biens.map(b => `<a href="#b-${b.id}" style="--c:${b.sig}" aria-label="${b.nom}" data-id="${b.id}"></a>`).join("");
  let courant = MG.biens[0];
  const allume = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$(".band.on, .index a.on").forEach(x => x.classList.remove("on"));
    e.target.classList.add("on"); const id = e.target.id.slice(2);
    idx.querySelector(`[data-id="${id}"]`).classList.add("on"); courant = MG.biens.find(b => b.id === id);
  }), {rootMargin:"-45% 0px -45% 0px"});
  $$(".band").forEach(x => allume.observe(x));
  new IntersectionObserver(([e]) => idx.classList.toggle("vu", e.isIntersecting), {rootMargin:"-40% 0px -40% 0px"}).observe($("#maisons"));

  // Relief : la maison penche vers la souris, la vidéo glisse au défilement
  const bands = $$(".band");
  if (fin && !calme) bands.forEach(bd => {
    const m = $(".media", bd), c = $(".cadre", bd);
    m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect();
      c.style.setProperty("--ry", ((e.clientX-r.left)/r.width - .5)*10 + "deg");
      c.style.setProperty("--rx", -((e.clientY-r.top)/r.height - .5)*8 + "deg"); });
    m.addEventListener("pointerleave", () => { c.style.setProperty("--rx","0deg"); c.style.setProperty("--ry","0deg"); });
  });
  // Dégradé : le fond mélange les couleurs des deux maisons autour du centre de l'écran
  const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
  const fonds = MG.biens.map(b => rgb(b.deep)), sec = $("#maisons");
  const degrade = () => {
    const c = innerHeight/2, cs = bands.map(bd => { const r = bd.getBoundingClientRect(); return r.top + r.height/2; });
    let i = cs.findIndex(y => y > c); if (i === -1) i = cs.length;
    const a = Math.max(0,i-1), b = Math.min(cs.length-1,i), t = a===b ? 0 : Math.min(1,Math.max(0,(c-cs[a])/(cs[b]-cs[a])));
    sec.style.setProperty("--fond", `rgb(${fonds[a].map((v,k) => Math.round(v + (fonds[b][k]-v)*t))})`);
  };
  addEventListener("scroll", () => requestAnimationFrame(degrade), {passive:true}); degrade();
  if (!calme) addEventListener("scroll", () => requestAnimationFrame(() => bands.forEach(bd => {
    const r = bd.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const k = (r.top + r.height/2 - innerHeight/2) / innerHeight;
    $("video", bd).style.setProperty("--py", (k*-6).toFixed(2) + "%");
  })), {passive:true});

  bouton.innerHTML = "Choisir ma maison";
  bouton.addEventListener("click", () => {
    const r = $("#maisons").getBoundingClientRect();
    if (r.top > 0) $("#maisons").scrollIntoView({behavior:"smooth"}); else location.href = `${R}${courant.slug}/#dates`;
  });
  $$(".zel").forEach(z => z.innerHTML = ZEL);
  armer(); armerVideos();
}

// ================= PAGE D'UN BIEN =================
if (document.body.dataset.page === "bien") {
  const b = MG.biens.find(x => x.id === document.body.dataset.id), ST = document.documentElement.style;
  ST.setProperty("--sig", b.sig); ST.setProperty("--deep", b.deep); ST.setProperty("--clair", b.clair);
  $(".bhero .media").innerHTML = video(b.id);
  if (!calme) addEventListener("scroll", () => { const z = 1.12 - Math.min(.12, scrollY/innerHeight*.12); $(".bhero video").style.setProperty("--z", z); }, {passive:true});

  // Galerie et visionneuse
  const photos = []; for (let i=1;i<=b.photos;i++) if (!(b.sans||[]).includes(i)) photos.push(i);
  const gal = $(".galerie"); let montrees = 0;
  const montrer = n => { gal.insertAdjacentHTML("beforeend", photos.slice(montrees, montrees+n).map((p,k) =>
      `<button type="button" data-i="${montrees+k}" aria-label="Agrandir la photo ${montrees+k+1}"><img src="${R}assets/img/${b.id}/m/${p}.jpg" alt="${b.nom}, photo ${montrees+k+1}" loading="lazy"></button>`).join(""));
    montrees = Math.min(photos.length, montrees+n);
    $(".plus").hidden = montrees >= photos.length; $(".plus button").textContent = `Voir les ${photos.length} photos`; };
  montrer(12); $(".plus button").addEventListener("click", () => montrer(photos.length));
  const lb = $(".lb"), zone = $(".lb .zone"), img = $(".lb img"); let cur = 0;
  const voir = i => { cur = (i+photos.length)%photos.length; zone.classList.remove("z"); img.src = `${R}assets/img/${b.id}/${photos[cur]}.jpg`; $(".lb .num").textContent = `${cur+1} / ${photos.length}`; };
  gal.addEventListener("click", e => { const t = e.target.closest("button"); if (!t) return; voir(+t.dataset.i); lb.hidden = false; document.body.style.overflow="hidden"; $(".lb .x").focus(); });
  const fermer = () => { lb.hidden = true; document.body.style.overflow=""; };
  $(".lb .x").addEventListener("click", fermer);
  $(".lb .g").addEventListener("click", () => voir(cur-1)); $(".lb .d").addEventListener("click", () => voir(cur+1));
  addEventListener("keydown", e => { if (lb.hidden) return; if (e.key==="Escape") fermer(); if (e.key==="ArrowLeft") voir(cur-1); if (e.key==="ArrowRight") voir(cur+1); });
  const origine = e => { const r = img.getBoundingClientRect(); img.style.setProperty("--ox", ((e.clientX-r.left)/r.width*100)+"%"); img.style.setProperty("--oy", ((e.clientY-r.top)/r.height*100)+"%"); };
  zone.addEventListener("click", e => { if (e.target !== img) return; origine(e); zone.classList.toggle("z"); });
  zone.addEventListener("pointermove", e => { if (zone.classList.contains("z")) origine(e); });
  let x0 = null; zone.addEventListener("touchstart", e => x0 = e.touches[0].clientX, {passive:true});
  zone.addEventListener("touchend", e => { if (x0===null || zone.classList.contains("z")) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) voir(cur + (dx<0?1:-1)); x0 = null; });

  // Calendrier
  const auj = iso(new Date()); let arr = null, dep = null, survol = null, decal = 0, pers = Math.min(2, b.pers);
  const moisDe = k => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth()+k, 1); };
  const finAffichee = s => dep ? dep : (arr && survol && survol > arr && libre(MG,b,arr,survol) ? survol : null);
  function grille(k){
    const m = moisDe(k), y = m.getFullYear(), mo = m.getMonth(), nb = new Date(y,mo+1,0).getDate(), vide = (m.getDay()+6)%7;
    let h = `<div><h4>${m.toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</h4><div class="grille">` + ["L","M","M","J","V","S","D"].map(j=>`<span class="js">${j}</span>`).join("") + "<span></span>".repeat(vide);
    const f = finAffichee();
    for (let j=1;j<=nb;j++){
      const s = iso(new Date(y,mo,j)), pris = estPris(MG,b,s), passe = s < auj, p = prixNuit(MG,b,s);
      const cl = ["jour", pris&&"pris", p<b.prix&&"offre", s===arr&&"deb", (s===f)&&"fin", arr&&f&&s>arr&&s<f&&"dans"].filter(Boolean).join(" ");
      const ferme = passe || (pris && !(arr && !dep && s > arr && libre(MG,b,arr,s)));
      h += `<button type="button" class="${cl}" data-d="${s}" ${ferme?"disabled":""} aria-label="${fr(s)}${pris?", déjà réservé":`, ${p} euros`}" aria-pressed="${s===arr||s===dep}">${j}<small>${pris||passe?"":p+"€"}</small></button>`;
    }
    return h + "</div></div>";
  }
  const cal = $(".cal");
  function dessine(){
    $(".mois", cal).innerHTML = grille(decal) + grille(decal+1);
    $(".cal-nav .g", cal).disabled = decal === 0; $(".cal-nav .d", cal).disabled = decal >= 11;
    recap();
  }
  cal.addEventListener("click", e => {
    const t = e.target.closest(".jour"); if (t) { const s = t.dataset.d;
      if (!arr || dep || s <= arr) { if (estPris(MG,b,s)) return; arr = s; dep = null; }
      else if (libre(MG,b,arr,s)) dep = s; else { arr = estPris(MG,b,s) ? null : s; dep = null; }
      dessine(); return; }
    if (e.target.closest(".cal-nav .g")) { decal = Math.max(0,decal-1); dessine(); }
    if (e.target.closest(".cal-nav .d")) { decal = Math.min(11,decal+1); dessine(); }
  });
  if (fin) cal.addEventListener("pointerover", e => { const t = e.target.closest(".jour"); if (!t || !arr || dep) return; if (survol !== t.dataset.d) { survol = t.dataset.d; $(".mois",cal).innerHTML = grille(decal)+grille(decal+1); } });
  $(".voy .moins").addEventListener("click", () => { pers = Math.max(1,pers-1); recap(); });
  $(".voy .plus-v").addEventListener("click", () => { pers = Math.min(b.pers,pers+1); recap(); });
  $(".effacer").addEventListener("click", () => { arr = dep = null; dessine(); });
  function recap(){
    $("#d-arr").textContent = arr ? fr(arr) : "Choisir"; $("#d-dep").textContent = dep ? fr(dep) : "Choisir";
    $(".voy output").textContent = pers; $(".voy .moins").disabled = pers<=1; $(".voy .plus-v").disabled = pers>=b.pers;
    const env = $(".envoyer");
    if (!(arr && dep)) { $(".lignes").innerHTML = `<div><span>${arr ? "Choisissez votre départ" : "Choisissez votre arrivée"}</span></div>`; $(".total b").textContent = "—"; env.setAttribute("aria-disabled","true"); env.removeAttribute("href"); return; }
    const d = devis(MG,b,arr,dep);
    $(".lignes").innerHTML = Object.entries(d.lignes).map(([p,n]) => `<div><span>${n} nuit${n>1?"s":""} × ${p} €${+p<b.prix?" (offre)":""}</span><span>${eur(n*p)}</span></div>`).join("");
    $(".total b").textContent = eur(d.total);
    env.removeAttribute("aria-disabled");
    env.href = lienWA(`Bonjour Maison Goat,\nje souhaite réserver ${b.nom}\ndu ${fr(arr)} au ${fr(dep)} (${d.n} nuit${d.n>1?"s":""}),\npour ${pers} personne${pers>1?"s":""}.\nPrix affiché sur le site : ${eur(d.total)}.\nEst-ce disponible ?`);
  }
  dessine();

  // Les autres maisons
  $(".autres").innerHTML = MG.biens.filter(x => x!==b).map(x => `<a href="${R}${x.slug}/" style="--c:${x.sig}"><img src="${R}assets/video/${x.id}.jpg" alt="" loading="lazy"><span>${x.nom}</span></a>`).join("");

  bouton.innerHTML = icoWA + "Choisir mes dates";
  bouton.addEventListener("click", () => $("#dates").scrollIntoView({behavior:"smooth"}));
  $$(".zel").forEach(z => z.innerHTML = ZEL);
  armer(); armerVideos();
}
})();
