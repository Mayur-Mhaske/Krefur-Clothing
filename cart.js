// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const index = cart.findIndex(item => item.name === name);
  if (index >= 0) cart[index].qty += 1;
  else cart.push({ name, price, qty: 1 });
  saveCart();
  alert('Added to cart!');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartIcon')) {
    document.getElementById('cartIcon').onclick = showCartModal;
  }
  if (document.getElementById('personIconTop')) {
    document.getElementById('personIconTop').onclick = () => alert('Login/Profile coming soon!');
  }
  if (document.getElementById('personIconBottom')) {
    document.getElementById('personIconBottom').onclick = () => alert('Login/Profile coming soon!');
  }
});

function showCartModal() {
  const modalHtml = `
  <div class="modal fade" id="cartModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Your Cart</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">${generateCartHTML()}</div>
        <div class="modal-footer">
          <button class="btn btn-success" onclick="checkout()">Checkout</button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('modals')?.remove();
  const div = document.createElement('div');
  div.id = 'modals';
  div.innerHTML = modalHtml;
  document.body.appendChild(div);
  new bootstrap.Modal(document.getElementById('cartModal')).show();
}

function generateCartHTML() {
  if (!cart.length) return `<p>Your cart is empty.</p>`;
  return cart.map(i => `<div class="d-flex justify-content-between"><span>${i.name}</span><span>₹${i.price} x ${i.qty}</span></div>`).join('')
    + `<hr><div class="text-end fw-bold">Total: ₹${cart.reduce((s, i) => s + i.price * i.qty, 0)}</div>`;
}

function checkout() {
  const address = prompt("Enter Address (Name, Address, City, Pincode, Phone):");
  if (!address) return;
  const parts = address.split(',');
  const order = {
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    address: {
      name: parts[0]?.trim(),
      address: parts[1]?.trim(),
      city: parts[2]?.trim(),
      pincode: parts[3]?.trim(),
      phone: parts[4]?.trim()
    },
    date: new Date().toLocaleString()
  };
  const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  history.push(order);
  localStorage.setItem('orderHistory', JSON.stringify(history));
  cart = [];
  saveCart();
  alert("Order placed successfully!");
  bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
}
