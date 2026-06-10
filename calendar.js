function initSaturdayPicker(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  flatpickr(input, {
    disable: [
      function(date) { return date.getDay() !== 6; }
    ],
    minDate: today,
    dateFormat: 'D, d M Y',
    disableMobile: false,
    locale: { firstDayOfWeek: 1 }
  });
}
