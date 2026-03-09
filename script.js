// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const FLAGS={ES:"🇪🇸",DE:"🇩🇪",IE:"🇮🇪",JM:"🇯🇲",BE:"🇧🇪",JP:"🇯🇵",NL:"🇳🇱",FR:"🇫🇷",MX:"🇲🇽",CA:"🇨🇦",DK:"🇩🇰",US:"🇺🇸",IT:"🇮🇹",BR:"🇧🇷",CN:"🇨🇳",ZA:"🇿🇦",GR:"🇬🇷",AU:"🇦🇺",SE:"🇸🇪",CZ:"🇨🇿",PT:"🇵🇹",AR:"🇦🇷",GB:"🇬🇧",NO:"🇳🇴",PL:"🇵🇱",TH:"🇹🇭",SG:"🇸🇬"};
const CNAMES={DE:"Germany",IE:"Ireland",JM:"Jamaica",BE:"Belgium",JP:"Japan",NL:"Netherlands",FR:"France",MX:"Mexico",CA:"Canada",DK:"Denmark",US:"USA",IT:"Italy",ES:"Spain",BR:"Brazil",CN:"China",ZA:"South Africa",GR:"Greece",AU:"Australia",SE:"Sweden",CZ:"Czech Republic",PT:"Portugal",AR:"Argentina",GB:"Great Britain",NO:"Norway",PL:"Poland",TH:"Thailand",SG:"Singapore"};

const beers=[
  // JAN 2026 (17 beers)
  {beer:"Grolsch",         style:"Pilsner-Other",            origin:"NL",abv:5.0,method:"Bottle",city:"Hengelo",     region:"Overijssel",      country:"Netherlands", cc:"NL", rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Hertog Jan",      style:"Pilsner-Other",            origin:"NL",abv:5.1,method:"Bottle",city:"Hengelo",     region:"Overijssel",      country:"Netherlands", cc:"NL", rating:2.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Coors Light",     style:"Lager-American",           origin:"US",abv:4.2,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Sapporo",         style:"Lager-Pale",               origin:"JP",abv:4.9,method:"Bottle",city:"Hartsdale",   region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Ichiban",         style:"Lager-Pale",               origin:"JP",abv:5.0,method:"Bottle",city:"Hartsdale",   region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Modelo",          style:"Lager-Mexican",            origin:"MX",abv:4.5,method:"Bottle",city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Stella Artois",   style:"Lager-Pale",               origin:"BE",abv:5.0,method:"Bottle",city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Duvel",           style:"Belgian Strong Golden Ale",origin:"BE",abv:8.5,method:"Bottle",city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Duvel",           style:"Belgian Strong Golden Ale",origin:"BE",abv:8.5,method:"Bottle",city:"Amsterdam",   region:"Noord-Holland",   country:"Netherlands", cc:"NL", rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Carlsberg",       style:"Pilsner-Other",            origin:"DK",abv:5.0,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Carlsberg",       style:"Lager-Pale",               origin:"DK",abv:5.0,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Harp",            style:"Lager-Pale",               origin:"IE",abv:4.5,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"La Fin Du Monde", style:"Belgian Tripel",           origin:"CA",abv:9.0,method:"Can",   city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:2.75,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"1664",            style:"Lager-Pale",               origin:"FR",abv:5.5,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Michelob Ultra",  style:"Lager-American",           origin:"US",abv:4.2,method:"Can",   city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:2.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Guinness",        style:"Stout-Irish Dry",          origin:"IE",abv:4.2,method:"Nitro", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Red Stripe",      style:"Lager-Pale",               origin:"JM",abv:4.7,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Jan",monthN:1,year:2026},
  // FEB 2026 (17 beers)
  {beer:"Heineken",        style:"Lager-Pale",               origin:"NL",abv:5.0,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Guinness",        style:"Stout-Irish Dry",          origin:"IE",abv:4.2,method:"Nitro", city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Weihenstephaner", style:"Wheat Beer-Hefeweizen",    origin:"DE",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.50,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Modelo Negra",    style:"Lager-Munich Dunkel",      origin:"MX",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.25,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Münchner Weisse",  style:"Wheat Beer-Hefeweizen",    origin:"DE",abv:5.1,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:4.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Modelo Negra",    style:"Lager-Munich Dunkel",      origin:"MX",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Stella Artois",   style:"Lager-Pale",               origin:"BE",abv:5.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Munchen Dunkel",  style:"Lager-Munich Dunkel",      origin:"DE",abv:5.5,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Bud Light",       style:"Lager-American Light",     origin:"US",abv:4.2,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Budweiser",       style:"Lager-American",           origin:"US",abv:5.0,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Corona Extra",    style:"Lager-Mexican",            origin:"MX",abv:4.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Corona Extra",    style:"Lager-Mexican",            origin:"MX",abv:4.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Heineken",        style:"Lager-Pale",               origin:"NL",abv:5.0,method:"Bottle",city:"Uncassville", region:"Connecticut",     country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Moretti",         style:"Lager-Pale",               origin:"IT",abv:4.6,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Erdinger Weissbier",style:"Wheat Beer-Hefeweizen",  origin:"DE",abv:5.3,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Sapporo",           style:"Lager-Pale",            origin:"JP",abv:4.9,method:"Bottle",city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Coors Light",     style:"Lager-American",           origin:"US",abv:4.2,method:"Bottle",city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Feb",monthN:2,year:2026},
  // MAR 2026
  {beer:"Estrella Galicia",style:"Lager-Helles",              origin:"ES",abv:5.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Pilsner Urquell", style:"Pilsner-Other",             origin:"CZ",abv:4.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Wrench",         style:"IPA-New England Hazy",       origin:"US",abv:7.1,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Fin Du Monde",style:"Belgian Tripel",             origin:"CA",abv:9.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Żywiec",         style:"Lager-Pale",                origin:"PL",abv:5.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Corona Extra",   style:"Lager-Mexican",             origin:"MX",abv:4.5,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Peroni",         style:"Lager-Pale",                origin:"IT",abv:5.1,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:2.50,isNew:true, month:"Mar",monthN:3,year:2026},
];

// Merge user-added beers from localStorage
(function(){
  try {
    const saved=JSON.parse(localStorage.getItem('brewUserBeers')||'[]');
    saved.forEach(b=>beers.push(b));
  } catch(e){ console.error('Failed to load user beers:',e); }
})();

const drunkLocs=[
  {city:"New York",    region:"New York",             country:"USA",         cc:"US", lat:40.7128,lng:-74.0060},
  {city:"New Rochelle",region:"New York",             country:"USA",         cc:"US", lat:40.9115,lng:-73.7826},
  {city:"White Plains",region:"New York",             country:"USA",         cc:"US", lat:41.0340,lng:-73.7629},
  {city:"Eastchester", region:"New York",             country:"USA",         cc:"US", lat:40.9565,lng:-73.8115},
  {city:"Hartsdale",   region:"New York",             country:"USA",         cc:"US", lat:41.0215,lng:-73.7987},
  {city:"Montreal",    region:"Quebec",               country:"Canada",      cc:"CA", lat:45.5017,lng:-73.5673},
  {city:"Amsterdam",   region:"Noord-Holland",        country:"Netherlands", cc:"NL", lat:52.3676,lng:4.9041},
  {city:"Hengelo",     region:"Overijssel",           country:"Netherlands", cc:"NL", lat:52.2660,lng:6.7930},
  {city:"Uncassville", region:"Connecticut",           country:"USA",         cc:"US", lat:41.4775,lng:-72.0892},
];

const breweries=[
  {name:"Weihenstephaner",        location:"Freising, Bavaria",         country:"Germany",     cc:"DE", lang:"de", beers:"Weihenstephaner · Münchner Weisse · Munchen Dunkel", nativeName:"Weihenstephaner · Münchner Weiße · Münchner Dunkel", lat:48.3953,lng:11.7291, ratings:[4.50,4.75,2.75]},
  {name:"Guinness (St. James's Gate)", location:"Dublin, Leinster",     country:"Ireland",     cc:"IE", lang:"en", beers:"Guinness",                                          lat:53.3418,lng:-6.2868, ratings:[3.25,4.00]},
  {name:"Harp / Diageo",          location:"Dundalk, County Louth",     country:"Ireland",     cc:"IE", lang:"en", beers:"Harp",                                              lat:54.0039,lng:-6.3703, ratings:[4.25]},
  {name:"Duvel Moortgat",         location:"Puurs-Sint-Amands, Antwerp",country:"Belgium",     cc:"BE", lang:"nl", beers:"Duvel",                                             lat:51.0727,lng:4.2897,  ratings:[4.00,4.25]},
  {name:"AB InBev (Stella)",      location:"Leuven, Flemish Brabant",   country:"Belgium",     cc:"BE", lang:"nl", beers:"Stella Artois",                                     lat:50.8798,lng:4.7005,  ratings:[2.75,2.75]},
  {name:"Heineken",               location:"Amsterdam, Noord-Holland",  country:"Netherlands", cc:"NL", lang:"nl", beers:"Heineken",                                          lat:52.3578,lng:4.8918,  ratings:[3.25,3.25]},
  {name:"Grolsch",                location:"Enschede, Overijssel",      country:"Netherlands", cc:"NL", lang:"nl", beers:"Grolsch",                                           lat:52.2215,lng:6.8937,  ratings:[3.50]},
  {name:"Bavaria NV (Hertog Jan)",location:"Arcen, Limburg",            country:"Netherlands", cc:"NL", lang:"nl", beers:"Hertog Jan",                                        lat:51.4862,lng:6.1741,  ratings:[2.00]},
  {name:"Anheuser-Busch",         location:"St. Louis, Missouri",       country:"USA",         cc:"US", lang:"en", beers:"Budweiser · Bud Light · Michelob Ultra",            lat:38.6072,lng:-90.2124, ratings:[3.00,3.00,2.50]},
  {name:"Molson Coors",           location:"Golden, Colorado",          country:"USA",         cc:"US", lang:"en", beers:"Coors Light",                                       lat:39.7555,lng:-105.2211,ratings:[3.00,2.75]},
  {name:"Grupo Modelo",           location:"Mexico City, CDMX",         country:"Mexico",      cc:"MX", lang:"es", beers:"Modelo · Modelo Negra · Corona Extra",              lat:19.4274,lng:-99.1677, ratings:[3.25,2.25,3.00,3.00,3.75,3.50]},
  {name:"Carlsberg",              location:"Copenhagen, Capital Region",country:"Denmark",     cc:"DK", lang:"da", beers:"Carlsberg",                                         lat:55.6614,lng:12.5361,  ratings:[2.75,3.00]},
  {name:"Unibroue",               location:"Chambly, Quebec",           country:"Canada",      cc:"CA", lang:"fr", beers:"La Fin Du Monde",                                   lat:45.4412,lng:-73.2615, ratings:[2.75,3.75]},
  {name:"Kronenbourg",            location:"Obernai, Alsace",           country:"France",      cc:"FR", lang:"fr", beers:"1664",                  nativeName:"Kronenbourg 1664", lat:48.4637,lng:7.4845,  ratings:[3.00]},
  {name:"Sapporo Brewery",        location:"Sapporo, Hokkaido",         country:"Japan",       cc:"JP", lang:"ja", beers:"Sapporo",               nativeName:"サッポロビール",     lat:43.0685,lng:141.3544, ratings:[3.50,3.00]},
  {name:"Kirin Brewery",          location:"Yokohama, Kanagawa",        country:"Japan",       cc:"JP", lang:"ja", beers:"Ichiban (Kirin Ichiban)",nativeName:"キリン一番搾り",   lat:35.4634,lng:139.6220, ratings:[3.00]},
  {name:"Red Stripe (D&G)",       location:"Kingston, Surrey",          country:"Jamaica",     cc:"JM", lang:"en", beers:"Red Stripe",                                        lat:17.9972,lng:-76.7939, ratings:[3.75]},
  {name:"Estrella Galicia",       location:"A Coruña, Galicia",         country:"Spain",       cc:"ES", lang:"es", beers:"Estrella Galicia",                                   lat:43.3623,lng:-8.4115,  ratings:[4.25]},
  {name:"Pilsner Urquell",        location:"Pilsen, Bohemia",           country:"Czech Republic",cc:"CZ", lang:"cs", beers:"Pilsner Urquell",    nativeName:"Plzeňský Prazdroj", lat:49.7479,lng:13.3756,  ratings:[3.25]},
  {name:"Birra Moretti (Heineken Italia)", location:"Udine, Friuli-Venezia Giulia", country:"Italy", cc:"IT", lang:"it", beers:"Moretti",         nativeName:"Birra Moretti",     lat:46.0640,lng:13.2350,  ratings:[3.75]},
  {name:"Erdinger Weissbräu",  location:"Erding, Bavaria",             country:"Germany",     cc:"DE", lang:"de", beers:"Erdinger Weissbier",    nativeName:"Erdinger Weißbier", lat:48.3063,lng:11.9071,  ratings:[3.25]},
  {name:"Industrial Arts Brewing",location:"Beacon, New York",          country:"USA",         cc:"US", lang:"en", beers:"Wrench",                                             lat:41.5048,lng:-73.9690,  ratings:[4.00]},
  {name:"Żywiec Brewery (Grupa Żywiec)", location:"Żywiec, Silesia",   country:"Poland",      cc:"PL", lang:"pl", beers:"Żywiec",                                             lat:49.6853,lng:19.1925,  ratings:[2.75]},
  {name:"Birra Peroni",               location:"Rome, Lazio",           country:"Italy",       cc:"IT", lang:"it", beers:"Peroni",                                              lat:41.8902,lng:12.4922,  ratings:[2.50]},
];

// ══════════════════════════════════════════════════════════════
// BRAND SVGS
// ══════════════════════════════════════════════════════════════
const BRAND_SVGS = {
"Heineken":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="10" y="43" font-family="Arial Black,sans-serif" font-size="38" font-weight="900" fill="#00862E" letter-spacing="-1">Heineken</text><polygon points="178,4 182,16 194,16 184,23 188,35 178,28 168,35 172,23 162,16 174,16" fill="#FF0000"/></svg>`,
"Guinness":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><rect x="2" y="2" width="196" height="56" rx="0" fill="none" stroke="#c9a84c" stroke-width="1"/><text x="100" y="37" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">GUINNESS</text><text x="100" y="52" font-family="Georgia,serif" font-size="8" fill="#555" text-anchor="middle" letter-spacing="3">EXTRA STOUT</text></svg>`,
"Stella Artois":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="26" font-family="Times New Roman,serif" font-size="17" font-weight="bold" fill="#1a3a8f" text-anchor="middle" letter-spacing="2">STELLA ARTOIS</text><line x1="10" y1="32" x2="190" y2="32" stroke="#c9a84c" stroke-width="1"/><text x="100" y="48" font-family="Times New Roman,serif" font-size="12" fill="#c9a84c" text-anchor="middle" letter-spacing="4">LAGER</text></svg>`,
"Budweiser":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#CC0000"/><text x="100" y="42" font-family="Arial,sans-serif" font-size="28" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="0.5">Budweiser</text></svg>`,
"Bud Light":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0055A5"/><text x="100" y="28" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#fff" text-anchor="middle">BUD</text><text x="100" y="52" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#c9a84c" text-anchor="middle" letter-spacing="2">LIGHT</text></svg>`,
"Coors Light":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#002868"/><text x="100" y="28" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">COORS</text><text x="100" y="50" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#a8d8f0" text-anchor="middle" letter-spacing="3">LIGHT</text></svg>`,
"Michelob Ultra":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#001233"/><text x="100" y="24" font-family="Arial,sans-serif" font-size="9" fill="#6ba3d6" text-anchor="middle" letter-spacing="4">MICHELOB</text><text x="100" y="50" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="3">ULTRA</text></svg>`,
"Carlsberg":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="42" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="#1a6b1a" text-anchor="middle">Carlsberg</text></svg>`,
"Modelo":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#002868"/><text x="100" y="22" font-family="Times New Roman,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="3">ESPECIAL</text><text x="100" y="50" font-family="Times New Roman,serif" font-size="28" font-weight="bold" fill="#c9a84c" text-anchor="middle">Modelo</text></svg>`,
"Modelo Negra":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a0900"/><text x="100" y="22" font-family="Times New Roman,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="3">MODELO</text><text x="100" y="50" font-family="Times New Roman,serif" font-size="24" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="2">NEGRA</text></svg>`,
"Corona Extra":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="26" font-family="Times New Roman,serif" font-size="18" font-weight="bold" fill="#f4e04d" text-anchor="middle" letter-spacing="1">CORONA</text><line x1="20" y1="32" x2="180" y2="32" stroke="#f4e04d" stroke-width="0.8"/><text x="100" y="50" font-family="Times New Roman,serif" font-size="12" fill="#f4e04d" text-anchor="middle" letter-spacing="3">EXTRA</text></svg>`,
"Sapporo":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#000066"/><polygon points="30,8 34,22 48,22 37,30 41,44 30,36 19,44 23,30 12,22 26,22" fill="#c9a84c"/><text x="120" y="38" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">SAPPORO</text></svg>`,
"Ichiban":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#CC0000"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#fff" text-anchor="middle" letter-spacing="2">SAPPORO</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#fff" text-anchor="middle">ICHIBAN</text></svg>`,
"Grolsch":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="44" font-family="Georgia,serif" font-size="34" font-weight="bold" fill="#1a7b1a" text-anchor="middle">Grolsch</text></svg>`,
"Duvel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#CC0000"/><text x="100" y="46" font-family="Georgia,serif" font-size="40" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2">DUVEL</text></svg>`,
"La Fin Du Monde":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#5a2d00"/><text x="100" y="22" font-family="Georgia,serif" font-size="11" fill="#f0e68c" text-anchor="middle" letter-spacing="2">LA FIN DU MONDE</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.5"/><text x="100" y="45" font-family="Georgia,serif" font-size="10" fill="#d4a84c" text-anchor="middle" letter-spacing="1">UNIBROUE · QUÉBEC</text></svg>`,
"1664":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#002366"/><text x="100" y="46" font-family="Georgia,serif" font-size="42" font-weight="bold" fill="#c9a84c" text-anchor="middle">1664</text></svg>`,
"Red Stripe":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#CC0000"/><text x="100" y="24" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">RED</text><text x="100" y="50" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1">STRIPE</text></svg>`,
"Harp":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#002868"/><text x="85" y="42" font-family="Georgia,serif" font-size="32" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2">HARP</text><text x="165" y="22" font-family="Georgia,serif" font-size="32" fill="#c9a84c">♦</text></svg>`,
"Weihenstephaner":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003d8f"/><text x="100" y="26" font-family="Georgia,serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="0.5">WEIHENSTEPHANER</text><line x1="10" y1="32" x2="190" y2="32" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="48" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">ANNO 1040</text></svg>`,
"Münchner Weisse":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003d8f"/><text x="100" y="26" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">MÜNCHNER</text><line x1="20" y1="34" x2="180" y2="34" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="52" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">WEISSE</text></svg>`,
"Munchen Dunkel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#2a1400"/><text x="100" y="26" font-family="Georgia,serif" font-size="13" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">MUNCHEN</text><line x1="20" y1="34" x2="180" y2="34" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="52" font-family="Georgia,serif" font-size="13" font-weight="bold" fill="#e8d49a" text-anchor="middle" letter-spacing="1">DUNKEL</text></svg>`,
"Hertog Jan":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#6b0000"/><text x="100" y="22" font-family="Georgia,serif" font-size="11" fill="#c9a84c" text-anchor="middle" letter-spacing="2">HERTOG</text><line x1="30" y1="28" x2="170" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="52" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="3">JAN</text></svg>`,
// IPO BEERS
"Moretti":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003399"/><text x="100" y="20" font-family="Georgia,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="3">BIRRA</text><text x="100" y="46" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">Moretti</text></svg>`,
"Peroni":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003399"/><text x="100" y="20" font-family="Arial,sans-serif" font-size="8" fill="#fff" text-anchor="middle" letter-spacing="3">NASTRO AZZURRO</text><text x="100" y="48" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2">PERONI</text></svg>`,
"Blue Moon":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a1a2e"/><circle cx="28" cy="30" r="18" fill="#f5a623" opacity="0.85"/><text x="115" y="27" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#f5a623" text-anchor="middle">BLUE</text><text x="115" y="48" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">MOON</text></svg>`,
"Miller Lite":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="26" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1">MILLER</text><text x="100" y="50" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#c9a84c" text-anchor="middle" letter-spacing="3">LITE</text></svg>`,
"Estrella Damm":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="24" font-family="Arial,sans-serif" font-size="10" fill="#fff" text-anchor="middle" letter-spacing="3">ESTRELLA</text><text x="100" y="50" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#f5d76e" text-anchor="middle" letter-spacing="3">DAMM</text></svg>`,
"Estrella Galicia":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#006633"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#f5d76e" text-anchor="middle" letter-spacing="2">ESTRELLA</text><text x="100" y="48" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#f5d76e" text-anchor="middle" letter-spacing="1">GALICIA</text></svg>`,
"Brahma":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#ffd700"/><text x="100" y="42" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="#003087" text-anchor="middle" letter-spacing="2">BRAHMA</text></svg>`,
"Quilmes":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="20" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" text-anchor="middle" letter-spacing="3">CERVEZA</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="24" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">QUILMES</text></svg>`,
"Tsingtao":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#006633"/><text x="100" y="42" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1">TSINGTAO</text></svg>`,
"Castle Lager":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#ffd700" text-anchor="middle" letter-spacing="2">SOUTH AFRICAN</text><text x="100" y="48" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#ffd700" text-anchor="middle" letter-spacing="2">CASTLE LAGER</text></svg>`,
"Pilsner Urquell":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="21" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">PILSNER</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">URQUELL</text></svg>`,
"Super Bock":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="22" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">SUPER</text><text x="100" y="50" font-family="Arial Black,sans-serif" font-size="20" font-weight="900" fill="#c9a84c" text-anchor="middle" letter-spacing="3">BOCK</text></svg>`,
"Mythos":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="42" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2">MYTHOS</text></svg>`,
"Victoria Bitter":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#ffd700" text-anchor="middle">VB</text><text x="100" y="48" font-family="Arial,sans-serif" font-size="11" fill="#fff" text-anchor="middle" letter-spacing="1">VICTORIA BITTER</text></svg>`,
"Norrlands Guld":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#006AA7"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#FECC02" text-anchor="middle" letter-spacing="2">NORRLANDS</text><text x="100" y="48" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#FECC02" text-anchor="middle" letter-spacing="2">GULD</text></svg>`,
"Asahi Super Dry":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#c0c0c0" text-anchor="middle" letter-spacing="4">ASAHI</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="20" font-weight="900" fill="#c0c0c0" text-anchor="middle" letter-spacing="2">SUPER DRY</text></svg>`,
"Hoegaarden":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a3a6b"/><text x="100" y="22" font-family="Georgia,serif" font-size="9" fill="#f0e68c" text-anchor="middle" letter-spacing="3">BROUWERIJ</text><text x="100" y="48" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">Hoegaarden</text></svg>`,
"Kronenbourg":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="22" font-family="Georgia,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="3">BIÈRE DE</text><text x="100" y="48" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">KRONENBOURG</text></svg>`,
"Newcastle Brown":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#3d1c02"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#fff" text-anchor="middle" letter-spacing="2">NEWCASTLE</text><polygon points="100,26 104,36 114,36 106,42 109,52 100,46 91,52 94,42 86,36 96,36" fill="#00aaff"/><text x="100" y="58" font-family="Arial Black,sans-serif" font-size="8" font-weight="900" fill="#c9a84c" text-anchor="middle" letter-spacing="2">BROWN ALE</text></svg>`,
"Ringnes":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="42" font-family="Arial Black,sans-serif" font-size="24" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">RINGNES</text></svg>`,
"Żywiec":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#ffd700" text-anchor="middle" letter-spacing="3">PIWO</text><text x="100" y="48" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">ŻYWIEC</text></svg>`,
"Tyskie":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#006633"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#c9a84c" text-anchor="middle" letter-spacing="3">GRONIE</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="24" font-weight="900" fill="#c9a84c" text-anchor="middle" letter-spacing="2">TYSKIE</text></svg>`,
"Chimay Blue":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#002366"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">CHIMAY</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="48" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="#4a90d9" text-anchor="middle" letter-spacing="3">GRANDE RÉSERVE</text></svg>`,
"Leffe Blonde":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a0a00"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="3">ABBAYE DE</text><text x="100" y="48" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="2">LEFFE</text></svg>`,
"Coopers Pale Ale":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#006633"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="9" fill="#fff" text-anchor="middle" letter-spacing="3">COOPERS</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="16" font-weight="900" fill="#c9a84c" text-anchor="middle" letter-spacing="1">PALE ALE</text></svg>`,
"Sam Adams":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#8b0000"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">SAMUEL ADAMS</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="48" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">BOSTON LAGER</text></svg>`,
"Singha":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a0a00"/><text x="100" y="22" font-family="Georgia,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="3">THAI PREMIUM</text><text x="100" y="48" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="2">SINGHA</text></svg>`,
"Tiger Beer":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003087"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#ff8c00" text-anchor="middle" letter-spacing="3">ASIA PACIFIC</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" fill="#ff8c00" text-anchor="middle" letter-spacing="2">TIGER</text></svg>`,
"Erdinger Weissbier":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003d8f"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#fff" text-anchor="middle" letter-spacing="2">ERDINGER</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="48" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="1">WEISSBIER</text></svg>`,
"Wrench":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#d48a9a"/><text x="100" y="20" font-family="Arial,sans-serif" font-size="8" fill="#2a2a2a" text-anchor="middle" letter-spacing="2">INDUSTRIAL ARTS</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" fill="#2a2a2a" text-anchor="middle" letter-spacing="2">WRENCH</text><line x1="20" y1="55" x2="180" y2="55" stroke="#2a2a2a" stroke-width="0.6"/></svg>`,
"Smithwick's":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#8b0000"/><text x="100" y="22" font-family="Georgia,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="2">IRISH ALE</text><text x="100" y="48" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">Smithwick's</text></svg>`,
"Tennent's":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#fff" text-anchor="middle" letter-spacing="3">SCOTLAND</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1">TENNENT'S</text></svg>`,
};

const LOGO_URIS={};
Object.entries(BRAND_SVGS).forEach(([n,s])=>{LOGO_URIS[n]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);});

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
const sC={"Wheat Beer-Hefeweizen":"#cc3366","Belgian Strong Golden Ale":"#ffae00","Stout-Irish Dry":"#9966ff","Lager-Pale":"#00f5ff","Lager-Mexican":"#00c4d4","Pilsner-Other":"#bb5580","Belgian Tripel":"#bb44ff","Lager-Munich Dunkel":"#ff4400","Lager-American":"#555","Lager-American Light":"#444","Lager-Helles":"#39ff14","Belgian Strong Dark Ale":"#8b0000","Witbier":"#f0c040","Brown Ale-English":"#8b4513","IPA-New England Hazy":"#ffae00"};
function rbC(r){return r>=4.5?"r5":r>=4?"r4":r>=3.5?"r35":r>=3?"r3":r>=2.5?"r25":"r2";}
function rC(r){return r>=4.5?"#00cc44":r>=4?"#22dd55":r>=3.5?"#aacc00":r>=3?"#ffaa00":r>=2.5?"#ff6600":"#ff2222";}
function strs(r){const f=Math.floor(r),h=(r%1)>=.5;return"★".repeat(f)+(h?"½":"")+"☆".repeat(5-f-(h?1:0));}
const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
const std=a=>{const m=avg(a);return Math.sqrt(avg(a.map(v=>(v-m)**2)));};

function logoImg(name,size=24){
  const u=LOGO_URIS[name];
  return u?`<img src="${u}" class="beer-logo-inline" style="width:${size}px;height:${size}px" alt="${name}">`:`<span style="display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle;margin-right:6px">🍺</span>`;
}
function cardLogo(name){
  const u=LOGO_URIS[name];
  return u?`<img src="${u}" class="bc-logo" alt="${name}">`:`<span class="bc-emoji">🍺</span>`;
}

// ══════════════════════════════════════════════════════════════
// PRE-COMPUTED STATISTICS — computed once at startup, reused everywhere
// ══════════════════════════════════════════════════════════════
const STATS=(function(){
  const styleMap={};
  beers.forEach(b=>{if(!styleMap[b.style])styleMap[b.style]={t:0,c:0};styleMap[b.style].t+=b.rating;styleMap[b.style].c++;});
  const styleRanked=Object.entries(styleMap).map(([s,v])=>({s,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);

  const METHOD_ORDER=['Draft','Nitro','Bottle','Can'];
  const methodMap={};
  beers.forEach(b=>{if(!methodMap[b.method])methodMap[b.method]={t:0,c:0};methodMap[b.method].t+=b.rating;methodMap[b.method].c++;});
  const methodAvgs=METHOD_ORDER.map(m=>methodMap[m]?+(methodMap[m].t/methodMap[m].c).toFixed(2):0);
  const methodCounts=METHOD_ORDER.map(m=>methodMap[m]?methodMap[m].c:0);

  const countryMap={};
  beers.forEach(b=>{if(!countryMap[b.origin])countryMap[b.origin]={t:0,c:0};countryMap[b.origin].t+=b.rating;countryMap[b.origin].c++;});
  const countryRanked=Object.entries(countryMap).map(([k,v])=>({l:`${FLAGS[k]||''} ${CNAMES[k]||k}`,code:k,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);

  const cityMap={};
  beers.forEach(b=>{if(!cityMap[b.city])cityMap[b.city]={t:0,c:0,region:b.region,country:b.country,cc:b.cc};cityMap[b.city].t+=b.rating;cityMap[b.city].c++;});
  const cityRanked=Object.entries(cityMap).map(([k,v])=>({city:k,region:v.region,country:v.country,cc:v.cc,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);

  const brandMap={};
  beers.forEach(b=>{if(!brandMap[b.beer])brandMap[b.beer]=[];brandMap[b.beer].push(b.rating);});
  const brandList=Object.entries(brandMap).map(([n,rs])=>({n,cnt:rs.length,avg:avg(rs),best:Math.max(...rs),worst:Math.min(...rs),std:std(rs)})).sort((a,b)=>b.avg-a.avg);

  const sorted=[...beers].sort((a,b)=>b.rating-a.rating);
  const globalAvg=avg(beers.map(b=>b.rating));

  return {styleMap,styleRanked,METHOD_ORDER,methodMap,methodAvgs,methodCounts,countryMap,countryRanked,cityMap,cityRanked,brandMap,brandList,sorted,globalAvg};
})();

// ══════════════════════════════════════════════════════════════
// DYNAMIC STATS — update header, overview KPIs, and BEERS tab
// from live data so they never go stale when new beers are added
// ══════════════════════════════════════════════════════════════
(function updateLiveStats(){
  try {
    const totalReviews = beers.length;
    const totalMarkets = Object.keys(STATS.cityMap).length;
    const totalBrands  = Object.keys(STATS.brandMap).length;
    const totalCtry    = Object.keys(STATS.countryMap).length;
    const topBeer      = STATS.sorted[0];
    const lowBeer      = STATS.sorted[STATS.sorted.length - 1];
    const avgRating    = STATS.globalAvg;
    const avgAbv       = (beers.reduce((s,b)=>s+b.abv,0)/beers.length);
    const minAbv       = Math.min(...beers.map(b=>b.abv));
    const maxAbv       = Math.max(...beers.map(b=>b.abv));
    const newCount     = beers.filter(b=>b.isNew).length;

    // Header bar
    const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    set('hdr-avg',   avgRating.toFixed(2));
    set('hdr-ctry',  totalCtry);

    // Overview KPI tiles
    set('ov-top-val',  topBeer.rating.toFixed(2));
    set('ov-top-sub',  `▲ ${topBeer.beer} · ${topBeer.origin}`);
    set('ov-avg-val',  avgRating.toFixed(2));
    set('ov-avg-sub',  `${totalReviews} total reviews`);
    set('ov-low-val',  lowBeer.rating.toFixed(2));
    set('ov-low-sub',  `▼ ${lowBeer.beer} · ${lowBeer.origin}`);
    set('ov-abv-val',  avgAbv.toFixed(1)+'%');
    set('ov-abv-sub',  `Range: ${minAbv.toFixed(1)}–${maxAbv.toFixed(1)}%`);
    set('ov-brands-val', totalBrands);
    set('ov-brands-sub', `Across ${totalCtry} countries`);

    // BEERS tab
    set('beers-count', `${totalReviews} ENTRIES · +${newCount} NEW`);
    set('brands-count', `${totalBrands} UNIQUE BRANDS`);
    const newTag = document.getElementById('beers-new-tag');
    if(newTag) newTag.textContent = `+${newCount} NEW`;
  } catch(e){ console.error('Live stats error:',e); }
})();


// ── KEYBOARD SHORTCUTS (1-5 / F1-F5 for tabs; Esc for modal)
(function(){
  const tabMap={'1':'overview','2':'beers','3':'mapdrunk','4':'mapbrewed','5':'choropleth','F1':'overview','F2':'beers','F3':'mapdrunk','F4':'mapbrewed','F5':'choropleth'};
  document.addEventListener('keydown',function(ev){
    if(ev.target.tagName==='INPUT'||ev.target.tagName==='TEXTAREA'||ev.target.tagName==='SELECT') return;
    if(ev.key==='Escape'){closeBeerModal();return;}
    const tab=tabMap[ev.key]||tabMap[ev.key.toLowerCase()];
    if(tab&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();showTab(tab);}
  });
})();

// ── TAB
function showTab(id,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const tabEl=btn&&btn.classList.contains('tab-btn')?btn:
    [...document.querySelectorAll('.tab-btn')].find(b=>(b.getAttribute('onclick')||'').includes(`'${id}'`));
  if(tabEl) tabEl.classList.add('active');
  if(id==='mapdrunk'&&!window._dM){window._dM=true;setTimeout(initDrunkMap,80);}
  if(id==='mapbrewed'&&!window._bM){window._bM=true;setTimeout(initBrewedMap,80);}
  if(id==='choropleth'&&!window._chorD){window._chorD=true;setTimeout(initChoropleth,100);}
}

// ── CHART DEFAULTS
try {
  Chart.defaults.color='#555';
  Chart.defaults.borderColor='#222';
  Chart.defaults.font.family="'IBM Plex Mono','Courier New',monospace";
  Chart.defaults.font.size=10;
} catch(e){ console.error('Chart.defaults error:',e); }
const TT={backgroundColor:'#0a0a12',borderColor:'#cc3366',borderWidth:1,titleColor:'#00f5ff',bodyColor:'#aaa',padding:8};

// ══════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════
try {
// Use pre-computed statistics
const sA=STATS.styleRanked;
new Chart(document.getElementById('styleChart'),{type:'bar',
  data:{labels:sA.map(s=>s.s.length>16?s.s.slice(0,16)+'…':s.s),datasets:[{data:sA.map(s=>s.a),backgroundColor:sA.map(s=>sC[s.s]||'#ff6600'),borderWidth:0}]},
  options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw.toFixed(2)}/5`}}},scales:{x:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},y:{grid:{display:false},ticks:{color:'#ff6600',font:{size:9}}}}}
});

const mO=STATS.METHOD_ORDER, mA=STATS.methodAvgs, mCt=STATS.methodCounts;
new Chart(document.getElementById('methodChart'),{type:'bar',
  data:{labels:mO,datasets:[{data:mA,backgroundColor:['#ff6600','#00aaff','#bb44ff','#555'],borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:TT},scales:{y:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
});

new Chart(document.getElementById('scatterChart'),{type:'scatter',
  data:{datasets:[{data:beers.map(b=>({x:b.abv,y:b.rating,label:b.beer})),backgroundColor:beers.map(b=>sC[b.style]||'#ff6600'),pointRadius:5,pointHoverRadius:8,borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw.label} | ${c.raw.x}% ABV | ${c.raw.y}/5`}}},
    scales:{x:{title:{display:true,text:'ABV (%)',color:'#444'},min:3.5,max:10,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},
            y:{title:{display:true,text:'RATING',color:'#444'},min:1.5,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}}}}
});

document.getElementById('bestPanel').innerHTML=STATS.sorted.slice(0,5).map((b,i)=>`
  <div class="insight-row">
    <span class="insight-key">#${i+1} ${logoImg(b.beer,16)} ${b.beer}</span>
    <div><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span> <span class="insight-sub">${b.origin} · ${b.method}</span></div>
  </div>`).join('');

// Dynamic market signals — computed from live data
const bestStyle=STATS.styleRanked[0];
const worstStyle=STATS.styleRanked[STATS.styleRanked.length-1];
const topCountry=STATS.countryRanked[0];
const topCity=STATS.cityRanked[0];
const bestMethodIdx=mA.indexOf(Math.max(...mA.filter(a=>a>0)));
const bestMethod=bestMethodIdx>=0?mO[bestMethodIdx]:'—';
const bestMethodAvg=bestMethodIdx>=0?mA[bestMethodIdx]:0;
const bestMethodCt=bestMethodIdx>=0?mCt[bestMethodIdx]:0;

document.getElementById('mktPanel').innerHTML=`
  <div class="insight-row"><span class="insight-key">BEST STYLE</span><div><div class="insight-val up">${bestStyle.s}</div><div class="insight-sub">${bestStyle.a.toFixed(2)} avg · ${bestStyle.c} review${bestStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">WEAKEST STYLE</span><div><div class="insight-val dn">${worstStyle.s}</div><div class="insight-sub">${worstStyle.a.toFixed(2)} avg · ${worstStyle.c} review${worstStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">TOP COUNTRY</span><div><div class="insight-val">${topCountry.l}</div><div class="insight-sub">${topCountry.a.toFixed(2)} avg · ${topCountry.c} review${topCountry.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">TOP MARKET</span><div><div class="insight-val">${topCity.city}, ${topCity.region}</div><div class="insight-sub">${topCity.a.toFixed(2)} avg · ${topCity.c} review${topCity.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">BEST METHOD</span><div><div class="insight-val">${bestMethod}</div><div class="insight-sub">${bestMethodAvg.toFixed(2)} avg · ${bestMethodCt} review${bestMethodCt>1?'s':''}</div></div></div>`;

// Dynamic latest activity panel
const latestTwo=[...beers].sort((a,b)=>b.monthN-a.monthN||b.year-a.year).slice(0,2);
const hitRate=(beers.filter(b=>b.rating>=3).length/beers.length*100).toFixed(0);
const last5=beers.slice(-5).map(b=>b.rating);
const prev5=beers.slice(-10,-5).map(b=>b.rating);
const trendDelta=last5.length&&prev5.length?avg(last5)-avg(prev5):0;
const trendLabel=trendDelta>0.1?'▲ RISING':trendDelta<-0.1?'▼ DECLINING':'→ FLAT';
const trendCls=trendDelta>0.1?'up':trendDelta<-0.1?'dn':'fl';

document.getElementById('latestPanel').innerHTML=`
  <div class="insight-row"><span class="insight-key">LATEST</span><div><div class="insight-val">${latestTwo.map(b=>b.beer).join(' &amp; ')}</div><div class="insight-sub">${latestTwo.map(b=>b.rating.toFixed(2)).join(' / ')} · ${latestTwo[0]?latestTwo[0].city:'—'}</div></div></div>
  <div class="insight-row"><span class="insight-key">TREND</span><div><div class="insight-val ${trendCls}">${trendLabel}</div><div class="insight-sub">5-review rolling avg</div></div></div>
  <div class="insight-row"><span class="insight-key">COVERAGE</span><div><div class="insight-val">${Object.keys(STATS.countryMap).length} countries</div><div class="insight-sub">${Object.keys(STATS.cityMap).length} markets</div></div></div>
  <div class="insight-row"><span class="insight-key">HIT RATE</span><div><div class="insight-val ${hitRate>=60?'up':hitRate>=40?'fl':'dn'}">${hitRate>=60?'▲ ':''}${hitRate}%</div><div class="insight-sub">Rated ≥3.00</div></div></div>`;
} catch(e){ console.error('Overview init error:',e); }


// ══════════════════════════════════════════════════════════════
// BEER TABLE + GRID
// ══════════════════════════════════════════════════════════════
function renderTable(data){
  try {
    const countEl=document.getElementById('beerFilterCount');
    if(countEl) countEl.textContent=`${data.length} / ${beers.length} ROWS`;
    document.getElementById('beerBody').innerHTML=data.map(b=>`
      <tr${b.isNew?' class="new-row"':''} style="cursor:pointer" onclick="openBeerModal('${b.beer.replace(/'/g,"\\'")}')">
        <td>${logoImg(b.beer,22)}</td>
        <td style="color:#ff6600;font-weight:600">${b.beer}${b.isNew?`<span class="new-tag">NEW</span>`:''}</td>
        <td style="color:#555;font-size:9px">${b.style}</td>
        <td>${FLAGS[b.origin]||''} ${b.origin}</td>
        <td style="color:#00aaff">${b.abv.toFixed(1)}%</td>
        <td style="color:#555">${b.method}</td>
        <td style="color:#555">${b.city}, ${b.region} · ${FLAGS[b.cc]||''} ${b.country}</td>
        <td><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span></td>
        <td style="color:#ffaa00;font-size:9px">${strs(b.rating)}</td>
      </tr>`).join('');
  } catch(e){ console.error('renderTable error:',e); }
}
function applyBeerFilter(){
  const q=(document.getElementById('beerSearch').value||'').toLowerCase();
  const st=document.getElementById('beerStyleFilter').value;
  const or=document.getElementById('beerOriginFilter').value;
  const sk=document.getElementById('beerSortSel').value;
  let data=[...beers];
  if(q) data=data.filter(b=>b.beer.toLowerCase().includes(q)||b.style.toLowerCase().includes(q)||b.country.toLowerCase().includes(q)||b.city.toLowerCase().includes(q));
  if(st) data=data.filter(b=>b.style===st);
  if(or) data=data.filter(b=>b.origin===or);
  data.sort((a,b)=>sk==='rating'?b.rating-a.rating:sk==='name'?a.beer.localeCompare(b.beer):b.abv-a.abv);
  renderTable(data);
}
function sortTable(k){applyBeerFilter();}
try {
  // Populate filter dropdowns
  const styles=[...new Set(beers.map(b=>b.style))].sort();
  const origins=[...new Set(beers.map(b=>b.origin))].sort();
  const styleEl=document.getElementById('beerStyleFilter');
  const origEl=document.getElementById('beerOriginFilter');
  styles.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;styleEl.appendChild(o);});
  origins.forEach(o=>{const el=document.createElement('option');el.value=o;el.textContent=`${FLAGS[o]||''} ${o}`;origEl.appendChild(el);});
  applyBeerFilter();
} catch(e){ console.error('renderTable init:',e); }

try {
const unique=[...new Map(beers.map(b=>[b.beer,b])).values()].sort((a,b)=>b.rating-a.rating);
document.getElementById('beerGrid').innerHTML=unique.map(b=>`
  <div class="beer-card" onclick="openBeerModal('${b.beer.replace(/'/g,"\\'")}')">
    ${b.isNew?'<span class="bc-new">NEW</span>':''}
    <div class="bc-logo-wrap">${cardLogo(b.beer)}</div>
    <div class="bc-ticker">${b.beer}</div>
    <div class="bc-style">${b.style}</div>
    <div class="bc-bottom">
      <span class="bc-abv">${b.abv}%</span>
      <span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span>
    </div>
    <div style="font-size:8px;color:#555;margin-top:3px">${FLAGS[b.origin]||''} ${CNAMES[b.origin]||b.origin} · ${b.method.toUpperCase()}</div>
  </div>`).join('');
} catch(e){ console.error('beerGrid init:',e); }

// ══════════════════════════════════════════════════════════════
// BEER DETAIL MODAL
// ══════════════════════════════════════════════════════════════
function openBeerModal(name){
  const reviews=beers.filter(b=>b.beer===name);
  if(!reviews.length) return;
  const ratings=reviews.map(b=>b.rating);
  const avgR=avg(ratings),bestR=Math.max(...ratings),worstR=Math.min(...ratings);
  const b0=reviews[0];
  document.getElementById('beerModalTitle').textContent=`${name.toUpperCase()} — DETAIL VIEW`;
  document.getElementById('beerModalBody').innerHTML=`
    <div style="display:flex;gap:16px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #1a1a1a;margin-bottom:12px;flex-wrap:wrap">
      <div style="width:120px;height:60px;background:#0a0a0a;border:1px solid #222;display:flex;align-items:center;justify-content:center;padding:4px;flex-shrink:0">${cardLogo(name)}</div>
      <div style="flex:1;min-width:160px">
        <div style="font-size:15px;font-weight:700;color:#ff6600;margin-bottom:4px">${name}</div>
        <div style="font-size:10px;color:#555;margin-bottom:2px">${b0.style}</div>
        <div style="font-size:10px;color:#aaa">${FLAGS[b0.origin]||''} ${CNAMES[b0.origin]||b0.origin} · ${b0.abv}% ABV</div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:${rC(avgR)}">${avgR.toFixed(2)}</div><div style="font-size:8px;color:#555;letter-spacing:1px">AVG</div></div>
        <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:${rC(bestR)}">${bestR.toFixed(2)}</div><div style="font-size:8px;color:#555;letter-spacing:1px">BEST</div></div>
        <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:${rC(worstR)}">${worstR.toFixed(2)}</div><div style="font-size:8px;color:#555;letter-spacing:1px">WORST</div></div>
        <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:#00aaff">${reviews.length}</div><div style="font-size:8px;color:#555;letter-spacing:1px">REVIEWS</div></div>
      </div>
    </div>
    <div style="font-size:9px;color:#ff6600;letter-spacing:2px;margin-bottom:6px">ALL SESSIONS</div>
    <table class="bb-table" style="min-width:unset">
      <thead><tr><th>#</th><th>RATING</th><th>STARS</th><th>METHOD</th><th>CITY</th><th>COUNTRY</th><th>DATE</th></tr></thead>
      <tbody>${reviews.map((b,i)=>`
        <tr>
          <td style="color:#555">${i+1}</td>
          <td><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span></td>
          <td style="color:#ffaa00;font-size:9px">${strs(b.rating)}</td>
          <td style="color:#555">${b.method}</td>
          <td style="color:#aaa">${b.city}, ${b.region}</td>
          <td>${FLAGS[b.cc]||''} ${b.country}</td>
          <td style="color:#555;font-size:9px">${b.month} ${b.year}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  document.getElementById('beerModal').classList.add('open');
}
function closeBeerModal(){
  document.getElementById('beerModal').classList.remove('open');
}

// ══════════════════════════════════════════════════════════════
// METHOD (sync init)
// ══════════════════════════════════════════════════════════════
try {
const eM={Draft:'🍺',Nitro:'🫧',Bottle:'🍾',Can:'🥫'};
const mColors=['#ff6600','#00aaff','#bb44ff','#555'];
const mO=STATS.METHOD_ORDER;
const mA=STATS.methodAvgs;
const mCt=STATS.methodCounts;
new Chart(document.getElementById('methodDetailChart'),{type:'bar',
  data:{labels:mO.map((m,i)=>`${m} (${mCt[i]})`),datasets:[{data:mA,backgroundColor:mColors,borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:TT},scales:{y:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
});
document.getElementById('methodCards').innerHTML=mO.map((m,i)=>`
  <div class="kpi">
    <div style="font-size:1.4rem;margin-bottom:4px">${eM[m]}</div>
    <div class="kpi-val" style="color:${mColors[i]}">${mA[i].toFixed(2)}</div>
    <div class="kpi-label">${m.toUpperCase()}</div>
    <div class="kpi-sub">${mCt[i]} review${mCt[i]>1?'s':''}</div>
  </div>`).join('');
const globalAvg=avg(beers.map(b=>b.rating));
document.getElementById('methodDetailBody').innerHTML=mO.map((m,i)=>{
  const mb=beers.filter(b=>b.method===m);
  const best=mb.length?mb.reduce((a,b)=>b.rating>a.rating?b:a):{beer:'—'};
  const worst=mb.length?mb.reduce((a,b)=>b.rating<a.rating?b:a):{beer:'—'};
  const diff=mA[i]-globalAvg;
  return `<tr>
    <td style="color:#ff6600">${eM[m]} ${m}</td>
    <td style="text-align:center">${mCt[i]}</td>
    <td><span class="rb ${rbC(mA[i])}">${mA[i].toFixed(2)}</span></td>
    <td class="up" style="font-size:9px">${best.beer}</td>
    <td class="dn" style="font-size:9px">${worst.beer}</td>
    <td class="${diff>=0?'up':'dn'}">${diff>=0?'+':''}${diff.toFixed(2)}</td>
  </tr>`;
}).join('');
} catch(e){ console.error('Method init error:',e); }

// ══════════════════════════════════════════════════════════════
// MAPS
// ══════════════════════════════════════════════════════════════
const cityColors={"New York":"#ff6600","New Rochelle":"#bb44ff","White Plains":"#00cc44","Eastchester":"#00aaff","Hartsdale":"#ff2222","Montreal":"#ff8800","Amsterdam":"#00cccc","Hengelo":"#6666ff","Uncassville":"#ff44aa"};
function addTiles(map){L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(map);}
function popHtml(h){return `<div style="font-family:var(--mono);font-size:11px;line-height:1.6">${h}</div>`;}
function circleM(map,lat,lng,color,r,html){L.circleMarker([lat,lng],{radius:r,fillColor:color,color:'#222',weight:1,opacity:.8,fillOpacity:.75}).addTo(map).bindPopup(popHtml(html),{className:'dpop'});}

function initDrunkMap(){
  const cM={};
  beers.forEach(b=>{
    if(!cM[b.city])cM[b.city]={t:0,c:0,bs:[],region:b.region,country:b.country,cc:b.cc};
    cM[b.city].t+=b.rating;cM[b.city].c++;
    if(!cM[b.city].bs.includes(b.beer))cM[b.city].bs.push(b.beer);
  });
  const map=L.map('drunkMap',{scrollWheelZoom:false}).setView([46,-20],3);
  addTiles(map);
  drunkLocs.filter(l=>cM[l.city]).forEach(l=>{
    const d=cM[l.city],a=(d.t/d.c).toFixed(2),r=Math.max(5,Math.min(14,4+d.c*1.5));
    const beerRows=beers.filter(b=>b.city===l.city).map(b=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0;border-bottom:1px solid #1a1a1a"><span style="color:#aaa">${b.beer}</span><span style="color:${rC(b.rating)};font-weight:700">${b.rating.toFixed(2)}</span></div>`).join('');
    circleM(map,l.lat,l.lng,cityColors[l.city]||'#ff6600',r,
      `<span style="color:#ff6600;font-weight:700">${l.city}</span>, ${l.region}&nbsp;&nbsp;${FLAGS[l.cc]||''} ${l.country}<br><span style="color:#555;font-size:9px">${d.c} review${d.c>1?'s':''} · AVG <span style="color:#00cc44;font-weight:700">${a}/5</span></span><div style="margin-top:6px">${beerRows}</div>`);
  });
  document.getElementById('drunkLeg').innerHTML=drunkLocs.filter(l=>cM[l.city]).map(l=>`<div class="map-leg-item"><div class="map-leg-dot" style="background:${cityColors[l.city]||'#ff6600'}"></div>${l.city}, ${l.region} · ${FLAGS[l.cc]||''} ${l.country} (${cM[l.city].c})</div>`).join('');
  const arr=Object.entries(cM).map(([city,d])=>({city,count:d.c,avg:d.t/d.c,beers:d.bs,region:d.region,country:d.country,cc:d.cc})).sort((a,b)=>b.count-a.count);
  document.getElementById('drunkTbody').innerHTML=arr.map(c=>`<tr>
    <td style="color:#ff6600">${c.city}</td>
    <td style="color:#555">${c.region}</td>
    <td style="color:#aaa">${FLAGS[c.cc]||''} ${c.country}</td>
    <td style="text-align:center;color:#00aaff">${c.count}</td>
    <td><span class="rb ${rbC(c.avg)}">${c.avg.toFixed(2)}</span></td>
    <td style="color:#555;font-size:9px">${c.beers.join(', ')}</td>
  </tr>`).join('');
}

function initBrewedMap(){
  const map=L.map('brewedMap',{scrollWheelZoom:false}).setView([30,10],2);
  addTiles(map);
  breweries.forEach(b=>{
    const a=avg(b.ratings),r=Math.max(5,Math.min(14,4+b.ratings.length*1.5));
    const firstBeer=b.beers.split(' · ')[0];
    const logoHtml=LOGO_URIS[firstBeer]?`<img src="${LOGO_URIS[firstBeer]}" style="width:60px;height:20px;object-fit:contain;display:block;margin:3px 0">`:'';
    circleM(map,b.lat,b.lng,rC(a),r,`${logoHtml}<span style="color:#ff6600;font-weight:700">${b.name}</span><br><span style="color:#555;font-size:9px">${b.location} · ${FLAGS[b.cc]||''} ${b.country}</span><br><span style="color:#444;font-size:9px">${b.beers}</span><br>AVG <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5</span> · ${b.ratings.length} review${b.ratings.length>1?'s':''}`);
  });
  const s=[...breweries].map(b=>({...b,avg:avg(b.ratings)})).sort((a,b)=>b.avg-a.avg);
  document.getElementById('brewedTbody').innerHTML=s.map(b=>{
    const firstBeer=b.beers.split(' · ')[0];
    return `<tr>
      <td>${logoImg(firstBeer,22)}</td>
      <td style="font-weight:600"><span class="brewery-clickable" onclick="openBreweryDrawer('${b.name.replace(/'/g,"\\'")}');event.stopPropagation()">${b.name}</span></td>
      <td style="color:#555;font-size:9px">${b.location}</td>
      <td style="color:#aaa">${FLAGS[b.cc]||''} ${b.country}</td>
      <td style="color:#555;font-size:9px">${b.beers}</td>
      <td><span class="rb ${rbC(b.avg)}">${b.avg.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// DATA INTEGRITY VALIDATOR
// Runs on every page load. Catches broken updates before they
// become visible bugs. Access via G3 · AUDIT nav tab.
// ══════════════════════════════════════════════════════════════
(function runIntegrityChecks(){
  const REQUIRED_BEER_FIELDS = ['beer','style','origin','abv','method','city','region','country','cc','rating','isNew','month','monthN','year'];
  const REQUIRED_BREWERY_FIELDS = ['name','location','country','cc','beers','lat','lng','ratings'];
  const REQUIRED_LOC_FIELDS = ['city','region','country','cc','lat','lng'];
  const VALID_METHODS = ['Draft','Nitro','Bottle','Can'];
  const VALID_MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const FUTURES_BEERS = ['Bud Light','Coors Light','Heineken','Stella Artois','Corona Extra','Modelo','Miller Lite','Budweiser','Michelob Ultra','Guinness'];

  const errors=[], warnings=[], passes=[];
  const pass=(msg)=>passes.push(msg);
  const warn=(msg)=>warnings.push('⚠ '+msg);
  const fail=(msg)=>errors.push('✗ '+msg);

  // ── 1. BEER ARRAY FIELD COMPLETENESS
  beers.forEach((b,i)=>{
    REQUIRED_BEER_FIELDS.forEach(f=>{
      if(b[f]===undefined||b[f]===null||b[f]==='') fail(`Beer[${i}] "${b.beer||'?'}" missing field: ${f}`);
    });
  });
  if(!errors.length) pass(`All ${beers.length} beer entries have required fields`);

  // ── 2. BEER DATA RANGE VALIDATION
  beers.forEach((b,i)=>{
    if(b.rating<1||b.rating>5)        fail(`Beer[${i}] "${b.beer}" rating out of range: ${b.rating}`);
    if(b.abv<1||b.abv>20)             fail(`Beer[${i}] "${b.beer}" suspicious ABV: ${b.abv}`);
    if(!VALID_METHODS.includes(b.method)) fail(`Beer[${i}] "${b.beer}" unknown method: "${b.method}" (valid: ${VALID_METHODS.join('/')})`);
    if(!VALID_MONTHS.includes(b.month))   fail(`Beer[${i}] "${b.beer}" unknown month: "${b.month}"`);
    if(b.monthN<1||b.monthN>12)       fail(`Beer[${i}] "${b.beer}" monthN out of range: ${b.monthN}`);
    if(typeof b.isNew !== 'boolean')   warn(`Beer[${i}] "${b.beer}" isNew is not boolean: ${b.isNew}`);
    if(!FLAGS[b.origin])               warn(`Beer[${i}] "${b.beer}" origin "${b.origin}" has no FLAG emoji`);
    if(!FLAGS[b.cc])                   warn(`Beer[${i}] "${b.beer}" cc "${b.cc}" has no FLAG emoji`);
  });
  const badRatings = beers.filter(b=>b.rating<1||b.rating>5);
  if(!badRatings.length) pass('All beer ratings within 1.0–5.0 range');

  // ── 3. BRAND LOGO COVERAGE
  const logoNames = Object.keys(BRAND_SVGS);
  const uniqueBeers = [...new Set(beers.map(b=>b.beer))];
  uniqueBeers.forEach(name=>{
    if(!logoNames.includes(name)) warn(`No SVG logo for beer: "${name}"`);
  });
  const coveredCount = uniqueBeers.filter(n=>logoNames.includes(n)).length;
  pass(`${coveredCount}/${uniqueBeers.length} beer brands have SVG logos`);

  // ── 4. BREWERY ARRAY VALIDATION
  REQUIRED_BREWERY_FIELDS.forEach(f=>{
    breweries.forEach((b,i)=>{
      if(b[f]===undefined||b[f]===null||b[f]==='') fail(`Brewery[${i}] "${b.name||'?'}" missing field: ${f}`);
    });
  });
  breweries.forEach((b,i)=>{
    if(b.lat<-90||b.lat>90||b.lng<-180||b.lng>180)
      fail(`Brewery[${i}] "${b.name}" has invalid coordinates: lat=${b.lat} lng=${b.lng}`);
    if(!Array.isArray(b.ratings)||b.ratings.length===0)
      fail(`Brewery[${i}] "${b.name}" has empty ratings array`);
    b.ratings.forEach((r,ri)=>{
      if(r<1||r>5) fail(`Brewery[${i}] "${b.name}" ratings[${ri}] out of range: ${r}`);
    });
    if(!FLAGS[b.cc]) warn(`Brewery[${i}] "${b.name}" cc "${b.cc}" has no FLAG emoji`);
    // Check brewery beer names don't include beers not in our dataset (warn only)
    const brewBeerNames = b.beers.split(' · ').map(s=>s.trim());
    brewBeerNames.forEach(bn=>{
      const cleanName = bn.replace(/\s*\([^)]+\)/,'').trim(); // strip parenthetical like "(Kirin Ichiban)"
      const inData = beers.some(beer=>beer.beer===cleanName||beer.beer===bn);
      if(!inData) warn(`Brewery "${b.name}" lists beer "${bn}" not found in beers data`);
    });
  });
  if(!errors.filter(e=>e.includes('Brewery')).length) pass(`All ${breweries.length} brewery entries have required fields and valid coordinates`);

  // ── 5. DRUNK LOCS VALIDATION
  drunkLocs.forEach((l,i)=>{
    REQUIRED_LOC_FIELDS.forEach(f=>{
      if(l[f]===undefined||l[f]===null||l[f]==='') fail(`drunkLoc[${i}] "${l.city||'?'}" missing field: ${f}`);
    });
    if(l.lat<-90||l.lat>90||l.lng<-180||l.lng>180)
      fail(`drunkLoc[${i}] "${l.city}" has invalid coordinates: lat=${l.lat} lng=${l.lng}`);
    if(!FLAGS[l.cc]) warn(`drunkLoc[${i}] "${l.city}" cc "${l.cc}" has no FLAG emoji`);
    // Verify each drunkLoc has at least one beer reviewed there
    const beersThere = beers.filter(b=>b.city===l.city);
    if(!beersThere.length) warn(`drunkLoc "${l.city}" has no beers in data`);
  });
  pass(`All ${drunkLocs.length} consumption locations validated`);

  // ── 6. FUTURES CONTRACT COVERAGE
  FUTURES_BEERS.forEach(name=>{
    const hasData = beers.some(b=>b.beer===name);
    if(!hasData) warn(`Futures contract "${name}" has no review data yet`);
  });
  const coveredFutures = FUTURES_BEERS.filter(n=>beers.some(b=>b.beer===n));
  pass(`${coveredFutures.length}/${FUTURES_BEERS.length} futures contracts have review data`);

  // ── 7. IPO WATCHLIST INTEGRITY
  const ipoBeers = ['Moretti','Peroni','Blue Moon','Miller Lite','Estrella Damm','Estrella Galicia',
    'Brahma','Quilmes','Tsingtao','Castle Lager','Pilsner Urquell','Mythos','Victoria Bitter','Norrlands Guld','Super Bock',
    'Asahi Super Dry','Hoegaarden','Kronenbourg','Newcastle Brown','Ringnes'];
  const reviewedSet = new Set(beers.map(b=>b.beer));
  const ipoReviewed = ipoBeers.filter(n=>reviewedSet.has(n));
  const ipoPending  = ipoBeers.filter(n=>!reviewedSet.has(n));
  ipoBeers.forEach(name=>{
    if(!Object.keys(BRAND_SVGS).includes(name)) warn(`IPO beer "${name}" has no SVG logo`);
  });
  pass(`IPO watchlist: ${ipoPending.length} pending, ${ipoReviewed.length} priced`);

  // ── 8. FLAG & CNAMES SYMMETRY
  const flagKeys  = Object.keys(FLAGS);
  const cnameKeys = Object.keys(CNAMES);
  flagKeys.forEach(k=>{ if(!cnameKeys.includes(k)) warn(`FLAGS has "${k}" but CNAMES does not`); });
  cnameKeys.forEach(k=>{ if(!flagKeys.includes(k)) warn(`CNAMES has "${k}" but FLAGS does not`); });
  pass(`FLAGS and CNAMES both define ${flagKeys.length} country codes`);

  // ── 9. DOM ELEMENT PRESENCE (runtime check)
  const criticalIds = ['beerBody','beerGrid','styleChart','scatterChart','brewedMap','drunkMap'];
  criticalIds.forEach(id=>{
    if(!document.getElementById(id)) fail(`Critical DOM element missing: #${id}`);
  });
  pass(`All ${criticalIds.length} critical DOM elements present`);

  // ── 10. DATA CONSISTENCY: beer cc matches origin where expected
  const ccOriginMismatches = beers.filter(b=>{
    // For non-US-consumed beers, origin and cc can differ legitimately (e.g. Japanese beer drunk in US)
    // Just flag if cc itself is invalid
    return !FLAGS[b.cc] || !FLAGS[b.origin];
  });
  if(ccOriginMismatches.length) ccOriginMismatches.forEach(b=>fail(`Beer "${b.beer}" has unmapped cc/origin`));
  else pass('All beer cc and origin codes map to valid FLAGS entries');

  // ── REPORT
  const totalIssues = errors.length + warnings.length;
  const status = errors.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS';
  const statusColor = errors.length ? 'color:#ff2222' : warnings.length ? 'color:#ffaa00' : 'color:#00cc44';

  console.group('%c🍺 BREW TERMINAL — DATA INTEGRITY REPORT', 'font-weight:bold;color:#ff6600');
  console.log(`Status: %c${status}`, statusColor);
  console.log(`${passes.length} checks passed · ${warnings.length} warnings · ${errors.length} errors`);
  if(errors.length)   { console.group('ERRORS'); errors.forEach(e=>console.error(e)); console.groupEnd(); }
  if(warnings.length) { console.group('WARNINGS'); warnings.forEach(w=>console.warn(w)); console.groupEnd(); }
  if(!totalIssues)    console.log('%c✓ All integrity checks passed — data is clean', 'color:#00cc44');
  console.groupEnd();

  // Store results for the audit panel
  window._auditResults = { status, passes, warnings, errors, ts: new Date().toLocaleTimeString() };

})();



// ══════════════════════════════════════════════════════════════
// COMMAND PALETTE (Ctrl+K / Cmd+K)
// ══════════════════════════════════════════════════════════════
(function initCommandPalette(){
  const TABS=[
    {id:'overview',   label:'OVERVIEW',      icon:'◈', key:'F1'},
    {id:'beers',      label:'ALL BEERS',     icon:'◉', key:'F2'},
    {id:'mapdrunk',   label:'CONSUMED MAP',  icon:'◉', key:'F3'},
    {id:'mapbrewed',  label:'BREWERIES MAP', icon:'◎', key:'F4'},
    {id:'choropleth', label:'WORLD MAP',     icon:'◈', key:'F5'},
  ];

  function openPalette(){
    const pal=document.getElementById('cmd-palette');
    const inp=document.getElementById('cmd-input');
    if(!pal||!inp) return;
    inp.value='';
    pal.classList.add('open');
    inp.focus();
    renderResults('');
  }
  function closePalette(){
    const pal=document.getElementById('cmd-palette');
    if(pal) pal.classList.remove('open');
  }

  function renderResults(q){
    const container=document.getElementById('cmd-results');
    if(!container) return;
    const lq=q.toLowerCase().trim();
    let html='';

    // Tabs nav
    const matchedTabs=lq?TABS.filter(t=>t.label.toLowerCase().includes(lq)||t.id.toLowerCase().includes(lq)):TABS;
    if(matchedTabs.length){
      html+=`<div class="cmd-section">NAVIGATE</div>`;
      html+=matchedTabs.slice(0,7).map(t=>`
        <div class="cmd-item" onclick="showTab('${t.id}');closePalette()">
          <span class="cmd-item-icon">${t.icon}</span>
          <span class="cmd-item-main">${t.label}</span>
          <span class="cmd-item-badge">${t.key}</span>
        </div>`).join('');
    }

    // Beer search
    if(lq.length>=1){
      const matchedBeers=[...new Map(
        beers.filter(b=>b.beer.toLowerCase().includes(lq)||b.style.toLowerCase().includes(lq)||b.origin.toLowerCase().includes(lq))
        .map(b=>[b.beer,b])
      ).values()].slice(0,5);
      if(matchedBeers.length){
        html+=`<div class="cmd-section">BEERS</div>`;
        html+=matchedBeers.map(b=>`
          <div class="cmd-item" onclick="openBeerModal('${b.beer.replace(/'/g,"\\'")}');closePalette()">
            <span class="cmd-item-icon">🍺</span>
            <span class="cmd-item-main">${b.beer}</span>
            <span class="cmd-item-meta">${b.style} · ${FLAGS[b.origin]||''} ${b.origin}</span>
          </div>`).join('');
      }

      const matchedBrew=breweries.filter(b=>
        b.name.toLowerCase().includes(lq)||
        b.location.toLowerCase().includes(lq)||
        b.country.toLowerCase().includes(lq)
      ).slice(0,4);
      if(matchedBrew.length){
        html+=`<div class="cmd-section">BREWERIES</div>`;
        html+=matchedBrew.map(b=>`
          <div class="cmd-item" onclick="openBreweryDrawer('${b.name.replace(/'/g,"\\'")}');closePalette()">
            <span class="cmd-item-icon">🏭</span>
            <span class="cmd-item-main">${b.name}</span>
            <span class="cmd-item-meta">${b.location} · ${FLAGS[b.cc]||''}</span>
          </div>`).join('');
      }
    }

    if(!html) html=`<div style="padding:20px;text-align:center;font-size:10px;color:var(--dim)">NO RESULTS</div>`;
    container.innerHTML=html;
  }

  document.addEventListener('keydown',function(ev){
    if((ev.ctrlKey||ev.metaKey)&&ev.key==='k'){
      ev.preventDefault();
      const pal=document.getElementById('cmd-palette');
      if(pal&&pal.classList.contains('open')) closePalette();
      else openPalette();
      return;
    }
    const pal=document.getElementById('cmd-palette');
    if(!pal||!pal.classList.contains('open')) return;
    if(ev.key==='Escape'){closePalette();return;}
  });

  const inp=document.getElementById('cmd-input');
  if(inp) inp.addEventListener('input',e=>renderResults(e.target.value));

  window.closePalette=closePalette;
  window.openPalette=openPalette;
})();

// ══════════════════════════════════════════════════════════════
// BREWERY DRAWER
// ══════════════════════════════════════════════════════════════
let _drawerMap=null;

function openBreweryDrawer(name){
  try {
    const brewery=breweries.find(b=>b.name===name);
    if(!brewery) return;

    const drawer=document.getElementById('brewery-drawer');
    const title=document.getElementById('drawer-title');
    const body=document.getElementById('drawer-body');
    if(!drawer||!body) return;

    const avgR=avg(brewery.ratings);
    const ratingsHTML=brewery.ratings.map(r=>`<span class="rb ${rbC(r)}" style="margin-right:3px">${r.toFixed(2)}</span>`).join('');

    if(title) title.textContent=brewery.name.toUpperCase().slice(0,28);

    body.innerHTML=`
      <div class="drawer-stat"><span class="drawer-key">BREWERY</span><span class="drawer-val" style="font-size:9px;max-width:180px;text-align:right">${brewery.name}</span></div>
      ${brewery.nativeName?`<div class="drawer-stat"><span class="drawer-key">NATIVE</span><span class="drawer-val" style="font-size:10px;max-width:180px;text-align:right">${brewery.nativeName}</span></div>`:''}
      <div class="drawer-stat"><span class="drawer-key">LOCATION</span><span class="drawer-val" style="font-size:9px;text-align:right">${brewery.location}</span></div>
      <div class="drawer-stat"><span class="drawer-key">COUNTRY</span><span class="drawer-val">${FLAGS[brewery.cc]||''} ${brewery.country}</span></div>
      <div class="drawer-stat"><span class="drawer-key">LANGUAGE</span><span class="drawer-val" style="color:var(--cyan)">${brewery.lang.toUpperCase()}</span></div>
      <div class="drawer-stat"><span class="drawer-key">AVG RATING</span><span class="rb ${rbC(avgR)}" style="font-size:12px">${avgR.toFixed(2)}</span></div>
      <div class="drawer-stat"><span class="drawer-key">REVIEWS</span><span class="drawer-val">${brewery.ratings.length}</span></div>
      <div class="drawer-section">RATINGS</div>
      <div style="margin-bottom:10px;padding-top:4px">${ratingsHTML}</div>
      <div class="drawer-section">BEERS</div>
      <div style="font-size:10px;color:var(--white);line-height:1.9;padding-top:4px">${brewery.beers.split(' · ').map(b=>`<div>◉ ${b}</div>`).join('')}</div>
      <div class="drawer-section">COORDINATES</div>
      <div style="font-size:9px;color:var(--cyan);padding-top:4px">${brewery.lat.toFixed(4)}°, ${brewery.lng.toFixed(4)}°</div>
    `;

    drawer.classList.add('open');

    // Mini map inside drawer
    setTimeout(()=>{
      const mapEl=document.getElementById('drawer-map');
      if(!mapEl) return;
      if(!_drawerMap){
        _drawerMap=L.map('drawer-map',{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:false});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(_drawerMap);
      }
      _drawerMap.setView([brewery.lat,brewery.lng],7);
      _drawerMap.eachLayer(l=>{if(l instanceof L.CircleMarker)_drawerMap.removeLayer(l);});
      L.circleMarker([brewery.lat,brewery.lng],{radius:9,fillColor:'#cc3366',color:'#000',weight:2,fillOpacity:1}).addTo(_drawerMap);
      _drawerMap.invalidateSize();
    },120);
  } catch(e){ console.error('Brewery drawer error:',e); }
}

function closeBreweryDrawer(){
  const drawer=document.getElementById('brewery-drawer');
  if(drawer) drawer.classList.remove('open');
}

window.openBreweryDrawer=openBreweryDrawer;
window.closeBreweryDrawer=closeBreweryDrawer;

// ══════════════════════════════════════════════════════════════
// CHOROPLETH MAP (D3 + TopoJSON)
// ══════════════════════════════════════════════════════════════
function initChoropleth(){
  try {
    // Build country data from beers (origin = brewery country)
    const cm={};
    beers.forEach(b=>{
      if(!cm[b.origin]) cm[b.origin]={t:0,c:0,best:null};
      cm[b.origin].t+=b.rating;
      cm[b.origin].c++;
      if(!cm[b.origin].best||b.rating>cm[b.origin].best.rating) cm[b.origin].best=b;
    });
    const countryData={};
    Object.entries(cm).forEach(([cc,v])=>{ countryData[cc]={avg:v.t/v.c,count:v.c,best:v.best}; });

    // Update KPI tiles
    const ranked=Object.entries(countryData).sort((a,b)=>b[1].avg-a[1].avg);
    const el=id=>document.getElementById(id);
    const set=(id,v)=>{const e=el(id);if(e)e.textContent=v;};
    set('choro-countries',ranked.length);
    if(ranked.length){
      const top=ranked[0],low=ranked[ranked.length-1];
      set('choro-top',(top[1].avg).toFixed(2));
      if(el('choro-top')) el('choro-top').className='kpi-val up';
      set('choro-top-sub',(FLAGS[top[0]]||'')+' '+CNAMES[top[0]]+' · '+top[1].count+' reviews');
      set('choro-low',(low[1].avg).toFixed(2));
      if(el('choro-low')) el('choro-low').className='kpi-val dn';
      set('choro-low-sub',(FLAGS[low[0]]||'')+' '+CNAMES[low[0]]+' · '+low[1].count+' reviews');
      set('choro-avg',STATS.globalAvg.toFixed(2));
    }

    // Choropleth color scale
    function choroColor(avgRating,opacity){
      let h;
      if(avgRating>=4.5) h='#39ff14';
      else if(avgRating>=4.0) h='#80ff44';
      else if(avgRating>=3.5) h='#ffae00';
      else if(avgRating>=3.0) h='#bb5580';
      else if(avgRating>=2.5) h='#cc3366';
      else h='#8f1a44';
      // Apply opacity based on count (1 review = 0.6, max = 1.0)
      const op=Math.min(1,0.55+opacity*0.09);
      const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
      return `rgba(${r},${g},${b},${op})`;
    }

    // world-atlas countries-110m uses ISO 3166-1 numeric IDs
    // Map numeric ID → ISO alpha-2 for our beer origins
    const NUM_TO_A2={
      '032':'AR','036':'AU','040':'AT','056':'BE','076':'BR','100':'BG','124':'CA',
      '156':'CN','191':'HR','203':'CZ','208':'DK','246':'FI','250':'FR','276':'DE',
      '300':'GR','348':'HU','352':'IS','356':'IN','372':'IE','380':'IT','388':'JM',
      '392':'JP','410':'KR','428':'LV','440':'LT','442':'LU','470':'MT','484':'MX',
      '528':'NL','566':'NG','578':'NO','616':'PL','620':'PT','642':'RO','643':'RU',
      '702':'SG','703':'SK','705':'SI','710':'ZA','724':'ES','752':'SE','756':'CH',
      '764':'TH','792':'TR','804':'UA','826':'GB','840':'US'
    };
    // Also handle as string padded (world-atlas may give "840" or 840)
    const A3_to_A2=id=>NUM_TO_A2[String(id)]||NUM_TO_A2[String(id).padStart(3,'0')]||null;

    const wrap=document.getElementById('choropleth-svg-wrap');
    if(!wrap) return;
    wrap.innerHTML='<div style="text-align:center;padding:40px;font-size:10px;color:var(--dim)">Loading world map…</div>';

    const tooltip=document.getElementById('choro-tooltip');
    const W=wrap.clientWidth||900, H=Math.round(W*0.5);
    wrap.style.height=H+'px';

    // Fetch world atlas topojson
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r=>r.json())
      .then(world=>{
        wrap.innerHTML='';
        const countries=topojson.feature(world,world.objects.countries);

        const svg=d3.select(wrap).append('svg')
          .attr('viewBox',`0 0 ${W} ${H}`)
          .attr('width','100%')
          .attr('height',H);

        const projection=d3.geoNaturalEarth1()
          .scale(W/6.28)
          .translate([W/2,H/2]);
        const path=d3.geoPath().projection(projection);

        svg.append('rect').attr('width',W).attr('height',H).attr('fill','#050508');

        svg.selectAll('.choro-country')
          .data(countries.features)
          .enter().append('path')
          .attr('class',d=>{
            const a2=A3_to_A2(d.id);
            return 'choro-country'+(a2&&countryData[a2]?' has-data':'');
          })
          .attr('d',path)
          .attr('fill',d=>{
            const a2=A3_to_A2(d.id);
            if(!a2||!countryData[a2]) return '#1a1a2e';
            return choroColor(countryData[a2].avg,countryData[a2].count);
          })
          .attr('stroke','#252540')
          .attr('stroke-width',0.5)
          .on('mouseover',function(event,d){
            const a2=A3_to_A2(d.id);
            const cd=a2?countryData[a2]:null;
            if(!tooltip) return;
            tooltip.style.display='block';
            tooltip.innerHTML=cd
              ? `<span style="color:var(--orange)">${FLAGS[a2]||''} ${CNAMES[a2]||a2}</span><br>Avg: <span style="color:var(--cyan)">${cd.avg.toFixed(2)}</span> · ${cd.count} review${cd.count>1?'s':''}<br>Best: ${cd.best?cd.best.beer:'—'}`
              : `<span style="color:var(--dim)">${a2?CNAMES[a2]||a2:'—'}</span><br><span style="color:#333">No reviews yet</span>`;
            d3.select(this).attr('stroke','#cc3366').attr('stroke-width',1.5);
          })
          .on('mousemove',function(event){
            if(!tooltip) return;
            tooltip.style.left=(event.clientX+14)+'px';
            tooltip.style.top=(event.clientY-10)+'px';
          })
          .on('mouseout',function(){
            if(tooltip) tooltip.style.display='none';
            d3.select(this).attr('stroke','#252540').attr('stroke-width',0.5);
          })
          .on('click',function(event,d){
            const a2=A3_to_A2(d.id);
            const br=a2?breweries.find(b=>b.cc===a2):null;
            if(br) openBreweryDrawer(br.name);
          });
      })
      .catch(()=>{
        wrap.innerHTML=`<div style="text-align:center;padding:30px;font-size:10px;color:var(--dim)">
          Map unavailable offline — country data shown in table below.</div>`;
      });

    // Table
    const tbody=document.getElementById('choro-table-body');
    const maxCount=Math.max(...ranked.map(r=>r[1].count));
    if(tbody){
      tbody.innerHTML=ranked.map(([cc,d])=>`
        <tr>
          <td style="font-weight:600">${FLAGS[cc]||''} ${CNAMES[cc]||cc}</td>
          <td>${d.count}</td>
          <td><span class="rb ${rbC(d.avg)}">${d.avg.toFixed(2)}</span></td>
          <td style="color:#4a4a6a;font-size:9px">${d.best?d.best.beer:'—'}</td>
          <td style="min-width:80px">
            <div class="bb-bar-bg" style="width:${Math.round(d.count/maxCount*120)}px">
              <div class="bb-bar-fill" style="width:${Math.round(d.count/maxCount*100)}%;background:${choroColor(d.avg,d.count)}"></div>
            </div>
          </td>
        </tr>`).join('');
    }
  } catch(e){ console.error('Choropleth error:',e); }
}

// ══════════════════════════════════════════════════════════════
// KPI ANIMATED COUNTERS + SPARKLINES
// ══════════════════════════════════════════════════════════════
(function initKPISparklines(){
  try {
    // Compute per-month data for sparklines
    const MONTH_ORDER=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthNMap={};
    beers.forEach(b=>{ if(!monthNMap[b.month]) monthNMap[b.month]=b.monthN; });
    const months=Object.keys(monthNMap).sort((a,b)=>monthNMap[a]-monthNMap[b]);
    if(months.length<2) return; // need 2+ months for sparklines

    const byMonth={};
    months.forEach(m=>{ byMonth[m]=beers.filter(b=>b.month===m); });

    const sparkData={
      'spark-top': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?Math.max(...rs):null; }),
      'spark-avg': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?avg(rs):null; }),
      'spark-low': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?Math.min(...rs):null; }),
      'spark-abv': months.map(m=>{ const as=byMonth[m].map(b=>b.abv); return as.length?avg(as):null; }),
      'spark-brands': months.map(m=>{ return [...new Set(byMonth[m].map(b=>b.beer))].length; }),
    };
    const sparkColors={
      'spark-top':'#80ff44','spark-avg':'#ffae00','spark-low':'#ff2d55',
      'spark-abv':'#00f5ff','spark-brands':'#cc3366'
    };

    Object.entries(sparkData).forEach(([id,data])=>{
      const canvas=document.getElementById(id);
      if(!canvas) return;
      const color=sparkColors[id]||'#cc3366';
      new Chart(canvas,{
        type:'line',
        data:{
          labels:months,
          datasets:[{data,borderColor:color,backgroundColor:color+'22',borderWidth:1.5,
            pointRadius:2,pointBackgroundColor:color,fill:true,tension:0.4,spanGaps:true}]
        },
        options:{
          responsive:false,
          animation:{duration:800},
          plugins:{legend:{display:false},tooltip:{enabled:false}},
          scales:{x:{display:false},y:{display:false}},
          elements:{point:{hoverRadius:0}}
        }
      });
    });

    // Animated count-up for KPI values
    function animateCounter(el,target,decimals,suffix){
      if(!el||isNaN(target)) return;
      const duration=900,startTime=performance.now();
      const start=0;
      function step(now){
        const progress=Math.min((now-startTime)/duration,1);
        const ease=1-Math.pow(1-progress,3);
        el.textContent=(start+(target-start)*ease).toFixed(decimals)+(suffix||'');
        if(progress<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const topBeer=STATS.sorted[0];
    const lowBeer=STATS.sorted[STATS.sorted.length-1];
    const avgAbv=beers.reduce((s,b)=>s+b.abv,0)/beers.length;
    const totalBrands=Object.keys(STATS.brandMap).length;

    const animate=(id,val,dec,suf)=>{ const e=document.getElementById(id); if(e) animateCounter(e,val,dec,suf); };
    animate('ov-top-val',topBeer.rating,2);
    animate('ov-avg-val',STATS.globalAvg,2);
    animate('ov-low-val',lowBeer.rating,2);
    animate('ov-abv-val',avgAbv,1,'%');
    animate('ov-brands-val',totalBrands,0);
    animate('hdr-avg',STATS.globalAvg,2);
  } catch(e){ console.error('KPI sparklines error:',e); }
})();
