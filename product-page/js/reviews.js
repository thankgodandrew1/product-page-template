$(document).ready(function () {
  let currentProductID; // this variable holds the ID of the currently viewed product, this enables reviews of a particular product not show up in others 

  // initializes reviews for the given productID
  window.initializeReviews = function (productID) {
    currentProductID = productID; // sets the current product ID
    loadReviews(currentProductID); // load reviews for the product
    updateProductRating(currentProductID); // updates product rating display - num
  };

  // click event for 'Write a Review' button
  $(document).on('click', '.write-review', function () {
    // this checks if the review form is already present on the page
    if ($('.review-form').length === 0) {
      $(this).hide(); // if it is it hides the 'Write a Review' button
      // append the review form to the reviews section
      $('.reviews').append(`
          <div class='review-form'>
            <input type='text' id='name' placeholder='Your Name' required><br>
            <input type='number' id='rating' min='1' max='5' placeholder='Rating (1-5)' required><br>
            <textarea id='comment' placeholder='Your Review' required></textarea><br>
            <button class='submit-review'>Submit Review</button>
          </div>
        `);
    }
  });

  // click event for 'Submit Review' button
  $(document).on('click', '.submit-review', function () {
    // retrives and trim the input values
    const name = $('#name').val().trim();
    const rating = $('#rating').val().trim();
    const comment = $('#comment').val().trim();

    // input validations to see if all fields are filled
    if (name && rating && comment) {
      const review = { username: name, rating: parseInt(rating), comment };
      saveReview(currentProductID, review); // if tits filled, save the review
      loadReviews(currentProductID); // then reload the reviews section to show the new review made
      $('.review-form').remove(); // gets rid of the review form
      $('.write-review').show(); // then show the 'Write a Review' button again
    } else {
      alert('Please fill in all fields.'); // sends an alert to the client if any field is missing
    }
  });

  // this basically loads reviews for a given productID
  function loadReviews(productID) {
    // fetch product data from the server :) or i could say JSON
    $.getJSON(
      'https://thankgodandrew1.github.io/products-json/products/products.json',
      function (data) {
        // find the product with the specified ID
        const product = data.products.find((p) => p.id === productID);
        const jsonReviews = product.reviews || []; // Rretrive the reviews from the json data structure
        const localReviews =
          JSON.parse(localStorage.getItem(`reviews_${productID}`)) || []; // same with the one from localStorage
        const allReviews = jsonReviews.concat(localReviews); // then combine both the server and local reviews together into the section

        displayReviews(allReviews); // then display the combined reviews
        updateProductRating(allReviews.length); // and then  the product rating display
      }
    );
  }

  // this save a new review to localStorage
  function saveReview(productID, review) {
    const reviews =
      JSON.parse(localStorage.getItem(`reviews_${productID}`)) || []; // retrieves the existing reviews or initialize as empty
    reviews.push(review); // add the new review
    localStorage.setItem(`reviews_${productID}`, JSON.stringify(reviews)); // save reviews  update to localStorage
  }

  // func. to display reviews on the page
  function displayReviews(reviews) {
    const reviewsContainer = $('.review-list');
    reviewsContainer.empty(); // clear the existing reviews

    // show the initial 2 reviews
    reviews.slice(0, 2).forEach((review) => {
      const reviewDiv = document.createElement('div');
      reviewDiv.className = 'review';
      reviewDiv.innerHTML = `
          <p><strong>${review.username}</strong> ★★★★★ (${review.rating})</p>
          <p>${review.comment}</p>
        `;
      reviewsContainer.append(reviewDiv);
    });

    // and then a loading animation while loading more reviews
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'loading-animation';
    loadingAnimation.textContent = 'Loading more reviews...';
    reviewsContainer.append(loadingAnimation);

    // then show the remaining reviews after a delay of 5 sec
    setTimeout(() => {
      loadingAnimation.style.display = 'block';

      setTimeout(() => {
        loadingAnimation.style.display = 'none'; // Hide loading animation
        reviews.slice(2).forEach((review) => {
          const reviewDiv = document.createElement('div');
          reviewDiv.className = 'review';
          reviewDiv.innerHTML = `
              <p><strong>${review.username}</strong> ★★★★★ (${review.rating})</p>
              <p>${review.comment}</p>
            `;
          reviewsContainer.append(reviewDiv);
        });

        // adds the Write a Review' button after displaying all reviews
        const writeReviewButton = document.createElement('button');
        writeReviewButton.className = 'write-review';
        writeReviewButton.textContent = 'Write a Review';
        reviewsContainer.append(writeReviewButton);
      }, 5000); // delay before showing remaining reviews - 5 secs
    }, 1000); // the initial delay for showing loading animation - 1 sec
  }

  // this updates the product rating display
  function updateProductRating(reviewCount) {
    // with the number of reviews
    $('.product-info .rating').text(`⭐⭐⭐⭐⭐ (${reviewCount} reviews)`);
    $('.review-summary').text(`★★★★★ (${reviewCount} reviews)`);
  }
});
