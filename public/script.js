function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result).width(150).height(200);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.post');
  const popups = document.querySelectorAll('.popup');
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  posts.forEach((post, index) => {
    post.addEventListener('click', () => {
      popups[index].style.display = 'block';
      overlay.style.display = 'block';
    });
  });

  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      overlay.style.display = 'none';
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});




//GLAZE POPUP
document.addEventListener('DOMContentLoaded', () => {
  const glazePosts = document.querySelectorAll('.glazePost');
  const popups = document.querySelectorAll('.glaze-popup');
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  glazePosts.forEach((post, index) => {
    post.addEventListener('click', () => {
      popups[index].style.display = 'block';
      overlay.style.display = 'block';
    });
  });

  document.querySelectorAll('.close').forEach((closeButton, index) => {
    closeButton.addEventListener('click', () => {
      popups[index].style.display = 'none';
      overlay.style.display = 'none';
    });
  });

  overlay.addEventListener('click', () => {
    popups.forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';
  });
});


//IMAGES BUTTON
document.addEventListener('DOMContentLoaded', () => {
  const popups = document.querySelectorAll('.popup');
  popups.forEach((popup, index) => {
    const nextImageButton = popup.querySelector('.next-image');
    const imageElement = popup.querySelector('.popup-image');
    const imageFiles = posts[index].imageFiles;
    let currentImageIndex = 0;

    nextImageButton.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % imageFiles.length;
      imageElement.src = `/images/${imageFiles[currentImageIndex]}`;
    });
  });
});

//HTMX
 document.addEventListener('htmx:afterSwap', (event) => {
      if (event.detail.target.id === 'glaze-popup-content') {
        document.getElementById('glaze-popup-content').classList.add('active');
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('close')) {
        document.getElementById('glaze-popup-content').classList.remove('active');
      }
    });





//FILTERED ART
// script.js
document.addEventListener('DOMContentLoaded', function () {
  // Function to show/hide regular posts based on which glaze is clicked
  function toggleRegularPosts(glazeId) {
    const regularPosts = document.querySelectorAll('.regular-post-list .regularPost');
    
    // Hide all regular posts
    regularPosts.forEach(post => {
      post.style.display = 'none';
    });

    // Show regular posts associated with the clicked glaze
    const associatedRegularPosts = document.querySelectorAll(`.regular-post-list .regularPost[data-glaze-id="${glazeId}"]`);
    associatedRegularPosts.forEach(post => {
      post.style.display = 'block';
    });
  }

  // Add click event listeners to glaze posts
  const glazePosts = document.querySelectorAll('.glaze-post-list .glazePost');
  glazePosts.forEach(glazePost => {
    glazePost.addEventListener('click', function () {
      const glazeId = this.getAttribute('data-glaze-id');
      // Toggle regular posts based on the clicked glaze
      toggleRegularPosts(glazeId);
    });
  });
});


//search
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', updatePosts);
});

async function updatePosts() {
  try {
    const searchTerm = document.getElementById('searchInput').value;

    const response = await fetch('/searchPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
      const posts = await response.json();
      const container = document.getElementById('postsList');
      container.innerHTML = '';
      posts.forEach(post => {
        const postElement = `
          <div class="post" id="popupTrigger-${post._id}">
              <div class="image-container">
                <img class="post-image" src="/images/${post.imageFiles[0]}" alt="">
              </div>
              <h2 class="post-title">${post.title}</h2>
              <p class="post-author">${post.author ? post.author.username : 'Unknown Author'}</p>
            </div>
        `;
        container.innerHTML += postElement;
      });
    } else {
      console.error('Response not ok with status:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

//updatePosts();
