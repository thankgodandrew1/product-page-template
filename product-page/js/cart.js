$(document).ready(function () {
  // dis function basically updates the cart icon with the current number of items
  function updateCartIcon() {
    // retrieve the cart from localStorage, or initialize cart as an empty array if the cart is noto found
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // get the total number of items in the cart
    const itemCount = cart.length;

    // this coe lines would update the cart icon's item count display
    if (itemCount > 0) {
      $('.cart-icon .cart-count').text(itemCount).show();
    } else {
      $('.cart-icon .cart-count').hide();
    }
  }

  // in order not to create a page for the cart, created a modal these lines updates the cart modal with the current cart items
  function updateCartModal() {
    // retrieves the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = $('.cart-items');
    cartItemsContainer.empty();

    // initially sets total price to 0
    let total = 0;

    // run a for loop over each item in the cart and create HTML for it
    cart.forEach((item) => {
      total += item.price * item.quantity; // calculate the total price based on the quantity of  a particular product in the cart
      const itemElement = $(`
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <h3>${item.title}</h3>
          <p>Color: ${item.color}</p>
          <p>Price: $${item.price.toFixed(2)}</p>
          <p>Quantity: 
            <button class="decrease-quantity">-</button> ${item.quantity} 
            <button class="increase-quantity">+</button>
          </p>
          <button title='Remove from cart' class="remove-from-cart" data-id="${
            item.id
          }">❌</button>
          <hr>
        </div>
      `);
      cartItemsContainer.append(itemElement);
    });

    // this jsut the total price displayed in the modal
    $('.cart-total').text(`Total: $${total.toFixed(2)}`);

    // event handler for increasing the item quantity
    $('.increase-quantity').on('click', function () {
      const itemID = $(this)
        .closest('.cart-item')
        .find('.remove-from-cart')
        .data('id');
      updateItemQuantity(itemID, 1); // increase the quantity by 1
    });

    // event handler for decreasing item quantity
    $('.decrease-quantity').on('click', function () {
      const itemID = $(this)
        .closest('.cart-item')
        .find('.remove-from-cart')
        .data('id');
      updateItemQuantity(itemID, -1); // decreases quantity by 1
    });

    // event handler for removing an item from the cart
    $('.remove-from-cart').on('click', function () {
      const itemID = $(this).data('id');
      removeFromCart(itemID); //removes item from cart base on the item id
    });
  }

  // this function updates the quantity of an item in the cart
  function updateItemQuantity(id, change) {
    // retrieves the cart from local-storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find((i) => i.id === id); // find the item in the cart still based on the ID

    if (item) {
      item.quantity += change; // then update the item's quantity
      if (item.quantity <= 0) {
        cart = cart.filter((i) => i.id !== id); // thten removes the item if the quantity is 0 or less
      }
      localStorage.setItem('cart', JSON.stringify(cart)); // Saves  theh update to cart to localStorage
      updateCartIcon(); // updates cart icon display (number on the cart icon)
      updateCartModal(); // update cart modal display
    }
  }

  // removes an item from the cart
  function removeFromCart(id) {
    // get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((item) => item.id !== id); // filter out the item to be removed
    localStorage.setItem('cart', JSON.stringify(cart)); // save updated cart to localStorage
    updateCartIcon(); // update cart icon display
    updateCartModal(); // same with cart modal display
  }

  // this function is to show a notification when the add to art icon is clickes
  function showNotification() {
    $('.notification').addClass('show'); // display the notification
    setTimeout(() => {
      $('.notification').removeClass('show'); // hiides the notification after 4 seconds
    }, 4000);
  }

  // an event handler for clicking the cart icon to show the cart modal
  $('.cart-icon').on('click', function () {
    $('.cart-modal').fadeIn(); // Show the cart modal
    updateCartModal(); // update the cart modal with current cart items
  });

  // event handler for closing the cart modal
  $('.close-cart-modal, .close-modal').on('click', function () {
    $('.cart-modal').fadeOut(); // hides the cart modal fade out animation adde
  });

  // initializes the  cart icon display when the page loads
  updateCartIcon();

  // export these functions for use in other scripts
  window.updateCartIcon = updateCartIcon;
  window.updateCartModal = updateCartModal;
  window.showNotification = showNotification;
});
