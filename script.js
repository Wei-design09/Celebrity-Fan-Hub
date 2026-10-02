// ========================================
// CELEBRITY FAN HUB
// JAVASCRIPT
// ========================================

let celebrities = [];
let news = [];
let events = [];

let currentCategory = "All";
let currentEventCategory = "All";

let favorites =
    JSON.parse(
        localStorage.getItem("favoriteCelebrities")
    ) || [];


// ========================================
// DARK / LIGHT MODE
// ========================================

function setupTheme() {

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    if (!themeToggle || !themeIcon) {
        return;
    }

    themeToggle.addEventListener(
        "change",
        function () {

            if (themeToggle.checked) {

                document.body.classList.add(
                    "light-mode"
                );

                themeIcon.textContent = "☀️";

            } else {

                document.body.classList.remove(
                    "light-mode"
                );

                themeIcon.textContent = "🌙";
            }

        }
    );
}


// ========================================
// PROFILE POPUP
// ========================================

function createProfilePopup() {

    const modal =
        document.getElementById("profileModal");

    if (!modal) {
        return;
    }

    const closeButton =
        document.getElementById("closeProfile");

    closeButton.addEventListener(
        "click",
        function () {

            modal.classList.remove("show");

        }
    );

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                modal.classList.remove("show");

            }

        }
    );
}


// ========================================
// LOAD CELEBRITIES
// ========================================

async function loadCelebrities() {

    try {

        const response =
            await fetch("data/celebrities.json");

        if (!response.ok) {

            throw new Error(
                "Could not load celebrity data."
            );

        }

        celebrities =
            await response.json();

        displayCelebrities(
            celebrities
        );

        displayGallery();

    } catch (error) {

        console.error(error);

    }

}


// ========================================
// DISPLAY CELEBRITIES
// ========================================

function displayCelebrities(list) {

    const container =
        document.getElementById(
            "celebrityCards"
        );

    const resultCount =
        document.getElementById(
            "resultCount"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                😔 No celebrities found.
            </div>
        `;

        if (resultCount) {

            resultCount.textContent =
                "0 celebrities found";

        }

        return;
    }


    list.forEach(
        function (celebrity) {

            const card =
                document.createElement("div");

            card.className = "card";


            const isFavorite =
                favorites.includes(
                    celebrity.name
                );


            card.innerHTML = `

                <div class="card-image">

                    ${
                        celebrity.photo
                        ? `
                            <img
                                src="${celebrity.photo}"
                                alt="${celebrity.name}"
                            >
                          `
                        : celebrity.icon
                    }

                </div>

                <h3>
                    ${celebrity.name}
                </h3>

                <p>
                    ${celebrity.profession}
                </p>

                <button class="favorite-button">
                    ${
                        isFavorite
                        ? "❤️ Favorited"
                        : "🤍 Favorite"
                    }
                </button>

                <button class="profile-button">
                    View Profile
                </button>

            `;


            const favoriteButton =
                card.querySelector(
                    ".favorite-button"
                );

            favoriteButton.addEventListener(
                "click",
                function () {

                    toggleFavorite(
                        celebrity
                    );

                }
            );


            const profileButton =
                card.querySelector(
                    ".profile-button"
                );

            profileButton.addEventListener(
                "click",
                function () {

                    viewProfile(
                        celebrity
                    );

                }
            );


            container.appendChild(card);

        }
    );


    if (resultCount) {

        resultCount.textContent =
            list.length +
            (
                list.length === 1
                ? " celebrity found"
                : " celebrities found"
            );

    }

}


// ========================================
// FAVORITE SYSTEM
// ========================================

function toggleFavorite(celebrity) {

    const index =
        favorites.indexOf(
            celebrity.name
        );


    if (index !== -1) {

        favorites.splice(
            index,
            1
        );

    } else {

        favorites.push(
            celebrity.name
        );

    }


    localStorage.setItem(
        "favoriteCelebrities",
        JSON.stringify(favorites)
    );


    if (
        currentCategory ===
        "Favorites"
    ) {

        showFavorites();

    } else {

        filterCelebrities();

    }

}


// ========================================
// SEARCH + CATEGORY FILTER
// ========================================

function filterCelebrities() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchText =
        searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    const filtered =
        celebrities.filter(
            function (celebrity) {

                const matchesCategory =
                    currentCategory === "All" ||
                    celebrity.category ===
                    currentCategory;


                const matchesSearch =
                    celebrity.name
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    displayCelebrities(
        filtered
    );

}


// ========================================
// SHOW FAVORITES
// ========================================

function showFavorites() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchText =
        searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    const favoriteList =
        celebrities.filter(
            function (celebrity) {

                return (
                    favorites.includes(
                        celebrity.name
                    ) &&
                    celebrity.name
                        .toLowerCase()
                        .includes(
                            searchText
                        )
                );

            }
        );


    displayCelebrities(
        favoriteList
    );

}


// ========================================
// VIEW PROFILE
// ========================================

function viewProfile(celebrity) {

    const modal =
        document.getElementById(
            "profileModal"
        );

    const profileIcon =
        document.getElementById(
            "profileIcon"
        );

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileProfession =
        document.getElementById(
            "profileProfession"
        );

    const profileCategory =
        document.getElementById(
            "profileCategory"
        );

    const profileCountry =
        document.getElementById(
            "profileCountry"
        );

    const profileBio =
        document.getElementById(
            "profileBio"
        );

    const profileFavorite =
        document.getElementById(
            "profileFavorite"
        );


    if (!modal) {
        return;
    }


    if (celebrity.photo) {

        profileIcon.innerHTML = `
            <img
                src="${celebrity.photo}"
                alt="${celebrity.name}"
            >
        `;

    } else {

        profileIcon.textContent =
            celebrity.icon || "⭐";

    }


    profileName.textContent =
        celebrity.name;

    profileProfession.textContent =
        "🎤 Profession: " +
        celebrity.profession;

    profileCategory.textContent =
        "📂 Category: " +
        celebrity.category;

    profileCountry.textContent =
        "🌎 Country: " +
        celebrity.country;

    profileBio.textContent =
        celebrity.bio ||
        "Discover more about this celebrity and their journey.";


    updateProfileFavoriteButton(
        celebrity,
        profileFavorite
    );


    profileFavorite.onclick =
        function () {

            toggleFavorite(
                celebrity
            );

            updateProfileFavoriteButton(
                celebrity,
                profileFavorite
            );

        };


    modal.classList.add("show");

}


// ========================================
// UPDATE PROFILE FAVORITE BUTTON
// ========================================

function updateProfileFavoriteButton(
    celebrity,
    button
) {

    if (
        favorites.includes(
            celebrity.name
        )
    ) {

        button.textContent =
            "❤️ Favorited";

    } else {

        button.textContent =
            "🤍 Favorite";

    }

}


// ========================================
// GALLERY
// ========================================

function displayGallery() {

    const gallery =
        document.getElementById(
            "galleryContainer"
        );

    if (!gallery) {
        return;
    }

    gallery.innerHTML = "";


    const galleryCelebrities =
        celebrities.filter(
            function (celebrity) {

                return celebrity.photo;

            }
        );


    galleryCelebrities.forEach(
        function (celebrity) {

            const item =
                document.createElement("div");

            item.className =
                "gallery-item";


            item.innerHTML = `

                <img
                    src="${celebrity.photo}"
                    alt="${celebrity.name}"
                >

                <div class="gallery-name">
                    ${celebrity.name}
                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    showGalleryPhoto(
                        celebrity
                    );

                }
            );


            gallery.appendChild(item);

        }
    );

}


// ========================================
// GALLERY POPUP
// ========================================

function showGalleryPhoto(celebrity) {

    const popup =
        document.createElement("div");

    popup.className =
        "gallery-popup show";


    popup.innerHTML = `

        <div class="gallery-popup-content">

            <button class="close-gallery">
                ✕
            </button>

            <img
                src="${celebrity.photo}"
                alt="${celebrity.name}"
            >

            <h2>
                ${celebrity.name}
            </h2>

            <p>
                ${celebrity.profession}
            </p>

            <button class="gallery-favorite">

                ${
                    favorites.includes(
                        celebrity.name
                    )
                    ? "❤️ Favorited"
                    : "🤍 Favorite"
                }

            </button>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    const closeButton =
        popup.querySelector(
            ".close-gallery"
        );


    closeButton.addEventListener(
        "click",
        function () {

            popup.remove();

        }
    );


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                popup.remove();

            }

        }
    );


    const favoriteButton =
        popup.querySelector(
            ".gallery-favorite"
        );


    favoriteButton.addEventListener(
        "click",
        function () {

            toggleFavorite(
                celebrity
            );


            if (
                favorites.includes(
                    celebrity.name
                )
            ) {

                favoriteButton.textContent =
                    "❤️ Favorited";

            } else {

                favoriteButton.textContent =
                    "🤍 Favorite";

            }

        }
    );

}


// ========================================
// LOAD NEWS
// ========================================

async function loadNews() {

    try {

        const response =
            await fetch(
                "data/news.json"
            );

        if (!response.ok) {

            throw new Error(
                "Could not load news data."
            );

        }

        news =
            await response.json();

        displayNews();

    } catch (error) {

        console.error(error);

    }

}


// ========================================
// DISPLAY NEWS
// ========================================

function displayNews() {

    const container =
        document.getElementById(
            "newsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    news.forEach(
        function (article) {

            const card =
                document.createElement("div");

            card.className =
                "news-card";


            card.innerHTML = `

                <div class="news-icon">
                    ${article.icon}
                </div>

                <div class="news-content">

                    <span class="news-category">
                        ${article.category}
                    </span>

                    <h3>
                        ${article.title}
                    </h3>

                    <p class="news-date">
                        📅 ${article.date}
                    </p>

                    <p class="news-description">
                        ${article.description}
                    </p>

                    <button class="news-read-button">
                        Read More
                    </button>

                </div>

            `;


            const button =
                card.querySelector(
                    ".news-read-button"
                );


            button.addEventListener(
                "click",
                function () {

                    showNewsDetails(
                        article
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ========================================
// NEWS POPUP
// ========================================

function showNewsDetails(article) {

    const popup =
        document.createElement("div");

    popup.className =
        "news-popup show";


    popup.innerHTML = `

        <div class="news-popup-content">

            <button class="close-news">
                ✕
            </button>

            <div class="large-news-icon">
                ${article.icon}
            </div>

            <span class="news-category">
                ${article.category}
            </span>

            <h2>
                ${article.title}
            </h2>

            <p class="news-date">
                📅 ${article.date}
            </p>

            <p class="news-full-description">
                ${article.description}
            </p>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    popup.querySelector(
        ".close-news"
    ).addEventListener(
        "click",
        function () {

            popup.remove();

        }
    );


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                popup.remove();

            }

        }
    );

}


// ========================================
// LOAD EVENTS
// ========================================

async function loadEvents() {

    try {

        const response =
            await fetch(
                "data/events.json"
            );

        if (!response.ok) {

            throw new Error(
                "Could not load events data."
            );

        }

        events =
            await response.json();

        displayEvents();

    } catch (error) {

        console.error(error);

    }

}


// ========================================
// DISPLAY EVENTS
// ========================================

function displayEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    events.forEach(
        function (event) {

            const card =
                document.createElement("div");

            card.className =
                "event-card";


            card.innerHTML = `

                <div class="event-icon">
                    ${event.icon}
                </div>

                <div class="event-content">

                    <span class="event-celebrity">
                        ${event.celebrity}
                    </span>

                    <h3>
                        ${event.title}
                    </h3>

                    <p class="event-date">
                        📅 ${event.date}
                    </p>

                    <p class="event-location">
                        📍 ${event.location}
                    </p>

                    <p class="event-description">
                        ${event.description}
                    </p>

                    <button class="event-button">
                        View Event
                    </button>

                </div>

            `;


            card.querySelector(
                ".event-button"
            ).addEventListener(
                "click",
                function () {

                    showEventDetails(
                        event
                    );

                }
            );


            container.appendChild(card);

        }
    );

}


// ========================================
// EVENT POPUP
// ========================================

function showEventDetails(event) {

    const popup =
        document.createElement("div");

    popup.className =
        "event-popup show";


    popup.innerHTML = `

        <div class="event-popup-content">

            <button class="close-event">
                ✕
            </button>

            <div class="large-event-icon">
                ${event.icon}
            </div>

            <span class="event-celebrity">
                ${event.celebrity}
            </span>

            <h2>
                ${event.title}
            </h2>

            <p>
                📅 ${event.date}
            </p>

            <p>
                📍 ${event.location}
            </p>

            <p class="event-full-description">
                ${event.description}
            </p>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    popup.querySelector(
        ".close-event"
    ).addEventListener(
        "click",
        function () {

            popup.remove();

        }
    );


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                popup.remove();

            }

        }
    );

}


// ========================================
// EVENT FILTER
// ========================================

function filterEvents() {

    const searchInput =
        document.getElementById(
            "eventSearchInput"
        );

    const searchText =
        searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    const eventCards =
        document.querySelectorAll(
            ".event-card"
        );


    eventCards.forEach(
        function (card) {

            const eventText =
                card.textContent
                    .toLowerCase();


            let categoryMatch = true;


            if (
                currentEventCategory ===
                "Music"
            ) {

                categoryMatch =
                    eventText.includes("music") ||
                    eventText.includes("concert") ||
                    eventText.includes("tour") ||
                    eventText.includes("singer");

            }


            else if (
                currentEventCategory ===
                "Movies"
            ) {

                categoryMatch =
                    eventText.includes("movie") ||
                    eventText.includes("film") ||
                    eventText.includes("cinema") ||
                    eventText.includes("actor") ||
                    eventText.includes("actress");

            }


            else if (
                currentEventCategory ===
                "K-pop"
            ) {

                categoryMatch =
                    eventText.includes("bts") ||
                    eventText.includes("aespa") ||
                    eventText.includes("itzy") ||
                    eventText.includes("mamamoo") ||
                    eventText.includes("k-pop");

            }


            else if (
                currentEventCategory ===
                "TV"
            ) {

                categoryMatch =
                    eventText.includes("tv") ||
                    eventText.includes("television") ||
                    eventText.includes("series") ||
                    eventText.includes("show");

            }


            else if (
                currentEventCategory ===
                "Festival"
            ) {

                categoryMatch =
                    eventText.includes("festival") ||
                    eventText.includes("global citizen");

            }


            const searchMatch =
                eventText.includes(
                    searchText
                );


            if (
                categoryMatch &&
                searchMatch
            ) {

                card.style.display = "";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// EVENT SEARCH + FILTER BUTTONS
// ========================================

function setupEventFilters() {

    const searchInput =
        document.getElementById(
            "eventSearchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterEvents
        );

    }


    const buttons =
        document.querySelectorAll(
            ".event-filter"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    currentEventCategory =
                        this.dataset.category;


                    filterEvents();

                }
            );

        }
    );

}


// ========================================
// CELEBRITY FILTER BUTTONS
// ========================================

function setupCelebrityFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    if (
                        this.id ===
                        "favoritesButton"
                    ) {

                        currentCategory =
                            "Favorites";

                        showFavorites();

                        return;

                    }


                    currentCategory =
                        this.dataset.category ||
                        "All";


                    filterCelebrities();

                }
            );

        }
    );

}


// ========================================
// SEARCH CELEBRITIES
// ========================================

function setupCelebritySearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            if (
                currentCategory ===
                "Favorites"
            ) {

                showFavorites();

            } else {

                filterCelebrities();

            }

        }
    );

}


// ========================================
// START WEBSITE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTheme();

        createProfilePopup();

        setupCelebritySearch();

        setupCelebrityFilters();

        setupEventFilters();

        loadCelebrities();

        loadNews();

        loadEvents();

    }
);



function setupFanZoneModal() {
    const fanZoneBtn = document.querySelector('.fan-zone button');
    const modal = document.getElementById('fanZoneModal');
    const closeBtn = document.getElementById('closeFanZone');
    
    const step1 = document.getElementById('fanStep1');
    const step2 = document.getElementById('fanStep2');
    const loginForm = document.getElementById('fanLoginForm');
    
    const chatForm = document.getElementById('fanChatForm');
    const chatBox = document.getElementById('chatBox');
    const welcomeMsg = document.getElementById('welcomeUserMsg');

    let currentUserName = "";

    if (!fanZoneBtn || !modal) return;

    // Open Modal
    fanZoneBtn.addEventListener('click', function () {
        modal.classList.add('show');
    });

    // Close Modal
    closeBtn.addEventListener('click', function () {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('show');
    });

    // Handle Login (Step 1 -> Step 2)
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('loginName').value.trim();
        
        if (nameInput) {
            currentUserName = nameInput;
            welcomeMsg.textContent = `Welcome, ${currentUserName}! Share thoughts & download wallpapers!`;
            
            step1.style.display = 'none'; // Hide Form
            step2.style.display = 'block'; // Show Community Box
        }
    });

    // Handle Commenting (Step 2)
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const commentInput = document.getElementById('fanComment');

        if (commentInput.value.trim()) {
            const newMsg = document.createElement('div');
            newMsg.className = 'chat-message';
            newMsg.innerHTML = `<strong>${currentUserName}:</strong> ${commentInput.value}`;
            
            chatBox.appendChild(newMsg);
            chatBox.scrollTop = chatBox.scrollHeight;

            commentInput.value = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupFanZoneModal();
});
/* =================================
   CREATE COLORFUL STARS
   ================================= */

const starsContainer = document.querySelector(".stars");

const colors = [
    "pink",
    "purple",
    "blue",
    "gold",
    "white"
];

for (let i = 0; i < 70; i++) {

    const star = document.createElement("span");

    star.classList.add(
        "star",
        colors[Math.floor(Math.random() * colors.length)]
    );

    /* Random position */
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    /* Random size */
    const size = Math.random() * 5 + 2;

    star.style.width = size + "px";
    star.style.height = size + "px";

    /* Random animation speed */
    star.style.animationDuration =
        (Math.random() * 2 + 1.5) + "s";

    /* Random delay */
    star.style.animationDelay =
        (Math.random() * 4) + "s";

    starsContainer.appendChild(star);
}