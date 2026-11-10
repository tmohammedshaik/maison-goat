// Vérifie le calcul des séjours : node test.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { nuits, devis, libre, plus } = createRequire(import.meta.url)("./assets/site.js");

const MG = { offre:{ bien:"j", du:"2026-11-20", au:"2026-11-22", prix:65 }, bloquees:{ j:["2026-11-25"] } };
const b = { id:"j", prix:80 };
assert.equal(plus("2026-11-30", 1), "2026-12-01");
assert.deepEqual(nuits("2026-11-19","2026-11-21"), ["2026-11-19","2026-11-20"]);
assert.deepEqual(devis(MG,b,"2026-11-19","2026-11-24"), { n:5, lignes:{80:2, 65:3}, total:355 }); // 19,23 à 80 ; 20,21,22 à 65
assert.equal(libre(MG,b,"2026-11-23","2026-11-25"), true);  // départ le jour réservé : permis
assert.equal(libre(MG,b,"2026-11-23","2026-11-26"), false); // la nuit du 25 est prise
assert.equal(devis({offre:null,bloquees:{}},b,"2026-12-31","2027-01-02").total, 160);
console.log("calcul des séjours : OK");
