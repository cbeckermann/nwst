// ============================================================
//  North West Scenic Tours — Figma Landing Page Generator
// ============================================================

const C = {
  green:     { r: 0.102, g: 0.420, b: 0.235 },
  greenD:    { r: 0.071, g: 0.302, b: 0.169 },
  gold:      { r: 0.784, g: 0.592, b: 0.227 },
  cream:     { r: 0.973, g: 0.961, b: 0.941 },
  dark:      { r: 0.102, g: 0.102, b: 0.102 },
  mid:       { r: 0.290, g: 0.290, b: 0.290 },
  light:     { r: 0.541, g: 0.541, b: 0.541 },
  white:     { r: 1,     g: 1,     b: 1     },
  border:    { r: 0.867, g: 0.867, b: 0.867 },
  footerBg:  { r: 0.102, g: 0.102, b: 0.102 },
  mutedGreen:{ r: 0.740, g: 0.860, b: 0.770 },
  heroFg:    { r: 0.850, g: 0.850, b: 0.850 },
  footerFg:  { r: 0.450, g: 0.450, b: 0.450 },
};

const W = 1440;
let HF = 'Playfair Display'; // heading font, may fall back

// ---- helpers ----

function solid(c) {
  return [{ type: 'SOLID', color: c }];
}

function mkFrame(name, w, h, bg, cornerRadius) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = bg ? solid(bg) : [];
  f.clipsContent = false;
  if (cornerRadius) f.cornerRadius = cornerRadius;
  return f;
}

function mkRect(parent, x, y, w, h, color, opts) {
  opts = opts || {};
  const r = figma.createRectangle();
  r.name = opts.name || 'rect';
  r.resize(w, h);
  r.x = x; r.y = y;
  r.fills = color ? solid(color) : [];
  if (opts.opacity !== undefined) r.opacity = opts.opacity;
  if (opts.radius  !== undefined) r.cornerRadius = opts.radius;
  if (opts.stroke) {
    r.strokes = [{ type: 'SOLID', color: opts.stroke }];
    r.strokeWeight = opts.sw || 1.5;
    r.strokeAlign = 'INSIDE';
  }
  parent.appendChild(r);
  return r;
}

function mkText(parent, content, x, y, size, color, family, style, opts) {
  opts = opts || {};
  const t = figma.createText();
  t.fontName = { family: family, style: style };
  t.fontSize = size;
  t.fills = solid(color);
  if (opts.w) { t.textAutoResize = 'HEIGHT'; t.resize(opts.w, 20); }
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.lh)    t.lineHeight    = { value: opts.lh, unit: 'PIXELS' };
  if (opts.ls)    t.letterSpacing = { value: opts.ls, unit: 'PIXELS' };
  t.characters = content;
  t.x = x; t.y = y;
  parent.appendChild(t);
  return t;
}

function IR(p,s,x,y,sz,c,o)  { return mkText(p,s,x,y,sz,c,'Inter','Regular',o); }
function IM(p,s,x,y,sz,c,o)  { return mkText(p,s,x,y,sz,c,'Inter','Medium',o); }
function IB(p,s,x,y,sz,c,o)  { return mkText(p,s,x,y,sz,c,'Inter','Bold',o); }
function PB(p,s,x,y,sz,c,o)  { return mkText(p,s,x,y,sz,c,HF,'Bold',o); }

function shadow(node, a, oy, radius) {
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { r:0, g:0, b:0, a: a||0.10 },
    offset: { x:0, y: oy||6 },
    radius: radius||24,
    spread: 0, visible: true, blendMode: 'NORMAL',
  }];
}

// ---- 1. NAV ----
function buildNav(y) {
  const f = mkFrame('1 · Nav', W, 72, C.white);
  f.x = 0; f.y = y;
  mkRect(f, 0, 71, W, 1, C.border);
  mkRect(f, 80, 29, 12, 12, C.gold, { radius:2 });
  IB(f, 'North West Scenic Tours', 102, 25, 17, C.dark);
  IM(f, 'Tours',   W-428, 27, 15, C.mid);
  IM(f, 'About',   W-328, 27, 15, C.mid);
  IM(f, 'Contact', W-228, 27, 15, C.mid);
  mkRect(f, W-148, 18, 120, 38, C.green, { radius:6 });
  IB(f, 'Book Now', W-130, 27, 14, C.white);
  return f;
}

// ---- 2. HERO ----
function buildHero(y) {
  const f = mkFrame('2 · Hero', W, 780, C.greenD);
  f.x = 0; f.y = y;
  mkRect(f, 0, 0, W, 780, { r:0.03,g:0.14,b:0.07 }, { opacity:0.55 });
  mkRect(f, W/2-32, 198, 64, 3, C.gold);
  IB(f, 'DISCOVER IRELAND\'S WILD NORTH WEST', W/2-270, 216, 12, C.gold,
    { w:540, align:'CENTER', ls:3 });
  PB(f, 'Scenic Tours\nLike No Other', W/2-340, 248, 72, C.white,
    { w:680, align:'CENTER', lh:84 });
  IR(f, 'Breathtaking landscapes, ancient cliffs and hidden gems —\nguided by locals who love every mile.',
    W/2-280, 434, 19, C.heroFg, { w:560, align:'CENTER', lh:30 });
  mkRect(f, W/2-204, 516, 188, 52, C.green, { radius:6 });
  IB(f, 'Explore Tours', W/2-184, 530, 16, C.white);
  const gb = figma.createRectangle();
  gb.name = 'Book a Tour'; gb.resize(168, 52);
  gb.x = W/2+20; gb.y = 516;
  gb.fills = [];
  gb.strokes = [{ type:'SOLID', color:{ r:0.85,g:0.85,b:0.85 } }];
  gb.strokeWeight = 2; gb.cornerRadius = 6;
  f.appendChild(gb);
  IB(f, 'Book a Tour', W/2+42, 530, 16, C.white);
  return f;
}

// ---- 3. STATS ----
function buildStats(y) {
  const f = mkFrame('3 · Stats Strip', W, 108, C.green);
  f.x = 0; f.y = y;
  const items = [
    ['12+','Years of Experience'],
    ['5,000+','Happy Travellers'],
    ['18','Unique Tours'],
    ['4.9 ★','Average Rating'],
  ];
  items.forEach(function(item, i) {
    const cx = i * (W/4);
    PB(f, item[0], cx+20, 14, 30, C.gold, { w:W/4-40, align:'CENTER' });
    IR(f, item[1], cx+20, 56, 13, C.mutedGreen, { w:W/4-40, align:'CENTER' });
    if (i < 3) mkRect(f, (i+1)*(W/4), 18, 1, 70, C.white, { opacity:0.15 });
  });
  return f;
}

// ---- tour card ----
function buildCard(name, price, dur, desc, badge) {
  const c = mkFrame('Card: '+name, 416, 482, C.white, 10);
  shadow(c, 0.10, 6, 24);
  mkRect(c, 0, 0, 416, 192, C.mutedGreen);
  mkRect(c, 0, 148, 416, 44, C.greenD, { opacity:0.3 });
  IR(c, '⛰', 190, 64, 48, C.green);
  if (badge) {
    mkRect(c, 16, 16, 112, 26, C.gold, { radius:13 });
    IB(c, badge, 24, 20, 11, C.white);
  }
  IM(c, '⏱ '+dur+'   👥 Up to 12', 20, 204, 12, C.light);
  PB(c, name, 20, 230, 19, C.dark, { w:376, lh:27 });
  IR(c, desc, 20, 266, 13, C.mid, { w:376, lh:20 });
  mkRect(c, 20, 382, 376, 1, C.border);
  PB(c, '€'+price, 20, 396, 26, C.green);
  IR(c, 'per person', 20, 432, 12, C.light);
  mkRect(c, 296, 394, 100, 40, C.green, { radius:6 });
  IB(c, 'Book Now', 309, 406, 13, C.white);
  return c;
}

// ---- 4. TOURS ----
function buildTours(y) {
  const f = mkFrame('4 · Tours', W, 1260, C.cream);
  f.x = 0; f.y = y;
  IB(f, 'OUR PACKAGES', W/2-90, 64, 12, C.green, { w:180, align:'CENTER', ls:3 });
  PB(f, 'Choose Your Adventure', W/2-270, 88, 40, C.dark, { w:540, align:'CENTER', lh:50 });
  IR(f, "Each tour is carefully crafted to show you the very best of Ireland's stunning north-west coast.",
    W/2-260, 156, 16, C.mid, { w:520, align:'CENTER', lh:26 });
  const tours = [
    { n:'Wild Atlantic Way',      p:89,  d:'8 Hours',  b:'Most Popular',
      t:"Soaring sea cliffs, windswept headlands and charming harbour villages from Donegal to Sligo." },
    { n:"Giant's Causeway",       p:105, d:'Full Day',  b:null,
      t:"UNESCO World Heritage Site, Carrick-a-Rede rope bridge and the legendary Dark Hedges avenue." },
    { n:'Donegal Highlands',      p:72,  d:'6 Hours',  b:null,
      t:"Ancient peat bogs, glassy mountain lakes and the haunting beauty of Glenveagh National Park." },
    { n:'Sligo & Yeats Country',  p:65,  d:'5 Hours',  b:null,
      t:"Walk in the footsteps of W.B. Yeats — Benbulben, Lough Gill and the Isle of Innisfree." },
    { n:'Fermanagh Lakelands',    p:78,  d:'7 Hours',  b:null,
      t:"Island monasteries, cave systems and the legendary Shannon-Erne waterway." },
    { n:'Private Bespoke Tour',   p:220, d:'Flexible', b:null,
      t:"Fully custom itinerary built around your interests, pace and schedule. Any group size." },
  ];
  const gap=24, cw=416, sx=(W - 3*cw - 2*gap)/2;
  tours.forEach(function(t, i) {
    const card = buildCard(t.n, t.p, t.d, t.t, t.b);
    card.x = sx + (i%3)*(cw+gap);
    card.y = 210 + Math.floor(i/3)*520;
    f.appendChild(card);
  });
  return f;
}

// ---- 5. WHY CHOOSE US ----
function buildWhy(y) {
  const f = mkFrame('5 · Why Choose Us', W, 640, C.white);
  f.x = 0; f.y = y;
  IB(f, 'WHY CHOOSE US', 100, 80, 12, C.green, { ls:3 });
  PB(f, 'More Than\nJust a Tour', 100, 104, 40, C.dark, { w:460, lh:50 });
  IR(f, "Every route is hand-picked by local guides born and raised in the north-west.\nWe take you off the beaten track to places most visitors never see.",
    100, 222, 16, C.mid, { w:460, lh:26 });
  var bullets = [
    'Small groups (max 16 people)',
    'Air-conditioned luxury coaches',
    'Expert local guides with storytelling flair',
    'Free pick-up from Derry / Sligo town centres',
    'Free cancellation up to 48 hours before',
  ];
  bullets.forEach(function(b, i) {
    mkRect(f, 100, 314+i*44, 22, 22, C.green, { radius:11 });
    IB(f, '✓', 106, 316+i*44, 12, C.white);
    IR(f, b, 132, 317+i*44, 15, C.dark);
  });
  mkRect(f, 100, 542, 196, 50, C.green, { radius:6 });
  IB(f, 'Reserve Your Spot', 116, 555, 15, C.white);
  const img = mkFrame('Photo', 560, 500, C.mutedGreen, 16);
  img.x = 760; img.y = 70;
  IR(img, '⛰', 240, 180, 80, C.green);
  IM(img, 'Guided by locals', 185, 294, 16, C.greenD, { w:190, align:'CENTER' });
  f.appendChild(img);
  return f;
}

// ---- 6. TESTIMONIALS ----
function buildTestimonials(y) {
  const f = mkFrame('6 · Testimonials', W, 570, C.cream);
  f.x = 0; f.y = y;
  IB(f, 'TRAVELLER STORIES', W/2-110, 60, 12, C.green, { w:220, align:'CENTER', ls:3 });
  PB(f, 'What Our Guests Say', W/2-250, 84, 38, C.dark, { w:500, align:'CENTER', lh:48 });
  var reviews = [
    { q:'"The Wild Atlantic Way tour was the highlight of our entire Ireland trip. Our guide knew every hidden spot. Absolutely unforgettable."',
      n:'Sarah & Tom', l:'Dublin, Ireland' },
    { q:'"We did the Giant\'s Causeway tour and were blown away. Small group size meant personal attention and the rope bridge was terrifying in the best way!"',
      n:'Emily Watson', l:'London, UK' },
    { q:'"Booked a private tour for our family of 8. They built a perfect itinerary mixing history, nature and gastronomy. Worth every cent!"',
      n:'The Kowalski Family', l:'Chicago, USA' },
  ];
  var cw = Math.floor((W - 240 - 2*28) / 3);
  reviews.forEach(function(r, i) {
    var card = mkFrame('Review '+(i+1), cw, 270, C.white, 10);
    shadow(card, 0.08, 4, 20);
    card.x = 120 + i*(cw+28);
    card.y = 172;
    IR(card, '★★★★★', 24, 24, 16, C.gold);
    IR(card, r.q, 24, 54, 14, C.mid, { w:cw-48, lh:22 });
    mkRect(card, 24, 210, cw-48, 1, C.border);
    IB(card, r.n, 24, 224, 14, C.dark);
    IR(card, r.l, 24, 246, 13, C.light);
    f.appendChild(card);
  });
  return f;
}

// ---- 7. BOOKING ----
function buildBooking(y) {
  const f = mkFrame('7 · Booking', W, 780, C.greenD);
  f.x = 0; f.y = y;
  IB(f, 'RESERVATIONS', W/2-90, 60, 12, C.mutedGreen, { w:180, align:'CENTER', ls:3 });
  PB(f, 'Book Your Tour', W/2-230, 84, 40, C.white, { w:460, align:'CENTER' });
  IR(f, "Complete the form below and we'll confirm your booking within 2 hours.",
    W/2-260, 144, 16, C.mutedGreen, { w:520, align:'CENTER' });
  const form = mkFrame('Form Card', 820, 536, C.white, 16);
  shadow(form, 0.18, 12, 48);
  form.x = W/2-410; form.y = 192;
  var fields = [
    { l:'Select Tour *',      x:40,  y:36  },
    { l:'Preferred Date *',   x:440, y:36  },
    { l:'Number of Guests *', x:40,  y:142 },
    { l:'Pick-up Location',   x:440, y:142 },
    { l:'First Name *',       x:40,  y:248 },
    { l:'Last Name *',        x:440, y:248 },
    { l:'Email Address *',    x:40,  y:354 },
    { l:'Phone Number',       x:440, y:354 },
  ];
  fields.forEach(function(fd) {
    IB(form, fd.l, fd.x, fd.y, 13, C.dark);
    var inp = figma.createRectangle();
    inp.name = fd.l; inp.resize(340, 44);
    inp.x = fd.x; inp.y = fd.y+24;
    inp.fills = [];
    inp.strokes = [{ type:'SOLID', color:C.border }];
    inp.strokeWeight = 1.5; inp.cornerRadius = 8;
    form.appendChild(inp);
  });
  mkRect(form, 40, 458, 740, 52, C.green, { radius:8 });
  IB(form, 'Confirm Booking Request', 260, 472, 16, C.white);
  f.appendChild(form);
  return f;
}

// ---- 8. CONTACT ----
function buildContact(y) {
  const f = mkFrame('8 · Contact', W, 580, C.cream);
  f.x = 0; f.y = y;
  IB(f, 'GET IN TOUCH', 120, 76, 12, C.green, { ls:3 });
  PB(f, "We'd Love to\nHear From You", 120, 100, 36, C.dark, { lh:46 });
  IR(f, "Questions about a tour, group bookings, or travel advice in the north-west?\nOur friendly team is here to help.",
    120, 210, 16, C.mid, { w:420, lh:26 });
  var details = [
    ['📞','Phone','+353 74 912 3456'],
    ['✉','Email','hello@northwestscenictours.ie'],
    ['📍','Based in','Letterkenny, Co. Donegal, Ireland'],
    ['🕐','Hours','Mon–Sat: 8am – 7pm'],
  ];
  details.forEach(function(d, i) {
    var iy = 286+i*64;
    mkRect(f, 120, iy, 44, 44, C.green, { radius:10 });
    IR(f, d[0], 130, iy+8, 20, C.white);
    IB(f, d[1].toUpperCase(), 178, iy+2, 11, C.light, { ls:1 });
    IM(f, d[2], 178, iy+20, 15, C.dark);
  });
  const map = mkFrame('Map', 560, 440, C.mutedGreen, 16);
  map.x = 760; map.y = 70;
  IR(map, '🗺', 240, 154, 80, C.green);
  PB(map, 'Letterkenny', 185, 256, 20, C.greenD, { w:190, align:'CENTER' });
  IR(map, 'Co. Donegal, Ireland', 178, 288, 15, C.greenD, { w:204, align:'CENTER' });
  f.appendChild(map);
  return f;
}

// ---- 9. FOOTER ----
function buildFooter(y) {
  const f = mkFrame('9 · Footer', W, 380, C.footerBg);
  f.x = 0; f.y = y;
  mkRect(f, 80, 56, W-160, 1, { r:0.22,g:0.22,b:0.22 });
  IB(f, 'North West Scenic Tours', 80, 76, 17, C.white);
  IR(f, "Ireland's Premier North West Tour Operator since 2012.\nGuided by locals who love every mile.",
    80, 108, 14, C.footerFg, { w:320, lh:22 });
  var cols = [
    { t:'Tours',   items:['Wild Atlantic Way',"Giant's Causeway",'Donegal Highlands','Sligo & Yeats','Private Tours'], x:500 },
    { t:'Company', items:['About Us','Reviews','Contact','FAQs','Gift Vouchers'], x:720 },
    { t:'Legal',   items:['Terms & Conditions','Privacy Policy','Cookie Policy','Cancellation Policy'], x:960 },
  ];
  cols.forEach(function(col) {
    IB(f, col.t.toUpperCase(), col.x, 76, 11, C.white, { ls:2 });
    col.items.forEach(function(item, i) {
      IR(f, item, col.x, 108+i*30, 14, C.footerFg);
    });
  });
  mkRect(f, 0, 334, W, 1, { r:0.20,g:0.20,b:0.20 });
  IR(f, '© 2024 North West Scenic Tours Ltd. Registered in Ireland. All rights reserved.',
    W/2-296, 350, 13, { r:0.35,g:0.35,b:0.35 }, { w:592, align:'CENTER' });
  return f;
}

// ================================================================
//  MAIN
// ================================================================
async function main() {
  figma.notify('Building landing page…', { timeout: 15000 });

  // Load fonts with fallbacks
  async function tryFont(family, style) {
    try { await figma.loadFontAsync({ family, style }); return true; }
    catch(e) { return false; }
  }

  await tryFont('Inter', 'Regular');
  await tryFont('Inter', 'Medium');
  await tryFont('Inter', 'Bold');

  const hasPD = await tryFont('Playfair Display', 'Bold');
  if (!hasPD) {
    const hasG = await tryFont('Georgia', 'Bold');
    HF = hasG ? 'Georgia' : 'Inter';
    await tryFont(HF, 'Regular');
  } else {
    await tryFont('Playfair Display', 'Regular');
  }

  figma.currentPage.name = 'North West Scenic Tours';

  // Delete the test rectangle if it exists
  figma.currentPage.children.forEach(function(n) {
    if (n.name === 'NWST Test Rect' || n.name === 'North West Scenic Tours ✓') n.remove();
  });

  var y = 0;
  var sections = [];

  function add(fn) {
    try {
      var s = fn(y);
      figma.currentPage.appendChild(s);
      sections.push(s);
      y += s.height;
    } catch(e) {
      figma.notify('Error in ' + fn.name + ': ' + e.message, { error: true });
      throw e;
    }
  }

  add(buildNav);
  add(buildHero);
  add(buildStats);
  add(buildTours);
  add(buildWhy);
  add(buildTestimonials);
  add(buildBooking);
  add(buildContact);
  add(buildFooter);

  figma.viewport.scrollAndZoomIntoView(sections);
  figma.notify('✅ Landing page created! 9 sections.', { timeout: 5000 });
}

main()
  .then(function() { figma.closePlugin(); })
  .catch(function(err) {
    figma.notify('❌ ' + err.message, { error: true });
    figma.closePlugin();
  });
