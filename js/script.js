// Menu mobile
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu au clic sur un lien
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Bouton CTA
const ctaBtn = document.getElementById('ctaBtn');

ctaBtn.addEventListener('click', () => {
  document.getElementById('apropos').scrollIntoView({ behavior: 'smooth' });
});

// Formulaire de contact
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  console.log('Message envoyé :', data);
  alert(`Merci ${data.nom} ! Ton message a bien été reçu.`);

  contactForm.reset();
});
