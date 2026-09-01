// ══════════════════════════════════════════════════════════════
// DATA — the store
// ══════════════════════════════════════════════════════════════
// GENERATED FILE — do not edit by hand.
//
// Every review, brewery, location, brand domain, Untappd average and
// want-to-try entry is written from the Supabase database behind the
// beer-review-buddy app, which is the source of truth. Add a beer there,
// and `npm run sync` — or the Sync from Supabase workflow, which runs it
// nightly — rewrites this file from what the database holds. An edit made
// here is lost at the next sync.
//
// It is still plain browser JavaScript loaded by a <script> tag before
// app.js — no imports, no build step. `beers`, `breweries` and `drunkLocs`
// are `let` so a host that stores the data elsewhere can replace their
// contents and call reloadData() (app.js) to repaint.
//
// Two brewery fields have no column behind them and are derived here from
// the reviews: `beers` (the beers that brewery makes) and `ratings` (what
// each scored). See tools/supabase-rows.mjs.
// ══════════════════════════════════════════════════════════════

const FLAGS={AR:"🇦🇷",AT:"🇦🇹",AU:"🇦🇺",BE:"🇧🇪",BR:"🇧🇷",CA:"🇨🇦",CN:"🇨🇳",CU:"🇨🇺",CZ:"🇨🇿",DE:"🇩🇪",DK:"🇩🇰",DO:"🇩🇴",ES:"🇪🇸",FR:"🇫🇷",GB:"🇬🇧","GB-ENG":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","GB-NIR":"🇬🇧","GB-SCT":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","GB-WLS":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",GR:"🇬🇷",IE:"🇮🇪",IT:"🇮🇹",JM:"🇯🇲",JP:"🇯🇵",LB:"🇱🇧",MX:"🇲🇽",NL:"🇳🇱",NO:"🇳🇴",PL:"🇵🇱",PR:"🇵🇷",PT:"🇵🇹",SE:"🇸🇪",SG:"🇸🇬",TH:"🇹🇭",US:"🇺🇸",ZA:"🇿🇦"};
const CNAMES={AR:"Argentina",AT:"Austria",AU:"Australia",BE:"Belgium",BR:"Brazil",CA:"Canada",CN:"China",CU:"Cuba",CZ:"Czech Republic",DE:"Germany",DK:"Denmark",DO:"Dominican Republic",ES:"Spain",FR:"France",GB:"Great Britain","GB-ENG":"England","GB-NIR":"Northern Ireland","GB-SCT":"Scotland","GB-WLS":"Wales",GR:"Greece",IE:"Ireland",IT:"Italy",JM:"Jamaica",JP:"Japan",LB:"Lebanon",MX:"Mexico",NL:"Netherlands",NO:"Norway",PL:"Poland",PR:"Puerto Rico",PT:"Portugal",SE:"Sweden",SG:"Singapore",TH:"Thailand",US:"USA",ZA:"South Africa"};

// ── REVIEWS — one entry per pour, in the order they were drunk
let beers=[
  // JAN 2026 (13 reviews)
  {beer:"Grolsch",                              style:"Pilsner",        origin:"NL",    abv:5.0,method:"Bottle",city:"Hengelo",        region:"Overijssel",          country:"Netherlands",cc:"NL",rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Hertog Jan",                           style:"Pilsner",        origin:"NL",    abv:5.1,method:"Bottle",city:"Hengelo",        region:"Overijssel",          country:"Netherlands",cc:"NL",rating:2.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Coors Light",                          style:"Lager",          origin:"US",    abv:4.2,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Sapporo Premium",                      style:"Lager",          origin:"JP",    abv:4.9,method:"Bottle",city:"Hartsdale",      region:"New York",            country:"USA",        cc:"US",rating:3.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Kirin Ichiban",                        style:"Lager",          origin:"JP",    abv:5.0,method:"Bottle",city:"Hartsdale",      region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Modelo Especial",                      style:"Lager",          origin:"MX",    abv:4.5,method:"Bottle",city:"White Plains",   region:"New York",            country:"USA",        cc:"US",rating:3.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Stella Artois",                        style:"Lager",          origin:"BE",    abv:5.0,method:"Bottle",city:"Eastchester",    region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Duvel",                                style:"Belgian Ale",    origin:"BE",    abv:8.5,method:"Bottle",city:"Amsterdam",      region:"Noord-Holland",       country:"Netherlands",cc:"NL",rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Carlsberg",                            style:"Pilsner",        origin:"DK",    abv:5.0,method:"Draft", city:"Montreal",       region:"Quebec",              country:"Canada",     cc:"CA",rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Harp Lager",                           style:"Lager",          origin:"IE",    abv:4.5,method:"Draft", city:"Montreal",       region:"Quebec",              country:"Canada",     cc:"CA",rating:4.25,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Kronenbourg 1664",                     style:"Lager",          origin:"FR",    abv:5.5,method:"Draft", city:"Montreal",       region:"Quebec",              country:"Canada",     cc:"CA",rating:3.00,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Michelob Ultra",                       style:"Lager",          origin:"US",    abv:4.2,method:"Can",   city:"White Plains",   region:"New York",            country:"USA",        cc:"US",rating:2.50,isNew:false,month:"Jan",monthN:1,year:2026},
  {beer:"Red Stripe",                           style:"Lager",          origin:"JM",    abv:4.7,method:"Bottle",city:"Clemson",        region:"South Carolina",      country:"USA",        cc:"US",rating:3.75,isNew:false,month:"Jan",monthN:1,year:2026},
  // FEB 2026 (11 reviews)
  {beer:"Heineken",                             style:"Lager",          origin:"NL",    abv:5.0,method:"Draft", city:"Uncasville",     region:"Connecticut",         country:"USA",        cc:"US",rating:3.25,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Guinness Draught",                     style:"Stout",          origin:"IE",    abv:4.2,method:"Nitro", city:"Eastchester",    region:"New York",            country:"USA",        cc:"US",rating:4.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Weihenstephaner Hefeweissbier",        style:"Wheat Beer",     origin:"DE",    abv:5.4,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:4.50,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Hofbräu Münchner Weiße",               style:"Wheat Beer",     origin:"DE",    abv:5.1,method:"Draft", city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:4.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Negra Modelo",                         style:"Lager",          origin:"MX",    abv:5.4,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Hofbräu Dunkel",                       style:"Lager",          origin:"DE",    abv:5.5,method:"Draft", city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Bud Light",                            style:"Lager",          origin:"US",    abv:4.2,method:"Bottle",city:"East Rutherford",region:"New Jersey",          country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Budweiser",                            style:"Lager",          origin:"US",    abv:5.0,method:"Bottle",city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Corona Extra",                         style:"Lager",          origin:"MX",    abv:4.5,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.75,isNew:false,month:"Feb",monthN:2,year:2026},
  {beer:"Birra Moretti",                        style:"Lager",          origin:"IT",    abv:4.6,method:"Bottle",city:"Sciara",         region:"Sicily",              country:"Italy",      cc:"IT",rating:3.75,isNew:true, month:"Feb",monthN:2,year:2026},
  {beer:"Erdinger Weißbier",                    style:"Wheat Beer",     origin:"DE",    abv:5.3,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.25,isNew:true, month:"Feb",monthN:2,year:2026},
  // MAR 2026 (16 reviews)
  {beer:"Estrella Galicia",                     style:"Lager",          origin:"ES",    abv:5.5,method:"Bottle",city:"Madrid",         region:"Madrid",              country:"Spain",      cc:"ES",rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Pilsner Urquell",                      style:"Pilsner",        origin:"CZ",    abv:4.4,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Wrench",                               style:"IPA",            origin:"US",    abv:7.1,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:4.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Fin Du Monde",                      style:"Belgian Ale",    origin:"CA",    abv:9.0,method:"Bottle",city:"Montreal",       region:"Quebec",              country:"Canada",     cc:"CA",rating:3.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Żywiec",                               style:"Lager",          origin:"PL",    abv:5.5,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Estrella Damm",                        style:"Lager",          origin:"ES",    abv:5.4,method:"Bottle",city:"Barcelona",      region:"Catalonia",           country:"Spain",      cc:"ES",rating:3.50,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Grolsch Puur Weizen",                  style:"Wheat Beer",     origin:"NL",    abv:5.1,method:"Draft", city:"Oldenzaal",      region:"Overijssel",          country:"Netherlands",cc:"NL",rating:5.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Frisse Lentebok",                      style:"Lager",          origin:"NL",    abv:6.5,method:"Bottle",city:"Hengelo",        region:"Overijssel",          country:"Netherlands",cc:"NL",rating:3.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Leffe Blonde",                         style:"Belgian Ale",    origin:"BE",    abv:6.6,method:"Draft", city:"Nijmegen",       region:"Gelderland",          country:"Netherlands",cc:"NL",rating:4.75,isNew:false,month:"Mar",monthN:3,year:2026},
  {beer:"Texels Skuumkoppe",                    style:"Wheat Beer",     origin:"NL",    abv:6.0,method:"Bottle",city:"Nijmegen",       region:"Gelderland",          country:"Netherlands",cc:"NL",rating:3.00,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Affligem Tripel",                      style:"Belgian Ale",    origin:"BE",    abv:9.0,method:"Draft", city:"Antwerp",        region:"Antwerp",             country:"Belgium",    cc:"BE",rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"De Koninck",                           style:"Pale Ale",       origin:"BE",    abv:5.2,method:"Draft", city:"Antwerp",        region:"Antwerp",             country:"Belgium",    cc:"BE",rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"IJwit",                                style:"Wheat Beer",     origin:"NL",    abv:6.5,method:"Draft", city:"Antwerp",        region:"Antwerp",             country:"Belgium",    cc:"BE",rating:3.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"La Chouffe Blonde",                    style:"Belgian Ale",    origin:"BE",    abv:8.0,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:4.25,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Stiegl Goldbräu",                      style:"Lager",          origin:"AT",    abv:5.0,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:true, month:"Mar",monthN:3,year:2026},
  {beer:"Modelo Oro",                           style:"Lager",          origin:"MX",    abv:4.0,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Mar",monthN:3,year:2026},
  // APR 2026 (6 reviews)
  {beer:"Super Bock",                           style:"Lager",          origin:"PT",    abv:5.2,method:"Bottle",city:"Lagos",          region:"Algarve",             country:"Portugal",   cc:"PT",rating:3.00,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Estrella Jalisco",                     style:"Lager",          origin:"MX",    abv:4.5,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.75,isNew:true, month:"Apr",monthN:4,year:2026,logo:"https://pennbeer.com/app/uploads/2021/06/ynaOvePfbmJEMed-400x400-noPad-300x300.png"},
  {beer:"Rolling Rock Extra Pale",              style:"Lager",          origin:"US",    abv:4.4,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.25,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Carlsberg Elephant",                   style:"Lager",          origin:"DK",    abv:7.2,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.50,isNew:true, month:"Apr",monthN:4,year:2026},
  {beer:"Dos Equis Lager Especial",             style:"Lager",          origin:"MX",    abv:4.2,method:"Draft", city:"Queens",         region:"New York",            country:"USA",        cc:"US",rating:1.75,isNew:true, month:"Apr",monthN:4,year:2026,logo:"https://thebrandinquirer.wordpress.com/wp-content/uploads/2021/05/dos-equis-nueva-imagen-logo-new-design-.jpg?w=1024"},
  {beer:"Miller Lite",                          style:"Lager",          origin:"US",    abv:4.2,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:2.25,isNew:true, month:"Apr",monthN:4,year:2026},
  // MAY 2026 (9 reviews)
  {beer:"Belhaven Scottish Stout",              style:"Stout",          origin:"GB-SCT",abv:5.2,method:"Nitro", city:"Boston",         region:"Massachusetts",       country:"USA",        cc:"US",rating:3.00,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Samuel Adams Summer Ale",              style:"Wheat Beer",     origin:"US",    abv:5.3,method:"Draft", city:"Boston",         region:"Massachusetts",       country:"USA",        cc:"US",rating:3.00,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Pacífico Clara",                       style:"Lager",          origin:"MX",    abv:4.5,method:"Bottle",city:"Clemson",        region:"South Carolina",      country:"USA",        cc:"US",rating:3.75,isNew:true, month:"May",monthN:5,year:2026,logo:"https://upload.wikimedia.org/wikipedia/en/f/f7/Pacifico_Logo.png"},
  {beer:"Narragansett Lager",                   style:"Lager",          origin:"US",    abv:5.0,method:"Can",   city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.25,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Big Wave Golden Ale",                  style:"Pale Ale",       origin:"US",    abv:4.4,method:"Can",   city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.75,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Smithwick's",                          style:"Red Ale",        origin:"IE",    abv:4.5,method:"Draft", city:"White Plains",   region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Daura",                                style:"Lager",          origin:"ES",    abv:5.4,method:"Bottle",city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"May",monthN:5,year:2026,logo:"logos/daura.svg"},
  {beer:"Asahi Super Dry",                      style:"Lager",          origin:"JP",    abv:5.0,method:"Bottle",city:"Eastchester",    region:"New York",            country:"USA",        cc:"US",rating:3.50,isNew:true, month:"May",monthN:5,year:2026},
  {beer:"Blue Moon",                            style:"Wheat Beer",     origin:"US",    abv:5.4,method:"Draft", city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.50,isNew:true, month:"May",monthN:5,year:2026},
  // JUN 2026 (9 reviews)
  {beer:"Hop Commander",                        style:"IPA",            origin:"US",    abv:6.5,method:"Draft", city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Paulaner Hefe-Weißbier",               style:"Wheat Beer",     origin:"DE",    abv:5.5,method:"Bottle",city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Medalla Light",                        style:"Lager",          origin:"PR",    abv:4.2,method:"Bottle",city:"San Juan",       region:"San Juan",            country:"Puerto Rico",cc:"PR",rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Magna",                                style:"Lager",          origin:"PR",    abv:4.5,method:"Bottle",city:"San Juan",       region:"San Juan",            country:"Puerto Rico",cc:"PR",rating:4.00,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Ocean SJU",                            style:"Lager",          origin:"PR",    abv:5.9,method:"Bottle",city:"San Juan",       region:"San Juan",            country:"Puerto Rico",cc:"PR",rating:2.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Bloodline Blood Orange IPA",           style:"IPA",            origin:"US",    abv:8.0,method:"Bottle",city:"San Juan",       region:"San Juan",            country:"Puerto Rico",cc:"PR",rating:3.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Goose IPA",                            style:"IPA",            origin:"US",    abv:5.9,method:"Can",   city:"Washington",     region:"District of Columbia",country:"USA",        cc:"US",rating:3.50,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Almaza Pilsener",                      style:"Pilsner",        origin:"LB",    abv:4.2,method:"Bottle",city:"Washington",     region:"District of Columbia",country:"USA",        cc:"US",rating:2.75,isNew:true, month:"Jun",monthN:6,year:2026},
  {beer:"Mythos",                               style:"Lager",          origin:"GR",    abv:5.0,method:"Bottle",city:"Washington",     region:"District of Columbia",country:"USA",        cc:"US",rating:3.25,isNew:true, month:"Jun",monthN:6,year:2026},
  // JUL 2026 (5 reviews)
  {beer:"Stone IPA",                            style:"IPA",            origin:"US",    abv:6.9,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:2.50,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Mahou Cinco Estrellas",                style:"Lager",          origin:"ES",    abv:5.5,method:"Bottle",city:"Boynton Beach",  region:"Florida",             country:"USA",        cc:"US",rating:3.50,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Hatuey Lager",                         style:"Lager",          origin:"CU",    abv:5.0,method:"Bottle",city:"Miami",          region:"Florida",             country:"USA",        cc:"US",rating:4.00,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Pub Ale",                              style:"Pale Ale",       origin:"GB-ENG",abv:4.7,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:4.25,isNew:true, month:"Jul",monthN:7,year:2026},
  {beer:"Spaten Oktoberfest Ur-Märzen / Winter",style:"Lager",          origin:"DE",    abv:5.9,method:"Draft", city:"New York",       region:"New York",            country:"USA",        cc:"US",rating:2.75,isNew:true, month:"Jul",monthN:7,year:2026},
  // AUG 2026 (10 reviews)
  {beer:"Peroni Nastro Azzurro",                style:"Lager",          origin:"IT",    abv:5.1,method:"Bottle",city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"DAB Dortmunder Export",                style:"Lager",          origin:"DE",    abv:5.0,method:"Draft", city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",rating:4.50,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Beck's",                               style:"Pilsner",        origin:"DE",    abv:4.9,method:"Bottle",city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Ichnusa Anima Sarda",                  style:"Lager",          origin:"IT",    abv:4.7,method:"Bottle",city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",rating:3.75,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Chill Lemon",                          style:"Shandy / Radler",origin:"IT",    abv:2.0,method:"Bottle",city:"Capri",          region:"Campania",            country:"Italy",      cc:"IT",rating:4.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Peroni Original",                      style:"Lager",          origin:"IT",    abv:4.7,method:"Bottle",city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",rating:3.25,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Bitburger Radler",                     style:"Shandy / Radler",origin:"DE",    abv:2.5,method:"Can",   city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:4.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Radeberger Pilsner",                   style:"Pilsner",        origin:"DE",    abv:4.8,method:"Bottle",city:"White Plains",   region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Presidente",                           style:"Pilsner",        origin:"DO",    abv:5.0,method:"Bottle",city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
  {beer:"Heineken Silver",                      style:"Lager",          origin:"NL",    abv:4.0,method:"Draft", city:"Queens",         region:"New York",            country:"USA",        cc:"US",rating:3.00,isNew:true, month:"Aug",monthN:8,year:2026},
];

// ── CONSUMPTION LOCATIONS — every city a review was logged in
let drunkLocs=[
  {city:"New York",       region:"New York",            country:"USA",        cc:"US",lat:40.7128,lng:-74.0060},
  {city:"New Rochelle",   region:"New York",            country:"USA",        cc:"US",lat:40.9115,lng:-73.7826},
  {city:"White Plains",   region:"New York",            country:"USA",        cc:"US",lat:41.0340,lng:-73.7629},
  {city:"Eastchester",    region:"New York",            country:"USA",        cc:"US",lat:40.9565,lng:-73.8115},
  {city:"Hartsdale",      region:"New York",            country:"USA",        cc:"US",lat:41.0215,lng:-73.7987},
  {city:"Montreal",       region:"Quebec",              country:"Canada",     cc:"CA",lat:45.5017,lng:-73.5673},
  {city:"Amsterdam",      region:"Noord-Holland",       country:"Netherlands",cc:"NL",lat:52.3676,lng:4.9041},
  {city:"Hengelo",        region:"Overijssel",          country:"Netherlands",cc:"NL",lat:52.2660,lng:6.7930},
  {city:"Uncasville",     region:"Connecticut",         country:"USA",        cc:"US",lat:41.4775,lng:-72.0892},
  {city:"Queens",         region:"New York",            country:"USA",        cc:"US",lat:40.7282,lng:-73.7949},
  {city:"Oldenzaal",      region:"Overijssel",          country:"Netherlands",cc:"NL",lat:52.3107,lng:6.9280},
  {city:"Nijmegen",       region:"Gelderland",          country:"Netherlands",cc:"NL",lat:51.8426,lng:5.8528},
  {city:"Antwerp",        region:"Antwerp",             country:"Belgium",    cc:"BE",lat:51.2194,lng:4.4025},
  {city:"Boston",         region:"Massachusetts",       country:"USA",        cc:"US",lat:42.3601,lng:-71.0589},
  {city:"Stamford",       region:"Connecticut",         country:"USA",        cc:"US",lat:41.0534,lng:-73.5387},
  {city:"Clemson",        region:"South Carolina",      country:"USA",        cc:"US",lat:34.6834,lng:-82.8374},
  {city:"Barcelona",      region:"Catalonia",           country:"Spain",      cc:"ES",lat:41.3851,lng:2.1734},
  {city:"Madrid",         region:"Madrid",              country:"Spain",      cc:"ES",lat:40.4168,lng:-3.7038},
  {city:"Lagos",          region:"Algarve",             country:"Portugal",   cc:"PT",lat:37.1028,lng:-8.6736},
  {city:"Sciara",         region:"Sicily",              country:"Italy",      cc:"IT",lat:37.9156,lng:13.9344},
  {city:"East Rutherford",region:"New Jersey",          country:"USA",        cc:"US",lat:40.8127,lng:-74.0846},
  {city:"San Juan",       region:"San Juan",            country:"Puerto Rico",cc:"PR",lat:18.4655,lng:-66.1057},
  {city:"Washington",     region:"District of Columbia",country:"USA",        cc:"US",lat:38.9072,lng:-77.0369},
  {city:"Boynton Beach",  region:"Florida",             country:"USA",        cc:"US",lat:26.5253,lng:-80.0664},
  {city:"Miami",          region:"Florida",             country:"USA",        cc:"US",lat:25.7617,lng:-80.1918},
  {city:"Ischia",         region:"Campania",            country:"Italy",      cc:"IT",lat:40.7333,lng:13.9500},
  {city:"Capri",          region:"Campania",            country:"Italy",      cc:"IT",lat:40.5532,lng:14.2222},
];

// ── BREWERIES — where each beer is actually made
let breweries=[
  {name:"Weihenstephaner",                   location:"Freising, Bavaria",                       country:"Germany",           cc:"DE",    lang:"de",beers:"Weihenstephaner Hefeweissbier",                                                            lat:48.3953,lng:11.7291,  ratings:[4.50]},
  {name:"Hofbräu München",                   location:"Munich, Bavaria",                         country:"Germany",           cc:"DE",    lang:"de",beers:"Hofbräu Münchner Weiße · Hofbräu Dunkel",                                                  lat:48.1351,lng:11.5820,  ratings:[4.75,2.75]},
  {name:"Guinness (St. James's Gate)",       location:"Dublin, Leinster",                        country:"Ireland",           cc:"IE",    lang:"en",beers:"Guinness Draught",                                                                         lat:53.3418,lng:-6.2868,  ratings:[4.00]},
  {name:"Harp / Diageo",                     location:"Dundalk, County Louth",                   country:"Ireland",           cc:"IE",    lang:"en",beers:"Harp Lager",                                                                               lat:54.0039,lng:-6.3703,  ratings:[4.25]},
  {name:"Duvel Moortgat",                    location:"Puurs-Sint-Amands, Antwerp",              country:"Belgium",           cc:"BE",    lang:"nl",beers:"Duvel",                                                                                    lat:51.0727,lng:4.2897,   ratings:[4.25]},
  {name:"AB InBev (Stella)",                 location:"Leuven, Flemish Brabant",                 country:"Belgium",           cc:"BE",    lang:"nl",beers:"Stella Artois",                                                                            lat:50.8798,lng:4.7005,   ratings:[2.75]},
  {name:"Heineken",                          location:"Amsterdam, Noord-Holland",                country:"Netherlands",       cc:"NL",    lang:"nl",beers:"Heineken · Heineken Silver",                                                               lat:52.3578,lng:4.8918,   ratings:[3.25,3.00]},
  {name:"Grolsch",                           location:"Enschede, Overijssel",                    country:"Netherlands",       cc:"NL",    lang:"nl",beers:"Grolsch · Grolsch Puur Weizen · Frisse Lentebok",                                          lat:52.2215,lng:6.8937,   ratings:[3.50,5.00,3.25]},
  {name:"Bavaria NV (Hertog Jan)",           location:"Arcen, Limburg",                          country:"Netherlands",       cc:"NL",    lang:"nl",beers:"Hertog Jan",                                                                               lat:51.4862,lng:6.1741,   ratings:[2.00]},
  {name:"Anheuser-Busch",                    location:"St. Louis, Missouri",                     country:"USA",               cc:"US",    lang:"en",beers:"Michelob Ultra · Bud Light · Budweiser",                                                   lat:38.6072,lng:-90.2124, ratings:[2.50,3.00,3.00]},
  {name:"Molson Coors",                      location:"Golden, Colorado",                        country:"USA",               cc:"US",    lang:"en",beers:"Coors Light",                                                                              lat:39.7555,lng:-105.2211,ratings:[3.00]},
  {name:"Grupo Modelo",                      location:"Mexico City, CDMX",                       country:"Mexico",            cc:"MX",    lang:"es",beers:"Modelo Especial · Negra Modelo · Corona Extra · Modelo Oro",                               lat:19.4274,lng:-99.1677, ratings:[3.25,3.00,3.75,3.00]},
  {name:"Cervecería Estrella Jalisco",       location:"Guadalajara, Jalisco",                    country:"Mexico",            cc:"MX",    lang:"es",beers:"Estrella Jalisco",                                                                         lat:20.6597,lng:-103.3496,ratings:[3.75]},
  {name:"Carlsberg",                         location:"Copenhagen, Capital Region",              country:"Denmark",           cc:"DK",    lang:"da",beers:"Carlsberg · Carlsberg Elephant",                                                           lat:55.6614,lng:12.5361,  ratings:[3.00,3.50]},
  {name:"Unibroue",                          location:"Chambly, Quebec",                         country:"Canada",            cc:"CA",    lang:"fr",beers:"La Fin Du Monde",                                                                          lat:45.4412,lng:-73.2615, ratings:[3.75]},
  {name:"Kronenbourg",                       location:"Obernai, Alsace",                         country:"France",            cc:"FR",    lang:"fr",beers:"Kronenbourg 1664",                                                                         lat:48.4637,lng:7.4845,   ratings:[3.00]},
  {name:"Sapporo Brewery",                   location:"Sapporo, Hokkaido",                       country:"Japan",             cc:"JP",    lang:"ja",beers:"Sapporo Premium",                                           nativeName:"サッポロビール",          lat:43.0685,lng:141.3544, ratings:[3.50]},
  {name:"Kirin Brewery",                     location:"Yokohama, Kanagawa",                      country:"Japan",             cc:"JP",    lang:"ja",beers:"Kirin Ichiban",                                             nativeName:"キリン一番搾り",          lat:35.4634,lng:139.6220, ratings:[3.00]},
  {name:"Asahi Breweries",                   location:"Suita, Osaka",                            country:"Japan",             cc:"JP",    lang:"ja",beers:"Asahi Super Dry",                                           nativeName:"アサヒスーパードライ",       lat:34.7615,lng:135.5158, ratings:[3.50]},
  {name:"Red Stripe (D&G)",                  location:"Kingston, Surrey",                        country:"Jamaica",           cc:"JM",    lang:"en",beers:"Red Stripe",                                                                               lat:17.9972,lng:-76.7939, ratings:[3.75]},
  {name:"Estrella Galicia",                  location:"A Coruña, Galicia",                       country:"Spain",             cc:"ES",    lang:"es",beers:"Estrella Galicia",                                                                         lat:43.3623,lng:-8.4115,  ratings:[4.25]},
  {name:"Pilsner Urquell",                   location:"Pilsen, Bohemia",                         country:"Czech Republic",    cc:"CZ",    lang:"cs",beers:"Pilsner Urquell",                                           nativeName:"Plzeňský Prazdroj",lat:49.7479,lng:13.3756,  ratings:[3.25]},
  {name:"Birra Moretti (Heineken Italia)",   location:"Udine, Friuli-Venezia Giulia",            country:"Italy",             cc:"IT",    lang:"it",beers:"Birra Moretti",                                                                            lat:46.0640,lng:13.2350,  ratings:[3.75]},
  {name:"Erdinger Weissbräu",                location:"Erding, Bavaria",                         country:"Germany",           cc:"DE",    lang:"de",beers:"Erdinger Weißbier",                                                                        lat:48.3063,lng:11.9071,  ratings:[3.25]},
  {name:"Industrial Arts Brewing",           location:"Garnerville, New York",                   country:"USA",               cc:"US",    lang:"en",beers:"Wrench",                                                                                   lat:41.2065,lng:-74.0085, ratings:[4.00]},
  {name:"Żywiec Brewery (Grupa Żywiec)",     location:"Żywiec, Silesia",                         country:"Poland",            cc:"PL",    lang:"pl",beers:"Żywiec",                                                                                   lat:49.6853,lng:19.1925,  ratings:[2.75]},
  {name:"Birra Peroni",                      location:"Rome, Lazio",                             country:"Italy",             cc:"IT",    lang:"it",beers:"Peroni Nastro Azzurro · Chill Lemon · Peroni Original",                                    lat:41.8902,lng:12.4922,  ratings:[3.00,4.00,3.25]},
  {name:"S.A. Damm",                         location:"Barcelona, Catalonia",                    country:"Spain",             cc:"ES",    lang:"es",beers:"Estrella Damm · Daura",                                                                    lat:41.3897,lng:2.1540,   ratings:[3.50,3.00]},
  {name:"Abbaye de Leffe (AB InBev)",        location:"Dinant, Namur",                           country:"Belgium",           cc:"BE",    lang:"fr",beers:"Leffe Blonde",                                                                             lat:50.2611,lng:4.9122,   ratings:[4.75]},
  {name:"Texelse Bierbrouwerij",             location:"Oudeschild, North Holland",               country:"Netherlands",       cc:"NL",    lang:"nl",beers:"Texels Skuumkoppe",                                                                        lat:53.0385,lng:4.8510,   ratings:[3.00]},
  {name:"Affligem Brewery (Heineken)",       location:"Opwijk, Flemish Brabant",                 country:"Belgium",           cc:"BE",    lang:"nl",beers:"Affligem Tripel",                                                                          lat:50.9786,lng:4.1868,   ratings:[3.75]},
  {name:"De Koninck Brewery",                location:"Antwerp, Antwerp",                        country:"Belgium",           cc:"BE",    lang:"nl",beers:"De Koninck",                                                                               lat:51.2157,lng:4.4156,   ratings:[2.75]},
  {name:"Brouwerij 't IJ",                   location:"Amsterdam, Noord-Holland",                country:"Netherlands",       cc:"NL",    lang:"nl",beers:"IJwit",                                                                                    lat:52.3657,lng:4.9196,   ratings:[3.75]},
  {name:"Brasserie d'Achouffe",              location:"Achouffe, Luxembourg Province (Wallonia)",country:"Belgium",           cc:"BE",    lang:"fr",beers:"La Chouffe Blonde",                                                                        lat:50.1417,lng:5.8125,   ratings:[4.25]},
  {name:"Stieglbrauerei zu Salzburg",        location:"Salzburg, Land Salzburg",                 country:"Austria",           cc:"AT",    lang:"de",beers:"Stiegl Goldbräu",                                                                          lat:47.8095,lng:13.0550,  ratings:[2.75]},
  {name:"Super Bock Group",                  location:"Leça do Balio, Porto",                    country:"Portugal",          cc:"PT",    lang:"pt",beers:"Super Bock",                                                                               lat:41.2142,lng:-8.6254,  ratings:[3.00]},
  {name:"Latrobe Brewing Company",           location:"Latrobe, Pennsylvania",                   country:"USA",               cc:"US",    lang:"en",beers:"Rolling Rock Extra Pale",                                                                  lat:40.3215,lng:-79.3795, ratings:[3.25]},
  {name:"Cervecería Cuauhtémoc Moctezuma",   location:"Monterrey, Nuevo León",                   country:"Mexico",            cc:"MX",    lang:"es",beers:"Dos Equis Lager Especial",                                                                 lat:25.6866,lng:-100.3161,ratings:[1.75]},
  {name:"Miller Brewing Company",            location:"Milwaukee, Wisconsin",                    country:"USA",               cc:"US",    lang:"en",beers:"Miller Lite",                                                                              lat:43.0389,lng:-87.9065, ratings:[2.25]},
  {name:"Belhaven Brewery",                  location:"Dunbar, East Lothian",                    country:"Scotland",          cc:"GB-SCT",lang:"en",beers:"Belhaven Scottish Stout",                                                                  lat:56.0006,lng:-2.5176,  ratings:[3.00]},
  {name:"Boston Beer Company (Samuel Adams)",location:"Boston, Massachusetts",                   country:"USA",               cc:"US",    lang:"en",beers:"Samuel Adams Summer Ale",                                                                  lat:42.3601,lng:-71.0589, ratings:[3.00]},
  {name:"Cervecería del Pacífico",           location:"Mazatlán, Sinaloa",                       country:"Mexico",            cc:"MX",    lang:"es",beers:"Pacífico Clara",                                                                           lat:23.2494,lng:-106.4111,ratings:[3.75]},
  {name:"Narragansett Brewing Company",      location:"Cranston, Rhode Island",                  country:"USA",               cc:"US",    lang:"en",beers:"Narragansett Lager",                                                                       lat:41.7798,lng:-71.4373, ratings:[3.25]},
  {name:"Kona Brewing Company",              location:"Kailua-Kona, Hawaii",                     country:"USA",               cc:"US",    lang:"en",beers:"Big Wave Golden Ale",                                                                      lat:19.6406,lng:-155.9969,ratings:[3.75]},
  {name:"Blue Moon Brewing Company",         location:"Denver, Colorado",                        country:"USA",               cc:"US",    lang:"en",beers:"Blue Moon",                                                                                lat:39.7392,lng:-104.9903,ratings:[3.50]},
  {name:"Smithwick's (St. Francis Abbey)",   location:"Kilkenny, Leinster",                      country:"Ireland",           cc:"IE",    lang:"en",beers:"Smithwick's",                                                                              lat:52.6541,lng:-7.2448,  ratings:[2.75]},
  {name:"Captain Lawrence Brewing Company",  location:"Elmsford, New York",                      country:"USA",               cc:"US",    lang:"en",beers:"Hop Commander",                                                                            lat:41.0540,lng:-73.8201, ratings:[3.00]},
  {name:"Paulaner Brauerei",                 location:"Munich, Bavaria",                         country:"Germany",           cc:"DE",    lang:"de",beers:"Paulaner Hefe-Weißbier",                                                                   lat:48.1234,lng:11.5808,  ratings:[4.00]},
  {name:"Compañía Cervecera de Puerto Rico", location:"Mayagüez, Puerto Rico",                   country:"Puerto Rico",       cc:"PR",    lang:"es",beers:"Medalla Light · Magna",                                                                    lat:18.2011,lng:-67.1397, ratings:[4.00,4.00]},
  {name:"Ocean Lab Brewing Co.",             location:"Carolina (Isla Verde), Puerto Rico",      country:"Puerto Rico",       cc:"PR",    lang:"es",beers:"Ocean SJU",                                                                                lat:18.4486,lng:-66.0203, ratings:[2.50]},
  {name:"Flying Dog Brewery",                location:"Frederick, Maryland",                     country:"USA",               cc:"US",    lang:"en",beers:"Bloodline Blood Orange IPA",                                                               lat:39.4143,lng:-77.4105, ratings:[3.50]},
  {name:"Goose Island Beer Co.",             location:"Chicago, Illinois",                       country:"USA",               cc:"US",    lang:"en",beers:"Goose IPA",                                                                                lat:41.9166,lng:-87.6530, ratings:[3.50]},
  {name:"Brasserie Almaza",                  location:"Beirut, Beirut Governorate",              country:"Lebanon",           cc:"LB",    lang:"ar",beers:"Almaza Pilsener",                                           nativeName:"ألمازة",           lat:33.8938,lng:35.5018,  ratings:[2.75]},
  {name:"Olympic Brewery",                   location:"Sindos, Central Macedonia",               country:"Greece",            cc:"GR",    lang:"el",beers:"Mythos",                                                                                   lat:40.6736,lng:22.8064,  ratings:[3.25]},
  {name:"Stone Brewing",                     location:"Escondido, California",                   country:"USA",               cc:"US",    lang:"en",beers:"Stone IPA",                                                                                lat:33.1192,lng:-117.0864,ratings:[2.50]},
  {name:"Mahou (Grupo Mahou-San Miguel)",    location:"Madrid, Madrid",                          country:"Spain",             cc:"ES",    lang:"es",beers:"Mahou Cinco Estrellas",                                                                    lat:40.4168,lng:-3.7038,  ratings:[3.50]},
  {name:"Cervecería Hatuey (Bacardí)",       location:"Santiago de Cuba, Santiago de Cuba",      country:"Cuba",              cc:"CU",    lang:"es",beers:"Hatuey Lager",                                              nativeName:"Cerveza Hatuey",   lat:20.0247,lng:-75.8219, ratings:[4.00]},
  {name:"Boddington's Brewery",              location:"Manchester, Greater Manchester",          country:"England",           cc:"GB-ENG",lang:"en",beers:"Pub Ale",                                                                                  lat:53.4808,lng:-2.2426,  ratings:[4.25]},
  {name:"Spaten-Franziskaner-Bräu",          location:"Munich, Bavaria",                         country:"Germany",           cc:"DE",    lang:"de",beers:"Spaten Oktoberfest Ur-Märzen / Winter",                                                    lat:48.1494,lng:11.5567,  ratings:[2.75]},
  {name:"Dortmunder Actien-Brauerei (DAB)",  location:"Dortmund, North Rhine-Westphalia",        country:"Germany",           cc:"DE",    lang:"de",beers:"DAB Dortmunder Export",                                                                    lat:51.5136,lng:7.4653,   ratings:[4.50]},
  {name:"Brauerei Beck & Co.",               location:"Bremen, Bremen",                          country:"Germany",           cc:"DE",    lang:"de",beers:"Beck's",                                                                                   lat:53.0793,lng:8.8017,   ratings:[3.00]},
  {name:"Birra Ichnusa (Heineken Italia)",   location:"Assemini, Sardinia",                      country:"Italy",             cc:"IT",    lang:"it",beers:"Ichnusa Anima Sarda",                                                                      lat:39.2803,lng:9.0057,   ratings:[3.75]},
  {name:"Bitburger Braugruppe",              location:"Bitburg, Rhineland-Palatinate",           country:"Germany",           cc:"DE",    lang:"de",beers:"Bitburger Radler",                                                                         lat:49.9739,lng:6.5334,   ratings:[4.00]},
  {name:"Radeberger Exportbierbrauerei",     location:"Radeberg, Saxony",                        country:"Germany",           cc:"DE",    lang:"de",beers:"Radeberger Pilsner",                                                                       lat:51.1136,lng:13.9169,  ratings:[3.00]},
  {name:"Cervecería Nacional Dominicana",    location:"Santo Domingo, Distrito Nacional",        country:"Dominican Republic",cc:"DO",    lang:"es",beers:"Presidente",                                                                               lat:18.4861,lng:-69.9312, ratings:[3.00]},
];

// ══════════════════════════════════════════════════════════════
// BRAND DOMAINS — where each beer's logo is looked up
// ══════════════════════════════════════════════════════════════
// A beer with no entry here renders the 🍺 placeholder forever; there is no
// name-based guess behind it. A value is one domain, or several tried in
// order for a brand that lives at more than one address.
//
// A domain being present proves nothing about what sits behind it — run
// `npm run logos` (or auditLogos() in the console) to see what each beer
// actually resolves to.
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
"Castle Lager":["castlelager.co.za","castlelager.com"],
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
"Harp Lager":["harplager.com","harp.ie"],
"Hatuey Lager":["hatuey.com","hatueybeer.com"],
"Heineken":"heineken.com",
"Heineken Silver":["heinekensilver.com","heineken.com"],
"Hertog Jan":"hertogjan.nl",
"Hoegaarden":"hoegaarden.com",
"IJwit":"brouwerijhetij.nl",
"Kirin Ichiban":"kirin.co.jp",
"Kronenbourg 1664":["1664.com","kronenbourg1664.com"],
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
"Newcastle Brown Ale":["newcastlebrown.com","newcastlebrownale.com"],
"Norrlands Guld":"norrlandsguld.se",
"Ocean SJU":"oceanlabbrewing.com",
"Orion":"orionbeer.co.jp",
"Pacífico Clara":"drinkpacifico.com",
"Paulaner Hefe":"paulaner.com",
"Paulaner Hefe-Weißbier":"paulaner.com",
"Pilsner Urquell":["pilsnerurquell.com","prazdroj.cz"],
"Pub Ale":["boddingtons.co.uk","boddingtons.com"],
"Presidente":["presidente.com.do","cnd.com.do"],
"Quilmes":"quilmes.com.ar",
"Radeberger Pilsner":"radeberger.de",
"Red Stripe":"redstripebeer.com",
"Ringnes":"ringnes.no",
"Rolling Rock Extra Pale":"rollingrock.com",
"Sam Adams Boston Lager":"samueladams.com",
"Sapporo Premium":"sapporobeer.com",
"Belhaven Scottish Stout":"belhaven.co.uk",
"Singha":"singhabeer.com",
"Smithwick's":["smithwicks.com","smithwicks.ie"],
"Sol":["solbeer.com","cervezasol.com"],
"Spaten Oktoberfest Ur-Märzen / Winter":["spatenbraeu.de","spaten.de"],
"Stella Artois":"stellaartois.com",
"Stiegl Goldbräu":"stiegl.at",
"Stone IPA":"stonebrewing.com",
"Samuel Adams Summer Ale":"samueladams.com",
"Super Bock":"superbock.pt",
"Tennent's":["tennents.com","tennents.co.uk"],
"Texels Skuumkoppe":"texels.nl",
"Tiger Beer":"tigerbeer.com",
"Tsingtao":"tsingtaobeer.com",
"Tuborg":"tuborg.com",
"Tyskie":"tyskie.pl",
"Victoria Bitter":["vb.com.au","victoriabitter.com.au"],
"Weihenstephaner Hefeweissbier":"weihenstephaner.de",
"Wrench":"industrialartsbrewing.com",
"Żywiec":"zywiec.com.pl",
};

// ══════════════════════════════════════════════════════════════
// UNTAPPD CONSENSUS — the world's average, for the contrarian index
// ══════════════════════════════════════════════════════════════
// The refresh-untappd-reminder GitHub Action opens an issue every 2 weeks
// when this stamp gets stale. Re-verify the ratings in the app, not here.
const UNTAPPD_LAST_REFRESHED="2026-05-05";
const UNTAPPD_REFRESH_INTERVAL_DAYS=14;

// Keys MUST match the exact beer names in beers[] (case + diacritics);
// `npm run check` fails on a key that matches no beer.
const UNTAPPD_GLOBAL_AVGS={
  "Grolsch":3.52,"Hertog Jan":3.58,"Coors Light":2.84,
  "Sapporo Premium":3.51,"Kirin Ichiban":3.43,"Modelo Especial":3.55,
  "Stella Artois":3.30,"Duvel":3.70,"Carlsberg":3.09,
  "Carlsberg Elephant":3.42,"Harp Lager":3.42,"La Fin Du Monde":4.07,
  "Kronenbourg 1664":3.30,"Michelob Ultra":2.84,"Guinness Draught":3.80,
  "Red Stripe":3.31,"Heineken":3.00,"Weihenstephaner Hefeweissbier":3.80,
  "Negra Modelo":3.60,"Hofbräu Münchner Weiße":3.80,"Hofbräu Dunkel":3.55,
  "Bud Light":2.30,"Budweiser":2.60,"Corona Extra":3.47,
  "Dos Equis Lager Especial":3.25,"Frisse Lentebok":3.25,"Estrella Galicia":3.65,
  "Pilsner Urquell":3.80,"Wrench":3.95,"Żywiec":3.35,
  "Peroni Nastro Azzurro":3.56,"Estrella Damm":3.61,"Grolsch Puur Weizen":3.50,
  "Leffe Blonde":3.75,"Texels Skuumkoppe":3.65,"Affligem Tripel":3.80,
  "De Koninck":3.55,"IJwit":3.50,"La Chouffe Blonde":3.85,
  "Stiegl Goldbräu":3.35,"Modelo Oro":3.45,"Super Bock":3.41,
  "Estrella Jalisco":3.20,"Rolling Rock Extra Pale":3.05,"Birra Moretti":3.58,
  "Erdinger Weißbier":3.78,"Miller Lite":2.51,"Pacífico Clara":3.65,
  "Narragansett Lager":3.23,"Big Wave Golden Ale":3.52,"Belhaven Scottish Stout":3.45,
  "Samuel Adams Summer Ale":3.50,
};

// ══════════════════════════════════════════════════════════════
// WANT TO TRY — the standing shortlist of beers not yet drunk
// ══════════════════════════════════════════════════════════════
// Nothing is ever removed. An entry with a review in beers[] crosses itself
// off and moves to "Crossed off", where the prediction made beforehand is
// scored against the rating given after — so deleting it would throw away
// the only thing that makes the scorecard worth having.
//
// `as` lists the other names a beer is logged under in beers[], for when
// the shelf name differs from the name here.
// ══════════════════════════════════════════════════════════════
const WANT_TO_TRY=[
  {beer:"Paulaner Hefe",         style:"Wheat Beer", origin:"DE",    abv:5.5,region:"Munich, Bavaria",             untappd:3.87,method:"Bottle",as:["Paulaner Hefe-Weißbier"]},
  {beer:"Augustiner Helles",     style:"Lager",      origin:"DE",    abv:5.2,region:"Munich, Bavaria",             untappd:4.10,method:"Draft" },
  {beer:"Birra Moretti",         style:"Lager",      origin:"IT",    abv:4.6,region:"Udine, Friuli-Venezia Giulia",untappd:3.58,method:"Bottle"},
  {beer:"Peroni Nastro Azzurro", style:"Lager",      origin:"IT",    abv:5.1,region:"Rome, Lazio",                 untappd:3.56,method:"Bottle"},
  {beer:"Menabrea",              style:"Lager",      origin:"IT",    abv:4.8,region:"Biella, Piedmont",            untappd:3.55,method:"Bottle"},
  {beer:"Estrella Galicia",      style:"Lager",      origin:"ES",    abv:5.5,region:"A Coruña, Galicia",           untappd:3.65,method:"Bottle"},
  {beer:"Estrella Damm",         style:"Lager",      origin:"ES",    abv:5.4,region:"Barcelona, Catalonia",        untappd:3.61,method:"Bottle"},
  {beer:"Pilsner Urquell",       style:"Pilsner",    origin:"CZ",    abv:4.4,region:"Pilsen, Bohemia",             untappd:3.80,method:"Bottle"},
  {beer:"Żywiec",                style:"Lager",      origin:"PL",    abv:5.5,region:"Żywiec, Silesia",             untappd:3.35,method:"Bottle"},
  {beer:"Tyskie",                style:"Pilsner",    origin:"PL",    abv:5.6,region:"Tychy, Silesia",              untappd:3.28,method:"Can"   },
  {beer:"Chimay Blue",           style:"Belgian Ale",origin:"BE",    abv:9.0,region:"Chimay, Hainaut",             untappd:4.05,method:"Bottle"},
  {beer:"Leffe Blonde",          style:"Belgian Ale",origin:"BE",    abv:6.6,region:"Dinant, Namur",               untappd:3.75,method:"Bottle"},
  {beer:"Hoegaarden",            style:"Wheat Beer", origin:"BE",    abv:4.9,region:"Hoegaarden, Flemish Brabant", untappd:3.72,method:"Bottle"},
  {beer:"Kronenbourg 1664",      style:"Lager",      origin:"FR",    abv:5.5,region:"Obernai, Alsace",             untappd:3.30,method:"Can"   },
  {beer:"Super Bock",            style:"Lager",      origin:"PT",    abv:5.2,region:"Leça do Balio, Porto",        untappd:3.41,method:"Bottle"},
  {beer:"Mythos",                style:"Lager",      origin:"GR",    abv:4.7,region:"Athens, Attica",              untappd:3.31,method:"Bottle"},
  {beer:"Tuborg",                style:"Pilsner",    origin:"DK",    abv:4.6,region:"Copenhagen",                  untappd:3.10,method:"Can"   },
  {beer:"Norrlands Guld",        style:"Lager",      origin:"SE",    abv:5.3,region:"Stockholm",                   untappd:3.28,method:"Can"   },
  {beer:"Ringnes",               style:"Lager",      origin:"NO",    abv:4.7,region:"Oslo",                        untappd:3.10,method:"Can"   },
  {beer:"Newcastle Brown Ale",   style:"Brown Ale",  origin:"GB-ENG",abv:4.7,region:"Tadcaster, Yorkshire",        untappd:3.28,method:"Bottle"},
  {beer:"Tennent's",             style:"Lager",      origin:"GB-SCT",abv:4.0,region:"Glasgow, Scotland",           untappd:2.95,method:"Can"   },
  {beer:"Smithwick's",           style:"Red Ale",    origin:"IE",    abv:4.5,region:"Kilkenny, Leinster",          untappd:3.45,method:"Draft" },
  {beer:"Blue Moon",             style:"Wheat Beer", origin:"US",    abv:5.4,region:"Denver, Colorado",            untappd:3.56,method:"Draft" },
  {beer:"Sam Adams Boston Lager",style:"Lager",      origin:"US",    abv:5.0,region:"Boston, Massachusetts",       untappd:3.48,method:"Bottle"},
  {beer:"Miller Lite",           style:"Lager",      origin:"US",    abv:4.2,region:"Milwaukee, Wisconsin",        untappd:2.51,method:"Can"   },
  {beer:"Sol",                   style:"Lager",      origin:"MX",    abv:4.5,region:"Mexico City",                 untappd:3.15,method:"Bottle"},
  {beer:"Brahma",                style:"Lager",      origin:"BR",    abv:4.8,region:"São Paulo, SP",               untappd:3.18,method:"Can"   },
  {beer:"Quilmes",               style:"Lager",      origin:"AR",    abv:4.9,region:"Buenos Aires, BA",            untappd:3.22,method:"Bottle"},
  {beer:"Asahi Super Dry",       style:"Lager",      origin:"JP",    abv:5.0,region:"Tokyo",                       untappd:3.60,method:"Bottle"},
  {beer:"Orion",                 style:"Lager",      origin:"JP",    abv:5.0,region:"Naha, Okinawa",               untappd:3.42,method:"Can"   },
  {beer:"Tsingtao",              style:"Lager",      origin:"CN",    abv:4.7,region:"Qingdao, Shandong",           untappd:3.29,method:"Bottle"},
  {beer:"Singha",                style:"Lager",      origin:"TH",    abv:5.0,region:"Bangkok",                     untappd:3.25,method:"Bottle"},
  {beer:"Tiger Beer",            style:"Lager",      origin:"SG",    abv:5.0,region:"Singapore",                   untappd:3.18,method:"Can"   },
  {beer:"Coopers Pale Ale",      style:"Pale Ale",   origin:"AU",    abv:4.5,region:"Adelaide, South Australia",   untappd:3.72,method:"Bottle"},
  {beer:"Victoria Bitter",       style:"Lager",      origin:"AU",    abv:4.9,region:"Melbourne, Victoria",         untappd:3.12,method:"Can"   },
  {beer:"Castle Lager",          style:"Lager",      origin:"ZA",    abv:5.0,region:"Johannesburg, Gauteng",       untappd:3.18,method:"Can"   },
];
