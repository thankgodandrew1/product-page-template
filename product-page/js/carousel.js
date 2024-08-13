$(document).ready(function () {
  // console.log('Carousel script loaded.');
  // retrive product thumbnails images and store them in a variable
  const thumbnails = $('.thumbnails img');

  // set the current index to zero - this just start at the first thumbnail
  let currentIndex = 0;

  // get references to the previous and next buttons
  const prevButton = $('.carousel-button.prev');
  const nextButton = $('.carousel-button.next');

  // updates the display of thumbnails based on the current index
  const updateThumbnails = function () {
    // loop through each thumbnail image
    thumbnails.each(function (index, img) {
      // display the thumbnails within the range of the current index and hide others
      $(img).css(
        'display',
        index >= currentIndex && index < currentIndex + 3 ? 'block' : 'none'
      );
    });

    //  this just shows or hides the previous button based on the current index
    prevButton.css('display', currentIndex === 0 ? 'none' : 'block');

    // same with the next button based on whether more thumbnails are available
    nextButton.css(
      'display',
      currentIndex >= thumbnails.length - 3 ? 'none' : 'block'
    );
  };

  // event for the previous button click
  prevButton.on('click', function () {
    if (currentIndex > 0) {
      currentIndex--; // moves to the previous set of thumbnails
      updateThumbnails(); // updates the display
    }
  });

  // handler for the next button click
  nextButton.on('click', function () {
    if (currentIndex < thumbnails.length - 3) {
      currentIndex++; //moves to the next thumbnails
      updateThumbnails(); 
    }
  });

  // an initial call to set up the thumbnails display
  updateThumbnails();
});
