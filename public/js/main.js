// basic client interactions
document.addEventListener('DOMContentLoaded', () => {
    // year in footer
    const y = new Date().getFullYear();
    ['year','year2','year3','year4'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = y;
    });
  
    // mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    navToggle && navToggle.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      if(nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  
    // contact form handling (AJAX)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const resetBtn = document.getElementById('resetBtn');
  
    if(contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = 'Sending...';
  
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
  
        try {
          const res = await fetch(contactForm.action, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
          });
          if(res.ok){
            formMessage.textContent = 'Thanks — your enquiry has been received. We will contact you shortly (WhatsApp/email).';
            contactForm.reset();
          } else {
            const txt = await res.text();
            formMessage.textContent = 'Sorry, there was a problem sending your enquiry. ' + (txt || '');
          }
        } catch(err){
          formMessage.textContent = 'Network error: could not send enquiry. Try again or email hello@easyroute.com';
          console.error(err);
        }
      });
  
      resetBtn && resetBtn.addEventListener('click', ()=> contactForm.reset());
    }
  });
  