function updateDateTime() {
  const dateElements = document.querySelectorAll('.current-date');
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  dateElements.forEach(element => {
    element.textContent = new Date().toLocaleDateString('en-US', options);
  });
}
updateDateTime();
setInterval(updateDateTime, 1000); 