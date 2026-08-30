// ══════════════════════════════════════════════════════════════
// APP — everything the data does
// ══════════════════════════════════════════════════════════════
// Reads the arrays declared in data.js, which the page loads first. This file
// holds no beer data: a review added here would be invisible to `npm run
// check` and to the JSON in data/.
// ══════════════════════════════════════════════════════════════

// Beers added from the browser (localStorage) ride alongside the committed
// ones for that visitor only.
(function(){
  try {
    const saved=JSON.parse(localStorage.getItem('brewUserBeers')||'[]');
    saved.forEach(b=>beers.push(b));
  } catch(e){ console.error('Failed to load user beers:',e); }
})();

// ══════════════════════════════════════════════════════════════
// TEXT
// ══════════════════════════════════════════════════════════════
// Every value that reaches the page through innerHTML goes through esc()
// first. A brewery called Brasserie D'Achouffe or a beer with a "<" in its
// name would otherwise close an attribute early and take the rest of the row
// with it. Numbers pass through unchanged, so wrapping one is never wrong.
const esc = v => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ══════════════════════════════════════════════════════════════
// BEER-NAME NORMALISER
// ══════════════════════════════════════════════════════════════
// Decides when two spellings are the same beer, which is what lets the
// want-to-try shortlist cross itself off the moment a review lands. Case,
// accents and anything that isn't a letter or a digit are flattened away, so
// "Smithwick's" and "Smithwicks" agree and so do "Żywiec" and "Zywiec".
//
// Deliberately no looser than that: what's left has to match word for word, or
// Peroni Original would answer for Peroni Nastro Azzurro and a beer would be
// crossed off on the strength of a different one. A beer genuinely shelved
// under two names says so with `as` on its WANT_TO_TRY entry instead.
//
// `npm run check` loads this very declaration out of app.js, so the checks and
// the page can never disagree about what counts as the same beer. Keep it on
// one line.
const wtNorm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\u00df/g,'ss').replace(/['\u2019]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

// ══════════════════════════════════════════════════════════════
// LOGOS
// ══════════════════════════════════════════════════════════════
// Brandfetch's public dev client ID — embedded so users never need an account.
const BRANDFETCH_CLIENT_ID = "1idIddY24o2pZE9n2hu";
// Tiered logo sources: primary (Brandfetch HD logo) → fallback 1 (Google HD
// favicons) → fallback 2 (Icon Horse, 256px PNG). Emoji renders inline if every
// remote source fails. All endpoints requested at 2–4× the display size so
// logos stay crisp on high-DPR screens.
// A beer's domains, always as a list.
function brandDomains(name){
  const d=BRAND_DOMAINS[name];
  return d?(Array.isArray(d)?d:[d]):[];
}
const logoURL         = d=>`https://cdn.brandfetch.io/${d}/w/1024/h/1024?c=${BRANDFETCH_CLIENT_ID}`;
const logoFallbackURL = d=>`https://www.google.com/s2/favicons?domain=${d}&sz=512`;
const logoFallback2URL= d=>`https://icon.horse/icon/${d}`;

// Coverage warning. It has to see the want-to-try shortlist as well as
// beers[] — those render logos too, and a gap there is just as visible. Both
// come from data.js, which the page loads first, so the check can run inline.
// `npm run check` enforces the same rule in CI.
function validateBeerDomains(){
  const names=new Set(beers.map(b=>b.beer));
  for(const e of WANT_TO_TRY) names.add(e.beer);
  const missing=[...names].filter(n=>!BRAND_DOMAINS[n]);
  if(missing.length){
    console.warn(`[DOMAIN CHECK] ${missing.length} beer(s) missing a brand domain — these render the 🍺 placeholder:\n  - ${missing.join('\n  - ')}`);
  }
  return missing;
}
try{ validateBeerDomains(); }catch(e){ console.error('Domain check error:',e); }

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
// inline style. Canvas and Leaflet can't read CSS variables, so the values are
// pulled off :root once at boot and frozen into literals — style.css stays the
// one place a color is written, and the two files can't drift apart. The
// fallbacks are the Nordic light palette, used if the stylesheet hasn't landed.
const cssVar=(function(){
  let root=null;
  try{ root=getComputedStyle(document.documentElement); }catch(e){}
  return function(name,fallback){
    if(!root) return fallback;
    const v=root.getPropertyValue(name);
    return v&&v.trim()?v.trim():fallback;
  };
})();
const THEME={
  bg:          cssVar('--bg','#0f0f11'),
  surface:     cssVar('--surface','#17171a'),
  surface2:    cssVar('--surface-2','#1c1c20'),
  surface3:    cssVar('--surface-3','#26262b'),
  border:      cssVar('--border','#26262b'),
  borderStrong:cssVar('--border-strong','#3a3a42'),
  text:        cssVar('--text','#ededef'),
  text2:       cssVar('--text-2','#a1a1aa'),
  text3:       cssVar('--text-3','#71717a'),
  accent:      cssVar('--accent','#e9a23b'),
  accentHi:    cssVar('--accent-hi','#f5c274'),
  pos:         cssVar('--pos','#46c68a'),
  neg:         cssVar('--neg','#e5646f'),
  warn:        cssVar('--warn','#dfa64b'),
  info:        cssVar('--info','#5b9fe3'),
  purple:      cssVar('--purple','#9b87e8')
};
// Chart-specific roles. The grid sits at the panel hairline — present enough
// to measure against, quiet enough that the bars stay the subject.
THEME.grid      = THEME.border;
THEME.tick      = THEME.text3;
THEME.label     = THEME.text2;
THEME.axisTitle = THEME.text3;

// Style palette — rich, evenly spaced hues, deliberately short of neon: full
// saturation on a dark ground is what tips a chart into looking like a trading
// screen. A new entry should sit at this same middle brightness.
const sC={"Lager":"#e9a23b","Pilsner":"#d4bd52","Wheat Beer":"#e8c98e","Belgian Ale":"#9b87e8","IPA":"#e07a4c","Pale Ale":"#8ab861","Stout":"#9c7a5f","Brown Ale":"#c19472","Red Ale":"#d96a6a","Shandy / Radler":"#dcd363"};
function rbC(r){return r>=4.5?"r5":r>=4?"r4":r>=3.5?"r35":r>=3?"r3":r>=2.5?"r25":"r2";}
// Rating ramp: rose → honey → green. Matches the .r5….r2 badge colors in
// style.css, and every step stays legible on charcoal.
function rC(r){return r>=4.5?"#46c68a":r>=4?"#8cc46a":r>=3.5?"#ccb44f":r>=3?"#e9a23b":r>=2.5?"#dd8555":"#e5646f";}
function strs(r){const f=Math.floor(r),h=(r%1)>=.5;return"★".repeat(f)+(h?"½":"")+"☆".repeat(5-f-(h?1:0));}
const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const std=a=>{if(!a.length)return 0;const m=avg(a);return Math.sqrt(avg(a.map(v=>(v-m)**2)));};

// Source chain priority: local override → Brandfetch → Google favicons → Icon
// Horse → 🍺 emoji span. Walk via dataset.f counter; each failure advances to
// the next available source.
//
// Tiered by SOURCE, not by domain: a real Brandfetch logo for a beer's second
// domain is a better answer than a 16px favicon for its first, so every domain
// is tried at each tier before dropping to the next one.
function logoSources(name){
  const sources=[];
  const local=LOCAL_LOGOS[name];
  if(local)sources.push(local);
  const doms=brandDomains(name);
  for(const d of doms) sources.push(logoURL(d));
  for(const d of doms) sources.push(logoFallbackURL(d));
  for(const d of doms) sources.push(logoFallback2URL(d));
  return sources;
}
// ── LOGO AUDIT ──
// Nothing in this file can tell whether a domain actually has a logo behind it
// — only a browser that can reach the CDNs can. Run auditLogos() in the console
// to find out: it walks every beer that renders a logo anywhere in the app,
// tries its sources in the same order the <img> chain does, and reports which
// tier answered.
//
// Read the result for two things: rows marked PLACEHOLDER (no source answered —
// the beer shows 🍺) and rows flagged `suspect` (something answered, but at
// favicon size, which is usually a generic globe standing in for a domain the
// service doesn't know). Both mean the brand domain needs correcting in
// BRAND_DOMAINS above.
function auditLogos({timeout=8000,concurrency=8}={}){
  const names=new Set(beers.map(b=>b.beer));
  for(const e of WANT_TO_TRY) names.add(e.beer);

  const tierOf=(name,url)=>{
    if(LOCAL_LOGOS[name]===url) return 'local';
    if(url.includes('brandfetch')) return 'brandfetch';
    if(url.includes('google.com/s2')) return 'favicon';
    if(url.includes('icon.horse')) return 'iconhorse';
    return '?';
  };
  const tryOne=url=>new Promise(res=>{
    const img=new Image();
    const done=ok=>{ clearTimeout(t); img.onload=img.onerror=null; res(ok?{w:img.naturalWidth,h:img.naturalHeight}:null); };
    const t=setTimeout(()=>done(false),timeout);
    img.onload=()=>done(img.naturalWidth>0);
    img.onerror=()=>done(false);
    img.src=url;
  });
  const walk=async name=>{
    const srcs=logoSources(name);
    for(const url of srcs){
      const hit=await tryOne(url);
      if(hit) return {beer:name,result:tierOf(name,url),size:`${hit.w}×${hit.h}`,
                      suspect:hit.w<=32?'yes':'',url,
                      domains:brandDomains(name).join(', ')||'—'};
    }
    return {beer:name,result:srcs.length?'PLACEHOLDER':'NO DOMAIN',size:'—',suspect:'',
            url:'',domains:brandDomains(name).join(', ')||'—'};
  };

  const queue=[...names].sort(), out=[];
  const worker=async()=>{ while(queue.length) out.push(await walk(queue.shift())); };
  return Promise.all(Array.from({length:concurrency},worker)).then(()=>{
    out.sort((a,b)=>a.beer.localeCompare(b.beer));
    const bad=out.filter(r=>r.result==='PLACEHOLDER'||r.result==='NO DOMAIN');
    const susp=out.filter(r=>r.suspect);
    console.table(out);
    const by=out.reduce((m,r)=>((m[r.result]=(m[r.result]||0)+1),m),{});
    console.log(`[LOGO AUDIT] ${out.length} beers · ` +
      Object.entries(by).map(([k,v])=>`${k}: ${v}`).join(' · '));
    if(bad.length)  console.warn(`[LOGO AUDIT] ${bad.length} showing the placeholder:\n  - ${bad.map(r=>r.beer).join('\n  - ')}`);
    if(susp.length) console.warn(`[LOGO AUDIT] ${susp.length} resolved at favicon size (likely a generic icon, not the brand):\n  - ${susp.map(r=>`${r.beer} (${r.size}, ${r.domains})`).join('\n  - ')}`);
    if(!bad.length&&!susp.length) console.log('[LOGO AUDIT] every beer resolved a real logo.');
    return out;
  });
}
window.auditLogos=auditLogos;

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
  return `<img src="${sources[0]}" class="beer-logo-inline" style="width:${size}px;height:${size}px" alt="${esc(name)}" loading="lazy" decoding="async"${onerr}>`;
}
function cardLogo(name){
  const sources=logoSources(name);
  if(!sources.length)return `<span class="bc-emoji">🍺</span>`;
  const emojiReplace=`this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{className:'bc-emoji',textContent:'🍺'}));`;
  const onerr=logoChainOnError(sources,emojiReplace);
  return `<img src="${sources[0]}" class="bc-logo" alt="${esc(name)}" loading="lazy" decoding="async"${onerr}>`;
}

const MONTH_FULL = {Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
const MONTH_COLORS = ['#e9a23b','#5b9fe3','#46c68a','#9b87e8','#d4bd52','#e5646f','#4bb5ad','#cf7ba4','#7fa8d4','#e07a4c','#a992e0','#8ab861'];

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
// A thin group's bar is drawn as a wash of its own color rather than a
// different one — the reading stays "same series, not enough of it". It only
// dims to 70%: alpha over a dark ground darkens toward mud, and the sort
// order, the (n) in the label and the tooltip already carry "not ranked".
const barFill=(hex,n)=>thin(n)?hex+'b3':hex;
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
// PRE-COMPUTED STATISTICS — recomputed by reloadData() if the data changes
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
const LANG_COLORS={"German":"#e9a23b","Dutch":"#5b9fe3","English":"#46c68a","French":"#9b87e8","Japanese":"#e5646f","Spanish":"#d4bd52","Danish":"#8d94a3","Czech":"#4bb5ad","Italian":"#cf7ba4","Polish":"#d97f7f","Portuguese":"#e07a4c","Swedish":"#7fa8d4","Norwegian":"#8189cf","Chinese":"#d45a5a","Thai":"#a992e0","Greek":"#63a9cf","Afrikaans":"#8ab861","Arabic":"#d9997f"};
const LANG_FLAGS={"German":"🇩🇪","Dutch":"🇳🇱","English":"🇬🇧","French":"🇫🇷","Japanese":"🇯🇵","Spanish":"🇪🇸","Danish":"🇩🇰","Czech":"🇨🇿","Italian":"🇮🇹","Polish":"🇵🇱","Portuguese":"🇵🇹","Swedish":"🇸🇪","Norwegian":"🇳🇴","Chinese":"🇨🇳","Thai":"🇹🇭","Greek":"🇬🇷","Afrikaans":"🇿🇦","Arabic":"🇱🇧"};
let BEER_REVIEWS=new Map();       // beer name → [reviews]
let BEER_REVIEWS_NORM=new Map();  // normalised beer name → {name, reviews}
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
  // Same reviews, keyed the way the want-to-try shortlist looks them up.
  BEER_REVIEWS_NORM=new Map();
  for(const [name,reviews] of BEER_REVIEWS) BEER_REVIEWS_NORM.set(wtNorm(name),{name,reviews});
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
// DATA RELOAD HOOK
// ══════════════════════════════════════════════════════════════
// data.js declares beers/breweries/drunkLocs as `let`, so a host that stores
// the data elsewhere (an API, a database) can replace their contents and call
// this once. It recomputes every derived statistic, clears the lazy-render
// guards so each tab redraws from the new data, and repaints whatever tab is
// open. Nothing else in the app caches data across a call.
function reloadData(){
  refreshStats();
  // Lazy tabs redraw when next shown; the two eager panels redraw now.
  ['_cD','_ciD','_inD','_tmpD','_ciX','_wtD','_dM','_langD']
    .forEach(f=>{ window[f]=false; });
  try{ updateLiveStats(); }catch(e){ console.error('Reload stats error:',e); }
  try{ applyBeerFilter(); }catch(e){ console.error('Reload table error:',e); }
  try{ renderBeerGrid(); }catch(e){ console.error('Reload grid error:',e); }
  const activePanel=document.querySelector('.panel.active');
  if(activePanel) showTab(activePanel.id);
}

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
    if(!window._wtD) drawWantToTry();
  }
  resizeChartsIn(document.getElementById(name));
  try{history.replaceState(null,'','#'+name);}catch(e){}
}

// (Map view switching lives in setMapMode, defined in the MAP section.)

// ── CHART DEFAULTS
try {
  Chart.defaults.color=THEME.text2;
  Chart.defaults.borderColor=THEME.border;
  Chart.defaults.font.family="'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
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
  <div class="insight-row"><span class="insight-key">Best style</span><div><div class="insight-val up">${esc(bestStyle.s)}</div><div class="insight-sub">${bestStyle.a.toFixed(2)} avg · ${bestStyle.c} review${bestStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Weakest style</span><div><div class="insight-val dn">${esc(worstStyle.s)}</div><div class="insight-sub">${worstStyle.a.toFixed(2)} avg · ${worstStyle.c} review${worstStyle.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Top country</span><div><div class="insight-val">${esc(topCountry.l)}</div><div class="insight-sub">${topCountry.a.toFixed(2)} avg · ${topCountry.c} review${topCountry.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Top city</span><div><div class="insight-val">${esc(topCity.city)}, ${esc(topCity.region)}</div><div class="insight-sub">${topCity.a.toFixed(2)} avg · ${topCity.c} review${topCity.c>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Best method</span><div><div class="insight-val">${bestMethod}</div><div class="insight-sub">${bestMethodAvg.toFixed(2)} avg · ${bestMethodCt} review${bestMethodCt>1?'s':''}</div></div></div>
  <div class="insight-row"><span class="insight-key">Trend</span><div><div class="insight-val ${trendCls}">${trendLabel}</div><div class="insight-sub">5-review rolling average · ${Object.keys(STATS.countryMap).length} countries · ${Object.keys(STATS.cityMap).length} cities</div></div></div>`;

// Recent activity feed — last 6 pours, newest first (beers[] is chronological)
const recentEl=document.getElementById('recentFeed');
if(recentEl) recentEl.innerHTML=[...beers].slice(-6).reverse().map(b=>`
  <div class="feed-row" data-beer="${esc(b.beer)}" role="button" tabindex="0">
    ${logoImg(b.beer,20)}
    <div class="feed-main">
      <span class="feed-name">${esc(b.beer)}${isDisplayNew(b)?'<span class="new-tag">New</span>':''}</span>
      <span class="feed-meta">${esc(b.style)} · ${esc(b.method)} · ${esc(b.city)} · ${esc(b.month)} ${b.year}</span>
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
        <div class="feed-row mir-pour" data-beer="${esc(b.beer)}" role="button" tabindex="0">
          ${logoImg(b.beer,18)}
          <div class="feed-main"><span class="feed-name">${esc(b.beer)}</span><span class="feed-meta">${esc(b.style)} · ${esc(b.method)}</span></div>
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
  data:{labels:mO.map((m,i)=>`${m} ${nLabel(mCt[i])}`),datasets:[{data:mA,backgroundColor:[THEME.accent,THEME.info,THEME.purple,'#4bb5ad'].map((c,i)=>barFill(c,mCt[i])),borderWidth:0}]},
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
      <tr${isDisplayNew(b)?' class="new-row"':''} style="cursor:pointer" data-beer="${esc(b.beer)}">
        <td>${logoImg(b.beer,24)}</td>
        <td style="color:var(--text);font-weight:600"><span class="beer-name-cell">${esc(b.beer)}</span>${isDisplayNew(b)?`<span class="new-tag">New</span>`:''}</td>
        <td style="color:var(--text-3);font-size:12px">${esc(b.style)}</td>
        <td>${FLAGS[b.origin]||''} ${esc(b.origin)}</td>
        <td style="color:var(--info)">${b.abv.toFixed(1)}%</td>
        <td style="color:var(--text-3)">${esc(b.method)}</td>
        <td style="color:var(--text-3)">${esc(b.city)}, ${esc(b.region)} · ${FLAGS[b.cc]||''} ${esc(b.country)}</td>
        <td style="color:var(--text-3)">${esc(b.month)} ${b.year}</td>
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

// One card per beer, showing its best pour. A function rather than a boot
// block so reloadData() can repaint it when the data underneath changes.
function renderBeerGrid(){
  const best={};
  beers.forEach(b=>{if(!best[b.beer]||b.rating>best[b.beer].rating)best[b.beer]=b;});
  const unique=Object.values(best).sort((a,b)=>b.rating-a.rating);
  document.getElementById('beerGrid').innerHTML=unique.map(b=>`
  <div class="beer-card" data-beer="${esc(b.beer)}">
    ${isDisplayNew(b)?'<span class="bc-new">NEW</span>':''}
    <div class="bc-logo-wrap">${cardLogo(b.beer)}</div>
    <div class="bc-ticker">${esc(b.beer)}</div>
    <div class="bc-style">${esc(b.style)}</div>
    <div class="bc-bottom">
      <span class="bc-abv">${b.abv}%</span>
      <span class="rb ${rbC(b.rating)}">${b.rating.toFixed(2)}</span>
    </div>
    <div style="font-size:12px;color:var(--text-3);margin-top:3px">${FLAGS[b.origin]||''} ${CNAMES[b.origin]||b.origin} · ${esc(b.method)}</div>
  </div>`).join('');
}
try { renderBeerGrid(); } catch(e){ console.error('beerGrid init:',e); }

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
        <div style="font-size:13px;color:var(--text-3);margin-bottom:2px">${esc(b0.style)}</div>
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
          <td style="color:var(--text-3)">${esc(b.method)}</td>
          <td style="color:var(--text-2)">${esc(b.city)}, ${esc(b.region)}</td>
          <td>${FLAGS[b.cc]||''} ${esc(b.country)}</td>
          <td style="color:var(--text-3);font-size:12px">${esc(b.month)} ${b.year}</td>
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
      <div class="bb-bar-label"><span class="name">${esc(d.l)}</span><span class="val">${d.a.toFixed(2)}/5 · ${d.c}x${thin(d.c)?' · unranked':''}</span></div>
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
      <div><div style="font-size:13px;color:var(--text);font-weight:600">${esc(d.city)}</div><div style="font-size:12px;color:var(--text-3)">${esc(d.region)} · ${FLAGS[d.cc]||''} ${esc(d.country)} · ${d.c} review${d.c>1?'s':''}${thin(d.c)?' · unranked':''}</div></div>
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
      <div class="bb-bar-label"><span class="name">${esc(p.l)}</span><span class="val">${thin(p.n)?`${esc(p.n)} review${p.n===1?'':'s'} · need ${MIN_N}`:`${p.v.toFixed(2)}/5 · ${esc(p.n)}x`}</span></div>
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
const STAMP_INKS=['#e9a23b','#46c68a','#d4bd52','#e07a4c','#e5646f','#9b87e8','#5b9fe3','#cf7ba4'];
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
  const bg=THEME.surface;
  const art=(COUNTRY_ART[cc]||genericArt)(bg);
  const valueText=r.drank?`${r.drank.avg.toFixed(2)} ★`:(r.brewed?`${r.brewed.names.length} brewer${r.brewed.names.length===1?'y':'ies'}`:'');
  return `<svg viewBox="0 0 120 150" width="128" height="160" role="img" aria-label="${esc(name)} passport stamp">
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
      <div class="mk-row"><span class="mk-dot" style="width:9px;height:9px;background:var(--info)"></span>a brewery’s hometown</div>
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
    const rows=d.reviews.map(b=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text-2)">${esc(b.beer)}</span><span style="color:${rC(b.rating)};font-weight:700">${b.rating.toFixed(2)}</span></div>`).join('');
    const html=popKicker('📍 A city where I drank')+
      `<span style="color:var(--text);font-weight:700;font-size:13px">${esc(l.city)}</span>, ${esc(l.region)}&nbsp;&nbsp;${FLAGS[l.cc]||''} ${esc(l.country)}${home?' · <span style="color:var(--accent-hi)">⌂ Home turf</span>':''}<br>`+
      `<span style="color:var(--text-2);font-size:13px">${d.c} pour${d.c>1?'s':''} here · my average <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5</span></span>`+
      `<div style="margin-top:6px">${rows}</div>`;
    L.circleMarker([l.lat,l.lng],{radius:r,fillColor:THEME.accent,color:home?THEME.accentHi:THEME.bg,weight:home?2:1,opacity:.9,fillOpacity:.8})
      .bindTooltip(`${esc(l.city)} · ${d.c} pour${d.c>1?'s':''}`,{direction:'top',className:'mtip'})
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
      `<span style="color:var(--text);font-weight:700;font-size:13px">${esc(b.name)}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">brews in ${esc(b.location)} · ${FLAGS[b.cc]||''} ${esc(b.country)}</span><br>`+
      `<span style="color:var(--text-3);font-size:12px">What I’ve had:</span> <span style="font-size:13px">${beerList}</span><br>`+
      `my average: <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5 · ${rWord(a)}</span> <span style="color:var(--text-3)">(${b.ratings.length} pour${b.ratings.length>1?'s':''})</span>`;
    L.circleMarker([b.lat,b.lng],{radius:r,fillColor:rC(a),color:THEME.bg,weight:1,opacity:.9,fillOpacity:.85})
      .bindTooltip(`${esc(b.name)} · ${a.toFixed(2)}/5`,{direction:'top',className:'mtip'})
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
      `<span style="color:var(--text);font-weight:700;font-size:13px">${esc(j.beer)}</span><br>`+
      `<span style="color:var(--text-2)">${j.br.location.split(',')[0]} ${FLAGS[j.br.cc]||''}</span> <span style="color:var(--text-3)">→</span> <span style="color:var(--text-2)">${esc(j.loc.city)} ${FLAGS[j.loc.cc]||''}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">traveled ~<b style="color:var(--accent-hi)">${fmtMi(j.miles)} mi</b> · my rating <span style="color:${rC(a)};font-weight:700">${a.toFixed(2)}/5</span></span>`;
    L.polyline(pts,{color:rC(a),weight:1.6,opacity:.65})
      .bindTooltip(`${esc(j.beer)} · ${fmtMi(j.miles)} mi`,{sticky:true,className:'mtip'})
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
      `<span style="color:var(--text);font-weight:700;font-size:13px">${FLAGS[r.cc]||''} ${esc(r.country)}</span><br>`+
      `<span style="color:var(--text-2);font-size:13px">${roleLabel}</span>`+
      (r.brewed?`<div style="margin-top:4px;font-size:13px;color:var(--text-2)">🏭 ${r.brewed.names.length} brewer${r.brewed.names.length>1?'ies':'y'} · ${r.brewed.count} pour${r.brewed.count>1?'s':''}</div>`:'')+
      (r.drank?`<div style="font-size:13px;color:var(--text-2)">🍺 ${r.drank.cities.length} cit${r.drank.cities.length>1?'ies':'y'} · ${r.drank.count} pour${r.drank.count>1?'s':''} · first ${r.firstMonth} ${r.firstYear}</div>`:'');
    L.circleMarker([lat,lng],{radius:9,fillColor:color,color:THEME.bg,weight:1,opacity:.9,fillOpacity:.85})
      .bindTooltip(`${FLAGS[r.cc]||''} ${esc(r.country)}`,{direction:'top',className:'mtip'})
      .bindPopup(popHtml(html),{className:'dpop'}).addTo(group);
    bounds.push([lat,lng]);
  });
  return {group,bounds};
}

function renderDrankTable(){
  const cM=drankCityData();
  const arr=Object.entries(cM).map(([city,d])=>({city,count:d.c,avg:d.t/d.c,beers:d.bs,region:d.region,country:d.country,cc:d.cc})).sort((a,b)=>b.count-a.count);
  document.getElementById('drunkTbody').innerHTML=arr.map(c=>`<tr>
    <td style="color:var(--text)">${esc(c.city)}${HOME_CITIES.has(c.city)?' <span style="color:var(--accent-hi);font-size:12px">⌂ Home</span>':''}</td>
    <td style="color:var(--text-3)">${esc(c.region)}</td>
    <td style="color:var(--text-2)">${FLAGS[c.cc]||''} ${esc(c.country)}</td>
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
      <td style="font-weight:600"><span class="brewery-clickable" data-brewery="${esc(b.name)}">${esc(b.name)}</span></td>
      <td style="color:var(--text-3);font-size:12px">${esc(b.location)}</td>
      <td style="color:var(--text-2)">${FLAGS[b.cc]||''} ${esc(b.country)}</td>
      <td style="color:var(--text-3);font-size:12px">${b.beers}</td>
      <td><span class="rb ${rbC(b.avg)}${thin(b.n)?' rb-thin':''}" title="${esc(b.n)} review${b.n===1?'':'s'}${thin(b.n)?` · under ${MIN_N}, not ranked`:''}">${b.avg.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
}

function renderJourneyTable(journeys){
  const s=[...journeys].sort((a,b)=>b.miles-a.miles);
  const totalMi=journeys.reduce((sum,j)=>sum+j.miles*j.pours,0);
  const far=s[0],near=s[s.length-1];
  const sumEl=document.getElementById('journeySummary');
  if(sumEl&&far) sumEl.innerHTML=`<div class="jny-sum">
    <span>🏆 Longest haul: <b style="color:var(--accent-hi)">${esc(far.beer)}</b> — ${fmtMi(far.miles)} mi (${far.br.location.split(',')[0]} → ${esc(far.loc.city)})</span>
    <span>🏠 Most local: <b style="color:var(--pos)">${esc(near.beer)}</b> — ${fmtMi(near.miles)} mi (${near.br.location.split(',')[0]} → ${esc(near.loc.city)})</span>
    <span>🌍 All pours combined: <b style="color:var(--info)">${fmtMi(totalMi)} beer-miles</b></span>
  </div>`;
  document.getElementById('journeyTbody').innerHTML=s.map((j,i)=>{
    const a=avg(j.ratings);
    return `<tr data-beer="${esc(j.beer)}" style="cursor:pointer">
      <td style="color:var(--text-3)">${i+1}</td>
      <td style="color:var(--text);font-weight:600">${esc(j.beer)}</td>
      <td style="color:var(--text-2)">${FLAGS[j.br.cc]||''} ${esc(j.br.location)}</td>
      <td style="color:var(--text-2)">${FLAGS[j.loc.cc]||''} ${esc(j.loc.city)}</td>
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
            <span style="color:var(--text-2);font-size:13px">${esc(best.beer)}</span>
          </div>
          <span class="rb ${rbC(best.rating)}">${best.rating.toFixed(2)}</span>
        </div>
        <div class="mini-row">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:12px;color:var(--red);font-weight:700">Worst</span>
            ${logoImg(worst.beer,18)}
            <span style="color:var(--text-2);font-size:13px">${esc(worst.beer)}</span>
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
    if(a>=4.5)return'rgba(70,198,138,0.34)';if(a>=4.0)return'rgba(140,196,106,0.28)';
    if(a>=3.5)return'rgba(204,180,79,0.26)';if(a>=3.0)return'rgba(233,162,59,0.24)';
    if(a>=2.5)return'rgba(221,133,85,0.24)';return'rgba(229,100,111,0.24)';
  }
  let heatHtml='<table class="bb-table" style="text-align:center"><thead><tr><th style="text-align:left">Style</th>';
  months.forEach((m,i)=>{heatHtml+=`<th style="color:${monthColors[i]}">${monthAbbr[m]}</th>`;});
  heatHtml+='</tr></thead><tbody>';
  allStyles.forEach(style=>{
    heatHtml+=`<tr><td style="text-align:left;color:${sC[style]};font-weight:600;font-size:12px;white-space:nowrap">${esc(style)}</td>`;
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
  heatHtml+=`<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12px;color:var(--text-3)"><span>Low</span><div style="display:flex;height:10px;flex:1;max-width:200px;border:1px solid var(--border)"><div style="flex:1;background:rgba(229,100,111,0.24)"></div><div style="flex:1;background:rgba(221,133,85,0.24)"></div><div style="flex:1;background:rgba(233,162,59,0.24)"></div><div style="flex:1;background:rgba(204,180,79,0.26)"></div><div style="flex:1;background:rgba(70,198,138,0.34)"></div></div><span>High</span><span style="margin-left:auto">Cells under ${MIN_N} reviews are left uncolored</span></div>`;
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
    const BUMP_COLORS=['#e9a23b','#5b9fe3','#46c68a','#9b87e8','#e5646f','#cf7ba4','#4bb5ad','#e07a4c','#8ab861','#8189cf'];
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
        {label:'Rating',data:tlData,borderColor:THEME.accent,backgroundColor:'rgba(233,162,59,0.10)',fill:true,tension:.3,pointRadius:3,pointBackgroundColor:tlColors,pointBorderColor:THEME.bg,pointBorderWidth:1},
        {label:'5-Pt Avg',data:tlRoll,borderColor:THEME.info,borderDash:[3,3],tension:.3,pointRadius:0,fill:false},
      ]
    },
    options:{plugins:{legend:{labels:{color:THEME.tick,font:{size:9},boxWidth:10}},tooltip:TT},scales:{y:{min:1.5,max:5.2,grid:{color:THEME.grid},ticks:{color:THEME.tick}},x:{grid:{display:false},ticks:{color:THEME.tick,maxTicksLimit:12}}}}
  });
}

// ══════════════════════════════════════════════════════════════
// CONTRARIAN INDEX
// ══════════════════════════════════════════════════════════════

function drawContrarian(){
  window._ciX=true;
  // The world's averages (UNTAPPD_GLOBAL_AVGS) live in data.js.
  // STATS.brandList already has avg/cnt per beer — reuse it instead of
  // rebuilding totals from STATS.brandMap.
  const rows=STATS.brandList.filter(b=>UNTAPPD_GLOBAL_AVGS[b.n]!==undefined).map(b=>{
    const global=UNTAPPD_GLOBAL_AVGS[b.n], jwal=b.avg, delta=jwal-global;
    return {name:b.n,jwal,global,delta};
  }).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));

  // Freshness indicator — turns yellow once Untappd data is older than the refresh interval.
  const freshEl=document.getElementById('ciFreshness');
  if(freshEl){
    const ageMs=Date.now()-new Date(UNTAPPD_LAST_REFRESHED).getTime();
    const ageDays=Math.floor(ageMs/86400000);
    const stale=ageDays>UNTAPPD_REFRESH_INTERVAL_DAYS;
    freshEl.textContent=`World ratings updated ${UNTAPPD_LAST_REFRESHED} (${ageDays}d ago)${stale?' · refresh due':''}`;
    freshEl.style.color=stale?THEME.warn:THEME.text3;
  }

  const sorted=rows.slice().sort((a,b)=>b.delta-a.delta);
  const contrarianCanvas=document.getElementById('contrarianChart');
  if(contrarianCanvas) contrarianCanvas.style.height=Math.max(280,sorted.length*22)+'px';
  safeChart('contrarianChart',contrarianCanvas,{type:'bar',
    data:{labels:sorted.map(r=>r.name),datasets:[{label:'Me vs World',data:sorted.map(r=>+r.delta.toFixed(2)),
      backgroundColor:sorted.map(r=>r.delta>0?'rgba(70,198,138,0.8)':'rgba(229,100,111,0.8)'),
      borderColor:sorted.map(r=>r.delta>0?THEME.pos:THEME.neg),borderWidth:1.5}]},
    options:{indexAxis:'y',maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{...TT,callbacks:{label:c=>`${c.raw>=0?'+':''}${c.raw} · Me: ${sorted[c.dataIndex].jwal.toFixed(2)} · World: ${sorted[c.dataIndex].global.toFixed(2)}`}}},
      scales:{x:{min:-2,max:2,grid:{color:THEME.grid},ticks:{color:THEME.tick},title:{display:true,text:'← World liked it more   ·   I liked it more →',color:THEME.axisTitle}},
              y:{grid:{display:false},ticks:{color:THEME.label,font:{size:9}}}}}
  });
}

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
// WANT TO TRY — the shortlist, and what became of it
// ══════════════════════════════════════════════════════════════
// One list, two halves, and nothing to maintain between them. Every entry in
// WANT_TO_TRY is either still to drink or already drunk, and which half it
// falls in is worked out here on every render by looking for a review of it.
// Log the beer in beers[] and it moves by itself: off the shortlist, into the
// scorecard, where the guess made before the pour is held against the rating
// given after it. No flag to flip, no row to delete, nothing that can go stale
// because someone forgot.

// The reviews of a shortlist entry, under whichever name it was logged, or
// null while it is still unopened. `as` covers the beers whose shelf name and
// logged name differ — everything else matches on the normalised name.
function wtReviews(e){
  for(const n of [e.beer,...(e.as||[])]){
    const hit=BEER_REVIEWS_NORM.get(wtNorm(n));
    if(hit) return hit;
  }
  return null;
}

// Verdict on a predicted rating. The colour comes off the same rating ramp the
// badges and charts use, so a "must try" reads the same green everywhere.
function wtVerdict(guess){
  return {label:guess>=4.0?'Must try':guess>=3.5?'Worth it':guess>=3.0?'Decent':'Long shot',
          color:rC(guess)};
}

// Why this beer, in at most three chips. Every claim about my taste is held to
// MIN_N — one generous pour is not "a style I like" — and the two "new ground"
// chips are the opposite case, where there is no history at all.
function wtWhy(r){
  const g=STATS.globalAvg,chips=[];
  const sM=STATS.styleMap[r.style];
  if(!sM) chips.push(`First ${r.style.toLowerCase()} on the board`);
  else if(!thin(sM.c)&&sM.t/sM.c>=g) chips.push(`${r.style} averages ${(sM.t/sM.c).toFixed(2)} for me`);
  const cM=STATS.countryMap[r.origin];
  if(!cM) chips.push(`${FLAGS[r.origin]||''} ${CNAMES[r.origin]||r.origin} would be new`);
  else if(!thin(cM.c)&&cM.t/cM.c>=g) chips.push(`${FLAGS[r.origin]||''} ${CNAMES[r.origin]||r.origin} averages ${(cM.t/cM.c).toFixed(2)}`);
  if(r.method==='Draft'||r.method==='Nitro') chips.push(`On ${r.method.toLowerCase()}, which flatters it`);
  if(r._world>=3.8) chips.push(`The world rates it ${r._world.toFixed(2)}`);
  if(!chips.length) chips.push(`The world rates it ${r._world.toFixed(2)}`);
  return chips.slice(0,3);
}

// The shortlist's own filter state. Kept here rather than read back off the
// selects so a redraw after new data lands restores what was chosen.
let _wtSort='guess',_wtStyle='',_wtOrigin='',_wtRows=[];

function wtGauge(label,value,cls){
  const pct=Math.max(0,Math.min(100,value/5*100));
  return `<div class="wt-gauge">
    <span class="wt-gauge-k">${esc(label)}</span>
    <span class="wt-track"><span class="wt-fill ${cls}" style="width:${pct.toFixed(1)}%"></span></span>
    <span class="wt-gauge-v">${value.toFixed(2)}</span>
  </div>`;
}

const WT_SORTS={
  guess:  (a,b)=>b._guess-a._guess,
  edge:   (a,b)=>b._edge-a._edge,
  world:  (a,b)=>b._world-a._world,
  abv:    (a,b)=>a.abv-b.abv,
  name:   (a,b)=>a.beer.localeCompare(b.beer),
};

// Only the shortlist grid redraws when a filter changes — the scorecard and
// the charts below it don't depend on any of this.
function renderWtShortlist(){
  const grid=document.getElementById('wtPicks');
  if(!grid) return;
  const todo=_wtRows.filter(r=>!r._tried)
    .filter(r=>!_wtStyle||r.style===_wtStyle)
    .filter(r=>!_wtOrigin||r.origin===_wtOrigin)
    .sort(WT_SORTS[_wtSort]||WT_SORTS.guess);

  const cnt=document.getElementById('wt-count');
  const total=_wtRows.filter(r=>!r._tried).length;
  if(cnt) cnt.textContent=todo.length===total
    ? `${total} beer${total===1?'':'s'}`
    : `${todo.length} of ${total}`;

  if(!todo.length){
    grid.innerHTML=`<p class="wt-empty">${total
      ? 'Nothing on the shortlist matches those filters.'
      : 'The whole shortlist has been drunk. Add the next round to WANT_TO_TRY in data.js.'}</p>`;
    return;
  }
  grid.innerHTML=todo.map((r,i)=>{
    const {label,color}=wtVerdict(r._guess);
    const chips=wtWhy(r).map(t=>`<span class="wt-chip">${esc(t)}</span>`).join('');
    const flat=Math.abs(r._edge)<=0.05;
    const edge=flat?'Level with the world'
      :`${Math.abs(r._edge).toFixed(2)} ${r._edge>0?'above':'below'} the world`;
    return `<article class="wt-card" style="--wt-accent:${color}">
      <div class="wt-top">
        <span class="wt-rank${i<3?' wt-rank-top':''}">${i+1}</span>
        ${logoImg(r.beer,22)}
        <span class="wt-name">${esc(r.beer)}</span>
      </div>
      <div class="wt-meta">${FLAGS[r.origin]||''} ${esc(r.style)} · ${r.abv.toFixed(1)}% · ${esc(r.method.toLowerCase())} · ${esc(r.region)}</div>
      <div class="wt-gauges">
        ${wtGauge('My guess',r._guess,'wt-fill-mine')}
        ${wtGauge('World',r._world,'wt-fill-world')}
      </div>
      <div class="wt-foot">
        <span class="wt-edge ${flat?'fl':r._edge>0?'up':'dn'}">${edge}</span>
        <span class="wt-verdict">${esc(label)}</span>
      </div>
      <div class="wt-why">${chips}</div>
    </article>`;
  }).join('');
}

function drawWantToTry(){
  window._wtD=true;
  try{

  // ── Every entry, scored. `_world` prefers the maintained Untappd average
  // once a beer has been reviewed, so the scorecard and the contrarian chart
  // below it quote the same number.
  _wtRows=WANT_TO_TRY.map(e=>{
    const hit=wtReviews(e);
    const world=(hit&&UNTAPPD_GLOBAL_AVGS[hit.name]!==undefined)?UNTAPPD_GLOBAL_AVGS[hit.name]:e.untappd;
    const guess=predictRating(e.style,e.origin,world,e.method);
    const mine=hit?avg(hit.reviews.map(b=>b.rating)):null;
    return {...e,_name:hit?hit.name:e.beer,_tried:!!hit,_reviews:hit?hit.reviews:[],
            _world:world,_guess:guess,_mine:mine,_edge:guess-world,
            _miss:mine===null?null:mine-guess};
  });
  const todo=_wtRows.filter(r=>!r._tried);
  const done=_wtRows.filter(r=>r._tried)
    .sort((a,b)=>b._miss-a._miss);

  // ── Headline numbers
  const best=todo.slice().sort(WT_SORTS.guess)[0];
  const misses=done.map(r=>Math.abs(r._miss));
  const mae=misses.length?avg(misses):null;
  const close=done.filter(r=>Math.abs(r._miss)<=0.25).length;
  const kpiEl=document.getElementById('wt-kpis');
  if(kpiEl) kpiEl.innerHTML=`<div class="kpi-strip">
    <div class="kpi"><div class="kpi-val" style="color:var(--accent)">${todo.length}</div>
      <div class="kpi-label">Still to drink</div>
      <div class="kpi-sub">of ${_wtRows.length} ever shortlisted</div></div>
    <div class="kpi"><div class="kpi-val" style="color:var(--pos)">${done.length}</div>
      <div class="kpi-label">Crossed off</div>
      <div class="kpi-sub">${done.length?'Scored against the guess':'Nothing tried yet'}</div></div>
    <div class="kpi"><div class="kpi-val" style="color:${best?rC(best._guess):'var(--text-3)'}">${best?best._guess.toFixed(2):'—'}</div>
      <div class="kpi-label">Best guess going</div>
      <div class="kpi-sub">${best?esc(best.beer):'The list is empty'}</div></div>
    <div class="kpi"><div class="kpi-val" style="color:${mae===null?'var(--text-3)':mae<=0.35?'var(--pos)':mae<=0.6?'var(--warn)':'var(--neg)'}">${mae===null?'—':'±'+mae.toFixed(2)}</div>
      <div class="kpi-label">How far my guesses land</div>
      <div class="kpi-sub">${done.length?`${close} of ${done.length} within a quarter star`:'Try one and find out'}</div></div>
  </div>`;

  // ── Shortlist filters — options come from what is actually still on the list
  const styleSel=document.getElementById('wtStyleFilter');
  const originSel=document.getElementById('wtOriginFilter');
  const fill=(sel,vals,label,cur)=>{
    if(!sel) return;
    sel.innerHTML=`<option value="">${label}</option>`+
      vals.map(([v,t])=>`<option value="${esc(v)}"${v===cur?' selected':''}>${esc(t)}</option>`).join('');
    if(!vals.some(([v])=>v===cur)) sel.value='';
  };
  fill(styleSel,[...new Set(todo.map(r=>r.style))].sort().map(s=>[s,s]),'All styles',_wtStyle);
  fill(originSel,[...new Set(todo.map(r=>r.origin))]
    .sort((a,b)=>(CNAMES[a]||a).localeCompare(CNAMES[b]||b))
    .map(o=>[o,`${FLAGS[o]||''} ${CNAMES[o]||o}`.trim()]),'Everywhere',_wtOrigin);
  if(styleSel&&styleSel.value!==_wtStyle) _wtStyle=styleSel.value;
  if(originSel&&originSel.value!==_wtOrigin) _wtOrigin=originSel.value;
  const sortSel=document.getElementById('wtSort');
  if(sortSel) sortSel.value=_wtSort;

  renderWtShortlist();

  // ── Crossed off — the guesses that have been settled
  const donePanel=document.getElementById('wtDonePanel');
  if(donePanel) donePanel.hidden=!done.length;
  const doneCount=document.getElementById('wt-done-count');
  if(doneCount) doneCount.textContent=done.length+' beer'+(done.length===1?'':'s');
  const scoreEl=document.getElementById('wtScoreline');
  if(scoreEl&&done.length){
    const over=done.filter(r=>r._miss>0.25).length,under=done.filter(r=>r._miss<-0.25).length;
    scoreEl.textContent=`${done.length} shortlisted beers have been drunk since. My guess landed within a quarter star ${close} time${close===1?'':'s'}, ran low on ${over} and ran high on ${under}. Every guess is recomputed from my taste as it stands today, so they move as the rest of the data does.`;
  }
  const doneBody=document.getElementById('wtDoneBody');
  if(doneBody) doneBody.innerHTML=done.map(r=>{
    const miss=r._miss,vsWorld=r._mine-r._world;
    const verdict=miss>0.25?'Beat the guess':miss<-0.25?'Fell short':'Called it';
    const vColor=miss>0.25?THEME.pos:miss<-0.25?THEME.neg:THEME.warn;
    const when=r._reviews.length?`${r._reviews[r._reviews.length-1].month} ${r._reviews[r._reviews.length-1].year}`:'';
    return `<tr data-beer="${esc(r._name)}" tabindex="0">
      <td>${logoImg(r._name,24)}</td>
      <td class="wt-cell-beer">${esc(r._name)}<span>${esc(r.style)}${when?' · '+esc(when):''}</span></td>
      <td>${FLAGS[r.origin]||''} <span style="color:var(--text-2)">${esc(r.origin)}</span></td>
      <td style="color:var(--purple)">${r._world.toFixed(2)}</td>
      <td style="color:var(--info)">${r._guess.toFixed(2)}</td>
      <td><span class="rb ${rbC(r._mine)}">${r._mine.toFixed(2)}</span></td>
      <td class="${miss>=0?'up':'dn'}">${miss>=0?'+':''}${miss.toFixed(2)}</td>
      <td class="${vsWorld>=0?'up':'dn'}">${vsWorld>=0?'+':''}${vsWorld.toFixed(2)}</td>
      <td><span class="wt-result" style="border-color:${vColor};color:${vColor}">${verdict}</span></td>
    </tr>`;
  }).join('');

  // ── Calibration — how far each settled guess was out, and which way
  const calCanvas=document.getElementById('wtCalibChart');
  if(calCanvas&&done.length){
    calCanvas.style.height=Math.max(220,done.length*24)+'px';
    safeChart('wtCalibChart',calCanvas,{type:'bar',
      // Fills are the semantic tokens at 80% (the `+'cc'` idiom barFill uses),
      // so a retint of --pos / --neg carries here with nothing to keep in sync.
      data:{labels:done.map(r=>r._name),datasets:[{data:done.map(r=>+r._miss.toFixed(2)),
        backgroundColor:done.map(r=>(r._miss>0?THEME.pos:THEME.neg)+'cc'),
        borderColor:done.map(r=>r._miss>0?THEME.pos:THEME.neg),borderWidth:1.5}]},
      options:{indexAxis:'y',maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{...TT,callbacks:{
          label:c=>`${c.raw>=0?'+':''}${c.raw} · guessed ${done[c.dataIndex]._guess.toFixed(2)} · rated ${done[c.dataIndex]._mine.toFixed(2)}`}}},
        scales:{x:{min:-2,max:2,grid:{color:THEME.grid},ticks:{color:THEME.tick},
                   title:{display:true,text:'← I guessed too high   ·   I guessed too low →',color:THEME.axisTitle}},
                y:{grid:{display:false},ticks:{color:THEME.label,font:{size:9}}}}}
    });
  } else if(calCanvas){
    const prev=_charts['wtCalibChart']; if(prev){prev.destroy();delete _charts['wtCalibChart'];}
  }

  } catch(e){ console.error('Want-to-try error:',e); }
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
          <div class="cmd-item" data-beer="${esc(b.beer)}" data-action="beer">
            <span class="cmd-item-icon">🍺</span>
            <span class="cmd-item-main">${esc(b.beer)}</span>
            <span class="cmd-item-meta">${esc(b.style)} · ${FLAGS[b.origin]||''} ${esc(b.origin)}</span>
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
          <div class="cmd-item" data-brewery="${esc(b.name)}" data-action="brewery">
            <span class="cmd-item-icon">🏭</span>
            <span class="cmd-item-main">${esc(b.name)}</span>
            <span class="cmd-item-meta">${esc(b.location)} · ${FLAGS[b.cc]||''}</span>
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
      <div class="drawer-stat"><span class="drawer-key">Brewery</span><span class="drawer-val" style="max-width:200px">${esc(brewery.name)}</span></div>
      ${brewery.nativeName?`<div class="drawer-stat"><span class="drawer-key">Native name</span><span class="drawer-val" style="max-width:200px">${esc(brewery.nativeName)}</span></div>`:''}
      <div class="drawer-stat"><span class="drawer-key">Location</span><span class="drawer-val">${esc(brewery.location)}</span></div>
      <div class="drawer-stat"><span class="drawer-key">Country</span><span class="drawer-val">${FLAGS[brewery.cc]||''} ${esc(brewery.country)}</span></div>
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
// KPI ANIMATED COUNTERS + MONTH-OVER-MONTH DELTAS
// ══════════════════════════════════════════════════════════════
(function initKPIStats(){
  try {
    // Per-month series behind each tile. The compact home tiles no longer draw a
    // sparkline, so these exist purely to give the delta chips their two points.
    const {months,byMonth} = getMonthlyData();
    if(months.length<2) return; // need 2+ months to have anything to compare

    const momSeries={
      'top': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?Math.max(...rs):null; }),
      'avg': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?avg(rs):null; }),
      'low': months.map(m=>{ const rs=byMonth[m].map(b=>b.rating); return rs.length?Math.min(...rs):null; }),
      'abv': months.map(m=>{ const as=byMonth[m].map(b=>b.abv); return as.length?avg(as):null; }),
      'brands': months.map(m=>{ return [...new Set(byMonth[m].map(b=>b.beer))].length; }),
      'hit': months.map(m=>{ const rs=byMonth[m]; return rs.length?rs.filter(b=>b.rating>=3).length/rs.length*100:null; }),
    };

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

    // MoM delta chips — latest month's value vs the one before
    [['ov-top-delta','top',v=>v.toFixed(2)],
     ['ov-avg-delta','avg',v=>v.toFixed(2)],
     ['ov-low-delta','low',v=>v.toFixed(2)],
     ['ov-abv-delta','abv',v=>v.toFixed(1)+'pp'],
     ['ov-brands-delta','brands',v=>String(Math.round(v))],
     ['ov-hit-delta','hit',v=>Math.round(v)+'pp'],
    ].forEach(([id,key,f])=>{
      const el=document.getElementById(id);
      if(!el) return;
      const d=momSeries[key],a=d[d.length-2],b=d[d.length-1];
      if(a==null||b==null){ el.textContent=''; return; }
      const diff=b-a,up=diff>0.005,dn=diff<-0.005;
      el.className='kpi-delta '+(up?'up':dn?'dn':'fl');
      el.textContent=(up?'▲':dn?'▼':'→')+f(Math.abs(diff));
      el.title='vs previous month';
    });
  } catch(e){ console.error('KPI stats error:',e); }
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
  const insightsPanel = document.getElementById('insights');
  insightsPanel.addEventListener('click', function(e) {
    const btn = e.target.closest('.subtab[data-subtab]');
    if (btn) showInsightsSubtab(btn.dataset.subtab);
  });

  // What to try — the shortlist's own sort and filters. Only the grid redraws.
  const wtCtrls = {wtSort:'_wtSort', wtStyleFilter:'_wtStyle', wtOriginFilter:'_wtOrigin'};
  insightsPanel.addEventListener('change', function(e) {
    const key = wtCtrls[e.target.id];
    if (!key) return;
    if (key === '_wtSort') _wtSort = e.target.value;
    else if (key === '_wtStyle') _wtStyle = e.target.value;
    else _wtOrigin = e.target.value;
    renderWtShortlist();
  });

  // A crossed-off beer has a review behind it — open it.
  insightsPanel.addEventListener('click', function(e) {
    const row = e.target.closest('#wtDoneBody tr[data-beer]');
    if (row) openBeerModal(row.dataset.beer);
  });
  insightsPanel.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('#wtDoneBody tr[data-beer]');
    if (row) { e.preventDefault(); openBeerModal(row.dataset.beer); }
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
