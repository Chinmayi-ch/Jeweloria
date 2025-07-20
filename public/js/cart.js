document.addEventListener("click", function (event) {
  if (event.target.matches(".buy-button")) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".buy-button").forEach((button) => {
    button.setAttribute("type", "button");
    console.log("Set button type to button:", button);
  });

  document.querySelectorAll(".buy-button").forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener("click", function (e) {
      handleCartButtonClick(e);
      return false;
    });
  });

  // Initialize cart
  updateCartUI();
});

function handleCartButtonClick(event) {
  console.log("🛒 Cart button handler activated");

  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble = true;
  }

  const button = event.target;
  console.log("Button clicked:", button);
  const productCard = button.closest(".product-card");
  if (!productCard) {
    console.error("Product card not found");
    return false;
  }

  const itemName = productCard.querySelector(".product-name")?.innerText;
  const itemPriceText = productCard.querySelector(".product-price")?.innerText;

  if (!itemName || !itemPriceText) {
    console.error("Product details missing");
    return false;
  }

  const itemPrice = parseFloat(itemPriceText.replace("$", ""));
  console.log("Adding to cart:", { name: itemName, price: itemPrice });
  button.innerText = "Adding...";
  button.disabled = true;

  // send data to the server
  fetch("http://localhost:5500/add_to_cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: itemName, price: itemPrice }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("✓ Item added to server:", data);
      button.innerText = "✓ Added";
    })
    .catch((error) => {
      console.error("Error adding item to cart:", error);
      button.innerText = "Error";
      button.disabled = false;
    });

  return false;
}

function updateCartUI() {
  console.log("Updating cart UI");
}
