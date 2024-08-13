$(document).ready(async function () {
  //   i stored 3 products in a json file and pushed to GitHub pages
  //   this line fetches product data from the URL
  const response = await fetch(
    'https://thankgodandrew1.github.io/products-json/products/products.json'
  );
  const data = await response.json();
  const products = data.products;

  // 3 products in the json this line would randomomly fetch product from the product list
  const randomProduct = products[Math.floor(Math.random() * products.length)];

  //   stores the randomly selected product's ID to the productID variable for future use
  const productID = randomProduct.id;

  // this ine updates the main product image and its alternative text with the one from the JSON file using JQuery
  $('.main-image')
    .attr('src', randomProduct.images.main)
    .attr('alt', randomProduct.title);

  //   same with the product title and price of the randomly selected product
  $('.product-info h1').text(randomProduct.title);
  $('.product-info .price').text(`$${randomProduct.price}`);

  // fetch and initialize reviews for the randomly selected product
  $.getScript('js/reviews.js', function () {
    window.initializeReviews(productID);
  });

  // dom manipulation for the product description
  $('.product-info .description').text(randomProduct.description);

  // same with the product image thumbnails
  const thumbnailsContainer = $('.thumbnails');
  thumbnailsContainer.empty();
  $.each(randomProduct.images.thumbnails, function (index, thumbnail) {
    const img = $('<img>').attr('src', thumbnail).attr('alt', 'Thumbnail');
    thumbnailsContainer.append(img);
  });

  // same with the size options in the size dropdown
  const sizeSelect = $('#size').empty();
  $.each(randomProduct.options.sizes, function (index, size) {
    const option = $('<option>').val(size.toLowerCase()).text(size);
    sizeSelect.append(option);
  });

  // same with the color products options in the color dropdown
  const colorSelect = $('#color').empty();
  $.each(randomProduct.options.colors, function (index, color) {
    const option = $('<option>').val(color.toLowerCase()).text(color);
    colorSelect.append(option);
  });

  // same with the product details section, update with the description for the randomly selected products
  $('.product-details h2')
    .eq(0)
    .next('p')
    .text(randomProduct.details.description);

  // this updates and displays product specifications
  // i initially didn't create seperate  objects for the specifications, all spec were in  a single obj. so i had to think of a way to split each spec to a seperate line
  const specificationsList = randomProduct.details.specifications.split(';');
  const specificationsContainer = $('.product-details h2')
    .eq(1)
    .next('p')
    .empty();
  $.each(specificationsList, function (index, spec) {
    const specItem = $('<div>').text(spec.trim());
    specificationsContainer.append(specItem);
  });

  // dom man: updates additional information in the product details section
  $('.product-details h2')
    .eq(2)
    .next('p')
    .text(randomProduct.details.additionalInfo);

  // same here for the related products section
  const relatedProductsContainer = $('.related-products').empty();
  relatedProductsContainer.html(`
      <h2>Recommended Products</h2>
      <div class='product-grid'></div>
    `);

  const productGrid = relatedProductsContainer.find('.product-grid');
  $.each(randomProduct.recommendedProducts, function (index, product) {
    const div = $('<div>').addClass('product').html(`
        <img src='${product.image}' alt='${product.title}'>
        <p>${product.title}</p>
        <p>$${product.price}</p>
        <button class='add-to-cart'>Add to Cart</button>
      `);
    productGrid.append(div);
  });

  // cretas code fot the click events on "Add to Cart" buttons
  $('.add-to-cart').on('click', function () {
    const productTitle = $('.product-info h1').text();
    const productPrice = parseFloat(
      $('.product-info .price').text().replace('$', '')
    );
    const productID = randomProduct.id;
    const quantity = parseInt($('#quantity').val());
    const productColor = $('#color').val();
    const productImage = $('.main-image').attr('src');

    // save the product to local storage or update existing productentry
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.id === productID);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({
        id: productID,
        title: productTitle,
        price: productPrice,
        quantity,
        color: productColor,
        image: productImage,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // this basically woul update d cart icon if the function is defined
    if (window.updateCartIcon) window.updateCartIcon();
    // a success notification if the function is defined
    if (window.showNotification) window.showNotification();
  });

  // imports carousel functionality for the product;s thumbnails
  $.getScript('js/carousel.js');
});
