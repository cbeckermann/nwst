// Read tour ID from URL ?id=wild-atlantic
const params = new URLSearchParams(window.location.search);
const tourId  = params.get('id');
const tour    = TOURS[tourId];

if (!tour) {
  window.location.href = 'index.html#tours';
}

// ---- Populate page ----
document.title = tour.name + ' — North West Scenic Tours';

// Hero
document.getElementById('tourHeroBg').style.backgroundImage = `url('${tour.image}')`;
document.getElementById('tourEyebrow').textContent = tour.eyebrow;
document.getElementById('tourTitle').textContent   = tour.name;

const chipData = [
  { icon: '⏱', label: tour.duration },
  { icon: '👥', label: tour.groupSize },
  { icon: '🚀', label: tour.type },
  { icon: '🥾', label: tour.difficulty },
];
document.getElementById('tourChips').innerHTML = chipData
  .map(c => `<span class="tour-chip tour-chip--light">${c.icon} ${c.label}</span>`)
  .join('');

// Sticky bar
document.getElementById('barPrice').textContent     = `€${tour.price}`;
document.getElementById('barPriceLabel').textContent = tour.priceLabel;
document.getElementById('barChips').innerHTML = chipData
  .map(c => `<span class="tour-chip">${c.icon} ${c.label}</span>`)
  .join('');

// Sidebar
document.getElementById('sidePrice').textContent     = `€${tour.price}`;
document.getElementById('sidePriceLabel').textContent = tour.priceLabel;
document.getElementById('sideDetails').innerHTML = chipData
  .map(c => `<li>${c.icon} <strong>${c.icon === '⏱' ? 'Duration' : c.icon === '👥' ? 'Group size' : c.icon === '🚀' ? 'Tour type' : 'Difficulty'}:</strong> ${c.label}</li>`)
  .join('');

// Description
document.getElementById('tourDesc').textContent      = tour.desc;
document.getElementById('tourDescExtra').textContent = tour.descExtra;

// Highlights
document.getElementById('tourHighlights').innerHTML = tour.highlights
  .map(h => `<li>${h}</li>`).join('');

// Itinerary
document.getElementById('tourItinerary').innerHTML = tour.itinerary
  .map(s => `
    <div class="tour-itinerary__step">
      <div class="tour-itinerary__time">${s.time}</div>
      <div class="tour-itinerary__dot"></div>
      <div class="tour-itinerary__content">
        <strong>${s.title}</strong>
        <p>${s.desc}</p>
      </div>
    </div>
  `).join('');

// Included / excluded
document.getElementById('tourIncluded').innerHTML = tour.included
  .map(i => `<li>${i}</li>`).join('');
document.getElementById('tourExcluded').innerHTML = tour.excluded
  .map(e => `<li>${e}</li>`).join('');

// Gallery
document.getElementById('tourGallery').innerHTML = tour.gallery
  .map(src => `<div class="tour-gallery__img" style="background-image:url('${src}')"></div>`)
  .join('');

// Booking form pre-fill
document.getElementById('tourSelect').value = tour.name;
const dateInput = document.getElementById('tourDate');
const today = new Date();
dateInput.min = today.toISOString().split('T')[0];

// Related tours (3 others)
const related = Object.values(TOURS).filter(t => t.id !== tourId).slice(0, 3);
document.getElementById('relatedGrid').innerHTML = related.map(t => `
  <article class="tour-card" onclick="window.location='tour.html?id=${t.id}'" style="cursor:pointer">
    <div class="tour-card__img" style="background-image:url('${t.image}')"></div>
    ${t.badge ? `<div class="tour-card__badge">${t.badge}</div>` : ''}
    <div class="tour-card__body">
      <div class="tour-card__meta">
        <span>⏱ ${t.duration}</span>
        <span>👥 ${t.groupSize}</span>
      </div>
      <h3>${t.name}</h3>
      <p>${t.desc.slice(0, 100)}…</p>
      <div class="tour-card__footer">
        <div class="tour-card__price"><span>From</span> €${t.price} <small>${t.priceLabel}</small></div>
        <a href="tour.html?id=${t.id}" class="btn btn--primary">View Tour</a>
      </div>
    </div>
  </article>
`).join('');

// Price calculator
function updatePrice() {
  const guestsVal = document.getElementById('guests').value;
  const summary   = document.getElementById('priceSummary');
  const display   = document.getElementById('priceDisplay');
  if (!guestsVal || guestsVal === '9+') { summary.style.display = 'none'; return; }
  display.textContent = `€${tour.price * parseInt(guestsVal)}`;
  summary.style.display = 'block';
}

// Form submit via EmailJS
function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('[type="submit"]');
  const guests = form.guests.value;
  const total  = (guests && guests !== '9+') ? `€${tour.price * parseInt(guests)}` : 'Contact for quote';

  const templateParams = {
    tour:        tour.name,
    date:        form.date.value,
    guests:      guests,
    pickup:      '',
    first_name:  form.firstName.value,
    last_name:   form.lastName.value,
    email:       form.email.value,
    phone:       form.phone.value,
    notes:       form.notes ? form.notes.value : '',
    total_price: total,
    to_email:    'chrisgrafix77@gmail.com',
    cc_email:    'info@tourwith.me',
  };

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
    .then(function() {
      const toast = document.getElementById('toast');
      toast.textContent = '✓ Booking request sent! We\'ll confirm within 2 hours.';
      toast.style.background = '';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
      form.reset();
      document.getElementById('tourSelect').value = tour.name;
      document.getElementById('priceSummary').style.display = 'none';
    })
    .catch(function(err) {
      console.error('EmailJS error:', err);
      const toast = document.getElementById('toast');
      toast.textContent = '❌ Something went wrong. Please call us on +353 74 912 3456.';
      toast.style.background = '#cc3333';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    })
    .finally(function() {
      submitBtn.textContent = 'Confirm Booking Request';
      submitBtn.disabled = false;
    });
}

// Sticky bar scroll
const bar = document.querySelector('.tour-bar');
const hero = document.getElementById('tourHero');
window.addEventListener('scroll', () => {
  bar.classList.toggle('tour-bar--visible', window.scrollY > hero.offsetHeight - 80);
});

// Mobile menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}
