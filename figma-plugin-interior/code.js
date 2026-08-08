// NWST Interior Pages — step-by-step with error reporting

const C = {
  green:  { r: 0.102, g: 0.420, b: 0.235 },
  greenD: { r: 0.071, g: 0.302, b: 0.169 },
  gold:   { r: 0.784, g: 0.592, b: 0.227 },
  cream:  { r: 0.973, g: 0.961, b: 0.941 },
  dark:   { r: 0.102, g: 0.102, b: 0.102 },
  mid:    { r: 0.290, g: 0.290, b: 0.290 },
  light:  { r: 0.541, g: 0.541, b: 0.541 },
  white:  { r: 1,     g: 1,     b: 1     },
  border: { r: 0.867, g: 0.867, b: 0.867 },
  footBg: { r: 0.102, g: 0.102, b: 0.102 },
  footFg: { r: 0.450, g: 0.450, b: 0.450 },
  muted:  { r: 0.740, g: 0.860, b: 0.770 },
};

const W = 1440;
const P = 130;  // left/right padding
let HF = 'Playfair Display';

const TOURS = [
  { id:'wild-atlantic',    name:'Wild Atlantic Way',           price:89,  label:'per person', dur:'8 Hours',  grp:'Up to 14', type:'Full Day',   eyebrow:'COASTAL ADVENTURE',          accent:{ r:0.07,g:0.30,b:0.17 }, highlights:["Slieve League Cliffs","Malin Head","Pub lunch included"],     itinerary:[{t:"8:00am",h:"Departure",d:"Pick-up from Derry / Sligo."},{t:"9:30am",h:"Malin Head",d:"Ireland's northernmost point."},{t:"11:00am",h:"Slieve League",d:"Walk the cliff paths."},{t:"1:00pm",h:"Lunch",d:"Traditional pub lunch included."},{t:"6:00pm",h:"Return",d:"Drop-off at pick-up point."}], inc:["Expert guide","Coach","Pub lunch","Entry fees"], exc:["Insurance","Gratuities"] },
  { id:'giants-causeway',  name:"Giant's Causeway & Antrim",   price:105, label:'per person', dur:'Full Day', grp:'Up to 14', type:'Premium',    eyebrow:'UNESCO WORLD HERITAGE',      accent:{ r:0.13,g:0.27,b:0.40 }, highlights:["Giant's Causeway","Carrick-a-Rede rope bridge","Dark Hedges"], itinerary:[{t:"7:30am",h:"Departure",d:"Pick-up from Derry."},{t:"9:00am",h:"Dark Hedges",d:"Game of Thrones location."},{t:"10:00am",h:"Giant's Causeway",d:"UNESCO site visit."},{t:"2:00pm",h:"Rope Bridge",d:"Cross the famous bridge."},{t:"5:30pm",h:"Return",d:"Coastal drive back."}], inc:["Expert guide","Coach","Causeway entry","Bridge entry"], exc:["Lunch","Insurance"] },
  { id:'donegal-highlands',name:'Donegal Highlands Explorer',  price:72,  label:'per person', dur:'6 Hours',  grp:'Up to 14', type:'Half Day+',  eyebrow:'MOUNTAIN & WILDERNESS',      accent:{ r:0.22,g:0.29,b:0.18 }, highlights:["Glenveagh National Park","Mount Errigal","Afternoon tea"],      itinerary:[{t:"9:00am",h:"Departure",d:"Pick-up from Letterkenny."},{t:"10:00am",h:"Mount Errigal",d:"Donegal's iconic peak."},{t:"11:00am",h:"Glenveagh",d:"National park & castle."},{t:"1:00pm",h:"Sheep Farm",d:"Farm visit & afternoon tea."},{t:"3:30pm",h:"Return",d:"Highland drive back."}], inc:["Expert guide","Coach","Afternoon tea","Park entry"], exc:["Lunch","Insurance"] },
  { id:'sligo-yeats',      name:'Sligo & Yeats Country',       price:65,  label:'per person', dur:'5 Hours',  grp:'Up to 14', type:'Cultural',   eyebrow:'LITERATURE & LANDSCAPE',     accent:{ r:0.35,g:0.22,b:0.10 }, highlights:["Benbulben mountain","Yeats's grave at Drumcliffe","Innisfree"],  itinerary:[{t:"10:00am",h:"Departure",d:"Pick-up from Sligo."},{t:"10:30am",h:"Drumcliffe",d:"Yeats's grave beneath Benbulben."},{t:"11:30am",h:"Benbulben",d:"Panoramic stops."},{t:"1:00pm",h:"Lough Gill",d:"Boat to Isle of Innisfree."},{t:"3:30pm",h:"Return",d:"Back to Sligo."}], inc:["Expert guide","Coach","Boat trip","Cemetery entry"], exc:["Lunch","Insurance"] },
  { id:'fermanagh',        name:'Fermanagh Lakelands',          price:78,  label:'per person', dur:'7 Hours',  grp:'Up to 14', type:'Nature',     eyebrow:'LAKES & LEGENDS',            accent:{ r:0.07,g:0.22,b:0.35 }, highlights:["Devenish Island monastery","Marble Arch Caves","Enniskillen Castle"], itinerary:[{t:"8:30am",h:"Departure",d:"Pick-up from Enniskillen."},{t:"9:30am",h:"Devenish Island",d:"6th century monastery by boat."},{t:"11:00am",h:"Marble Arch Caves",d:"UNESCO geopark tour."},{t:"2:30pm",h:"Enniskillen Castle",d:"Castle & museum."},{t:"5:30pm",h:"Return",d:"Back to Enniskillen."}], inc:["Expert guide","Coach","Boat trip","Cave entry","Castle entry"], exc:["Lunch","Insurance"] },
  { id:'private',          name:'Private Bespoke Tour',         price:220, label:'per group',  dur:'Flexible', grp:'Any size', type:'Bespoke',   eyebrow:'FULLY TAILORED EXPERIENCE',  accent:{ r:0.20,g:0.15,b:0.07 }, highlights:["Fully custom itinerary","Dedicated private guide","Any destinations"], itinerary:[{t:"Flexible",h:"Your Schedule",d:"We work around your timing."},{t:"Flexible",h:"Your Route",d:"Any north-west destinations."},{t:"Flexible",h:"Your Meals",d:"Restaurants arranged on request."},{t:"Flexible",h:"Return",d:"Drop-off wherever suits."}], inc:["Private guide","Private vehicle","Custom itinerary","All entry fees"], exc:["Meals (unless arranged)","Accommodation"] },
];

// ---- primitives ----
function solid(c) { return [{ type:'SOLID', color:c }]; }

function fr(name, w, h, bg, corner) {
  const f = figma.createFrame();
  f.name = name; f.resize(w, h);
  f.fills = bg ? solid(bg) : [];
  f.clipsContent = false;
  if (corner) f.cornerRadius = corner;
  return f;
}

function rc(p, x, y, w, h, c, radius, opacity) {
  const r = figma.createRectangle();
  r.resize(w, h); r.x = x; r.y = y;
  r.fills = c ? solid(c) : [];
  if (radius  !== undefined) r.cornerRadius = radius;
  if (opacity !== undefined) r.opacity = opacity;
  p.appendChild(r); return r;
}

function tx(p, s, x, y, size, c, fam, sty, w, align, lh, ls) {
  const t = figma.createText();
  t.fontName = { family:fam, style:sty };
  t.fontSize = size; t.fills = solid(c);
  if (w)     { t.textAutoResize = 'HEIGHT'; t.resize(w, 20); }
  if (align) t.textAlignHorizontal = align;
  if (lh)    t.lineHeight    = { value:lh, unit:'PIXELS' };
  if (ls)    t.letterSpacing = { value:ls, unit:'PIXELS' };
  t.characters = s; t.x = x; t.y = y;
  p.appendChild(t); return t;
}

const RI = (p,s,x,y,sz,c,w,align,lh) => tx(p,s,x,y,sz,c,'Inter','Regular',w,align,lh);
const BI = (p,s,x,y,sz,c,w,align,ls) => tx(p,s,x,y,sz,c,'Inter','Bold',w,align,null,ls);
const BH = (p,s,x,y,sz,c,w,align,lh) => tx(p,s,x,y,sz,c,HF,'Bold',w,align,lh);

function sdw(node) {
  node.effects = [{ type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.10}, offset:{x:0,y:4}, radius:20, spread:0, visible:true, blendMode:'NORMAL' }];
}

// ---- sections ----

function makeNav() {
  const f = fr('Nav', W, 72, C.white);
  rc(f, 0, 71, W, 1, C.border);
  rc(f, P, 29, 12, 12, C.gold, 2);
  BH(f, 'North West Scenic Tours', P+20, 25, 17, C.dark);
  RI(f, '← All Tours', P+220, 28, 13, C.green);
  tx(f,'Tours',W-420,27,15,C.mid,'Inter','Medium'); tx(f,'About',W-320,27,15,C.mid,'Inter','Medium'); tx(f,'Contact',W-220,27,15,C.mid,'Inter','Medium');
  rc(f, W-140, 18, 120, 38, C.green, 6);
  BI(f, 'Book Now', W-122, 27, 14, C.white);
  return f;
}

function makeHero(t) {
  const f = fr('Hero', W, 480, t.accent);
  rc(f, 0, 0, W, 480, C.greenD, 0, 0.45);
  rc(f, 0, 300, W, 180, {r:0,g:0,b:0}, 0, 0.5);
  rc(f, P, 108, 56, 3, C.gold);
  BI(f, t.eyebrow, P, 124, 12, C.gold, null, null, 3);
  BH(f, t.name, P, 150, 48, C.white, 680, null, 60);
  ['⏱ '+t.dur, '👥 '+t.grp, '🚀 '+t.type].forEach(function(chip, i) {
    rc(f, P+i*180, 398, 165, 32, C.white, 16, 0.15);
    BI(f, chip, P+i*180+14, 406, 12, C.white);
  });
  return f;
}

function makeBar(t) {
  const f = fr('Booking Bar', W, 58, C.white);
  rc(f, 0, 57, W, 1, C.border);
  BH(f, '€'+t.price, P, 8, 26, C.green);
  RI(f, t.label, P+62, 20, 11, C.light);
  ['⏱ '+t.dur, '👥 '+t.grp, '🚀 '+t.type].forEach(function(chip, i) {
    rc(f, P+170+i*166, 11, 152, 30, C.cream, 15);
    RI(f, chip, P+182+i*166, 19, 12, C.mid);
  });
  rc(f, W-P-140, 9, 140, 40, C.green, 6);
  BI(f, 'Book This Tour', W-P-122, 18, 13, C.white);
  return f;
}

function makeContent(t) {
  var lx = P;
  var sx = P + 780;
  var cw = 660; // main column width
  var sw = W - sx - P; // sidebar width

  // Calculate height
  var hlH  = 56 + t.highlights.length  * 52;
  var itH  = 56 + t.itinerary.length   * 86;
  var incH = 60 + Math.max(t.inc.length, t.exc.length) * 34 + 30;
  var total = 48 + 180 + 40 + hlH + 40 + itH + 40 + incH + 80;
  if (total < 1500) total = 1500;

  const f = fr('Content', W, total, C.white);
  var y = 48;

  // About
  BH(f, 'About This Tour', lx, y, 20, C.dark);
  rc(f, lx, y+30, cw, 2, C.cream);
  RI(f, t.name+' is one of our most popular routes — led by expert local guides with deep knowledge of the area. Small groups of up to '+t.grp+' ensure a personal experience.', lx, y+46, 15, C.mid, cw, null, 24);
  y += 180;

  // Highlights
  BH(f, 'Tour Highlights', lx, y, 20, C.dark);
  rc(f, lx, y+30, cw, 2, C.cream);
  t.highlights.forEach(function(hl, i) {
    rc(f, lx, y+50+i*52, cw, 44, C.cream, 8);
    rc(f, lx, y+50+i*52, 4, 44, C.green, 2);
    RI(f, '→  '+hl, lx+16, y+61+i*52, 14, C.dark);
  });
  y += hlH + 40;

  // Itinerary
  BH(f, 'What to Expect', lx, y, 20, C.dark);
  rc(f, lx, y+30, cw, 2, C.cream);
  t.itinerary.forEach(function(step, i) {
    var sy = y + 50 + i*86;
    BI(f, step.t, lx, sy, 11, C.green);
    rc(f, lx+72, sy+2, 10, 10, C.green, 5);
    if (i < t.itinerary.length-1) rc(f, lx+76, sy+14, 2, 74, C.border);
    BI(f, step.h, lx+96, sy, 14, C.dark);
    RI(f, step.d, lx+96, sy+20, 13, C.mid, cw-96, null, 20);
  });
  y += itH + 40;

  // Included/Excluded
  BH(f, "What's Included", lx, y, 20, C.dark);
  rc(f, lx, y+30, cw, 2, C.cream);
  var hw = (cw-16)/2;
  BI(f, '✓  Included', lx, y+48, 13, C.green);
  t.inc.forEach(function(item, i) {
    rc(f, lx, y+68+i*34, hw, 28, C.cream, 6);
    RI(f, '✓  '+item, lx+10, y+74+i*34, 13, C.mid);
  });
  BI(f, '✗  Not Included', lx+hw+16, y+48, 13, {r:0.75,g:0.20,b:0.20});
  t.exc.forEach(function(item, i) {
    rc(f, lx+hw+16, y+68+i*34, hw, 28, {r:0.99,g:0.96,b:0.96}, 6);
    RI(f, '✗  '+item, lx+hw+26, y+74+i*34, 13, C.mid);
  });

  // Sidebar — price card
  var pc = fr('Price Card', sw, 290, C.white, 16);
  pc.x = sx; pc.y = 48; sdw(pc);
  rc(pc, 0, 0, sw, 4, C.green, 0);
  RI(pc, 'From', 24, 22, 12, C.light);
  BH(pc, '€'+t.price, 24, 40, 32, C.green);
  RI(pc, t.label, 24, 82, 12, C.light);
  [{l:'Duration',v:t.dur},{l:'Group',v:t.grp},{l:'Type',v:t.type}].forEach(function(d,i){
    rc(pc, 24, 110+i*40, sw-48, 1, C.border);
    RI(pc, d.l, 24, 118+i*40, 12, C.light);
    BI(pc, d.v, sw-24, 118+i*40, 12, C.dark, 120, 'RIGHT');
  });
  rc(pc, 24, 242, sw-48, 40, C.green, 8);
  BI(pc, 'Book Now', 24+(sw-48)/2-32, 252, 14, C.white);
  f.appendChild(pc);

  // Sidebar — help card
  var hc = fr('Help', sw, 110, C.cream, 16);
  hc.x = sx; hc.y = 358;
  BI(hc, 'Need Help?', 24, 20, 14, C.dark);
  RI(hc, 'Mon–Sat 10am–8pm', 24, 44, 13, C.mid);
  rc(hc, 24, 68, sw-48, 34, C.white, 8);
  BI(hc, '📞  Call Us', 24+(sw-48)/2-30, 77, 13, C.green);
  f.appendChild(hc);

  return f;
}

function makeBooking(t) {
  const f = fr('Booking', W, 640, C.greenD);
  BI(f, 'RESERVATIONS', W/2-80, 40, 12, C.muted, 160, 'CENTER', 3);
  BH(f, 'Book This Tour', W/2-210, 64, 34, C.white, 420, 'CENTER');
  RI(f, "We'll confirm within 2 hours. 20% deposit secures your date.", W/2-250, 112, 15, C.muted, 500, 'CENTER');

  const fm = fr('Form', 800, 400, C.white, 16);
  fm.x = W/2-400; fm.y = 156; sdw(fm);
  rc(fm, 40, 0, 800, 4, C.green, 0);

  BI(fm, 'Selected Tour', 40, 22, 13, C.dark);
  rc(fm, 40, 44, 720, 36, C.cream, 8);
  RI(fm, t.name, 56, 53, 14, C.mid);

  var fields = [{l:'Date *',x:40,y:104},{l:'Guests *',x:420,y:104},{l:'First Name *',x:40,y:192},{l:'Last Name *',x:420,y:192},{l:'Email *',x:40,y:280},{l:'Phone',x:420,y:280}];
  fields.forEach(function(fd) {
    BI(fm, fd.l, fd.x, fd.y, 13, C.dark);
    var inp = figma.createRectangle();
    inp.resize(340, 38); inp.x = fd.x; inp.y = fd.y+20;
    inp.fills = []; inp.strokes = [{type:'SOLID',color:C.border}];
    inp.strokeWeight = 1.5; inp.cornerRadius = 8;
    fm.appendChild(inp);
  });

  rc(fm, 40, 342, 720, 44, C.green, 8);
  BI(fm, 'Confirm Booking Request', 240, 354, 15, C.white);
  f.appendChild(fm);
  return f;
}

function makeRelated(t, all) {
  const f = fr('Related', W, 520, C.cream);
  BI(f, 'EXPLORE MORE', W/2-60, 40, 12, C.green, 120, 'CENTER', 3);
  BH(f, 'You Might Also Like', W/2-210, 64, 30, C.dark, 420, 'CENTER');

  var others = all.filter(function(o){ return o.id !== t.id; }).slice(0,3);
  var cw = 360, gap = 22, startX = (W-3*cw-2*gap)/2;
  others.forEach(function(o, i) {
    var card = fr('Card: '+o.name, cw, 290, C.white, 10);
    sdw(card); card.x = startX+i*(cw+gap); card.y = 120;
    rc(card, 0, 0, cw, 140, o.accent);
    rc(card, 0, 95, cw, 45, C.greenD, 0, 0.45);
    RI(card, '⛰', cw/2-16, 46, 32, C.white);
    RI(card, '⏱ '+o.dur+'   👥 '+o.grp, 20, 152, 11, C.light);
    BH(card, o.name, 20, 172, 16, C.dark, cw-40, null, 24);
    rc(card, 20, 226, cw-40, 1, C.border);
    BH(card, '€'+o.price, 20, 238, 20, C.green);
    rc(card, cw-104, 232, 84, 32, C.green, 6);
    BI(card, 'View', cw-90, 241, 12, C.white);
    f.appendChild(card);
  });
  return f;
}

function makeFooter() {
  const f = fr('Footer', W, 300, C.footBg);
  rc(f, P, 40, W-P*2, 1, {r:0.22,g:0.22,b:0.22});
  rc(f, P, 50, 12, 12, C.gold, 2);
  BH(f, 'North West Scenic Tours', P+20, 46, 16, C.white);
  RI(f, "Ireland's Premier Tour Operator since 2021.", P, 76, 13, C.footFg, 300, null, 22);
  [{t:'TOURS',x:500,items:['Wild Atlantic Way',"Giant's Causeway",'Donegal Highlands']},
   {t:'COMPANY',x:740,items:['About Us','Contact','FAQs']},
   {t:'SOCIAL',x:960,items:['Facebook','Instagram','TripAdvisor']}
  ].forEach(function(col){
    BI(f, col.t, col.x, 50, 11, C.white, null, null, 2);
    col.items.forEach(function(item,i){ RI(f, item, col.x, 76+i*26, 13, C.footFg); });
  });
  rc(f, 0, 256, W, 1, {r:0.20,g:0.20,b:0.20});
  RI(f, '© 2024 North West Scenic Tours Ltd. All rights reserved.', W/2-200, 268, 12, {r:0.35,g:0.35,b:0.35}, 400, 'CENTER');
  return f;
}

// ---- assemble one tour page ----
function buildPage(t, all) {
  var secs = [];
  try { secs.push(makeNav());        } catch(e) { console.error('Nav: '+e.message); }
  try { secs.push(makeHero(t));      } catch(e) { console.error('Hero: '+e.message); }
  try { secs.push(makeBar(t));       } catch(e) { console.error('Bar: '+e.message); }
  try { secs.push(makeContent(t));   } catch(e) { console.error('Content: '+e.message); }
  try { secs.push(makeBooking(t));   } catch(e) { console.error('Booking: '+e.message); }
  try { secs.push(makeRelated(t,all));} catch(e) { console.error('Related: '+e.message); }
  try { secs.push(makeFooter());     } catch(e) { console.error('Footer: '+e.message); }

  var totalH = secs.reduce(function(sum, s){ return sum + s.height; }, 0);
  var wrap = fr('Tour — '+t.name, W, totalH, null);
  wrap.clipsContent = false;

  var y = 0;
  secs.forEach(function(s) { s.x = 0; s.y = y; wrap.appendChild(s); y += s.height; });
  return wrap;
}

// ---- main ----
async function main() {
  figma.notify('Loading fonts…', { timeout:20000 });

  var required = [
    {family:'Inter',style:'Regular'},
    {family:'Inter',style:'Medium'},
    {family:'Inter',style:'Bold'},
    {family:'Playfair Display',style:'Bold'},
  ];
  for (var i=0; i<required.length; i++) {
    try { await figma.loadFontAsync(required[i]); }
    catch(e) {
      if (required[i].family === 'Playfair Display') {
        try { await figma.loadFontAsync({family:'Georgia',style:'Bold'}); HF='Georgia'; }
        catch(_) { HF='Inter'; }
      }
    }
  }

  figma.notify('Building tour pages…', { timeout:30000 });

  var frames = [];
  var xPos = 0;

  for (var i=0; i<TOURS.length; i++) {
    try {
      figma.notify('Building '+TOURS[i].name+'…', { timeout:6000 });
      var page = buildPage(TOURS[i], TOURS);
      page.x = xPos;
      page.y = 0;
      figma.currentPage.appendChild(page);
      frames.push(page);
      xPos += W + 100;
    } catch(e) {
      figma.notify('Error on '+TOURS[i].name+': '+e.message, { error:true });
      console.error(TOURS[i].name, e);
    }
  }

  if (frames.length > 0) {
    figma.viewport.scrollAndZoomIntoView(frames);
    figma.notify('✅ '+frames.length+' pages created!', { timeout:5000 });
  } else {
    figma.notify('❌ No pages were created. Check console for errors.', { error:true });
  }
}

main().then(function(){ figma.closePlugin(); }).catch(function(e){
  figma.notify('❌ '+e.message, { error:true });
  console.error(e);
  figma.closePlugin();
});
