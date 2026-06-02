// ============================================================
//  EmailJS Configuration
//  1. Sign up free at https://emailjs.com
//  2. Add an Email Service (connect your Gmail)
//  3. Create an Email Template (see instructions below)
//  4. Replace the three values below with your own
// ============================================================

const EMAIL_CONFIG = {
  publicKey:              'YOUR_PUBLIC_KEY',              // Account → API Keys
  serviceId:              'YOUR_SERVICE_ID',              // Email Services → Service ID
  templateId:             'YOUR_TEMPLATE_ID',             // Admin notification template
  confirmationTemplateId: 'YOUR_CONFIRMATION_TEMPLATE_ID', // Customer confirmation template
};

// ---- Admin Notification Template (templateId) ----
// To:      {{to_email}}   (chrisgrafix77@gmail.com)
// CC:      {{cc_email}}   (info@tourwith.me)
// Subject: New Booking Request — {{tour}}
// Variables: {{tour}} {{date}} {{guests}} {{pickup}}
//            {{first_name}} {{last_name}} {{email}} {{phone}}
//            {{notes}} {{total_price}}

// ---- Customer Confirmation Template (confirmationTemplateId) ----
// To:      {{to_email}}   (customer's email address)
// Subject: Your booking request — {{tour}}
// Variables: {{customer_name}} {{tour}} {{date}} {{guests}} {{total_price}}
