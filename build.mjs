// Fabrique une page par maison (son propre lien, lisible par Google) à partir de maison.html.
// Lancer : node build.mjs  -> tout le site publiable va dans docs/ (c'est ce dossier qui part sur Netlify)   (à refaire quand data.js change de nom, de texte ou de prix de base)
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import vm from "node:vm";

const ctx = { window: {} }; vm.runInNewContext(readFileSync("assets/data.js", "utf8"), ctx);
rmSync("docs", { recursive: true, force: true }); cpSync("assets", "docs/assets", { recursive: true }); cpSync("index.html", "docs/index.html");
const MG = ctx.window.MG, tpl = readFileSync("maison.html", "utf8");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

for (const b of MG.biens) {
  const jsonld = JSON.stringify({ "@context":"https://schema.org", "@type":"VacationRental", name:b.nom, description:b.desc,
    image:`/assets/video/${b.id}.jpg`, address:{ "@type":"PostalAddress", addressLocality:"Marrakech", addressCountry:"MA" },
    containsPlace:{ "@type":"Accommodation", occupancy:{ "@type":"QuantitativeValue", maxValue:b.pers }, numberOfBedrooms:b.ch } }).replace(/</g,"\\u003c");
  const v = { ...b, photos: b.photos - (b.sans||[]).length, atouts: b.atouts.map(a => `<li>${esc(a)}</li>`).join(""), jsonld };
  const html = tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => k === "atouts" || k === "jsonld" ? v[k] : esc(v[k] ?? ""));
  mkdirSync(`docs/${b.slug}`, { recursive: true }); writeFileSync(`docs/${b.slug}/index.html`, html);
  console.log("page :", `/${b.slug}/`);
}
