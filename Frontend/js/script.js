// Style the title with color on "ify"
const jobifyName = document.querySelector(".title-bar h1");
const text = jobifyName.innerHTML;
// jobifyName.innerHTML =  `${text.slice(0,3)}<span class='title-color'>${text.slice(3)} </span>`;

// Select elements for displaying job statistics
const activeJobsEl = document.querySelector('.active-jobs .digit');
const workersEl = document.querySelector('.total-workers .digit');

// Function to fetch and update job statistics from the backend
async function fetchStats() {
    try {
        const response = await fetch('http://localhost:3000/api/r1/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        activeJobsEl.textContent = data.activeJobs;
        workersEl.textContent = data.workers;
    } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if fetch fails
    }
}

// Initialize stats fetching when the page loads
document.addEventListener('DOMContentLoaded', fetchStats);