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

// Helper to update the dashboard stats dynamically
function updateStats() {
    const total = stories.length;
    
    // Count occurrences of each status using JavaScript array filter
    const ideaCount = stories.filter(story => story.status === 'Idea').length;
    const scriptingCount = stories.filter(story => story.status === 'Scripting').length;
    const recordingCount = stories.filter(story => story.status === 'Recording').length;

    // Inject the numbers into the HTML
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-idea').textContent = ideaCount;
    document.getElementById('stat-scripting').textContent = scriptingCount;
    document.getElementById('stat-recording').textContent = recordingCount;
}

// 3. Render all existing stories from our database on startup
function renderStories() {
    // Clear out the grid first to avoid duplicating cards
    storyGrid.innerHTML = '';

    stories.forEach((story, index) => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('story-card');

        // Check if there is an image.
        const imageHTML = story.thumbnail ? `<img src="${story.thumbnail}" class="card-image" alt="${story.title}">` : '';

        // We replaced the static status-tag span with an interactive select element
        storyCard.innerHTML = `
            ${imageHTML}
            <div class="card-body">
                <div class="card-tags">
                    <span class="card-genre">${story.genre}</span>
                    <select class="status-dropdown ${story.status}" onchange="updateStoryStatus(${index}, this.value)">
                        <option value="Idea" ${story.status === 'Idea' ? 'selected' : ''}>💡 Idea</option>
                        <option value="Scripting" ${story.status === 'Scripting' ? 'selected' : ''}>✍️ Scripting</option>
                        <option value="Recording" ${story.status === 'Recording' ? 'selected' : ''}>🎙️ Ready</option>
                    </select>
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

// 6.5 Update Story Status directly from the card
window.updateStoryStatus = function(index, newStatus) {
    // Update the status of the specific story in our state array
    stories[index].status = newStatus;
    
    // Save to database & refresh screen
    saveToLocalStorage();
    renderStories();
};

// 7. Combined Search and Genre Filter Logic
const filterGenreInput = document.getElementById('filter-genre');

function applyFilters() {
    const searchText = searchBar.value.toLowerCase();
    const selectedGenre = filterGenreInput.value;
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach((card, index) => {
        // Find the story object in our array that matches this card's order
        const story = stories[index];
        if (!story) return;

        // Check if card matches Search text
        const matchesSearch = story.title.toLowerCase().includes(searchText) || 
                              story.notes.toLowerCase().includes(searchText);

        // Check if card matches Selected Genre dropdown
        const matchesGenre = (selectedGenre === 'All') || (story.genre === selectedGenre);

        // ONLY show the card if it meets BOTH criteria!
        if (matchesSearch && matchesGenre) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Listen for both typing (input) and dropdown selection updates (change)
if (searchBar) {
    searchBar.addEventListener('input', applyFilters);
}
if (filterGenreInput) {
    filterGenreInput.addEventListener('change', applyFilters);
}

// 7.5 Wiping the Board State Clean
window.clearEntireBoard = function() {
    // Show a native browser confirmation dialog to prevent accidents
    const userConfirmed = confirm("Are you absolutely sure you want to clear your entire content board? This cannot be undone.");
    
    if (userConfirmed) {
        // Clear out our global application state array
        stories = [];
        
        // Push the empty state to localStorage to clear the browser database
        saveToLocalStorage();
        
        // Re-render the application (wipes cards and drops stats to 0)
        renderStories();
    }
};

// 8. Initial draw of the board on page load
renderStories();
updateStats();