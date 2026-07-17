// 1. Select the DOM elements we need to work with
const storyForm = document.getElementById('story-form');
const storyTitleInput = document.getElementById('story-title');
const storyGenreInput = document.getElementById('story-genre');
const storyNotesInput = document.getElementById('story-notes');
const storyGrid = document.getElementById('story-grid');

// 2. Add an event listener for when the form is submitted
storyForm.addEventListener('submit', function(e) {
    // Prevent the page from refreshing when we submit the form
    e.preventDefault();

    // Get the values currently typed into the inputs
    const title = storyTitleInput.value;
    const genre = storyGenreInput.value;
    const notes = storyNotesInput.value;

    // Create a new card element
    const storyCard = document.createElement('div');
    storyCard.classList.add('story-card');

    // Add the HTML structure inside the card
    storyCard.innerHTML = `
        <div class="card-header">
            <span class="card-genre">${genre}</span>
        </div>
        <h3>${title}</h3>
        <p>${notes}</p>
        <button class="delete-btn">Delete Card 🗑️</button>
    `;

    // Add functionality to the delete button inside this specific card
    const deleteBtn = storyCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        storyCard.remove();
    });

    // Append our new story card to the display grid
    storyGrid.appendChild(storyCard);

    // Clear the form fields so we can type a new idea
    storyForm.reset();
});