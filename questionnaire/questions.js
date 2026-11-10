// Questions posées au gérant de Maison Goat. Chaque réponse remplit le site, la FAQ et l'assistant.
// Types : choix (une réponse), multi (plusieurs), nombre, prix (€), heure, texte. « autre » ajoute une case libre.
const MAISONS = [
  { id:"villa", nom:"La Villa à la Cascade", c:"#4A7FD6", d:"#0C1A33", qui:"la villa aux deux piscines et à la cascade" },
  { id:"jardin", nom:"Le Studio Jardin", c:"#6E9E5A", d:"#12210F", qui:"le studio au mur végétal" },
  { id:"lanternes", nom:"Le Duplex aux Lanternes", c:"#A3A33A", d:"#23230E", qui:"le Duplex vert (aussi appelé Duplex 3)" },
  { id:"terrasse", nom:"L'Appartement Terrasse", c:"#D6A452", d:"#2E2109", qui:"l'appartement avec terrasse et jacuzzi" },
  { id:"ocre", nom:"Le Duplex Ocre", c:"#C65A35", d:"#331609", qui:"le Duplex blanc, avec bassin sous verrière" },
  { id:"rose", nom:"Le Studio Ville Rose", c:"#D99A8E", d:"#3A1F1C", qui:"le studio aux voilages" },
  { id:"noyer", nom:"Le Studio Noyer", c:"#9C7356", d:"#1F130B", qui:"le studio en bois et marbre noir" }
];
const ZONES = ["Hivernage","Guéliz","Médina","Palmeraie","Agdal","Targa","Route de l'Ourika","Route de Fès","Route d'Amizmiz","M'hamid"];
const EQUIP = ["Piscine privée","Piscine partagée","Piscine chauffée","Jacuzzi","Climatisation","Chauffage","Wifi","Cuisine équipée","Lave-linge","Lave-vaisselle","Parking","Télévision / Netflix","Barbecue","Terrasse / jardin","Ascenseur","Gardien / sécurité 24h","Salle de cinéma","Sauna / hammam","Salle de sport","Lit bébé","Coffre-fort"];
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const PARTIES = [];
PARTIES.push({ titre:"Vous", etapes:[
  { titre:"Faisons connaissance", champs:[
    { id:"gerant_prenom", type:"texte", label:"Votre prénom", court:true },
    { id:"langues", type:"multi", label:"Les langues dans lesquelles vous répondez aux clients", options:["Français","Anglais","Arabe","Darija","Espagnol","Italien","Allemand"], autre:true } ]},
  { titre:"Votre WhatsApp", champs:[
    { id:"whatsapp_ok", type:"choix", label:"Les demandes de réservation arrivent sur le +33 6 29 96 24 78. C'est le bon numéro ?", options:["Oui, c'est le bon","Non, un autre numéro"], autre:true },
    { id:"reponse_delai", type:"choix", label:"En combien de temps répondez-vous à une demande, en général ?", options:["Moins de 15 minutes","Moins d'une heure","Dans la journée"], autre:true },
    { id:"reponse_horaires", type:"choix", label:"À quelles heures répondez-vous ?", options:["24h/24","De 8h à 22h","De 9h à 20h"], autre:true } ]}
]});

MAISONS.forEach(m => PARTIES.push({ titre:m.nom, maison:m, etapes:[
  { titre:"On parle bien de la même maison ?", photo:true, champs:[
    { id:`${m.id}_nom`, type:"choix", label:`Sur le site, elle s'appelle « ${m.nom} ». Ça vous va ?`, options:["Oui, ce nom me plaît"], autre:"Je préfère un autre nom" },
    { id:`${m.id}_zone`, type:"choix", label:"Dans quel quartier est-elle ?", options:ZONES, autre:true } ]},
  { titre:"Combien de personnes ?", champs:[
    { id:`${m.id}_pers`, type:"nombre", label:"Voyageurs au maximum", min:1, max:30 },
    { id:`${m.id}_ch`, type:"nombre", label:"Chambres", min:0, max:15 },
    { id:`${m.id}_sdb`, type:"nombre", label:"Salles de bain", min:1, max:15 },
    { id:`${m.id}_lits`, type:"multi", label:"Les lits", options:["Lit double","Lits simples","Canapé-lit","Lit king size"], autre:true } ]},
  { titre:"Le prix d'une nuit", champs:[
    { id:`${m.id}_prix_basse`, type:"prix", label:"En saison calme" },
    { id:`${m.id}_prix_haute`, type:"prix", label:"En haute saison" },
    { id:`${m.id}_prix_weekend`, type:"choix", label:"Le week-end coûte plus cher ?", options:["Non, même prix","Oui, +10 %","Oui, +20 %"], autre:true },
    { id:`${m.id}_min_nuits`, type:"choix", label:"Nombre de nuits minimum", options:["1 nuit","2 nuits","3 nuits","5 nuits","7 nuits"], autre:true } ]},
  { titre:"Ce qu'il y a dedans", champs:[
    { id:`${m.id}_equip`, type:"multi", label:"Cochez tout ce que la maison offre", options:EQUIP, autre:true } ]},
  { titre:"Où elle se trouve", champs:[
    { id:`${m.id}_medina`, type:"choix", label:"La place Jemaa el-Fna en voiture", options:["Moins de 10 min","10 à 20 min","20 à 30 min","Plus de 30 min"] },
    { id:`${m.id}_aeroport`, type:"choix", label:"L'aéroport en voiture", options:["Moins de 15 min","15 à 25 min","25 à 40 min","Plus de 40 min"] },
    { id:`${m.id}_plus`, type:"texte", label:"Ce que les clients adorent dans cette maison (une phrase suffit)" } ]}
]}));

PARTIES.push({ titre:"Les saisons", etapes:[
  { titre:"La haute saison", champs:[
    { id:"haute_saison", type:"multi", label:"Quels mois sont en haute saison ?", options:MOIS },
    { id:"fetes", type:"multi", label:"Des dates plus chères encore ?", options:["Noël","Nouvel An","Pâques","Ponts de mai","Vacances scolaires françaises","Fin de Ramadan / Aïd"], autre:true },
    { id:"fetes_supp", type:"choix", label:"Pour ces dates, le prix monte de", options:["Pas de changement","+20 %","+30 %","+50 %"], autre:true } ]},
  { titre:"Les longs séjours", champs:[
    { id:"remise_semaine", type:"choix", label:"Une remise à partir de 7 nuits ?", options:["Non","-5 %","-10 %","-15 %"], autre:true },
    { id:"remise_mois", type:"choix", label:"Une remise à partir de 28 nuits ?", options:["Non","-15 %","-25 %","-35 %"], autre:true } ]}
]});

PARTIES.push({ titre:"Arrivée et départ", etapes:[
  { titre:"Les horaires", champs:[
    { id:"arrivee_heure", type:"choix", label:"Arrivée à partir de", options:["12h","14h","15h","16h"], autre:true },
    { id:"depart_heure", type:"choix", label:"Départ au plus tard à", options:["10h","11h","12h"], autre:true },
    { id:"arrivee_tot", type:"choix", label:"Arriver plus tôt ou partir plus tard ?", options:["Gratuit si c'est libre","Payant","Impossible"], autre:true } ]},
  { titre:"L'accueil", champs:[
    { id:"accueil", type:"multi", label:"Comment le client récupère les clés ?", options:["Accueil en personne","Boîte à clés","Serrure à code","Gardien de la résidence"], autre:true },
    { id:"arrivee_nuit", type:"choix", label:"Une arrivée tard le soir (après 22h)", options:["Aucun problème","Possible avec supplément","Pas possible"], autre:true },
    { id:"papiers", type:"multi", label:"Ce que vous demandez à l'arrivée", options:["Passeport ou carte d'identité","Fiche de police remplie","Acte de mariage pour les couples marocains","Rien"], autre:true } ]}
]});

PARTIES.push({ titre:"L'argent", etapes:[
  { titre:"Le paiement", champs:[
    { id:"acompte", type:"choix", label:"Pour bloquer les dates, un acompte ?", options:["Aucun","30 %","50 %","Tout payé d'avance"], autre:true },
    { id:"moyens", type:"multi", label:"Comment le client peut payer", options:["Espèces en euros","Espèces en dirhams","Virement bancaire","Wise / Revolut","Carte bancaire","PayPal"], autre:true },
    { id:"solde_quand", type:"choix", label:"Le reste se paie", options:["À l'arrivée","Avant l'arrivée","Au départ"], autre:true } ]},
  { titre:"La caution et l'annulation", champs:[
    { id:"caution", type:"choix", label:"Une caution ?", options:["Non","Oui, 100 €","Oui, 200 €","Oui, 500 €"], autre:true },
    { id:"annulation", type:"choix", label:"Annulation gratuite jusqu'à", options:["48 heures avant","7 jours avant","14 jours avant","30 jours avant","Jamais : acompte non remboursé"], autre:true },
    { id:"devise", type:"choix", label:"Sur le site, les prix s'affichent en", options:["Euros","Dirhams","Les deux"] } ]}
]});

PARTIES.push({ titre:"Les règles", etapes:[
  { titre:"La vie dans la maison", champs:[
    { id:"fumer", type:"choix", label:"Fumer", options:["Interdit partout","Seulement dehors"], autre:true },
    { id:"animaux", type:"choix", label:"Les animaux", options:["Non","Oui, petits animaux","Oui, sur demande"], autre:true },
    { id:"fetes_regle", type:"choix", label:"Fêtes et soirées", options:["Interdites","Sur demande seulement","Autorisées"], autre:true },
    { id:"visiteurs", type:"choix", label:"Des invités qui ne dorment pas sur place", options:["Non","Oui, en journée","Sur demande"], autre:true } ]},
  { titre:"Le reste", champs:[
    { id:"silence", type:"choix", label:"Calme à partir de", options:["22h","23h","Minuit","Pas de règle"], autre:true },
    { id:"age_min", type:"choix", label:"Âge minimum pour réserver", options:["18 ans","21 ans","25 ans"], autre:true },
    { id:"enfants", type:"choix", label:"Les enfants", options:["Bienvenus partout","Bienvenus, sauf dans certaines maisons","Pas d'enfants de moins de 12 ans"], autre:true },
    { id:"regle_autre", type:"texte", label:"Une règle importante qu'on oublie ?" } ]}
]});

PARTIES.push({ titre:"Les services", etapes:[
  { titre:"Le ménage et le linge", champs:[
    { id:"menage", type:"choix", label:"Le ménage pendant le séjour", options:["Seulement à la fin","Tous les jours","Tous les 3 jours","Sur demande, payant"], autre:true },
    { id:"linge", type:"multi", label:"Fournis", options:["Draps","Serviettes de bain","Serviettes de piscine","Produits de toilette","Café, thé, eau à l'arrivée"], autre:true } ]},
  { titre:"Ce que vous pouvez organiser", champs:[
    { id:"services", type:"multi", label:"Cochez ce que vous proposez", options:["Transfert aéroport","Chauffeur","Location de voiture","Cuisinière / chef à domicile","Petit-déjeuner","Courses avant l'arrivée","Hammam et massage","Excursion désert d'Agafay","Vallée de l'Ourika","Quad / buggy","Montgolfière","Essaouira"], autre:true },
    { id:"transfert_prix", type:"choix", label:"Le transfert aéroport", options:["Offert","Environ 15 €","Environ 25 €","Selon le nombre de personnes"], autre:true },
    { id:"services_prix", type:"texte", label:"Les prix des services, si vous les connaissez (ex. chef 30 € par repas)" } ]}
]});

PARTIES.push({ titre:"Les imprévus", etapes:[
  { titre:"Si quelque chose ne va pas", champs:[
    { id:"urgence", type:"choix", label:"Un client a un problème la nuit (clim, eau chaude, porte)", options:["On répond 24h/24","Le gardien s'en occupe","On règle ça le matin"], autre:true },
    { id:"intervention", type:"choix", label:"Quelqu'un peut passer en", options:["Moins d'une heure","Dans la demi-journée","Le lendemain"], autre:true },
    { id:"coupures", type:"texte", label:"Une chose à savoir pour éviter les mauvaises surprises (travaux, bruit, accès, eau...)" } ]}
]});

PARTIES.push({ titre:"Vos clients", etapes:[
  { titre:"Qui vient chez vous ?", champs:[
    { id:"clients", type:"multi", label:"Vos clients sont surtout", options:["Couples","Familles","Groupes d'amis","Marocains de l'étranger","Touristes français","Touristes du Golfe","Voyageurs d'affaires","Lunes de miel"], autre:true },
    { id:"differents", type:"multi", label:"Ce qui vous rend différents", options:["Réponse rapide","Maisons récentes et propres","Prix sans frais de plateforme","Services sur mesure","Discrétion","Emplacement","Piscines"], autre:true } ]},
  { titre:"Les questions qu'on vous pose tout le temps", champs:[
    { id:"questions_freq", type:"texte", label:"Écrivez les questions que les clients vous posent sans arrêt. L'assistant y répondra à votre place.", long:true },
    { id:"mauvais_avis", type:"texte", label:"Ce qui a déjà déçu un client, pour qu'on le dise clairement à l'avance", long:true } ]},
  { titre:"Dernière chose", champs:[
    { id:"reservations_ou", type:"multi", label:"Où sont vos réservations aujourd'hui ?", options:["Airbnb","Booking","Carnet / WhatsApp","Agence"], autre:true },
    { id:"assistant_ok", type:"choix", label:"Un assistant automatique répondra aux clients 24h/24 avec ces informations. Vous êtes d'accord ?", options:["Oui","Oui, mais je veux relire ses réponses au début","Non"], autre:true },
    { id:"mot_libre", type:"texte", label:"Autre chose à nous dire ?", long:true } ]}
]});
