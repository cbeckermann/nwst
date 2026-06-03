// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Set minimum date to today
const dateInput = document.getElementById('tourDate');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
dateInput.min = `${yyyy}-${mm}-${dd}`;

// Price calculator
function updatePrice() {
  const tourVal = document.getElementById('tourSelect').value;
  const guestsVal = document.getElementById('guests').value;
  const summary = document.getElementById('priceSummary');
  const display = document.getElementById('priceDisplay');

  if (!tourVal || !guestsVal || guestsVal === '9+') {
    summary.style.display = 'none';
    return;
  }

  const price = parseInt(tourVal.split('|')[1]);
  const guests = parseInt(guestsVal);
  const total = price * guests;

  display.textContent = `€${total.toLocaleString()}`;
  summary.style.display = 'block';
}

// Pre-select tour from card buttons
function openBooking(tourName, price) {
  const select = document.getElementById('tourSelect');
  for (const opt of select.options) {
    if (opt.value.startsWith(tourName)) {
      select.value = opt.value;
      break;
    }
  }
  updatePrice();
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// Modal (quick scroll helper)
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById('bookingModal').classList.remove('active');
}

// Animate tour cards on scroll
const cards = document.querySelectorAll('.tour-card, .testimonial');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(card);
});
