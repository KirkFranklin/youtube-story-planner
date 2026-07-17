// 1. Select the DOM elements
const storyForm = document.getElementById('story-form');
const storyTitleInput = document.getElementById('story-title');
const storyGenreInput = document.getElementById('story-genre');
const storyStatusInput = document.getElementById('story-status');
const storyThumbnailInput = document.getElementById('story-thumbnail');
const storyNotesInput = document.getElementById('story-notes');
const storyGrid = document.getElementById('story-grid');
const searchBar = document.getElementById('search-bar');

// 2. Initialize our application state from localStorage
let stories = JSON.parse(localStorage.getItem('savedStories')) || [];

// 3. Render all existing stories from our database on startup
function renderStories() {
    // Clear out the grid first to avoid duplicating cards
    storyGrid.innerHTML = '';

    stories.forEach((story, index) => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('story-card');

        // Check if there is an image.
        const imageHTML = story.thumbnail ? `<img src="${story.thumbnail}" class="card-image" alt="${story.title}">` : '';

        // Notice the distinct classes: .card-body, .card-tags, h3, p
        storyCard.innerHTML = `
            ${imageHTML}
            <div class="card-body">
                <div class="card-tags">
                    <span class="card-genre">${story.genre}</span>
                    <span class="status-tag ${story.status}">${story.status}</span>
                </div>
                <h3>${story.title}</h3>
                <p>${story.notes}</p>
                <button class="delete-btn" onclick="deleteStory(${index})">Delete Card 🗑️</button>
            </div>
        `;

        storyGrid.appendChild(storyCard);
    });
}

// 4. Save stories array to localStorage
function saveToLocalStorage() {
    localStorage.setItem('savedStories', JSON.stringify(stories));
}

// 5. Handle Form Submission
storyForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const file = storyThumbnailInput.files[0];

    // If the user uploaded a thumbnail, convert to Base64 (text), then save.
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            createAndSaveStory(reader.result);
        };
    } else {
        createAndSaveStory(null);
    }
});

// Helper function to bundle variables and save
function createAndSaveStory(imageString) {
    const newStory = {
        title: storyTitleInput.value,
        genre: storyGenreInput.value,
        status: storyStatusInput.value,
        notes: storyNotesInput.value,
        thumbnail: imageString
    };

    stories.push(newStory);
    saveToLocalStorage();
    renderStories();

    // Reset the form
    storyForm.reset();
}

// 6. Delete Story function (Declared globally)
window.deleteStory = function(index) {
    stories.splice(index, 1);
    saveToLocalStorage();
    renderStories();
};

// 7. Search and Filter Logic
if (searchBar) {
    searchBar.addEventListener('input', function(e) {
        const searchText = e.target.value.toLowerCase();
        const storyCards = document.querySelectorAll('.story-card');

        storyCards.forEach(card => {
            const h3Element = card.querySelector('h3');
            const pElement = card.querySelector('p');

            // Fallback check if elements exist inside the card
            const title = h3Element ? h3Element.textContent.toLowerCase() : '';
            const notes = pElement ? pElement.textContent.toLowerCase() : '';

            if (title.includes(searchText) || notes.includes(searchText)) {
                card.style.display = 'flex'; // Shows card
            } else {
                card.style.display = 'none'; // Hides card
            }
        });
    });
}

// 8. Initial draw of the board on page load
renderStories();