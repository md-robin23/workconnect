/**
 * API BASE URL
 * Dynamically sets the backend API URL based on environment
 * Development: https://workconnect-o80d.onrender.com/api/r1
 * Production: https://workconnect-o80d.onrender.com/api/r1
 * 
 * To change production domain: Replace 'workconnect-o80d.onrender.com' with your actual backend domain
 */
const getBaseUrl = () => {
    // Check if running in production (not localhost)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Production environment - use Render backend URL
        return 'https://workconnect-o80d.onrender.com/api/r1';
    }
    // Development environment
    //https://workconnect-o80d.onrender.com
    return 'https://workconnect-o80d.onrender.com/api/r1';
};

const BASE_URL = getBaseUrl();

/**
 * LOGIN USER - Authenticates a user with phone number and password
 * Sends login credentials to backend and receives authentication token
 * @param {string} phoneNumber - User's phone number (11 digits)
 * @param {string} password - User's password (at least 4 characters)
 * @returns {Promise} Response containing token and user data
 * @throws {Error} If login fails
 */
export const loginUser = async (phoneNumber, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/log-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (e) {
        throw e;
    }
}

/**
 * POST A JOB - Creates a new job posting
 * Validates that user is logged in, maps frontend data to backend format, and submits job data
 * @param {Object} jobData - Object containing job details (title, description, category, budget, etc.)
 * @returns {Promise} Response containing created job data
 * @throws {Error} If user is not logged in or job posting fails
 */
export const postAJob = async (jobData) => {
    try {
        // Get token from localStorage (saved by login.js)
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to post a job. Please login first.');
        }

        // Map frontend field names to backend field names
        const mappedData = {
            title: jobData.title,
            description: jobData.description,
            urgency: jobData.urgency?.toUpperCase(), // Convert to uppercase (ASAP, URGENT, FLEXIBLE)
            workCategory: jobData.category, // category -> workCategory
            location: jobData.location,
            payment: parseInt(jobData.budget), // budget -> payment, convert to number
            jobPosterName: jobData.jobPosterName, // Include poster name
            contact: jobData.contact // Include contact information
        };
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token for authentication
            },
            body: JSON.stringify(mappedData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to post job');
        }
        return data;
    } catch (e) {
        console.error("Error posting a job:", e);
        throw e;
    }
}

/**
 * GET ALL JOBS - Fetches all available jobs from backend
 * Retrieves job listings that the logged-in user can view
 * @returns {Promise} Array of job objects
 * @throws {Error} If user is not logged in or fetch fails
 */
export const getAllJobs = async () => {
    try {
        // Get token from localStorage (saved by login.js)
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to view jobs');
        }

        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token for authentication
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Error fetching jobs:", e);
        throw e;
    }
}

/**
 * GET ALL WORKERS - Fetches all registered workers from backend
 * Retrieves list of available workers that can be browsed or hired
 * @returns {Promise} Array of worker objects
 * @throws {Error} If user is not logged in or fetch fails
 */
export const getAllWorkers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('You must be logged in to view workers');
    }

    try {
        const response = await fetch(`${BASE_URL}/workers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch workers');
        }
        return data;
    } catch (e) {
        console.error("Error fetching workers:", e);
        throw e;
    }
}

/**
 * REGISTER WORKER - Converts logged-in user to a worker
 * Allows user to create a worker profile with skills, bio, rates, and contact info
 * @param {Object} workerData - Object containing worker info (name, skills, bio, hourly_rate, phone_number)
 * @returns {Promise} Response containing created worker profile
 * @throws {Error} If user is not logged in or registration fails
 */
export const registerWorker = async (workerData) => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to register as a worker.');
        }
        const response = await fetch(`${BASE_URL}/workers/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(workerData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register as worker');
        }
        return data;
    } catch (e) {
        console.error("Error registering worker:", e);
        throw e;
    }
}

export const updateWorkerProfile = async (workerData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You must be logged in to update your worker profile.');
        }

        const response = await fetch(`${BASE_URL}/workers/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(workerData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update worker profile');
        }
        return data;
    } catch (e) {
        console.error("Error updating worker profile:", e);
        throw e;
    }
}

/**
 * GET USER POSTS - Fetches all job posts created by the logged-in user
 * Used to display user's own job listings in "My Posts" section
 * @returns {Promise} Array of job posts created by current user
 * @throws {Error} If user is not logged in or fetch fails
 */
export const getUserPosts = async () => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to view your posts.');
        }

        const response = await fetch(`${BASE_URL}/jobs/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch your posts');
        }
        return data;
    } catch (e) {
        console.error("Error fetching user posts:", e);
        throw e;
    }
}

/**
 * GET MY WORKER PROFILE - Fetches the current user's worker profile
 * Retrieves worker details if user is registered as a worker
 * @returns {Promise} Worker profile object or null if user is not a worker
 * @throws {Error} If user is not logged in
 */
export const getMyWorkerProfile = async () => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in.');
        }

        const response = await fetch(`${BASE_URL}/workers/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            // User is not a worker yet
            return null;
        }
        return data.data;
    } catch (e) {
        console.error("Error fetching worker profile:", e);
        return null;
    }
}

/**
 * UPDATE WORKER STATUS - Updates the busy/available status of a worker
 * Toggles whether a worker is available to accept new jobs
 * @param {boolean} isBusy - True if worker is busy, false if available
 * @returns {Promise} Response containing updated worker profile
 * @throws {Error} If user is not logged in or update fails
 */
export const updateWorkerStatus = async (isBusy) => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in.');
        }

        const response = await fetch(`${BASE_URL}/workers/user/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isBusy })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update worker status');
        }
        return data;
    } catch (e) {
        console.error("Error updating worker status:", e);
        throw e;
    }
}

/**
 * SUBMIT REVIEW - Creates or updates a review for a worker
 * Allows user to rate a worker and provide written feedback
 * @param {string} workerId - ID of the worker being reviewed
 * @param {number} rating - Rating from 1-5 stars
 * @param {string} comment - Optional written review/feedback
 * @returns {Promise} Response containing submitted review
 * @throws {Error} If user is not logged in or submission fails
 */
export const submitReview = async (workerId, rating, comment = '', reviewerName = '') => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to submit a review');
        }

        const response = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                workerId,
                rating: parseFloat(rating),
                comment: comment.trim(),
                reviewerName: reviewerName.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit review');
        }
        return data;
    } catch (e) {
        console.error("Error submitting review:", e);
        throw e;
    }
}

/**
 * GET WORKER REVIEWS - Fetches all reviews for a specific worker
 * Includes average rating and total number of reviews
 * @param {string} workerId - ID of the worker
 * @returns {Promise} Object containing reviews array, average rating, and total count
 * @throws {Error} If user is not logged in or fetch fails
 */
export const getWorkerReviews = async (workerId) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to view reviews');
        }

        const response = await fetch(`${BASE_URL}/reviews/worker/${workerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch reviews');
        }
        return data.data;
    } catch (e) {
        console.error("Error fetching worker reviews:", e);
        throw e;
    }
}

/**
 * GET USER REVIEW FOR WORKER - Fetches the logged-in user's review for a specific worker
 * Used to populate the review form if user has already reviewed this worker
 * @param {string} workerId - ID of the worker
 * @returns {Promise} Review object or null if user hasn't reviewed this worker
 * @throws {Error} If user is not logged in
 */
export const getUserReviewForWorker = async (workerId) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in');
        }

        const response = await fetch(`${BASE_URL}/reviews/worker/${workerId}/my-review`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            return null;
        }
        return data.data;
    } catch (e) {
        console.error("Error fetching user review:", e);
        return null;
    }
}

/**
 * GET USER REVIEW COUNT - Fetches all reviews submitted by the logged-in user
 * Used to enforce review limits based on posted jobs
 * @returns {Promise} Array of user review objects
 * @throws {Error} If user is not logged in or fetch fails
 */
export const getUserReviews = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to view your reviews');
        }

        const response = await fetch(`${BASE_URL}/reviews/user/my-reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch your reviews');
        }
        return data.data;
    } catch (e) {
        console.error("Error fetching user reviews:", e);
        throw e;
    }
}

/**
 * DELETE REVIEW - Deletes a review submitted by the logged-in user
 * @param {string} reviewId - ID of the review to delete
 * @returns {Promise} Response confirming deletion
 * @throws {Error} If user is not logged in or deletion fails
 */
export const deleteReview = async (reviewId) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('You must be logged in to delete a review');
        }

        const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete review');
        }
        return data;
    } catch (e) {
        console.error("Error deleting review:", e);
        throw e;
    }
}

/**
 * SEND OTP - Sends OTP to user's phone number via SMS
 * Uses backend API to securely send OTP (API key stored on backend, not exposed)
 * @param {string} phoneNumber - User's phone number (11 digits)
 * @returns {Promise} Response confirming OTP was sent
 * @throws {Error} If phone number is invalid or SMS sending fails
 */
export const sendOtp = async (phoneNumber) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }
        return data;
    } catch (e) {
        console.error("Error sending OTP:", e);
        throw e;
    }
}

/**
 * VERIFY OTP - Verifies the OTP code entered by user
 * Validates OTP and marks phone number as verified
 * @param {string} phoneNumber - User's phone number (11 digits)
 * @param {string} otp - 6-digit OTP code from SMS
 * @returns {Promise} Response confirming OTP verification
 * @throws {Error} If OTP is invalid or verification fails
 */
export const verifyOtp = async (phoneNumber, otp) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, otp })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'OTP verification failed');
        }
        return data;
    } catch (e) {
        console.error("Error verifying OTP:", e);
        throw e;
    }
}

/**
 * SIGN UP - Creates a new user account with phone number and password
 * Phone number must be OTP-verified before signup
 * @param {string} phoneNumber - User's phone number (11 digits)
 * @param {string} password - User's password (min 6 characters)
 * @returns {Promise} Response containing authentication token and user data
 * @throws {Error} If signup fails or phone number is already registered
 */
export const signUp = async (phoneNumber, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create account');
        }
        return data;
    } catch (e) {
        console.error("Error signing up:", e);
        throw e;
    }
}