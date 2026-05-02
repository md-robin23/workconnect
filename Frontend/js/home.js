import { postAJob, getAllJobs, getAllWorkers, registerWorker, updateWorkerProfile, getUserPosts, getUserReviews, getMyWorkerProfile, updateWorkerStatus, submitReview, getWorkerReviews, getUserReviewForWorker, deleteReview } from "./api.js";

// =============================================
// DOM ELEMENT CACHE
// =============================================
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay') || document.createElement('div');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const navLinks = document.querySelectorAll('.nav-link');
const sidebarItems = document.querySelectorAll(".category-btn");
const becomeWorkerSidebar = document.getElementById('becomeWorkerSidebar');
const jobPost = document.getElementById("postJobBtn");
const homeContainer = document.querySelector('.homeContainer');
const toggle = document.getElementById('toggleBtn');
const titleSection = document.querySelector('.title');
const busyToggleContainer = document.getElementById('busyToggleContainer');

// Modal elements
const modal = document.getElementById('modalContainer');
const workerModal = document.getElementById('workerModalContainer');
const reviewModal = document.getElementById('reviewModalContainer');
const reviewsDisplayModal = document.getElementById('reviewsDisplayModalContainer');
const modalClosed = document.querySelector('.close-btn');
const workerCloseBtn = document.querySelector('.worker-close-btn');
const reviewCloseBtn = document.querySelector('.review-close-btn');
const reviewsDisplayCloseBtn = document.querySelector('.reviews-display-close-btn');
const jobForm = document.querySelector('.modalContainer form');

// =============================================
// INJECT ENHANCED STYLES
// =============================================
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Worker Cards ── */
    .workerCard {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: var(--color-bg, #fff);
      border: 0.5px solid #e5e7eb;
      border-radius: 14px;
      padding: 20px;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .workerCard::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: #e85d2f;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .workerCard:hover {
      box-shadow: 0 6px 20px rgba(232, 93, 47, 0.10);
      border-color: rgba(232, 93, 47, 0.30);
    }
    .workerCard:hover::before {
      opacity: 1;
    }

    /* ── Job Cards ── */
    .jobCard {
      display: flex;
      flex-direction: column;
      background: var(--color-bg, #fff);
      border: 0.5px solid #e5e7eb;
      border-radius: 14px;
      padding: 20px;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .jobCard:hover {
      box-shadow: 0 6px 20px rgba(232, 93, 47, 0.10);
      border-color: rgba(232, 93, 47, 0.30);
    }

    /* ── Skill tags ── */
    .skill-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      background: #faece7;
      color: #993c1d;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 0.2px;
    }

    /* ── Availability badges ── */
    .badge-available {
      background: #d1fae5;
      color: #065f46;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.4px;
    }
    .badge-busy {
      background: #faece7;
      color: #993c1d;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.4px;
    }

    /* ── Stat divider ── */
    .stat-vdivider {
      width: 0.5px;
      height: 28px;
      background: #e5e7eb;
      flex-shrink: 0;
    }

    /* ── Worker action buttons ── */
    .btn-review {
      flex: 1;
      padding: 9px 12px;
      background: #e85d2f;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn-review:hover { background: #cf4e24; }
    .btn-review:active { transform: scale(0.98); }

    .btn-view-reviews {
      flex: 1;
      padding: 9px 12px;
      background: transparent;
      color: #555;
      border: 0.5px solid #d1d5db;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .btn-view-reviews:hover {
      background: #f9fafb;
      border-color: #e85d2f;
      color: #e85d2f;
    }

    /* ── Copy phone feedback ── */
    .copy-phone { cursor: pointer; transition: opacity 0.15s; }
    .copy-phone:hover { opacity: 0.75; }

    /* ── Worker avatar ring on hover ── */
    .workerAvatar {
      transition: box-shadow 0.2s ease;
    }
    .workerCard:hover .workerAvatar {
      box-shadow: 0 0 0 3px rgba(232, 93, 47, 0.25) !important;
    }

    /* ── Rating stars ── */
    .star-filled { color: #f59e0b; }
    .star-empty  { color: #d1d5db; }

    /* ── Post card ── */
    .postCard {
      display: flex;
      flex-direction: column;
      background: var(--color-bg, #fff);
      border: 0.5px solid #e5e7eb;
      border-left: 3px solid #e85d2f;
      border-radius: 14px;
      padding: 20px;
      transition: box-shadow 0.2s ease;
    }
    .postCard:hover {
      box-shadow: 0 6px 20px rgba(232, 93, 47, 0.08);
    }

    /* ── Loading skeleton ── */
    @keyframes shimmer {
      0%   { background-position: -700px 0; }
      100% { background-position: 700px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 700px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
    }
  `;
  document.head.appendChild(style);
})();

// =============================================
// SIDEBAR MOBILE FUNCTIONALITY
// =============================================
function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (!link.parentElement.classList.contains('category-btn')) {
      closeSidebar();
    }
  });
});

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Renders star HTML for a given rating (1–5)
 */
function renderStars(rating, size = '14px') {
  return [1, 2, 3, 4, 5]
    .map(i => `<span style="font-size:${size}; color:${i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'};">★</span>`)
    .join('');
}

/**
 * COPY TO CLIPBOARD
 */
function copyToClipboard(text, element) {
  const phoneSpan = element.querySelector('.phone-number') || element;
  const originalHTML = phoneSpan.innerHTML;
  const originalColor = phoneSpan.style.color;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      phoneSpan.textContent = '✓ Copied!';
      phoneSpan.style.color = '#10b981';
      phoneSpan.style.fontWeight = 'bold';
      setTimeout(() => {
        phoneSpan.innerHTML = originalHTML;
        phoneSpan.style.color = originalColor;
        phoneSpan.style.fontWeight = '';
      }, 2000);
    }).catch(err => fallbackCopy(text, phoneSpan, originalHTML, originalColor));
  } else {
    fallbackCopy(text, phoneSpan, originalHTML, originalColor);
  }
}

function fallbackCopy(text, element, originalHTML, originalColor) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    element.textContent = '✓ Copied!';
    element.style.color = '#10b981';
    element.style.fontWeight = 'bold';
    setTimeout(() => {
      element.innerHTML = originalHTML;
      element.style.color = originalColor;
      element.style.fontWeight = '';
    }, 2000);
  } catch (err) {
    console.error('Fallback copy failed:', err);
  } finally {
    document.body.removeChild(textarea);
  }
}

// =============================================
// MODAL HELPERS
// =============================================
function openJobModal() {
  if (modal) {
    modal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');
  }
}

function closeJobModal() {
  if (modal) {
    modal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

function populateWorkerForm(profile) {
  if (!profile) return;
  const workerNameInput = document.getElementById('workerName');
  const workerBioInput = document.getElementById('workerBio');
  const workerHourlyRateInput = document.getElementById('workerHourlyRate');
  const workerLocationsInput = document.getElementById('workerLocations');
  const workerPhoneInput = document.getElementById('workerPhoneNumber');

  if (workerNameInput) workerNameInput.value = profile.name || '';
  if (workerBioInput) workerBioInput.value = profile.bio || '';
  if (workerHourlyRateInput) workerHourlyRateInput.value = profile.hourly_rate || '';
  if (workerLocationsInput) workerLocationsInput.value = Array.isArray(profile.locations) ? profile.locations.join(', ') : profile.locations || '';
  if (workerPhoneInput) workerPhoneInput.value = profile.phone_number || '';

  const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
  skillCheckboxes.forEach(checkbox => {
    checkbox.checked = Array.isArray(profile.skills) && profile.skills.includes(checkbox.value);
  });
}

function openWorkerModal(editMode = false) {
  if (workerModal) {
    workerModal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');

    const workerFormElement = document.getElementById('workerForm');
    const modalTitle = workerModal.querySelector('.modal-header h2');
    const submitBtn = workerFormElement?.querySelector('button[type="submit"]');

    if (workerFormElement) workerFormElement.reset();
    if (modalTitle) modalTitle.textContent = editMode ? 'Update Worker Info' : 'Become a Worker';
    if (submitBtn) submitBtn.textContent = editMode ? 'Save Changes →' : 'Register as Worker →';

    if (editMode && currentWorkerProfile) {
      populateWorkerForm(currentWorkerProfile);
    }
  }
}

function closeWorkerModal() {
  if (workerModal) {
    workerModal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

// =============================================
// OPEN REVIEW MODAL — FIXED
// Previously silently blocked modal when user had no job posts.
// Now opens freely; backend handles review validation.
// =============================================
async function openReviewModal(workerId) {
  if (!reviewModal) return;

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login.html';
    return;
  }

  try {
    const [existingReview, workerReviewStats] = await Promise.all([
      getUserReviewForWorker(workerId),
      getWorkerReviews(workerId)
    ]);

    const reviewFormElement = document.getElementById('reviewForm');
    if (reviewFormElement) reviewFormElement.reset();

    document.getElementById('reviewWorkerId').value = workerId;

    const ratingSelect = document.getElementById('reviewRatingInput');
    const reviewerNameInput = document.getElementById('reviewerNameInput');

    if (reviewerNameInput) reviewerNameInput.value = existingReview?.reviewerName || '';
    if (ratingSelect) ratingSelect.value = existingReview ? String(existingReview.rating) : '';

    document.getElementById('selectedRatingDisplay').textContent =
      existingReview ? `You selected ${existingReview.rating}` : 'Select a rating';
    document.getElementById('charCount').textContent = existingReview?.comment?.length || 0;

    if (existingReview?.comment) {
      const commentField = document.getElementById('reviewComment');
      if (commentField) commentField.value = existingReview.comment;
    }

    const averageSummary = document.getElementById('reviewWorkerRatingSummary');
    if (averageSummary && workerReviewStats) {
      const avg = parseFloat(workerReviewStats.averageRating) || 0;
      averageSummary.textContent = `Average Rating: ${avg.toFixed(1)} (${workerReviewStats.totalReviews} review${workerReviewStats.totalReviews !== 1 ? 's' : ''})`;
    }

    reviewModal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');
  } catch (error) {
    console.error('Error preparing review modal:', error);
  }
}

function closeReviewModal() {
  if (reviewModal) {
    reviewModal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
    document.getElementById('reviewForm').reset();
    document.getElementById('selectedRatingDisplay').textContent = 'Select a rating';
    document.getElementById('charCount').textContent = '0';
  }
}

async function openReviewsDisplayModal(workerId, workerName) {
  if (reviewsDisplayModal) {
    document.getElementById('reviewsWorkerName').textContent = `${workerName}'s Reviews`;
    reviewsDisplayModal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');

    try {
      const reviewsData = await getWorkerReviews(workerId);
      displayReviews(reviewsData);
    } catch (error) {
      document.getElementById('reviewsList').innerHTML =
        `<p style="color:#e85d2f; text-align:center; padding:20px;">Error loading reviews: ${error.message}</p>`;
    }
  }
}

function closeReviewsDisplayModal() {
  if (reviewsDisplayModal) {
    reviewsDisplayModal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

function displayReviews(reviewsData) {
  const reviewsList = document.getElementById('reviewsList');
  const { reviews, averageRating, totalReviews } = reviewsData;

  if (totalReviews === 0) {
    reviewsList.innerHTML = `
      <div style="text-align:center; padding:48px 20px;">
        <div style="font-size:36px; margin-bottom:12px;">📋</div>
        <p style="color:#888; font-size:1rem;">No reviews yet for this worker.</p>
        <p style="color:#aaa; font-size:0.85rem; margin-top:6px;">Be the first to leave a review!</p>
      </div>
    `;
    return;
  }

  const avg = parseFloat(averageRating) || 0;
  let html = `
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:24px; padding:16px; background:#fafafa; border-radius:10px; border:0.5px solid #e5e7eb;">
      <div style="text-align:center;">
        <div style="font-size:2.8rem; font-weight:700; color:#e85d2f; line-height:1;">${avg.toFixed(1)}</div>
        <div style="font-size:11px; color:#888; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;">avg rating</div>
      </div>
      <div>
        <div style="display:flex; gap:3px; margin-bottom:6px;">
          ${renderStars(avg, '20px')}
        </div>
        <div style="color:#666; font-size:0.9rem;">${totalReviews} review${totalReviews !== 1 ? 's' : ''}</div>
      </div>
    </div>
  `;

  reviews.forEach(review => {
    const dateString = new Date(review.createdAt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    html += `
      <div style="padding:16px; border:0.5px solid #e5e7eb; border-radius:10px; margin-bottom:10px; transition:border-color 0.15s;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:34px; height:34px; border-radius:50%; background:#faece7; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:#993c1d;">
              ${(review.reviewerName || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight:600; font-size:0.9rem; color:#333;">${review.reviewerName || 'Anonymous'}</div>
              <div style="font-size:0.75rem; color:#aaa; margin-top:1px;">${dateString}</div>
            </div>
          </div>
          <div style="display:flex; gap:2px;">
            ${renderStars(review.rating, '14px')}
          </div>
        </div>
        ${review.comment
        ? `<p style="color:#555; margin:8px 0 0 0; font-size:0.875rem; line-height:1.6; padding-left:44px;">"${review.comment}"</p>`
        : ''}
      </div>
    `;
  });

  reviewsList.innerHTML = html;
}

// Expose functions needed by inline onclick handlers
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.openReviewsDisplayModal = openReviewsDisplayModal;
window.closeReviewsDisplayModal = closeReviewsDisplayModal;
window.copyToClipboard = copyToClipboard;
window.fallbackCopy = fallbackCopy;

// =============================================
// EVENT LISTENERS — POST A JOB
// =============================================
if (jobPost) {
  jobPost.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '../pages/login.html'; return; }
    openJobModal();
  });
} else {
  console.error("Post a Job button (postJobBtn) not found!");
}

if (jobForm) {
  let isSubmitting = false;
  jobForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    const jobData = {
      title: document.querySelector('#jobTitle')?.value || '',
      category: document.querySelector('#category')?.value || '',
      jobPosterName: document.querySelector('#posterName')?.value || '',
      description: document.querySelector('#jobDescription')?.value || '',
      budget: document.querySelector('#budget')?.value || '',
      urgency: document.querySelector('#urgency')?.value || '',
      location: document.querySelector('#location')?.value || '',
      contact: document.querySelector('#telephone')?.value || ''
    };
    try {
      await postAJob(jobData);
      jobForm.reset();
      closeJobModal();
      await renderJobs();
    } catch (error) {
      console.error("Error posting job:", error);
    } finally {
      isSubmitting = false;
    }
  });
} else {
  console.error("Job form not found!");
}

if (modalClosed) {
  modalClosed.addEventListener('click', closeJobModal);
}

const resetButtons = document.querySelectorAll('.reset');
resetButtons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (btn.closest('.modalContainer')) closeJobModal();
    else if (btn.closest('.workerModalContainer')) closeWorkerModal();
    else if (btn.closest('.reviewModalContainer')) closeReviewModal();
  });
});

if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeJobModal();
  });
}

const modalCard = modal?.querySelector('.modal-card');
if (modalCard) modalCard.addEventListener('click', e => e.stopPropagation());

// =============================================
// EVENT LISTENERS — BECOME WORKER
// =============================================
const workerForm = document.querySelector('.workerModalContainer form');

if (workerForm) {
  let isSubmitting = false;
  workerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    const skills = Array.from(skillCheckboxes).map(c => c.value);
    if (skills.length === 0) { isSubmitting = false; return; }

    const workerLocations = document.querySelector('#workerLocations')?.value || '';
    const locations = workerLocations.split(',').map(loc => loc.trim()).filter(Boolean);
    if (locations.length === 0) { isSubmitting = false; return; }

    const workerData = {
      name: document.querySelector('#workerName')?.value || '',
      skills,
      bio: document.querySelector('#workerBio')?.value || '',
      hourly_rate: parseInt(document.querySelector('#workerHourlyRate')?.value) || 0,
      locations,
      phone_number: document.querySelector('#workerPhoneNumber')?.value || ''
    };
    try {
      if (currentWorkerProfile) {
        await updateWorkerProfile(workerData);
      } else {
        await registerWorker(workerData);
      }
      workerForm.reset();
      closeWorkerModal();
      await checkWorkerStatus();
      await renderWorkers();
    } catch (error) {
      console.error("Error saving worker info:", error);
    } finally {
      isSubmitting = false;
    }
  });
} else {
  console.error("Worker form not found!");
}

if (becomeWorkerSidebar) {
  becomeWorkerSidebar.addEventListener("click", function () {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '../pages/login.html'; return; }
    openWorkerModal(!!currentWorkerProfile);
    clearSidebarSelection();
  });
}

if (workerCloseBtn) workerCloseBtn.addEventListener('click', closeWorkerModal);
if (workerModal) {
  workerModal.addEventListener("click", e => { if (e.target === workerModal) closeWorkerModal(); });
}
const workerModalCard = workerModal?.querySelector('.modal-card');
if (workerModalCard) workerModalCard.addEventListener('click', e => e.stopPropagation());

// =============================================
// EVENT LISTENERS — SUBMIT REVIEW
// =============================================
const reviewForm = document.querySelector('#reviewForm');
const ratingSelect = document.getElementById('reviewRatingInput');
const selectedRatingDisplay = document.getElementById('selectedRatingDisplay');
const reviewComment = document.getElementById('reviewComment');
const charCount = document.getElementById('charCount');

if (ratingSelect) {
  ratingSelect.addEventListener('input', function () {
    selectedRatingDisplay.textContent = this.value ? `You selected ${this.value}` : 'Select a rating';
  });
}

if (reviewComment) {
  reviewComment.addEventListener('input', function () {
    charCount.textContent = this.value.length;
  });
}

if (reviewForm) {
  let isSubmitting = false;
  reviewForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    const workerId = document.getElementById('reviewWorkerId').value;
    const reviewerName = document.getElementById('reviewerNameInput')?.value.trim() || '';
    const ratingValue = document.getElementById('reviewRatingInput')?.value;
    const comment = reviewComment.value.trim();

    if (!reviewerName || !ratingValue) { isSubmitting = false; return; }
    const rating = parseFloat(ratingValue);
    if (Number.isNaN(rating) || rating < 1 || rating > 5) { isSubmitting = false; return; }

    try {
      await submitReview(workerId, rating, comment, reviewerName);
      reviewForm.reset();
      closeReviewModal();
      await renderWorkers();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      isSubmitting = false;
    }
  });
} else {
  console.error("Review form not found!");
}

if (reviewCloseBtn) reviewCloseBtn.addEventListener('click', closeReviewModal);
if (reviewsDisplayCloseBtn) reviewsDisplayCloseBtn.addEventListener('click', closeReviewsDisplayModal);

if (reviewModal) {
  reviewModal.addEventListener("click", e => { if (e.target === reviewModal) closeReviewModal(); });
}
if (reviewsDisplayModal) {
  reviewsDisplayModal.addEventListener("click", e => { if (e.target === reviewsDisplayModal) closeReviewsDisplayModal(); });
}

const reviewModalCard = reviewModal?.querySelector('.modal-card');
if (reviewModalCard) reviewModalCard.addEventListener('click', e => e.stopPropagation());

const reviewsDisplayModalCard = reviewsDisplayModal?.querySelector('.modal-card');
if (reviewsDisplayModalCard) reviewsDisplayModalCard.addEventListener('click', e => e.stopPropagation());

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeJobModal();
    closeWorkerModal();
    closeReviewModal();
    closeReviewsDisplayModal();
  }
});

// =============================================
// UTILITY FUNCTIONS
// =============================================
function clearSidebarSelection() {
  sidebarItems.forEach(item => item.classList.remove("active"));
}

function setActiveCategory(category) {
  clearSidebarSelection();
  const activeItem = document.querySelector(`[data-category="${category}"]`);
  if (activeItem) activeItem.classList.add("active");
}

sidebarItems.forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const category = item.getAttribute('data-category');
    setActiveCategory(category);
    closeSidebar();

    if (searchInput) searchInput.value = '';
    currentCategory = category;

    if (category === 'jobs') renderJobs();
    else if (category === 'workers') renderWorkers();
    else if (category === 'mypost') renderMyPost();
  });
});

if (toggle) {
  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
  });
}

// =============================================
// SEARCH
// =============================================
let allJobs = [];
let allWorkers = [];
let currentCategory = 'jobs';

const searchInput = document.querySelector('.title input[type="search"]');

/** Show a login-required message in the card container */
function showLoginPrompt(message = 'Please log in to continue') {
  return `
    <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
      <div style="font-size:40px; margin-bottom:16px;">🔒</div>
      <p style="color:#666; font-size:1.05rem; margin-bottom:20px;">${message}</p>
      <button onclick="window.location.href='../pages/login.html'" style="
        background:#e85d2f; color:white; border:none;
        padding:10px 24px; border-radius:8px; cursor:pointer;
        font-size:0.95rem; font-weight:600;">
        Go to Login
      </button>
    </div>
  `;
}

/** Show a skeleton loading state */
function showSkeletons(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="jobCard" style="gap:12px;">
      <div class="skeleton" style="height:48px; width:48px; border-radius:8px;"></div>
      <div class="skeleton" style="height:18px; width:70%; margin-top:8px;"></div>
      <div class="skeleton" style="height:13px; width:40%;"></div>
      <div class="skeleton" style="height:60px; width:100%;"></div>
      <div class="skeleton" style="height:13px; width:55%;"></div>
    </div>
  `).join('');
}

async function searchAndRenderJobs(searchTerm = '') {
  if (!demoJobContainer) return;
  if (!localStorage.getItem('token')) {
    demoJobContainer.innerHTML = showLoginPrompt('Please log in to view jobs');
    return;
  }

  try {
    if (allJobs.length === 0) {
      demoJobContainer.innerHTML = showSkeletons();
      const response = await getAllJobs();
      allJobs = response.data || [];
    }

    const term = searchTerm.toLowerCase();
    const filtered = allJobs.filter(job =>
      job.title.toLowerCase().includes(term) ||
      job.workCategory.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );

    demoJobContainer.innerHTML = '';

    if (filtered.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">🔍</div>
          <p style="color:#888; font-size:1rem;">No jobs found for "<strong>${searchTerm}</strong>"</p>
        </div>
      `;
      return;
    }

    filtered.forEach(job => demoJobContainer.append(buildJobCard(job)));
  } catch (error) {
    console.error('Error searching jobs:', error);
    demoJobContainer.innerHTML = '<p style="color:#e85d2f; padding:20px;">Error loading jobs.</p>';
  }
}

async function searchAndRenderWorkers(searchTerm = '') {
  if (!demoJobContainer) return;
  if (!localStorage.getItem('token')) {
    demoJobContainer.innerHTML = showLoginPrompt('Please log in to view workers');
    return;
  }

  try {
    if (allWorkers.length === 0) {
      demoJobContainer.innerHTML = showSkeletons();
      const response = await getAllWorkers();
      allWorkers = response.data || [];
    }

    const term = searchTerm.toLowerCase();
    const filtered = allWorkers.filter(worker =>
      Array.isArray(worker.skills)
        ? worker.skills.some(s => s.toLowerCase().includes(term))
        : worker.skills.toLowerCase().includes(term)
    );

    demoJobContainer.innerHTML = '';

    if (filtered.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">🔍</div>
          <p style="color:#888; font-size:1rem;">No workers found for "<strong>${searchTerm}</strong>"</p>
        </div>
      `;
      return;
    }

    filtered.forEach(worker => demoJobContainer.append(buildWorkerCard(worker)));
  } catch (error) {
    console.error('Error searching workers:', error);
    demoJobContainer.innerHTML = '<p style="color:#e85d2f; padding:20px;">Error loading workers.</p>';
  }
}

if (searchInput) {
  searchInput.addEventListener('input', function (e) {
    const term = e.target.value.trim();
    if (currentCategory === 'jobs') searchAndRenderJobs(term);
    else if (currentCategory === 'workers') searchAndRenderWorkers(term);
  });
} else {
  console.error("Search input not found!");
}

// =============================================
// CATEGORY & LETTER METADATA
// =============================================
const catMeta = {
  electrical: { icon: "⚡", bg: "#fff3cd" },
  gardening: { icon: "🌿", bg: "#d1fae5" },
  tutoring: { icon: "📚", bg: "#dbeafe" },
  cleaning: { icon: "🧹", bg: "#ede9fe" },
  plumbing: { icon: "🔧", bg: "#fce7f3" },
  painting: { icon: "🎨", bg: "#ffedd5" },
  moving: { icon: "🚚", bg: "#e0f2fe" },
  tech: { icon: "💻", bg: "#f0fdf4" },
  cooking: { icon: "🍳", bg: "#fef3c7" },
  other: { icon: "🛠", bg: "#f1f5f9" },
};

const letterColors = {
  A: "#ff9a9e", B: "#d4a5e6", C: "#fad0c4", D: "#ffbe9b", E: "#ff8177",
  F: "#84fab0", G: "#a6c0fe", H: "#fccb90", I: "#c4a8f9", J: "#f5576c",
  K: "#4facfe", L: "#43e97b", M: "#fa709a", N: "#30cfd0", O: "#5f2c82",
  P: "#ff9966", Q: "#00c6ff", R: "#7f7fd5", S: "#bb377d", T: "#2193b0",
  U: "#cc2b5e", V: "#ee9ca7", W: "#42275a", X: "#2c3e50", Y: "#de6262",
  Z: "#56ab2f",
};

const demoJobContainer = document.getElementById("demoJobContainer");

// =============================================
// CARD BUILDERS
// =============================================

/**
 * BUILD JOB CARD — returns a DOM element for a single job
 */
function buildJobCard(job) {
  const card = document.createElement("div");
  card.classList.add("jobCard");

  const meta = catMeta[job.workCategory] || catMeta.other;
  const category = job.workCategory.charAt(0).toUpperCase() + job.workCategory.slice(1);
  const urgencyColor = job.urgency === 'urgent' ? '#e85d2f' : job.urgency === 'moderate' ? '#f59e0b' : '#10b981';
  const urgencyBg = job.urgency === 'urgent' ? '#faece7' : job.urgency === 'moderate' ? '#fef3c7' : '#d1fae5';
  const jobDate = new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  card.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
      <span style="background:${meta.bg}; height:44px; width:44px; display:flex; justify-content:center; align-items:center; border-radius:10px; font-size:22px;">${meta.icon}</span>
      <span style="background:${urgencyBg}; color:${urgencyColor}; padding:4px 12px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.5px;">${job.urgency.toUpperCase()}</span>
    </div>
    <h3 style="font-size:1rem; font-weight:600; color:#1a1a1a; margin:0 0 4px 0; line-height:1.3;">${job.title}</h3>
    <p style="font-size:0.8rem; color:#aaa; margin:0 0 10px 0;">Posted by <strong style="color:#888;">${job.jobPosterName}</strong></p>
    <p style="flex-grow:1; margin:0 0 12px 0; font-size:0.875rem; color:#555; line-height:1.6;">
      ${job.description.length > 110 ? job.description.slice(0, 110) + "…" : job.description}
    </p>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <span style="font-size:0.82rem; color:#666;">📍 ${job.location}</span>
      <span style="background:${meta.bg}; color:#555; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;">${category}</span>
    </div>
    <p class="copy-phone" onclick="copyToClipboard('${job.contact}', this)" style="font-size:0.82rem; color:#888; margin:0 0 12px 0; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
      📞 <span class="phone-number" style="font-weight:600; color:#666;">${job.contact}</span>
      <span style="font-size:10px; background:#f1f5f9; padding:2px 7px; border-radius:10px; color:#999;">copy</span>
    </p>
    <div style="border-top:0.5px solid #e5e7eb; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
      <p style="margin:0; font-size:1.05rem; font-weight:700; color:#e85d2f;">৳${job.payment.toLocaleString()}</p>
      <p style="margin:0; font-size:0.78rem; color:#bbb;">${jobDate}</p>
    </div>
  `;
  return card;
}

/**
 * BUILD WORKER CARD — returns a DOM element for a single worker
 */
function buildWorkerCard(worker) {
  const card = document.createElement('div');
  card.classList.add("workerCard");

  const firstLetter = worker.name.charAt(0).toUpperCase();
  const avatarColor = letterColors[firstLetter] || "#e0e7ef";
  const skillsHTML = (Array.isArray(worker.skills) ? worker.skills : [worker.skills])
    .map(s => `<span class="skill-tag">${s}</span>`).join('');
  const avg = parseFloat(worker.averageRating) || 0;
  const totalReviews = worker.totalReviews || 0;
  const locationsText = Array.isArray(worker.locations) ? worker.locations.join(', ') : worker.locations || '';
  const escapedName = worker.name.replace(/'/g, "\\'");

  card.innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; width:100%;">
      <div class="workerAvatar" style="background:${avatarColor}; width:52px; height:52px; border-radius:50%; display:flex; justify-content:center; align-items:center; color:white; font-weight:700; font-size:22px; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.10);">
        ${firstLetter}
      </div>
      <div style="flex:1; min-width:0;">
        <h3 style="margin:0 0 3px 0; font-size:1rem; font-weight:600; color:#1a1a1a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${worker.name}</h3>
        <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px;">
          ${renderStars(avg, '13px')}
          <span style="font-size:12px; color:#888;">${avg.toFixed(1)} · ${totalReviews} review${totalReviews !== 1 ? 's' : ''}</span>
        </div>
        ${locationsText ? `<p style="margin:0; font-size:11px; color:#aaa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">📍 ${locationsText}</p>` : ''}
      </div>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">
      ${skillsHTML}
    </div>

    <p style="margin:0 0 14px 0; font-size:0.85rem; color:#777; line-height:1.55; flex-grow:1;">
      ${worker.bio.length > 90 ? worker.bio.slice(0, 90) + "…" : worker.bio}
    </p>

    <div style="border-top:0.5px solid #e5e7eb; padding-top:12px; width:100%; display:flex; justify-content:space-between; align-items:center; gap:6px;">
      <div style="text-align:center;">
        <p style="margin:0; font-size:1rem; font-weight:700; color:#e85d2f;">৳${worker.hourly_rate}</p>
        <p style="margin:2px 0 0 0; font-size:10px; color:#aaa; letter-spacing:0.3px;">/hour</p>
      </div>
      <div class="stat-vdivider"></div>
      ${worker.isBusy
      ? '<span class="badge-busy">BUSY</span>'
      : '<span class="badge-available">AVAILABLE</span>'}
      <div class="stat-vdivider"></div>
      <div class="copy-phone" onclick="copyToClipboard('${worker.phone_number}', this)" style="text-align:center; cursor:pointer;">
        <p style="margin:0; font-size:14px;">📞</p>
        <p style="margin:2px 0 0 0; font-size:10px; color:#aaa;"><span class="phone-number">${worker.phone_number}</span></p>
      </div>
    </div>

    <div style="display:flex; gap:8px; width:100%; margin-top:12px; border-top:0.5px solid #e5e7eb; padding-top:12px;">
      <button class="btn-review" onclick="openReviewModal('${worker._id}')">
        ⭐ Add Review
      </button>
      <button class="btn-view-reviews" onclick="openReviewsDisplayModal('${worker._id}', '${escapedName}')">
        📋 Reviews
      </button>
    </div>
  `;
  return card;
}

// =============================================
// RENDER FUNCTIONS
// =============================================

async function renderJobs() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = showSkeletons();

  if (!localStorage.getItem('token')) {
    demoJobContainer.innerHTML = showLoginPrompt('Please log in to view jobs');
    return;
  }

  try {
    const response = await getAllJobs();
    allJobs = response.data || [];
    demoJobContainer.innerHTML = '';

    if (allJobs.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">📭</div>
          <p style="color:#888;">No jobs posted yet. Be the first!</p>
        </div>
      `;
      return;
    }

    allJobs.forEach(job => demoJobContainer.append(buildJobCard(job)));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    demoJobContainer.innerHTML = '<p style="color:#e85d2f; padding:20px;">Error loading jobs. Please make sure you are logged in.</p>';
  }
}

async function renderWorkers() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = showSkeletons();

  if (!localStorage.getItem('token')) {
    demoJobContainer.innerHTML = showLoginPrompt('Please log in to view workers');
    return;
  }

  try {
    const response = await getAllWorkers();
    allWorkers = response.data || [];

    // Fetch review stats in parallel
    const workersWithReviews = await Promise.all(allWorkers.map(async worker => {
      try {
        const reviewsData = await getWorkerReviews(worker._id);
        return { ...worker, averageRating: reviewsData.averageRating || 0, totalReviews: reviewsData.totalReviews || 0 };
      } catch {
        return { ...worker, averageRating: 0, totalReviews: 0 };
      }
    }));

    demoJobContainer.innerHTML = '';

    if (workersWithReviews.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">👷</div>
          <p style="color:#888;">No workers registered yet.</p>
        </div>
      `;
      return;
    }

    workersWithReviews.forEach(worker => demoJobContainer.append(buildWorkerCard(worker)));
  } catch (error) {
    console.error('Error fetching workers:', error);
    demoJobContainer.innerHTML = '<p style="color:#e85d2f; padding:20px;">Error loading workers. Please make sure you are logged in.</p>';
  }
}

async function renderMyPost() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = showSkeletons();

  if (!localStorage.getItem('token')) {
    demoJobContainer.innerHTML = showLoginPrompt('Please log in to view your posts');
    return;
  }

  try {
    const response = await getUserPosts();
    const myPosts = response.data || [];
    demoJobContainer.innerHTML = '';

    if (myPosts.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align:center; padding:60px 20px; grid-column:1/-1;">
          <div style="font-size:36px; margin-bottom:12px;">📝</div>
          <p style="color:#888; font-size:1rem;">No posts yet. Start by posting a job!</p>
        </div>
      `;
      return;
    }

    myPosts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.classList.add("postCard");

      const meta = catMeta[post.workCategory] || catMeta.other;
      const jobDate = new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

      postCard.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <span style="background:${meta.bg}; height:44px; width:44px; display:flex; justify-content:center; align-items:center; border-radius:10px; font-size:22px;">${meta.icon}</span>
          <span style="background:#faece7; color:#993c1d; padding:4px 12px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.5px;">${post.urgency?.toUpperCase()}</span>
        </div>
        <h3 style="font-size:1rem; font-weight:600; color:#1a1a1a; margin:0 0 4px 0;">${post.title}</h3>
        <p style="font-size:0.8rem; color:#aaa; margin:0 0 10px 0;">By <strong style="color:#888;">${post.jobPosterName}</strong></p>
        <p style="flex-grow:1; margin:0 0 12px 0; font-size:0.875rem; color:#555; line-height:1.6;">
          ${post.description.length > 110 ? post.description.slice(0, 110) + "…" : post.description}
        </p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:0.82rem; color:#666;">📍 ${post.location}</span>
          <span style="background:${meta.bg}; color:#555; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;">${post.workCategory}</span>
        </div>
        <p class="copy-phone" onclick="copyToClipboard('${post.contact}', this)" style="font-size:0.82rem; color:#888; margin:0 0 12px 0; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          📞 <span class="phone-number" style="font-weight:600; color:#666;">${post.contact}</span>
          <span style="font-size:10px; background:#f1f5f9; padding:2px 7px; border-radius:10px; color:#999;">copy</span>
        </p>
        <div style="border-top:0.5px solid #e5e7eb; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
          <p style="margin:0; font-size:1.05rem; font-weight:700; color:#e85d2f;">৳${post.payment.toLocaleString()}</p>
          <p style="margin:0; font-size:0.78rem; color:#bbb;">${jobDate}</p>
        </div>
      `;
      demoJobContainer.append(postCard);
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    demoJobContainer.innerHTML = `<p style="color:#e85d2f; padding:20px;">Error loading your posts. ${error.message}</p>`;
  }
}

// =============================================
// WORKER STATUS TOGGLE
// =============================================
const becomeWorkerLink = document.getElementById('becomeWorkerSidebar');
const busyToggleItem = document.getElementById('busyToggleItem');
const busyToggle = document.getElementById('busyToggle');
let currentWorkerProfile = null;

async function checkWorkerStatus() {
  try {
    const workerProfile = await getMyWorkerProfile();
    if (workerProfile) {
      currentWorkerProfile = workerProfile;
      becomeWorkerLink.classList.remove('hidden');
      busyToggleItem.classList.remove('hidden');

      const workerLinkText = becomeWorkerLink.querySelector('.nav-text');
      if (workerLinkText) workerLinkText.textContent = 'Edit Your Info';

      updateToggleUI(workerProfile.isBusy);
    } else {
      currentWorkerProfile = null;
      becomeWorkerLink.classList.remove('hidden');
      busyToggleItem.classList.add('hidden');

      const workerLinkText = becomeWorkerLink.querySelector('.nav-text');
      if (workerLinkText) workerLinkText.textContent = 'Register as Worker';
    }
  } catch (error) {
    console.error('Error checking worker status:', error);
  }
}

function updateToggleUI(isBusy) {
  const circle = busyToggle.querySelector('.circle');
  if (isBusy) {
    circle.style.left = '18px';
    busyToggle.style.backgroundColor = '#e85d2f';
  } else {
    circle.style.left = '2px';
    busyToggle.style.backgroundColor = '#ccc';
  }
}

if (busyToggle) {
  busyToggle.addEventListener('click', async function (e) {
    e.preventDefault();
    if (!currentWorkerProfile) return;
    const newStatus = !currentWorkerProfile.isBusy;
    try {
      await updateWorkerStatus(newStatus);
      currentWorkerProfile.isBusy = newStatus;
      updateToggleUI(newStatus);
    } catch (error) {
      console.error('Error updating worker status:', error);
    }
  });
}

// =============================================
// INITIALIZATION
// =============================================
await checkWorkerStatus();
setActiveCategory('jobs');

try {
  renderJobs();
} catch (error) {
  console.error("Error initializing jobs:", error);
}