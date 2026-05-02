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
// SIDEBAR MOBILE FUNCTIONALITY - Handles responsive mobile menu
// =============================================

/**
 * TOGGLE SIDEBAR - Opens/closes the mobile sidebar menu
 * Toggles active class on sidebar and overlay, manages body scroll
 */
function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

/**
 * CLOSE SIDEBAR - Closes the mobile sidebar menu
 * Removes active classes and restores body scroll
 */
function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Don't close if it's a category button with data-category
    if (!link.parentElement.classList.contains('category-btn')) {
      closeSidebar();
    }
  });
});

// =============================================
// HELPER FUNCTIONS - Utilities for modal management and UI
// =============================================

/**
 * COPY TO CLIPBOARD - Copies contact info to clipboard with visual feedback
 * Shows "Copied!" message for 2 seconds after successful copy
 * @param {string} text - Text to copy to clipboard
 * @param {HTMLElement} element - Element to show the feedback message
 */
function copyToClipboard(text, element) {
  // Find the phone number span within the clicked element
  const phoneSpan = element.querySelector('.phone-number') || element;
  const originalHTML = phoneSpan.innerHTML;
  const originalColor = phoneSpan.style.color;

  // Method 1: Try modern Clipboard API
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
    }).catch(err => {
      console.error('Clipboard API failed:', err);
      fallbackCopy(text, phoneSpan, originalHTML, originalColor);
    });
  } else {
    // Method 2: Fallback for older browsers
    fallbackCopy(text, phoneSpan, originalHTML, originalColor);
  }
}

// Fallback method for copying to clipboard
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
    console.error('Fallback copy failed:', err);  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * OPEN JOB MODAL - Opens the job posting modal for creating a new job
 * Adds blur effect to background elements
 */
function openJobModal() {  if (modal) {
    modal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');
  }
}

/**
 * CLOSE JOB MODAL - Closes the job posting modal
 * Removes blur effect from background elements
 */
function closeJobModal() {  if (modal) {
    modal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

/**
 * OPEN WORKER MODAL - Opens the worker registration modal
 * Adds blur effect to background elements
 */
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

/**
 * CLOSE WORKER MODAL - Closes the worker registration modal
 * Removes blur effect from background elements
 */
function closeWorkerModal() {
  if (workerModal) {
    workerModal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

/**
 * OPEN REVIEW MODAL - Opens the review submission modal for a specific worker
 * Adds blur effect to background elements and loads user's existing review if any
 * @param {string} workerId - ID of the worker to review
 */
async function openReviewModal(workerId) {
  if (!reviewModal) return;

  try {
    const [userPosts, userReviews, existingReview, workerReviewStats] = await Promise.all([
      getUserPosts(),
      getUserReviews(),
      getUserReviewForWorker(workerId),
      getWorkerReviews(workerId)
    ]);

    const postedJobsCount = Array.isArray(userPosts) ? userPosts.length : 0;
    const userReviewCount = Array.isArray(userReviews) ? userReviews.length : 0;

    if (!existingReview && postedJobsCount === 0) {      return;
    }

    if (!existingReview && userReviewCount >= postedJobsCount) {      return;
    }

    const reviewFormElement = document.getElementById('reviewForm');
    if (reviewFormElement) reviewFormElement.reset();
    document.getElementById('reviewWorkerId').value = workerId;

    const ratingSelect = document.getElementById('reviewRatingInput');
    const reviewerNameInput = document.getElementById('reviewerNameInput');
    if (reviewerNameInput) {
      reviewerNameInput.value = existingReview?.reviewerName || '';
    }
    if (ratingSelect) ratingSelect.value = existingReview ? String(existingReview.rating) : '';
    document.getElementById('selectedRatingDisplay').textContent = existingReview ? `You selected ${existingReview.rating}` : 'Select a rating';
    document.getElementById('charCount').textContent = existingReview?.comment?.length || 0;
    if (existingReview?.comment) {
      const commentField = document.getElementById('reviewComment');
      if (commentField) {
        commentField.value = existingReview.comment;
      }
    }

    const averageSummary = document.getElementById('reviewWorkerRatingSummary');
    if (averageSummary && workerReviewStats) {
      const averageRatingValue = parseFloat(workerReviewStats.averageRating) || 0;
      averageSummary.textContent = `Average Rating: ${averageRatingValue.toFixed(1)} (${workerReviewStats.totalReviews} review${workerReviewStats.totalReviews !== 1 ? 's' : ''})`;
    }

    reviewModal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');
  } catch (error) {
    console.error('Error preparing review modal:', error);  }
}

/**
 * CLOSE REVIEW MODAL - Closes the review submission modal
 * Removes blur effect from background elements and resets form
 */
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

/**
 * OPEN REVIEWS DISPLAY MODAL - Opens modal to view all reviews for a worker
 * Fetches and displays all reviews for the specified worker
 * @param {string} workerId - ID of the worker
 * @param {string} workerName - Name of the worker
 */
async function openReviewsDisplayModal(workerId, workerName) {
  if (reviewsDisplayModal) {
    document.getElementById('reviewsWorkerName').textContent = `${workerName}'s Reviews`;
    reviewsDisplayModal.classList.remove('hidden');
    if (homeContainer) homeContainer.classList.add('isBlurred');
    if (titleSection) titleSection.classList.add('isBlurred');

    // Fetch and display reviews
    try {
      const reviewsData = await getWorkerReviews(workerId);
      displayReviews(reviewsData);
    } catch (error) {
      document.getElementById('reviewsList').innerHTML = `<p style="color: red;">Error loading reviews: ${error.message}</p>`;
    }
  }
}

/**
 * CLOSE REVIEWS DISPLAY MODAL - Closes the reviews display modal
 * Removes blur effect from background elements
 */
function closeReviewsDisplayModal() {
  if (reviewsDisplayModal) {
    reviewsDisplayModal.classList.add('hidden');
    if (homeContainer) homeContainer.classList.remove('isBlurred');
    if (titleSection) titleSection.classList.remove('isBlurred');
  }
}

/**
 * DISPLAY REVIEWS - Renders reviews in the reviews display modal
 * Shows average rating, total reviews, and individual review cards
 * @param {Object} reviewsData - Object containing reviews array, averageRating, and totalReviews
 */
function displayReviews(reviewsData) {
  const reviewsList = document.getElementById('reviewsList');
  const { reviews, averageRating, totalReviews } = reviewsData;

  if (totalReviews === 0) {
    reviewsList.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1rem;">No reviews yet for this worker.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border);">
      <div>
        <div style="font-size: 2.5rem; font-weight: bold; color: #e85d2f;">${averageRating}</div>
        <div style="color: #666; margin-top: 4px;">Average Rating</div>
      </div>
      <div>
        <div style="display: flex; gap: 4px; margin-bottom: 8px;">
          ${[1, 2, 3, 4, 5].map(i =>
    `<span style="font-size: 1.5rem; color: ${i <= Math.round(averageRating) ? '#ffc107' : '#ddd'};">★</span>`
  ).join('')}
        </div>
        <div style="color: #666;">${totalReviews} review${totalReviews !== 1 ? 's' : ''}</div>
      </div>
    </div>
  `;

  reviews.forEach((review, index) => {
    const reviewDate = new Date(review.createdAt);
    const dateString = reviewDate.toLocaleDateString();

    html += `
      <div style="padding: 16px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: bold; color: #333;">${review.reviewerName || 'Anonymous Reviewer'}</div>
            <div style="font-size: 0.9rem; color: #999;">${dateString}</div>
          </div>
          <div style="display: flex; gap: 2px;">
            ${[1, 2, 3, 4, 5].map(i =>
      `<span style="font-size: 1.2rem; color: ${i <= review.rating ? '#ffc107' : '#ddd'};">★</span>`
    ).join('')}
          </div>
        </div>
        ${review.comment ? `<p style="color: #555; margin: 8px 0; line-height: 1.5;">"${review.comment}"</p>` : ''}
      </div>
    `;
  });

  reviewsList.innerHTML = html;
}

// Make review functions globally accessible for onclick handlers
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.openReviewsDisplayModal = openReviewsDisplayModal;
window.closeReviewsDisplayModal = closeReviewsDisplayModal;
window.copyToClipboard = copyToClipboard;
window.fallbackCopy = fallbackCopy;

// =============================================
// EVENT LISTENERS - POST A JOB
// =============================================

// OPEN MODAL when clicking "Post a Job" button
if (jobPost) {
  jobPost.addEventListener("click", function (e) {    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {      window.location.href = '../pages/login.html';
      return;
    }

    openJobModal();
  });} else {
  console.error("Post a Job button (postJobBtn) not found!");
}

// FORM SUBMISSION
if (jobForm) {
  let isSubmitting = false; // Prevent double submission

  jobForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {      return;
    }

    isSubmitting = true;    const jobData = {
      title: document.querySelector('#jobTitle')?.value || '',
      category: document.querySelector('#category')?.value || '',
      jobPosterName: document.querySelector('#posterName')?.value || '',
      description: document.querySelector('#jobDescription')?.value || '',
      budget: document.querySelector('#budget')?.value || '',
      urgency: document.querySelector('#urgency')?.value || '',
      location: document.querySelector('#location')?.value || '',
      contact: document.querySelector('#telephone')?.value || ''
    };    try {
      const result = await postAJob(jobData);      jobForm.reset();
      closeJobModal();      // Refresh the jobs list to show the newly posted job
      await renderJobs();
    } catch (error) {
      console.error("Error posting job:", error);    } finally {
      isSubmitting = false; // Allow future submissions
    }
  });} else {
  console.error("Job form not found!");
}

// CLOSE MODAL - X button
if (modalClosed) {
  modalClosed.addEventListener('click', function () {    closeJobModal();
  });
}

// CLOSE MODAL - Cancel button
const resetButtons = document.querySelectorAll('.reset');
resetButtons.forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const parentModal = btn.closest('.modalContainer');
    const parentWorkerModal = btn.closest('.workerModalContainer');
    const parentReviewModal = btn.closest('.reviewModalContainer');

    if (parentModal) {
      closeJobModal();
    } else if (parentWorkerModal) {
      closeWorkerModal();
    } else if (parentReviewModal) {
      closeReviewModal();
    }
  });
});

// CLOSE MODAL - Click outside
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeJobModal();
    }
  });
}

// Prevent closing when clicking inside modal card
const modalCard = modal?.querySelector('.modal-card');
if (modalCard) {
  modalCard.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}

// =============================================
// EVENT LISTENERS - BECOME WORKER
// =============================================
const workerForm = document.querySelector('.workerModalContainer form');

// FORM SUBMISSION - WORKER
if (workerForm) {
  let isSubmitting = false; // Prevent double submission

  workerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {      return;
    }

    isSubmitting = true;    // Get selected skills
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    const skills = Array.from(skillCheckboxes).map(checkbox => checkbox.value);

    // Validate that at least one skill is selected
    if (skills.length === 0) {      isSubmitting = false;
      return;
    }

    const workerLocations = document.querySelector('#workerLocations')?.value || '';
    const locations = workerLocations.split(',').map(loc => loc.trim()).filter(Boolean);
    if (locations.length === 0) {      isSubmitting = false;
      return;
    }

    const workerData = {
      name: document.querySelector('#workerName')?.value || '',
      skills: skills,
      bio: document.querySelector('#workerBio')?.value || '',
      hourly_rate: parseInt(document.querySelector('#workerHourlyRate')?.value) || 0,
      locations,
      phone_number: document.querySelector('#workerPhoneNumber')?.value || ''
    };    try {
      let result;
      if (currentWorkerProfile) {
        result = await updateWorkerProfile(workerData);      } else {
        result = await registerWorker(workerData);      }

      workerForm.reset();
      closeWorkerModal();

      // Refresh worker status and worker list
      await checkWorkerStatus();
      await renderWorkers();
    } catch (error) {
      console.error("Error saving worker info:", error);    } finally {
      isSubmitting = false; // Allow future submissions
    }
  });} else {
  console.error("Worker form not found!");
}

if (becomeWorkerSidebar) {
  becomeWorkerSidebar.addEventListener("click", function () {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {      window.location.href = '../pages/login.html';
      return;
    }
    openWorkerModal(!!currentWorkerProfile);
    clearSidebarSelection();
  });
}

if (workerCloseBtn) {
  workerCloseBtn.addEventListener('click', function () {
    closeWorkerModal();
  });
}

if (workerModal) {
  workerModal.addEventListener("click", function (e) {
    if (e.target === workerModal) {
      closeWorkerModal();
    }
  });
}

const workerModalCard = workerModal?.querySelector('.modal-card');
if (workerModalCard) {
  workerModalCard.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}

// =============================================
// EVENT LISTENERS - SUBMIT REVIEW
// =============================================
const reviewForm = document.querySelector('#reviewForm');
const ratingSelect = document.getElementById('reviewRatingInput');
const selectedRatingDisplay = document.getElementById('selectedRatingDisplay');
const reviewComment = document.getElementById('reviewComment');
const charCount = document.getElementById('charCount');

if (ratingSelect) {
  ratingSelect.addEventListener('input', function () {
    const ratingValue = this.value;
    selectedRatingDisplay.textContent = ratingValue ? `You selected ${ratingValue}` : 'Select a rating';
  });
}

// Update character count for comment
if (reviewComment) {
  reviewComment.addEventListener('input', function () {
    charCount.textContent = this.value.length;
  });
}

// Review form submission
if (reviewForm) {
  let isSubmitting = false;

  reviewForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (isSubmitting) {      return;
    }

    isSubmitting = true;    const workerId = document.getElementById('reviewWorkerId').value;
    const reviewerName = document.getElementById('reviewerNameInput')?.value.trim() || '';
    const ratingValue = document.getElementById('reviewRatingInput')?.value;
    const comment = reviewComment.value.trim();

    if (!reviewerName) {      isSubmitting = false;
      return;
    }
    if (!ratingValue) {      isSubmitting = false;
      return;
    }
    const rating = parseFloat(ratingValue);
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {      isSubmitting = false;
      return;
    }

    try {
      const result = await submitReview(workerId, rating, comment, reviewerName);      reviewForm.reset();
      closeReviewModal();      // Refresh workers list to update ratings
      await renderWorkers();
    } catch (error) {
      console.error("Error submitting review:", error);    } finally {
      isSubmitting = false;
    }
  });} else {
  console.error("Review form not found!");
}

// Close review modal - X button
if (reviewCloseBtn) {
  reviewCloseBtn.addEventListener('click', function () {
    closeReviewModal();
  });
}

// Close review display modal - X button
if (reviewsDisplayCloseBtn) {
  reviewsDisplayCloseBtn.addEventListener('click', function () {
    closeReviewsDisplayModal();
  });
}

// Close review modal - Click outside
if (reviewModal) {
  reviewModal.addEventListener("click", function (e) {
    if (e.target === reviewModal) {
      closeReviewModal();
    }
  });
}

// Close reviews display modal - Click outside
if (reviewsDisplayModal) {
  reviewsDisplayModal.addEventListener("click", function (e) {
    if (e.target === reviewsDisplayModal) {
      closeReviewsDisplayModal();
    }
  });
}

const reviewModalCard = reviewModal?.querySelector('.modal-card');
if (reviewModalCard) {
  reviewModalCard.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}

const reviewsDisplayModalCard = reviewsDisplayModal?.querySelector('.modal-card');
if (reviewsDisplayModalCard) {
  reviewsDisplayModalCard.addEventListener('click', function (e) {
    e.stopPropagation();
  });
}

// ESCAPE KEY to close modals
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
  sidebarItems.forEach((item) => {
    item.classList.remove("active");
  });
}

function setActiveCategory(category) {
  clearSidebarSelection();
  const activeItem = document.querySelector(`[data-category="${category}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

// SIDEBAR CATEGORY BUTTONS
sidebarItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const category = item.getAttribute('data-category');
    setActiveCategory(category);
    closeSidebar(); // Close sidebar on mobile after selection

    // Clear search input when switching categories
    if (searchInput) {
      searchInput.value = '';
    }

    currentCategory = category; // Update current category

    if (category === 'jobs') {
      renderJobs();
    } else if (category === 'workers') {
      renderWorkers();
    } else if (category === 'mypost') {
      renderMyPost();
    }
  });
});

// TOGGLE BUSY BUTTON
if (toggle) {
  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
  });
}

// =============================================
// SEARCH FUNCTIONALITY - Filters and displays jobs/workers based on user search
// =============================================
let allJobs = []; // Store all jobs
let allWorkers = []; // Store all workers
let currentCategory = 'jobs'; // Track current category

const searchInput = document.querySelector('.title input[type="search"]');

/**
 * SEARCH AND RENDER JOBS - Filters jobs based on search term
 * Searches job title, category, description, and location
 * @param {string} searchTerm - Search query from user input
 */
async function searchAndRenderJobs(searchTerm = '') {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = "";

  const token = localStorage.getItem('token');

  if (!token) {
    demoJobContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
          Please log in to view jobs
        </p>
        <button onclick="window.location.href='../pages/login.html'" style="
          background-color: #e85d2f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Go to Login
        </button>
      </div>
    `;
    return;
  }

  try {
    // If no jobs loaded yet, fetch them
    if (allJobs.length === 0) {
      const response = await getAllJobs();
      allJobs = response.data || [];
    }

    // Filter jobs based on search term
    const searchTermLower = searchTerm.toLowerCase();
    const filteredJobs = allJobs.filter(job =>
      job.title.toLowerCase().includes(searchTermLower) ||
      job.workCategory.toLowerCase().includes(searchTermLower) ||
      job.description.toLowerCase().includes(searchTermLower) ||
      job.location.toLowerCase().includes(searchTermLower)
    );    // Render filtered jobs
    if (filteredJobs.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
          <p style="color: #666; font-size: 1.1rem;">No jobs found matching "${searchTerm}"</p>
        </div>
      `;
      return;
    }

    filteredJobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("jobCard");

      let category = job.workCategory.charAt(0).toUpperCase() + job.workCategory.slice(1);
      let urgency = job.urgency.toUpperCase();
      let jobDate = new Date(job.createdAt);

      jobCard.innerHTML = `
        <div class="categoryUrgency">
          <span style="background-color: ${catMeta[job.workCategory].bg}; height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; border-radius: 8px; font-size: 24px;">${catMeta[job.workCategory].icon}</span>
          <span style="background-color: ${catMeta[job.workCategory].bg}; padding: 6px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: bold; color: #333;">${urgency}</span>
        </div>
        <h3 style="margin-top: 12px;">${job.title}</h3>
        <p style="font-size: 0.9rem; color: #999; margin: 4px 0;">By <strong>${job.jobPosterName}</strong></p>
        <p style="flex-grow: 1; margin: 8px 0; line-height: 1.5;">${job.description.length > 100 ? job.description.slice(0, 100) + "..." : job.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; font-size: 0.9rem; color: #666;">
          <span>📍 ${job.location}</span>
          <span style="background-color: ${catMeta[job.workCategory].bg}; padding: 4px 8px; border-radius: 6px; font-weight: 500;">${category}</span>
        </div>
        <p style="font-size: 0.9rem; color: #999; margin: 8px 0; cursor: pointer;" class="copy-phone" onclick="copyToClipboard('${job.contact}', this)"><span class="phone-number">📞 <strong>${job.contact}</strong></span></p>
        <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <p style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent);">৳${job.payment.toLocaleString()}</p>
          <p style="margin: 0; font-size: 0.85rem; color: #999;">${jobDate.toLocaleDateString()}</p>
        </div>
      `;
      demoJobContainer.append(jobCard);
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    demoJobContainer.innerHTML = '<p style="color: red;">Error loading jobs.</p>';
  }
}

// Function to filter and render workers based on search term
async function searchAndRenderWorkers(searchTerm = '') {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = "";

  const token = localStorage.getItem('token');

  if (!token) {
    demoJobContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
          Please log in to view workers
        </p>
        <button onclick="window.location.href='../pages/login.html'" style="
          background-color: #e85d2f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Go to Login
        </button>
      </div>
    `;
    return;
  }

  try {
    // If no workers loaded yet, fetch them
    if (allWorkers.length === 0) {
      const response = await getAllWorkers();
      allWorkers = response.data || [];
    }

    // Filter workers based on search term
    const searchTermLower = searchTerm.toLowerCase();
    const filteredWorkers = allWorkers.filter(worker =>
      (Array.isArray(worker.skills) ? worker.skills.some(skill => skill.toLowerCase().includes(searchTermLower)) : worker.skills.toLowerCase().includes(searchTermLower))
    );    // Render filtered workers
    if (filteredWorkers.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
          <p style="color: #666; font-size: 1.1rem;">No workers found matching "${searchTerm}"</p>
        </div>
      `;
      return;
    }

    filteredWorkers.forEach(worker => {
      const workerCard = document.createElement('div');
      workerCard.classList.add("workerCard");

      const firstLetter = worker.name.charAt(0).toUpperCase();
      const avatarColor = letterColors[firstLetter] || "#e0e7ef";
      const skillsText = Array.isArray(worker.skills) ? worker.skills.join(', ') : worker.skills;

      workerCard.innerHTML = `
        <div class="workerAvatar" style="background-color: ${avatarColor}; width: 70px; height: 70px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 32px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          ${firstLetter}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <h3 style="margin: 0; font-size: 1.1rem;">${worker.name}</h3>
        </div>
        <p style="margin: 6px 0; font-size: 0.9rem; color: #666; font-weight: 500;">⭐ ${skillsText}</p>
        <p style="margin: 8px 0; font-size: 0.85rem; color: #888; line-height: 1.4; flex-grow: 1;">${worker.bio.length > 80 ? worker.bio.slice(0, 80) + "..." : worker.bio}</p>
        <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; width: 100%; display: flex; justify-content: space-around; align-items: center; gap: 8px;">
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent);">৳${worker.hourly_rate}</p>
            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #999;">/hour</p>
          </div>
          <div style="height: 30px; width: 1px; background-color: var(--border);"></div>
          <div style="text-align: center;">
            ${worker.isBusy ? '<span style="background-color: #e85d2f; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold;">BUSY</span>' : '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold;">AVAILABLE</span>'}
          </div>
          <div style="height: 30px; width: 1px; background-color: var(--border);"></div>
          <div style="text-align: center; cursor: pointer;" class="copy-phone" onclick="copyToClipboard('${worker.phone_number}', this)">
            <p style="margin: 0; font-size: 0.9rem; color: #666;">📞</p>
            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #999;"><span class="phone-number">${worker.phone_number}</span></p>
          </div>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; display: flex; gap: 8px; width: 100%;">
          <button class="review-btn" onclick="openReviewModal('${worker._id}')" style="flex: 1; padding: 8px 12px; background-color: #e85d2f; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s;">
            ⭐ Add Review
          </button>
          <button class="view-reviews-btn" onclick="openReviewsDisplayModal('${worker._id}', '${worker.name.replace(/'/g, "\\'")}');" style="flex: 1; padding: 8px 12px; background-color: #f0f0f0; color: #333; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s;">
            📋 Reviews
          </button>
        </div>
      `;
      demoJobContainer.append(workerCard);
    });
  } catch (error) {
    console.error('Error searching workers:', error);
    demoJobContainer.innerHTML = '<p style="color: red;">Error loading workers.</p>';
  }
}

// Add search input event listener
if (searchInput) {
  searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.trim();

    if (currentCategory === 'jobs') {
      searchAndRenderJobs(searchTerm);
    } else if (currentCategory === 'workers') {
      searchAndRenderWorkers(searchTerm);
    }
  });} else {
  console.error("Search input not found!");
}


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
  A: "#ff9a9e",
  B: "#d4a5e6",
  C: "#fad0c4",
  D: "#ffbe9b",
  E: "#ff8177",
  F: "#84fab0",
  G: "#a6c0fe",
  H: "#fccb90",
  I: "#c4a8f9",
  J: "#f5576c",
  K: "#4facfe",
  L: "#43e97b",
  M: "#fa709a",
  N: "#30cfd0",
  O: "#5f2c82",
  P: "#ff9966",
  Q: "#00c6ff",
  R: "#7f7fd5",
  S: "#bb377d",
  T: "#2193b0",
  U: "#cc2b5e",
  V: "#ee9ca7",
  W: "#42275a",
  X: "#2c3e50",
  Y: "#de6262",
  Z: "#56ab2f",
};

const demoJobContainer = document.getElementById("demoJobContainer");

/**
 * RENDER JOBS - Fetches and displays all available jobs
 * Shows login prompt if user is not authenticated
 * Displays job cards with category, urgency, payment, and date information
 */
async function renderJobs() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = "";

  // Check if user is logged in
  const token = localStorage.getItem('token');

  if (!token) {
    demoJobContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
          Please log in to view jobs
        </p>
        <button onclick="window.location.href='../pages/login.html'" style="
          background-color: #e85d2f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Go to Login
        </button>
      </div>
    `;    return;
  }

  try {
    const response = await getAllJobs();
    allJobs = response.data || []; // Store globally for search    allJobs.forEach((job, index) => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("jobCard");

      let category = job.workCategory.charAt(0).toUpperCase() + job.workCategory.slice(1);
      let urgency = job.urgency.toUpperCase();
      let jobDate = new Date(job.createdAt);

      jobCard.innerHTML = `
        <div class="categoryUrgency">
          <span style="background-color: ${catMeta[job.workCategory].bg}; height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; border-radius: 8px; font-size: 24px;">${catMeta[job.workCategory].icon}</span>
          <span style="background-color: ${catMeta[job.workCategory].bg}; padding: 6px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: bold; color: #333;">${urgency}</span>
        </div>
        <h3 style="margin-top: 12px;">${job.title}</h3>
        <p style="font-size: 0.9rem; color: #999; margin: 4px 0;">By <strong>${job.jobPosterName}</strong></p>
        <p style="flex-grow: 1; margin: 8px 0; line-height: 1.5;">${job.description.length > 100 ? job.description.slice(0, 100) + "..." : job.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; font-size: 0.9rem; color: #666;">
        <span>📍 ${job.location}</span>
        <span style="background-color: ${catMeta[job.workCategory].bg}; padding: 4px 8px; border-radius: 6px; font-weight: 500;">${category}</span>
        </div>
        <p style="font-size: 0.9rem; color: #999; margin: 8px 0; cursor: pointer;" class="copy-phone" onclick="copyToClipboard('${job.contact}', this)"><span class="phone-number">📞 <strong>${job.contact}</strong></span></p>
        <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent);">৳${job.payment.toLocaleString()}</p>
          <p style="margin: 0; font-size: 0.85rem; color: #999;">${jobDate.toLocaleDateString()}</p>
        </div>
    `;
      demoJobContainer.append(jobCard);
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    demoJobContainer.innerHTML = '<p style="color: red;">Error loading jobs. Please make sure you are logged in.</p>';
  }
}

/**
 * RENDER WORKERS - Fetches and displays all registered workers
 * Shows login prompt if user is not authenticated
 * Displays worker cards with skills, bio, hourly rate, and availability status
 */
async function renderWorkers() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = "";

  // Check if user is logged in
  const token = localStorage.getItem('token');

  if (!token) {
    demoJobContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
          Please log in to view workers
        </p>
        <button onclick="window.location.href='../pages/login.html'" style="
          background-color: #e85d2f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Go to Login
        </button>
      </div>
    `;    return;
  }

  try {
    const response = await getAllWorkers();
    allWorkers = response.data || []; // Store globally for search    const workersWithReviews = await Promise.all(allWorkers.map(async worker => {
      try {
        const reviewsData = await getWorkerReviews(worker._id);
        return {
          ...worker,
          averageRating: reviewsData.averageRating || 0,
          totalReviews: reviewsData.totalReviews || 0,
        };
      } catch (error) {
        console.warn(`Unable to load review summary for worker ${worker._id}:`, error);
        return {
          ...worker,
          averageRating: 0,
          totalReviews: 0,
        };
      }
    }));

    workersWithReviews.forEach(worker => {
      const workerCard = document.createElement('div');
      workerCard.classList.add("workerCard");

      // Extract first letter of name for avatar
      const firstLetter = worker.name.charAt(0).toUpperCase();
      const avatarColor = letterColors[firstLetter] || "#e0e7ef";

      // Handle skills - join array if it's an array
      const skillsText = Array.isArray(worker.skills) ? worker.skills.join(', ') : worker.skills;
      const averageRating = parseFloat(worker.averageRating) || 0;
      const totalReviews = worker.totalReviews || 0;

      workerCard.innerHTML = `
        <div class="workerAvatar" style="background-color: ${avatarColor}; width: 70px; height: 70px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 32px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          ${firstLetter}
        </div>
        <div style="margin-bottom: 4px;">
          <h3 style="margin: 0; font-size: 1.1rem;">${worker.name}</h3>
          <div style="font-size: 0.95rem; color: #333; font-weight: 600; margin-top: 6px;">Rating: ${averageRating.toFixed(1)}</div>
          ${worker.locations && worker.locations.length ? `<p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #444; font-weight: 500;">Available in: ${Array.isArray(worker.locations) ? worker.locations.join(', ') : worker.locations}</p>` : ''}
        </div>
        <p style="margin: 12px 0 6px 0; font-size: 0.85rem; color: #666; font-weight: 500;">${skillsText}</p>
        <p style="margin: 8px 0; font-size: 0.85rem; color: #888; line-height: 1.4; flex-grow: 1;">${worker.bio.length > 80 ? worker.bio.slice(0, 80) + "..." : worker.bio}</p>
        <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; width: 100%; display: flex; justify-content: space-around; align-items: center; gap: 8px;">
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent);">৳${worker.hourly_rate}</p>
            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #999;">/hour</p>
          </div>
          <div style="height: 30px; width: 1px; background-color: var(--border);"></div>
          <div style="text-align: center;">
            ${worker.isBusy ? '<span style="background-color: #e85d2f; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold;">BUSY</span>' : '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold;">AVAILABLE</span>'}
          </div>
          <div style="height: 30px; width: 1px; background-color: var(--border);"></div>
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 0.9rem; color: #666;">${totalReviews} review${totalReviews !== 1 ? 's' : ''}</p>
          </div>
          <div style="height: 30px; width: 1px; background-color: var(--border);"></div>
          <div style="text-align: center; cursor: pointer;" class="copy-phone" onclick="copyToClipboard('${worker.phone_number}', this)">
            <p style="margin: 0; font-size: 0.9rem; color: #666;">📞</p>
            <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #999;"><span class="phone-number">${worker.phone_number}</span></p>
          </div>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; display: flex; gap: 8px; width: 100%;">
          <button class="review-btn" onclick="openReviewModal('${worker._id}')" style="flex: 1; padding: 8px 12px; background-color: #e85d2f; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s;">
            ⭐ Add Review
          </button>
          <button class="view-reviews-btn" onclick="openReviewsDisplayModal('${worker._id}', '${worker.name.replace(/'/g, "\\'")}');" style="flex: 1; padding: 8px 12px; background-color: #f0f0f0; color: #333; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s;">
            📋 Reviews
          </button>
        </div>
      `;
      demoJobContainer.append(workerCard);
    });

    // Show message if no workers found
    if (allWorkers.length === 0) {
      demoJobContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">No workers found</p>';
    }
  } catch (error) {
    console.error('Error fetching workers:', error);
    demoJobContainer.innerHTML = '<p style="color: red;">Error loading workers. Please make sure you are logged in.</p>';
  }
}

// In a real app, this would come from the backend based on the logged -in user.For demo, we hardcode some example posts that the current user has created.
// const myPosts = [];

/**
 * RENDER MY POSTS - Fetches and displays job posts created by current user
 * Shows login prompt if user is not authenticated
 * Displays user's own job postings with status and details
 */
async function renderMyPost() {
  if (!demoJobContainer) return;
  demoJobContainer.innerHTML = "";

  // Check if user is logged in
  const token = localStorage.getItem('token');

  if (!token) {
    demoJobContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
          Please log in to view your posts
        </p>
        <button onclick="window.location.href='../pages/login.html'" style="
          background-color: #e85d2f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">
          Go to Login
        </button>
      </div>
    `;
    return;
  }

  try {
    const response = await getUserPosts();
    const myPosts = response.data || [];    if (myPosts.length === 0) {
      demoJobContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
          <p style="color: #666; font-size: 1.1rem;">No posts found. Start by posting a job!</p>
        </div>
      `;
      return;
    }

    myPosts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.classList.add("postCard");
      let jobDate = new Date(post.createdAt);

      postCard.innerHTML = `
        <div class="categoryUrgency">
          <span style="background-color: ${catMeta[post.workCategory]?.bg || '#f1f5f9'}; height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; border-radius: 8px; font-size: 24px;">${catMeta[post.workCategory]?.icon || '🛠'}</span>
          <span style="background-color: ${catMeta[post.workCategory]?.bg || '#f1f5f9'}; padding: 6px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: bold; color: #333;">${post.urgency?.toUpperCase()}</span>
        </div>
        <h3 style="margin-top: 12px;">${post.title}</h3>
        <p style="font-size: 0.9rem; color: #999; margin: 4px 0;">By <strong>${post.jobPosterName}</strong></p>
        <p style="flex-grow: 1; margin: 8px 0; line-height: 1.5;">${post.description.length > 100 ? post.description.slice(0, 100) + "..." : post.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; font-size: 0.9rem; color: #666;">
          <span>📍 ${post.location}</span>
          <span style="background-color: ${catMeta[post.workCategory]?.bg || '#f1f5f9'}; padding: 4px 8px; border-radius: 6px; font-weight: 500;">${post.workCategory}</span>
        </div>
        <p style="font-size: 0.9rem; color: #999; margin: 8px 0; cursor: pointer;" class="copy-phone" onclick="copyToClipboard('${post.contact}', this)"><span class="phone-number">📞 <strong>${post.contact}</strong></span></p>
        <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <p style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent);">৳${post.payment.toLocaleString()}</p>
          <p style="margin: 0; font-size: 0.85rem; color: #999;">${jobDate.toLocaleDateString()}</p>
        </div>
      `;
      demoJobContainer.append(postCard);
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    demoJobContainer.innerHTML = '<p style="color: red;">Error loading your posts. ' + error.message + '</p>';
  }
}

// =============================================
// WORKER STATUS TOGGLE - Manages worker availability status
// =============================================
const becomeWorkerLink = document.getElementById('becomeWorkerSidebar');
const busyToggleItem = document.getElementById('busyToggleItem');
const busyToggle = document.getElementById('busyToggle');
let currentWorkerProfile = null;

/**
 * CHECK WORKER STATUS - Checks if current user is registered as a worker
 * Shows worker toggle if user is a worker, hides it if not
 * Updates UI to reflect worker status
 */
async function checkWorkerStatus() {
  try {
    const workerProfile = await getMyWorkerProfile();
    if (workerProfile) {
      // User is a worker
      currentWorkerProfile = workerProfile;
      becomeWorkerLink.classList.remove('hidden');
      busyToggleItem.classList.remove('hidden');

      const workerLinkText = becomeWorkerLink.querySelector('.nav-text');
      if (workerLinkText) {
        workerLinkText.textContent = 'Edit Your Info';
      }

      // Set toggle state based on isBusy
      updateToggleUI(workerProfile.isBusy);
    } else {
      // User is not a worker
      currentWorkerProfile = null;
      becomeWorkerLink.classList.remove('hidden');
      busyToggleItem.classList.add('hidden');

      const workerLinkText = becomeWorkerLink.querySelector('.nav-text');
      if (workerLinkText) {
        workerLinkText.textContent = 'Register as Worker';
      }
    }
  } catch (error) {
    console.error('Error checking worker status:', error);
  }
}

/**
 * UPDATE TOGGLE UI - Updates the visual state of the busy/available toggle button
 * Moves the toggle circle and changes color based on busy status
 * @param {boolean} isBusy - True if worker is busy, false if available
 */
function updateToggleUI(isBusy) {
  const circle = busyToggle.querySelector('.circle');
  const toggleBg = busyToggle;

  if (isBusy) {
    circle.style.left = '18px';
    toggleBg.style.backgroundColor = '#e85d2f';
  } else {
    circle.style.left = '2px';
    toggleBg.style.backgroundColor = '#ccc';
  }
}

if (busyToggle) {
  busyToggle.addEventListener('click', async function (e) {
    e.preventDefault();

    if (!currentWorkerProfile) return;

    const newStatus = !currentWorkerProfile.isBusy;

    try {
      const result = await updateWorkerStatus(newStatus);
      currentWorkerProfile.isBusy = newStatus;
      updateToggleUI(newStatus);    } catch (error) {
      console.error('Error updating worker status:', error);    }
  });
}

// =============================================
// INITIALIZATION
// =============================================// Check if user is a worker
await checkWorkerStatus();

// Set initial active category and render
setActiveCategory('jobs');

try {
  renderJobs();} catch (error) {
  console.error("Error initializing jobs:", error);
}