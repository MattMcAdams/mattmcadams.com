module.exports = {
  isOlderThan (date, years) {
    const today = new Date();
    const cutoff = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    return date < cutoff;
  },
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  },
};
