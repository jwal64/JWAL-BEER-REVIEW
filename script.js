// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const FLAGS={ES:"🇪🇸",DE:"🇩🇪",IE:"🇮🇪",JM:"🇯🇲",BE:"🇧🇪",JP:"🇯🇵",NL:"🇳🇱",FR:"🇫🇷",MX:"🇲🇽",CA:"🇨🇦",DK:"🇩🇰",US:"🇺🇸",IT:"🇮🇹",BR:"🇧🇷",CN:"🇨🇳",ZA:"🇿🇦",GR:"🇬🇷",AU:"🇦🇺",SE:"🇸🇪",CZ:"🇨🇿",PT:"🇵🇹",AR:"🇦🇷",GB:"🇬🇧",NO:"🇳🇴",PL:"🇵🇱",TH:"🇹🇭",SG:"🇸🇬",AT:"🇦🇹",PR:"🇵🇷",LB:"🇱🇧"};
const CNAMES={DE:"Germany",IE:"Ireland",JM:"Jamaica",BE:"Belgium",JP:"Japan",NL:"Netherlands",FR:"France",MX:"Mexico",CA:"Canada",DK:"Denmark",US:"USA",IT:"Italy",ES:"Spain",BR:"Brazil",CN:"China",ZA:"South Africa",GR:"Greece",AU:"Australia",SE:"Sweden",CZ:"Czech Republic",PT:"Portugal",AR:"Argentina",GB:"Great Britain",NO:"Norway",PL:"Poland",TH:"Thailand",SG:"Singapore",AT:"Austria",PR:"Puerto Rico",LB:"Lebanon"};

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
  {beer:"Grolsch",         style:"Pilsner",            origin:"NL",abv:5.0,method:"Bottle",city:"Hengelo",     region:"Overijssel",      country:"Netherlands", cc:"NL", rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Hertog Jan",      style:"Pilsner",            origin:"NL",abv:5.1,method:"Bottle",city:"Hengelo",     region:"Overijssel",      country:"Netherlands", cc:"NL", rating:2.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Coors Light",     style:"Lager",           origin:"US",abv:4.2,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Sapporo Premium", style:"Lager",               origin:"JP",abv:4.9,method:"Bottle",city:"Hartsdale",   region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Kirin Ichiban",   style:"Lager",               origin:"JP",abv:5.0,method:"Bottle",city:"Hartsdale",   region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Modelo Especial", style:"Lager",            origin:"MX",abv:4.5,method:"Bottle",city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Stella Artois",   style:"Lager",               origin:"BE",abv:5.0,method:"Bottle",city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Duvel",           style:"Belgian Ale",origin:"BE",abv:8.5,method:"Bottle",city:"Amsterdam",   region:"Noord-Holland",   country:"Netherlands", cc:"NL", rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Carlsberg",       style:"Pilsner",            origin:"DK",abv:5.0,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Harp Lager",      style:"Lager",               origin:"IE",abv:4.5,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Kronenbourg 1664",style:"Lager",               origin:"FR",abv:5.5,method:"Draft", city:"Montreal",    region:"Quebec",          country:"Canada",      cc:"CA", rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Michelob Ultra",  style:"Lager",           origin:"US",abv:4.2,method:"Can",   city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:2.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Red Stripe",      style:"Lager",               origin:"JM",abv:4.7,method:"Bottle",city:"Clemson",     region:"South Carolina",  country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Jan",monthN:1,year:2026},
  // FEB 2026
  {beer:"Heineken",        style:"Lager",               origin:"NL",abv:5.0,method:"Draft", city:"Uncasville",  region:"Connecticut",     country:"USA",         cc:"US", rating:3.25,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Guinness Draught",style:"Stout",               origin:"IE",abv:4.2,method:"Nitro", city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Weihenstephaner Hefeweissbier",style:"Wheat Beer",origin:"DE",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",     country:"USA",         cc:"US", rating:4.50,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Hofbräu Münchner Weiße",style:"Wheat Beer",    origin:"DE",abv:5.1,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:4.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Negra Modelo",    style:"Lager",               origin:"MX",abv:5.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Hofbräu Dunkel",  style:"Lager",               origin:"DE",abv:5.5,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Bud Light",       style:"Lager",     origin:"US",abv:4.2,method:"Bottle",city:"East Rutherford",region:"New Jersey",      country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Budweiser",       style:"Lager",           origin:"US",abv:5.0,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Corona Extra",    style:"Lager",            origin:"MX",abv:4.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Birra Moretti",   style:"Lager",               origin:"IT",abv:4.6,method:"Bottle",city:"Sciara",       region:"Sicily",          country:"Italy",       cc:"IT", rating:3.75,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Erdinger Weißbier",style:"Wheat Beer",   origin:"DE",abv:5.3,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Feb",monthN:2,year:2026},
  // MAR 2026
  {beer:"Estrella Galicia",style:"Lager",              origin:"ES",abv:5.5,method:"Bottle",city:"Madrid",       region:"Madrid",          country:"Spain",       cc:"ES", rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Pilsner Urquell", style:"Pilsner",     origin:"CZ",abv:4.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Wrench",         style:"IPA",       origin:"US",abv:7.1,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Fin Du Monde",style:"Belgian Ale",             origin:"CA",abv:9.0,method:"Bottle",city:"Montreal",     region:"Quebec",          country:"Canada",      cc:"CA", rating:3.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Żywiec",         style:"Lager",                origin:"PL",abv:5.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Peroni Nastro Azzurro",style:"Lager",          origin:"IT",abv:5.1,method:"Bottle",city:"Venice",       region:"Veneto",          country:"Italy",       cc:"IT", rating:2.50,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Estrella Damm",  style:"Lager",                origin:"ES",abv:5.4,method:"Bottle",city:"Barcelona",    region:"Catalonia",       country:"Spain",       cc:"ES", rating:3.50,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Grolsch Puur Weizen",style:"Wheat Beer",origin:"NL",abv:5.1,method:"Draft", city:"Oldenzaal",   region:"Overijssel",      country:"Netherlands", cc:"NL", rating:5.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Frisse Lentebok",   style:"Lager",      origin:"NL",abv:6.5,method:"Bottle",city:"Hengelo",     region:"Overijssel",      country:"Netherlands", cc:"NL", rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Leffe Blonde",      style:"Belgian Ale",           origin:"BE",abv:6.6,method:"Draft", city:"Nijmegen",    region:"Gelderland",      country:"Netherlands", cc:"NL", rating:4.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Texels Skuumkoppe", style:"Wheat Beer",  origin:"NL",abv:6.0,method:"Bottle",city:"Nijmegen",    region:"Gelderland",      country:"Netherlands", cc:"NL", rating:3.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Affligem Tripel",   style:"Belgian Ale",           origin:"BE",abv:9.0, method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"De Koninck",      style:"Pale Ale",            origin:"BE",abv:5.2, method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"IJwit",             style:"Wheat Beer",origin:"NL",abv:6.5,method:"Draft", city:"Antwerp",     region:"Antwerp",         country:"Belgium",     cc:"BE", rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Chouffe Blonde", style:"Belgian Ale",  origin:"BE",abv:8.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",cc:"US", rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Stiegl Goldbräu",  style:"Lager",               origin:"AT",abv:5.0,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Modelo Oro",       style:"Lager",              origin:"MX",abv:4.0,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Mar",monthN:3,year:2026},
  // APR 2026
  {beer:"Super Bock",       style:"Lager",              origin:"PT",abv:5.2,method:"Bottle",city:"Lagos",        region:"Algarve",         country:"Portugal",    cc:"PT", rating:3.00,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Estrella Jalisco",      style:"Lager",         origin:"MX",abv:4.5,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:true, month:"Apr",monthN:4,year:2026,logo:"https://pennbeer.com/app/uploads/2021/06/ynaOvePfbmJEMed-400x400-noPad-300x300.png"},
  {beer:"Rolling Rock Extra Pale",style:"Lager",        origin:"US",abv:4.4,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Carlsberg Elephant",style:"Lager",             origin:"DK",abv:7.2,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Dos Equis Lager Especial",style:"Lager",       origin:"MX",abv:4.2,method:"Draft", city:"Queens",      region:"New York",        country:"USA",         cc:"US", rating:1.75,isNew:true, month:"Apr",monthN:4,year:2026,logo:"https://thebrandinquirer.wordpress.com/wp-content/uploads/2021/05/dos-equis-nueva-imagen-logo-new-design-.jpg?w=1024"},
  {beer:"Miller Lite",      style:"Lager",              origin:"US",abv:4.2,method:"Bottle",city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.25,isNew:true, month:"Apr",monthN:4,year:2026},
  // MAY 2026
  {beer:"Belhaven Scottish Stout",style:"Stout",        origin:"GB",abv:5.2,method:"Nitro", city:"Boston",      region:"Massachusetts",   country:"USA",         cc:"US", rating:3.00,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Samuel Adams Summer Ale",style:"Wheat Beer",   origin:"US",abv:5.3,method:"Draft", city:"Boston",      region:"Massachusetts",   country:"USA",         cc:"US", rating:3.00,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Pacífico Clara",   style:"Lager",              origin:"MX",abv:4.5,method:"Bottle",city:"Clemson",      region:"South Carolina",  country:"USA",         cc:"US", rating:3.75,isNew:true, month:"May",monthN:5,year:2026,logo:"https://upload.wikimedia.org/wikipedia/en/f/f7/Pacifico_Logo.png"},
  {beer:"Narragansett Lager",style:"Lager",             origin:"US",abv:5.0,method:"Can",   city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.25,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Big Wave Golden Ale",style:"Pale Ale",         origin:"US",abv:4.4,method:"Can",   city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.75,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Smithwick's",     style:"Red Ale",              origin:"IE",abv:4.5,method:"Draft", city:"White Plains",region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Daura",           style:"Lager",                origin:"ES",abv:5.4,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"May",monthN:5,year:2026,logo:"logos/daura.svg"},
  {beer:"Asahi Super Dry", style:"Lager",                origin:"JP",abv:5.0,method:"Bottle",city:"Eastchester", region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Blue Moon",       style:"Wheat Beer",           origin:"US",abv:5.4,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.50,isNew:true, month:"May",monthN:5,year:2026},
  // JUN 2026
  {beer:"Hop Commander",   style:"IPA",                  origin:"US",abv:6.5,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Paulaner Hefe-Weißbier",style:"Wheat Beer",     origin:"DE",abv:5.5,method:"Bottle",city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Medalla Light",   style:"Lager",                origin:"PR",abv:4.2,method:"Bottle",city:"San Juan",    region:"San Juan",        country:"Puerto Rico", cc:"PR", rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Magna",           style:"Lager",                origin:"PR",abv:4.5,method:"Bottle",city:"San Juan",    region:"San Juan",        country:"Puerto Rico", cc:"PR", rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Ocean SJU",       style:"Lager",                origin:"PR",abv:5.9,method:"Bottle",city:"San Juan",    region:"San Juan",        country:"Puerto Rico", cc:"PR", rating:2.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Bloodline Blood Orange IPA",style:"IPA",        origin:"US",abv:8.0,method:"Bottle",city:"San Juan",    region:"San Juan",        country:"Puerto Rico", cc:"PR", rating:3.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Goose IPA",             style:"IPA",                  origin:"US",abv:5.9,method:"Can",   city:"Washington",  region:"District of Columbia",country:"USA",         cc:"US", rating:3.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Almaza Pilsener",       style:"Pilsner",              origin:"LB",abv:4.2,method:"Bottle",city:"Washington",  region:"District of Columbia",country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Mythos",                style:"Lager",                origin:"GR",abv:5.0,method:"Bottle",city:"Washington",  region:"District of Columbia",country:"USA",         cc:"US", rating:3.25,isNew:true, month:"Jun",monthN:6,year:2026},
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
  {city:"Uncasville", region:"Connecticut",           country:"USA",         cc:"US", lat:41.4775,lng:-72.0892},
  {city:"Queens",      region:"New York",             country:"USA",         cc:"US", lat:40.7282,lng:-73.7949},
  {city:"Oldenzaal",   region:"Overijssel",           country:"Netherlands", cc:"NL", lat:52.3107,lng:6.9280},
  {city:"Nijmegen",    region:"Gelderland",           country:"Netherlands", cc:"NL", lat:51.8426,lng:5.8528},
  {city:"Antwerp",     region:"Antwerp",              country:"Belgium",     cc:"BE", lat:51.2194,lng:4.4025},
  {city:"Boston",      region:"Massachusetts",        country:"USA",         cc:"US", lat:42.3601,lng:-71.0589},
  {city:"Stamford",    region:"Connecticut",          country:"USA",         cc:"US", lat:41.0534,lng:-73.5387},
  {city:"Clemson",     region:"South Carolina",       country:"USA",         cc:"US", lat:34.6834,lng:-82.8374},
  {city:"Barcelona",   region:"Catalonia",            country:"Spain",       cc:"ES", lat:41.3851,lng:2.1734},
  {city:"Madrid",      region:"Madrid",               country:"Spain",       cc:"ES", lat:40.4168,lng:-3.7038},
  {city:"Lagos",       region:"Algarve",              country:"Portugal",    cc:"PT", lat:37.1028,lng:-8.6736},
  {city:"Sciara",      region:"Sicily",               country:"Italy",       cc:"IT", lat:37.9156,lng:13.9344},
  {city:"Venice",      region:"Veneto",               country:"Italy",       cc:"IT", lat:45.4408,lng:12.3155},
  {city:"East Rutherford",region:"New Jersey",        country:"USA",         cc:"US", lat:40.8127,lng:-74.0846},
  {city:"San Juan",    region:"San Juan",             country:"Puerto Rico", cc:"PR", lat:18.4655,lng:-66.1057},
  {city:"Washington",  region:"District of Columbia", country:"USA",         cc:"US", lat:38.9072,lng:-77.0369},
];

let breweries=[
  {name:"Weihenstephaner",        location:"Freising, Bavaria",         country:"Germany",     cc:"DE", lang:"de", beers:"Weihenstephaner Hefeweissbier",                     lat:48.3953,lng:11.7291, ratings:[4.50]},
  {name:"Hofbräu München",        location:"Munich, Bavaria",           country:"Germany",     cc:"DE", lang:"de", beers:"Hofbräu Münchner Weiße · Hofbräu Dunkel",           lat:48.1351,lng:11.5820, ratings:[4.75,2.75]},
  {name:"Guinness (St. James's Gate)", location:"Dublin, Leinster",     country:"Ireland",     cc:"IE", lang:"en", beers:"Guinness Draught",                                  lat:53.3418,lng:-6.2868, ratings:[4.00]},
  {name:"Harp / Diageo",          location:"Dundalk, County Louth",     country:"Ireland",     cc:"IE", lang:"en", beers:"Harp Lager",                                        lat:54.0039,lng:-6.3703, ratings:[4.25]},
  {name:"Duvel Moortgat",         location:"Puurs-Sint-Amands, Antwerp",country:"Belgium",     cc:"BE", lang:"nl", beers:"Duvel",                                             lat:51.0727,lng:4.2897,  ratings:[4.25]},
  {name:"AB InBev (Stella)",      location:"Leuven, Flemish Brabant",   country:"Belgium",     cc:"BE", lang:"nl", beers:"Stella Artois",                                     lat:50.8798,lng:4.7005,  ratings:[2.75]},
  {name:"Heineken",               location:"Amsterdam, Noord-Holland",  country:"Netherlands", cc:"NL", lang:"nl", beers:"Heineken",                                          lat:52.3578,lng:4.8918,  ratings:[3.25]},
  {name:"Grolsch",                location:"Enschede, Overijssel",      country:"Netherlands", cc:"NL", lang:"nl", beers:"Grolsch · Grolsch Puur Weizen · Frisse Lentebok",   lat:52.2215,lng:6.8937,  ratings:[3.50,5.00,3.25]},
  {name:"Bavaria NV (Hertog Jan)",location:"Arcen, Limburg",            country:"Netherlands", cc:"NL", lang:"nl", beers:"Hertog Jan",                                        lat:51.4862,lng:6.1741,  ratings:[2.00]},
  {name:"Anheuser-Busch",         location:"St. Louis, Missouri",       country:"USA",         cc:"US", lang:"en", beers:"Budweiser · Bud Light · Michelob Ultra",            lat:38.6072,lng:-90.2124, ratings:[3.00,3.00,2.50]},
  {name:"Molson Coors",           location:"Golden, Colorado",          country:"USA",         cc:"US", lang:"en", beers:"Coors Light",                                       lat:39.7555,lng:-105.2211,ratings:[3.00]},
  {name:"Grupo Modelo",           location:"Mexico City, CDMX",         country:"Mexico",      cc:"MX", lang:"es", beers:"Modelo Especial · Negra Modelo · Corona Extra · Modelo Oro", lat:19.4274,lng:-99.1677, ratings:[3.25,3.00,3.75,3.00]},
  {name:"Cervecería Estrella Jalisco", location:"Guadalajara, Jalisco",country:"Mexico",      cc:"MX", lang:"es", beers:"Estrella Jalisco",                                    lat:20.6597,lng:-103.3496, ratings:[3.75]},
  {name:"Carlsberg",              location:"Copenhagen, Capital Region",country:"Denmark",     cc:"DK", lang:"da", beers:"Carlsberg · Carlsberg Elephant",                    lat:55.6614,lng:12.5361,  ratings:[3.00,3.50]},
  {name:"Unibroue",               location:"Chambly, Quebec",           country:"Canada",      cc:"CA", lang:"fr", beers:"La Fin Du Monde",                                   lat:45.4412,lng:-73.2615, ratings:[3.75]},
  {name:"Kronenbourg",            location:"Obernai, Alsace",           country:"France",      cc:"FR", lang:"fr", beers:"Kronenbourg 1664",                                  lat:48.4637,lng:7.4845,  ratings:[3.00]},
  {name:"Sapporo Brewery",        location:"Sapporo, Hokkaido",         country:"Japan",       cc:"JP", lang:"ja", beers:"Sapporo Premium",       nativeName:"サッポロビール",     lat:43.0685,lng:141.3544, ratings:[3.50]},
  {name:"Kirin Brewery",          location:"Yokohama, Kanagawa",        country:"Japan",       cc:"JP", lang:"ja", beers:"Kirin Ichiban",nativeName:"キリン一番搾り",   lat:35.4634,lng:139.6220, ratings:[3.00]},
  {name:"Asahi Breweries",        location:"Suita, Osaka",              country:"Japan",       cc:"JP", lang:"ja", beers:"Asahi Super Dry",       nativeName:"アサヒスーパードライ", lat:34.7615,lng:135.5158, ratings:[3.50]},
  {name:"Red Stripe (D&G)",       location:"Kingston, Surrey",          country:"Jamaica",     cc:"JM", lang:"en", beers:"Red Stripe",                                        lat:17.9972,lng:-76.7939, ratings:[3.75]},
  {name:"Estrella Galicia",       location:"A Coruña, Galicia",         country:"Spain",       cc:"ES", lang:"es", beers:"Estrella Galicia",                                   lat:43.3623,lng:-8.4115,  ratings:[4.25]},
  {name:"Pilsner Urquell",        location:"Pilsen, Bohemia",           country:"Czech Republic",cc:"CZ", lang:"cs", beers:"Pilsner Urquell",    nativeName:"Plzeňský Prazdroj", lat:49.7479,lng:13.3756,  ratings:[3.25]},
  {name:"Birra Moretti (Heineken Italia)", location:"Udine, Friuli-Venezia Giulia", country:"Italy", cc:"IT", lang:"it", beers:"Birra Moretti",                                   lat:46.0640,lng:13.2350,  ratings:[3.75]},
  {name:"Erdinger Weissbräu",  location:"Erding, Bavaria",             country:"Germany",     cc:"DE", lang:"de", beers:"Erdinger Weißbier",                                     lat:48.3063,lng:11.9071,  ratings:[3.25]},
  {name:"Industrial Arts Brewing",location:"Garnerville, New York",     country:"USA",         cc:"US", lang:"en", beers:"Wrench",                                             lat:41.2065,lng:-74.0085,  ratings:[4.00]},
  {name:"Żywiec Brewery (Grupa Żywiec)", location:"Żywiec, Silesia",   country:"Poland",      cc:"PL", lang:"pl", beers:"Żywiec",                                             lat:49.6853,lng:19.1925,  ratings:[2.75]},
  {name:"Birra Peroni",               location:"Rome, Lazio",           country:"Italy",       cc:"IT", lang:"it", beers:"Peroni Nastro Azzurro",                                       lat:41.8902,lng:12.4922,  ratings:[2.50]},
  {name:"S.A. Damm",                  location:"Barcelona, Catalonia",  country:"Spain",       cc:"ES", lang:"es", beers:"Estrella Damm · Daura",                                    lat:41.3897,lng:2.1540,   ratings:[3.50,3.00]},
  {name:"Abbaye de Leffe (AB InBev)", location:"Dinant, Namur",          country:"Belgium",     cc:"BE", lang:"fr", beers:"Leffe Blonde",                                            lat:50.2611,lng:4.9122,   ratings:[4.75]},
  {name:"Texelse Bierbrouwerij",      location:"Oudeschild, North Holland",country:"Netherlands",cc:"NL", lang:"nl", beers:"Texels Skuumkoppe",                                       lat:53.0385,lng:4.8510,   ratings:[3.00]},
  {name:"Affligem Brewery (Heineken)",location:"Opwijk, Flemish Brabant", country:"Belgium",     cc:"BE", lang:"nl", beers:"Affligem Tripel",                                          lat:50.9786,lng:4.1868,   ratings:[3.75]},
  {name:"De Koninck Brewery",         location:"Antwerp, Antwerp",        country:"Belgium",     cc:"BE", lang:"nl", beers:"De Koninck",                                                lat:51.2157,lng:4.4156,   ratings:[2.75]},
  {name:"Brouwerij 't IJ",            location:"Amsterdam, Noord-Holland",country:"Netherlands", cc:"NL", lang:"nl", beers:"IJwit",                                                    lat:52.3657,lng:4.9196,   ratings:[3.75]},
  {name:"Brasserie d'Achouffe",       location:"Achouffe, Luxembourg Province (Wallonia)", country:"Belgium",     cc:"BE", lang:"fr", beers:"La Chouffe Blonde",                                           lat:50.1417,lng:5.8125,   ratings:[4.25]},
  {name:"Stieglbrauerei zu Salzburg", location:"Salzburg, Land Salzburg", country:"Austria",     cc:"AT", lang:"de", beers:"Stiegl Goldbräu",                                              lat:47.8095,lng:13.0550,  ratings:[2.75]},
  {name:"Super Bock Group",          location:"Leça do Balio, Porto",      country:"Portugal",    cc:"PT", lang:"pt", beers:"Super Bock",                                                    lat:41.2142,lng:-8.6254,  ratings:[3.00]},
  {name:"Latrobe Brewing Company",   location:"Latrobe, Pennsylvania",     country:"USA",         cc:"US", lang:"en", beers:"Rolling Rock Extra Pale",                                              lat:40.3215,lng:-79.3795, ratings:[3.25]},
  {name:"Cervecería Cuauhtémoc Moctezuma", location:"Monterrey, Nuevo León", country:"Mexico", cc:"MX", lang:"es", beers:"Dos Equis Lager Especial", lat:25.6866,lng:-100.3161, ratings:[1.75]},
  {name:"Miller Brewing Company",    location:"Milwaukee, Wisconsin",      country:"USA",         cc:"US", lang:"en", beers:"Miller Lite",                                              lat:43.0389,lng:-87.9065, ratings:[2.25]},
  {name:"Belhaven Brewery",          location:"Dunbar, East Lothian",      country:"Great Britain",cc:"GB", lang:"en", beers:"Belhaven Scottish Stout",                                  lat:56.0006,lng:-2.5176,  ratings:[3.00]},
  {name:"Boston Beer Company (Samuel Adams)", location:"Boston, Massachusetts", country:"USA",     cc:"US", lang:"en", beers:"Samuel Adams Summer Ale",                                  lat:42.3601,lng:-71.0589, ratings:[3.00]},
  {name:"Cervecería del Pacífico",   location:"Mazatlán, Sinaloa",         country:"Mexico",      cc:"MX", lang:"es", beers:"Pacífico Clara",                                            lat:23.2494,lng:-106.4111,ratings:[3.75]},
  {name:"Narragansett Brewing Company", location:"Cranston, Rhode Island", country:"USA",         cc:"US", lang:"en", beers:"Narragansett Lager",                                        lat:41.7798,lng:-71.4373, ratings:[3.25]},
  {name:"Kona Brewing Company",      location:"Kailua-Kona, Hawaii",       country:"USA",         cc:"US", lang:"en", beers:"Big Wave Golden Ale",                                       lat:19.6406,lng:-155.9969,ratings:[3.75]},
  {name:"Blue Moon Brewing Company", location:"Denver, Colorado",          country:"USA",         cc:"US", lang:"en", beers:"Blue Moon",                                                 lat:39.7392,lng:-104.9903,ratings:[3.50]},
  {name:"Smithwick's (St. Francis Abbey)", location:"Kilkenny, Leinster",  country:"Ireland",     cc:"IE", lang:"en", beers:"Smithwick's",                                               lat:52.6541,lng:-7.2448,  ratings:[2.75]},
  {name:"Captain Lawrence Brewing Company", location:"Elmsford, New York", country:"USA",         cc:"US", lang:"en", beers:"Hop Commander",                                             lat:41.0540,lng:-73.8201, ratings:[3.00]},
  {name:"Paulaner Brauerei",         location:"Munich, Bavaria",           country:"Germany",     cc:"DE", lang:"de", beers:"Paulaner Hefe-Weißbier",                                    lat:48.1234,lng:11.5808,  ratings:[4.00]},
  {name:"Compañía Cervecera de Puerto Rico", location:"Mayagüez, Puerto Rico", country:"Puerto Rico", cc:"PR", lang:"es", beers:"Medalla Light · Magna",                                    lat:18.2011,lng:-67.1397, ratings:[4.00,4.00]},
  {name:"Ocean Lab Brewing Co.",     location:"Carolina (Isla Verde), Puerto Rico", country:"Puerto Rico", cc:"PR", lang:"es", beers:"Ocean SJU",                                       lat:18.4486,lng:-66.0203, ratings:[2.50]},
  {name:"Flying Dog Brewery",        location:"Frederick, Maryland",       country:"USA",         cc:"US", lang:"en", beers:"Bloodline Blood Orange IPA",                                lat:39.4143,lng:-77.4105, ratings:[3.50]},
  {name:"Goose Island Beer Co.",     location:"Chicago, Illinois",         country:"USA",         cc:"US", lang:"en", beers:"Goose IPA",                                                 lat:41.9166,lng:-87.6530, ratings:[3.50]},
  {name:"Brasserie Almaza",          location:"Beirut, Beirut Governorate",country:"Lebanon",     cc:"LB", lang:"ar", beers:"Almaza Pilsener",                                          lat:33.8938,lng:35.5018,  ratings:[2.75], nativeName:"ألمازة"},
  {name:"Olympic Brewery",           location:"Sindos, Central Macedonia", country:"Greece",      cc:"GR", lang:"el", beers:"Mythos",                                                   lat:40.6736,lng:22.8064,  ratings:[3.25]},
];

// ══════════════════════════════════════════════════════════════
// BRAND DOMAINS — every beer maps to its brewery's domain
// Real logos load via Brandfetch's public CDN (no account required by end
// users); Google's favicon service and Icon Horse provide no-auth fallbacks.
// ══════════════════════════════════════════════════════════════
const BRAND_DOMAINS = {
"Affligem Tripel":"affligembeer.be",
"Almaza Pilsener":"almaza.com",
"Asahi Super Dry":"asahibeer.com",
"Augustiner Helles":"augustiner-braeu.de",
"Big Wave Golden Ale":"konabrewingco.com",
"Birra Moretti":"birramoretti.com",
"Bloodline Blood Orange IPA":"flyingdog.com",
"Blue Moon":"bluemoonbrewingcompany.com",
"De Koninck":"dekoninck.be",
"Brahma":"brahma.com.br",
"Bud Light":"budlight.com",
"Budweiser":"budweiser.com",
"Carlsberg":"carlsberg.com",
"Carlsberg Elephant":"carlsberg.com",
"Castle Lager":"castlelager.co.za",
"Chimay Blue":"chimay.com",
"Coopers Pale Ale":"coopers.com.au",
"Coors Light":"coorslight.com",
"Corona Extra":"coronausa.com",
"Dos Equis Lager Especial":"dosequis.com",
"Daura":"estrelladamm.com",
"Duvel":"duvel.com",
"Erdinger Weißbier":"erdinger.de",
"Estrella Damm":"estrelladamm.com",
"Estrella Galicia":"estrellagalicia.com",
"Estrella Jalisco":"estrellajalisco.com",
"Goose IPA":"gooseisland.com",
"Grolsch":"grolsch.com",
"Grolsch Puur Weizen":"grolsch.com",
"Frisse Lentebok":"grolsch.com",
"Guinness Draught":"guinness.com",
"Harp Lager":"harplager.com",
"Heineken":"heineken.com",
"Hertog Jan":"hertogjan.nl",
"Hoegaarden":"hoegaarden.com",
"IJwit":"brouwerijhetij.nl",
"Kirin Ichiban":"kirin.co.jp",
"Kronenbourg 1664":"1664.com",
"La Chouffe Blonde":"achouffe.be",
"La Fin Du Monde":"unibroue.com",
"Leffe Blonde":"leffe.com",
"Medalla Light":"medallalight.com",
"Menabrea":"birramenabrea.com",
"Michelob Ultra":"michelobultra.com",
"Miller Lite":"millerlite.com",
"Modelo Especial":"modelousa.com",
"Negra Modelo":"modelousa.com",
"Modelo Oro":"modelousa.com",
"Mythos":"mythosbrewery.gr",
"Hofbräu Dunkel":"hofbraeu-muenchen.de",
"Hop Commander":"captainlawrencebrewing.com",
"Hofbräu Münchner Weiße":"hofbraeu-muenchen.de",
"Narragansett Lager":"narragansettbeer.com",
"Peroni Nastro Azzurro":"peroni.it",
"Newcastle Brown":"newcastlebrown.com",
"Norrlands Guld":"norrlandsguld.se",
"Ocean SJU":"oceanlabbrewing.com",
"Orion":"orionbeer.co.jp",
"Pacífico Clara":"drinkpacifico.com",
"Paulaner Hefe":"paulaner.com",
"Paulaner Hefe-Weißbier":"paulaner.com",
"Peroni":"peroni.it",
"Pilsner Urquell":"prazdroj.cz",
"Quilmes":"quilmes.com.ar",
"Red Stripe":"redstripebeer.com",
"Ringnes":"ringnes.no",
"Rolling Rock Extra Pale":"rollingrock.com",
"Sam Adams Boston Lager":"samueladams.com",
"Sapporo Premium":"sapporobeer.com",
"Belhaven Scottish Stout":"belhaven.co.uk",
"Singha":"singhabeer.com",
"Smithwick's":"smithwicks.com",
"Sol":"solbeer.com",
"Stella Artois":"stellaartois.com",
"Stiegl Goldbräu":"stiegl.at",
"Samuel Adams Summer Ale":"samueladams.com",
"Super Bock":"superbock.pt",
"Tennent's":"tennents.com",
"Texels Skuumkoppe":"texels.nl",
"Tiger Beer":"tigerbeer.com",
"Tsingtao":"tsingtaobeer.com",
"Tuborg":"tuborg.com",
"Tyskie":"tyskie.pl",
"Victoria Bitter":"vb.com.au",
"Weihenstephaner Hefeweissbier":"weihenstephaner.de",
"Wrench":"industrialartsbrewing.com",
"Żywiec":"zywiec.com.pl",
};

// Brandfetch's public dev client ID — embedded so users never need an account.
const BRANDFETCH_CLIENT_ID = "1idIddY24o2pZE9n2hu";
// Tiered logo sources: primary (Brandfetch HD logo) → fallback 1 (Google HD
// favicons) → fallback 2 (Icon Horse, 256px PNG). Emoji renders inline if every
// remote source fails. All endpoints requested at 2–4× the display size so
// logos stay crisp on high-DPR screens.
function logoURL(name){
  const d=BRAND_DOMAINS[name];
  return d?`https://cdn.brandfetch.io/${d}/w/1024/h/1024?c=${BRANDFETCH_CLIENT_ID}`:null;
}
function logoFallbackURL(name){
  const d=BRAND_DOMAINS[name];
  return d?`https://www.google.com/s2/favicons?domain=${d}&sz=512`:null;
}
function logoFallback2URL(name){
  const d=BRAND_DOMAINS[name];
  return d?`https://icon.horse/icon/${d}`:null;
}

// Coverage warning: any beer entry without a brand domain mapping
(function validateBeerDomains(){
  const missing=[...new Set(beers.map(b=>b.beer))].filter(name=>!BRAND_DOMAINS[name]);
  if(missing.length){
    console.warn(`[DOMAIN CHECK] ${missing.length} beer(s) missing brand domain:\n  - ${missing.join('\n  - ')}`);
  }
})();

// Optional per-beer local logo override. Set `logo:"logos/<file>"` on a beer
// entry to use a file you've placed in logos/ instead of Brandfetch. The
// remote chain still serves as fallback if the local file is missing.
const LOCAL_LOGOS={};
function rebuildLocalLogos(){
  for(const b of beers) if(b.logo) LOCAL_LOGOS[b.beer]=b.logo;
}
rebuildLocalLogos();

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
function strs(r){const f=Math.floor(r),h=(r%1)>=.5;return"★".repeat(f)+(h?"½":"")+"☆".repeat(5-f-(h?1:0));}
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const std=a=>{if(!a.length)return 0;const m=avg(a);return Math.sqrt(avg(a.map(v=>(v-m)**2)));};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// Friendly 3-bucket rating color: loved it / liked it / not for me
function rColor(r){return r>=4?'#4C8C2B':r>=3?'#D97706':'#B3423A';}
function rWord(r){return r>=4.5?'Loved it':r>=4?'Great':r>=3.5?'Good':r>=3?'Fine':r>=2.5?'Meh':'Not for me';}
const fmtMi=n=>Math.round(n).toLocaleString('en-US');
// Reusable star + number rating snippet
function ratingHtml(r,size){return `<span class="stars" style="color:${rColor(r)}${size?`;font-size:${size}px`:''}">${strs(r)}</span> <b class="rnum" style="color:${rColor(r)}">${r.toFixed(2)}</b>`;}

const MONTH_FULL = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};

function getMonthlyData(){
  // Single pass: group beers by year+month so the same month name in different
  // years never merges, and bucket order stays truly chronological.
  const orderMap={},monthAbbr={},monthYearMap={},byMonth={};
  beers.forEach(b=>{
    const key=`${b.month} ${b.year}`;
    if(!(key in orderMap)){orderMap[key]=b.year*12+b.monthN;monthAbbr[key]=b.month;monthYearMap[key]=b.year;byMonth[key]=[];}
    byMonth[key].push(b);
  });
  const months=Object.keys(orderMap).sort((a,b)=>orderMap[a]-orderMap[b]);
  const monthLabels=months.map(m=>`${MONTH_FULL[monthAbbr[m]]||monthAbbr[m]} ${monthYearMap[m]||''}`);
  return {months,byMonth,monthLabels,monthYearMap,monthAbbr};
}

// ══════════════════════════════════════════════════════════════
// LOGO RENDERING — source chain: local override → Brandfetch →
// Google favicons → Icon Horse → 🍺 emoji
// ══════════════════════════════════════════════════════════════
function logoSources(name){
  const local=LOCAL_LOGOS[name];
  const sources=[];
  if(local)sources.push(local);
  const u=logoURL(name);if(u)sources.push(u);
  const fb1=logoFallbackURL(name);if(fb1)sources.push(fb1);
  const fb2=logoFallback2URL(name);if(fb2)sources.push(fb2);
  return sources;
}
function logoChainOnError(sources,replaceJS){
  const tail=sources.slice(1);
  let conds='';
  for(let i=0;i<tail.length;i++){
    conds+=`${i===0?'if':'else if'}(f===${i}){this.src='${tail[i]}';}`;
  }
  const elseClause=tail.length?`else{${replaceJS}}`:replaceJS;
  return ` onerror="var f=+this.dataset.f||0;this.dataset.f=f+1;${conds}${elseClause}"`;
}
function logoImg(name,size=24){
  const emojiSpan=`<span style="display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle">🍺</span>`;
  const sources=logoSources(name);
  if(!sources.length)return emojiSpan;
  const emojiReplace=`this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{textContent:'🍺',style:'display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle'}));`;
  const onerr=logoChainOnError(sources,emojiReplace);
  return `<img src="${sources[0]}" class="beer-logo-inline" style="width:${size}px;height:${size}px" alt="${name}" loading="lazy" decoding="async"${onerr}>`;
}
function cardLogo(name){
  const sources=logoSources(name);
  if(!sources.length)return `<span class="bc-emoji">🍺</span>`;
  const emojiReplace=`this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'bc-emoji',textContent:'🍺'}));`;
  const onerr=logoChainOnError(sources,emojiReplace);
  return `<img src="${sources[0]}" class="bc-logo" alt="${name}" loading="lazy" decoding="async"${onerr}>`;
}

// ══════════════════════════════════════════════════════════════
// PRE-COMPUTED STATISTICS — recomputed when data loads from Sheets
// ══════════════════════════════════════════════════════════════
function computeStats(){
  const styleMap={},methodMap={},countryMap={},cityMap={},brandMap={},brandStats={};
  let ratingSum=0;

  beers.forEach(b=>{
    ratingSum+=b.rating;
    if(!styleMap[b.style])styleMap[b.style]={t:0,c:0};styleMap[b.style].t+=b.rating;styleMap[b.style].c++;
    if(!methodMap[b.method])methodMap[b.method]={t:0,c:0};methodMap[b.method].t+=b.rating;methodMap[b.method].c++;
    if(!countryMap[b.origin])countryMap[b.origin]={t:0,c:0};countryMap[b.origin].t+=b.rating;countryMap[b.origin].c++;
    const L=CANON_LOC.get(b.beer)||b;
    if(!cityMap[L.city])cityMap[L.city]={t:0,c:0,region:L.region,country:L.country,cc:L.cc};cityMap[L.city].t+=b.rating;cityMap[L.city].c++;
    if(!brandMap[b.beer]){brandMap[b.beer]=[];brandStats[b.beer]={best:b.rating,worst:b.rating};}
    brandMap[b.beer].push(b.rating);
    const bs=brandStats[b.beer];
    if(b.rating>bs.best)bs.best=b.rating;
    if(b.rating<bs.worst)bs.worst=b.rating;
  });

  const styleRanked=Object.entries(styleMap).map(([s,v])=>({s,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const countryRanked=Object.entries(countryMap).map(([k,v])=>({l:`${FLAGS[k]||''} ${CNAMES[k]||k}`,code:k,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const cityRanked=Object.entries(cityMap).map(([k,v])=>({city:k,region:v.region,country:v.country,cc:v.cc,a:v.t/v.c,c:v.c})).sort((a,b)=>b.a-a.a);
  const brandList=Object.entries(brandMap).map(([n,rs])=>({n,cnt:rs.length,avg:avg(rs),best:brandStats[n].best,worst:brandStats[n].worst,std:std(rs)})).sort((a,b)=>b.avg-a.avg);
  const globalAvg=beers.length?ratingSum/beers.length:0;

  return {styleMap,styleRanked,methodMap,countryMap,countryRanked,cityMap,cityRanked,brandMap,brandList,globalAvg};
}

// ── Lookup indexes — rebuilt alongside STATS whenever the data arrays mutate.
const LANG_NAMES_IDX={en:"English",de:"German",nl:"Dutch",fr:"French",ja:"Japanese",es:"Spanish",da:"Danish",cs:"Czech",it:"Italian",pl:"Polish",pt:"Portuguese",sv:"Swedish",no:"Norwegian",zh:"Chinese",th:"Thai",el:"Greek",af:"Afrikaans",ar:"Arabic"};
let BEER_REVIEWS=new Map();       // beer name → [reviews]
let BREWERY_BY_NAME=new Map();    // brewery name → brewery
let BREW_LOC={};                  // beer name → brewery location string
function buildIndexes(){
  BEER_REVIEWS=new Map();
  for(const b of beers){
    let arr=BEER_REVIEWS.get(b.beer);
    if(!arr){arr=[];BEER_REVIEWS.set(b.beer,arr);}
    arr.push(b);
  }
  BREWERY_BY_NAME=new Map();
  BREW_LOC={};
  for(const br of breweries){
    BREWERY_BY_NAME.set(br.name,br);
    for(const raw of br.beers.split(' · ')){
      const n=raw.trim();
      if(!BREW_LOC[n])BREW_LOC[n]=br.location;
    }
  }
}

// ── Canonical location: a beer reviewed in multiple cities is attributed to its
// rarest-visited city for AGGREGATION only (city stats, drunk map, markets count).
// Home bases "New Rochelle"/"New York" never win when any alternative city exists.
const HOME_CITIES=new Set(["New Rochelle","New York"]);
function computeCanonLoc(){
  const cityCount={},byBeer={};
  beers.forEach(b=>{
    cityCount[b.city]=(cityCount[b.city]||0)+1;
    const m=byBeer[b.beer]||(byBeer[b.beer]={});
    if(!m[b.city])m[b.city]={city:b.city,region:b.region,country:b.country,cc:b.cc};
  });
  const out=new Map();
  for(const beer in byBeer){
    const cities=Object.values(byBeer[beer]);
    if(cities.length<2)continue; // single city → callers fall back to the review's own fields
    const best=cities.reduce((a,c)=>{
      const ha=HOME_CITIES.has(a.city)?1:0, hc=HOME_CITIES.has(c.city)?1:0;
      const cmp = (hc-ha) || (cityCount[c.city]-cityCount[a.city]) ||
                  (c.city<a.city?-1:c.city>a.city?1:0);
      return cmp<0?c:a; // lowest [homePenalty, rawCount, cityName] wins
    });
    out.set(beer,best);
  }
  return out;
}
let CANON_LOC=computeCanonLoc();
function refreshStats(){ CANON_LOC=computeCanonLoc(); STATS=computeStats(); buildIndexes(); rebuildLocalLogos(); }
let STATS=computeStats();
buildIndexes();

// Only show the NEW tag for beers reviewed in the current calendar month.
function isDisplayNew(b){
  if(!b.isNew) return false;
  const n=new Date();
  return b.monthN===n.getMonth()+1 && b.year===n.getFullYear();
}

// ══════════════════════════════════════════════════════════════
// WORLD (UNTAPPD) RATINGS
// The refresh-untappd-reminder GitHub Action opens an issue every 2 weeks
// when this stamp gets stale (>14 days old).
// ══════════════════════════════════════════════════════════════
const UNTAPPD_LAST_REFRESHED='2026-05-05';
const UNTAPPD_REFRESH_INTERVAL_DAYS=14;
// Global Untappd averages — refreshed on UNTAPPD_LAST_REFRESHED above.
// Keys MUST match the exact beer names in beers[] (case + diacritics).
// Update every 2 weeks (the refresh workflow opens a reminder issue).
const globalAvgs={
  'Grolsch':3.52,'Hertog Jan':3.58,'Coors Light':2.84,
  'Sapporo Premium':3.51,'Kirin Ichiban':3.43,'Modelo Especial':3.55,
  'Stella Artois':3.30,'Duvel':3.70,'Carlsberg':3.09,'Carlsberg Elephant':3.42,
  'Harp Lager':3.42,'La Fin Du Monde':4.07,'Kronenbourg 1664':3.30,
  'Michelob Ultra':2.84,'Guinness Draught':3.80,'Red Stripe':3.31,
  'Heineken':3.00,'Weihenstephaner Hefeweissbier':3.80,'Negra Modelo':3.60,
  'Hofbräu Münchner Weiße':3.80,'Hofbräu Dunkel':3.55,
  'Bud Light':2.30,'Budweiser':2.60,'Corona Extra':3.47,
  'Dos Equis Lager Especial':3.25,
  'Frisse Lentebok':3.25,
  // Apr 2026 expansion — values mirror Untappd consensus snapshots
  // (cross-checked against IPO_WATCHLIST entries where overlap exists).
  'Estrella Galicia':3.65,'Pilsner Urquell':3.80,'Wrench':3.95,
  'Żywiec':3.35,'Peroni Nastro Azzurro':3.56,'Estrella Damm':3.61,
  'Grolsch Puur Weizen':3.50,'Leffe Blonde':3.75,'Texels Skuumkoppe':3.65,
  'Affligem Tripel':3.80,'De Koninck':3.55,'IJwit':3.50,
  'La Chouffe Blonde':3.85,'Stiegl Goldbräu':3.35,'Modelo Oro':3.45,
  'Super Bock':3.41,'Estrella Jalisco':3.20,'Rolling Rock Extra Pale':3.05,
  'Birra Moretti':3.58,'Erdinger Weißbier':3.78,'Miller Lite':2.51,
  'Pacífico Clara':3.65,'Narragansett Lager':3.23,'Big Wave Golden Ale':3.52,
  'Belhaven Scottish Stout':3.45,'Samuel Adams Summer Ale':3.50,
};

// Beers I want to try next — curated by hand ("On my list" section)
const IPO_WATCHLIST=[
  {beer:'Birra Moretti',   style:'Lager',        origin:'IT', abv:4.6, region:'Udine, Friuli-Venezia Giulia', untappd:3.58, method:'Bottle'},
  {beer:'Peroni',          style:'Lager',        origin:'IT', abv:5.1, region:'Rome, Lazio',           untappd:3.52, method:'Bottle'},
  {beer:'Blue Moon',       style:'Wheat Beer',   origin:'US', abv:5.4, region:'Denver, Colorado',      untappd:3.56, method:'Draft'},
  {beer:'Miller Lite',     style:'Lager',        origin:'US', abv:4.2, region:'Milwaukee, Wisconsin',  untappd:2.51, method:'Can'},
  {beer:'Estrella Damm',   style:'Lager',        origin:'ES', abv:5.4, region:'Barcelona, Catalonia',  untappd:3.61, method:'Bottle'},
  {beer:'Estrella Galicia',style:'Lager',        origin:'ES', abv:5.5, region:'A Coruña, Galicia',     untappd:3.65, method:'Bottle'},
  {beer:'Brahma',          style:'Lager',        origin:'BR', abv:4.8, region:'São Paulo, SP',         untappd:3.18, method:'Can'},
  {beer:'Quilmes',         style:'Lager',        origin:'AR', abv:4.9, region:'Buenos Aires, BA',      untappd:3.22, method:'Bottle'},
  {beer:'Tsingtao',        style:'Lager',        origin:'CN', abv:4.7, region:'Qingdao, Shandong',     untappd:3.29, method:'Bottle'},
  {beer:'Castle Lager',    style:'Lager',        origin:'ZA', abv:5.0, region:'Johannesburg, Gauteng', untappd:3.18, method:'Can'},
  {beer:'Pilsner Urquell', style:'Pilsner',      origin:'CZ', abv:4.4, region:'Pilsen, Bohemia',       untappd:3.80, method:'Bottle'},
  {beer:'Super Bock',      style:'Lager',        origin:'PT', abv:5.2, region:'Leça do Balio, Porto',  untappd:3.41, method:'Bottle'},
  {beer:'Mythos',          style:'Lager',        origin:'GR', abv:4.7, region:'Athens, Attica',        untappd:3.31, method:'Bottle'},
  {beer:'Victoria Bitter', style:'Lager',        origin:'AU', abv:4.9, region:'Melbourne, Victoria',   untappd:3.12, method:'Can'},
  {beer:'Norrlands Guld',  style:'Lager',        origin:'SE', abv:5.3, region:'Stockholm',             untappd:3.28, method:'Can'},
  {beer:'Asahi Super Dry', style:'Lager',        origin:'JP', abv:5.0, region:'Tokyo',                 untappd:3.60, method:'Bottle'},
  {beer:'Hoegaarden',      style:'Wheat Beer',   origin:'BE', abv:4.9, region:'Hoegaarden',            untappd:3.72, method:'Bottle'},
  {beer:'Kronenbourg 1664',style:'Lager',        origin:'FR', abv:5.5, region:'Obernai, Alsace',       untappd:3.30, method:'Can'},
  {beer:'Newcastle Brown', style:'Brown Ale',    origin:'GB', abv:4.7, region:'Tadcaster, Yorkshire',  untappd:3.28, method:'Bottle'},
  {beer:'Ringnes',         style:'Lager',        origin:'NO', abv:4.7, region:'Oslo',                  untappd:3.10, method:'Can'},
  {beer:'Żywiec',          style:'Lager',        origin:'PL', abv:5.5, region:'Żywiec, Silesia',       untappd:3.35, method:'Bottle'},
  {beer:'Tyskie',          style:'Pilsner',      origin:'PL', abv:5.6, region:'Tychy, Silesia',        untappd:3.28, method:'Can'},
  {beer:'Chimay Blue',     style:'Belgian Ale',  origin:'BE', abv:9.0, region:'Chimay, Hainaut',       untappd:4.05, method:'Bottle'},
  {beer:'Leffe Blonde',    style:'Belgian Ale',  origin:'BE', abv:6.6, region:'Dinant, Namur',         untappd:3.75, method:'Bottle'},
  {beer:'Coopers Pale Ale',style:'Pale Ale',     origin:'AU', abv:4.5, region:'Adelaide, SA',          untappd:3.72, method:'Bottle'},
  {beer:'Sam Adams Boston Lager',style:'Lager',  origin:'US', abv:5.0, region:'Boston, MA',            untappd:3.48, method:'Bottle'},
];

// ══════════════════════════════════════════════════════════════
// HERO STATS
// ══════════════════════════════════════════════════════════════
function renderHeroStats(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('stat-beers',STATS.brandList.length);
  set('stat-countries',STATS.countryRanked.length);
  set('stat-cities',Object.keys(drankCityData()).length);
  set('stat-avg',STATS.globalAvg.toFixed(2));
  // Footer freshness line
  const latest=beers.reduce((a,b)=>(b.year*12+b.monthN)>(a.year*12+a.monthN)?b:a,beers[0]);
  set('footer-updated',latest?`${MONTH_FULL[latest.month]||latest.month} ${latest.year}`:'');
}

// ══════════════════════════════════════════════════════════════
// BEER CARDS — search / filter / sort
// ══════════════════════════════════════════════════════════════
function uniqueBeers(){
  // One card per beer name: best-rated review carries the card, but we also
  // remember the most recent review for the "newest" sort and the date line.
  const best={};
  beers.forEach(b=>{
    const e=best[b.beer];
    if(!e){best[b.beer]={...b,latestOrd:b.year*12+b.monthN,latestMonth:b.month,latestYear:b.year,count:1};return;}
    e.count++;
    if(b.rating>e.rating){e.rating=b.rating;e.style=b.style;e.abv=b.abv;e.origin=b.origin;e.method=b.method;}
    const ord=b.year*12+b.monthN;
    if(ord>e.latestOrd){e.latestOrd=ord;e.latestMonth=b.month;e.latestYear=b.year;}
    if(isDisplayNew(b))e.isNew=true;
  });
  return Object.values(best);
}

const BEER_SORTS={
  rating:(a,b)=>b.rating-a.rating||a.beer.localeCompare(b.beer),
  newest:(a,b)=>b.latestOrd-a.latestOrd||a.beer.localeCompare(b.beer),
  az:(a,b)=>a.beer.localeCompare(b.beer)
};

function populateBeerFilters(){
  const fill=(el,opts)=>{
    const keep=el.value;
    el.length=1; // keep the "All …" option
    const frag=document.createDocumentFragment();
    opts.forEach(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;frag.appendChild(o);});
    el.appendChild(frag);
    el.value=[...el.options].some(o=>o.value===keep)?keep:'';
  };
  fill(document.getElementById('beerStyleFilter'),[...new Set(beers.map(b=>b.style))].sort().map(s=>[s,s]));
  fill(document.getElementById('beerOriginFilter'),[...new Set(beers.map(b=>b.origin))].sort().map(o=>[o,`${FLAGS[o]||''} ${CNAMES[o]||o}`]));
}

function applyBeerFilter(){
  const q=(document.getElementById('beerSearch').value||'').trim().toLowerCase();
  const st=document.getElementById('beerStyleFilter').value;
  const or=document.getElementById('beerOriginFilter').value;
  const sort=document.getElementById('beerSort').value;
  const data=uniqueBeers().filter(b=>
    (!st||b.style===st)&&
    (!or||b.origin===or)&&
    (!q||b.beer.toLowerCase().includes(q)||b.style.toLowerCase().includes(q)||(CNAMES[b.origin]||'').toLowerCase().includes(q)));
  data.sort(BEER_SORTS[sort]||BEER_SORTS.rating);
  renderBeerGrid(data);
}
const applyBeerFilterDebounced=(()=>{let t;return ()=>{clearTimeout(t);t=setTimeout(applyBeerFilter,160);};})();

function renderBeerGrid(data){
  const grid=document.getElementById('beerGrid');
  const countEl=document.getElementById('beerCount');
  if(countEl)countEl.textContent=data.length===0?'No beers match — try clearing the filters':`Showing ${data.length} beer${data.length===1?'':'s'}`;
  grid.innerHTML=data.map(b=>`
    <article class="beer-card" data-beer="${esc(b.beer)}" tabindex="0" role="button" aria-label="${esc(b.beer)} details">
      ${b.isNew&&isDisplayNew(b)?'<span class="bc-new">New</span>':''}
      <div class="bc-logo-wrap">${cardLogo(b.beer)}</div>
      <div class="bc-name">${esc(b.beer)}</div>
      <div class="bc-meta">${FLAGS[b.origin]||''} ${b.style} · ${b.abv}%</div>
      <div class="bc-rating">${ratingHtml(b.rating)}</div>
      <div class="bc-date">${b.latestMonth} ${b.latestYear}${b.count>1?` · ${b.count}×`:''}</div>
    </article>`).join('');
}

// ══════════════════════════════════════════════════════════════
// BEER DETAIL MODAL
// ══════════════════════════════════════════════════════════════
let _modalPrevFocus=null;
function openBeerModal(name){
  const reviews=BEER_REVIEWS.get(name)||[];
  if(!reviews.length) return;
  const ratings=reviews.map(b=>b.rating);
  const avgR=avg(ratings);
  const b0=reviews[0];
  const world=globalAvgs[name];
  const brewLoc=BREW_LOC[name];
  document.getElementById('beerModalTitle').textContent=name;
  document.getElementById('beerModalBody').innerHTML=`
    <div class="bm-head">
      <div class="bm-logo">${cardLogo(name)}</div>
      <div class="bm-info">
        <div class="bm-style">${esc(b0.style)} · ${b0.abv}% ABV</div>
        <div class="bm-origin">${FLAGS[b0.origin]||''} ${CNAMES[b0.origin]||b0.origin}${brewLoc?` — brewed in ${esc(brewLoc)}`:''}</div>
      </div>
      <div class="bm-score">
        <div class="bm-stars">${ratingHtml(avgR,20)}</div>
        <div class="bm-word" style="color:${rColor(avgR)}">${rWord(avgR)}</div>
        ${world!==undefined?`<div class="bm-world">The world says ★ ${world.toFixed(2)}</div>`:''}
      </div>
    </div>
    <div class="bm-sessions-title">Every time I've had it</div>
    <ul class="bm-sessions">${reviews.map(b=>`
      <li>
        <span class="bm-sess-date">${b.month} ${b.year}</span>
        <span class="bm-sess-place">${esc(b.city)} ${FLAGS[b.cc]||''} · ${esc(b.method)}</span>
        <span class="bm-sess-rating" style="color:${rColor(b.rating)}">${strs(b.rating)} ${b.rating.toFixed(2)}</span>
      </li>`).join('')}
    </ul>`;
  _modalPrevFocus=document.activeElement;
  const bm=document.getElementById('beerModal');
  bm.classList.add('open'); bm.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  // Focus after the visibility transition's first frame: focus() on an
  // element whose computed visibility is still 'hidden' is silently ignored.
  const cb=document.getElementById('beerModalClose');
  if(cb) requestAnimationFrame(()=>requestAnimationFrame(()=>cb.focus()));
}
function closeBeerModal(){
  const bm=document.getElementById('beerModal');
  if(!bm.classList.contains('open')) return;
  bm.classList.remove('open'); bm.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  restoreFocus(_modalPrevFocus,bm);
  _modalPrevFocus=null;
}
// Return focus to where it was before the overlay opened. If the opener wasn't
// focusable, at least blur anything still focused inside the now-hidden overlay.
function restoreFocus(prev,overlay){
  if(prev&&prev!==document.body&&document.contains(prev)) prev.focus();
  else if(overlay.contains(document.activeElement)) document.activeElement.blur();
}

// ══════════════════════════════════════════════════════════════
// MAP — one world map, three plain-language views:
//   drank   → every city I've had a beer in (dot size = how many)
//   brewed  → every brewery's hometown (dot color = my rating)
//   journey → an arc from each brewery to the city where I drank its beer
// ══════════════════════════════════════════════════════════════
function addTiles(map){L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO',maxZoom:20,subdomains:'abcd',detectRetina:true}).addTo(map);}
function popHtml(h){return `<div class="pop">${h}</div>`;}
function popKicker(t){return `<div class="pop-kicker">${t}</div>`;}
function distMi(aLat,aLng,bLat,bLng){
  const d=Math.PI/180,R=3958.8;
  const h=Math.sin((bLat-aLat)*d/2)**2+Math.cos(aLat*d)*Math.cos(bLat*d)*Math.sin((bLng-aLng)*d/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
// Gentle quadratic arc between two points (flat-map approximation; pairs that
// would cross the antimeridian get one endpoint shifted onto the adjacent
// world copy so the line takes the short way across the Pacific).
function arcPts(aLat,aLng,bLat,bLng){
  if(Math.abs(bLng-aLng)>180){ bLng+=bLng>aLng?-360:360; }
  const dLat=bLat-aLat,dLng=bLng-aLng,len=Math.sqrt(dLat*dLat+dLng*dLng)||1;
  const off=Math.min(len*0.18,14);
  const cLat=(aLat+bLat)/2+(-dLng/len)*off, cLng=(aLng+bLng)/2+(dLat/len)*off;
  const pts=[];
  for(let i=0;i<=32;i++){
    const t=i/32,u=1-t;
    pts.push([u*u*aLat+2*u*t*cLat+t*t*bLat, u*u*aLng+2*u*t*cLng+t*t*bLng]);
  }
  return pts;
}

// Track the Leaflet instance so a Sheets-driven refresh can dispose the
// existing map before re-initializing — without this Leaflet throws
// "Map container is already initialized."
let _worldMap=null, _mapLayers=null, _mapMode='drank';

const MAP_MODES={
  drank:{caption:'Every city I’ve had a beer in. Bigger dot = more beers there — tap one to see what I had.'},
  brewed:{caption:'Every brewery’s hometown. Dot color = how much I liked their beer — tap one for details.'},
  journey:{caption:'Each line is one beer’s trip from its brewery to my glass. Tap a line for the story.'}
};

// beer name → brewery record (breweries[].beers is " · "-separated)
function beerBreweryIndex(){
  const idx={};
  breweries.forEach(br=>br.beers.split(' · ').forEach(n=>{idx[n.trim()]=br;}));
  return idx;
}

// Aggregate pours per city (canonical location rule applies)
function drankCityData(){
  const cM={};
  beers.forEach(b=>{
    const L=CANON_LOC.get(b.beer)||b;
    let e=cM[L.city];
    if(!e){e=cM[L.city]={t:0,c:0,bs:[],reviews:[],region:L.region,country:L.country,cc:L.cc};}
    e.t+=b.rating;e.c++;
    if(!e.bs.includes(b.beer))e.bs.push(b.beer);
    e.reviews.push(b);
  });
  return cM;
}

// One journey per unique (beer, city where I actually drank it) pair
function buildJourneys(){
  const idx=beerBreweryIndex();
  const locByCity={};drunkLocs.forEach(l=>{locByCity[l.city]=l;});
  const seen=new Map();
  beers.forEach(b=>{
    const br=idx[b.beer],loc=locByCity[b.city];
    if(!br||!loc) return;
    const key=b.beer+'@'+b.city;
    let j=seen.get(key);
    if(!j){j={beer:b.beer,br,loc,ratings:[],pours:0,miles:distMi(br.lat,br.lng,loc.lat,loc.lng)};seen.set(key,j);}
    j.ratings.push(b.rating);j.pours++;
  });
  return [...seen.values()];
}

function buildDrankLayer(){
  const cM=drankCityData();
  const group=L.layerGroup(),bounds=[];
  drunkLocs.filter(l=>cM[l.city]).forEach(l=>{
    const d=cM[l.city],a=d.t/d.c,r=Math.max(6,Math.min(16,5+d.c*1.2));
    const home=HOME_CITIES.has(l.city);
    const rows=d.reviews.map(b=>`<div class="pop-row"><span class="pop-beer" data-open-beer="${esc(b.beer)}">${esc(b.beer)}</span><span style="color:${rColor(b.rating)};font-weight:700">${b.rating.toFixed(2)}</span></div>`).join('');
    const html=popKicker('📍 A city where I drank')+
      `<div class="pop-title">${esc(l.city)}, ${esc(l.region)} ${FLAGS[l.cc]||''}${home?' <span class="pop-home">⌂ home turf</span>':''}</div>`+
      `<div class="pop-sub">${d.c} beer${d.c>1?'s':''} here · my average <b style="color:${rColor(a)}">${a.toFixed(2)}</b></div>`+
      `<div class="pop-list">${rows}</div>`;
    L.circleMarker([l.lat,l.lng],{radius:r,fillColor:'#E8871E',color:home?'#B45309':'#fff',weight:2,opacity:1,fillOpacity:.85})
      .bindTooltip(`${l.city} · ${d.c} beer${d.c>1?'s':''}`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([l.lat,l.lng]);
  });
  return {group,bounds};
}

function buildBrewedLayer(){
  const group=L.layerGroup(),bounds=[];
  breweries.forEach(b=>{
    const a=avg(b.ratings),r=Math.max(6,Math.min(14,5+b.ratings.length*1.2));
    const firstBeer=b.beers.split(' · ')[0];
    const srcs=logoSources(firstBeer);
    const onerr=srcs.length>1?logoChainOnError(srcs,'this.onerror=null;this.remove();'):' onerror="this.onerror=null;this.remove();"';
    const logoHtml=srcs.length?`<img src="${srcs[0]}" class="pop-logo" loading="lazy" decoding="async"${onerr}>`:'';
    const beerList=b.beers.split(' · ').map(n=>`<span class="pop-beer" data-open-beer="${esc(n)}">${esc(n)}</span>`).join('<span class="pop-dot-sep"> · </span>');
    const html=popKicker('🏭 A brewery’s hometown')+logoHtml+
      `<div class="pop-title">${esc(b.name)}${b.nativeName?` <span class="pop-native">${esc(b.nativeName)}</span>`:''}</div>`+
      `<div class="pop-sub">${esc(b.location)} · ${FLAGS[b.cc]||''} ${esc(b.country)}</div>`+
      `<div class="pop-sub">What I’ve had: ${beerList}</div>`+
      `<div class="pop-sub">My average: <b style="color:${rColor(a)}">${a.toFixed(2)} · ${rWord(a)}</b></div>`;
    L.circleMarker([b.lat,b.lng],{radius:r,fillColor:rColor(a),color:'#fff',weight:2,opacity:1,fillOpacity:.9})
      .bindTooltip(`${b.name} · ${a.toFixed(2)}`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([b.lat,b.lng]);
  });
  return {group,bounds};
}

function buildJourneyLayer(journeys){
  const group=L.layerGroup(),bounds=[];
  journeys.forEach(j=>{
    const a=avg(j.ratings),pts=arcPts(j.br.lat,j.br.lng,j.loc.lat,j.loc.lng);
    const html=popKicker('✈️ One beer’s trip to my glass')+
      `<div class="pop-title"><span class="pop-beer" data-open-beer="${esc(j.beer)}">${esc(j.beer)}</span></div>`+
      `<div class="pop-sub">${esc(j.br.location.split(',')[0])} ${FLAGS[j.br.cc]||''} → ${esc(j.loc.city)} ${FLAGS[j.loc.cc]||''}</div>`+
      `<div class="pop-sub">Traveled ~<b>${fmtMi(j.miles)} miles</b> · my rating <b style="color:${rColor(a)}">${a.toFixed(2)}</b></div>`;
    L.polyline(pts,{color:rColor(a),weight:2,opacity:.55})
      .bindTooltip(`${j.beer} · ${fmtMi(j.miles)} mi`,{sticky:true,className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    // endpoints: hollow ring = brewery, solid dot = where I drank it
    const p0=pts[0],p1=pts[pts.length-1];
    L.circleMarker(p0,{radius:3.5,fillColor:'#FFFDF7',color:'#7A6A5B',weight:1.5,fillOpacity:1,interactive:false}).addTo(group);
    L.circleMarker(p1,{radius:3.5,fillColor:'#E8871E',color:'#fff',weight:1,fillOpacity:1,interactive:false}).addTo(group);
    bounds.push(p0,p1);
  });
  return {group,bounds};
}

function setMapMode(mode){
  if(!MAP_MODES[mode]) mode='drank';
  _mapMode=mode;
  document.querySelectorAll('#map-modes .map-mode').forEach(b=>{
    const on=b.dataset.mode===mode;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  const cap=document.getElementById('map-caption');
  if(cap) cap.textContent=MAP_MODES[mode].caption;
  if(!_worldMap||!_mapLayers) return; // map not built yet — initWorldMap re-applies
  Object.entries(_mapLayers.byMode).forEach(([m,l])=>{
    if(m===mode) l.group.addTo(_worldMap); else _worldMap.removeLayer(l.group);
  });
  _worldMap.invalidateSize();
  const b=_mapLayers.byMode[mode].bounds;
  if(b.length) _worldMap.fitBounds(L.latLngBounds(b),{padding:[36,36],maxZoom:6});
}

function initWorldMap(){
  if(_worldMap){_worldMap.remove();_worldMap=null;_mapLayers=null;}
  const journeys=buildJourneys();
  const map=L.map('worldMap',{scrollWheelZoom:false}).setView([40,-20],2);
  _worldMap=map;
  addTiles(map);
  // Scroll-zoom is opt-in so the page scroll never gets hijacked:
  // click/tap the map to enable, mouse-out to disable again.
  map.on('click',()=>map.scrollWheelZoom.enable());
  map.getContainer().addEventListener('mouseleave',()=>map.scrollWheelZoom.disable());
  // ⛶ reset control: re-fit the current view's markers
  const Reset=L.Control.extend({options:{position:'topleft'},onAdd(){
    const a=L.DomUtil.create('a','map-reset');
    a.href='#';a.title='Reset view';a.textContent='⛶';
    L.DomEvent.on(a,'click',e=>{L.DomEvent.stop(e);const b=_mapLayers&&_mapLayers.byMode[_mapMode].bounds;if(b&&b.length)map.fitBounds(L.latLngBounds(b),{padding:[36,36],maxZoom:6});});
    return a;
  }});
  map.addControl(new Reset());
  _mapLayers={
    journeys,
    byMode:{
      drank:buildDrankLayer(),
      brewed:buildBrewedLayer(),
      journey:buildJourneyLayer(journeys)
    }
  };
  // Beer names inside popups open the detail modal
  map.on('popupopen',e=>{
    e.popup.getElement().querySelectorAll('[data-open-beer]').forEach(el=>{
      el.addEventListener('click',()=>{if(BEER_REVIEWS.has(el.dataset.openBeer))openBeerModal(el.dataset.openBeer);});
    });
  });
  setMapMode(_mapMode);
}

// ══════════════════════════════════════════════════════════════
// STATS SECTION — hand-rolled visuals, no chart library
// ══════════════════════════════════════════════════════════════
function renderStyleBars(){
  const el=document.getElementById('styleBars');
  el.innerHTML=STATS.styleRanked.map(s=>`
    <div class="hbar-row">
      <span class="hbar-label">${esc(s.s)}</span>
      <span class="hbar-track"><i style="width:${(s.a/5*100).toFixed(1)}%;background:${rColor(s.a)}"></i></span>
      <span class="hbar-value">★ ${s.a.toFixed(2)} <em>· ${s.c} beer${s.c>1?'s':''}</em></span>
    </div>`).join('');
}

function renderCountryBars(){
  const el=document.getElementById('countryBars');
  const byCount=[...STATS.countryRanked].sort((a,b)=>b.c-a.c||b.a-a.a);
  const max=byCount[0]?byCount[0].c:1;
  el.innerHTML=byCount.map(c=>`
    <div class="hbar-row">
      <span class="hbar-label">${c.l}</span>
      <span class="hbar-track"><i style="width:${(c.c/max*100).toFixed(1)}%;background:#E8871E"></i></span>
      <span class="hbar-value">${c.c} <em>· ★ ${c.a.toFixed(2)}</em></span>
    </div>`).join('');
}

function renderTimeline(){
  const el=document.getElementById('timelineCols');
  const {months,byMonth,monthAbbr,monthYearMap}=getMonthlyData();
  const max=Math.max(...months.map(m=>byMonth[m].length),1);
  el.innerHTML=months.map(m=>{
    const n=byMonth[m].length;
    return `<div class="tcol" title="${byMonth[m].length} beers in ${MONTH_FULL[monthAbbr[m]]} ${monthYearMap[m]}">
      <span class="tcol-n">${n}</span>
      <i style="height:${Math.max(6,n/max*100).toFixed(1)}%"></i>
      <span class="tcol-m">${monthAbbr[m]}<br>${String(monthYearMap[m]).slice(2)}</span>
    </div>`;
  }).join('');
}

function renderOnMyList(){
  const el=document.getElementById('watchlistGrid');
  el.innerHTML=IPO_WATCHLIST.map(w=>`
    <div class="wl-card">
      <div class="wl-logo">${cardLogo(w.beer)}</div>
      <div class="wl-name">${esc(w.beer)}</div>
      <div class="wl-meta">${FLAGS[w.origin]||''} ${esc(w.style)} · ${w.abv}%</div>
      <div class="wl-world">The world says ★ ${w.untappd.toFixed(2)}</div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// RENDER ALL — one entry point, also used by the Sheets refresh
// ══════════════════════════════════════════════════════════════
function renderAll(){
  renderHeroStats();
  populateBeerFilters();
  applyBeerFilter();
  renderStyleBars();
  renderCountryBars();
  renderTimeline();
  renderOnMyList();
}

// ══════════════════════════════════════════════════════════════
// GOOGLE SHEETS LOADER — fetches live data and refreshes the page
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
    refreshStats();
    renderAll();
    initWorldMap();
    console.log(`%c[SHEETS] Loaded ${beers.length} beers, ${breweries.length} breweries, ${drunkLocs.length} locations from Google Sheets`,'color:#4C8C2B');
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
// EVENTS + BOOT (script is defer-loaded, so the DOM is ready here)
// ══════════════════════════════════════════════════════════════
try{
  // Beer filters
  document.getElementById('beerSearch').addEventListener('input',applyBeerFilterDebounced);
  ['beerSort','beerStyleFilter','beerOriginFilter'].forEach(id=>
    document.getElementById(id).addEventListener('change',applyBeerFilter));

  // Card grid → modal (click or Enter)
  const grid=document.getElementById('beerGrid');
  grid.addEventListener('click',e=>{
    const card=e.target.closest('.beer-card');
    if(card)openBeerModal(card.dataset.beer);
  });
  grid.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const card=e.target.closest('.beer-card');
    if(card){e.preventDefault();openBeerModal(card.dataset.beer);}
  });

  // Modal close: button, backdrop, Esc — plus a small focus trap
  document.getElementById('beerModalClose').addEventListener('click',closeBeerModal);
  document.getElementById('beerModal').addEventListener('click',e=>{
    if(e.target.id==='beerModal')closeBeerModal();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeBeerModal();
    if(e.key==='Tab'){
      const bm=document.getElementById('beerModal');
      if(!bm.classList.contains('open'))return;
      const f=bm.querySelectorAll('button,[href],input,select,[tabindex]:not([tabindex="-1"])');
      if(!f.length)return;
      const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });

  // Map view pills
  document.querySelectorAll('#map-modes .map-mode').forEach(b=>
    b.addEventListener('click',()=>setMapMode(b.dataset.mode)));

  // Sticky-nav active-link highlight
  const links=[...document.querySelectorAll('.site-nav a[href^="#"]')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window&&secs.length){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(!en.isIntersecting)return;
        links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id));
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(s=>io.observe(s));
  }

  renderAll();
  initWorldMap();
}catch(e){console.error('Boot error:',e);}
