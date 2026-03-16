const jobifyName = document.querySelector(".title-bar h1");
const text = jobifyName.innerHTML;
jobifyName.innerHTML =  `${text.slice(0,3)}<span class='title-color'>${text.slice(3)} </span>`;