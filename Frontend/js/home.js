const catagoryButton = document.querySelectorAll(".catagoryButton");
const jobPost = document.querySelector(".postJob");
const body = document.querySelector("body");
const modal = document.querySelector('.modalContainer');
const wrapper = document.querySelector('.homeContainer');
const modalClosed = document.querySelector('.close-btn');
const resetButton = document.querySelector('.reset');

jobPost.addEventListener("click", () => {
  modal.classList.remove('hidden');
  wrapper.classList.add('isBlurred');
});

modalClosed.addEventListener('click', () => {
  modal.classList.add('hidden');
  wrapper.classList.remove('isBlurred');
});

resetButton.addEventListener('click', () => {
  modal.classList.add('hidden');
  wrapper.classList.remove('isBlurred');
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    wrapper.classList.remove("isBlurred");
  }
});


// Function to clear selection from all buttons
function clearSelection() {
  catagoryButton.forEach((button) => {
    button.classList.remove("category3");
  });
}

// Function to select a button
function selectButton(index) {
  clearSelection();
  catagoryButton[index].classList.add("category3");
}

// Initially select the first button (Jobs)
selectButton(0);

// Add click event listeners to each button
catagoryButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectButton(index);
  });
});

const demoJobs = [
  {
    id: 1,
    title: "Fix bedroom ceiling fan wiring",
    category: "electrical",
    description:
      "Fan stopped working after a power cut. Need someone to check the wiring and fix it. House in Gulshan 2. Should take about 1-2 hours.",
    pay: 1200,
    urgency: "asap",
    location: "Gulshan, Dhaka",
    contact: "01711234567",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    poster_name: "Reza K.",
  },
  {
    id: 2,
    title: "Garden cleanup & hedge trimming",
    category: "gardening",
    description:
      "Large garden needs full cleanup — weeding, hedge trimming, lawn mowing. All tools available on site. Garden is approx 2000 sqft.",
    pay: 900,
    urgency: "flexible",
    location: "Dhanmondi, Dhaka",
    contact: "01812345678",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    poster_name: "Sara M.",
  },
  {
    id: 3,
    title: "Math & Physics tutor for HSC student",
    category: "tutoring",
    description:
      "Looking for an experienced tutor for HSC student. 1.5 hours per day, 4 days a week. Must have strong background in physics and higher math.",
    pay: 450,
    urgency: "flexible",
    location: "Uttara, Dhaka",
    contact: "01987654321",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    poster_name: "Abdul H.",
  },
  {
    id: 4,
    title: "Deep clean apartment before move-out",
    category: "cleaning",
    description:
      "3 bedroom apartment needs full deep clean including kitchen cabinets, all bathrooms, windows inside and out. Approximately 4-5 hours of work.",
    pay: 2000,
    urgency: "urgent",
    location: "Banani, Dhaka",
    contact: "01611111111",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    poster_name: "Nadia R.",
  },
  {
    id: 5,
    title: "Laptop stuck on boot loop — need fix",
    category: "tech",
    description:
      "Dell Inspiron 15 stuck in boot loop. Need someone who can diagnose and fix. Possibly reinstall Windows if required. Data preservation is priority.",
    pay: 600,
    urgency: "asap",
    location: "Mirpur, Dhaka",
    contact: "01722222222",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    poster_name: "Farhan A.",
  },
  {
    id: 6,
    title: "Paint living room & one bedroom",
    category: "painting",
    description:
      "Two rooms need a fresh coat of paint. Will provide paint and materials. Need a clean, professional finish with no drips or runs.",
    pay: 3500,
    urgency: "flexible",
    location: "Mohammadpur, Dhaka",
    contact: "01833333333",
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    poster_name: "Jannat B.",
  },
  {
    id: 7,
    title: "Help moving furniture to 4th floor flat",
    category: "moving",
    description:
      "Moving from a 3rd floor flat to a 4th floor flat in same building. No elevator. Need 2-3 strong people for about 4 hours. Lunch and drinks included.",
    pay: 1500,
    urgency: "asap",
    location: "Rayer Bazar, Dhaka",
    contact: "01944444444",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    poster_name: "Tomal I.",
  },
  {
    id: 8,
    title: "Bathroom leakage under sink — urgent",
    category: "plumbing",
    description:
      "Slow drip from under the bathroom sink pipe joint. Needs to be fixed properly. I've tried taping it but it's still leaking. Tenant complaining.",
    pay: 400,
    urgency: "urgent",
    location: "Khilgaon, Dhaka",
    contact: "01555555555",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    poster_name: "Mitu S.",
  },
  {
    id: 9,
    title: "Babysitter for 2 kids on weekends",
    category: "other",
    description:
      "Need a responsible babysitter for 2 children (ages 4 and 7) on Saturday mornings from 9am-1pm. Must be patient and responsible.",
    pay: 500,
    urgency: "flexible",
    location: "Baridhara, Dhaka",
    contact: "01666666666",
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    poster_name: "Anika T.",
  },
  {
    id: 10,
    title: "Bangladeshi home cooking for party (10 pax)",
    category: "cooking",
    description:
      "Need a home cook to prepare a traditional Bangladeshi meal for 10 people. Must include biryani, 3 curries, raita, and dessert. Kitchen and ingredients provided.",
    pay: 2500,
    urgency: "asap",
    location: "Gulshan, Dhaka",
    contact: "01777777777",
    created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
    poster_name: "Rahman F.",
  },
];

const demoWorkers = [
  {
    id: 1,
    first_name: "Kamal",
    last_name: "Hossain",
    skills: "Electrical,Plumbing",
    bio: "12 years experience in residential electrical work and plumbing across Dhaka. Licensed by BREB. Available 7 days a week.",
    hourly_rate: 600,
    available: true,
    avg_rating: 4.8,
    review_count: 34,
    color: "#e85d2f",
  },
  {
    id: 2,
    first_name: "Salma",
    last_name: "Begum",
    skills: "Cleaning,Cooking",
    bio: "Professional house cleaner with 8 years of experience. Also provide home cooking services. References available from previous clients.",
    hourly_rate: 300,
    available: true,
    avg_rating: 4.9,
    review_count: 67,
    color: "#10b981",
  },
  {
    id: 3,
    first_name: "Rafiq",
    last_name: "Uddin",
    skills: "Gardening,Moving,Other",
    bio: "Passionate gardener and general handyman. I love making outdoor spaces beautiful. Also available for moving and general odd jobs.",
    hourly_rate: 350,
    available: false,
    avg_rating: 4.5,
    review_count: 12,
    color: "#3b82f6",
  },
  {
    id: 4,
    first_name: "Priya",
    last_name: "Sen",
    skills: "Tutoring",
    bio: "MSc in Mathematics from BUET. 5 years tutoring HSC and university students in math, physics, and chemistry. 100% pass rate.",
    hourly_rate: 500,
    available: true,
    avg_rating: 5.0,
    review_count: 28,
    color: "#8b5cf6",
  },
  {
    id: 5,
    first_name: "Masud",
    last_name: "Rana",
    skills: "Painting,Other",
    bio: "Interior and exterior painting specialist with 10 years experience. Clean finish guaranteed every time. Own tools and equipment.",
    hourly_rate: 450,
    available: true,
    avg_rating: 4.7,
    review_count: 19,
    color: "#f59e0b",
  },
  {
    id: 6,
    first_name: "Tania",
    last_name: "Khatun",
    skills: "Tech Help,Other",
    bio: "IT graduate from BRAC University. Fix laptops, install software, set up home networks. Home visit available across Dhaka.",
    hourly_rate: 400,
    available: true,
    avg_rating: 4.6,
    review_count: 8,
    color: "#ec4899",
  },
  {
    id: 7,
    first_name: "Jamal",
    last_name: "Sheikh",
    skills: "Plumbing,Electrical",
    bio: "Certified plumber with 15 years experience. From simple tap fixes to full bathroom remodels. Available for emergency calls.",
    hourly_rate: 700,
    available: true,
    avg_rating: 4.9,
    review_count: 41,
    color: "#0891b2",
  },
  {
    id: 8,
    first_name: "Riya",
    last_name: "Das",
    skills: "Cleaning,Gardening",
    bio: "Detail-oriented cleaner specializing in move-in/move-out deep cleans. Also offer regular maintenance cleaning packages.",
    hourly_rate: 280,
    available: true,
    avg_rating: 4.7,
    review_count: 22,
    color: "#65a30d",
  },
];

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

function renderJobs() {
  demoJobContainer.innerHTML = "";
  demoJobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("jobCard");

    let category = job.category.charAt(0).toUpperCase() + job.category.slice(1);
    let urgency = job.urgency.toUpperCase();
    let jobDate = new Date(job.created_at);

    jobCard.innerHTML = `
    <div class="categoryUrgency" >
        <span style="background-color: ${catMeta[job.category].bg}; height: 54px; width: 54px; display: flex;
        justify-content: center; align-items: center; border-radius: 8px">${catMeta[job.category].icon}</span>
        <p style="background-color: ${catMeta[job.category].bg}; display: flex; justify-content: center; align-items: center; padding:4px 11px; border-radius: 17px; height:max-content; font-size: 11px; font-weight: bold;">${urgency}</p>
      </div>
      <h3> ${job.title} </h3>
      <p>Posted by: ${job.poster_name} </p>
      <p><strong>Description:</strong> ${job.description.length > 110 ? job.description.slice(0, 110) + "..." : job.description}</p>
      <div class="locationCategory" style="display: flex; justify-content: space-between; align-items: center;margin: 3px 0">
        <p><strong>Location:</strong> ${job.location} </p>
        <p><strong>Category:</strong> ${category}</P>
      </div>
      <p><strong>Posted on:</strong> ${jobDate.toLocaleDateString()}<strong> at </strong>${jobDate.toLocaleTimeString()}</p>
      <div class="payDetails" style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0">
        <p><strong style="color: red;">Tk ${job.pay.toLocaleString()}</strong></p>
        <p><strong style="color: red;">Details →</strong></p>
      </div>
  `;
    demoJobContainer.append(jobCard);
  });
}

// Show jobs by default
renderJobs();


function renderWorkers() {
  demoJobContainer.innerHTML = "";
  demoWorkers.forEach(worker => {
    const workerCard = document.createElement('div');
    workerCard.classList.add("workerCard");
    workerCard.style.cssText = `
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
      padding: 24px 20px 18px 20px;
      margin: 18px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: box-shadow 0.2s;
      border: 1px solid #f3f4f6;
    `;

    // Avatar
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      height: 90px;
      width: 90px;
      border-radius: 50%;
      background: ${letterColors[worker.first_name.charAt(0).toUpperCase()] || "#e0e7ef"};
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2.7rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 12px;
      border: 3px solid #fff;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
    `;
    avatar.textContent = worker.first_name.charAt(0);

    // Name
    const name = document.createElement('h3');
    name.textContent = `${worker.first_name} ${worker.last_name}`;
    name.style.cssText = `
      margin: 0 0 6px 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #22223b;
      letter-spacing: 0.5px;
      text-align: center;
    `;

    // Skills
    const skills = document.createElement('div');
    skills.style.cssText = "margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 7px; justify-content: center;";
    worker.skills.split(",").forEach(skill => {
      const skillTag = document.createElement('span');
      skillTag.textContent = skill.trim();
      skillTag.style.cssText = `
        background: #f3f4f6;
        color: #374151;
        border-radius: 12px;
        padding: 3px 12px;
        font-size: 0.95rem;
        font-weight: 500;
        margin: 0 2px;
      `;
      skills.appendChild(skillTag);
    });

    // Bio
    const bio = document.createElement('p');
    bio.innerHTML = `<strong>Bio:</strong> ${worker.bio}`;
    bio.style.cssText = "margin: 8px 0 10px 0; color: #444; font-size: 1rem; text-align: center;";

    // Rate, Rating, Availability
    const details = document.createElement('div');
    details.style.cssText = "display: flex; justify-content: space-between; width: 100%; margin-top: 10px; gap: 10px; flex-wrap: wrap;";

    const rate = document.createElement('span');
    rate.innerHTML = `<span style="color:#e85d2f; font-weight:700;">৳${worker.hourly_rate}</span> <span style="font-size:0.95rem; color:#666;">/hr</span>`;

    const rating = document.createElement('span');
    rating.innerHTML = `<span style="color:#f59e0b; font-weight:700;">★ ${worker.avg_rating}</span> <span style="font-size:0.95rem; color:#666;">(${worker.review_count})</span>`;

    const avail = document.createElement('span');
    avail.innerHTML = worker.available
      ? `<span style="color:#10b981; font-weight:700;">● Available</span>`
      : `<span style="color:#e11d48; font-weight:700;">● Not Available</span>`;

    details.appendChild(rate);
    details.appendChild(rating);
    // details.appendChild(avail);

    // Assemble card
    workerCard.appendChild(avatar);
    workerCard.appendChild(name);
    workerCard.appendChild(skills);
    workerCard.appendChild(bio);
    workerCard.appendChild(details);

    demoJobContainer.append(workerCard);
  });
}

// In a real app, this would come from the backend based on the logged -in user.For demo, we hardcode some example posts that the current user has created.
const myPosts = [];

// const myPosts = [
//   {
//     id: 101,                      // unique post ID
//     title: "Fix bedroom ceiling fan wiring",
//     category: "electrical",       // matches your catMeta keys
//     description: "Fan stopped working after a power cut...",
//     pay: 1200,
//     urgency: "asap",              // "asap" | "urgent" | "flexible"
//     location: "Gulshan, Dhaka",
//     contact: "01711234567",       // maybe hide this after someone is hired
//     status: "open",               // "open" | "in_progress" | "completed" | "cancelled"
//     created_at: "2025-03-14T11:30:00.000Z",   // ISO string
//     poster_name: "Reza K.",       // usually current user's name
//     applications: 3,              // number of workers who applied/offered
//     hired_worker_id: null,        // null | worker ID when someone is hired
//     // Optional / nice-to-have fields:
//     // views: 42,
//     // last_updated: ISO string,
//     // images: ["url1", "url2"],   // if you later allow photo upload
//   },
//   {
//     id: 107,
//     title: "Deep clean apartment before move-out",
//     category: "cleaning",
//     description: "3 bedroom apartment needs full deep clean...",
//     pay: 2000,
//     urgency: "urgent",
//     location: "Banani, Dhaka",
//     contact: "01611111111",
//     status: "in_progress",
//     created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
//     poster_name: "Nadia R.",
//     applications: 5,
//     hired_worker_id: 2,           // e.g. Salma Begum
//   },
//   // ... more of user's own posts
// ];

function renderMyPost() {
  demoJobContainer.innerHTML = "";
  if (myPosts.length === 0) {
    demoJobContainer.innerHTML = `
    <div>
    <p style="color: red;">No posts found.</p>
    
    </div>
    `

  } else {

    myPosts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.classList.add("postCard");
      let jobDate = new Date(post.created_at);

      postCard.innerHTML = `
    < div >
    <p >${post.urgency}</p>
      </ >
      <h3> ${post.title} </h3>
      <p><strong>Description:</strong> ${post.description.length > 110 ? post.description.slice(0, 110) + "..." : post.description}</p>
      <div class="locationCategory" style="display: flex; justify-content: space-between; align-items: center;margin: 3px 0">
        <p><strong>Location:</strong> ${post.location} </p>
        <p><strong>Category:</strong> ${post.category}</P>
      </div>
      <p><strong>Posted on:</strong> ${jobDate.toLocaleDateString()}<strong> at </strong>${jobDate.toLocaleTimeString()}</p>
      <div class="payDetails" style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0">
        <p><strong style="color: red;">Tk ${post.pay.toLocaleString()}</strong></p>
        <p><strong style="color: red;">Details →</strong></p>
      </div>
  `;
      demoJobContainer.append(postCard);
    })
  }
}



// Update cards when category button is clicked
catagoryButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    // selectButton(index);
    if (index === 0) {
      renderJobs();
    } else if (index === 1) {
      renderWorkers();
    } else if (index === 2) {
      renderMyPost();
    } else {
      renderJobs();
    }
  });
});