// ============================================================
//  EmailJS Configuration
//  1. Sign up free at https://emailjs.com
//  2. Add an Email Service (connect your Gmail)
//  3. Create an Email Template (see instructions below)
//  4. Replace the three values below with your own
// ============================================================

const EMAIL_CONFIG = {
  publicKey:  'YOUR_PUBLIC_KEY',    // Account → API Keys
  serviceId:  'YOUR_SERVICE_ID',    // Email Services → Service ID
  templateId: 'YOUR_TEMPLATE_ID',   // Email Templates → Template ID
};

// ---- EmailJS Template Variables (use these in your template) ----
// {{tour}}         — Tour name
// {{date}}         — Preferred date
// {{guests}}       — Number of guests
// {{pickup}}       — Pick-up location
// {{first_name}}   — First name
// {{last_name}}    — Last name
// {{email}}        — Customer email
// {{phone}}        — Phone number
// {{notes}}        — Special requests
// {{total_price}}  — Estimated total price
//
// ---- Recommended Template Setup ----
// To:      chrisgrafix77@gmail.com
// CC:      info@tourwith.me
// Subject: New Booking Request — {{tour}}
// Body:    (use the variables above to build your email body)
