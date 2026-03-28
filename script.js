// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const FLAGS={ES:"🇪🇸",DE:"🇩🇪",IE:"🇮🇪",JM:"🇯🇲",BE:"🇧🇪",JP:"🇯🇵",NL:"🇳🇱",FR:"🇫🇷",MX:"🇲🇽",CA:"🇨🇦",DK:"🇩🇰",US:"🇺🇸",IT:"🇮🇹",BR:"🇧🇷",CN:"🇨🇳",ZA:"🇿🇦",GR:"🇬🇷",AU:"🇦🇺",SE:"🇸🇪",CZ:"🇨🇿",PT:"🇵🇹",AR:"🇦🇷",GB:"🇬🇧",NO:"🇳🇴",PL:"🇵🇱",TH:"🇹🇭",SG:"🇸🇬",AT:"🇦🇹"};
const CNAMES={DE:"Germany",IE:"Ireland",JM:"Jamaica",BE:"Belgium",JP:"Japan",NL:"Netherlands",FR:"France",MX:"Mexico",CA:"Canada",DK:"Denmark",US:"USA",IT:"Italy",ES:"Spain",BR:"Brazil",CN:"China",ZA:"South Africa",GR:"Greece",AU:"Australia",SE:"Sweden",CZ:"Czech Republic",PT:"Portugal",AR:"Argentina",GB:"Great Britain",NO:"Norway",PL:"Poland",TH:"Thailand",SG:"Singapore",AT:"Austria"};

// ══════════════════════════════════════════════════════════════
// GOOGLE SHEETS INTEGRATION
// ══════════════════════════════════════════════════════════════
// To use: 1) Create a Google Sheet with 3 tabs: "Beers", "Breweries", "Locations"
//         2) Publish it: File → Share → Publish to web → Entire Document → CSV
//         3) Paste the sheet ID below (the long string in the URL between /d/ and /edit)
//         4) Data loads live from the sheet — no PRs needed to add beers!
//         If the sheet is unavailable, the hardcoded data below is used as fallback.
const SHEETS_CONFIG = {
  enabled: false,            // Set to true once you've set up your Google Sheet
  sheetId: '',               // Paste your Google Sheet ID here
  // Tab names in your Google Sheet (must match exactly):
  beersTab: 'Beers',
  breweriesTab: 'Breweries',
  locationsTab: 'Locations'
};

let beers=[
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
  {beer:"Carlsberg",       style:"Pilsner-Other",            origin:"DK",abv:5.0,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
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
  {beer:"Pilsner Urquell", style:"Pilsner-Czech/Bohemian",     origin:"CZ",abv:4.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Wrench",         style:"IPA-New England Hazy",       origin:"US",abv:7.1,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Fin Du Monde",style:"Belgian Tripel",             origin:"CA",abv:9.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Żywiec",         style:"Lager-Pale",                origin:"PL",abv:5.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Corona Extra",   style:"Lager-Mexican",             origin:"MX",abv:4.5,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Peroni",         style:"Lager-Pale",                origin:"IT",abv:5.1,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:2.50,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Estrella Damm",  style:"Lager-Pale",                origin:"ES",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Heineken",       style:"Lager-Pale",                origin:"NL",abv:5.0,method:"Draft", city:"Queens",      region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Grolsch Puur Weizen",style:"Wheat Beer-Hefeweizen",origin:"NL",abv:5.1,method:"Draft", city:"Oldenzaal",   region:"Overijssel",      country:"Netherlands", cc:"NL", rating:5.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Leffe Blonde",      style:"Belgian Blonde",           origin:"BE",abv:6.6,method:"Draft", city:"Nijmegen",    region:"Gelderland",      country:"Netherlands", cc:"NL", rating:4.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Texels Skuumkoppe", style:"Wheat Beer-Dunkelweizen",  origin:"NL",abv:6.0,method:"Bottle",city:"Nijmegen",    region:"Gelderland",      country:"Netherlands", cc:"NL", rating:3.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Guinness",          style:"Stout-Irish Dry",          origin:"IE",abv:4.2,method:"Nitro", city:"Nijmegen",    region:"Gelderland",      country:"Netherlands", cc:"NL", rating:3.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Affligem Tripel",   style:"Belgian Tripel",           origin:"BE",abv:9.0, method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Bolleke De Koninck",style:"Pale Ale-Belgian",         origin:"BE",abv:5.2, method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"IJwit",             style:"Wheat Beer-Witbier/Blanche",origin:"NL",abv:6.5,method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Chouffe Blonde", style:"Belgian Strong Golden Ale",  origin:"BE",abv:8.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",cc:"US", rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Stiegl Goldbräu",  style:"Lager-Helles",               origin:"AT",abv:5.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
];

// Merge user-added beers from localStorage
(function(){
  try {
    const saved=JSON.parse(localStorage.getItem('brewUserBeers')||'[]');
    saved.forEach(b=>beers.push(b));
  } catch(e){ console.error('Failed to load user beers:',e); }
})();

let drunkLocs=[
  {city:"New York",    region:"New York",             country:"USA",         cc:"US", lat:40.7128,lng:-74.0060},
  {city:"New Rochelle",region:"New York",             country:"USA",         cc:"US", lat:40.9115,lng:-73.7826},
  {city:"White Plains",region:"New York",             country:"USA",         cc:"US", lat:41.0340,lng:-73.7629},
  {city:"Eastchester", region:"New York",             country:"USA",         cc:"US", lat:40.9565,lng:-73.8115},
  {city:"Hartsdale",   region:"New York",             country:"USA",         cc:"US", lat:41.0215,lng:-73.7987},
  {city:"Montreal",    region:"Quebec",               country:"Canada",      cc:"CA", lat:45.5017,lng:-73.5673},
  {city:"Amsterdam",   region:"Noord-Holland",        country:"Netherlands", cc:"NL", lat:52.3676,lng:4.9041},
  {city:"Hengelo",     region:"Overijssel",           country:"Netherlands", cc:"NL", lat:52.2660,lng:6.7930},
  {city:"Uncassville", region:"Connecticut",           country:"USA",         cc:"US", lat:41.4775,lng:-72.0892},
  {city:"Queens",      region:"New York",             country:"USA",         cc:"US", lat:40.7282,lng:-73.7949},
  {city:"Oldenzaal",   region:"Overijssel",           country:"Netherlands", cc:"NL", lat:52.3107,lng:6.9280},
  {city:"Nijmegen",    region:"Gelderland",           country:"Netherlands", cc:"NL", lat:51.8426,lng:5.8528},
  {city:"Antwerp",     region:"Antwerp",              country:"Belgium",     cc:"BE", lat:51.2194,lng:4.4025},
];

let breweries=[
  {name:"Weihenstephaner",        location:"Freising, Bavaria",         country:"Germany",     cc:"DE", lang:"de", beers:"Weihenstephaner · Münchner Weisse · Munchen Dunkel", nativeName:"Weihenstephaner · Münchner Weiße · Münchner Dunkel", lat:48.3953,lng:11.7291, ratings:[4.50,4.75,2.75]},
  {name:"Guinness (St. James's Gate)", location:"Dublin, Leinster",     country:"Ireland",     cc:"IE", lang:"en", beers:"Guinness",                                          lat:53.3418,lng:-6.2868, ratings:[3.25,4.00,3.75]},
  {name:"Harp / Diageo",          location:"Dundalk, County Louth",     country:"Ireland",     cc:"IE", lang:"en", beers:"Harp",                                              lat:54.0039,lng:-6.3703, ratings:[4.25]},
  {name:"Duvel Moortgat",         location:"Puurs-Sint-Amands, Antwerp",country:"Belgium",     cc:"BE", lang:"nl", beers:"Duvel",                                             lat:51.0727,lng:4.2897,  ratings:[4.00,4.25]},
  {name:"AB InBev (Stella)",      location:"Leuven, Flemish Brabant",   country:"Belgium",     cc:"BE", lang:"nl", beers:"Stella Artois",                                     lat:50.8798,lng:4.7005,  ratings:[2.75,2.75]},
  {name:"Heineken",               location:"Amsterdam, Noord-Holland",  country:"Netherlands", cc:"NL", lang:"nl", beers:"Heineken",                                          lat:52.3578,lng:4.8918,  ratings:[3.25,3.25,3.25]},
  {name:"Grolsch",                location:"Enschede, Overijssel",      country:"Netherlands", cc:"NL", lang:"nl", beers:"Grolsch · Grolsch Puur Weizen",                     lat:52.2215,lng:6.8937,  ratings:[3.50,5.00]},
  {name:"Bavaria NV (Hertog Jan)",location:"Arcen, Limburg",            country:"Netherlands", cc:"NL", lang:"nl", beers:"Hertog Jan",                                        lat:51.4862,lng:6.1741,  ratings:[2.00]},
  {name:"Anheuser-Busch",         location:"St. Louis, Missouri",       country:"USA",         cc:"US", lang:"en", beers:"Budweiser · Bud Light · Michelob Ultra",            lat:38.6072,lng:-90.2124, ratings:[3.00,3.00,2.50]},
  {name:"Molson Coors",           location:"Golden, Colorado",          country:"USA",         cc:"US", lang:"en", beers:"Coors Light",                                       lat:39.7555,lng:-105.2211,ratings:[3.00,2.75]},
  {name:"Grupo Modelo",           location:"Mexico City, CDMX",         country:"Mexico",      cc:"MX", lang:"es", beers:"Modelo · Modelo Negra · Corona Extra",              lat:19.4274,lng:-99.1677, ratings:[3.25,2.25,3.00,3.00,3.75,3.50]},
  {name:"Carlsberg",              location:"Copenhagen, Capital Region",country:"Denmark",     cc:"DK", lang:"da", beers:"Carlsberg",                                         lat:55.6614,lng:12.5361,  ratings:[2.75,3.00]},
  {name:"Unibroue",               location:"Chambly, Quebec",           country:"Canada",      cc:"CA", lang:"fr", beers:"La Fin Du Monde",                                   lat:45.4412,lng:-73.2615, ratings:[2.75,3.75]},
  {name:"Kronenbourg",            location:"Obernai, Alsace",           country:"France",      cc:"FR", lang:"fr", beers:"1664",                  nativeName:"Kronenbourg 1664", lat:48.4637,lng:7.4845,  ratings:[3.00]},
  {name:"Sapporo Brewery",        location:"Sapporo, Hokkaido",         country:"Japan",       cc:"JP", lang:"ja", beers:"Sapporo",               nativeName:"サッポロビール",     lat:43.0685,lng:141.3544, ratings:[3.50,3.00]},
  {name:"Kirin Brewery",          location:"Yokohama, Kanagawa",        country:"Japan",       cc:"JP", lang:"ja", beers:"Ichiban",nativeName:"キリン一番搾り",   lat:35.4634,lng:139.6220, ratings:[3.00]},
  {name:"Red Stripe (D&G)",       location:"Kingston, Surrey",          country:"Jamaica",     cc:"JM", lang:"en", beers:"Red Stripe",                                        lat:17.9972,lng:-76.7939, ratings:[3.75]},
  {name:"Estrella Galicia",       location:"A Coruña, Galicia",         country:"Spain",       cc:"ES", lang:"es", beers:"Estrella Galicia",                                   lat:43.3623,lng:-8.4115,  ratings:[4.25]},
  {name:"Pilsner Urquell",        location:"Pilsen, Bohemia",           country:"Czech Republic",cc:"CZ", lang:"cs", beers:"Pilsner Urquell",    nativeName:"Plzeňský Prazdroj", lat:49.7479,lng:13.3756,  ratings:[3.25]},
  {name:"Birra Moretti (Heineken Italia)", location:"Udine, Friuli-Venezia Giulia", country:"Italy", cc:"IT", lang:"it", beers:"Moretti",         nativeName:"Birra Moretti",     lat:46.0640,lng:13.2350,  ratings:[3.75]},
  {name:"Erdinger Weissbräu",  location:"Erding, Bavaria",             country:"Germany",     cc:"DE", lang:"de", beers:"Erdinger Weissbier",    nativeName:"Erdinger Weißbier", lat:48.3063,lng:11.9071,  ratings:[3.25]},
  {name:"Industrial Arts Brewing",location:"Beacon, New York",          country:"USA",         cc:"US", lang:"en", beers:"Wrench",                                             lat:41.5048,lng:-73.9690,  ratings:[4.00]},
  {name:"Żywiec Brewery (Grupa Żywiec)", location:"Żywiec, Silesia",   country:"Poland",      cc:"PL", lang:"pl", beers:"Żywiec",                                             lat:49.6853,lng:19.1925,  ratings:[2.75]},
  {name:"Birra Peroni",               location:"Rome, Lazio",           country:"Italy",       cc:"IT", lang:"it", beers:"Peroni",                                              lat:41.8902,lng:12.4922,  ratings:[2.50]},
  {name:"S.A. Damm",                  location:"Barcelona, Catalonia",  country:"Spain",       cc:"ES", lang:"es", beers:"Estrella Damm",                                           lat:41.3897,lng:2.1540,   ratings:[3.50]},
  {name:"Abbaye de Leffe (AB InBev)", location:"Dinant, Namur",          country:"Belgium",     cc:"BE", lang:"fr", beers:"Leffe Blonde",                                            lat:50.2611,lng:4.9122,   ratings:[4.75]},
  {name:"Texelse Bierbrouwerij",      location:"Oudeschild, North Holland",country:"Netherlands",cc:"NL", lang:"nl", beers:"Texels Skuumkoppe",                                       lat:53.0385,lng:4.8510,   ratings:[3.00]},
  {name:"Affligem Brewery (Heineken)",location:"Opwijk, Flemish Brabant", country:"Belgium",     cc:"BE", lang:"nl", beers:"Affligem Tripel",                                          lat:50.9786,lng:4.1868,   ratings:[3.75]},
  {name:"De Koninck Brewery",         location:"Antwerp, Antwerp",        country:"Belgium",     cc:"BE", lang:"nl", beers:"Bolleke De Koninck",                                       lat:51.2157,lng:4.4156,   ratings:[2.75]},
  {name:"Brouwerij 't IJ",            location:"Amsterdam, Noord-Holland",country:"Netherlands", cc:"NL", lang:"nl", beers:"IJwit",                                                    lat:52.3657,lng:4.9196,   ratings:[3.75]},
  {name:"Brasserie d'Achouffe",       location:"Achouffe, Luxembourg",    country:"Belgium",     cc:"BE", lang:"fr", beers:"La Chouffe Blonde",                                           lat:50.1283,lng:5.7981,   ratings:[4.25]},
  {name:"Stieglbrauerei zu Salzburg", location:"Salzburg, Salzburg",      country:"Austria",     cc:"AT", lang:"de", beers:"Stiegl Goldbräu",                                              lat:47.8095,lng:13.0550,  ratings:[2.75]},
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
"Grolsch Puur Weizen":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#0a0a0a"/><text x="100" y="24" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#1a7b1a" text-anchor="middle">Grolsch</text><line x1="20" y1="32" x2="180" y2="32" stroke="#1a7b1a" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="14" fill="#c9a84c" text-anchor="middle" letter-spacing="1">PUUR WEIZEN</text></svg>`,
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
"Texels Skuumkoppe":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a3a00"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">TEXELS</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">SKUUMKOPPE</text></svg>`,
"Smithwick's":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#8b0000"/><text x="100" y="22" font-family="Georgia,serif" font-size="9" fill="#c9a84c" text-anchor="middle" letter-spacing="2">IRISH ALE</text><text x="100" y="48" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="1">Smithwick's</text></svg>`,
"Tennent's":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="8" fill="#fff" text-anchor="middle" letter-spacing="3">SCOTLAND</text><text x="100" y="48" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="1">TENNENT'S</text></svg>`,
"Affligem Tripel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#3d1c02"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">ABBAYE D'AFFLIGEM</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#f0e68c" text-anchor="middle" letter-spacing="2">TRIPEL</text></svg>`,
"Bolleke De Koninck":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#8b1a1a"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">DE KONINCK</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle" letter-spacing="2">BOLLEKE</text></svg>`,
"IJwit":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#003d8f"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#fff" text-anchor="middle" letter-spacing="2">BROUWERIJ 'T IJ</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="2">IJWIT</text></svg>`,
"La Chouffe Blonde":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1a3a00"/><text x="100" y="22" font-family="Georgia,serif" font-size="10" fill="#c9a84c" text-anchor="middle" letter-spacing="2">BRASSERIE D'ACHOUFFE</text><line x1="20" y1="28" x2="180" y2="28" stroke="#c9a84c" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="18" font-weight="bold" fill="#f0e68c" text-anchor="middle" letter-spacing="1">LA CHOUFFE</text></svg>`,
"Stiegl Goldbräu":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" fill="#c8102e"/><text x="100" y="22" font-family="Arial,sans-serif" font-size="10" fill="#fff" text-anchor="middle" letter-spacing="3">STIEGL</text><line x1="20" y1="28" x2="180" y2="28" stroke="#ffd700" stroke-width="0.8"/><text x="100" y="50" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="#ffd700" text-anchor="middle" letter-spacing="1">GOLDBRÄU</text></svg>`,
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
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const std=a=>{if(!a.length)return 0;const m=avg(a);return Math.sqrt(avg(a.map(v=>(v-m)**2)));};

function logoImg(name,size=24){
  const u=LOGO_URIS[name];
  return u?`<img src="${u}" class="beer-logo-inline" style="width:${size}px;height:${size}px" alt="${name}">`:`<span style="display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle;margin-right:6px">🍺</span>`;
}
function cardLogo(name){
  const u=LOGO_URIS[name];
  return u?`<img src="${u}" class="bc-logo" alt="${name}">`:`<span class="bc-emoji">🍺</span>`;
}

const MONTH_FULL = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const MONTH_COLORS = ['#ff6600','#00aaff','#00cc44','#bb44ff','#ffdd00','#ff2222','#00ffdd','#ff88aa','#88ccff','#ffaa44','#cc88ff','#88ff88'];

function getMonthlyData(){
  const monthNMap={};
  beers.forEach(b=>{ if(!monthNMap[b.month]) monthNMap[b.month]=b.monthN; });
  const months=Object.keys(monthNMap).sort((a,b)=>monthNMap[a]-monthNMap[b]);
  const byMonth={};
  months.forEach(m=>{ byMonth[m]=beers.filter(b=>b.month===m); });
  const monthColors=months.map((_,i)=>MONTH_COLORS[i%MONTH_COLORS.length]);
  const monthLabels=months.map(m=>`${MONTH_FULL[m]||m} ${beers.find(b=>b.month===m)?.year||''}`);
  return {months,byMonth,monthColors,monthLabels};
}

// ══════════════════════════════════════════════════════════════
// PRE-COMPUTED STATISTICS — recomputed when data loads from Sheets
// ══════════════════════════════════════════════════════════════
function computeStats(){
  const styleMap={},methodMap={},countryMap={},cityMap={},brandMap={};
  let ratingSum=0;

  // Single pass over beers to build all aggregation maps
  beers.forEach(b=>{
    ratingSum+=b.rating;
    if(!styleMap[b.style])styleMap[b.style]={t:0,c:0};styleMap[b.style].t+=b.rating;styleMap[b.style].c++;
    if(!methodMap[b.method])methodMap[b.method]={t:0,c:0};methodMap[b.method].t+=b.rating;methodMap[b.method].c++;
    if(!countryMap[b.origin])countryMap[b.origin]={t:0,c:0};countryMap[b.origin].t+=b.rating;countryMap[b.origin].c++;
    if(!cityMap[b.city])cityMap[b.city]={t:0,c:0,region:b.region,country:b.country,cc:b.cc};cityMap[b.city].t+=b.rating;cityMap[b.city].c++;
    if(!brandMap[b.beer])brandMap[b.beer]=[];brandMap[b.beer].push(b.rating);
  });

  const styleRanked=Object.entries(styleMap).map(([s,v])=>({s,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const METHOD_ORDER=['Draft','Nitro','Bottle','Can'];
  const methodAvgs=METHOD_ORDER.map(m=>methodMap[m]?+(methodMap[m].t/methodMap[m].c).toFixed(2):0);
  const methodCounts=METHOD_ORDER.map(m=>methodMap[m]?methodMap[m].c:0);
  const countryRanked=Object.entries(countryMap).map(([k,v])=>({l:`${FLAGS[k]||''} ${CNAMES[k]||k}`,code:k,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const cityRanked=Object.entries(cityMap).map(([k,v])=>({city:k,region:v.region,country:v.country,cc:v.cc,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const brandList=Object.entries(brandMap).map(([n,rs])=>({n,cnt:rs.length,avg:avg(rs),best:Math.max(...rs),worst:Math.min(...rs),std:std(rs)})).sort((a,b)=>b.avg-a.avg);
  const sorted=[...beers].sort((a,b)=>b.rating-a.rating);
  const globalAvg=beers.length?ratingSum/beers.length:0;

  return {styleMap,styleRanked,METHOD_ORDER,methodMap,methodAvgs,methodCounts,countryMap,countryRanked,cityMap,cityRanked,brandMap,brandList,sorted,globalAvg};
}
let STATS=computeStats();

// ══════════════════════════════════════════════════════════════
// "NEW" DISPLAY — only show NEW tag for beers reviewed in the current month
// ══════════════════════════════════════════════════════════════
const _now=new Date(), _curMonth=_now.getMonth()+1, _curYear=_now.getFullYear();
function isDisplayNew(b){ return b.isNew && b.monthN===_curMonth && b.year===_curYear; }

// ══════════════════════════════════════════════════════════════
// DYNAMIC STATS — update header, overview KPIs, and BEERS tab
// from live data so they never go stale when new beers are added
// ══════════════════════════════════════════════════════════════
function updateLiveStats(){
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
  const newCount     = beers.filter(b=>isDisplayNew(b)).length;

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  // Header bar
  const sub = document.getElementById('hdr-subtitle');
  if(sub) sub.textContent = `PERSONAL BREW INTELLIGENCE SYSTEM · ${totalReviews} REVIEWS · ${totalMarkets} MARKETS · ${totalBrands} BRANDS`;
  set('hdr-top',   topBeer.rating.toFixed(2));
  set('hdr-avg',   avgRating.toFixed(2));
  set('hdr-low',   lowBeer.rating.toFixed(2));
  set('hdr-abv',   avgAbv.toFixed(1)+'%');
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
  // Status bar
  set('sb-stats', `RECORDS: ${totalReviews} · BRANDS: ${totalBrands} · MKTS: ${totalMarkets}`);
}
try { updateLiveStats(); } catch(e){ console.error('Live stats error:',e); }

// ══════════════════════════════════════════════════════════════
// GOOGLE SHEETS LOADER — fetches live data and refreshes the dashboard
// ══════════════════════════════════════════════════════════════
(function loadFromGoogleSheets(){
  if(!SHEETS_CONFIG.enabled || !SHEETS_CONFIG.sheetId) return;

  const base=`https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.sheetId}/gviz/tq?tqx=out:csv&sheet=`;

  function parseCSV(text){
    const rows=[];
    const lines=text.split('\n');
    if(lines.length<2) return rows;
    const headers=parseCSVLine(lines[0]);
    for(let i=1;i<lines.length;i++){
      const line=lines[i].trim();
      if(!line) continue;
      const vals=parseCSVLine(line);
      const obj={};
      headers.forEach((h,j)=>{ obj[h.trim()]=vals[j]||''; });
      rows.push(obj);
    }
    return rows;
  }

  function parseCSVLine(line){
    const result=[];
    let current='';
    let inQuotes=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(inQuotes){
        if(ch==='"'&&line[i+1]==='"'){current+='"';i++;}
        else if(ch==='"'){inQuotes=false;}
        else{current+=ch;}
      } else {
        if(ch==='"'){inQuotes=true;}
        else if(ch===','){result.push(current);current='';}
        else{current+=ch;}
      }
    }
    result.push(current);
    return result;
  }

  function toNum(v,fallback){const n=parseFloat(v);return isNaN(n)?fallback:n;}
  function toBool(v){return v==='true'||v==='TRUE'||v==='1'||v==='yes'||v==='YES';}

  function parseBeerRow(r){
    return {
      beer:r.beer||'',style:r.style||'',origin:r.origin||'',
      abv:toNum(r.abv,0),method:r.method||'Bottle',
      city:r.city||'',region:r.region||'',country:r.country||'',cc:r.cc||'',
      rating:toNum(r.rating,0),isNew:toBool(r.isNew),
      month:r.month||'',monthN:toNum(r.monthN,1),year:toNum(r.year,2026)
    };
  }

  function parseBreweryRow(r){
    const obj={
      name:r.name||'',location:r.location||'',country:r.country||'',
      cc:r.cc||'',lang:r.lang||'en',beers:r.beers||'',
      lat:toNum(r.lat,0),lng:toNum(r.lng,0),
      ratings:(r.ratings||'').split(',').map(v=>toNum(v.trim(),0)).filter(v=>v>0)
    };
    if(r.nativeName) obj.nativeName=r.nativeName;
    return obj;
  }

  function parseLocationRow(r){
    return {
      city:r.city||'',region:r.region||'',country:r.country||'',cc:r.cc||'',
      lat:toNum(r.lat,0),lng:toNum(r.lng,0)
    };
  }

  function refreshUI(){
    STATS=computeStats();
    // Reset all lazy-loaded tab flags so they re-render with new data
    ['_cD','_ciD','_rkD','_inD','_tmpD','_ciX','_ipoD','_ftD','_auditD','_dM','_bM','_chorD','_langD']
      .forEach(f=>window[f]=false);
    // Re-run live stats
    try { updateLiveStats(); } catch(e){console.error('Sheets refresh error:',e);}
    // Re-render the currently active tab
    const activePanel=document.querySelector('.panel.active');
    if(activePanel) showTab(activePanel.id);
    console.log(`%c[SHEETS] Loaded ${beers.length} beers, ${breweries.length} breweries, ${drunkLocs.length} locations from Google Sheets`,'color:#00ff88');
  }

  // Fetch all 3 sheets in parallel
  Promise.all([
    fetch(base+encodeURIComponent(SHEETS_CONFIG.beersTab)).then(r=>r.text()),
    fetch(base+encodeURIComponent(SHEETS_CONFIG.breweriesTab)).then(r=>r.text()),
    fetch(base+encodeURIComponent(SHEETS_CONFIG.locationsTab)).then(r=>r.text())
  ]).then(([beersCSV,brewCSV,locsCSV])=>{
    const sheetBeers=parseCSV(beersCSV).map(parseBeerRow);
    const sheetBreweries=parseCSV(brewCSV).map(parseBreweryRow);
    const sheetLocs=parseCSV(locsCSV).map(parseLocationRow);
    // Only replace if we got valid data
    if(sheetBeers.length>0){
      beers.length=0;
      sheetBeers.forEach(b=>beers.push(b));
      // Re-merge localStorage user beers
      try{const saved=JSON.parse(localStorage.getItem('brewUserBeers')||'[]');saved.forEach(b=>beers.push(b));}catch(e){}
    }
    if(sheetBreweries.length>0){
      breweries.length=0;
      sheetBreweries.forEach(b=>breweries.push(b));
    }
    if(sheetLocs.length>0){
      drunkLocs.length=0;
      sheetLocs.forEach(l=>drunkLocs.push(l));
    }
    refreshUI();
  }).catch(err=>{
    console.warn('[SHEETS] Could not load from Google Sheets, using hardcoded data.',err);
  });
})();

// ══════════════════════════════════════════════════════════════
// CLOCK & TICKER — isolated first, cannot be killed by downstream errors
// ══════════════════════════════════════════════════════════════
(function initClockAndTicker(){
  // CLOCK
  function updateClock(){
    try {
      const n=new Date();
      const t=n.toLocaleTimeString('en-US',{hour12:false});
      const d=n.toLocaleDateString('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
      const el=id=>document.getElementById(id);
      if(el('clock-time'))el('clock-time').textContent=t;
      if(el('clock-date'))el('clock-date').textContent=d;
      if(el('mb-clock'))el('mb-clock').textContent=t;
      if(el('sb-time'))el('sb-time').textContent=t;
    } catch(e){ /* never let clock throw */ }
  }
  setInterval(updateClock,1000);
  updateClock();

  // TICKER
  try {
    const beerMap={};
    beers.forEach(b=>{if(!beerMap[b.beer]||b.rating>beerMap[b.beer].rating)beerMap[b.beer]=b;});
    const tickerBeers=Object.values(beerMap).sort(()=>Math.random()-0.5);
    const SEP='<span style="color:#333;margin:0 20px;font-size:10px">◆</span>';
    let tk=tickerBeers.map(b=>{
      const arr=b.rating>=4?'▲':b.rating>=3?'▶':'▼';
      const cl=b.rating>=4?'up':b.rating>=3?'fl':'dn';
      const flag=FLAGS[b.origin]||'';
      return `<span style="display:inline-block;white-space:nowrap;unicode-bidi:isolate">`
        + `<span style="margin-right:5px;font-size:11px">${flag}</span>`
        + `<span class="${cl}" style="letter-spacing:0.3px">${b.beer.toUpperCase()} ${arr} ${b.rating.toFixed(2)}</span>`
        + `<span style="color:#555;margin-left:8px;font-size:9px">${b.abv}% ABV · ${b.origin}</span>`
        + `</span>`;
    }).join(SEP);
    tk = SEP + tk + SEP + tk;
    document.getElementById('ticker-scroll').innerHTML=tk;
  } catch(e){ console.error('Ticker error:',e); }
})();

// ── KEYBOARD SHORTCUTS (1-9, 0, q-r, F1-F10 for tabs; Esc for modal)
(function(){
  const tabMap={
    '1':'overview','2':'beers','3':'rankings','4':'countries',
    '5':'city','6':'insights','7':'temporal','8':'mapdrunk',
    '9':'mapbrewed','0':'language',
    'q':'contrarian','w':'ipo','e':'audit','r':'choropleth',
    'f1':'overview','f2':'beers','f3':'rankings','f4':'countries',
    'f5':'city','f6':'insights','f7':'temporal','f8':'mapdrunk',
    'f9':'mapbrewed','f10':'language'
  };
  document.addEventListener('keydown',function(ev){
    if(ev.target.tagName==='INPUT'||ev.target.tagName==='TEXTAREA'||ev.target.tagName==='SELECT') return;
    if(ev.key==='Escape'){closeBeerModal();return;}
    const tab=tabMap[ev.key.toLowerCase()];
    if(tab&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();showTab(tab);}
  });
})();

// ── TAB
function showTab(id,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.mb-item').forEach(m=>m.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Sync menubar
  const mbEl=document.querySelector(`.mb-item[data-tab="${id}"]`);
  if(mbEl) mbEl.classList.add('active');
  // Sync sidebar: handles both click (btn passed) and keyboard (btn undefined)
  const navEl=btn&&btn.classList.contains('nav-item')?btn:
    [...document.querySelectorAll('.nav-item')].find(n=>n.dataset.tab===id);
  if(navEl) navEl.classList.add('active');
  if(id==='countries'&&!window._cD) drawCountry();
  if(id==='city'&&!window._ciD) drawCity();
  if(id==='rankings'&&!window._rkD) drawRankings();
  if(id==='insights'&&!window._inD) drawInsights();
  if(id==='temporal'&&!window._tmpD) drawTemporal();
  if(id==='contrarian'&&!window._ciX) drawContrarian();
  if(id==='ipo'){if(!window._ipoD) drawIPO(); if(!window._ftD) drawFutures();}
  if(id==='audit'&&!window._auditD) drawAudit();
if(id==='mapdrunk'&&!window._dM){window._dM=true;setTimeout(initDrunkMap,80);}
  if(id==='mapbrewed'&&!window._bM){window._bM=true;setTimeout(initBrewedMap,80);}
  if(id==='choropleth'&&!window._chorD){window._chorD=true;setTimeout(initChoropleth,100);}
  if(id==='language'&&!window._langD) drawLanguage();
}

// ── CHART DEFAULTS
try {
  Chart.defaults.color='#555';
  Chart.defaults.borderColor='#222';
  Chart.defaults.font.family="'IBM Plex Mono','Courier New',monospace";
  Chart.defaults.font.size=11;
  Chart.defaults.devicePixelRatio=Math.max(window.devicePixelRatio||1,2);
  Chart.defaults.elements.point.radius=3;
  Chart.defaults.elements.point.hoverRadius=5;
  Chart.defaults.elements.line.borderWidth=2;
  Chart.defaults.elements.bar.borderWidth=0;
  Chart.defaults.animation.duration=400;
} catch(e){ console.error('Chart.defaults error:',e); }
const _charts={};
function safeChart(key,ctx,cfg){
  if(_charts[key]) _charts[key].destroy();
  _charts[key]=new Chart(ctx,cfg);
  return _charts[key];
}
const TT={backgroundColor:'#0a0a12',borderColor:'#cc3366',borderWidth:1,titleColor:'#00f5ff',bodyColor:'#aaa',padding:8};

// ══════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════
try {
// Use pre-computed statistics
const sA=STATS.styleRanked;
safeChart('styleChart',document.getElementById('styleChart'),{type:'bar',
  data:{labels:sA.map(s=>s.s.length>16?s.s.slice(0,16)+'…':s.s),datasets:[{data:sA.map(s=>s.a),backgroundColor:sA.map(s=>sC[s.s]||'#ff6600'),borderWidth:0}]},
  options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw.toFixed(2)}/5`}}},scales:{x:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},y:{grid:{display:false},ticks:{color:'#ff6600',font:{size:9}}}}}
});

const mO=STATS.METHOD_ORDER, mA=STATS.methodAvgs, mCt=STATS.methodCounts;
safeChart('methodChart',document.getElementById('methodChart'),{type:'bar',
  data:{labels:mO,datasets:[{data:mA,backgroundColor:['#ff6600','#00aaff','#bb44ff','#555'],borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:TT},scales:{y:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
});

safeChart('scatterChart',document.getElementById('scatterChart'),{type:'scatter',
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
const latestTwo=[...beers].sort((a,b)=>b.year-a.year||b.monthN-a.monthN).slice(0,2);
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

// ── STREAK / RECENCY
try {
  const monthMap={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const latest=beers.reduce((best,b)=>{
    const d=new Date(b.year,monthMap[b.month]||0,1);
    return d>best.d?{d,b}:best;
  },{d:new Date(0),b:null});
  if(latest.b){
    const today=new Date();
    const diffDays=Math.floor((today-latest.d)/(1000*60*60*24));
    const el=document.getElementById('streak-days');
    const bl=document.getElementById('streak-beer');
    if(el) el.textContent=diffDays;
    if(bl) bl.textContent=latest.b.month+' '+latest.b.year;
  }
} catch(e){ console.error('Streak error:',e); }

// ══════════════════════════════════════════════════════════════
// BEER TABLE + GRID
// ══════════════════════════════════════════════════════════════
function renderTable(data){
  try {
    const countEl=document.getElementById('beerFilterCount');
    if(countEl) countEl.textContent=`${data.length} / ${beers.length} ROWS`;
    document.getElementById('beerBody').innerHTML=data.map(b=>`
      <tr${isDisplayNew(b)?' class="new-row"':''} style="cursor:pointer" data-beer="${b.beer.replace(/"/g,'&quot;')}">
        <td>${logoImg(b.beer,22)}</td>
        <td style="color:#ff6600;font-weight:600">${b.beer}${isDisplayNew(b)?`<span class="new-tag">NEW</span>`:''}</td>
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
function sortTable(){applyBeerFilter();}
try {
  // Populate filter dropdowns
  const styles=[...new Set(beers.map(b=>b.style))].sort();
  const origins=[...new Set(beers.map(b=>b.origin))].sort();
  const styleEl=document.getElementById('beerStyleFilter');
  const origEl=document.getElementById('beerOriginFilter');
  const sf=document.createDocumentFragment();styles.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;sf.appendChild(o);});styleEl.appendChild(sf);
  const of=document.createDocumentFragment();origins.forEach(o=>{const el=document.createElement('option');el.value=o;el.textContent=`${FLAGS[o]||''} ${o}`;of.appendChild(el);});origEl.appendChild(of);
  applyBeerFilter();
} catch(e){ console.error('renderTable init:',e); }

try {
const _beerBest={};
beers.forEach(b=>{if(!_beerBest[b.beer]||b.rating>_beerBest[b.beer].rating)_beerBest[b.beer]=b;});
const unique=Object.values(_beerBest).sort((a,b)=>b.rating-a.rating);
document.getElementById('beerGrid').innerHTML=unique.map(b=>`
  <div class="beer-card" data-beer="${b.beer.replace(/"/g,'&quot;')}">
    ${isDisplayNew(b)?'<span class="bc-new">NEW</span>':''}
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
// RANKINGS
// ══════════════════════════════════════════════════════════════
function drawRankings(){
  window._rkD=true;
  const sr=STATS.sorted;
  const mkList=(data,i0)=>data.map((b,i)=>`
    <div class="mini-row">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8px;color:#333;width:16px;text-align:right">#${i0+i+1}</span>
        ${logoImg(b.beer,20)}
        <span style="color:#ff6600;font-size:10px;font-weight:600">${b.beer}</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8px;color:#555">${b.city}, ${b.region} · ${FLAGS[b.cc]||''} ${b.country}</span>
        <span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span>
      </div>
    </div>`).join('');
  document.getElementById('top10').innerHTML=mkList(sr.slice(0,10),0);
  document.getElementById('bot10').innerHTML=mkList([...sr].reverse().slice(0,10),Math.max(0,sr.length-10));

  const bList=STATS.brandList;
  document.getElementById('brandBody').innerHTML=bList.map((b,i)=>`
    <tr>
      <td style="color:#555;font-size:9px">${i+1}</td>
      <td>${logoImg(b.n,20)}</td>
      <td style="color:#ff6600;font-weight:600">${b.n}</td>
      <td style="text-align:center">${b.cnt}</td>
      <td><span class="rb ${rbC(b.avg)}">${b.avg.toFixed(2)}</span></td>
      <td class="up">${b.best.toFixed(2)}</td>
      <td class="dn">${b.worst.toFixed(2)}</td>
      <td style="color:#aaa">${b.std.toFixed(3)}</td>
      <td><span style="font-size:8px;padding:1px 5px;border:1px solid;color:${b.std<.2?'#00cc44':b.std<.4?'#ffaa00':'#ff2222'};border-color:${b.std<.2?'#00cc44':b.std<.4?'#ffaa00':'#ff2222'}">${b.std<.2?'CONSISTENT':b.std<.4?'MODERATE':'VARIABLE'}</span></td>
    </tr>`).join('');

  const buckets={'2.0':0,'2.5':0,'3.0':0,'3.5':0,'4.0':0,'4.5-4.75':0};
  beers.forEach(b=>{
    if(b.rating<2.5)buckets['2.0']++;
    else if(b.rating<3.0)buckets['2.5']++;
    else if(b.rating<3.5)buckets['3.0']++;
    else if(b.rating<4.0)buckets['3.5']++;
    else if(b.rating<4.5)buckets['4.0']++;
    else buckets['4.5-4.75']++;
  });
  safeChart('distChart',document.getElementById('distChart'),{type:'bar',
    data:{labels:Object.keys(buckets),datasets:[{data:Object.values(buckets),backgroundColor:['#ff2222','#ff6600','#ffaa00','#aacc00','#00cc44','#00ff55'],borderWidth:0}]},
    options:{plugins:{legend:{display:false},tooltip:TT},scales:{y:{grid:{color:'#1a1a1a'},ticks:{color:'#444',stepSize:1}},x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
  });
}

// ══════════════════════════════════════════════════════════════
// COUNTRY
// ══════════════════════════════════════════════════════════════
function drawCountry(){
  window._cD=true;
  const cD=STATS.countryRanked;
  safeChart('countryChart',document.getElementById('countryChart'),{type:'bar',
    data:{labels:cD.map(d=>d.l),datasets:[{data:cD.map(d=>+d.a.toFixed(2)),backgroundColor:cD.map((_,i)=>`hsl(${30+i*18},80%,${40-i}%)`),borderWidth:0}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:TT},scales:{x:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},y:{grid:{display:false},ticks:{color:'#ff6600',font:{size:10}}}}}
  });
  document.getElementById('countryCards').innerHTML=cD.map(d=>`
    <div class="bb-bar-row">
      <div class="bb-bar-label"><span class="name">${d.l}</span><span class="val">${d.a.toFixed(2)}/5 · ${d.c}x</span></div>
      <div class="bb-bar-bg"><div class="bb-bar-fill" style="width:${d.a/5*100}%;background:${rC(d.a)}"></div></div>
    </div>`).join('');
  safeChart('countryPieChart',document.getElementById('countryPieChart'),{type:'doughnut',
    data:{labels:cD.map(d=>d.l),datasets:[{data:cD.map(d=>d.c),backgroundColor:cD.map((_,i)=>`hsl(${30+i*18},80%,${40-i}%)`),borderWidth:1,borderColor:'#111'}]},
    options:{plugins:{legend:{position:'right',labels:{color:'#666',font:{size:9},boxWidth:10}},tooltip:{...TT,callbacks:{label:c=>`${c.raw} reviews`}}}}
  });
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
safeChart('methodDetailChart',document.getElementById('methodDetailChart'),{type:'bar',
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
// CITY
// ══════════════════════════════════════════════════════════════
function drawCity(){
  window._ciD=true;
  const cD=STATS.cityRanked;
  safeChart('cityChart',document.getElementById('cityChart'),{type:'bar',
    data:{labels:cD.map(d=>`${d.city} (${d.c})`),datasets:[{data:cD.map(d=>+d.a.toFixed(2)),backgroundColor:cD.map((_,i)=>`hsl(${30+i*22},75%,${42-i}%)`),borderWidth:0}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:TT},scales:{x:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},y:{grid:{display:false},ticks:{color:'#ff6600',font:{size:10}}}}}
  });
  document.getElementById('cityCards').innerHTML=cD.map(d=>`
    <div class="mini-row">
      <div><div style="font-size:10px;color:#ff6600;font-weight:600">${d.city}</div><div style="font-size:8px;color:#555">${d.region} · ${FLAGS[d.cc]||''} ${d.country} · ${d.c} review${d.c>1?'s':''}</div></div>
      <span class="rb ${rbC(d.a)}">${d.a.toFixed(2)}</span>
    </div>`).join('');
  safeChart('cityPieChart',document.getElementById('cityPieChart'),{type:'doughnut',
    data:{labels:cD.map(d=>`${d.city}, ${d.region}`),datasets:[{data:cD.map(d=>d.c),backgroundColor:cD.map((_,i)=>`hsl(${30+i*22},75%,${42-i}%)`),borderWidth:1,borderColor:'#111'}]},
    options:{plugins:{legend:{position:'right',labels:{color:'#666',font:{size:9},boxWidth:10}},tooltip:{...TT,callbacks:{label:c=>`${c.raw} reviews`}}}}
  });
}

// ══════════════════════════════════════════════════════════════
// INSIGHTS
// ══════════════════════════════════════════════════════════════
function drawInsights(){
  window._inD=true;
  const ratings=beers.map(b=>b.rating);
  const sr=[...ratings].sort((a,b)=>a-b);
  const mean=avg(ratings),med=sr.length%2===0?(sr[sr.length/2-1]+sr[sr.length/2])/2:sr[Math.floor(sr.length/2)],stdD=std(ratings);
  const q1=sr[Math.floor(sr.length*.25)],q3=sr[Math.floor(sr.length*.75)];

  document.getElementById('statSummary').innerHTML=[
    ['MEAN',mean.toFixed(4),'fl'],['MEDIAN',med.toFixed(2),''],
    ['STD DEV',stdD.toFixed(4),''],['MIN',Math.min(...ratings).toFixed(2),'dn'],
    ['MAX',Math.max(...ratings).toFixed(2),'up'],['RANGE',(Math.max(...ratings)-Math.min(...ratings)).toFixed(2),''],
    ['Q1 (25th)',q1.toFixed(2),''],['Q3 (75th)',q3.toFixed(2),''],
    ['IQR',(q3-q1).toFixed(2),''],['N',ratings.length,''],
  ].map(([l,v,c])=>`<div class="insight-row"><span class="insight-key">${l}</span><span class="insight-val ${c}" style="font-family:var(--mono)">${v}</span></div>`).join('');

  document.getElementById('quintiles').innerHTML=[
    ['▲▲ EXCELLENT (4.5–5.0)',ratings.filter(r=>r>=4.5).length,'up'],
    ['▲  GOOD (4.0–4.4)',ratings.filter(r=>r>=4&&r<4.5).length,'up'],
    ['→  SOLID (3.5–3.9)',ratings.filter(r=>r>=3.5&&r<4).length,'fl'],
    ['→  AVERAGE (3.0–3.4)',ratings.filter(r=>r>=3&&r<3.5).length,'fl'],
    ['▼  BELOW (2.5–2.9)',ratings.filter(r=>r>=2.5&&r<3).length,'dn'],
    ['▼▼ POOR (<2.5)',ratings.filter(r=>r<2.5).length,'dn'],
  ].map(([l,n,c])=>`<div class="insight-row">
    <span class="insight-key">${l}</span>
    <span class="insight-val ${c}">${n} <span style="color:#555;font-size:9px">(${(n/ratings.length*100).toFixed(0)}%)</span></span>
  </div>`).join('');

  const profAvg=fn=>{const m=beers.filter(fn);return m.length?avg(m.map(b=>b.rating)):0;};
  const profile=[
    {l:'WHEAT/HEFEWEIZEN BIAS',v:profAvg(b=>b.style.includes('Wheat')||b.style.includes('Hefeweizen')||b.style.includes('Witbier')),color:'#ff6600'},
    {l:'DARK BEER TOLERANCE',v:profAvg(b=>b.style.includes('Stout')||b.style.includes('Dark')||b.style.includes('Dunkel')||b.style.includes('Brown')),color:'#444'},
    {l:'LAGER APPRECIATION',v:profAvg(b=>b.style.includes('Lager')),color:'#00cc44'},
    {l:'GERMAN BEER PREMIUM',v:profAvg(b=>b.origin==='DE'),color:'#ff6600'},
    {l:'AMERICAN BEER DISCOUNT',v:profAvg(b=>b.origin==='US'),color:'#ff2222'},
    {l:'ARTISAN vs MACRO',v:profAvg(b=>b.style.includes('Belgian')||b.style.includes('IPA')||b.style.includes('Wheat')),color:'#bb44ff'},
    {l:'HIGH ABV PREFERENCE',v:profAvg(b=>b.abv>=6.0),color:'#00aaff'},
    {l:'DRAFT/NITRO PREMIUM',v:profAvg(b=>b.method==='Draft'||b.method==='Nitro'),color:'#00aaff'},
  ];
  document.getElementById('tasteProfile').innerHTML=profile.map(p=>`
    <div class="bb-bar-row">
      <div class="bb-bar-label"><span class="name">${p.l}</span><span class="val">${p.v.toFixed(2)}/5</span></div>
      <div class="bb-bar-bg"><div class="bb-bar-fill" style="width:${p.v/5*100}%;background:${p.color}"></div></div>
    </div>`).join('');

  safeChart('timelineChart',document.getElementById('timelineChart'),{type:'line',
    data:{
      labels:beers.map((_,i)=>`#${i+1}`),
      datasets:[
        {label:'Rating',data:beers.map(b=>b.rating),borderColor:'#ff6600',backgroundColor:'rgba(255,102,0,0.06)',fill:true,tension:.3,pointRadius:3,pointBackgroundColor:beers.map(b=>rC(b.rating)),pointBorderColor:'#000',pointBorderWidth:1},
        {label:'5-Pt Avg',data:beers.map((_,i,a)=>avg(a.slice(Math.max(0,i-4),i+1).map(b=>b.rating)).toFixed(2)),borderColor:'#00aaff',borderDash:[3,3],tension:.3,pointRadius:0,fill:false},
      ]
    },
    options:{plugins:{legend:{labels:{color:'#555',font:{size:9},boxWidth:10}},tooltip:TT},scales:{y:{min:1.5,max:5.2,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},x:{grid:{display:false},ticks:{color:'#444',maxTicksLimit:12}}}}
  });

  const brands2={};
  beers.forEach(b=>{if(!brands2[b.beer])brands2[b.beer]=[];brands2[b.beer].push(b.rating);});
  const multi=Object.entries(brands2).filter(([,rs])=>rs.length>1).map(([n,rs])=>({n,rs,avg:avg(rs),std:std(rs)})).sort((a,b)=>a.std-b.std);
  document.getElementById('consistencyPanel').innerHTML=multi.map(b=>`
    <div class="mini-row" style="gap:10px">
      ${logoImg(b.n,28)}
      <div style="flex:1">
        <div style="color:#ff6600;font-weight:600;font-size:10px;margin-bottom:2px">${b.n}</div>
        <div style="font-size:8px;color:#555">AVG ${b.avg.toFixed(2)} · σ ${b.std.toFixed(3)} · SCORES: ${b.rs.sort((a,c)=>c-a).join(', ')}</div>
        <div style="margin-top:3px;height:3px;background:#1a1a1a">
          <div style="height:100%;width:${(1-b.std)*100}%;background:${b.std<.2?'#00cc44':b.std<.4?'#ffaa00':'#ff2222'}"></div>
        </div>
      </div>
      <span style="font-size:7px;padding:1px 5px;border:1px solid;color:${b.std<.2?'#00cc44':b.std<.4?'#ffaa00':'#ff2222'};border-color:${b.std<.2?'#00cc44':b.std<.4?'#ffaa00':'#ff2222'};flex-shrink:0">${b.std<.2?'CONSISTENT':b.std<.4?'MODERATE':'VARIABLE'}</span>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// LANGUAGE
// ══════════════════════════════════════════════════════════════
try {
const LANG_NAMES={en:"English",de:"German",nl:"Dutch",fr:"French",ja:"Japanese",es:"Spanish",da:"Danish",cs:"Czech",it:"Italian",pl:"Polish",pt:"Portuguese",sv:"Swedish",no:"Norwegian",zh:"Chinese",th:"Thai",el:"Greek",af:"Afrikaans"};
const LANG_MAP_FALLBACK={DE:"German",NL:"Dutch",BE:"Dutch",US:"English",IE:"English",JM:"English",CA:"French",FR:"French",JP:"Japanese",MX:"Spanish",DK:"Danish",ES:"Spanish",CZ:"Czech",IT:"Italian",PL:"Polish"};
const lC={"German":"#ff6600","Dutch":"#00aaff","English":"#00cc44","French":"#bb44ff","Japanese":"#ff2222","Spanish":"#ffaa00","Danish":"#555","Czech":"#00ccaa","Italian":"#ff44aa","Polish":"#cc4444","Portuguese":"#ff8800","Swedish":"#003399","Norwegian":"#0066cc","Chinese":"#dd0000","Thai":"#9933cc","Greek":"#0088ff","Afrikaans":"#007749"};
const lF={"German":"🇩🇪","Dutch":"🇳🇱","English":"🇬🇧","French":"🇫🇷","Japanese":"🇯🇵","Spanish":"🇪🇸","Danish":"🇩🇰","Czech":"🇨🇿","Italian":"🇮🇹","Polish":"🇵🇱","Portuguese":"🇵🇹","Swedish":"🇸🇪","Norwegian":"🇳🇴","Chinese":"🇨🇳","Thai":"🇹🇭","Greek":"🇬🇷","Afrikaans":"🇿🇦"};
// Build beer→lang lookup from breweries data (uses actual brewery lang field)
const beerLangLookup={};
breweries.forEach(br=>{br.beers.split(' · ').forEach(n=>{beerLangLookup[n.trim()]=LANG_NAMES[br.lang]||br.lang;});});
const brewLoc={};breweries.forEach(b=>{b.beers.split(' · ').forEach(n=>{if(!brewLoc[n.trim()])brewLoc[n.trim()]=b.location;});});
const lD=beers.map(b=>({beer:b.beer,country:b.origin,region:brewLoc[b.beer]||'',lang:beerLangLookup[b.beer]||LANG_MAP_FALLBACK[b.origin]||b.origin,rating:b.rating}));
const lA={};
lD.forEach(d=>{if(!lA[d.lang])lA[d.lang]={t:0,c:0,b:[]};lA[d.lang].t+=d.rating;lA[d.lang].c++;if(!lA[d.lang].b.includes(d.beer))lA[d.lang].b.push(d.beer);});
const lS=Object.entries(lA).map(([l,v])=>({l,a:v.t/v.c,c:v.c,b:v.b})).sort((a,b)=>b.a-a.a);
safeChart('langChart',document.getElementById('langChart'),{type:'bar',
  data:{labels:lS.map(d=>`${lF[d.l]||''} ${d.l}`),datasets:[{data:lS.map(d=>+d.a.toFixed(2)),backgroundColor:lS.map(d=>lC[d.l]||'#ff6600'),borderWidth:0}]},
  options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:TT},scales:{x:{min:0,max:5,grid:{color:'#1a1a1a'},ticks:{color:'#444'}},y:{grid:{display:false},ticks:{color:'#ff6600',font:{size:10}}}}}
});
document.getElementById('langCards').innerHTML=lS.map(d=>`
  <div class="bb-bar-row">
    <div class="bb-bar-label"><span class="name">${lF[d.l]||''} ${d.l}</span><span class="val">${d.a.toFixed(2)}/5 · ${d.c}x · ${d.b.join(', ')}</span></div>
    <div class="bb-bar-bg"><div class="bb-bar-fill" style="width:${d.a/5*100}%;background:${lC[d.l]}"></div></div>
  </div>`).join('');
document.getElementById('langTableBody').innerHTML=[...lD].sort((a,b)=>b.rating-a.rating).map(d=>`
  <tr><td>${logoImg(d.beer,20)}</td><td style="color:#ff6600">${d.beer}</td><td>${FLAGS[d.country]||''} ${d.country}</td><td style="color:#555;font-size:9px">${d.region}</td><td style="color:${lC[d.lang]||'#ff6600'}">${lF[d.lang]||''} ${d.lang}</td><td><span class="rb ${rbC(d.rating)}">${d.rating.toFixed(2)}</span></td></tr>`).join('');
} catch(e){ console.error('Language init error:',e); }

// ══════════════════════════════════════════════════════════════
// MAPS
// ══════════════════════════════════════════════════════════════
const cityColors={"New York":"#ff6600","New Rochelle":"#bb44ff","White Plains":"#00cc44","Eastchester":"#00aaff","Hartsdale":"#ff2222","Montreal":"#ff8800","Amsterdam":"#00cccc","Hengelo":"#6666ff","Uncassville":"#ff44aa"};
function addTiles(map){L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO',maxZoom:20,subdomains:'abcd',detectRetina:true}).addTo(map);}
function popHtml(h){return `<div style="font-family:var(--mono);font-size:11px;line-height:1.7;letter-spacing:0.2px;-webkit-font-smoothing:antialiased">${h}</div>`;}
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
      <td style="font-weight:600"><span class="brewery-clickable" data-brewery="${b.name.replace(/"/g,'&quot;')}">${b.name}</span></td>
      <td style="color:#555;font-size:9px">${b.location}</td>
      <td style="color:#aaa">${FLAGS[b.cc]||''} ${b.country}</td>
      <td style="color:#555;font-size:9px">${b.beers}</td>
      <td><span class="rb ${rbC(b.avg)}">${b.avg.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// TEMPORAL ANALYTICS
// ══════════════════════════════════════════════════════════════
function drawTemporal(){
  window._tmpD = true;

  const {months,byMonth,monthColors,monthLabels} = getMonthlyData();

  const counts     = months.map(m => byMonth[m].length);
  const avgRatings = months.map(m => {
    const rs = byMonth[m].map(b => b.rating);
    return rs.length ? +(rs.reduce((a,v)=>a+v,0)/rs.length).toFixed(2) : 0;
  });

  // ── KPI tiles (dynamic: months tracked + one tile per month + MOM delta)
  const latest = months[months.length - 1];
  const prev   = months[months.length - 2];
  const delta  = prev != null ? +(avgRatings[months.length-1] - avgRatings[months.length-2]).toFixed(2) : 0;
  const deltaColor = delta > 0 ? 'var(--green2)' : delta < 0 ? 'var(--red)' : 'var(--amber)';
  const deltaLabel = delta > 0 ? '▲ IMPROVING' : delta < 0 ? '▼ DECLINING' : '→ FLAT';
  const kpiRange = months.length > 1 ? `${months[0]} – ${months[months.length-1]}` : months[0];

  document.getElementById('temporal-kpis').innerHTML = `<div class="g${Math.min(months.length+2,5)}" style="margin-bottom:0">
    <div class="kpi"><div class="kpi-val" style="color:var(--orange)">${months.length}</div><div class="kpi-label">MONTHS TRACKED</div><div class="kpi-sub">${kpiRange} 2026</div></div>
    ${months.map((m,i)=>`
    <div class="kpi"><div class="kpi-val" style="color:${monthColors[i]}">${counts[i]}</div><div class="kpi-label">${m.toUpperCase()} REVIEWS</div><div class="kpi-sub">Avg: ${avgRatings[i].toFixed(2)}</div></div>`).join('')}
    <div class="kpi"><div class="kpi-val" style="color:${deltaColor}">${delta>=0?'+':''}${delta.toFixed(2)}</div><div class="kpi-label">MOM RATING Δ</div><div class="kpi-sub">${deltaLabel}</div></div>
  </div>`;

  // ── Monthly volume + avg rating chart
  safeChart('monthlyChart',document.getElementById('monthlyChart'), {
    data: {
      labels: monthLabels,
      datasets: [
        {type:'bar',label:'Reviews',data:counts,backgroundColor:monthColors.map(c=>c+'33'),borderColor:monthColors,borderWidth:2,yAxisID:'y'},
        {type:'line',label:'Avg Rating',data:avgRatings,borderColor:'#ffaa00',backgroundColor:'transparent',pointBackgroundColor:avgRatings.map(r=>rC(r)),pointRadius:8,pointBorderColor:'#000',pointBorderWidth:2,tension:0.3,yAxisID:'y2'}
      ]
    },
    options:{plugins:{legend:{labels:{color:'#555',font:{size:9},boxWidth:10}},tooltip:TT},
      scales:{y:{position:'left',grid:{color:'#1a1a1a'},ticks:{color:'#444',stepSize:1},title:{display:true,text:'REVIEWS',color:'#444'}},
              y2:{position:'right',min:0,max:5,grid:{display:false},ticks:{color:'#ffaa00'},title:{display:true,text:'AVG RATING',color:'#ffaa00'}},
              x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
  });

  // ── Best & worst by month
  document.getElementById('monthBestWorst').innerHTML = months.map((m,i) => {
    const mb = byMonth[m];
    if(!mb.length) return '';
    const best  = mb.reduce((a,b)=>b.rating>a.rating?b:a);
    const worst = mb.reduce((a,b)=>b.rating<a.rating?b:a);
    return `
      <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)">
        <div style="font-size:9px;font-weight:700;color:${monthColors[i]};letter-spacing:1px;margin-bottom:6px">${monthLabels[i].toUpperCase()} · ${mb.length} REVIEWS · AVG ${avgRatings[i].toFixed(2)}</div>
        <div class="mini-row">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:9px;color:var(--green2);font-weight:700">▲ BEST</span>
            ${logoImg(best.beer,18)}
            <span style="color:#ddd;font-size:10px">${best.beer}</span>
          </div>
          <span class="rb ${rbC(best.rating)}">${best.rating.toFixed(2)}</span>
        </div>
        <div class="mini-row">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:9px;color:var(--red);font-weight:700">▼ WORST</span>
            ${logoImg(worst.beer,18)}
            <span style="color:#ddd;font-size:10px">${worst.beer}</span>
          </div>
          <span class="rb ${rbC(worst.rating)}">${worst.rating.toFixed(2)}</span>
        </div>
      </div>`;
  }).join('');

  // ── Rating distribution (all months side-by-side)
  const bucketKeys = ['2.0-2.4','2.5-2.9','3.0-3.4','3.5-3.9','4.0-4.4','4.5+'];
  const bucketFn = r => r>=4.5?5:r>=4?4:r>=3.5?3:r>=3?2:r>=2.5?1:0;
  safeChart('monthDistChart',document.getElementById('monthDistChart'),{type:'bar',
    data:{labels:bucketKeys,datasets:months.map((m,i)=>{
      const bkts=[0,0,0,0,0,0];
      byMonth[m].forEach(b=>bkts[bucketFn(b.rating)]++);
      return {label:m+' 2026',data:bkts,backgroundColor:monthColors[i]+'66',borderColor:monthColors[i],borderWidth:2};
    })},
    options:{plugins:{legend:{labels:{color:'#555',font:{size:9},boxWidth:10}},tooltip:TT},
      scales:{y:{grid:{color:'#1a1a1a'},ticks:{color:'#444',stepSize:1}},x:{grid:{display:false},ticks:{color:'#ff6600'}}}}
  });

  // ── Style-mix doughnut charts — one per month, rendered dynamically
  const styleChartsEl = document.getElementById('temporal-style-charts');
  styleChartsEl.innerHTML = `<div class="g2">${months.map((m,i)=>`
    <div class="bb-panel">
      <div class="bb-panel-head">STYLE MIX — ${(MONTH_FULL[m]||m).toUpperCase()} 2026<span class="ph-right">${counts[i]} REVIEWS</span></div>
      <div class="bb-body"><canvas id="styleChart_${m}" height="180"></canvas></div>
    </div>`).join('')}</div>`;
  months.forEach(m=>{
    const sm={};
    byMonth[m].forEach(b=>{sm[b.style]=(sm[b.style]||0)+1;});
    const labels=Object.keys(sm),data=Object.values(sm);
    safeChart(`styleChart_${m}`,document.getElementById(`styleChart_${m}`),{type:'doughnut',
      data:{labels,datasets:[{data,backgroundColor:labels.map(s=>sC[s]||'#ff6600'),borderWidth:1,borderColor:'#111'}]},
      options:{plugins:{legend:{position:'right',labels:{color:'#666',font:{size:9},boxWidth:10}},tooltip:TT}}
    });
  });

  // ── Country exposure — all months
  const allCountries=[...new Set(beers.map(b=>b.origin))].sort();
  safeChart('monthCountryChart',document.getElementById('monthCountryChart'),{type:'bar',
    data:{labels:allCountries.map(c=>`${FLAGS[c]||''} ${c}`),datasets:months.map((m,i)=>({
      label:m,
      data:allCountries.map(c=>byMonth[m].filter(b=>b.origin===c).length),
      backgroundColor:monthColors[i]+'66',borderColor:monthColors[i],borderWidth:2
    }))},
    options:{plugins:{legend:{labels:{color:'#555',font:{size:9},boxWidth:10}},tooltip:TT},
      scales:{y:{grid:{color:'#1a1a1a'},ticks:{color:'#444',stepSize:1}},x:{grid:{display:false},ticks:{color:'#ff6600',font:{size:9}}}}}
  });

  // ── Momentum panel — compares latest two months
  const mRow = (l,v,c) => `<div class="mini-row"><span style="font-size:9px;color:var(--orange)">${l}</span><span class="${c}" style="font-family:var(--mono);font-size:10px;font-weight:700">${v}</span></div>`;
  let momentum = '';
  months.forEach((m,i)=>{
    const mAvg = avgRatings[i];
    const mAbv = avg(byMonth[m].map(b=>b.abv));
    momentum += mRow(`${m.toUpperCase()} REVIEWS`, counts[i], 'fl');
    momentum += mRow(`${m.toUpperCase()} AVG RATING`, mAvg.toFixed(2), 'fl');
    momentum += mRow(`${m.toUpperCase()} AVG ABV`, mAbv.toFixed(2)+'%', '');
    if(i < months.length - 1) {
      const nextM = months[i+1];
      const paceChg = counts[i+1] - counts[i];
      const ratingChg = avgRatings[i+1] - avgRatings[i];
      const overlap = [...new Set(byMonth[m].map(b=>b.beer))].filter(n=>byMonth[nextM].some(b=>b.beer===n));
      momentum += mRow(`${m.toUpperCase()}→${nextM.toUpperCase()} PACE`, (paceChg>=0?'+':'')+paceChg+' REVIEWS', paceChg>=0?'up':'dn');
      momentum += mRow(`${m.toUpperCase()}→${nextM.toUpperCase()} Δ RATING`, (ratingChg>=0?'+':'')+ratingChg.toFixed(2), ratingChg>=0?'up':'dn');
      momentum += mRow('REPEAT BRANDS', overlap.length+' ('+overlap.slice(0,3).join(', ')+(overlap.length>3?'…':'')+')','');
    }
  });
  document.getElementById('momentumPanel').innerHTML = momentum;

  // ── Bump Chart — Country Rankings Over Time
  try {
    const BUMP_COLORS=['#cc3366','#00f5ff','#39ff14','#ffae00','#bb44ff','#bb5580','#00c4d4','#ff4400','#80ff44','#9966ff'];
    // Get all countries that appear in at least 2 months
    const countriesByMonth = {};
    months.forEach(m => {
      const cm = {};
      byMonth[m].forEach(b => { if(!cm[b.origin]) cm[b.origin]={t:0,c:0}; cm[b.origin].t+=b.rating; cm[b.origin].c++; });
      countriesByMonth[m] = cm;
    });
    const allCodes = [...new Set(beers.map(b=>b.origin))];
    const multiMonthCodes = allCodes.filter(cc => months.filter(m=>countriesByMonth[m][cc]).length >= 2);
    // Sort by total review count to pick top 8
    const topCodes = multiMonthCodes.sort((a,b)=>{
      const ta=months.reduce((s,m)=>s+(countriesByMonth[m][a]?.c||0),0);
      const tb=months.reduce((s,m)=>s+(countriesByMonth[m][b]?.c||0),0);
      return tb-ta;
    }).slice(0,8);

    // For each month, rank all countries present by avg rating
    const rankByMonth = {};
    months.forEach(m => {
      const sorted=Object.entries(countriesByMonth[m]).map(([cc,v])=>({cc,a:v.t/v.c})).sort((a,b)=>b.a-a.a);
      rankByMonth[m]={};
      sorted.forEach((r,i)=>{ rankByMonth[m][r.cc]=i+1; });
    });

    const maxRank = Math.max(...months.flatMap(m => Object.values(rankByMonth[m])));

    const bumpCtx = document.getElementById('bumpChart');
    if(bumpCtx) {
      safeChart('bumpChart', bumpCtx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: topCodes.map((cc,i) => ({
            label: (FLAGS[cc]||'')+' '+CNAMES[cc],
            data: months.map(m => rankByMonth[m][cc] || null),
            borderColor: BUMP_COLORS[i % BUMP_COLORS.length],
            backgroundColor: BUMP_COLORS[i % BUMP_COLORS.length]+'44',
            pointBackgroundColor: BUMP_COLORS[i % BUMP_COLORS.length],
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderColor: '#000',
            pointBorderWidth: 2,
            borderWidth: 2.5,
            tension: 0.3,
            spanGaps: false
          }))
        },
        options: {
          plugins: {
            legend: { labels: { color: '#4a4a6a', font: { size: 9 }, boxWidth: 10 } },
            tooltip: { ...TT, callbacks: { label: c => `${c.dataset.label}: Rank #${c.raw}` } }
          },
          scales: {
            y: {
              reverse: true,
              min: 1,
              max: maxRank + 0.5,
              ticks: { color: '#4a4a6a', stepSize: 1, callback: v => '#'+v },
              grid: { color: '#1a1a2e' },
              title: { display: true, text: 'RANK (1 = BEST)', color: '#4a4a6a' }
            },
            x: { grid: { display: false }, ticks: { color: '#cc3366' } }
          }
        }
      });
    }
  } catch(e) { console.error('Bump chart error:', e); }

  // ── Full chronological table
  const mColor = Object.fromEntries(months.map((m,i)=>[m,monthColors[i]]));
  const sorted=[...beers].sort((a,b)=>a.monthN-b.monthN||b.rating-a.rating);
  document.getElementById('temporalTableBody').innerHTML=sorted.map(b=>`
    <tr>
      <td><span style="color:${mColor[b.month]||'#888'};font-weight:700;font-size:9px">${b.month.toUpperCase()} 2026</span></td>
      <td>${logoImg(b.beer,20)}</td>
      <td style="color:#ff6600;font-weight:600">${b.beer}${isDisplayNew(b)?'<span class="new-tag">NEW</span>':''}</td>
      <td style="color:#555;font-size:9px">${b.style}</td>
      <td>${FLAGS[b.origin]||''} ${b.origin}</td>
      <td style="color:#00aaff">${b.abv.toFixed(1)}%</td>
      <td style="color:#555">${b.method}</td>
      <td style="color:#555">${b.city}, ${b.region} · ${FLAGS[b.cc]||''} ${b.country}</td>
      <td><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span></td>
    </tr>`).join('');
}

// ══════════════════════════════════════════════════════════════
// CONTRARIAN INDEX
// ══════════════════════════════════════════════════════════════
function drawContrarian(){
  window._ciX=true;
  // Global Untappd averages — verified Feb 2026 directly from untappd.com
  const globalAvgs={
    'Grolsch':3.52,'Hertog Jan':3.58,'Coors Light':2.84,
    'Sapporo':3.51,'Ichiban':3.43,'Modelo':3.55,
    'Stella Artois':3.30,'Duvel':3.70,'Carlsberg':3.09,
    'Harp':3.42,'La Fin Du Monde':4.07,'1664':3.21,
    'Michelob Ultra':2.84,'Guinness':3.80,'Red Stripe':3.31,
    'Heineken':3.00,'Weihenstephaner':3.80,'Modelo Negra':3.60,
    'Münchner Weisse':3.80,'Munchen Dunkel':3.55,
    'Bud Light':2.30,'Budweiser':2.60,'Corona Extra':3.47,
  };

  const jwalByBeer={};
  Object.entries(STATS.brandMap).forEach(([n,rs])=>{jwalByBeer[n]={total:rs.reduce((s,v)=>s+v,0),cnt:rs.length};});

  const rows=Object.entries(jwalByBeer).filter(([n])=>globalAvgs[n]!==undefined).map(([name,v])=>{
    const jwal=v.total/v.cnt,global=globalAvgs[name],delta=jwal-global;
    return {name,jwal,global,delta};
  }).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));

  const avgDelta=avg(rows.map(r=>r.delta));
  document.getElementById('ciAvgDelta').textContent=(avgDelta>=0?'+':'')+avgDelta.toFixed(2);
  document.getElementById('ciAvgDelta').className='kpi-val '+(avgDelta>0?'up':avgDelta<0?'dn':'fl');

  const mostContr=rows.reduce((a,b)=>Math.abs(b.delta)>Math.abs(a.delta)?b:a);
  document.getElementById('ciMostContrarian').textContent=mostContr.name;
  document.getElementById('ciMostSub').textContent=`Δ${mostContr.delta>=0?'+':''}${mostContr.delta.toFixed(2)}`;

  const overrater=rows.reduce((a,b)=>b.delta>a.delta?b:a);
  document.getElementById('ciOverrater').textContent=overrater.name;
  document.getElementById('ciOverSub').textContent=`+${overrater.delta.toFixed(2)} above world`;

  const underrater=rows.reduce((a,b)=>b.delta<a.delta?b:a);
  document.getElementById('ciUnderrater').textContent=underrater.name;
  document.getElementById('ciUnderSub').textContent=`${underrater.delta.toFixed(2)} below world`;

  const sorted=rows.slice().sort((a,b)=>b.delta-a.delta);
  const contrarianCanvas=document.getElementById('contrarianChart');
  contrarianCanvas.style.height=Math.max(280,sorted.length*22)+'px';
  safeChart('contrarianChart',contrarianCanvas,{type:'bar',
    data:{labels:sorted.map(r=>r.name),datasets:[{label:'Jwal vs World (Δ)',data:sorted.map(r=>+r.delta.toFixed(2)),
      backgroundColor:sorted.map(r=>r.delta>0?'rgba(0,204,68,0.7)':'rgba(255,34,34,0.7)'),
      borderColor:sorted.map(r=>r.delta>0?'#00cc44':'#ff2222'),borderWidth:1.5}]},
    options:{indexAxis:'y',maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`Δ${c.raw>=0?'+':''}${c.raw} · Jwal: ${sorted[c.dataIndex].jwal.toFixed(2)} · World: ${sorted[c.dataIndex].global.toFixed(2)}`}}},
      scales:{x:{min:-2,max:2,grid:{color:'#1a1a1a'},ticks:{color:'#444'},title:{display:true,text:'DELTA (+ = JWAL RATES HIGHER)',color:'#555'}},
              y:{grid:{display:false},ticks:{color:'#aaa',font:{size:9}}}}}
  });

  document.getElementById('contrarianBody').innerHTML=rows.map(r=>{
    const dc=r.delta>0.3?'up':r.delta<-0.3?'dn':'fl';
    const verdict=r.delta>0.5?'OVERRATED BY WORLD':r.delta>0.2?'JWAL FAVORS':r.delta<-0.5?'JWAL HARSH':r.delta<-0.2?'JWAL BELOW':'IN AGREEMENT';
    return `<tr>
      <td>${logoImg(r.name,20)}</td>
      <td style="color:#ff6600;font-weight:600">${r.name}</td>
      <td><span class="rb ${rbC(r.jwal)}">${r.jwal.toFixed(2)}</span></td>
      <td style="color:#555">${r.global.toFixed(2)}</td>
      <td class="${dc}" style="font-weight:700;font-family:var(--mono)">${r.delta>=0?'+':''}${r.delta.toFixed(2)}</td>
      <td><span style="font-size:8px;padding:1px 6px;border:1px solid;color:${r.delta>0.2?'#00cc44':r.delta<-0.2?'#ff2222':'#ffaa00'};border-color:${r.delta>0.2?'#00cc44':r.delta<-0.2?'#ff2222':'#ffaa00'}">${verdict}</span></td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// IPO WATCHLIST
// ══════════════════════════════════════════════════════════════
function drawIPO(){
  window._ipoD=true;
  try {

  const jwalStyleAvg={};
  Object.entries(STATS.styleMap).forEach(([s,v])=>jwalStyleAvg[s]=v.t/v.c);
  const jwalCountryAvg={};
  Object.entries(STATS.countryMap).forEach(([c,v])=>jwalCountryAvg[c]=v.t/v.c);
  const jwalGlobal=STATS.globalAvg;

  // Analyst target formula:
  // 50% Untappd global avg (market consensus)
  // 25% JWAL style-adjusted expectation (his historical avg for that style, offset from his global)
  // 15% JWAL country-adjusted expectation (his bias for that country of origin)
  // 10% JWAL base avg (anchor)
  // + serving method adjustment
  function analystTarget(beer,style,origin,untappdRating,defaultMethod='Bottle'){
    const styleOffset=(jwalStyleAvg[style]||jwalGlobal)-jwalGlobal;
    const countryOffset=(jwalCountryAvg[origin]||jwalGlobal)-jwalGlobal;
    const methodAdj=defaultMethod==='Draft'?0.10:defaultMethod==='Nitro'?0.05:defaultMethod==='Can'?-0.10:0;
    const target=(untappdRating*0.50)+((jwalGlobal+styleOffset)*0.25)+((jwalGlobal+countryOffset)*0.15)+(jwalGlobal*0.10)+methodAdj;
    return Math.min(5.0,Math.max(1.0,target));
  }

  // 26 beers on watchlist (6 user-specified + 9 Claude picks + 5 additional + 6 pipeline promotions)
  const watchlist=[
    // User-specified
    {beer:'Moretti',         style:'Pilsner-Other',         origin:'IT', abv:4.6, region:'Udine, Friuli',         untappd:3.58, method:'Bottle'},
    {beer:'Peroni',          style:'Lager-Pale',            origin:'IT', abv:5.1, region:'Rome, Lazio',           untappd:3.52, method:'Bottle'},
    {beer:'Blue Moon',       style:'Wheat Beer-Hefeweizen', origin:'US', abv:5.4, region:'Denver, Colorado',      untappd:3.56, method:'Draft'},
    {beer:'Miller Lite',     style:'Lager-American Light',  origin:'US', abv:4.2, region:'Milwaukee, Wisconsin',  untappd:2.51, method:'Can'},
    {beer:'Estrella Damm',   style:'Lager-Pale',            origin:'ES', abv:5.4, region:'Barcelona, Catalonia',  untappd:3.61, method:'Bottle'},
    {beer:'Estrella Galicia',style:'Lager-Helles',          origin:'ES', abv:5.5, region:'A Coruña, Galicia',     untappd:3.65, method:'Bottle'},
    // Claude picks — one per country not yet covered
    {beer:'Brahma',          style:'Lager-Pale',            origin:'BR', abv:4.8, region:'São Paulo, SP',         untappd:3.18, method:'Can'},
    {beer:'Quilmes',         style:'Lager-Pale',            origin:'AR', abv:4.9, region:'Buenos Aires, BA',        untappd:3.22, method:'Bottle'},
    {beer:'Tsingtao',        style:'Lager-Pale',            origin:'CN', abv:4.7, region:'Qingdao, Shandong',     untappd:3.29, method:'Bottle'},
    {beer:'Castle Lager',    style:'Lager-Pale',            origin:'ZA', abv:5.0, region:'Johannesburg, Gauteng', untappd:3.18, method:'Can'},
    {beer:'Pilsner Urquell', style:'Pilsner-Other',         origin:'CZ', abv:4.4, region:'Pilsen, Bohemia',          untappd:3.80, method:'Bottle'},
    {beer:'Super Bock',      style:'Pilsner-Other',         origin:'PT', abv:5.2, region:'Porto, Norte',              untappd:3.41, method:'Bottle'},
    {beer:'Mythos',          style:'Lager-Pale',            origin:'GR', abv:4.7, region:'Athens, Attica',        untappd:3.31, method:'Bottle'},
    {beer:'Victoria Bitter', style:'Lager-Pale',            origin:'AU', abv:4.9, region:'Melbourne, Victoria',   untappd:3.12, method:'Can'},
    {beer:'Norrlands Guld',  style:'Lager-Pale',            origin:'SE', abv:5.3, region:'Stockholm',             untappd:3.28, method:'Can'},
    // Additional picks
    {beer:'Asahi Super Dry', style:'Lager-Pale',            origin:'JP', abv:5.0, region:'Tokyo',                 untappd:3.60, method:'Bottle'},
    {beer:'Hoegaarden',      style:'Witbier',               origin:'BE', abv:4.9, region:'Hoegaarden',            untappd:3.72, method:'Bottle'},
    {beer:'Kronenbourg',     style:'Lager-Pale',            origin:'FR', abv:5.0, region:'Obernai, Alsace',       untappd:3.30, method:'Can'},
    {beer:'Newcastle Brown', style:'Brown Ale-English',     origin:'GB', abv:4.7, region:'Tadcaster, Yorkshire',  untappd:3.28, method:'Bottle'},
    {beer:'Ringnes',         style:'Lager-Pale',            origin:'NO', abv:4.7, region:'Oslo',                  untappd:3.10, method:'Can'},
    // Pipeline promotions
    {beer:'Żywiec',          style:'Pilsner-Other',         origin:'PL', abv:5.6, region:'Żywiec, Silesia',      untappd:3.35, method:'Bottle'},
    {beer:'Tyskie',          style:'Pilsner-Other',         origin:'PL', abv:5.6, region:'Tychy, Silesia',       untappd:3.28, method:'Can'},
    {beer:'Chimay Blue',     style:'Belgian Strong Dark Ale',origin:'BE',abv:9.0, region:'Chimay, Hainaut',      untappd:4.05, method:'Bottle'},
    {beer:'Leffe Blonde',    style:'Abbey Ale-Blonde',      origin:'BE', abv:6.6, region:'Leuven',               untappd:3.75, method:'Bottle'},
    {beer:'Coopers Pale Ale',style:'Pale Ale-American',     origin:'AU', abv:4.5, region:'Adelaide, SA',         untappd:3.72, method:'Bottle'},
    {beer:'Sam Adams',       style:'Lager-Vienna',          origin:'US', abv:5.0, region:'Boston, MA',           untappd:3.48, method:'Bottle'},
  ];

  const reviewed=new Set(beers.map(b=>b.beer));
  const pending=watchlist.filter(w=>!reviewed.has(w.beer));
  const priced=watchlist.filter(w=>reviewed.has(w.beer));

  document.getElementById('ipo-pending').textContent=pending.length;
  document.getElementById('ipo-priced').textContent=priced.length;
  document.getElementById('ipo-watch-count').textContent=pending.length+' BEER'+(pending.length!==1?'S':'')+' QUEUED';

  const allTargets=watchlist.map(w=>analystTarget(w.beer,w.style,w.origin,w.untappd,w.method));
  document.getElementById('ipo-avg-analyst').textContent=(allTargets.reduce((s,v)=>s+v,0)/allTargets.length).toFixed(2);
  document.getElementById('ipo-avg-market').textContent=(watchlist.reduce((s,w)=>s+w.untappd,0)/watchlist.length).toFixed(2);

  document.getElementById('ipoWatchBody').innerHTML=pending.map(w=>{
    const target=analystTarget(w.beer,w.style,w.origin,w.untappd,w.method);
    const upside=target-w.untappd;
    const uClass=upside>0.2?'up':upside<-0.2?'dn':'fl';
    const signal=target>=4.0?'STRONG BUY':target>=3.5?'BUY':target>=3.0?'HOLD':target>=2.5?'SELL':'STRONG SELL';
    const sigColor=target>=4.0?'#00cc44':target>=3.5?'#aacc00':target>=3.0?'#ffaa00':target>=2.5?'#ff6600':'#ff2222';
    return `<tr>
      <td>${logoImg(w.beer,24)}</td>
      <td style="color:#ff6600;font-weight:600">${w.beer}<br><span style="color:#444;font-size:9px;font-weight:400">${w.style}</span></td>
      <td>${FLAGS[w.origin]||''} <span style="color:#888">${w.origin}</span></td>
      <td style="color:#00aaff">${w.abv.toFixed(1)}%</td>
      <td style="color:#bb44ff;font-family:var(--mono);font-weight:700">${w.untappd.toFixed(2)}</td>
      <td style="color:#00aaff;font-family:var(--mono);font-weight:700">${target.toFixed(2)}</td>
      <td class="${uClass}" style="font-family:var(--mono);font-weight:700">${upside>=0?'+':''}${upside.toFixed(2)}</td>
      <td><span style="font-size:8px;padding:2px 7px;border:1px solid ${sigColor};color:${sigColor};font-weight:700;letter-spacing:1px">${signal}</span></td>
    </tr>`;
  }).join('');

  if(priced.length===0){
    document.getElementById('ipoPricedBody').innerHTML='<tr><td colspan="9" style="color:#333;text-align:center;padding:20px">NO BEERS PRICED YET — WATCHLIST PENDING</td></tr>';
    document.getElementById('ipo-priced-count').textContent='0 BEERS';
  } else {
    document.getElementById('ipo-priced-count').textContent=priced.length+' BEER'+(priced.length!==1?'S':'');
    document.getElementById('ipoPricedBody').innerHTML=priced.map(w=>{
      const target=analystTarget(w.beer,w.style,w.origin,w.untappd,w.method);
      const revd=beers.filter(b=>b.beer===w.beer);
      const jwalPrice=avg(revd.map(b=>b.rating));
      const vsAnalyst=jwalPrice-target;
      const vsMkt=jwalPrice-w.untappd;
      const verdict=vsAnalyst>0.3?'BEAT ANALYST':vsAnalyst>-0.3?'IN LINE':'MISSED ANALYST';
      const vColor=vsAnalyst>0.3?'#00cc44':vsAnalyst<-0.3?'#ff2222':'#ffaa00';
      return `<tr>
        <td>${logoImg(w.beer,24)}</td>
        <td style="color:#ff6600;font-weight:600">${w.beer}<br><span style="color:#444;font-size:9px;font-weight:400">${w.style}</span></td>
        <td>${FLAGS[w.origin]||''} <span style="color:#888">${w.origin}</span></td>
        <td style="color:#bb44ff;font-family:var(--mono)">${w.untappd.toFixed(2)}</td>
        <td style="color:#00aaff;font-family:var(--mono)">${target.toFixed(2)}</td>
        <td><span class="rb ${rbC(jwalPrice)}">${jwalPrice.toFixed(2)}</span></td>
        <td class="${vsAnalyst>=0?'up':'dn'}" style="font-family:var(--mono)">${vsAnalyst>=0?'+':''}${vsAnalyst.toFixed(2)}</td>
        <td class="${vsMkt>=0?'up':'dn'}" style="font-family:var(--mono)">${vsMkt>=0?'+':''}${vsMkt.toFixed(2)}</td>
        <td><span style="font-size:8px;padding:1px 6px;border:1px solid ${vColor};color:${vColor}">${verdict}</span></td>
      </tr>`;
    }).join('');
  }

  // ── RECOMMENDATIONS
  if(priced.length>0){
    const coveredBeerNames=new Set([...beers.map(b=>b.beer),...watchlist.map(w=>w.beer)]);
    const coveredOrigins=new Set([...beers.map(b=>b.origin),...watchlist.map(w=>w.origin)]);
    const coveredStyles=new Set([...beers.map(b=>b.style),...watchlist.map(w=>w.style)]);
    const candidates=[
      {beer:'Leffe Blonde',     style:'Abbey Ale-Blonde',         origin:'BE',abv:6.6,region:'Leuven',              untappd:3.75,method:'Bottle'},
      {beer:'Chimay Blue',      style:'Belgian Strong Dark Ale',  origin:'BE',abv:9.0,region:'Chimay, Hainaut',     untappd:4.05,method:'Bottle'},
      {beer:'Paulaner Hefe',    style:'Wheat Beer-Hefeweizen',    origin:'DE',abv:5.5,region:'Munich',              untappd:3.87,method:'Bottle'},
      {beer:'Augustiner Helles',style:'Lager-Helles',             origin:'DE',abv:5.2,region:'Munich',              untappd:4.10,method:'Draft'},
      {beer:'Nastro Azzurro',   style:'Lager-Pale',               origin:'IT',abv:5.1,region:'Rome, Lazio',         untappd:3.56,method:'Bottle'},
      {beer:'Sam Adams',        style:'Lager-Vienna',             origin:'US',abv:5.0,region:'Boston, MA',          untappd:3.48,method:'Bottle'},
      {beer:"Smithwick's",      style:'Irish Red Ale',            origin:'IE',abv:4.5,region:'Kilkenny',            untappd:3.45,method:'Draft'},
      {beer:"Tennent's",        style:'Lager-Pale',               origin:'GB',abv:4.0,region:'Glasgow, Scotland',   untappd:2.95,method:'Can'},
      {beer:'Tyskie',           style:'Pilsner-Other',            origin:'PL',abv:5.6,region:'Tychy, Silesia',      untappd:3.28,method:'Can'},
      {beer:'Żywiec',           style:'Pilsner-Other',            origin:'PL',abv:5.6,region:'Żywiec, Silesia',     untappd:3.35,method:'Bottle'},
      {beer:'Orion',            style:'Lager-Pale',               origin:'JP',abv:5.0,region:'Naha, Okinawa',       untappd:3.42,method:'Can'},
      {beer:'Menabrea',         style:'Lager-Pale',               origin:'IT',abv:4.8,region:'Biella, Piedmont',    untappd:3.55,method:'Bottle'},
      {beer:'Tuborg',           style:'Pilsner-Other',            origin:'DK',abv:4.6,region:'Copenhagen',          untappd:3.10,method:'Can'},
      {beer:'Sol',              style:'Lager-Mexican',            origin:'MX',abv:4.5,region:'Mexico City',         untappd:3.15,method:'Bottle'},
      {beer:'Coopers Pale Ale', style:'Pale Ale-American',        origin:'AU',abv:4.5,region:'Adelaide, SA',        untappd:3.72,method:'Bottle'},
      {beer:'Singha',           style:'Lager-Pale',              origin:'TH',abv:5.0,region:'Bangkok',             untappd:3.25,method:'Bottle'},
      {beer:'Tiger Beer',       style:'Lager-Pale',              origin:'SG',abv:5.0,region:'Singapore',           untappd:3.18,method:'Can'},
      {beer:'Erdinger Weissbier',style:'Wheat Beer-Hefeweizen',  origin:'DE',abv:5.3,region:'Erding, Bavaria',     untappd:3.78,method:'Bottle'},
    ];
    const recs=candidates
      .filter(c=>!coveredBeerNames.has(c.beer))
      .sort((a,b)=>{
        const aS=(!coveredOrigins.has(a.origin)?2:0)+(!coveredStyles.has(a.style)?1:0);
        const bS=(!coveredOrigins.has(b.origin)?2:0)+(!coveredStyles.has(b.style)?1:0);
        return bS!==aS?bS-aS:b.untappd-a.untappd;
      })
      .slice(0,priced.length);
    document.getElementById('ipoRecsPanel').style.display='';
    document.getElementById('ipo-recs-count').textContent=recs.length+' SLOT'+(recs.length!==1?'S':'');
    document.getElementById('ipoRecsBody').innerHTML=recs.map(c=>{
      const isNewMkt=!coveredOrigins.has(c.origin);
      const isNewStyle=!coveredStyles.has(c.style);
      const [tag,tagColor]=isNewMkt?['NEW MARKET','#00cc44']:isNewStyle?['NEW STYLE','#00aaff']:c.untappd>=3.8?['HIGH CONSENSUS','#bb44ff']:['SIMILAR PROFILE','#555'];
      const target=analystTarget(c.beer,c.style,c.origin,c.untappd,c.method);
      const upside=target-c.untappd;
      return `<tr>
        <td>${logoImg(c.beer,24)}</td>
        <td style="color:#ff6600;font-weight:600">${c.beer}<br><span style="color:#444;font-size:9px;font-weight:400">${c.style}</span></td>
        <td>${FLAGS[c.origin]||''} <span style="color:#888">${c.origin}</span></td>
        <td style="color:#00aaff">${c.abv.toFixed(1)}%</td>
        <td style="color:#bb44ff;font-family:var(--mono)">${c.untappd.toFixed(2)}</td>
        <td style="color:#00aaff;font-family:var(--mono);font-weight:700">${target.toFixed(2)}</td>
        <td><span style="font-size:8px;padding:2px 7px;border:1px solid ${tagColor};color:${tagColor};font-weight:700;letter-spacing:1px">${tag}</span></td>
      </tr>`;
    }).join('');
  }

  } catch(e){ console.error('IPO error:',e); }
}

// ══════════════════════════════════════════════════════════════
// FUTURES
// ══════════════════════════════════════════════════════════════
function drawFutures(){
  window._ftD=true;
  try {

  const untappdFt={'Bud Light':2.30,'Coors Light':2.84,'Heineken':3.00,'Stella Artois':3.30,'Corona Extra':3.47,'Modelo':3.55,'Miller Lite':2.51,'Budweiser':2.60,'Michelob Ultra':2.84,'Guinness':3.80};
  const futuresBeers=['Bud Light','Coors Light','Heineken','Stella Artois','Corona Extra','Modelo','Miller Lite','Budweiser','Michelob Ultra','Guinness'];

  // Futures price formula:
  // 55% JWAL historical weighted avg
  // 15% most recent review (momentum)
  // 30% Untappd global avg (mean reversion)
  // + dominant serving method adjustment
  function futuresPrice(beerName){
    const history=beers.filter(b=>b.beer===beerName);
    if(!history.length) return null;
    const jwalAvg=avg(history.map(b=>b.rating));
    const untappd=untappdFt[beerName]||jwalAvg;
    const recent=history[history.length-1].rating;
    const weighted=jwalAvg*0.55+recent*0.15+untappd*0.30;
    const methodCount={};
    history.forEach(b=>{methodCount[b.method]=(methodCount[b.method]||0)+1;});
    const topMethod=Object.entries(methodCount).sort((a,b)=>b[1]-a[1])[0][0];
    const mAdj=topMethod==='Draft'?0.05:topMethod==='Can'?-0.05:0;
    return Math.min(5.0,Math.max(1.0,weighted+mAdj));
  }

  // Detect executed contracts: beers with 2+ reviews (prior reviews set the price, latest = execution)
  const executed=[];
  futuresBeers.forEach(name=>{
    const history=beers.filter(b=>b.beer===name);
    if(history.length>1){
      const prior=history.slice(0,-1);
      const last=history[history.length-1];
      const priorAvg=avg(prior.map(b=>b.rating));
      const untappd=untappdFt[name]||priorAvg;
      const recent=prior[prior.length-1].rating;
      const ft=Math.min(5.0,Math.max(1.0,priorAvg*0.55+recent*0.15+untappd*0.30));
      executed.push({name,date:last.month+' '+last.year,futures:ft,actual:last.rating,spread:last.rating-ft});
    }
  });

  const beats=executed.filter(e=>e.spread>=0).length;
  const misses=executed.filter(e=>e.spread<0).length;

  document.getElementById('ft-contracts').textContent=futuresBeers.length;
  document.getElementById('ft-executed').textContent=executed.length;
  document.getElementById('ft-beat').textContent=beats;
  document.getElementById('ft-miss').textContent=misses;
  document.getElementById('ft-exec-count').textContent=executed.length+' EXECUTED';

  document.getElementById('ftContractBody').innerHTML=futuresBeers.map(name=>{
    const history=beers.filter(b=>b.beer===name);
    const ft=futuresPrice(name);
    const untappd=untappdFt[name]||0;

    if(!history.length){
      return `<tr>
        <td>${logoImg(name,22)}</td>
        <td style="color:#ff6600;font-weight:600">${name}</td>
        <td style="color:#333;text-align:center">0</td>
        <td style="color:#333">—</td>
        <td style="color:#333">—</td>
        <td colspan="2" style="color:#333;font-size:9px">NO REVIEW DATA YET</td>
        <td></td>
      </tr>`;
    }

    const jwalAvg=avg(history.map(b=>b.rating));
    const ratings=history.map(b=>b.rating);
    const hi=Math.max(...ratings), lo=Math.min(...ratings);
    const volatility=std(ratings);
    const volLabel=volatility<0.2?'LOW':volatility<0.4?'MOD':'HIGH';
    const volClass=volatility<0.2?'up':volatility<0.4?'fl':'dn';
    const signal=ft>=4.0?'STRONG BUY':ft>=3.5?'BUY':ft>=3.0?'HOLD':ft>=2.5?'SELL':'STRONG SELL';
    const sigColor=ft>=4.0?'#00cc44':ft>=3.5?'#aacc00':ft>=3.0?'#ffaa00':ft>=2.5?'#ff6600':'#ff2222';
    return `<tr>
      <td>${logoImg(name,22)}</td>
      <td style="color:#ff6600;font-weight:600">${name}</td>
      <td style="text-align:center">${history.length}</td>
      <td><span class="rb ${rbC(jwalAvg)}">${jwalAvg.toFixed(2)}</span></td>
      <td style="color:#ff6600;font-family:var(--mono);font-weight:700">${ft.toFixed(2)}</td>
      <td style="font-family:var(--mono);font-size:9px"><span class="up">${hi.toFixed(2)}</span>/<span class="dn">${lo.toFixed(2)}</span></td>
      <td class="${volClass}" style="font-size:9px">${volLabel} <span style="font-size:8px">(σ${volatility.toFixed(2)})</span></td>
      <td><span style="font-size:8px;padding:2px 6px;border:1px solid ${sigColor};color:${sigColor};font-weight:700">${signal}</span></td>
    </tr>`;
  }).join('');

  if(executed.length===0){
    document.getElementById('ftExecBody').innerHTML='<tr><td colspan="7" style="color:#333;text-align:center;padding:20px">NO CONTRACTS EXECUTED — FUTURES PRICE LOCKS ON NEXT REVIEW</td></tr>';
  } else {
    document.getElementById('ftExecBody').innerHTML=executed.map(e=>{
      const dc=e.spread>=0?'up':'dn';
      return `<tr>
        <td>${logoImg(e.name,20)}</td>
        <td style="color:#ff6600;font-weight:600">${e.name}</td>
        <td style="color:#555">${e.date}</td>
        <td style="color:#ff6600;font-family:var(--mono);font-weight:700">${e.futures.toFixed(2)}</td>
        <td><span class="rb ${rbC(e.actual)}">${e.actual.toFixed(2)}</span></td>
        <td class="${dc}" style="font-family:var(--mono);font-weight:700">${e.spread>=0?'+':''}${e.spread.toFixed(2)}</td>
        <td><span style="font-size:8px;padding:1px 7px;border:1px solid;color:${e.spread>=0?'#00cc44':'#ff2222'};border-color:${e.spread>=0?'#00cc44':'#ff2222'}">${e.spread>=0?'▲ BEAT FUTURES':'▼ MISSED FUTURES'}</span></td>
      </tr>`;
    }).join('');
  }

  } catch(e){ console.error('Futures error:',e); }
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
  const criticalIds = ['ticker-scroll','clock-time','clock-date','mb-clock','sb-time',
    'beerBody','beerGrid','styleChart','scatterChart','brewedMap','drunkMap',
    'ipoWatchBody','ipoPricedBody','ftContractBody','ftExecBody'];
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

  // Update status bar dot color if there are errors
  if(errors.length) {
    const dot = document.querySelector('.sb-dot');
    if(dot) dot.style.background='#ff2222';
  } else if(warnings.length) {
    const dot = document.querySelector('.sb-dot');
    if(dot) dot.style.background='#ffaa00';
  }
})();

function drawAudit(){
  window._auditD=true;
  try {
    const r=window._auditResults;
    if(!r){ document.getElementById('auditBody').innerHTML='<p style="color:#555">No results.</p>'; return; }
    const statusColor=r.errors.length?'#ff2222':r.warnings.length?'#ffaa00':'#00cc44';
    document.getElementById('audit-status').textContent=r.status;
    document.getElementById('audit-status').style.color=statusColor;
    document.getElementById('audit-pass').textContent=r.passes.length;
    document.getElementById('audit-warn').textContent=r.warnings.length;
    document.getElementById('audit-fail').textContent=r.errors.length;
    document.getElementById('audit-ts').textContent='Last run: '+r.ts;

    const mkRows=(arr,cls,icon)=>arr.map(msg=>`
      <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid #1a1a1a">
        <span style="color:${cls};font-size:10px;flex-shrink:0;width:12px">${icon}</span>
        <span style="font-size:9px;color:${cls};font-family:var(--mono);line-height:1.5">${msg.replace(/^[✗⚠✓]\s*/,'')}</span>
      </div>`).join('');

    document.getElementById('auditBody').innerHTML=`
      ${r.errors.length?`<div style="margin-bottom:10px"><div style="font-size:9px;font-weight:700;color:#ff2222;letter-spacing:2px;margin-bottom:4px">ERRORS (${r.errors.length})</div>${mkRows(r.errors,'#ff2222','✗')}</div>`:''}
      ${r.warnings.length?`<div style="margin-bottom:10px"><div style="font-size:9px;font-weight:700;color:#ffaa00;letter-spacing:2px;margin-bottom:4px">WARNINGS (${r.warnings.length})</div>${mkRows(r.warnings,'#ffaa00','⚠')}</div>`:''}
      <div><div style="font-size:9px;font-weight:700;color:#00cc44;letter-spacing:2px;margin-bottom:4px">PASSED (${r.passes.length})</div>${mkRows(r.passes,'#00cc44','✓')}</div>`;
  } catch(e){ console.error('Audit panel error:',e); }
}

// ══════════════════════════════════════════════════════════════
// SCANLINE TOGGLE
// ══════════════════════════════════════════════════════════════
function toggleScanlines(){
  document.body.classList.toggle('no-scanlines');
  const on=!document.body.classList.contains('no-scanlines');
  document.getElementById('scanline-status').textContent=on?'ON':'OFF';
  try{localStorage.setItem('brewScanlines',on?'1':'0');}catch(e){}
}
(function(){
  try{
    if(localStorage.getItem('brewScanlines')==='0'){
      document.body.classList.add('no-scanlines');
      const el=document.getElementById('scanline-status');
      if(el) el.textContent='OFF';
    }
  }catch(e){}
})();

// ══════════════════════════════════════════════════════════════
// COMMAND PALETTE (Ctrl+K / Cmd+K)
// ══════════════════════════════════════════════════════════════
(function initCommandPalette(){
  const TABS=[
    {id:'overview',label:'OVERVIEW',icon:'◈',key:'F1'},
    {id:'beers',label:'ALL BEERS',icon:'◉',key:'F2'},
    {id:'rankings',label:'RANKINGS',icon:'▲',key:'F3'},
    {id:'countries',label:'GEO / COUNTRY',icon:'◎',key:'F4'},
    {id:'city',label:'CITIES',icon:'▣',key:'F5'},
    {id:'insights',label:'INSIGHTS',icon:'◈',key:'F6'},
    {id:'temporal',label:'TEMPORAL',icon:'◷',key:'F7'},
    {id:'mapdrunk',label:'MAP CONSUMED',icon:'◉',key:'F8'},
    {id:'mapbrewed',label:'MAP BREWERY',icon:'◎',key:'F9'},
    {id:'language',label:'LANGUAGE',icon:'◑',key:'F10'},
    {id:'contrarian',label:'CONTRARIAN IDX',icon:'◆',key:'G1'},
    {id:'ipo',label:'IPO / FUTURES',icon:'◈',key:'G2'},
    {id:'audit',label:'DATA AUDIT',icon:'⬡',key:'G3'},
    {id:'choropleth',label:'CHOROPLETH MAP',icon:'◎',key:'G4'},
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
        <div class="cmd-item" data-tab="${t.id}" data-action="tab">
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
          <div class="cmd-item" data-beer="${b.beer.replace(/"/g,'&quot;')}" data-action="beer">
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
          <div class="cmd-item" data-brewery="${b.name.replace(/"/g,'&quot;')}" data-action="brewery">
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
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',detectRetina:true}).addTo(_drawerMap);
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

function showBreweryPicker(matches,event,headerText){
  let old=document.getElementById('choro-brewery-picker');
  if(old) old.remove();
  const picker=document.createElement('div');
  picker.id='choro-brewery-picker';
  picker.style.cssText='position:fixed;z-index:3500;background:var(--panel);border:1px solid var(--orange);padding:6px 0;font-family:var(--mono);font-size:10px;box-shadow:0 0 20px rgba(255,102,0,0.3);max-height:260px;overflow-y:auto;min-width:180px;';
  picker.style.left=(event.clientX+10)+'px';
  picker.style.top=(event.clientY-10)+'px';
  const hdr=document.createElement('div');
  hdr.style.cssText='padding:4px 10px 6px;color:var(--orange);font-size:8px;letter-spacing:1px;border-bottom:1px solid var(--border2);margin-bottom:2px;';
  hdr.textContent=headerText||'SELECT BREWERY';
  picker.appendChild(hdr);
  matches.forEach(br=>{
    const row=document.createElement('div');
    row.style.cssText='padding:5px 10px;color:var(--white);cursor:pointer;transition:background 0.1s;';
    const avgR=avg(br.ratings);
    row.innerHTML=`${br.name} <span class="rb ${rbC(avgR)}" style="font-size:9px;margin-left:4px">${avgR.toFixed(2)}</span>`;
    row.addEventListener('mouseenter',()=>row.style.background='rgba(255,102,0,0.15)');
    row.addEventListener('mouseleave',()=>row.style.background='none');
    row.addEventListener('click',e=>{e.stopPropagation();picker.remove();openBreweryDrawer(br.name);});
    picker.appendChild(row);
  });
  document.body.appendChild(picker);
  const closePicker=ev=>{if(!picker.contains(ev.target)){picker.remove();document.removeEventListener('click',closePicker,true);}};
  setTimeout(()=>document.addEventListener('click',closePicker,true),10);
}

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
      // Apply opacity based on count — logarithmic scale for better visual spread
      const op=Math.min(1,0.45+0.55*(1-1/(1+opacity*0.5)));
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
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
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
            const brCount=a2?breweries.filter(b=>b.cc===a2).length:0;
            tooltip.innerHTML=cd
              ? `<span style="color:var(--orange)">${FLAGS[a2]||''} ${CNAMES[a2]||a2}</span><br>Avg: <span style="color:var(--cyan)">${cd.avg.toFixed(2)}</span> · ${cd.count} review${cd.count>1?'s':''} · ${brCount} brewer${brCount>1?'ies':'y'}<br>Best: ${cd.best?cd.best.beer:'—'}${brCount>1?'<br><span style="color:var(--dim);font-size:8px">CLICK TO SELECT BREWERY</span>':''}`
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
            if(!a2) return;
            const matches=breweries.filter(b=>b.cc===a2);
            if(matches.length===0) return;
            if(matches.length===1){ openBreweryDrawer(matches[0].name); return; }
            showBreweryPicker(matches,event,(FLAGS[a2]||'')+' '+(CNAMES[a2]||a2)+' — SELECT BREWERY');
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
      tbody.innerHTML=ranked.map(([cc,d])=>{
        const brs=breweries.filter(b=>b.cc===cc);
        const brNames=brs.map(b=>b.name).join(', ');
        return `
        <tr style="cursor:pointer" data-cc="${cc}">
          <td style="font-weight:600">${FLAGS[cc]||''} ${CNAMES[cc]||cc}</td>
          <td>${d.count}</td>
          <td><span class="rb ${rbC(d.avg)}">${d.avg.toFixed(2)}</span></td>
          <td style="color:var(--white);font-size:9px" title="${brNames}">${d.best?d.best.beer:'—'}</td>
          <td style="min-width:80px">
            <div class="bb-bar-bg" style="width:${Math.round(d.count/maxCount*120)}px">
              <div class="bb-bar-fill" style="width:${Math.round(d.count/maxCount*100)}%;background:${choroColor(d.avg,d.count)}"></div>
            </div>
          </td>
        </tr>`;}).join('');
      // Event delegation for choropleth table rows
      tbody.addEventListener('click',function(event){
        const tr=event.target.closest('tr[data-cc]');
        if(!tr) return;
        const cc=tr.dataset.cc;
        const matches=breweries.filter(b=>b.cc===cc);
        if(matches.length===1){ openBreweryDrawer(matches[0].name); return; }
        if(matches.length>1) showBreweryPicker(matches,event,'SELECT BREWERY');
      });
    }
  } catch(e){ console.error('Choropleth error:',e); }
}

// ══════════════════════════════════════════════════════════════
// KPI ANIMATED COUNTERS + SPARKLINES
// ══════════════════════════════════════════════════════════════
(function initKPISparklines(){
  try {
    // Compute per-month data for sparklines
    const {months,byMonth} = getMonthlyData();
    if(months.length<2) return; // need 2+ months for sparklines

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
      safeChart(id,canvas,{
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
    animate('hdr-top',topBeer.rating,2);
    animate('hdr-avg',STATS.globalAvg,2);
    animate('hdr-low',lowBeer.rating,2);
  } catch(e){ console.error('KPI sparklines error:',e); }
})();

// ══════════════════════════════════════════════════════════════
// EVENT DELEGATION (replaces inline onclick handlers)
// ══════════════════════════════════════════════════════════════
try {
  // Menu bar tab navigation
  document.getElementById('menubar').addEventListener('click', function(e) {
    const item = e.target.closest('.mb-item[data-tab]');
    if (item) showTab(item.dataset.tab, item);
  });

  // Sidebar tab navigation
  document.getElementById('sidebar').addEventListener('click', function(e) {
    const item = e.target.closest('.nav-item[data-tab]');
    if (item) showTab(item.dataset.tab, item);
  });

  // Beer modal — close on backdrop click
  document.getElementById('beerModal').addEventListener('click', function(e) {
    if (e.target === this) closeBeerModal();
  });

  // Beer modal — close button
  document.getElementById('beerModalClose').addEventListener('click', closeBeerModal);

  // Command palette — close on backdrop click
  document.getElementById('cmd-palette').addEventListener('click', function(e) {
    if (e.target === this) closePalette();
  });

  // Brewery drawer — close button
  document.getElementById('drawer-close').addEventListener('click', closeBreweryDrawer);

  // Scanline toggle
  document.getElementById('scanline-toggle').addEventListener('click', toggleScanlines);

  // Beer table rows
  document.getElementById('beerBody').addEventListener('click', function(e) {
    const row = e.target.closest('tr[data-beer]');
    if (row) openBeerModal(row.dataset.beer);
  });

  // Beer grid cards
  document.getElementById('beerGrid').addEventListener('click', function(e) {
    const card = e.target.closest('.beer-card[data-beer]');
    if (card) openBeerModal(card.dataset.beer);
  });

  // Brewery table clickable names
  document.getElementById('brewedTbody').addEventListener('click', function(e) {
    const el = e.target.closest('.brewery-clickable[data-brewery]');
    if (el) { openBreweryDrawer(el.dataset.brewery); e.stopPropagation(); }
  });

  // Command palette results
  document.getElementById('cmd-results').addEventListener('click', function(e) {
    const item = e.target.closest('.cmd-item');
    if (!item) return;
    if (item.dataset.action === 'beer') { openBeerModal(item.dataset.beer); closePalette(); }
    else if (item.dataset.action === 'brewery') { openBreweryDrawer(item.dataset.brewery); closePalette(); }
    else if (item.dataset.action === 'tab') { showTab(item.dataset.tab); closePalette(); }
  });
} catch(e) { console.error('Event delegation setup error:', e); }
