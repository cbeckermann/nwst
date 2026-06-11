function initSaturdayPicker(inputId, onSelect) {
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
    locale: { firstDayOfWeek: 1 },
    onChange: function(selectedDates, dateStr) {
      if (onSelect && selectedDates.length) {
        const d = selectedDates[0];
        const iso = d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
        onSelect(dateStr, iso);
      }
    }
  });
}
