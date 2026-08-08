const products = [
  {
    id: 1,
    name: "Laptop",
    price: 850,
    category: "electronics"
  },
  {
    id: 2,
    name: "Headphones",
    price: 120,
    category: "electronics"
  },
  {
    id: 3,
    name: "T-Shirt",
    price: 25,
    category: "clothing"
  },
  {
    id: 4,
    name: "Shoes",
    price: 70,
    category: "clothing"
  }
];

let cart = [];

function addToCart(productId) {
  const product = products.find(product => product.id === productId);

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  renderCart();
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function renderCart() {
  console.log(cart);
  console.log("Total: $" + calculateTotal());
}