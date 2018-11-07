const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Form event listener
searchForm.addEventListener('submit', function (e) {
  // get search term
  const searchTerm = searchInput.value;
  const sortBy = document.querySelector("input[name='sortby']:checked").value;
  const searchLimit = document.getElementById('limit').value;

  if (searchTerm === '') {
    showMessage("Please add a search term.", "alert-danger");
  }


  search(searchTerm, searchLimit, sortBy);
  e.preventDefault();
});


function search(searchTerm, searchLimit, sortBy) {
  fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
    .then(res => res.json())
    .then(data => data.data.children.map(data => data.data))
    .then(results => {
      let output = '<div class="card-columns">';

      // Loop through posts
      results.forEach(post => {
        // CHeck for image
        const image = post.preview ? post.preview.images[0].source.url : 'https://cdn.vox-cdn.com/thumbor/OyJuiYH-nf6CdodLdrNC687SuvM=/0x0:640x427/1200x800/filters:focal(0x0:640x427)/cdn.vox-cdn.com/uploads/chorus_image/image/46682528/reddit_logo_640.0.jpg';

        output += `
            <div class="card">
              <img class="card-img-top" src="${image}" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateText(post.selftext, 100)}</p>
                <a href="${post.url}" target="_blank" class="btn btn-primary btn-sm">Read More</a>
                <hr>
                <span class="badge badge-secondary p-2">Subreddit: ${post.subreddit}</span>
                <span class="badge badge-success p-2">Score: ${post.score}</span>
              </div>
            </div>
            `;
      });

      output += '</div>';

      document.getElementById('results').innerHTML = output;

    })
    .catch(err => console.log(err));
}

// Show alert message
function showMessage(message, className) {
  const div = document.createElement('div');
  // Add class name
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById('search-container');
  const search = document.getElementById('search');

  // insert message
  searchContainer.insertBefore(div, search);

};

// Truncate Text
function truncateText(text, limit) {
  const shortend = text.indexOf(' ', limit);
  if(shortend === -1) return text;
  return text.substring(0, shortend);
}
