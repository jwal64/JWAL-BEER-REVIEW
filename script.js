// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const FLAGS={ES:"🇪🇸",DE:"🇩🇪",IE:"🇮🇪",JM:"🇯🇲",BE:"🇧🇪",JP:"🇯🇵",NL:"🇳🇱",FR:"🇫🇷",MX:"🇲🇽",CA:"🇨🇦",DK:"🇩🇰",US:"🇺🇸",IT:"🇮🇹",BR:"🇧🇷",CN:"🇨🇳",ZA:"🇿🇦",GR:"🇬🇷",AU:"🇦🇺",SE:"🇸🇪",CZ:"🇨🇿",PT:"🇵🇹",AR:"🇦🇷",GB:"🇬🇧","GB-ENG":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","GB-SCT":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","GB-WLS":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","GB-NIR":"🇬🇧",NO:"🇳🇴",PL:"🇵🇱",TH:"🇹🇭",SG:"🇸🇬",AT:"🇦🇹",PR:"🇵🇷",LB:"🇱🇧",CU:"🇨🇺"};
const CNAMES={DE:"Germany",IE:"Ireland",JM:"Jamaica",BE:"Belgium",JP:"Japan",NL:"Netherlands",FR:"France",MX:"Mexico",CA:"Canada",DK:"Denmark",US:"USA",IT:"Italy",ES:"Spain",BR:"Brazil",CN:"China",ZA:"South Africa",GR:"Greece",AU:"Australia",SE:"Sweden",CZ:"Czech Republic",PT:"Portugal",AR:"Argentina",GB:"Great Britain","GB-ENG":"England","GB-SCT":"Scotland","GB-WLS":"Wales","GB-NIR":"Northern Ireland",NO:"Norway",PL:"Poland",TH:"Thailand",SG:"Singapore",AT:"Austria",PR:"Puerto Rico",LB:"Lebanon",CU:"Cuba"};

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
  {beer:"Belhaven Scottish Stout",style:"Stout",        origin:"GB-SCT",abv:5.2,method:"Nitro", city:"Boston",      region:"Massachusetts",   country:"USA",         cc:"US", rating:3.00,isNew:true, month:"May",monthN:5,year:2026},
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
  // JUL 2026
  {beer:"Stone IPA",             style:"IPA",                  origin:"US",abv:6.9,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:2.50,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Mahou Cinco Estrellas", style:"Lager",                origin:"ES",abv:5.5,method:"Bottle",city:"Boynton Beach",region:"Florida",        country:"USA",         cc:"US", rating:3.50,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Hatuey Lager",          style:"Lager",                origin:"CU",abv:5.0,method:"Bottle",city:"Miami",       region:"Florida",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Pub Ale",               style:"Pale Ale",             origin:"GB-ENG",abv:4.7,method:"Can",   city:"New Rochelle",region:"New York",        country:"USA",         cc:"US", rating:4.25,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Spaten Oktoberfest Ur-Märzen / Winter",style:"Lager", origin:"DE",abv:5.9,method:"Draft", city:"New York",    region:"New York",        country:"USA",         cc:"US", rating:2.75,isNew:true, month:"Jul",monthN:7,year:2026},
  // AUG 2026
  {beer:"Peroni Nastro Azzurro",style:"Lager",          origin:"IT",abv:5.1,method:"Bottle",city:"Ischia",       region:"Campania",        country:"Italy",       cc:"IT", rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"DAB Dortmunder Export",style:"Lager",          origin:"DE",abv:5.0,method:"Draft", city:"Ischia",       region:"Campania",        country:"Italy",       cc:"IT", rating:4.50,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Beck's",                style:"Pilsner",        origin:"DE",abv:4.9,method:"Bottle",city:"Ischia",       region:"Campania",        country:"Italy",       cc:"IT", rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Ichnusa Anima Sarda",   style:"Lager",          origin:"IT",abv:4.7,method:"Bottle",city:"Ischia",       region:"Campania",        country:"Italy",       cc:"IT", rating:3.75,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Chill Lemon",           style:"Shandy / Radler",origin:"IT",abv:2.0,method:"Bottle",city:"Capri",        region:"Campania",        country:"Italy",       cc:"IT", rating:4.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Peroni Original",       style:"Lager",          origin:"IT",abv:4.7,method:"Bottle",city:"Ischia",       region:"Campania",        country:"Italy",       cc:"IT", rating:3.25,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Bitburger Radler",      style:"Shandy / Radler",origin:"DE",abv:2.5,method:"Can",   city:"New Rochelle", region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Radeberger Pilsner",    style:"Pilsner",        origin:"DE",abv:4.8,method:"Bottle",city:"White Plains", region:"New York",        country:"USA",         cc:"US", rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Chimay Blue",           style:"Belgian Ale",    origin:"BE",abv:9.0,method:"Bottle",city:"New Rochelle", region:"New York",        country:"USA",         cc:"US", rating:4.00,isNew:true, month:"Aug",monthN:8,year:2026},
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
  {city:"East Rutherford",region:"New Jersey",        country:"USA",         cc:"US", lat:40.8127,lng:-74.0846},
  {city:"San Juan",    region:"San Juan",             country:"Puerto Rico", cc:"PR", lat:18.4655,lng:-66.1057},
  {city:"Washington",  region:"District of Columbia", country:"USA",         cc:"US", lat:38.9072,lng:-77.0369},
  {city:"Boynton Beach",region:"Florida",             country:"USA",         cc:"US", lat:26.5253,lng:-80.0664},
  {city:"Miami",        region:"Florida",             country:"USA",         cc:"US", lat:25.7617,lng:-80.1918},
  {city:"Ischia",       region:"Campania",            country:"Italy",       cc:"IT", lat:40.7333,lng:13.9500},
  {city:"Capri",        region:"Campania",            country:"Italy",       cc:"IT", lat:40.5532,lng:14.2222},
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
  {name:"Birra Peroni",               location:"Rome, Lazio",           country:"Italy",       cc:"IT", lang:"it", beers:"Peroni Nastro Azzurro · Chill Lemon · Peroni Original",       lat:41.8902,lng:12.4922,  ratings:[3.00,4.00,3.25]},
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
  {name:"Belhaven Brewery",          location:"Dunbar, East Lothian",      country:"Scotland",cc:"GB-SCT", lang:"en", beers:"Belhaven Scottish Stout",                                  lat:56.0006,lng:-2.5176,  ratings:[3.00]},
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
  {name:"Stone Brewing",             location:"Escondido, California",     country:"USA",         cc:"US", lang:"en", beers:"Stone IPA",                                                 lat:33.1192,lng:-117.0864,ratings:[2.50]},
  {name:"Mahou (Grupo Mahou-San Miguel)", location:"Madrid, Madrid",      country:"Spain",       cc:"ES", lang:"es", beers:"Mahou Cinco Estrellas",                                     lat:40.4168,lng:-3.7038,  ratings:[3.50]},
  {name:"Cervecería Hatuey (Bacardí)", location:"Santiago de Cuba, Santiago de Cuba", country:"Cuba", cc:"CU", lang:"es", beers:"Hatuey Lager",                                       lat:20.0247,lng:-75.8219, ratings:[4.00], nativeName:"Cerveza Hatuey"},
  {name:"Boddington's Brewery",      location:"Manchester, Greater Manchester", country:"England", cc:"GB-ENG", lang:"en", beers:"Pub Ale",                                       lat:53.4808,lng:-2.2426,  ratings:[4.25]},
  {name:"Spaten-Franziskaner-Bräu",  location:"Munich, Bavaria",           country:"Germany",     cc:"DE", lang:"de", beers:"Spaten Oktoberfest Ur-Märzen / Winter",             lat:48.1494,lng:11.5567,  ratings:[2.75]},
  {name:"Dortmunder Actien-Brauerei (DAB)", location:"Dortmund, North Rhine-Westphalia", country:"Germany", cc:"DE", lang:"de", beers:"DAB Dortmunder Export",                     lat:51.5136,lng:7.4653,   ratings:[4.50]},
  {name:"Brauerei Beck & Co.",       location:"Bremen, Bremen",             country:"Germany",     cc:"DE", lang:"de", beers:"Beck's",                                                    lat:53.0793,lng:8.8017,   ratings:[3.00]},
  {name:"Birra Ichnusa (Heineken Italia)", location:"Assemini, Sardinia",   country:"Italy",       cc:"IT", lang:"it", beers:"Ichnusa Anima Sarda",                                       lat:39.2803,lng:9.0057,   ratings:[3.75]},
  {name:"Bitburger Braugruppe",      location:"Bitburg, Rhineland-Palatinate", country:"Germany", cc:"DE", lang:"de", beers:"Bitburger Radler",                                          lat:49.9739,lng:6.5334,   ratings:[4.00]},
  {name:"Radeberger Exportbierbrauerei", location:"Radeberg, Saxony",      country:"Germany",     cc:"DE", lang:"de", beers:"Radeberger Pilsner",                                        lat:51.1136,lng:13.9169,  ratings:[3.00]},
  {name:"Bières de Chimay (Scourmont Abbey)", location:"Chimay, Hainaut",   country:"Belgium",     cc:"BE", lang:"fr", beers:"Chimay Blue",                                               lat:50.0489,lng:4.3183,   ratings:[4.00], nativeName:"Chimay Bleue"},
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
"Beck's":"becks.de",
"Birra Moretti":"birramoretti.com",
"Ichnusa Anima Sarda":"ichnusa.com",
"Bitburger Radler":"bitburger.de",
"Bloodline Blood Orange IPA":"flyingdog.com",
"Blue Moon":"bluemoonbrewingcompany.com",
"De Koninck":"dekoninck.be",
"Brahma":"brahma.com.br",
"Bud Light":"budlight.com",
"Budweiser":"budweiser.com",
"Carlsberg":"carlsberg.com",
"Carlsberg Elephant":"carlsberg.com",
"Castle Lager":"castlelager.co.za",
"Chill Lemon":"peroni.it",
"Chimay Blue":"chimay.com",
"Coopers Pale Ale":"coopers.com.au",
"Coors Light":"coorslight.com",
"Corona Extra":"coronausa.com",
"DAB Dortmunder Export":"dab.de",
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
"Hatuey Lager":"hatuey.com",
"Heineken":"heineken.com",
"Hertog Jan":"hertogjan.nl",
"Hoegaarden":"hoegaarden.com",
"IJwit":"brouwerijhetij.nl",
"Kirin Ichiban":"kirin.co.jp",
"Kronenbourg 1664":"1664.com",
"La Chouffe Blonde":"achouffe.be",
"La Fin Du Monde":"unibroue.com",
"Leffe Blonde":"leffe.com",
"Magna":"cerveceradepr.com",
"Mahou Cinco Estrellas":"mahou.es",
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
"Peroni Original":"peroni.it",
"Newcastle Brown":"newcastlebrown.com",
"Norrlands Guld":"norrlandsguld.se",
"Ocean SJU":"oceanlabbrewing.com",
"Orion":"orionbeer.co.jp",
"Pacífico Clara":"drinkpacifico.com",
"Paulaner Hefe":"paulaner.com",
"Paulaner Hefe-Weißbier":"paulaner.com",
"Peroni":"peroni.it",
"Pilsner Urquell":"prazdroj.cz",
"Pub Ale":"boddingtons.co.uk",
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
"Spaten Oktoberfest Ur-Märzen / Winter":"spatenbraeu.de",
"Stella Artois":"stellaartois.com",
"Stiegl Goldbräu":"stiegl.at",
"Stone IPA":"stonebrewing.com",
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
// ── DESIGN TOKENS ──
// The single source of truth for every color JS hands to Chart.js, Leaflet or an
// inline style. These mirror the custom properties in style.css; keep the two in
// step. Canvas and Leaflet can't read CSS variables, hence the literal values.
const THEME={
  bg:'#0b0d12', surface:'#13161d', surface2:'#1a1e27', surface3:'#212632',
  border:'#232833', borderStrong:'#2f3644',
  text:'#e8eaef', text2:'#9aa3b2', text3:'#6b7382',
  accent:'#f5a524', accentHi:'#ffc35c',
  pos:'#3ecf8e', neg:'#f87171', warn:'#fbbf24', info:'#60a5fa', purple:'#a78bfa',
  // Chart-specific roles
  grid:'#232833',      // axis grid lines
  tick:'#6b7382',      // numeric axis ticks
  label:'#9aa3b2',     // category axis labels
  axisTitle:'#6b7382'
};

// Style palette — muted, evenly spaced hues that sit on a charcoal canvas.
const sC={"Lager":"#f0b429","Pilsner":"#e8c547","Wheat Beer":"#f6d365","Belgian Ale":"#c084fc","IPA":"#fb923c","Pale Ale":"#a3d977","Stout":"#8b7355","Brown Ale":"#b08968","Red Ale":"#ef7d6b","Shandy / Radler":"#facc15"};
function rbC(r){return r>=4.5?"r5":r>=4?"r4":r>=3.5?"r35":r>=3?"r3":r>=2.5?"r25":"r2";}
// Rating ramp: red → amber → green. Matches the .r5….r2 badge colors in style.css.
function rC(r){return r>=4.5?"#4ade80":r>=4?"#86d96e":r>=3.5?"#d2c94a":r>=3?"#f0b34a":r>=2.5?"#f08b52":"#f2707c";}
function strs(r){const f=Math.floor(r),h=(r%1)>=.5;return"★".repeat(f)+(h?"½":"")+"☆".repeat(5-f-(h?1:0));}
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const std=a=>{if(!a.length)return 0;const m=avg(a);return Math.sqrt(avg(a.map(v=>(v-m)**2)));};

// Source chain priority: local override → Brandfetch → Google favicons → Icon
// Horse → 🍺 emoji span. Walk via dataset.f counter; each failure advances to
// the next available source.
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
  const emojiSpan=`<span style="display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle;margin-right:6px">🍺</span>`;
  const sources=logoSources(name);
  if(!sources.length)return emojiSpan;
  const emojiReplace=`this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{textContent:'🍺',style:'display:inline-block;width:${size}px;text-align:center;font-size:${size*.6}px;vertical-align:middle;margin-right:6px'}));`;
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

const MONTH_FULL = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const MONTH_COLORS = ['#f5a524','#60a5fa','#3ecf8e','#a78bfa','#fbbf24','#f87171','#2dd4bf','#f472b6','#7dd3fc','#fb923c','#c084fc','#a3d977'];

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
  const monthColors=months.map((_,i)=>MONTH_COLORS[i%MONTH_COLORS.length]);
  const monthLabels=months.map(m=>`${MONTH_FULL[monthAbbr[m]]||monthAbbr[m]} ${monthYearMap[m]||''}`);
  return {months,byMonth,monthColors,monthLabels,monthYearMap,monthAbbr};
}

// ══════════════════════════════════════════════════════════════
// MINIMUM SAMPLE SIZE — one pour is an anecdote, not a ranking
// ══════════════════════════════════════════════════════════════
// A group (country, city, brewing language, style, serving method, brewery)
// has to clear MIN_N reviews before its average is allowed to win or lose a
// ranking. Without this, a country visited once tops the table on a single
// generous pour and a style tried once is "my weakest".
//
// Thin groups are never hidden — they still chart, still list, still count
// toward the totals. They just sort below everything that qualifies and are
// drawn muted, so the eye reads them as "not enough data yet" rather than as
// a result. Raise MIN_N here and every ranking plus every on-screen caption
// follows; nothing else hardcodes the number.
const MIN_N=3;
const thin=n=>n<MIN_N;
// Sort comparator for a ranked list: everything that clears MIN_N first (best
// average first), then the thin groups among themselves. `a` and `c` are
// accessors for a group's average and its review count.
const rankBy=(a,c)=>(x,y)=>(thin(c(x))-thin(c(y)))||(a(y)-a(x));
// The slice of an already-ranked list that may be called best or worst. Falls
// back to the whole list when nothing qualifies yet, so a young dataset still
// shows a headline instead of an em dash.
const rankable=(list,c=o=>o.c)=>{const q=list.filter(o=>!thin(c(o)));return q.length?q:list;};
// A thin group keeps its bar but loses its saturation — present, not ranked.
// Every palette entry is 6-digit hex, so the alpha suffix is safe.
const barFill=(hex,n)=>thin(n)?hex+'33':hex;
// Sample size after a chart label. Kept to just the number so it stays legible
// on a phone — the muted bar and the tooltip carry the "not ranked" part.
const nLabel=n=>`(${n})`;
// Panel captions state the rule from the same constant that enforces it.
// <span data-minn> → "3+ reviews to rank"; data-minn="Average" prefixes it.
function stampMinNHints(root=document){
  root.querySelectorAll('[data-minn]').forEach(el=>{
    const pre=el.dataset.minn;
    el.textContent=(pre?pre+' · ':'')+`${MIN_N}+ reviews to rank`;
  });
}

// ══════════════════════════════════════════════════════════════
// PRE-COMPUTED STATISTICS — recomputed when data loads from Sheets
// ══════════════════════════════════════════════════════════════
function computeStats(){
  const styleMap={},methodMap={},countryMap={},cityMap={},brandMap={},brandStats={};
  let ratingSum=0;

  // Single pass over beers — build aggregation maps AND track per-brand min/max
  // so brandList doesn't need Math.max(...rs) / Math.min(...rs) (which spread every rating array)
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

  // Ranked lists are sorted MIN_N-qualified first, then by average — so [0] is
  // always a result and never a one-pour outlier. Thin groups keep their place
  // at the tail rather than being dropped.
  const byAvg=rankBy(o=>o.a,o=>o.c);
  const styleRanked=Object.entries(styleMap).map(([s,v])=>({s,a:v.t/v.c,c:v.c})).sort(byAvg);
  const METHOD_ORDER=['Draft','Nitro','Bottle','Can'];
  const methodAvgs=METHOD_ORDER.map(m=>methodMap[m]?+(methodMap[m].t/methodMap[m].c).toFixed(2):0);
  const methodCounts=METHOD_ORDER.map(m=>methodMap[m]?methodMap[m].c:0);
  const countryRanked=Object.entries(countryMap).map(([k,v])=>({l:`${FLAGS[k]||''} ${CNAMES[k]||k}`,code:k,a:v.t/v.c,c:v.c})).sort(byAvg);
  const cityRanked=Object.entries(cityMap).map(([k,v])=>({city:k,region:v.region,country:v.country,cc:v.cc,a:v.t/v.c,c:v.c})).sort(byAvg);
  const brandList=Object.entries(brandMap).map(([n,rs])=>({n,cnt:rs.length,avg:avg(rs),best:brandStats[n].best,worst:brandStats[n].worst,std:std(rs)})).sort((a,b)=>b.avg-a.avg);
  const sorted=[...beers].sort((a,b)=>b.rating-a.rating);
  const globalAvg=beers.length?ratingSum/beers.length:0;

  return {styleMap,styleRanked,METHOD_ORDER,methodMap,methodAvgs,methodCounts,countryMap,countryRanked,cityMap,cityRanked,brandMap,brandList,sorted,globalAvg};
}

// ── Lookup indexes — replace O(n) .filter/.find on hot paths
// Rebuild alongside STATS whenever the data arrays mutate.
const LANG_NAMES_IDX={en:"English",de:"German",nl:"Dutch",fr:"French",ja:"Japanese",es:"Spanish",da:"Danish",cs:"Czech",it:"Italian",pl:"Polish",pt:"Portuguese",sv:"Swedish",no:"Norwegian",zh:"Chinese",th:"Thai",el:"Greek",af:"Afrikaans",ar:"Arabic"};
// Language tab — country-code → language fallback when a beer's brewery has no lang
const LANG_MAP_FALLBACK={DE:"German",NL:"Dutch",BE:"Dutch",US:"English",IE:"English",JM:"English",CA:"French",FR:"French",JP:"Japanese",MX:"Spanish",DK:"Danish",ES:"Spanish",CZ:"Czech",IT:"Italian",PL:"Polish",PT:"Portuguese",AT:"German",LB:"Arabic",GR:"Greek"};
const LANG_COLORS={"German":"#f5a524","Dutch":"#60a5fa","English":"#3ecf8e","French":"#a78bfa","Japanese":"#f87171","Spanish":"#fbbf24","Danish":"#94a3b8","Czech":"#2dd4bf","Italian":"#f472b6","Polish":"#e06c75","Portuguese":"#fb923c","Swedish":"#7dd3fc","Norwegian":"#818cf8","Chinese":"#ef4444","Thai":"#c084fc","Greek":"#38bdf8","Afrikaans":"#4ade80","Arabic":"#fca5a5"};
const LANG_FLAGS={"German":"🇩🇪","Dutch":"🇳🇱","English":"🇬🇧","French":"🇫🇷","Japanese":"🇯🇵","Spanish":"🇪🇸","Danish":"🇩🇰","Czech":"🇨🇿","Italian":"🇮🇹","Polish":"🇵🇱","Portuguese":"🇵🇹","Swedish":"🇸🇪","Norwegian":"🇳🇴","Chinese":"🇨🇳","Thai":"🇹🇭","Greek":"🇬🇷","Afrikaans":"🇿🇦","Arabic":"🇱🇧"};
let BEER_REVIEWS=new Map();       // beer name → [reviews]
let BREWERY_BY_NAME=new Map();    // brewery name → brewery
let breweries_BY_CC=new Map();    // country code → [breweries]
let BEER_LANG_LOOKUP={};          // beer name → language label
let BREW_LOC={};                  // beer name → brewery location string
function buildIndexes(){
  BEER_REVIEWS=new Map();
  for(const b of beers){
    let arr=BEER_REVIEWS.get(b.beer);
    if(!arr){arr=[];BEER_REVIEWS.set(b.beer,arr);}
    arr.push(b);
  }
  BREWERY_BY_NAME=new Map();
  breweries_BY_CC=new Map();
  BEER_LANG_LOOKUP={};
  BREW_LOC={};
  for(const br of breweries){
    BREWERY_BY_NAME.set(br.name,br);
    let ccArr=breweries_BY_CC.get(br.cc);
    if(!ccArr){ccArr=[];breweries_BY_CC.set(br.cc,ccArr);}
    ccArr.push(br);
    const langName=LANG_NAMES_IDX[br.lang]||br.lang;
    for(const raw of br.beers.split(' · ')){
      const n=raw.trim();
      BEER_LANG_LOOKUP[n]=langName;
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

// ══════════════════════════════════════════════════════════════
// "NEW" DISPLAY — only show NEW tag for beers reviewed in the current month
// Recompute the date on every call so a long-lived tab crossing midnight
// on a month boundary re-flags correctly without a reload.
// ══════════════════════════════════════════════════════════════
function isDisplayNew(b){
  if(!b.isNew) return false;
  const n=new Date();
  return b.monthN===n.getMonth()+1 && b.year===n.getFullYear();
}

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
  // Single pass: sum ABV, find min/max, count new + hits
  let abvSum=0,minAbv=Infinity,maxAbv=-Infinity,newCount=0,hitCount=0;
  for(const b of beers){
    abvSum+=b.abv;
    if(b.abv<minAbv)minAbv=b.abv;
    if(b.abv>maxAbv)maxAbv=b.abv;
    if(isDisplayNew(b))newCount++;
    if(b.rating>=3)hitCount++;
  }
  const avgAbv = beers.length?abvSum/beers.length:0;
  const hitRate = beers.length?Math.round(hitCount/beers.length*100):0;

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  // Context bar — running totals, always visible whichever page you're on
  const sub = document.getElementById('hdr-subtitle');
  if(sub) sub.innerHTML =
    [[totalReviews,'reviews'],[totalBrands,'brands'],[totalMarkets,'cities'],[avgRating.toFixed(2)+'★','avg']]
      .map(([v,l])=>`<span class="tb-stat"><b>${v}</b><span class="tb-stat-lbl">${l}</span></span>`).join('');
  // Overview KPI tiles
  set('ov-top-val',  topBeer.rating.toFixed(2));
  set('ov-top-sub',  `${topBeer.beer} · ${topBeer.origin}`);
  set('ov-avg-val',  avgRating.toFixed(2));
  set('ov-avg-sub',  `${totalReviews} total reviews`);
  set('ov-low-val',  lowBeer.rating.toFixed(2));
  set('ov-low-sub',  `${lowBeer.beer} · ${lowBeer.origin}`);
  set('ov-abv-val',  avgAbv.toFixed(1)+'%');
  set('ov-abv-sub',  `Range: ${minAbv.toFixed(1)}–${maxAbv.toFixed(1)}%`);
  set('ov-brands-val', totalBrands);
  set('ov-brands-sub', `Across ${totalCtry} countries`);
  set('ov-hit-val',  hitRate+'%');
  set('ov-hit-sub',  `${hitCount} of ${totalReviews} rated 3★ or better`);
  // BEERS tab
  set('beers-count', `${totalReviews} reviews${newCount?` · ${newCount} new`:''}`);
  set('brands-count', `${totalBrands} unique brands`);
  const newTag = document.getElementById('beers-new-tag');
  if(newTag) newTag.textContent = newCount ? `${newCount} new` : '';
}
try { updateLiveStats(); } catch(e){ console.error('Live stats error:',e); }
try { stampMinNHints(); } catch(e){ console.error('Min-n hint error:',e); }

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
    refreshStats();
    // Reset all lazy-loaded tab flags so they re-render with new data
    ['_cD','_ciD','_inD','_tmpD','_ciX','_ipoD','_dM','_langD']
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

// ── KEYBOARD SHORTCUTS (1-6 / F1-F6 for tabs; Esc for modal)
(function(){
  const tabMap={
    '1':'overview','2':'beers','3':'maps','4':'insights',
    'f1':'overview','f2':'beers','f3':'maps','f4':'insights',
    // Legacy keys still jump straight to the relevant Insights sub-section
    '5':'temporal','6':'markets','f5':'temporal','f6':'markets'
  };
  document.addEventListener('keydown',function(ev){
    if(ev.target.tagName==='INPUT'||ev.target.tagName==='TEXTAREA'||ev.target.tagName==='SELECT') return;
    if(ev.key==='Escape'){closeBeerModal();closeBreweryDrawer();return;}
    const tab=tabMap[ev.key.toLowerCase()];
    if(tab&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();showTab(tab);}
  });
})();

// ── TAB
(function initTabA11y(){
  try{
    const sb=document.getElementById('sidebar'); if(sb) sb.setAttribute('role','tablist');
    document.querySelectorAll('.nav-item').forEach(el=>{
      const tab=el.dataset.tab; if(!tab) return;
      el.setAttribute('role','tab');
      el.setAttribute('tabindex','0');
      el.setAttribute('aria-selected',el.classList.contains('active')?'true':'false');
      if(!el.getAttribute('aria-label')) el.setAttribute('aria-label',tab.replace(/^./,c=>c.toUpperCase())+' tab');
    });
  }catch(e){}
})();
// Tab navigation is static after load — query once instead of on every switch.
const TAB_PANELS=[...document.querySelectorAll('#main > .panel')];
const NAV_ITEMS=[...document.querySelectorAll('.nav-item')];
const BN_ITEMS=[...document.querySelectorAll('#bottomnav .bn-item')];
// Geography / Over-time / What-to-try now live as sub-sections inside the
// single INSIGHTS tab. Asking for one of these jumps to Insights + that sub.
const INSIGHTS_SUBS=['geo','temporal','markets'];
let _insightsSub='geo';
// The context bar restates where you are and what the page is for — the old
// header said the same thing on all four tabs.
const TAB_CONTEXT={
  overview:['Home','The highlights at a glance.'],
  beers:   ['All beers','Every review, searchable and sortable.'],
  maps:    ['Map','Where these beers are brewed and where I drank them.'],
  insights:['Insights','Places, trends over time and what to try next.']
};
function setTabContext(id){
  const c=TAB_CONTEXT[id]; if(!c) return;
  const t=document.getElementById('tb-title'), d=document.getElementById('tb-desc');
  if(t) t.textContent=c[0];
  if(d) d.textContent=c[1];
}
function showTab(id,btn){
  // Redirect legacy sub-section ids into the Insights tab
  if(INSIGHTS_SUBS.includes(id)){ _insightsSub=id; showTab('insights',btn); return; }
  TAB_PANELS.forEach(p=>p.classList.toggle('active',p.id===id));
  setTabContext(id);
  // Every panel shares one scroll position — start each at the top. #main is the
  // scroller on desktop; on phones the shell unfolds and the window scrolls.
  const mainEl=document.getElementById('main');
  if(mainEl) mainEl.scrollTop=0;
  try{ window.scrollTo(0,0); }catch(e){}
  NAV_ITEMS.forEach(n=>{n.classList.remove('active');n.setAttribute('aria-selected','false');});
  BN_ITEMS.forEach(b=>{const on=b.dataset.tab===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');});
  // Sync the rail: handles both click (btn passed) and keyboard (btn undefined)
  const navEl=btn&&btn.classList.contains('nav-item')?btn:
    NAV_ITEMS.find(n=>n.dataset.tab===id);
  if(navEl){navEl.classList.add('active');navEl.setAttribute('aria-selected','true');}
  // Insights renders whichever sub-section is current; it also owns the URL hash.
  if(id==='insights'){ showInsightsSubtab(_insightsSub); return; }
  // Deep-linkable tabs: reflect the active tab in the URL without polluting
  // history (replaceState never fires hashchange, so no feedback loop).
  // Throws on file:// in some browsers — degrade silently.
  try{history.replaceState(null,'','#'+id);}catch(e){}
  const renderers = {
    maps: [
      ['_dM',()=>{window._dM=true;setTimeout(initWorldMap,80);}],
    ],
  };
  (renderers[id]||[]).forEach(([flag,fn])=>{ if(!window[flag]) fn(); });
  // Charts built while their panel was hidden sized to 0px — fix them whenever
  // a panel becomes visible.
  resizeChartsIn(document.getElementById(id));
  if(id==='maps'&&_worldMap&&_worldMap.invalidateSize) setTimeout(()=>_worldMap.invalidateSize(),50);
}

// ── INSIGHTS SUB-SECTIONS (Places / Over time / What to try within F4)
function showInsightsSubtab(name){
  if(!INSIGHTS_SUBS.includes(name)) name='geo';
  _insightsSub=name;
  document.querySelectorAll('#insights > .subtabs .subtab').forEach(b=>{
    const on=b.dataset.subtab===name;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  document.querySelectorAll('#insights > .subpanel').forEach(p=>{
    p.classList.toggle('active',p.id===name);
  });
  // Lazy-render the active sub-section (each draw fn sets its own guard flag)
  if(name==='geo'){
    if(!window._cD) drawCountry();
    if(!window._ciD) drawCity();
    if(!window._langD) drawLanguage();
  } else if(name==='temporal'){
    if(!window._tmpD) drawTemporal();
  } else if(name==='markets'){
    if(!window._ciX) drawContrarian();
    if(!window._ipoD) drawIPO();
    if(!window._recD) drawRecommendations();
  }
  resizeChartsIn(document.getElementById(name));
  try{history.replaceState(null,'','#'+name);}catch(e){}
}

// (Map view switching lives in setMapMode, defined in the MAP section.)

// ── CHART DEFAULTS
try {
  Chart.defaults.color=THEME.text2;
  Chart.defaults.borderColor=THEME.border;
  Chart.defaults.font.family="'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
  Chart.defaults.font.size=12;
  Chart.defaults.devicePixelRatio=Math.max(window.devicePixelRatio||1,2);
  Chart.defaults.elements.point.radius=3;
  Chart.defaults.elements.point.hoverRadius=5;
  Chart.defaults.elements.line.borderWidth=2;
  Chart.defaults.elements.bar.borderWidth=0;
  Chart.defaults.animation.duration=400;
  // Every chart lives inside a .chart-box of known height, so the canvas takes
  // its size from CSS. Left on (the Chart.js default), a full-width chart sizes
  // its height from its own width and a bar chart can run 900px tall.
  Chart.defaults.maintainAspectRatio=false;
  // Respect OS-level reduced-motion preference
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) Chart.defaults.animation=false;
} catch(e){ console.error('Chart.defaults error:',e); }
const _charts={};
function safeChart(key,ctx,cfg){
  if(!ctx) return null;
  if(_charts[key]) _charts[key].destroy();
  // Horizontal bar charts have one row per label, so their container height has
  // to follow the data — 9 styles and 22 countries can't share a fixed box.
  // .chart-box-auto reads --rows; boxes with a fixed height simply ignore it.
  try{
    if(cfg&&cfg.options&&cfg.options.indexAxis==='y'){
      const box=ctx.closest&&ctx.closest('.chart-box');
      const rows=cfg.data&&cfg.data.labels?cfg.data.labels.length:0;
      if(box&&rows) box.style.setProperty('--rows',rows);
    }
  }catch(e){}
  // A rotated axis title needs vertical room a phone's 220px chart box doesn't
  // have, and Chart.js clips it ("eviews") rather than dropping it. Below the
  // phone breakpoint the titles come off — the panel heading and its hint
  // already say what the axes are.
  try{
    if(window.innerWidth<=700&&cfg&&cfg.options&&cfg.options.scales){
      for(const sc of Object.values(cfg.options.scales)) if(sc&&sc.title) sc.title.display=false;
    }
  }catch(e){}
  _charts[key]=new Chart(ctx,cfg);
  return _charts[key];
}
// Charts built while their container is display:none size to 0px. Call this once
// the container becomes visible (tab shown / collapse opened) to fix their layout.
function resizeChartsIn(el){
  if(!el) return;
  for(const ch of Object.values(_charts)){
    if(ch&&ch.canvas&&el.contains(ch.canvas)) ch.resize();
  }
}
const TT={backgroundColor:THEME.surface3,borderColor:THEME.borderStrong,borderWidth:1,titleColor:THEME.text,bodyColor:THEME.text2,padding:10,cornerRadius:8,displayColors:false,titleFont:{weight:'600'}};
// Tooltip for a ranked average: always states how many reviews are behind the
// bar, and spells out when that's too few to count. `n` reads the sample size
// for a bar index — either from the row objects or from a parallel count array.
const ttWithN=n=>({...TT,callbacks:{label:c=>{
  const k=typeof n==='function'?n(c.dataIndex):n[c.dataIndex];
  return `${(+c.raw).toFixed(2)}/5 · ${k} review${k===1?'':'s'}${thin(k)?` · under ${MIN_N}, not ranked`:''}`;
}}});

// ══════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════
try {
// Use pre-computed statistics. DOM-only panels render first so a Chart.js
// load failure can't take the text content down with it.
const sA=STATS.styleRanked;
const mO=STATS.METHOD_ORDER, mA=STATS.methodAvgs, mCt=STATS.methodCounts;

// Live Pearson r for the scatter panel header (was previously hardcoded)
{
  const mx=avg(beers.map(b=>b.abv)),my=avg(beers.map(b=>b.rating));
  let num=0,dx=0,dy=0;
  beers.forEach(b=>{const a=b.abv-mx,r=b.rating-my;num+=a*r;dx+=a*a;dy+=r*r;});
  const pr=dx&&dy?num/Math.sqrt(dx*dy):0,ab=Math.abs(pr);
  const corrLabel=ab<0.2?'no significant correlation':ab<0.4?'weak correlation':ab<0.6?'moderate correlation':'strong correlation';
  const corrEl=document.getElementById('scatterCorr');
  if(corrEl) corrEl.textContent=`r ≈ ${pr.toFixed(2)} · ${corrLabel}`;
}

// Dynamic market signals — every "best"/"worst" here is drawn from the groups
// that clear MIN_N, so a single 5.00 pour in a city visited once can't take the
// headline off a market with a real track record.
const styleQ=rankable(STATS.styleRanked);
const bestStyle=styleQ[0];
const worstStyle=styleQ[styleQ.length-1];
const topCountry=rankable(STATS.countryRanked)[0];
const topCity=rankable(STATS.cityRanked)[0];
const methodQ=rankable(mO.map((m,i)=>({m,a:mA[i],c:mCt[i]})).filter(x=>x.c),o=>o.c)
  .sort((x,y)=>y.a-x.a);
const bestMethodRow=methodQ[0]||{m:'—',a:0,c:0};
const bestMethod=bestMethodRow.m, bestMethodAvg=bestMethodRow.a, bestMethodCt=bestMethodRow.c;

const last5=beers.slice(-5).map(b=>b.rating);
const prev5=beers.slice(-10,-5).map(b=>b.rating);
const trendDelta=last5.length&&prev5.length?avg(last5)-avg(prev5):0;
const trendLabel=trendDelta>0.1?'Rising':trendDelta<-0.1?'Declining':'Flat';
const trendCls=trendDelta>0.1?'up':trendDelta<-0.1?'dn':'fl';

document.getElementById('mktPanel').innerHTML=`
  <div class="insight-row"><span class="insight-key">Best style</span><div><div class="insight-val up">${bestStyle.s}</div><div class="insight-sub">${bestStyle.a.toFixed(2)} avg · ${bestStyle.c} review${bestStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Weakest style</span><div><div class="insight-val dn">${worstStyle.s}</div><div class="insight-sub">${worstStyle.a.toFixed(2)} avg · ${worstStyle.c} review${worstStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Top country</span><div><div class="insight-val">${topCountry.l}</div><div class="insight-sub">${topCountry.a.toFixed(2)} avg · ${topCountry.c} review${topCountry.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Top city</span><div><div class="insight-val">${topCity.city}, ${topCity.region}</div><div class="insight-sub">${topCity.a.toFixed(2)} avg · ${topCity.c} review${topCity.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Best method</span><div><div class="insight-val">${bestMethod}</div><div class="insight-sub">${bestMethodAvg.toFixed(2)} avg · ${bestMethodCt} review${bestMethodCt>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Trend</span><div><div class="insight-val ${trendCls}">${trendLabel}</div><div class="insight-sub">5-review rolling average · ${Object.keys(STATS.countryMap).length} countries · ${Object.keys(STATS.cityMap).length} cities</div></div></div>`;

// Recent activity feed — last 6 pours, newest first (beers[] is chronological)
const recentEl=document.getElementById('recentFeed');
if(recentEl) recentEl.innerHTML=[...beers].slice(-6).reverse().map(b=>`
  <div class="feed-row" data-beer="${b.beer.replace(/"/g,'&quot;')}" role="button" tabindex="0">
    ${logoImg(b.beer,20)}
    <div class="feed-main">
      <span class="feed-name">${b.beer}${isDisplayNew(b)?'<span class="new-tag">New</span>':''}</span>
      <span class="feed-meta">${b.style} · ${b.method} · ${b.city} · ${b.month} ${b.year}</span>
    </div>
    <span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span>
  </div>`).join('');

// Month in review — latest month vs the one before
{
  const {months:mKeys,byMonth:mBuckets,monthLabels:mLabels}=getMonthlyData();
  const lastK=mKeys[mKeys.length-1],prevK=mKeys[mKeys.length-2];
  const cur=lastK?mBuckets[lastK]:[];
  const mirEl=document.getElementById('mirPanel');
  if(mirEl&&cur.length){
    const curAvg=avg(cur.map(b=>b.rating));
    const prevAvg=prevK?avg(mBuckets[prevK].map(b=>b.rating)):null;
    const dAvg=prevAvg!=null?curAvg-prevAvg:null;
    const best=cur.reduce((a,b)=>b.rating>a.rating?b:a);
    const worst=cur.reduce((a,b)=>b.rating<a.rating?b:a);
    const curSet=new Set(cur);
    const earlier=new Set(beers.filter(b=>!curSet.has(b)).map(b=>b.beer));
    const newBrands=[...new Set(cur.map(b=>b.beer))].filter(n=>!earlier.has(n)).length;
    const lbl=document.getElementById('mirLabel');
    if(lbl) lbl.textContent=(mLabels[mLabels.length-1]||'');
    const dCls=dAvg==null?'fl':dAvg>0.05?'up':dAvg<-0.05?'dn':'fl';
    const dTxt=dAvg==null?'First month on record':`${dAvg>=0?'+':''}${dAvg.toFixed(2)} vs prior month`;
    const pourRow=(key,b,cls)=>`
      <div class="insight-row"><span class="insight-key">${key}</span>
        <div class="feed-row mir-pour" data-beer="${b.beer.replace(/"/g,'&quot;')}" role="button" tabindex="0">
          ${logoImg(b.beer,18)}
          <div class="feed-main"><span class="feed-name">${b.beer}</span><span class="feed-meta">${b.style} · ${b.method}</span></div>
          <span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span>
        </div></div>`;
    mirEl.innerHTML=`
      <div class="insight-row"><span class="insight-key">Reviews</span><div><div class="insight-val">${cur.length}</div><div class="insight-sub">${newBrands} first-time brand${newBrands===1?'':'s'}</div></div></div>
      <div class="insight-row"><span class="insight-key">Month average</span><div><div class="insight-val ${dCls}">${curAvg.toFixed(2)}</div><div class="insight-sub">${dTxt}</div></div></div>
      ${pourRow('Best pour',best)}
      ${best!==worst?pourRow('Worst pour',worst):''}`;
  }
}

// ── Charts (everything below needs Chart.js) ──
safeChart('styleChart',document.getElementById('styleChart'),{type:'bar',
  data:{labels:sA.map(s=>`${s.s.length>16?s.s.slice(0,16)+'…':s.s} ${nLabel(s.c)}`),datasets:[{data:sA.map(s=>s.a),backgroundColor:sA.map(s=>barFill(sC[s.s]||THEME.accent,s.c)),borderWidth:0}]},
  options:{indexAxis:'y',maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:ttWithN(i=>sA[i].c)},scales:{x:{min:0,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}},y:{grid:{display:false},ticks:{color:THEME.label,font:{size:11}}}}}
});

safeChart('methodChart',document.getElementById('methodChart'),{type:'bar',
  data:{labels:mO.map((m,i)=>`${m} ${nLabel(mCt[i])}`),datasets:[{data:mA,backgroundColor:[THEME.accent,THEME.info,THEME.purple,THEME.text3].map((c,i)=>barFill(c,mCt[i])),borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:ttWithN(mCt)},scales:{y:{min:0,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}},x:{grid:{display:false},ticks:{color:THEME.label}}}}
});

safeChart('scatterChart',document.getElementById('scatterChart'),{type:'scatter',
  data:{datasets:[{data:beers.map(b=>({x:b.abv,y:b.rating,label:b.beer})),backgroundColor:beers.map(b=>sC[b.style]||THEME.accent),pointRadius:5,pointHoverRadius:8,borderWidth:0}]},
  options:{plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw.label} | ${c.raw.x}% ABV | ${c.raw.y}/5`}}},
    scales:{x:{title:{display:true,text:'ABV (%)',color:THEME.axisTitle},min:3.5,max:10,grid:{color:THEME.grid},ticks:{color:THEME.tick}},
            y:{title:{display:true,text:'Rating',color:THEME.axisTitle},min:1.5,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}}}}
});

// Monthly flow — review volume bars + avg-rating line
{
  const {months:cm,byMonth:cb,monthColors:cc,monthAbbr:ca}=getMonthlyData();
  const counts=cm.map(m=>cb[m].length);
  const avgs=cm.map(m=>+avg(cb[m].map(b=>b.rating)).toFixed(2));
  safeChart('monthlyCombo',document.getElementById('monthlyCombo'),{
    data:{labels:cm.map(m=>ca[m]),datasets:[
      {type:'bar',label:'Reviews',data:counts,backgroundColor:cc.map(c=>c+'33'),borderColor:cc,borderWidth:2,yAxisID:'y'},
      {type:'line',label:'Avg Rating',data:avgs,borderColor:THEME.warn,backgroundColor:'transparent',pointBackgroundColor:avgs.map(r=>rC(r)),pointRadius:5,pointBorderColor:THEME.bg,pointBorderWidth:1,tension:0.3,yAxisID:'y2'}
    ]},
    options:{plugins:{legend:{display:false},tooltip:TT},
      scales:{y:{grid:{color:THEME.grid},ticks:{color:THEME.tick,stepSize:5}},
              y2:{position:'right',min:0,max:5,grid:{display:false},ticks:{color:THEME.warn}},
              x:{grid:{display:false},ticks:{color:THEME.label}}}}
  });
}

// Rating distribution — quarter-point histogram colored by rating band
{
  const histCounts={};
  beers.forEach(b=>{const k=b.rating.toFixed(2);histCounts[k]=(histCounts[k]||0)+1;});
  const histKeys=[];
  for(let r=1.75;r<=5.001;r+=0.25)histKeys.push(r.toFixed(2));
  safeChart('ratingHist',document.getElementById('ratingHist'),{type:'bar',
    data:{labels:histKeys,datasets:[{data:histKeys.map(k=>histCounts[k]||0),backgroundColor:histKeys.map(k=>rC(+k)+'cc'),borderWidth:0}]},
    options:{plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw} review${c.raw===1?'':'s'} @ ${c.label}`}}},
      scales:{y:{grid:{color:THEME.grid},ticks:{color:THEME.tick,stepSize:1}},
              x:{grid:{display:false},ticks:{color:THEME.tick,font:{size:8},maxRotation:60,minRotation:60}}}}
  });
}
} catch(e){ console.error('Overview init error:',e); }

// Insights panels (stat summary / quintiles / taste profile) now live on the
// Overview tab, which renders eagerly at load — so draw them up front too.
try { drawInsights(); } catch(e){ console.error('Insights init error:',e); }

// ══════════════════════════════════════════════════════════════
// BEER TABLE + GRID
// ══════════════════════════════════════════════════════════════
function renderTable(data){
  try {
    const countEl=document.getElementById('beerFilterCount');
    if(countEl) countEl.textContent=`${data.length} of ${beers.length}`;
    if(!data.length){
      document.getElementById('beerBody').innerHTML=
        `<tr><td colspan="10" class="bb-empty">No beers match your filters
          <button type="button" id="beerFilterReset">Clear filters</button></td></tr>`;
      return;
    }
    document.getElementById('beerBody').innerHTML=data.map(b=>`
      <tr${isDisplayNew(b)?' class="new-row"':''} style="cursor:pointer" data-beer="${b.beer.replace(/"/g,'&quot;')}">
        <td>${logoImg(b.beer,24)}</td>
        <td style="color:var(--text);font-weight:600"><span class="beer-name-cell">${b.beer}</span>${isDisplayNew(b)?`<span class="new-tag">New</span>`:''}</td>
        <td style="color:var(--text-3);font-size:12px">${b.style}</td>
        <td>${FLAGS[b.origin]||''} ${b.origin}</td>
        <td style="color:var(--info)">${b.abv.toFixed(1)}%</td>
        <td style="color:var(--text-3)">${b.method}</td>
        <td style="color:var(--text-3)">${b.city}, ${b.region} · ${FLAGS[b.cc]||''} ${b.country}</td>
        <td style="color:var(--text-3)">${b.month} ${b.year}</td>
        <td><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span></td>
        <td style="color:var(--accent-hi);font-size:12px">${strs(b.rating)}</td>
      </tr>`).join('');
  } catch(e){ console.error('renderTable error:',e); }
}
// Column sorting state — clicking a table header sorts by that column,
// clicking it again reverses. Numeric/date columns default to descending.
const beerSort={key:'rating',dir:-1};
const BEER_SORT_CMP={
  beer:(a,b)=>a.beer.localeCompare(b.beer),
  style:(a,b)=>a.style.localeCompare(b.style),
  origin:(a,b)=>a.origin.localeCompare(b.origin),
  abv:(a,b)=>a.abv-b.abv,
  method:(a,b)=>a.method.localeCompare(b.method),
  city:(a,b)=>a.city.localeCompare(b.city),
  month:(a,b)=>(a.year*12+a.monthN)-(b.year*12+b.monthN),
  rating:(a,b)=>a.rating-b.rating
};
function updateBeerSortHeaders(){
  document.querySelectorAll('#beerHead th[data-sort]').forEach(th=>{
    th.classList.toggle('s-asc',th.dataset.sort===beerSort.key&&beerSort.dir===1);
    th.classList.toggle('s-desc',th.dataset.sort===beerSort.key&&beerSort.dir===-1);
    th.setAttribute('aria-sort',th.dataset.sort===beerSort.key?(beerSort.dir===1?'ascending':'descending'):'none');
  });
}
function renderBeerChips(f){
  const wrap=document.getElementById('beerChips');
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const chips=[];
  if(f.q)chips.push({k:'q',label:`“${esc(f.q)}”`});
  if(f.st)chips.push({k:'st',label:`Style: ${esc(f.st)}`});
  if(f.or)chips.push({k:'or',label:`Origin: ${FLAGS[f.or]||''} ${f.or}`});
  if(f.mo)chips.push({k:'mo',label:`Month: ${esc(f.moLabel)}`});
  wrap.hidden=!chips.length;
  wrap.innerHTML=chips.map(c=>
    `<button type="button" class="flt-chip" data-clear="${c.k}">${c.label}<span class="x" aria-hidden="true">✕</span></button>`).join('')
    +(chips.length?`<button type="button" class="flt-chip clear-all" data-clear="all">Clear all</button>`:'');
}
function applyBeerFilter(){
  const q=(document.getElementById('beerSearch').value||'').trim().toLowerCase();
  const st=document.getElementById('beerStyleFilter').value;
  const or=document.getElementById('beerOriginFilter').value;
  const moEl=document.getElementById('beerMonthFilter');
  const mo=moEl.value;
  // Single pass: combine search + style + origin + month into one predicate
  const data=beers.filter(b=>
    (!st||b.style===st)&&
    (!or||b.origin===or)&&
    (!mo||`${b.monthN}-${b.year}`===mo)&&
    (!q||b.beer.toLowerCase().includes(q)||b.style.toLowerCase().includes(q)||b.country.toLowerCase().includes(q)||b.city.toLowerCase().includes(q)));
  data.sort((a,b)=>beerSort.dir*BEER_SORT_CMP[beerSort.key](a,b));
  updateBeerSortHeaders();
  renderBeerChips({q,st,or,mo,moLabel:mo?moEl.options[moEl.selectedIndex].textContent:''});
  renderTable(data);
}
function resetBeerFilter(){
  document.getElementById('beerSearch').value='';
  document.getElementById('beerStyleFilter').value='';
  document.getElementById('beerOriginFilter').value='';
  document.getElementById('beerMonthFilter').value='';
  applyBeerFilter();
}
// Debounced version for keystroke-driven search input — select changes stay instant via applyBeerFilter()
const applyBeerFilterDebounced=(()=>{let t;return ()=>{clearTimeout(t);t=setTimeout(applyBeerFilter,160);};})();
try {
  // Populate filter dropdowns
  const styles=[...new Set(beers.map(b=>b.style))].sort();
  const origins=[...new Set(beers.map(b=>b.origin))].sort();
  const styleEl=document.getElementById('beerStyleFilter');
  const origEl=document.getElementById('beerOriginFilter');
  const sf=document.createDocumentFragment();styles.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;sf.appendChild(o);});styleEl.appendChild(sf);
  const of=document.createDocumentFragment();origins.forEach(o=>{const el=document.createElement('option');el.value=o;el.textContent=`${FLAGS[o]||''} ${o}`;of.appendChild(el);});origEl.appendChild(of);
  // Month-consumed filter — one option per month/year present in the data, chronological
  const monthEl=document.getElementById('beerMonthFilter');
  const monthMap=new Map();
  beers.forEach(b=>monthMap.set(`${b.monthN}-${b.year}`,{label:`${b.month} ${b.year}`,ord:b.year*12+b.monthN}));
  const mf=document.createDocumentFragment();
  [...monthMap.entries()].sort((a,b)=>a[1].ord-b[1].ord).forEach(([v,m])=>{const o=document.createElement('option');o.value=v;o.textContent=m.label;mf.appendChild(o);});
  monthEl.appendChild(mf);
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
    <div style="font-size:12px;color:var(--text-3);margin-top:3px">${FLAGS[b.origin]||''} ${CNAMES[b.origin]||b.origin} · ${b.method}</div>
  </div>`).join('');
} catch(e){ console.error('beerGrid init:',e); }

// ══════════════════════════════════════════════════════════════
// BEER DETAIL MODAL
// ══════════════════════════════════════════════════════════════
function openBeerModal(name){
  const reviews=BEER_REVIEWS.get(name)||[];
  if(!reviews.length) return;
  const ratings=reviews.map(b=>b.rating);
  const avgR=avg(ratings),bestR=Math.max(...ratings),worstR=Math.min(...ratings);
  const b0=reviews[0];
  document.getElementById('beerModalTitle').textContent=name;
  document.getElementById('beerModalBody').innerHTML=`
    <div style="display:flex;gap:16px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border);margin-bottom:12px;flex-wrap:wrap">
      <div style="width:120px;height:60px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;padding:4px;flex-shrink:0">${cardLogo(name)}</div>
      <div style="flex:1;min-width:160px">
        <div style="font-size:13px;color:var(--text-3);margin-bottom:2px">${b0.style}</div>
        <div style="font-size:13px;color:var(--text-2)">${FLAGS[b0.origin]||''} ${CNAMES[b0.origin]||b0.origin} · ${b0.abv}% ABV</div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:${rC(avgR)}">${avgR.toFixed(2)}</div><div style="font-size:12px;color:var(--text-3);letter-spacing:0">Average</div></div>
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:${rC(bestR)}">${bestR.toFixed(2)}</div><div style="font-size:12px;color:var(--text-3);letter-spacing:0">Best</div></div>
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:${rC(worstR)}">${worstR.toFixed(2)}</div><div style="font-size:12px;color:var(--text-3);letter-spacing:0">Worst</div></div>
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:var(--info)">${reviews.length}</div><div style="font-size:12px;color:var(--text-3);letter-spacing:0">Reviews</div></div>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text);letter-spacing:0;margin-bottom:8px;font-weight:600">All sessions</div>
    <div class="table-wrap">
    <table class="bb-table" style="min-width:unset">
      <thead><tr><th>#</th><th>Rating</th><th>Stars</th><th>Method</th><th>City</th><th>Country</th><th>Date</th></tr></thead>
      <tbody>${reviews.map((b,i)=>`
        <tr>
          <td style="color:var(--text-3)">${i+1}</td>
          <td><span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span></td>
          <td style="color:var(--accent-hi);font-size:12px">${strs(b.rating)}</td>
          <td style="color:var(--text-3)">${b.method}</td>
          <td style="color:var(--text-2)">${b.city}, ${b.region}</td>
          <td>${FLAGS[b.cc]||''} ${b.country}</td>
          <td style="color:var(--text-3);font-size:12px">${b.month} ${b.year}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    </div>`;
  _modalPrevFocus=document.activeElement;
  const bm=document.getElementById('beerModal');
  bm.classList.add('open'); bm.setAttribute('aria-hidden','false');
  // Focus after the visibility transition's first frame: focus() on an
  // element whose computed visibility is still 'hidden' is silently ignored.
  const cb=document.getElementById('beerModalClose');
  if(cb) requestAnimationFrame(()=>requestAnimationFrame(()=>cb.focus()));
}
let _modalPrevFocus=null;
function closeBeerModal(){
  const bm=document.getElementById('beerModal');
  if(!bm.classList.contains('open')) return;
  bm.classList.remove('open'); bm.setAttribute('aria-hidden','true');
  restoreFocus(_modalPrevFocus,bm);
  _modalPrevFocus=null;
}
// Return focus to where it was before an overlay opened. If the opener wasn't
// focusable (e.g. a table-row click leaves focus on <body>), at least blur
// anything still focused inside the now-hidden overlay.
function restoreFocus(prev,overlay){
  if(prev&&prev!==document.body&&document.contains(prev)) prev.focus();
  else if(overlay.contains(document.activeElement)) document.activeElement.blur();
}

// ══════════════════════════════════════════════════════════════
// COUNTRY
// ══════════════════════════════════════════════════════════════
function drawCountry(){
  window._cD=true;
  // Already sorted MIN_N-qualified first by computeStats(); countries below the
  // line trail the list and render muted so they read as "not enough yet".
  const cD=STATS.countryRanked;
  safeChart('countryChart',document.getElementById('countryChart'),{type:'bar',
    data:{labels:cD.map(d=>`${d.l} ${nLabel(d.c)}`),datasets:[{data:cD.map(d=>+d.a.toFixed(2)),backgroundColor:cD.map(d=>barFill(rC(d.a),d.c)),borderWidth:0}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:ttWithN(i=>cD[i].c)},scales:{x:{min:0,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}},y:{grid:{display:false},ticks:{color:THEME.label,font:{size:10}}}}}
  });
  document.getElementById('countryCards').innerHTML=cD.map(d=>`
    <div class="bb-bar-row${thin(d.c)?' rank-thin':''}">
      <div class="bb-bar-label"><span class="name">${d.l}</span><span class="val">${d.a.toFixed(2)}/5 · ${d.c}x${thin(d.c)?' · unranked':''}</span></div>
      <div class="bb-bar-bg"><div class="bb-bar-fill" style="width:${d.a/5*100}%;background:${rC(d.a)}"></div></div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// CITY
// ══════════════════════════════════════════════════════════════
function drawCity(){
  window._ciD=true;
  const cD=STATS.cityRanked;
  safeChart('cityChart',document.getElementById('cityChart'),{type:'bar',
    data:{labels:cD.map(d=>`${d.city} ${nLabel(d.c)}`),datasets:[{data:cD.map(d=>+d.a.toFixed(2)),backgroundColor:cD.map(d=>barFill(rC(d.a),d.c)),borderWidth:0}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:ttWithN(i=>cD[i].c)},scales:{x:{min:0,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}},y:{grid:{display:false},ticks:{color:THEME.label,font:{size:10}}}}}
  });
  document.getElementById('cityCards').innerHTML=cD.map(d=>`
    <div class="mini-row${thin(d.c)?' rank-thin':''}">
      <div><div style="font-size:13px;color:var(--text);font-weight:600">${d.city}</div><div style="font-size:12px;color:var(--text-3)">${d.region} · ${FLAGS[d.cc]||''} ${d.country} · ${d.c} review${d.c>1?'s':''}${thin(d.c)?' · unranked':''}</div></div>
      <span class="rb ${rbC(d.a)}">${d.a.toFixed(2)}</span>
    </div>`).join('');
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
  const minR=sr[0]??0,maxR=sr[sr.length-1]??0;

  // Single pass bucket count for quintiles
  const qb=[0,0,0,0,0,0];
  for(const r of ratings){
    if(r>=4.5)qb[0]++;
    else if(r>=4)qb[1]++;
    else if(r>=3.5)qb[2]++;
    else if(r>=3)qb[3]++;
    else if(r>=2.5)qb[4]++;
    else qb[5]++;
  }

  document.getElementById('statSummary').innerHTML=[
    ['Mean',mean.toFixed(4),'fl'],['Median',med.toFixed(2),''],
    ['Std deviation',stdD.toFixed(4),''],['Minimum',minR.toFixed(2),'dn'],
    ['Maximum',maxR.toFixed(2),'up'],['Range',(maxR-minR).toFixed(2),''],
    ['Q1 (25th)',q1.toFixed(2),''],['Q3 (75th)',q3.toFixed(2),''],
    ['IQR',(q3-q1).toFixed(2),''],['Count',ratings.length,''],
  ].map(([l,v,c])=>`<div class="insight-row"><span class="insight-key">${l}</span><span class="insight-val ${c}" style="font-family:var(--mono)">${v}</span></div>`).join('');

  document.getElementById('quintiles').innerHTML=[
    ['Excellent · 4.50–5.00',qb[0],'up'],
    ['Good · 4.00–4.25',qb[1],'up'],
    ['Solid · 3.50–3.75',qb[2],'fl'],
    ['Average · 3.00–3.25',qb[3],'fl'],
    ['Below par · 2.50–2.75',qb[4],'dn'],
    ['Poor · under 2.50',qb[5],'dn'],
  ].map(([l,n,c])=>`<div class="insight-row">
    <span class="insight-key">${l}</span>
    <span class="insight-val ${c}">${n} <span style="color:var(--text-3);font-weight:400">(${(n/ratings.length*100).toFixed(0)}%)</span></span>
  </div>`).join('');

  const profKeys=['wheat','dark','lager','de','us','artisan','highAbv','draftNitro'];
  const profAcc={};profKeys.forEach(k=>profAcc[k]={t:0,c:0});
  beers.forEach(b=>{
    const r=b.rating;
    if(b.style==='Wheat Beer'){profAcc.wheat.t+=r;profAcc.wheat.c++;}
    if(b.style==='Stout'||b.style==='Brown Ale'){profAcc.dark.t+=r;profAcc.dark.c++;}
    if(b.style.includes('Lager')){profAcc.lager.t+=r;profAcc.lager.c++;}
    if(b.origin==='DE'){profAcc.de.t+=r;profAcc.de.c++;}
    if(b.origin==='US'){profAcc.us.t+=r;profAcc.us.c++;}
    if(b.style.includes('Belgian')||b.style.includes('IPA')||b.style.includes('Wheat')){profAcc.artisan.t+=r;profAcc.artisan.c++;}
    if(b.abv>=6.0){profAcc.highAbv.t+=r;profAcc.highAbv.c++;}
    if(b.method==='Draft'||b.method==='Nitro'){profAcc.draftNitro.t+=r;profAcc.draftNitro.c++;}
  });
  const pv=k=>profAcc[k].c?profAcc[k].t/profAcc[k].c:0;
  const profile=[
    {l:'Wheat beer bias',k:'wheat',color:THEME.accent},
    {l:'Dark beer tolerance',k:'dark',color:THEME.text3},
    {l:'Lager appreciation',k:'lager',color:THEME.pos},
    {l:'German beer premium',k:'de',color:THEME.accent},
    {l:'American beer discount',k:'us',color:THEME.neg},
    {l:'Artisan vs macro',k:'artisan',color:THEME.purple},
    {l:'High ABV preference',k:'highAbv',color:THEME.info},
    {l:'Draft & nitro premium',k:'draftNitro',color:THEME.info},
  ].map(p=>({...p,v:pv(p.k),n:profAcc[p.k].c}));
  // A "preference" measured off one or two pours is noise — say so rather than
  // drawing a bar that looks like a finding.
  document.getElementById('tasteProfile').innerHTML=profile.map(p=>`
    <div class="bb-bar-row${thin(p.n)?' rank-thin':''}">
      <div class="bb-bar-label"><span class="name">${p.l}</span><span class="val">${thin(p.n)?`${p.n} review${p.n===1?'':'s'} · need ${MIN_N}`:`${p.v.toFixed(2)}/5 · ${p.n}x`}</span></div>
      <div class="bb-bar-bg"><div class="bb-bar-fill" style="width:${thin(p.n)?0:p.v/5*100}%;background:${p.color}"></div></div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// LANGUAGE
// ══════════════════════════════════════════════════════════════
function drawLanguage(){
  window._langD=true;
  try {
    const lC=LANG_COLORS, lF=LANG_FLAGS;
    const lD=beers.map(b=>({beer:b.beer,country:b.origin,region:BREW_LOC[b.beer]||'',lang:BEER_LANG_LOOKUP[b.beer]||LANG_MAP_FALLBACK[b.origin]||b.origin,rating:b.rating}));
    const lA={};
    lD.forEach(d=>{if(!lA[d.lang])lA[d.lang]={t:0,c:0,b:[]};lA[d.lang].t+=d.rating;lA[d.lang].c++;if(!lA[d.lang].b.includes(d.beer))lA[d.lang].b.push(d.beer);});
    const lS=Object.entries(lA).map(([l,v])=>({l,a:v.t/v.c,c:v.c,b:v.b})).sort(rankBy(o=>o.a,o=>o.c));
    safeChart('langChart',document.getElementById('langChart'),{type:'bar',
      data:{labels:lS.map(d=>`${lF[d.l]||''} ${d.l} ${nLabel(d.c)}`),datasets:[{data:lS.map(d=>+d.a.toFixed(2)),backgroundColor:lS.map(d=>barFill(lC[d.l]||THEME.accent,d.c)),borderWidth:0}]},
      options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:ttWithN(i=>lS[i].c)},scales:{x:{min:0,max:5,grid:{color:THEME.grid},ticks:{color:THEME.tick}},y:{grid:{display:false},ticks:{color:THEME.label,font:{size:10}}}}}
    });
  } catch(e){ console.error('Language init error:',e); }
}

// ══════════════════════════════════════════════════════════════
// MAP — one world map, three plain-language views:
//   drank   → every city I've reviewed a beer in (size = pours)
//   brewed  → every brewery's hometown (color = my rating)
//   journey → an arc from each brewery to the city where I drank its beer
// ══════════════════════════════════════════════════════════════
function addTiles(map){L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO',maxZoom:20,subdomains:'abcd',detectRetina:true}).addTo(map);}
function popHtml(h){return `<div style="font-family:var(--mono);font-size:13px;line-height:1.7;-webkit-font-smoothing:antialiased">${h}</div>`;}
// Overline that tells the reader what KIND of thing they just clicked
function popKicker(t){return `<div style="font-size:12px;color:var(--text-3);border-bottom:1px solid var(--border);padding-bottom:3px;margin-bottom:4px">${t}</div>`;}
const fmtMi=n=>Math.round(n).toLocaleString('en-US');
// Plain-words label for a rating bucket — used by popups and the map key
function rWord(r){return r>=4.5?'loved it':r>=4?'great':r>=3.5?'good':r>=3?'fine':r>=2.5?'meh':'skip it';}
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
  drank:{head:'Where I drank them',hint:'Every city with a review · click a dot for the pour list'},
  brewed:{head:'Where they’re brewed',hint:'Every brewery’s hometown · click a dot for the brewery'},
  journey:{head:'Brewery to my glass',hint:'How far each beer traveled · click a line for the trip'},
  passport:{head:'My beer passport',hint:'Every country, stamped · scroll down for the full collection'}
};

// beer name → brewery record (breweries[].beers is " · "-separated)
function beerBreweryIndex(){
  const idx={};
  breweries.forEach(br=>br.beers.split(' · ').forEach(n=>{idx[n.trim()]=br;}));
  return idx;
}

// Aggregate pours per city (canonical location rule applies, same as before)
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

// One record per country that's touched EITHER end of the trip: brewed there,
// drunk there, or both. This is the data behind the PASSPORT view.
function passportCountries(){
  const idx=beerBreweryIndex();
  const rec={};
  const ensure=cc=>{
    if(!rec[cc]) rec[cc]={cc,country:CNAMES[cc]||cc,brewed:null,drank:null,firstYear:null,firstMonthN:null,firstMonth:null};
    return rec[cc];
  };
  beers.forEach(b=>{
    const br=idx[b.beer];
    const bRec=ensure(b.origin);
    if(!bRec.brewed) bRec.brewed={count:0,names:new Set()};
    bRec.brewed.count++;
    bRec.brewed.names.add(br?br.name:b.beer);

    const dRec=ensure(b.cc);
    if(!dRec.drank) dRec.drank={count:0,cities:new Set(),ratings:[]};
    dRec.drank.count++;
    dRec.drank.cities.add(b.city);
    dRec.drank.ratings.push(b.rating);
    if(dRec.firstYear==null||b.year<dRec.firstYear||(b.year===dRec.firstYear&&b.monthN<dRec.firstMonthN)){
      dRec.firstYear=b.year;dRec.firstMonthN=b.monthN;dRec.firstMonth=b.month;
    }
  });
  return Object.values(rec).map(r=>({
    ...r,
    brewed:r.brewed?{count:r.brewed.count,names:[...r.brewed.names]}:null,
    drank:r.drank?{count:r.drank.count,cities:[...r.drank.cities],avg:avg(r.drank.ratings)}:null
  })).sort((a,b)=>{
    const bothA=a.brewed&&a.drank?0:1,bothB=b.brewed&&b.drank?0:1;
    if(bothA!==bothB) return bothA-bothB;
    return a.country.localeCompare(b.country);
  });
}

// FNV-1a-ish hash so every country gets the same "hand-stamped" look every
// time (ink color, tilt) without needing per-country data entry.
function stampHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const STAMP_INKS=['#f5a524','#4ade80','#fbbf24','#fb923c','#f87171','#a78bfa','#60a5fa','#f472b6'];
function stampStyle(cc){
  const h=stampHash(cc);
  return {
    ink:STAMP_INKS[h%STAMP_INKS.length],
    rot:((h>>>4)%13)-6
  };
}

// Official-ish 3-letter codes for the passport label band. Constituent UK
// countries have no ISO-3166 alpha-3 of their own, so the common
// sporting/travel abbreviations (ENG/SCO/WAL/NIR) are used instead.
const CODE3={
  BE:'BEL',NL:'NLD',CA:'CAN',US:'USA',DE:'DEU',JP:'JPN',CZ:'CZE',IT:'ITA',ES:'ESP',
  PT:'PRT',PR:'PRI',AT:'AUT',CU:'CUB',DK:'DNK',FR:'FRA',GR:'GRC',IE:'IRL',JM:'JAM',
  LB:'LBN',MX:'MEX',PL:'POL','GB-ENG':'ENG','GB-SCT':'SCO','GB-WLS':'WAL','GB-NIR':'NIR',
  GB:'GBR',BR:'BRA',CN:'CHN',ZA:'ZAF',AU:'AUS',SE:'SWE',AR:'ARG',NO:'NOR',TH:'THA',SG:'SGP'
};
function code3(cc){ return CODE3[cc]||cc.replace('GB-','').slice(0,3).toUpperCase(); }

// Ring of perforation notches (small backdrop-colored circles biting into the
// border) around a rect — the classic postage-stamp edge, built once here
// instead of a giant hand-authored path.
function perforatedEdge(x0,y0,x1,y1,bg,step,r){
  let s='';
  for(let x=x0+step/2;x<x1;x+=step){
    s+=`<circle cx="${x.toFixed(1)}" cy="${y0}" r="${r}" fill="${bg}"/><circle cx="${x.toFixed(1)}" cy="${y1}" r="${r}" fill="${bg}"/>`;
  }
  for(let y=y0+step/2;y<y1;y+=step){
    s+=`<circle cx="${x0}" cy="${y.toFixed(1)}" r="${r}" fill="${bg}"/><circle cx="${x1}" cy="${y.toFixed(1)}" r="${r}" fill="${bg}"/>`;
  }
  return s;
}

// Small helpers for the radially-symmetric icons (flowers, manes, spikes) —
// generating points by angle keeps proportions honest instead of guessing
// coordinates by hand.
function polarPt(cx,cy,r,deg){const rad=(deg-90)*Math.PI/180;return [cx+r*Math.cos(rad),cy+r*Math.sin(rad)];}
function starPoints(cx,cy,rOuter,rInner,spikes){
  const pts=[];
  for(let i=0;i<spikes*2;i++){
    const rad=i%2===0?rOuter:rInner;
    const [x,y]=polarPt(cx,cy,rad,i*(360/(spikes*2)));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

// One real national/cultural symbol per country — a flower, animal, or folk
// emblem, not a landmark building — drawn as bold solid silhouettes (the
// style that actually read well: maple leaf, Liberty, a stepped pyramid).
// Icon area ≈ x20-100, y36-107, center (60,72). Each fn(bg) gets the card's
// backdrop color for small cutout details (eyes, pupils); everything else
// inherits currentColor from the wrapping <g>.
// A plain heraldic shield outline, reused by every flag-pattern icon below —
// stripes/crosses are 100% reliable to draw correctly (just rects and lines),
// where the earlier animal attempts (lion, eagle, bull, swan, hummingbird)
// kept coming out unrecognizable. clipPath keeps the pattern inside the
// shield regardless of how generously the rects/polygons are sized.
const SHIELD_D="M28,42 Q28,39 31,39 L89,39 Q92,39 92,42 L92,68 Q92,94 60,107 Q28,94 28,68 Z";
function shieldIcon(cc,pattern){
  return `<defs><clipPath id="shield-${cc}"><path d="${SHIELD_D}"/></clipPath></defs>
<g clip-path="url(#shield-${cc})">${pattern}</g>
<path d="${SHIELD_D}" fill="none" stroke-width="2.2"/>`;
}

const COUNTRY_ART={
  // Belgium — a Belgian waffle (its own true cultural export, and a shape
  // that's foolproof to draw: a grid reads as a grid at any skill level)
  BE:(bg)=>{
    const g=[40,52,68,80].map(x=>`<line x1="${x}" y1="30" x2="${x}" y2="115" stroke-width="2"/>`).join('')
      +[52,64,76,88,100].map(y=>`<line x1="20" y1="${y}" x2="100" y2="${y}" stroke-width="2"/>`).join('');
    return shieldIcon('BE',`<rect x="20" y="30" width="80" height="85" opacity="0.15"/>${g}`);
  },
  // Canada — the maple leaf
  CA:(bg)=>`
    <path d="M60,42 L65,58 L80,52 L74,68 L92,71 L77,80 L87,94 L68,88 L66,104 L60,94 L54,104 L52,88 L33,94 L43,80 L28,71 L46,68 L40,52 L55,58 Z"/>
    <line x1="60" y1="80" x2="60" y2="50" stroke="${bg}" stroke-width="1" opacity="0.75"/>
    <line x1="60" y1="80" x2="78" y2="56" stroke="${bg}" stroke-width="1" opacity="0.75"/>
    <line x1="60" y1="80" x2="42" y2="56" stroke="${bg}" stroke-width="1" opacity="0.75"/>`,
  // Italy — the tricolore
  IT:(bg)=>shieldIcon('IT',`
    <rect x="20" y="30" width="27" height="85" opacity="1"/>
    <rect x="47" y="30" width="26" height="85" opacity="0.4"/>
    <rect x="73" y="30" width="27" height="85" opacity="0.8"/>`),
  // Netherlands — the tulip
  NL:(bg)=>`
    <path d="M40,58 Q37,40 60,30 Q83,40 80,58 Q81,73 60,79 Q39,73 40,58 Z"/>
    <line x1="60" y1="79" x2="60" y2="103" stroke-width="4"/>
    <path d="M60,90 Q46,88 40,97" fill="none" stroke-width="3"/>
    <path d="M60,94 Q74,92 80,101" fill="none" stroke-width="3"/>`,
  // Portugal — the flag's green-and-red field
  PT:(bg)=>shieldIcon('PT',`
    <rect x="20" y="30" width="30" height="85" opacity="1"/>
    <rect x="50" y="30" width="50" height="85" opacity="0.5"/>`),
  // Puerto Rico — the coquí
  PR:(bg)=>`
    <path d="M32,88 Q30,68 60,66 Q90,68 88,88 Q90,100 60,102 Q30,100 32,88 Z"/>
    <circle cx="46" cy="60" r="9"/>
    <circle cx="74" cy="60" r="9"/>
    <circle cx="46" cy="60" r="3.5" fill="${bg}"/>
    <circle cx="74" cy="60" r="3.5" fill="${bg}"/>
    <path d="M34,84 Q22,80 18,88" fill="none" stroke-width="4" stroke-linecap="round"/>
    <path d="M86,84 Q98,80 102,88" fill="none" stroke-width="4" stroke-linecap="round"/>
    <path d="M40,98 Q30,104 22,100" fill="none" stroke-width="3" stroke-linecap="round"/>
    <path d="M80,98 Q90,104 98,100" fill="none" stroke-width="3" stroke-linecap="round"/>`,
  // Spain — la rojigualda (thick-thin-thick horizontal bands)
  ES:(bg)=>shieldIcon('ES',`
    <rect x="20" y="30" width="80" height="24" opacity="1"/>
    <rect x="20" y="54" width="80" height="30" opacity="0.4"/>
    <rect x="20" y="84" width="80" height="24" opacity="1"/>`),
  // USA — the stars and stripes
  US:(bg)=>{
    const stripes=[0,1,2,3,4,5,6].map(i=>`<rect x="20" y="${34+i*11.5}" width="80" height="5.5" opacity="${i%2===0?1:0}"/>`).join('');
    const stars=[0,1,2].map(row=>[0,1,2,3].map(col=>
      `<polygon points="${starPoints(29+col*8,38+row*11,3,1.3,5)}"/>`).join('')).join('');
    return shieldIcon('US',`${stripes}<rect x="20" y="30" width="38" height="40" opacity="0.15"/>${stars}`);
  },
  // Austria — the edelweiss
  AT:(bg)=>`
    <polygon points="${starPoints(60,72,24,10,6)}"/>
    <circle cx="60" cy="72" r="8" opacity="0.6"/>
    <circle cx="60" cy="72" r="8" fill="none" stroke-width="1"/>`,
  // Cuba — the mariposa (butterfly ginger lily)
  CU:(bg)=>`
    <ellipse cx="60" cy="50" rx="11" ry="20"/>
    <ellipse cx="60" cy="94" rx="11" ry="20"/>
    <ellipse cx="38" cy="72" rx="20" ry="11"/>
    <ellipse cx="82" cy="72" rx="20" ry="11"/>
    <circle cx="60" cy="72" r="9" opacity="0.6"/>`,
  // Denmark — the Dannebrog cross
  DK:(bg)=>shieldIcon('DK',`
    <rect x="20" y="30" width="80" height="85" opacity="0.25"/>
    <rect x="44" y="30" width="14" height="85"/>
    <rect x="20" y="62" width="80" height="14"/>`),
  // England — the Tudor rose
  'GB-ENG':(bg)=>{
    let outer='',inner='';
    for(let i=0;i<5;i++){
      const a=i*72;
      outer+=`<ellipse cx="60" cy="56" rx="9" ry="16" transform="rotate(${a} 60 72)"/>`;
      inner+=`<ellipse cx="60" cy="62" rx="6" ry="10" transform="rotate(${a+36} 60 72)" opacity="0.55"/>`;
    }
    return `${outer}${inner}<circle cx="60" cy="72" r="7"/>`;
  },
  // France — le tricolore
  FR:(bg)=>shieldIcon('FR',`
    <rect x="20" y="30" width="27" height="85" opacity="0.7"/>
    <rect x="47" y="30" width="26" height="85" opacity="0.15"/>
    <rect x="73" y="30" width="27" height="85" opacity="1"/>`),
  // Germany — the Schwarz-Rot-Gold
  DE:(bg)=>shieldIcon('DE',`
    <rect x="20" y="30" width="80" height="28" opacity="1"/>
    <rect x="20" y="58" width="80" height="28" opacity="0.6"/>
    <rect x="20" y="86" width="80" height="28" opacity="0.85"/>`),
  // Greece — the blue-and-white stripes and canton cross
  GR:(bg)=>{
    const stripes=[0,1,2,3,4,5,6].map(i=>`<rect x="20" y="${30+i*12.1}" width="80" height="6.1" opacity="${i%2===0?1:0}"/>`).join('');
    return shieldIcon('GR',`${stripes}
      <rect x="20" y="30" width="34" height="34" opacity="0.15"/>
      <rect x="33" y="30" width="7" height="34"/>
      <rect x="20" y="43" width="34" height="7"/>`);
  },
  // Ireland — the shamrock
  IE:(bg)=>`
    <circle cx="60" cy="54" r="14"/>
    <circle cx="47" cy="76" r="14"/>
    <circle cx="73" cy="76" r="14"/>
    <line x1="60" y1="86" x2="60" y2="104" stroke-width="3"/>`,
  // Jamaica — the saltire flag, quartered black-gold-green
  JM:(bg)=>shieldIcon('JM',`
    <polygon points="20,30 60,68 20,107" opacity="1"/>
    <polygon points="100,30 60,68 100,107" opacity="1"/>
    <polygon points="20,30 60,68 100,30" opacity="0.35"/>
    <polygon points="20,107 60,68 100,107" opacity="0.35"/>`),
  // Japan — the cherry blossom
  JP:(bg)=>{
    let petals='';
    for(let i=0;i<5;i++){
      petals+=`<path d="M60,72 Q50,58 54,44 Q60,50 60,58 Q60,50 66,44 Q70,58 60,72 Z" transform="rotate(${i*72} 60 72)"/>`;
    }
    return `${petals}<circle cx="60" cy="72" r="5"/>`;
  },
  // Lebanon — the cedar
  LB:(bg)=>`
    <polygon points="24,104 96,104 78,86 42,86"/>
    <polygon points="34,88 86,88 72,72 48,72" opacity="0.55"/>
    <polygon points="44,74 76,74 66,60 54,60"/>
    <polygon points="54,62 66,62 60,50"/>
    <rect x="56" y="100" width="8" height="8"/>`,
  // Mexico — the sombrero
  MX:(bg)=>`
    <ellipse cx="60" cy="90" rx="39" ry="7"/>
    <path d="M40,90 Q40,52 60,44 Q80,52 80,90 Z"/>
    <rect x="40" y="82" width="40" height="6" opacity="0.5"/>
    <circle cx="60" cy="44" r="3"/>`,
  // Poland — biało-czerwoni, white over red
  PL:(bg)=>shieldIcon('PL',`
    <rect x="20" y="30" width="80" height="42" opacity="0.35"/>
    <rect x="20" y="72" width="80" height="42" opacity="1"/>`),
  // Czech Republic — white over red, with the hoist wedge
  CZ:(bg)=>shieldIcon('CZ',`
    <rect x="20" y="30" width="80" height="42" opacity="0.35"/>
    <rect x="20" y="72" width="80" height="42" opacity="1"/>
    <polygon points="20,30 20,114 60,72" opacity="0.7"/>`),
  // Scotland — the saltire of St Andrew
  'GB-SCT':(bg)=>shieldIcon('SCT',`
    <rect x="20" y="30" width="80" height="85" opacity="0.2"/>
    <line x1="26" y1="34" x2="94" y2="111" stroke-width="8"/>
    <line x1="94" y1="34" x2="26" y2="111" stroke-width="8"/>`)
};
// Generic fallback (a compass rosette) for any country without a symbol yet
function genericArt(bg){
  return `<polygon points="${starPoints(60,72,26,12,8)}"/><circle cx="60" cy="72" r="8" opacity="0.6"/>`;
}

// Builds one self-contained SVG "postage stamp" for a country: a straight
// perforated-edge rectangle around that country's real national/cultural
// symbol, its 3-letter code, and a "face value" line showing my average
// rating there (or brewery count if never drunk there).
function passportStampSvg(r,sty){
  const {ink}=sty;
  const cc=r.cc,code=code3(cc);
  const name=(r.country||cc);
  const bg='#13161d';
  const art=(COUNTRY_ART[cc]||genericArt)(bg);
  const valueText=r.drank?`${r.drank.avg.toFixed(2)} ★`:(r.brewed?`${r.brewed.names.length} brewer${r.brewed.names.length===1?'y':'ies'}`:'');
  return `<svg viewBox="0 0 120 150" width="128" height="160" role="img" aria-label="${name} passport stamp">
<g fill="currentColor" stroke="currentColor" style="color:${ink}">
<rect x="8" y="8" width="104" height="134" fill="none" stroke-width="2"/>
<rect x="16" y="16" width="88" height="118" fill="none" stroke-width="1" opacity="0.45"/>
${perforatedEdge(8,8,112,142,bg,10.4,4)}
<text x="60" y="28" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2.5">${code}</text>
<line x1="26" y1="34" x2="94" y2="34" stroke-width="1" opacity="0.5"/>
<g>${art}</g>
<line x1="26" y1="111" x2="94" y2="111" stroke-width="1" opacity="0.5"/>
<text x="60" y="123" text-anchor="middle" font-size="7.5" letter-spacing="0.8" opacity="0.8">${valueText}</text>
</g>
</svg>`;
}

function passportStampCard(r){
  const sty=stampStyle(r.cc);
  const metaBits=[];
  if(r.drank) metaBits.push(`${r.drank.cities.length} cit${r.drank.cities.length>1?'ies':'y'} · ${r.drank.count} pour${r.drank.count>1?'s':''}${r.firstYear?` · first ${r.firstMonth||''} ${r.firstYear}`:''}`);
  if(r.brewed) metaBits.push(`${r.brewed.names.length} brewer${r.brewed.names.length>1?'ies':'y'} · ${r.brewed.count} beer${r.brewed.count>1?'s':''}`);
  return `<div class="stamp-card" style="--rot:${sty.rot}deg">
    <div class="stamp-badges">
      ${r.brewed?'<span class="stamp-badge sb-brew" title="Brewed here">Brewed</span>':''}
      ${r.drank?'<span class="stamp-badge sb-drink" title="Drank here">Drank</span>':''}
    </div>
    <div class="stamp-ink">${passportStampSvg(r,sty)}</div>
    <div class="stamp-cap"><span class="stamp-name">${r.country||r.cc}</span></div>
    <div class="stamp-meta">${metaBits.join(' · ')}</div>
  </div>`;
}

let _passportFilter='all';
function passportSummaryHtml(recs){
  const chip=(v,l)=>`<span class="mh-chip"><b>${v}</b> ${l}</span>`;
  const brewedN=recs.filter(r=>r.brewed).length,drankN=recs.filter(r=>r.drank).length,bothN=recs.filter(r=>r.brewed&&r.drank).length;
  return chip(recs.length,'countries stamped')+chip(brewedN,'brewed in')+chip(drankN,'drunk in')+chip(bothN,'both ends');
}
function passportFiltersHtml(){
  const opts=[['all','All'],['brewed','Brewed there'],['drank','Drank there'],['both','Both']];
  return opts.map(([k,l])=>`<button class="pf-btn${_passportFilter===k?' active':''}" data-pf="${k}">${l}</button>`).join('');
}
function renderPassportStamps(){
  const grid=document.getElementById('passportGrid');
  if(!grid) return;
  const recs=passportCountries();
  document.getElementById('passport-summary').innerHTML=passportSummaryHtml(recs);
  const filtEl=document.getElementById('passport-filters');
  filtEl.innerHTML=passportFiltersHtml();
  filtEl.querySelectorAll('.pf-btn').forEach(b=>{b.onclick=()=>{_passportFilter=b.dataset.pf;renderPassportStamps();};});
  const shown=recs.filter(r=>_passportFilter==='all'
    ||(_passportFilter==='brewed'&&r.brewed)
    ||(_passportFilter==='drank'&&r.drank)
    ||(_passportFilter==='both'&&r.brewed&&r.drank));
  grid.innerHTML=shown.map(passportStampCard).join('');
}

function mapHeroHtml(journeys){
  const cM=drankCityData();
  const cityN=Object.keys(cM).length;
  const drankCountries=new Set(Object.values(cM).map(c=>c.cc)).size;
  const brewCountries=new Set(breweries.map(b=>b.cc)).size;
  const totalMi=journeys.reduce((s,j)=>s+j.miles*j.pours,0);
  const chip=(v,l)=>`<span class="mh-chip"><b>${v}</b> ${l}</span>`;
  return `<div class="bb-body" id="map-hero-body">
    <div class="mh-line">Every beer on this site has <b>two places</b>: where it’s <b class="mh-brew">brewed</b> and where I <b class="mh-drink">drank it</b>. Pick a view below to see either end of the trip — or the trip itself.</div>
    <div class="mh-chips">
      ${chip(beers.length,'pours logged')}
      ${chip(cityN,'cities poured in')}
      ${chip(drankCountries,'countries drunk in')}
      ${chip(breweries.length,'breweries')}
      ${chip(brewCountries,'brewing nations')}
      ${chip(fmtMi(totalMi),'total beer-miles')}
    </div>
  </div>`;
}

function keyHtml(mode,journeys){
  const head=`<div class="mk-head">What you’re looking at</div>`;
  if(mode==='drank'){
    return head+`
      <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--accent)"></span>a city where I’ve reviewed a beer</div>
      <div class="mk-row"><span class="mk-scale"><i style="width:8px;height:8px"></i><i style="width:12px;height:12px"></i><i style="width:16px;height:16px"></i></span>bigger dot = more pours there</div>
      <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--accent);box-shadow:0 0 0 2px var(--accent-hi)"></span>gold ring = my home turf (NY)</div>
      <div class="mk-tap">Click any dot to see what I had there</div>`;
  }
  if(mode==='brewed'){
    const buckets=[[4.75,'4.5+ loved it'],[4.2,'4.0+ great'],[3.7,'3.5+ good'],[3.2,'3.0+ fine'],[2.7,'2.5+ meh'],[2.0,'under 2.5']];
    return head+`
      <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:#aacc00"></span>a brewery’s hometown</div>
      <div class="mk-row mk-note">dot color = my average rating of its beers</div>
      <div class="mk-swatches">${buckets.map(([v,l])=>`<span class="mk-sw"><i style="background:${rC(v)}"></i>${l}</span>`).join('')}</div>
      <div class="mk-tap">Click any dot for the brewery’s card</div>`;
  }
  if(mode==='journey'){
    const totalMi=journeys.reduce((s,j)=>s+j.miles*j.pours,0);
    return head+`
      <div class="mk-row"><span class="mk-jline"><i class="mk-o"></i><b></b><i class="mk-f"></i></span>one beer’s trip: ○ brewed here → ● drunk here</div>
      <div class="mk-row mk-note">line color = my rating (green = liked, red = didn’t)</div>
      <div class="mk-row mk-note">all pours added up: <b style="color:var(--accent-hi)">${fmtMi(totalMi)} beer-miles</b></div>
      <div class="mk-tap">Click any line for that beer’s trip</div>`;
  }
  return head+`
    <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--accent)"></span>drank here only</div>
    <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--purple)"></span>brewed here only</div>
    <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--pos)"></span>brewed and drank here</div>
    <div class="mk-tap">Click any dot for the stamp · scroll down for the full collection</div>`;
}

function buildDrankLayer(map){
  const cM=drankCityData();
  const group=L.layerGroup(),bounds=[];
  drunkLocs.filter(l=>cM[l.city]).forEach(l=>{
    const d=cM[l.city],a=d.t/d.c,r=Math.max(6,Math.min(16,5+d.c*1.2));
    const home=HOME_CITIES.has(l.city);
    const rows=d.reviews.map(b=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text-2)">${b.beer}</span><span style="color:${rC(b.rating)};font-weight:700">${b.rating.toFixed(2)}</span></div>`).join('');
    const html=popKicker('📍 A city where I drank')+
      `<span style="color:var(--text);font-weight:700;font-size:13px">${l.city}</span>, ${l.region}&nbsp;&nbsp;${FLAGS[l.cc]||''} ${l.country}${home?' · <span style="color:var(--accent-hi)">⌂ Home turf</span>':''}<br>`+
      `<span style="color:var(--text-2);font-size:13px">${d.c} pour${d.c>1?'s':''} here · my average <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5</span></span>`+
      `<div style="margin-top:6px">${rows}</div>`;
    L.circleMarker([l.lat,l.lng],{radius:r,fillColor:THEME.accent,color:home?THEME.accentHi:THEME.bg,weight:home?2:1,opacity:.9,fillOpacity:.8})
      .bindTooltip(`${l.city} · ${d.c} pour${d.c>1?'s':''}`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([l.lat,l.lng]);
  });
  return {group,bounds};
}

function buildBrewedLayer(map){
  const group=L.layerGroup(),bounds=[];
  breweries.forEach(b=>{
    const a=avg(b.ratings),r=Math.max(6,Math.min(14,5+b.ratings.length*1.2));
    const firstBeer=b.beers.split(' · ')[0];
    const srcs=logoSources(firstBeer);
    const onerr=srcs.length>1?logoChainOnError(srcs,'this.onerror=null;this.remove();'):' onerror="this.onerror=null;this.remove();"';
    const logoHtml=srcs.length?`<img src="${srcs[0]}" style="width:60px;height:20px;object-fit:contain;display:block;margin:3px 0" loading="lazy" decoding="async"${onerr}>`:'';
    const beerList=b.beers.split(' · ').map(n=>`<span style="color:var(--text-2)">${n}</span>`).join('<span style="color:var(--text-3)"> · </span>');
    const html=popKicker('🏭 A brewery’s hometown')+logoHtml+
      `<span style="color:var(--text);font-weight:700;font-size:13px">${b.name}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">brews in ${b.location} · ${FLAGS[b.cc]||''} ${b.country}</span><br>`+
      `<span style="color:var(--text-3);font-size:12px">What I’ve had:</span> <span style="font-size:13px">${beerList}</span><br>`+
      `my average: <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5 · ${rWord(a)}</span> <span style="color:var(--text-3)">(${b.ratings.length} pour${b.ratings.length>1?'s':''})</span>`;
    L.circleMarker([b.lat,b.lng],{radius:r,fillColor:rC(a),color:THEME.bg,weight:1,opacity:.9,fillOpacity:.85})
      .bindTooltip(`${b.name} · ${a.toFixed(2)}/5`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([b.lat,b.lng]);
  });
  return {group,bounds};
}

function buildJourneyLayer(map,journeys){
  const group=L.layerGroup(),bounds=[];
  journeys.forEach(j=>{
    const a=avg(j.ratings),pts=arcPts(j.br.lat,j.br.lng,j.loc.lat,j.loc.lng);
    const html=popKicker('✈ One beer’s trip to my glass')+
      `<span style="color:var(--text);font-weight:700;font-size:13px">${j.beer}</span><br>`+
      `<span style="color:var(--text-2)">${j.br.location.split(',')[0]} ${FLAGS[j.br.cc]||''}</span> <span style="color:var(--text-3)">→</span> <span style="color:var(--text-2)">${j.loc.city} ${FLAGS[j.loc.cc]||''}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">traveled ~<b style="color:var(--accent-hi)">${fmtMi(j.miles)} mi</b> · my rating <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5</span></span>`;
    L.polyline(pts,{color:rC(a),weight:1.6,opacity:.65})
      .bindTooltip(`${j.beer} · ${fmtMi(j.miles)} mi`,{sticky:true,className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    // endpoints: hollow ring = brewery, solid dot = where I drank it
    const p0=pts[0],p1=pts[pts.length-1];
    L.circleMarker(p0,{radius:3.5,fillColor:THEME.bg,color:THEME.text2,weight:1.5,fillOpacity:1,interactive:false}).addTo(group);
    L.circleMarker(p1,{radius:3.5,fillColor:THEME.accent,color:THEME.bg,weight:1,fillOpacity:1,interactive:false}).addTo(group);
    bounds.push(p0,p1);
  });
  return {group,bounds};
}

function buildPassportLayer(map){
  const group=L.layerGroup(),bounds=[];
  passportCountries().forEach(r=>{
    const pts=[];
    breweries.filter(b=>b.cc===r.cc).forEach(b=>pts.push([b.lat,b.lng]));
    drunkLocs.filter(l=>l.cc===r.cc).forEach(l=>pts.push([l.lat,l.lng]));
    if(!pts.length) return;
    const lat=pts.reduce((s,p)=>s+p[0],0)/pts.length,lng=pts.reduce((s,p)=>s+p[1],0)/pts.length;
    const color=r.brewed&&r.drank?THEME.pos:r.brewed?THEME.purple:THEME.accent;
    const roleLabel=r.brewed&&r.drank?'Brewed &amp; drank here':r.brewed?'Brewed here':'Drank here';
    const html=popKicker('🛂 A stamp in my passport')+
      `<span style="color:var(--text);font-weight:700;font-size:13px">${FLAGS[r.cc]||''} ${r.country}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">${roleLabel}</span>`+
      (r.brewed?`<div style="margin-top:4px;font-size:13px;color:var(--text-2)">🏭 ${r.brewed.names.length} brewer${r.brewed.names.length>1?'ies':'y'} · ${r.brewed.count} pour${r.brewed.count>1?'s':''}</div>`:'')+
      (r.drank?`<div style="font-size:13px;color:var(--text-2)">🍺 ${r.drank.cities.length} cit${r.drank.cities.length>1?'ies':'y'} · ${r.drank.count} pour${r.drank.count>1?'s':''} · first ${r.firstMonth} ${r.firstYear}</div>`:'');
    L.circleMarker([lat,lng],{radius:9,fillColor:color,color:THEME.bg,weight:1,opacity:.9,fillOpacity:.85})
      .bindTooltip(`${FLAGS[r.cc]||''} ${r.country}`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([lat,lng]);
  });
  return {group,bounds};
}

function renderDrankTable(){
  const cM=drankCityData();
  const arr=Object.entries(cM).map(([city,d])=>({city,count:d.c,avg:d.t/d.c,beers:d.bs,region:d.region,country:d.country,cc:d.cc})).sort((a,b)=>b.count-a.count);
  document.getElementById('drunkTbody').innerHTML=arr.map(c=>`<tr>
    <td style="color:var(--text)">${c.city}${HOME_CITIES.has(c.city)?' <span style="color:var(--accent-hi);font-size:12px">⌂ Home</span>':''}</td>
    <td style="color:var(--text-3)">${c.region}</td>
    <td style="color:var(--text-2)">${FLAGS[c.cc]||''} ${c.country}</td>
    <td style="text-align:center;color:var(--info)">${c.count}</td>
    <td><span class="rb ${rbC(c.avg)}">${c.avg.toFixed(2)}</span></td>
    <td style="color:var(--text-3);font-size:12px">${c.beers.join(', ')}</td>
  </tr>`).join('');
}

function renderBrewedTable(){
  // Most breweries here are a single beer, so "best rated first" would other-
  // wise be a list of one-pour 5.00s. Breweries with MIN_N reviews behind them
  // rank first; the rest follow, still sorted by average.
  const s=[...breweries].map(b=>({...b,avg:avg(b.ratings),n:b.ratings.length}))
    .sort(rankBy(o=>o.avg,o=>o.n));
  document.getElementById('brewedTbody').innerHTML=s.map(b=>{
    const firstBeer=b.beers.split(' · ')[0];
    return `<tr>
      <td>${logoImg(firstBeer,22)}</td>
      <td style="font-weight:600"><span class="brewery-clickable" data-brewery="${b.name.replace(/"/g,'&quot;')}">${b.name}</span></td>
      <td style="color:var(--text-3);font-size:12px">${b.location}</td>
      <td style="color:var(--text-2)">${FLAGS[b.cc]||''} ${b.country}</td>
      <td style="color:var(--text-3);font-size:12px">${b.beers}</td>
      <td><span class="rb ${rbC(b.avg)}${thin(b.n)?' rb-thin':''}" title="${b.n} review${b.n===1?'':'s'}${thin(b.n)?` · under ${MIN_N}, not ranked`:''}">${b.avg.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
}

function renderJourneyTable(journeys){
  const s=[...journeys].sort((a,b)=>b.miles-a.miles);
  const totalMi=journeys.reduce((sum,j)=>sum+j.miles*j.pours,0);
  const far=s[0],near=s[s.length-1];
  const sumEl=document.getElementById('journeySummary');
  if(sumEl&&far) sumEl.innerHTML=`<div class="jny-sum">
    <span>🏆 Longest haul: <b style="color:var(--accent-hi)">${far.beer}</b> — ${fmtMi(far.miles)} mi (${far.br.location.split(',')[0]} → ${far.loc.city})</span>
    <span>🏠 Most local: <b style="color:var(--pos)">${near.beer}</b> — ${fmtMi(near.miles)} mi (${near.br.location.split(',')[0]} → ${near.loc.city})</span>
    <span>🌍 All pours combined: <b style="color:var(--info)">${fmtMi(totalMi)} beer-miles</b></span>
  </div>`;
  document.getElementById('journeyTbody').innerHTML=s.map((j,i)=>{
    const a=avg(j.ratings);
    return `<tr data-beer="${j.beer.replace(/"/g,'&quot;')}" style="cursor:pointer">
      <td style="color:var(--text-3)">${i+1}</td>
      <td style="color:var(--text);font-weight:600">${j.beer}</td>
      <td style="color:var(--text-2)">${FLAGS[j.br.cc]||''} ${j.br.location}</td>
      <td style="color:var(--text-2)">${FLAGS[j.loc.cc]||''} ${j.loc.city}</td>
      <td style="text-align:right;color:var(--info)">${fmtMi(j.miles)}</td>
      <td><span class="rb ${rbC(a)}">${a.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
}

function setMapMode(mode){
  if(!MAP_MODES[mode]) mode='drank';
  _mapMode=mode;
  document.querySelectorAll('#map-modes .map-mode').forEach(b=>{
    const on=b.dataset.mode===mode;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  document.querySelectorAll('#maps .map-sec').forEach(s=>s.classList.toggle('active',s.id==='mapsec-'+mode));
  const headEl=document.getElementById('map-panel-head');
  if(headEl) headEl.innerHTML=`${MAP_MODES[mode].head}<span class="ph-right">${MAP_MODES[mode].hint}</span>`;
  if(!_worldMap||!_mapLayers) return; // map not built yet — initWorldMap re-applies
  document.getElementById('map-key').innerHTML=keyHtml(mode,_mapLayers.journeys);
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
  document.getElementById('map-hero').innerHTML=mapHeroHtml(journeys);
  const map=L.map('worldMap',{scrollWheelZoom:false}).setView([40,-20],2);
  _worldMap=map;
  addTiles(map);
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
      drank:buildDrankLayer(map),
      brewed:buildBrewedLayer(map),
      journey:buildJourneyLayer(map,journeys),
      passport:buildPassportLayer(map)
    }
  };
  renderDrankTable();
  renderBrewedTable();
  renderJourneyTable(journeys);
  renderPassportStamps();
  setMapMode(_mapMode);
}

// ══════════════════════════════════════════════════════════════
// TEMPORAL ANALYTICS
// ══════════════════════════════════════════════════════════════
function drawTemporal(){
  window._tmpD = true;

  const {months,byMonth,monthColors,monthLabels,monthYearMap,monthAbbr} = getMonthlyData();

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
  const deltaLabel = delta > 0 ? 'Improving' : delta < 0 ? 'Declining' : 'Flat';
  const firstYear = monthYearMap[months[0]];
  const lastYear  = monthYearMap[months[months.length-1]];
  const yearLabel = firstYear===lastYear ? firstYear : `${firstYear}–${lastYear}`;
  const kpiRange = months.length > 1 ? `${monthAbbr[months[0]]} – ${monthAbbr[months[months.length-1]]}` : monthAbbr[months[0]];

  // Auto-fit strip rather than a fixed column count: the tile count is
  // months + 2, so a hardcoded grid leaves a ragged half-empty final row.
  document.getElementById('temporal-kpis').innerHTML = `<div class="kpi-strip">
    <div class="kpi"><div class="kpi-val" style="color:var(--accent)">${months.length}</div><div class="kpi-label">Months tracked</div><div class="kpi-sub">${kpiRange} ${yearLabel}</div></div>
    ${months.map((m,i)=>`
    <div class="kpi"><div class="kpi-val" style="color:${monthColors[i]}">${counts[i]}</div><div class="kpi-label">${monthAbbr[m]} reviews</div><div class="kpi-sub">Avg: ${avgRatings[i].toFixed(2)}</div></div>`).join('')}
    <div class="kpi"><div class="kpi-val" style="color:${deltaColor}">${delta>=0?'+':''}${delta.toFixed(2)}</div><div class="kpi-label">Month-on-month Δ</div><div class="kpi-sub">${deltaLabel}</div></div>
  </div>`;

  // ── Monthly volume + avg rating chart
  safeChart('monthlyChart',document.getElementById('monthlyChart'), {
    data: {
      labels: monthLabels,
      datasets: [
        {type:'bar',label:'Reviews',data:counts,backgroundColor:monthColors.map(c=>c+'33'),borderColor:monthColors,borderWidth:2,yAxisID:'y'},
        {type:'line',label:'Avg Rating',data:avgRatings,borderColor:THEME.warn,backgroundColor:'transparent',pointBackgroundColor:avgRatings.map(r=>rC(r)),pointRadius:8,pointBorderColor:THEME.bg,pointBorderWidth:2,tension:0.3,yAxisID:'y2'}
      ]
    },
    options:{plugins:{legend:{labels:{color:THEME.tick,font:{size:9},boxWidth:10}},tooltip:TT},
      scales:{y:{position:'left',grid:{color:THEME.grid},ticks:{color:THEME.tick,stepSize:1},title:{display:true,text:'Reviews',color:THEME.axisTitle}},
              y2:{position:'right',min:0,max:5,grid:{display:false},ticks:{color:THEME.warn},title:{display:true,text:'Average rating',color:THEME.warn}},
              x:{grid:{display:false},ticks:{color:THEME.label}}}}
  });

  // ── Best & worst by month
  document.getElementById('monthBestWorst').innerHTML = months.map((m,i) => {
    const mb = byMonth[m];
    if(!mb.length) return '';
    const best  = mb.reduce((a,b)=>b.rating>a.rating?b:a);
    const worst = mb.reduce((a,b)=>b.rating<a.rating?b:a);
    return `
      <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)">
        <div style="font-size:12px;font-weight:700;color:${monthColors[i]};margin-bottom:6px">${monthLabels[i]} · ${mb.length} review${mb.length===1?'':'s'} · average ${avgRatings[i].toFixed(2)}</div>
        <div class="mini-row">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:12px;color:var(--green2);font-weight:700">Best</span>
            ${logoImg(best.beer,18)}
            <span style="color:var(--text-2);font-size:13px">${best.beer}</span>
          </div>
          <span class="rb ${rbC(best.rating)}">${best.rating.toFixed(2)}</span>
        </div>
        <div class="mini-row">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:12px;color:var(--red);font-weight:700">Worst</span>
            ${logoImg(worst.beer,18)}
            <span style="color:var(--text-2);font-size:13px">${worst.beer}</span>
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
      return {label:m,data:bkts,backgroundColor:monthColors[i]+'66',borderColor:monthColors[i],borderWidth:2};
    })},
    options:{plugins:{legend:{labels:{color:THEME.tick,font:{size:9},boxWidth:10}},tooltip:TT},
      scales:{y:{grid:{color:THEME.grid},ticks:{color:THEME.tick,stepSize:1}},x:{grid:{display:false},ticks:{color:THEME.label}}}}
  });

  // ── Style-mix doughnut charts — one per month, rendered dynamically
  const styleChartsEl = document.getElementById('temporal-style-charts');
  if(styleChartsEl){
    styleChartsEl.innerHTML = `<div class="g2">${months.map((m,i)=>`
      <div class="bb-panel">
        <div class="bb-panel-head">Style mix — ${monthLabels[i]}<span class="ph-right">${counts[i]} review${counts[i]===1?'':'s'}</span></div>
        <div class="bb-body"><div class="chart-box chart-box-short"><canvas id="styleChart_${i}"></canvas></div></div>
      </div>`).join('')}</div>`;
    months.forEach((m,i)=>{
      const sm={};
      byMonth[m].forEach(b=>{sm[b.style]=(sm[b.style]||0)+1;});
      const labels=Object.keys(sm),data=Object.values(sm);
      safeChart(`styleChart_${i}`,document.getElementById(`styleChart_${i}`),{type:'doughnut',
        data:{labels,datasets:[{data,backgroundColor:labels.map(s=>sC[s]||THEME.accent),borderWidth:2,borderColor:THEME.surface}]},
        options:{plugins:{legend:{position:'right',labels:{color:THEME.tick,font:{size:9},boxWidth:10}},tooltip:TT}}
      });
    });
  }

  // ── Seasonal Taste Profile — style × month heatmap
  const allStyles=Object.keys(sC);
  const heatData={};
  allStyles.forEach(style=>{
    heatData[style]={};
    months.forEach(m=>{
      const matching=byMonth[m].filter(b=>b.style===style);
      if(matching.length){
        const avgR=matching.reduce((s,b)=>s+b.rating,0)/matching.length;
        heatData[style][m]={avg:avgR,count:matching.length};
      }
    });
  });
  // Same breakpoints as rC(), rendered as translucent fills over the cell.
  function heatColor(a){
    if(a>=4.5)return'rgba(74,222,128,0.42)';if(a>=4.0)return'rgba(134,217,110,0.30)';
    if(a>=3.5)return'rgba(210,201,74,0.26)';if(a>=3.0)return'rgba(240,179,74,0.24)';
    if(a>=2.5)return'rgba(240,139,82,0.26)';return'rgba(242,112,124,0.30)';
  }
  let heatHtml='<table class="bb-table" style="text-align:center"><thead><tr><th style="text-align:left">Style</th>';
  months.forEach((m,i)=>{heatHtml+=`<th style="color:${monthColors[i]}">${monthAbbr[m]}</th>`;});
  heatHtml+='</tr></thead><tbody>';
  allStyles.forEach(style=>{
    heatHtml+=`<tr><td style="text-align:left;color:${sC[style]};font-weight:600;font-size:12px;white-space:nowrap">${style}</td>`;
    months.forEach(m=>{
      const cell=heatData[style][m];
      if(cell){
        // Cell color reads as a verdict, so only color one that clears MIN_N.
        // Thin cells still show their number, just without the heat behind it.
        const weak=thin(cell.count);
        heatHtml+=`<td style="background:${weak?'transparent':heatColor(cell.avg)};color:var(--text${weak?'-3':''});font-size:13px;font-weight:${weak?400:700};padding:6px 4px">${cell.avg.toFixed(2)}<br><span style="font-size:12px;color:var(--text-3);font-weight:400">${cell.count}×</span></td>`;
      }else{
        heatHtml+='<td style="color:var(--text-3);font-size:12px">—</td>';
      }
    });
    heatHtml+='</tr>';
  });
  heatHtml+='</tbody></table>';
  heatHtml+=`<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12px;color:var(--text-3)"><span>Low</span><div style="display:flex;height:10px;flex:1;max-width:200px;border:1px solid var(--border)"><div style="flex:1;background:rgba(242,112,124,0.30)"></div><div style="flex:1;background:rgba(240,139,82,0.26)"></div><div style="flex:1;background:rgba(240,179,74,0.24)"></div><div style="flex:1;background:rgba(210,201,74,0.26)"></div><div style="flex:1;background:rgba(74,222,128,0.42)"></div></div><span>High</span><span style="margin-left:auto">Cells under ${MIN_N} reviews are left uncolored</span></div>`;
  document.getElementById('seasonalHeatmap').innerHTML=heatHtml;

  // ── Momentum panel — compares latest two months
  const mRow = (l,v,c) => `<div class="mini-row"><span style="color:var(--text-3)">${l}</span><span class="${c}" style="font-weight:600;text-align:right">${v}</span></div>`;
  let momentum = '';
  months.forEach((m,i)=>{
    const mAvg = avgRatings[i];
    const mAbv = avg(byMonth[m].map(b=>b.abv));
    momentum += mRow(`${monthAbbr[m]} reviews`, counts[i], 'fl');
    momentum += mRow(`${monthAbbr[m]} average rating`, mAvg.toFixed(2), 'fl');
    momentum += mRow(`${monthAbbr[m]} average ABV`, mAbv.toFixed(2)+'%', '');
    if(i < months.length - 1) {
      const nextM = months[i+1];
      const paceChg = counts[i+1] - counts[i];
      const ratingChg = avgRatings[i+1] - avgRatings[i];
      const overlap = [...new Set(byMonth[m].map(b=>b.beer))].filter(n=>byMonth[nextM].some(b=>b.beer===n));
      momentum += mRow(`${monthAbbr[m]} → ${monthAbbr[nextM]} pace`, (paceChg>=0?'+':'')+paceChg+' review'+(Math.abs(paceChg)===1?'':'s'), paceChg>=0?'up':'dn');
      momentum += mRow(`${monthAbbr[m]} → ${monthAbbr[nextM]} Δ rating`, (ratingChg>=0?'+':'')+ratingChg.toFixed(2), ratingChg>=0?'up':'dn');
      momentum += mRow('Repeat brands', overlap.length?overlap.length+' ('+overlap.slice(0,3).join(', ')+(overlap.length>3?'…':'')+')':'0','');
    }
  });
  {const _mp=document.getElementById('momentumPanel'); if(_mp) _mp.innerHTML = momentum;}

  // ── Bump Chart — Country Rankings Over Time
  try {
    const BUMP_COLORS=['#f5a524','#60a5fa','#3ecf8e','#a78bfa','#f87171','#f472b6','#2dd4bf','#fb923c','#a3d977','#818cf8'];
    // Rank on the running average through each month, not on the month in
    // isolation: a country rarely gets more than one pour inside a single
    // month, so month-by-month ranks were re-shuffling on samples of one. A
    // country joins the chart the month its cumulative count reaches MIN_N.
    const runTotals = {};                 // cc → {t,c} accumulated to date
    const rankByMonth = {};
    months.forEach(m => {
      byMonth[m].forEach(b => {
        const e = runTotals[b.origin] || (runTotals[b.origin] = {t:0,c:0});
        e.t += b.rating; e.c++;
      });
      rankByMonth[m] = {};
      Object.entries(runTotals)
        .filter(([,v]) => !thin(v.c))
        .map(([cc,v]) => ({cc, a:v.t/v.c}))
        .sort((a,b) => b.a-a.a)
        .forEach((r,i) => { rankByMonth[m][r.cc] = i+1; });
    });

    // Lines: the countries that ever qualify, the eight most-reviewed first.
    const totals = {};
    beers.forEach(b => { totals[b.origin] = (totals[b.origin]||0)+1; });
    const topCodes = Object.keys(totals)
      .filter(cc => !thin(totals[cc]))
      .sort((a,b) => totals[b]-totals[a])
      .slice(0,8);

    const allRanks = months.flatMap(m => Object.values(rankByMonth[m]));
    const maxRank = allRanks.length ? Math.max(...allRanks) : 1;

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
            legend: { labels: { color: THEME.tick, font: { size: 11 }, boxWidth: 10 } },
            tooltip: { ...TT, callbacks: { label: c => `${c.dataset.label}: Rank #${c.raw}` } }
          },
          scales: {
            y: {
              reverse: true,
              min: 1,
              max: maxRank + 0.5,
              ticks: { color: THEME.tick, stepSize: 1, callback: v => '#'+v },
              grid: { color: THEME.grid },
              title: { display: true, text: 'Rank (1 = best)', color: THEME.axisTitle }
            },
            x: { grid: { display: false }, ticks: { color: THEME.label } }
          }
        }
      });
    }
  } catch(e) { console.error('Bump chart error:', e); }

  // ── Review timeline — chronological rating trend with 5-review rolling avg
  // (relocated from the former Analysis tab). Single pass builds labels, rating
  // data, point colors, and the rolling average in O(n).
  const tlLabels=new Array(beers.length),tlData=new Array(beers.length),tlColors=new Array(beers.length),tlRoll=new Array(beers.length);
  let rollSum=0;
  for(let i=0;i<beers.length;i++){
    const r=beers[i].rating;
    tlLabels[i]=`#${i+1}`;
    tlData[i]=r;
    tlColors[i]=rC(r);
    rollSum+=r;
    if(i>=5)rollSum-=beers[i-5].rating;
    tlRoll[i]=(rollSum/Math.min(i+1,5)).toFixed(2);
  }
  safeChart('timelineChart',document.getElementById('timelineChart'),{type:'line',
    data:{
      labels:tlLabels,
      datasets:[
        {label:'Rating',data:tlData,borderColor:THEME.accent,backgroundColor:'rgba(245,165,36,0.08)',fill:true,tension:.3,pointRadius:3,pointBackgroundColor:tlColors,pointBorderColor:THEME.bg,pointBorderWidth:1},
        {label:'5-Pt Avg',data:tlRoll,borderColor:THEME.info,borderDash:[3,3],tension:.3,pointRadius:0,fill:false},
      ]
    },
    options:{plugins:{legend:{labels:{color:THEME.tick,font:{size:9},boxWidth:10}},tooltip:TT},scales:{y:{min:1.5,max:5.2,grid:{color:THEME.grid},ticks:{color:THEME.tick}},x:{grid:{display:false},ticks:{color:THEME.tick,maxTicksLimit:12}}}}
  });
}

// ══════════════════════════════════════════════════════════════
// CONTRARIAN INDEX
// ══════════════════════════════════════════════════════════════
// Bump this date whenever the Untappd ratings below are re-verified.
// The refresh-untappd-reminder GitHub Action opens an issue every 2 weeks
// when this stamp gets stale (>14 days old).
const UNTAPPD_LAST_REFRESHED='2026-05-05';
const UNTAPPD_REFRESH_INTERVAL_DAYS=14;

function drawContrarian(){
  window._ciX=true;
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
    'Chimay Blue':4.05,
  };

  // STATS.brandList already has avg/cnt per beer — reuse it instead of
  // rebuilding totals from STATS.brandMap.
  const rows=STATS.brandList.filter(b=>globalAvgs[b.n]!==undefined).map(b=>{
    const global=globalAvgs[b.n], jwal=b.avg, delta=jwal-global;
    return {name:b.n,jwal,global,delta};
  }).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));

  const avgDelta=avg(rows.map(r=>r.delta));
  const _setTx=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  const _setCl=(id,v)=>{const e=document.getElementById(id); if(e) e.className=v;};
  _setTx('ciAvgDelta',(avgDelta>=0?'+':'')+avgDelta.toFixed(2));
  _setCl('ciAvgDelta','kpi-val '+(avgDelta>0?'up':avgDelta<0?'dn':'fl'));

  // Freshness indicator — turns yellow once Untappd data is older than the refresh interval.
  const freshEl=document.getElementById('ciFreshness');
  if(freshEl){
    const ageMs=Date.now()-new Date(UNTAPPD_LAST_REFRESHED).getTime();
    const ageDays=Math.floor(ageMs/86400000);
    const stale=ageDays>UNTAPPD_REFRESH_INTERVAL_DAYS;
    freshEl.textContent=`World ratings updated ${UNTAPPD_LAST_REFRESHED} (${ageDays}d ago)${stale?' · refresh due':''}`;
    freshEl.style.color=stale?THEME.warn:THEME.text3;
  }

  const mostContr=rows.reduce((a,b)=>Math.abs(b.delta)>Math.abs(a.delta)?b:a);
  _setTx('ciMostContrarian',mostContr.name);
  _setTx('ciMostSub',`Δ${mostContr.delta>=0?'+':''}${mostContr.delta.toFixed(2)}`);

  const overrater=rows.reduce((a,b)=>b.delta>a.delta?b:a);
  _setTx('ciOverrater',overrater.name);
  _setTx('ciOverSub',`+${overrater.delta.toFixed(2)} above world`);

  const underrater=rows.reduce((a,b)=>b.delta<a.delta?b:a);
  _setTx('ciUnderrater',underrater.name);
  _setTx('ciUnderSub',`${underrater.delta.toFixed(2)} below world`);

  const sorted=rows.slice().sort((a,b)=>b.delta-a.delta);
  const contrarianCanvas=document.getElementById('contrarianChart');
  if(contrarianCanvas) contrarianCanvas.style.height=Math.max(280,sorted.length*22)+'px';
  safeChart('contrarianChart',contrarianCanvas,{type:'bar',
    data:{labels:sorted.map(r=>r.name),datasets:[{label:'Me vs World',data:sorted.map(r=>+r.delta.toFixed(2)),
      backgroundColor:sorted.map(r=>r.delta>0?'rgba(62,207,142,0.75)':'rgba(248,113,113,0.75)'),
      borderColor:sorted.map(r=>r.delta>0?THEME.pos:THEME.neg),borderWidth:1.5}]},
    options:{indexAxis:'y',maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw>=0?'+':''}${c.raw} · Me: ${sorted[c.dataIndex].jwal.toFixed(2)} · World: ${sorted[c.dataIndex].global.toFixed(2)}`}}},
      scales:{x:{min:-2,max:2,grid:{color:THEME.grid},ticks:{color:THEME.tick},title:{display:true,text:'← World liked it more   ·   I liked it more →',color:THEME.axisTitle}},
              y:{grid:{display:false},ticks:{color:THEME.label,font:{size:9}}}}}
  });
}

// ══════════════════════════════════════════════════════════════
// SHARED CONSTANTS — IPO
// ══════════════════════════════════════════════════════════════
// 26 beers on watchlist (6 user-specified + 9 Claude picks + 5 additional + 6 pipeline promotions)
const IPO_WATCHLIST=[
  // User-specified
  {beer:'Birra Moretti',   style:'Lager',        origin:'IT', abv:4.6, region:'Udine, Friuli-Venezia Giulia', untappd:3.58, method:'Bottle'},
  {beer:'Peroni',          style:'Lager',        origin:'IT', abv:5.1, region:'Rome, Lazio',           untappd:3.52, method:'Bottle'},
  {beer:'Blue Moon',       style:'Wheat Beer',   origin:'US', abv:5.4, region:'Denver, Colorado',      untappd:3.56, method:'Draft'},
  {beer:'Miller Lite',     style:'Lager',        origin:'US', abv:4.2, region:'Milwaukee, Wisconsin',  untappd:2.51, method:'Can'},
  {beer:'Estrella Damm',   style:'Lager',        origin:'ES', abv:5.4, region:'Barcelona, Catalonia',  untappd:3.61, method:'Bottle'},
  {beer:'Estrella Galicia',style:'Lager',        origin:'ES', abv:5.5, region:'A Coruña, Galicia',     untappd:3.65, method:'Bottle'},
  // Claude picks — one per country not yet covered
  {beer:'Brahma',          style:'Lager',        origin:'BR', abv:4.8, region:'São Paulo, SP',         untappd:3.18, method:'Can'},
  {beer:'Quilmes',         style:'Lager',        origin:'AR', abv:4.9, region:'Buenos Aires, BA',      untappd:3.22, method:'Bottle'},
  {beer:'Tsingtao',        style:'Lager',        origin:'CN', abv:4.7, region:'Qingdao, Shandong',     untappd:3.29, method:'Bottle'},
  {beer:'Castle Lager',    style:'Lager',        origin:'ZA', abv:5.0, region:'Johannesburg, Gauteng', untappd:3.18, method:'Can'},
  {beer:'Pilsner Urquell', style:'Pilsner',      origin:'CZ', abv:4.4, region:'Pilsen, Bohemia',       untappd:3.80, method:'Bottle'},
  {beer:'Super Bock',      style:'Lager',        origin:'PT', abv:5.2, region:'Leça do Balio, Porto',  untappd:3.41, method:'Bottle'},
  {beer:'Mythos',          style:'Lager',        origin:'GR', abv:4.7, region:'Athens, Attica',        untappd:3.31, method:'Bottle'},
  {beer:'Victoria Bitter', style:'Lager',        origin:'AU', abv:4.9, region:'Melbourne, Victoria',   untappd:3.12, method:'Can'},
  {beer:'Norrlands Guld',  style:'Lager',        origin:'SE', abv:5.3, region:'Stockholm',             untappd:3.28, method:'Can'},
  // Additional picks
  {beer:'Asahi Super Dry', style:'Lager',        origin:'JP', abv:5.0, region:'Tokyo',                 untappd:3.60, method:'Bottle'},
  {beer:'Hoegaarden',      style:'Wheat Beer',   origin:'BE', abv:4.9, region:'Hoegaarden',            untappd:3.72, method:'Bottle'},
  {beer:'Kronenbourg 1664',style:'Lager',        origin:'FR', abv:5.5, region:'Obernai, Alsace',       untappd:3.30, method:'Can'},
  {beer:'Newcastle Brown', style:'Brown Ale',    origin:'GB-ENG', abv:4.7, region:'Tadcaster, Yorkshire',  untappd:3.28, method:'Bottle'},
  {beer:'Ringnes',         style:'Lager',        origin:'NO', abv:4.7, region:'Oslo',                  untappd:3.10, method:'Can'},
  // Pipeline promotions
  {beer:'Żywiec',          style:'Lager',        origin:'PL', abv:5.5, region:'Żywiec, Silesia',       untappd:3.35, method:'Bottle'},
  {beer:'Tyskie',          style:'Pilsner',      origin:'PL', abv:5.6, region:'Tychy, Silesia',        untappd:3.28, method:'Can'},
  {beer:'Chimay Blue',     style:'Belgian Ale',  origin:'BE', abv:9.0, region:'Chimay, Hainaut',       untappd:4.05, method:'Bottle'},
  {beer:'Leffe Blonde',    style:'Belgian Ale',  origin:'BE', abv:6.6, region:'Dinant, Namur',         untappd:3.75, method:'Bottle'},
  {beer:'Coopers Pale Ale',style:'Pale Ale',     origin:'AU', abv:4.5, region:'Adelaide, SA',          untappd:3.72, method:'Bottle'},
  {beer:'Sam Adams Boston Lager',style:'Lager',  origin:'US', abv:5.0, region:'Boston, MA',            untappd:3.48, method:'Bottle'},
];

// Recommendation candidates — only beers NOT already on IPO_WATCHLIST
const IPO_CANDIDATES=[
  {beer:'Paulaner Hefe',    style:'Wheat Beer',   origin:'DE', abv:5.5, region:'Munich',              untappd:3.87, method:'Bottle'},
  {beer:'Augustiner Helles',style:'Lager',        origin:'DE', abv:5.2, region:'Munich',              untappd:4.10, method:'Draft'},
  {beer:'Peroni Nastro Azzurro',style:'Lager',    origin:'IT', abv:5.1, region:'Rome, Lazio',         untappd:3.56, method:'Bottle'},
  {beer:"Smithwick's",      style:'Red Ale',      origin:'IE', abv:4.5, region:'Kilkenny',            untappd:3.45, method:'Draft'},
  {beer:"Tennent's",        style:'Lager',        origin:'GB-SCT', abv:4.0, region:'Glasgow, Scotland',   untappd:2.95, method:'Can'},
  {beer:'Orion',            style:'Lager',        origin:'JP', abv:5.0, region:'Naha, Okinawa',       untappd:3.42, method:'Can'},
  {beer:'Menabrea',         style:'Lager',        origin:'IT', abv:4.8, region:'Biella, Piedmont',    untappd:3.55, method:'Bottle'},
  {beer:'Tuborg',           style:'Pilsner',      origin:'DK', abv:4.6, region:'Copenhagen',          untappd:3.10, method:'Can'},
  {beer:'Sol',              style:'Lager',        origin:'MX', abv:4.5, region:'Mexico City',         untappd:3.15, method:'Bottle'},
  {beer:'Singha',           style:'Lager',        origin:'TH', abv:5.0, region:'Bangkok',             untappd:3.25, method:'Bottle'},
  {beer:'Tiger Beer',       style:'Lager',        origin:'SG', abv:5.0, region:'Singapore',           untappd:3.18, method:'Can'},
];

// ══════════════════════════════════════════════════════════════
// PREDICTED RATING — shared scoring formula
// ══════════════════════════════════════════════════════════════
// Blends Untappd market consensus with JWAL's historical biases:
//   50% Untappd global avg · 25% JWAL style-adjusted · 15% JWAL
//   country-adjusted · 10% JWAL base anchor · + serving-method nudge.
function predictRating(style,origin,untappd,method='Bottle'){
  const g=STATS.globalAvg;
  // A style or country average only becomes a signal once MIN_N reviews stand
  // behind it. Below that the term falls back to the global average, which
  // makes it contribute nothing rather than bending the prediction toward a
  // single pour.
  const sM=STATS.styleMap[style];
  const styleAvg=sM&&!thin(sM.c)?sM.t/sM.c:g;
  const cM=STATS.countryMap[origin];
  const countryAvg=cM&&!thin(cM.c)?cM.t/cM.c:g;
  const methodAdj=method==='Draft'?0.10:method==='Nitro'?0.05:method==='Can'?-0.10:0;
  const t=untappd*0.50+(g+(styleAvg-g))*0.25+(g+(countryAvg-g))*0.15+g*0.10+methodAdj;
  return Math.min(5.0,Math.max(1.0,t));
}

// ══════════════════════════════════════════════════════════════
// RECOMMENDATIONS — "WHAT TO DRINK NEXT"
// ══════════════════════════════════════════════════════════════
// Ranks unreviewed candidate beers by predicted JWAL rating (taste
// profile + Untappd consensus) and explains each pick with rationale
// chips derived from his style / country / serving biases.
function drawRecommendations(){
  window._recD=true;
  try {
    const reviewed=new Set(beers.map(b=>b.beer));
    const g=STATS.globalAvg;
    const picks=IPO_CANDIDATES
      .filter(c=>!reviewed.has(c.beer))
      .map(c=>{
        const pred=predictRating(c.style,c.origin,c.untappd,c.method);
        return {...c,_pred:pred,_delta:pred-g};
      })
      .sort((a,b)=>b._pred-a._pred);

    const cntEl=document.getElementById('rec-count');
    if(cntEl) cntEl.textContent=picks.length+' pick'+(picks.length!==1?'s':'');

    // Rationale chips: compare each beer's attributes to JWAL's biases.
    function rationale(c){
      const chips=[];
      // Same bar as the prediction: don't claim "I like X" off one review.
      const sM=STATS.styleMap[c.style];
      if(sM&&!thin(sM.c)){const sa=sM.t/sM.c; if(sa>=g) chips.push(`I like ${c.style} · ${sa.toFixed(2)}`);}
      const cM=STATS.countryMap[c.origin];
      if(cM&&!thin(cM.c)){const ca=cM.t/cM.c; if(ca>=g) chips.push(`${FLAGS[c.origin]||''} ${c.origin} favourite · ${ca.toFixed(2)}`);}
      if(c.method==='Draft'||c.method==='Nitro') chips.push(`Better on ${c.method.toLowerCase()}`);
      if(c._pred>=4.0) chips.push('Top shelf');
      if(!chips.length) chips.push(`World rates it ${c.untappd.toFixed(2)}`);
      return chips.slice(0,3);
    }

    const recEl=document.getElementById('recPicks');
    if(recEl){
      recEl.innerHTML=picks.length?picks.map((c,i)=>{
        const col=rC(c._pred);
        const chips=rationale(c).map(t=>`<span class="rec-chip">${t}</span>`).join('');
        return `<div class="ipo-top-pick rec-pick" style="border-left-color:${col}">
          <div class="tp-head"><span class="rec-rank">#${i+1}</span> ${logoImg(c.beer,20)} <span>${c.beer}</span></div>
          <div class="tp-style">${FLAGS[c.origin]||''} ${c.style} · ${c.abv.toFixed(1)}% · ${c.method}</div>
          <div class="tp-row">
            <span style="color:var(--purple)">World ${c.untappd.toFixed(2)}</span>
            <span class="tp-upside" style="color:${col}">${c._pred.toFixed(2)}</span>
          </div>
          <div class="tp-row" style="margin-top:4px">
            <span style="color:${col}">${strs(c._pred)}</span>
            <span style="color:var(--text-3)">My guess</span>
          </div>
          <div class="rec-why">${chips}</div>
        </div>`;
      }).join(''):'<div style="color:var(--text-3);padding:12px">All candidates reviewed — nothing pending.</div>';
    }
  } catch(e){ console.error('Recommendations error:',e); }
}

// ══════════════════════════════════════════════════════════════
// IPO WATCHLIST
// ══════════════════════════════════════════════════════════════
function drawIPO(){
  window._ipoD=true;
  try {

  // Analyst target uses the shared predictRating() scoring formula
  // (50% Untappd consensus · 25% style bias · 15% country bias · 10%
  // base anchor · + serving-method nudge).
  // Pre-compute all analyst targets (cached in a Map)
  const targetCache=new Map();
  IPO_WATCHLIST.forEach(w=>{
    targetCache.set(w.beer,predictRating(w.style,w.origin,w.untappd,w.method));
  });

  const reviewed=new Set(beers.map(b=>b.beer));
  // Enrich with target + upside, sort pending by upside descending
  const pending=IPO_WATCHLIST.filter(w=>!reviewed.has(w.beer))
    .map(w=>{const t=targetCache.get(w.beer);return {...w,_target:t,_upside:t-w.untappd};})
    .sort((a,b)=>b._upside-a._upside);
  const priced=IPO_WATCHLIST.filter(w=>reviewed.has(w.beer));

  const _ipoTx=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  _ipoTx('ipo-pending',pending.length);
  _ipoTx('ipo-priced',priced.length);
  _ipoTx('ipo-watch-count',pending.length+' beer'+(pending.length!==1?'s':'')+' queued');

  const allTargets=[...targetCache.values()];
  _ipoTx('ipo-avg-analyst',(allTargets.reduce((s,v)=>s+v,0)/allTargets.length).toFixed(2));
  _ipoTx('ipo-avg-market',(IPO_WATCHLIST.reduce((s,w)=>s+w.untappd,0)/IPO_WATCHLIST.length).toFixed(2));

  // Signal helper used by table + conveyor
  function sigOf(target){
    const label=target>=4.0?'Must try':target>=3.5?'Worth it':target>=3.0?'Decent':target>=2.5?'Meh':'Skip';
    const color=target>=4.0?THEME.pos:target>=3.5?'#d2c94a':target>=3.0?'#f0b34a':target>=2.5?'#f08b52':THEME.neg;
    return {label,color};
  }

  {const _wb=document.getElementById('ipoWatchBody'); if(_wb) _wb.innerHTML=pending.map(w=>{
    const target=w._target, upside=w._upside;
    const uClass=upside>0.2?'up':upside<-0.2?'dn':'fl';
    const {label:signal,color:sigColor}=sigOf(target);
    return `<tr style="border-left-color:${sigColor}">
      <td>${logoImg(w.beer,24)}</td>
      <td style="color:var(--text);font-weight:600">${w.beer}<br><span style="color:var(--text-3);font-size:12px;font-weight:400">${w.style}</span></td>
      <td>${FLAGS[w.origin]||''} <span style="color:var(--text-2)">${w.origin}</span></td>
      <td style="color:var(--info)">${w.abv.toFixed(1)}%</td>
      <td style="color:var(--purple);font-family:var(--mono);font-weight:700">${w.untappd.toFixed(2)}</td>
      <td style="color:var(--info);font-family:var(--mono);font-weight:700">${target.toFixed(2)}</td>
      <td class="${uClass}" style="font-family:var(--mono);font-weight:700">${upside>=0?'+':''}${upside.toFixed(2)}</td>
      <td><span style="font-size:12px;padding:2px 7px;border:1px solid ${sigColor};color:${sigColor};font-weight:700">${signal}</span></td>
    </tr>`;
  }).join('');}

  // ── TOP-PICKS CONVEYOR (top 6 by upside)
  const topPicksEl=document.getElementById('ipoTopPicks');
  const topN=pending.slice(0,6);
  const topCountEl=document.getElementById('ipo-top-count');
  if(topCountEl) topCountEl.textContent=topN.length+' of '+pending.length;
  if(topPicksEl){
    topPicksEl.innerHTML=topN.length?topN.map(w=>{
      const {label:signal,color:sigColor}=sigOf(w._target);
      const uClass=w._upside>0?'up':w._upside<0?'dn':'fl';
      return `<div class="ipo-top-pick" style="border-left-color:${sigColor}">
        <div class="tp-head">${logoImg(w.beer,20)} <span>${w.beer}</span></div>
        <div class="tp-style">${FLAGS[w.origin]||''} ${w.style} · ${w.abv.toFixed(1)}%</div>
        <div class="tp-row">
          <span style="color:var(--info)">My guess ${w._target.toFixed(2)}</span>
          <span class="tp-upside ${uClass}">${w._upside>=0?'+':''}${w._upside.toFixed(2)}</span>
        </div>
        <div class="tp-row" style="margin-top:6px">
          <span style="color:var(--purple)">World ${w.untappd.toFixed(2)}</span>
          <span class="tp-signal" style="border-color:${sigColor};color:${sigColor}">${signal}</span>
        </div>
      </div>`;
    }).join(''):'<div style="color:var(--text-3);padding:12px">Tried everything on the list — nothing pending.</div>';
  }

  // ── UPSIDE DISTRIBUTION CHART
  const upCanvas=document.getElementById('ipoUpsideChart');
  if(upCanvas && pending.length){
    const buckets=[
      {lbl:'< −0.5',lo:-Infinity,hi:-0.5,color:THEME.neg},
      {lbl:'−0.5…0',lo:-0.5,hi:0,color:'#f08b52'},
      {lbl:'0…+0.5',lo:0,hi:0.5,color:'#d2c94a'},
      {lbl:'+0.5…+1',lo:0.5,hi:1,color:THEME.pos},
      {lbl:'> +1.0',lo:1,hi:Infinity,color:'#4ade80'}
    ];
    const counts=buckets.map(b=>pending.filter(w=>w._upside>=b.lo && w._upside<b.hi).length);
    safeChart('ipoUpsideChart',upCanvas,{type:'bar',
      data:{labels:buckets.map(b=>b.lbl),datasets:[{data:counts,backgroundColor:buckets.map(b=>b.color),borderWidth:0}]},
      options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>c.raw+' BEER'+(c.raw!==1?'S':'')}}},scales:{x:{beginAtZero:true,grid:{color:THEME.grid},ticks:{color:THEME.tick,precision:0}},y:{grid:{display:false},ticks:{color:THEME.label,font:{size:9}}}}}
    });
  } else if(upCanvas){
    const prev=_charts['ipoUpsideChart']; if(prev){prev.destroy();delete _charts['ipoUpsideChart'];}
  }

  // ── PRICED PANEL (hide entirely when empty)
  const pricedPanel=document.getElementById('ipoPricedPanel');
  const _pb=document.getElementById('ipoPricedBody');
  if(priced.length===0){
    if(pricedPanel) pricedPanel.style.display='none';
    if(_pb) _pb.innerHTML='';
    _ipoTx('ipo-priced-count','0 beers');
  } else {
    if(pricedPanel) pricedPanel.style.display='';
    _ipoTx('ipo-priced-count',priced.length+' beer'+(priced.length!==1?'s':''));
    if(_pb) _pb.innerHTML=priced.map(w=>{
      const target=targetCache.get(w.beer);
      const revd=BEER_REVIEWS.get(w.beer)||[];
      const jwalPrice=avg(revd.map(b=>b.rating));
      const vsAnalyst=jwalPrice-target;
      const vsMkt=jwalPrice-w.untappd;
      const verdict=vsAnalyst>0.3?'Beat my guess':vsAnalyst>-0.3?'On target':'Below my guess';
      const vColor=vsAnalyst>0.3?THEME.pos:vsAnalyst<-0.3?THEME.neg:THEME.warn;
      return `<tr>
        <td>${logoImg(w.beer,24)}</td>
        <td style="color:var(--text);font-weight:600">${w.beer}<br><span style="color:var(--text-3);font-size:12px;font-weight:400">${w.style}</span></td>
        <td>${FLAGS[w.origin]||''} <span style="color:var(--text-2)">${w.origin}</span></td>
        <td style="color:var(--purple);font-family:var(--mono)">${w.untappd.toFixed(2)}</td>
        <td style="color:var(--info);font-family:var(--mono)">${target.toFixed(2)}</td>
        <td><span class="rb ${rbC(jwalPrice)}">${jwalPrice.toFixed(2)}</span></td>
        <td class="${vsAnalyst>=0?'up':'dn'}" style="font-family:var(--mono)">${vsAnalyst>=0?'+':''}${vsAnalyst.toFixed(2)}</td>
        <td class="${vsMkt>=0?'up':'dn'}" style="font-family:var(--mono)">${vsMkt>=0?'+':''}${vsMkt.toFixed(2)}</td>
        <td><span style="font-size:12px;padding:1px 6px;border:1px solid ${vColor};color:${vColor}">${verdict}</span></td>
      </tr>`;
    }).join('');
  }

  } catch(e){ console.error('IPO error:',e); }
}

// ══════════════════════════════════════════════════════════════
// COMMAND PALETTE (Ctrl+K / Cmd+K)
// ══════════════════════════════════════════════════════════════
(function initCommandPalette(){
  const TABS=[
    {id:'overview',label:'Home',icon:'🏠',key:'1'},
    {id:'beers',label:'All beers',icon:'🍺',key:'2'},
    {id:'maps',label:'Map',icon:'📍',key:'3'},
    {id:'maps',label:'Map · where I drank them',icon:'🍺',key:'',mode:'drank'},
    {id:'maps',label:'Map · where they\'re brewed',icon:'🏭',key:'',mode:'brewed'},
    {id:'maps',label:'Map · brewery to my glass',icon:'✈',key:'',mode:'journey'},
    {id:'maps',label:'Map · passport',icon:'🛂',key:'',mode:'passport'},
    {id:'insights',label:'Insights',icon:'📊',key:'4'},
    {id:'geo',label:'Insights · places',icon:'🌍',key:''},
    {id:'temporal',label:'Insights · over time',icon:'📈',key:''},
    {id:'markets',label:'Insights · what to try',icon:'🍺',key:''},
  ];

  let prevFocus=null;
  function openPalette(){
    const pal=document.getElementById('cmd-palette');
    const inp=document.getElementById('cmd-input');
    if(!pal||!inp) return;
    prevFocus=document.activeElement;
    inp.value='';
    pal.classList.add('open');
    // Focus after the visibility transition's first frame: focus() on an
    // input whose computed visibility is still 'hidden' is silently ignored.
    requestAnimationFrame(()=>requestAnimationFrame(()=>inp.focus()));
    renderResults('');
  }
  function closePalette(){
    const pal=document.getElementById('cmd-palette');
    if(!pal||!pal.classList.contains('open')) return;
    pal.classList.remove('open');
    restoreFocus(prevFocus,pal);
    prevFocus=null;
  }

  function renderResults(q){
    const container=document.getElementById('cmd-results');
    if(!container) return;
    const lq=q.toLowerCase().trim();
    let html='';

    // Tabs nav
    const matchedTabs=lq?TABS.filter(t=>t.label.toLowerCase().includes(lq)||t.id.toLowerCase().includes(lq)):TABS;
    if(matchedTabs.length){
      html+=`<div class="cmd-section">Navigate</div>`;
      html+=matchedTabs.slice(0,10).map(t=>`
        <div class="cmd-item" data-tab="${t.id}"${t.mode?` data-mode="${t.mode}"`:''} data-action="tab">
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
        html+=`<div class="cmd-section">Beers</div>`;
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
        html+=`<div class="cmd-section">Breweries</div>`;
        html+=matchedBrew.map(b=>`
          <div class="cmd-item" data-brewery="${b.name.replace(/"/g,'&quot;')}" data-action="brewery">
            <span class="cmd-item-icon">🏭</span>
            <span class="cmd-item-main">${b.name}</span>
            <span class="cmd-item-meta">${b.location} · ${FLAGS[b.cc]||''}</span>
          </div>`).join('');
      }
    }

    if(!html) html=`<div style="padding:24px;text-align:center;color:var(--text-3)">No results</div>`;
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
    const brewery=BREWERY_BY_NAME.get(name);
    if(!brewery) return;

    const drawer=document.getElementById('brewery-drawer');
    const title=document.getElementById('drawer-title');
    const body=document.getElementById('drawer-body');
    if(!drawer||!body) return;

    const avgR=avg(brewery.ratings);
    const ratingsHTML=brewery.ratings.map(r=>`<span class="rb ${rbC(r)}" style="margin-right:3px">${r.toFixed(2)}</span>`).join('');

    if(title) title.textContent=brewery.name;

    body.innerHTML=`
      <div class="drawer-stat"><span class="drawer-key">Brewery</span><span class="drawer-val" style="max-width:200px">${brewery.name}</span></div>
      ${brewery.nativeName?`<div class="drawer-stat"><span class="drawer-key">Native name</span><span class="drawer-val" style="max-width:200px">${brewery.nativeName}</span></div>`:''}
      <div class="drawer-stat"><span class="drawer-key">Location</span><span class="drawer-val">${brewery.location}</span></div>
      <div class="drawer-stat"><span class="drawer-key">Country</span><span class="drawer-val">${FLAGS[brewery.cc]||''} ${brewery.country}</span></div>
      <div class="drawer-stat"><span class="drawer-key">Language</span><span class="drawer-val">${LANG_NAMES_IDX[brewery.lang]||brewery.lang}</span></div>
      <div class="drawer-stat"><span class="drawer-key">Average rating</span><span class="rb ${rbC(avgR)}" style="font-size:13px">${avgR.toFixed(2)}</span></div>
      <div class="drawer-stat"><span class="drawer-key">Reviews</span><span class="drawer-val">${brewery.ratings.length}</span></div>
      <div class="drawer-section">Ratings</div>
      <div style="margin-bottom:10px;padding-top:4px">${ratingsHTML}</div>
      <div class="drawer-section">Beers</div>
      <div style="color:var(--text-2);line-height:1.9;padding-top:4px">${brewery.beers.split(' · ').map(b=>`<div>${b}</div>`).join('')}</div>
      <div class="drawer-section">Coordinates</div>
      <div style="color:var(--text-3);padding-top:4px">${brewery.lat.toFixed(4)}°, ${brewery.lng.toFixed(4)}°</div>
    `;

    _drawerPrevFocus=document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    const dc=document.getElementById('drawer-close'); if(dc) dc.focus();

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
      L.circleMarker([brewery.lat,brewery.lng],{radius:9,fillColor:THEME.accent,color:THEME.bg,weight:2,fillOpacity:1}).addTo(_drawerMap);
      _drawerMap.invalidateSize();
    },120);
  } catch(e){ console.error('Brewery drawer error:',e); }
}

let _drawerPrevFocus=null;
function closeBreweryDrawer(){
  const drawer=document.getElementById('brewery-drawer');
  if(!drawer||!drawer.classList.contains('open')) return;
  drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');
  restoreFocus(_drawerPrevFocus,drawer);
  _drawerPrevFocus=null;
}

window.openBreweryDrawer=openBreweryDrawer;
window.closeBreweryDrawer=closeBreweryDrawer;

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
      'spark-hit': months.map(m=>{ const rs=byMonth[m]; return rs.length?rs.filter(b=>b.rating>=3).length/rs.length*100:null; }),
    };
    const sparkColors={
      'spark-top':THEME.pos,'spark-avg':THEME.warn,'spark-low':THEME.neg,
      'spark-abv':THEME.info,'spark-brands':THEME.accent,'spark-hit':THEME.pos
    };

    Object.entries(sparkData).forEach(([id,data])=>{
      const canvas=document.getElementById(id);
      if(!canvas) return;
      const color=sparkColors[id]||THEME.accent;
      safeChart(id,canvas,{
        type:'line',
        data:{
          labels:months,
          datasets:[{data,borderColor:color,backgroundColor:color+'22',borderWidth:1.5,
            pointRadius:2,pointBackgroundColor:color,fill:true,tension:0.4,spanGaps:true}]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
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
    animate('ov-hit-val',beers.length?beers.filter(b=>b.rating>=3).length/beers.length*100:0,0,'%');

    // MoM delta chips — latest sparkline point vs the one before
    [['ov-top-delta','spark-top',v=>v.toFixed(2)],
     ['ov-avg-delta','spark-avg',v=>v.toFixed(2)],
     ['ov-low-delta','spark-low',v=>v.toFixed(2)],
     ['ov-abv-delta','spark-abv',v=>v.toFixed(1)+'pp'],
     ['ov-brands-delta','spark-brands',v=>String(Math.round(v))],
     ['ov-hit-delta','spark-hit',v=>Math.round(v)+'pp'],
    ].forEach(([id,key,f])=>{
      const el=document.getElementById(id);
      if(!el) return;
      const d=sparkData[key],a=d[d.length-2],b=d[d.length-1];
      if(a==null||b==null){ el.textContent=''; return; }
      const diff=b-a,up=diff>0.005,dn=diff<-0.005;
      el.className='kpi-delta '+(up?'up':dn?'dn':'fl');
      el.textContent=(up?'▲':dn?'▼':'→')+f(Math.abs(diff));
      el.title='vs previous month';
    });
  } catch(e){ console.error('KPI sparklines error:',e); }
})();

// ══════════════════════════════════════════════════════════════
// EVENT DELEGATION (replaces inline onclick handlers)
// ══════════════════════════════════════════════════════════════
try {
  // Rail tab navigation (the single primary nav on desktop)
  const railEl = document.getElementById('sidebar');
  if (railEl) railEl.addEventListener('click', function(e) {
    const item = e.target.closest('.nav-item[data-tab]');
    if (item) showTab(item.dataset.tab, item);
  });

  // Context-bar search button — makes the ⌘K palette discoverable by mouse
  const searchBtn = document.getElementById('tb-search');
  if (searchBtn) searchBtn.addEventListener('click', function() {
    if (typeof window.openPalette === 'function') window.openPalette();
  });

  // Bottom nav (mobile thumb-reach)
  const bottomnav = document.getElementById('bottomnav');
  if (bottomnav) bottomnav.addEventListener('click', function(e) {
    const item = e.target.closest('.bn-item[data-tab]');
    if (item) showTab(item.dataset.tab, item);
  });

  // Map view switcher (drank / brewed / journey)
  document.getElementById('maps').addEventListener('click', function(e) {
    const btn = e.target.closest('.map-mode[data-mode]');
    if (btn) setMapMode(btn.dataset.mode);
  });

  // Journey table rows open the beer's detail modal
  document.getElementById('journeyTbody').addEventListener('click', function(e) {
    const row = e.target.closest('tr[data-beer]');
    if (row) openBeerModal(row.dataset.beer);
  });

  // Insights sub-section navigation (Places / Over time / What to try)
  document.getElementById('insights').addEventListener('click', function(e) {
    const btn = e.target.closest('.subtab[data-subtab]');
    if (btn) showInsightsSubtab(btn.dataset.subtab);
  });

  // Overview — recent-activity / month-in-review rows open the beer modal
  const ovPanel=document.getElementById('overview');
  ovPanel.addEventListener('click', function(e) {
    const row = e.target.closest('.feed-row[data-beer]');
    if (row) openBeerModal(row.dataset.beer);
  });
  ovPanel.addEventListener('keydown', function(e) {
    if (e.key!=='Enter' && e.key!==' ') return;
    const row = e.target.closest('.feed-row[data-beer]');
    if (row) { e.preventDefault(); openBeerModal(row.dataset.beer); }
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

  // Beer filter controls (search debounced; select changes instant)
  document.getElementById('beerSearch').addEventListener('input', applyBeerFilterDebounced);
  ['beerStyleFilter','beerOriginFilter','beerMonthFilter'].forEach(id =>
    document.getElementById(id).addEventListener('change', applyBeerFilter));

  // Sortable column headers — click to sort, click again to reverse
  document.getElementById('beerHead').addEventListener('click', function(e) {
    const th = e.target.closest('th[data-sort]');
    if (!th) return;
    const key = th.dataset.sort;
    if (beerSort.key === key) { beerSort.dir = -beerSort.dir; }
    else { beerSort.key = key; beerSort.dir = (key==='abv'||key==='rating'||key==='month') ? -1 : 1; }
    applyBeerFilter();
  });

  // Active-filter chips — ✕ removes one filter, CLEAR ALL resets everything
  document.getElementById('beerChips').addEventListener('click', function(e) {
    const chip = e.target.closest('[data-clear]');
    if (!chip) return;
    const k = chip.dataset.clear;
    if (k === 'all') { resetBeerFilter(); return; }
    const id = {q:'beerSearch',st:'beerStyleFilter',or:'beerOriginFilter',mo:'beerMonthFilter'}[k];
    document.getElementById(id).value = '';
    applyBeerFilter();
  });

  // Beer table rows (+ "clear filters" button in the empty-state row)
  document.getElementById('beerBody').addEventListener('click', function(e) {
    if (e.target.closest('#beerFilterReset')) { resetBeerFilter(); return; }
    const row = e.target.closest('tr[data-beer]');
    if (row) openBeerModal(row.dataset.beer);
  });

  // Keyboard activation for tab items (focusable divs with role="tab")
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest ? e.target.closest('.nav-item[data-tab]') : null;
    if (el) { e.preventDefault(); showTab(el.dataset.tab, el); }
  });

  // Trap Tab inside whichever overlay is open (modal > palette > drawer)
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    const overlay =
      document.getElementById('beerModal').classList.contains('open') ? document.getElementById('beerModalBox') :
      document.getElementById('cmd-palette').classList.contains('open') ? document.getElementById('cmd-box') :
      document.getElementById('brewery-drawer').classList.contains('open') ? document.getElementById('brewery-drawer') : null;
    if (!overlay) return;
    const els = [...overlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
    if (!els.length) { e.preventDefault(); return; }
    const first = els[0], last = els[els.length - 1];
    const inside = overlay.contains(document.activeElement);
    if (e.shiftKey && (!inside || document.activeElement === first)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (!inside || document.activeElement === last)) { e.preventDefault(); first.focus(); }
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
    // Close (and restore focus) BEFORE opening the next overlay so its own
    // focus save/restore chains from the real underlying element.
    if (item.dataset.action === 'beer') { closePalette(); openBeerModal(item.dataset.beer); }
    else if (item.dataset.action === 'brewery') { closePalette(); openBreweryDrawer(item.dataset.brewery); }
    else if (item.dataset.action === 'tab') {
      closePalette(); showTab(item.dataset.tab);
      // Map view entries also flip the map to that view (safe pre-init: it
      // records the mode and initWorldMap applies it when the map builds).
      if (item.dataset.mode) setMapMode(item.dataset.mode);
    }
  });

  // Collapsed analytics sections render their charts at zero size while hidden;
  // resize them the first time the section is expanded. `toggle` doesn't bubble,
  // so listen in the capture phase.
  document.addEventListener('toggle', function(e) {
    const d = e.target;
    if (!d || d.tagName !== 'DETAILS' || !d.open || !d.classList.contains('bb-collapse')) return;
    resizeChartsIn(d);
  }, true);

  // Boot tab: honor a #hash deep link (e.g. index.html#maps), else land on
  // Overview. Its charts render eagerly at top level, while the Leaflet maps
  // stay lazy until the MAPS tab (F2) first becomes visible.
  const validTab = h => TAB_PANELS.some(p => p.id === h) || INSIGHTS_SUBS.includes(h);
  const bootHash = location.hash.slice(1);
  showTab(validTab(bootHash) ? bootHash : 'overview');
  // showTab writes the tab into the URL fragment while the document is still
  // parsing, so the browser then performs its "scroll to fragment" step and
  // lands the page a header's height down. Tabs are panels, not anchors — the
  // right position is always the top.
  try{ history.scrollRestoration = 'manual'; }catch(e){}
  const toTop = () => { window.scrollTo(0,0); const m=document.getElementById('main'); if(m) m.scrollTop=0; };
  window.addEventListener('load', toTop);
  requestAnimationFrame(toTop);

  // Manually edited hashes / external links into an open page
  window.addEventListener('hashchange', function() {
    const h = location.hash.slice(1);
    const el = document.getElementById(h);
    if (validTab(h) && el && !el.classList.contains('active')) showTab(h);
  });
} catch(e) { console.error('Event delegation setup error:', e); }
