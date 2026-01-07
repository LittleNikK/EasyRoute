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
 const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");
const noReviews = document.getElementById("noReviews"); // optional placeholder
const reviewLayout = document.getElementById("reviewLayout"); // optional centering

const API_BASE =
  "https://script.google.com/macros/s/AKfycbwouEQQ5aK5sLXm98FgELDvow9P0g1_SI_mlhoW2BKPBM8eLnuV0ZjnqzlYkxc2f1mKjg/exec";

/* ===========================
   STAR RENDER
=========================== */
function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

/* ===========================
   FETCH REVIEWS
=========================== */
let currentPage = 1;
const limit = 5;

const loadMoreBtn = document.getElementById("loadMoreBtn");

/* ===========================
   FETCH REVIEWS (PAGINATED)
=========================== */
async function fetchReviews(reset = false) {
  try {
    if (reset) {
      currentPage = 1;
      reviewList.innerHTML = "";
    }

    const res = await fetch(
      `${API_BASE}?page=${currentPage}&limit=${limit}`
    );

    if (!res.ok) throw new Error("Failed to fetch reviews");

    const { reviews, total } = await res.json();

    if (!reviews.length && currentPage === 1) {
      noReviews.style.display = "block";
      loadMoreBtn.classList.add("hidden");
      return;
    }

    noReviews.style.display = "none";

    reviews.forEach(review => {
      const card = document.createElement("div");
      card.className =
        "review-card bg-white border border-gray-100 shadow-sm rounded-xl p-4";

      card.innerHTML = `
        <div class="flex justify-between items-center mb-1">
          <h4 class="font-medium text-gray-800 text-sm">${review.name}</h4>
          <span class="text-yellow-400 text-xs">
            ${renderStars(Number(review.rating))}
          </span>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">
          ${review.text}
        </p>
      `;

      reviewList.appendChild(card);
    });

    // GSAP animation
    document.dispatchEvent(new Event("reviewsLoaded"));

    // Show / hide Load More
    const shown = currentPage * limit;
    if (shown < total) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }

  } catch (err) {
    console.error(err);
  }
}


/* ===========================
   SUBMIT REVIEW
=========================== */
reviewForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const name = reviewName.value.trim();
  const rating = Number(reviewRating.value);
  const text = reviewText.value.trim();

  if (!name || !rating || !text) return;

  const reviewData = { name, rating, text };

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      body: JSON.stringify(reviewData) // ❗ no headers (CORS safe)
    });

    const result = await res.json();
    if (!result.success) throw new Error("Submit failed");

    reviewForm.reset();
    fetchReviews(); // refresh list

  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});
loadMoreBtn?.addEventListener("click", () => {
  currentPage++;
  fetchReviews();
});


/* ===========================
   LOAD ON PAGE START
=========================== */
document.addEventListener("DOMContentLoaded", fetchReviews);

