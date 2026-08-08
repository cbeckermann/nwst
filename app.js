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

// Tour-day picker (Fri/Sat/Sun) with availability check
initSaturdayPicker('tourDate', onDateSelected);

const MAX_GUESTS = 14;
let selectedDateISO = '';
let selectedDateAvailable = MAX_GUESTS;

async function onDateSelected(dateStr, isoStr) {
  selectedDateISO = isoStr;
  const availEl = document.getElementById('availabilityMsg');
  availEl.textContent = 'Checking availability…';
  availEl.className = 'availability-msg';

  try {
    const res = await fetch(`/.netlify/functions/check-availability?date=${isoStr}`);
    const data = await res.json();
    selectedDateAvailable = data.available;

    if (data.full) {
      availEl.textContent = `This date is fully booked (${MAX_GUESTS}/${MAX_GUESTS} guests). Please choose another date.`;
      availEl.className = 'availability-msg availability-msg--full';
    } else {
      availEl.textContent = `${data.available} of ${MAX_GUESTS} spots remaining on this date.`;
      availEl.className = 'availability-msg availability-msg--ok';
    }
  } catch {
    availEl.textContent = '';
  }
  updatePrice();
}

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

// Form submission via Netlify Function
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const guestsVal = document.getElementById('guests').value;
  const guestCount = parseInt(guestsVal);

  if (!selectedDateISO) {
    showFormError('Please select a date.');
    return;
  }
  if (guestCount > selectedDateAvailable) {
    showFormError(`Only ${selectedDateAvailable} spot${selectedDateAvailable === 1 ? '' : 's'} available on this date.`);
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting…';

  const tourVal = document.getElementById('tourSelect').value;
  const dialCode = document.getElementById('phoneDial').value;
  const phoneNum = document.getElementById('phoneNumber').value;

  const payload = {
    date: selectedDateISO,
    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim(),
    email: document.getElementById('email').value,
    phone: phoneNum ? `${dialCode} ${phoneNum}` : '',
    guests: guestCount,
    pickup: document.getElementById('pickup').value,
    notes: document.getElementById('notes').value,
    tour: tourVal.split('|')[0]
  };

  try {
    const res = await fetch('/.netlify/functions/submit-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok && data.success) {
      window.location.href = '/thankyou.html';
    } else {
      showFormError(data.message || data.error || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Confirm Booking Request';
    }
  } catch {
    showFormError('Network error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Confirm Booking Request';
  }
});

function showFormError(msg) {
  let el = document.getElementById('formError');
  if (!el) {
    el = document.createElement('p');
    el.id = 'formError';
    el.className = 'form-error';
    document.querySelector('.booking-form__actions').prepend(el);
  }
  el.textContent = msg;
}

// Modal
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
