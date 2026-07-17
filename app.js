// 1. Select the DOM elements
const storyForm = document.getElementById('story-form');
const storyTitleInput = document.getElementById('story-title');
const storyGenreInput = document.getElementById('story-genre');
const storyStatusInput = document.getElementById('story-status');
const storyThumbnailInput = document.getElementById('story-thumbnail');
const storyNotesInput = document.getElementById('story-notes');
const storyGrid = document.getElementById('story-grid');

// 2. Initialize our application state from localStorage
// If there are saved stories, parse the string back into an array. If not, start with an empty array.
let stories = JSON.parse(localStorage.getItem('savedStories')) || [];

// 3. Render all existing stories from our database on startup
function renderStories() {
    // Clear out the grid first to avoid duplicating cards
    storyGrid.innerHTML = '';

    stories.forEach((story, index) => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('story-card');

        // Check if there is an image. If not, we don't render the image element.
        const imageHTML = story.thumbnail ? `` : '';

        storyCard.innerHTML = `
            ${imageHTML}
            
                
                    ${story.genre}
                    ${story.status}
                
                ${story.title}
                ${story.notes}
                Delete Card 🗑️
            
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

    // If the user uploaded a thumbnail, convert it to Base64 (text), then save.
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            createAndSaveStory(reader.result); // reader.result contains the base64 string
        };
    } else {
        createAndSaveStory(null); // No image uploaded
    }
});

// Helper function to bundle variables and save
function createAndSaveStory(imageString) {
    const newStory = {
        title: storyTitleInput.value,
        genre: storyGenreInput.value,
        status: storyStatusInput.value,
        notes: storyNotesInput.value,
        thumbnail: imageString // Text-encoded image!
    };

    // Add new story to our array, save to localStorage, and re-render
    stories.push(newStory);
    saveToLocalStorage();
    renderStories();

    // Reset the form
    storyForm.reset();
}

// 6. Delete Story function
// This is exposed globally because we inline it in the HTML button onclick attribute
window.deleteStory = function(index) {
    // Remove the item at the specified index from our stories array
    stories.splice(index, 1);
    // Sync the updated array to localStorage
    saveToLocalStorage();
    // Re-render the display board to show the new state
    renderStories();
};

// 7. Initial draw of the board on page load
renderStories();