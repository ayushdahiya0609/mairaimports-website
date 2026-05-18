// ═══════════════════════════════════════════
//  MAIRA IMPORTS — main.js
// ═══════════════════════════════════════════

// ─── Header scroll effect ───
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Mobile nav toggle ───
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Close mobile nav on link click
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ─── Back to top ───
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Active nav link on scroll ───
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#mainNav a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`#mainNav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4, rootMargin: '-72px 0px 0px 0px' });

sections.forEach(s => observer.observe(s));

// ─── Contact form ───
const form    = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showMsg('Please fill in all required fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMsg('Please enter a valid email address.', 'error');
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formspree.io/f/xjgzvpwo', {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     name,
        email:    email,
        business: form.business.value.trim(),
        phone:    form.phone.value.trim(),
        category: form.category.value,
        message:  message,
      }),
    });

    if (res.ok) {
      showMsg('Thank you! Your enquiry has been sent. We will get back to you shortly.', 'success');
      form.reset();
    } else {
      const data = await res.json();
      const errText = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
      showMsg(errText, 'error');
    }
  } catch {
    showMsg('Network error — please check your connection and try again.', 'error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Enquiry';
  }
});

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className   = `form-msg ${type}`;
  formMsg.hidden      = false;
  setTimeout(() => { formMsg.hidden = true; }, 8000);
}

// ─── Animate elements on scroll ───
const animEls = document.querySelectorAll(
  '.product-card, .why-card, .pillar, .location-card, .about-card-secondary'
);
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  fadeObserver.observe(el);
});
