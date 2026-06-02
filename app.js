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

// Form submission via EmailJS
function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('[type="submit"]');

  const tourVal   = form.tour.value;
  const tourName  = tourVal.includes('|') ? tourVal.split('|')[0] : tourVal;
  const price     = tourVal.includes('|') ? parseInt(tourVal.split('|')[1]) : 0;
  const guests    = form.guests.value;
  const total     = (guests && guests !== '9+') ? `€${price * parseInt(guests)}` : 'Contact for quote';

  const templateParams = {
    tour:        tourName,
    date:        form.date.value,
    guests:      guests,
    pickup:      form.pickup ? form.pickup.value : '',
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

  const confirmationParams = {
    to_email:      form.email.value,
    customer_name: form.firstName.value,
    tour:          tourName,
    date:          form.date.value,
    guests:        guests,
    total_price:   total,
  };

  emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
    .then(function() {
      return emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.confirmationTemplateId, confirmationParams);
    })
    .then(function() {
      showToast('success');
      form.reset();
      document.getElementById('priceSummary').style.display = 'none';
    })
    .catch(function(err) {
      console.error('EmailJS error:', err);
      showToast('error');
    })
    .finally(function() {
      submitBtn.textContent = 'Confirm Booking Request';
      submitBtn.disabled = false;
    });
}

function showToast(type) {
  const toast = document.getElementById('toast');
  if (type === 'error') {
    toast.textContent = '❌ Something went wrong. Please call us on +353 74 912 3456.';
    toast.style.background = '#cc3333';
  } else {
    toast.textContent = '✓ Booking request sent! We\'ll confirm within 2 hours.';
    toast.style.background = '';
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
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
