
const pizzas = [
    { id: 1, name: "Pizza Margherita", description: "Klassische Pizza mit fruchtiger Tomatensauce, Mozzarella und frischem Basilikum", price: 12.50, image: "images/PizzaMahrgerita.webp" },
    { id: 2, name: "Pizza Tono", description: "Pizza mit Thunfisch, Zwiebeln und Tomatensauce – ein mediterraner Genuss", price: 13.50, image: "images/PizzaTono.webp" },
    { id: 3, name: "Pizza Funghi", description: "Aromatische Champignons auf Tomatensauce mit Mozzarella – vegetarisch und lecker", price: 15.00, image: "images/PizzaFunghi.jpeg" },
    { id: 4, name: "Pizza Prosciutto", description: "Mit feinem Kochschinken, Tomatensauce und geschmolzenem Mozzarella", price: 14.00, image: "images/PizzaProscutto.jpeg" },
    { id: 5, name: "Pizza Rohschinken", description: "Belegt mit Rohschinken und frischem Rucola – verfeinert mit Parmesan", price: 18.50, image: "images/PizzaRohschinken.jpeg" },
    { id: 6, name: "Pizza Diavolo", description: "Würzige Salami feurig-scharf und intensiv im Geschmack", price: 16.00, image: "images/PizzaSalami.webp" }
];

const vorspeissen = [
    { id: 101, name: "Tomatensuppe", description: "Hausgemachte Suppe aus sonnengereiften Tomaten, verfeinert mit Sahne und Basilikum", price: 6.00, image: "images/Tomatensuppe.webp" },
    { id: 102, name: "Pizza Brötchen", description: "Ofenfrische, goldbraune Brötchen mit Pizzagewürz und Käsefüllung", price: 4.50, image: "images/Pizzabrötchne.jpg" },
    { id: 103, name: "Gemischter Salat", description: "Frischer Salat mit knackigem Gemüse", price: 3.50, image: "images/mixedSalad.jpg" }
];

const drinks = [
    { id: 201, name: "Cola", description: "Erfrischende Cola", price: 4.00, image: "images/coke.jpg" },
    { id: 202, name: "Fanta", description: "Fruchtig erfrischend", price: 4.00, image: "images/fanta.jpeg" },
    { id: 203, name: "Mineralwasser", description: "Natürliches Mineralwasser", price: 3.50, image: "images/sparklingWater.jpg" }
];

const menuItems = { pizzas, vorspeissen, drinks };
let currentCategory = 'pizzas';
let cart = [];
let orderCounter = 1;

const menuContainer = document.getElementById('menu-container');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeModal = document.getElementById('close-modal');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-button');

function renderMenu(category) {
    menuContainer.innerHTML = '';
    const items = menuItems[category];
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <div class="item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <p class="item-price">${item.price.toFixed(2).replace('.', ',')} CHF</p>
                <button class="add-to-cart" data-id="${item.id}" data-category="${category}">In den Warenkorb</button>
            </div>`;
        menuContainer.appendChild(itemCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            const itemCategory = button.getAttribute('data-category');
            addToCart(itemId, itemCategory);
        });
    });
}

function addToCart(itemId, category) {
    const item = menuItems[category].find(i => i.id === itemId);
    const existing = cart.find(i => i.id === itemId);
    if (existing) existing.quantity++;
    else cart.push({ ...item, quantity: 1 });
    updateCart();
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

function updateCart() {
    renderCartItems();
    cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    totalPrice.textContent = cart.reduce((sum, i) => sum + i.quantity * i.price, 0).toFixed(2).replace('.', ',') + ' CHF';
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
    cartItemsContainer.innerHTML = cart.length ? '' : '<p>Dein Warenkorb ist leer.</p>';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} CHF</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn decrease" data-id="${item.id}">–</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">🗑️</button>`;
        cartItemsContainer.appendChild(div);
    });
    document.querySelectorAll('.decrease').forEach(b => b.onclick = () => decreaseQuantity(parseInt(b.dataset.id)));
    document.querySelectorAll('.increase').forEach(b => b.onclick = () => increaseQuantity(parseInt(b.dataset.id)));
    document.querySelectorAll('.remove-item').forEach(b => b.onclick = () => removeFromCart(parseInt(b.dataset.id)));
}

function decreaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item.quantity > 1) item.quantity--;
    else cart = cart.filter(i => i.id !== id);
    updateCart();
}

function increaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    item.quantity++;
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function openCartModal() {
    cartModal.classList.add('active');
    overlay.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
}

function getCurrentDateTime() {
    const now = new Date();
    return `${now.toLocaleDateString('de-CH')} ${now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}`;
}

function createEmployeeOrderView(order) {
    let txt = `Bestellnummer: #${order.order_number}\nTisch: ${order.table_number}\nBestellzeit: ${order.order_time}\nBestellung:\n`;
    order.order_items.forEach(i => txt += `${i.quantity}x ${i.name} - ${(i.price * i.quantity).toFixed(2).replace('.', ',')} CHF\n`);
    txt += `\nGesamt: ${order.order_items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2).replace('.', ',')} CHF`;
    return txt;
}

function deleteOrderById(id) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify(orders.filter(o => o.order_number !== id)));
}

function viewAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (!orders.length) return alert('Keine Bestellungen vorhanden.');

    const container = document.createElement('div');
    container.style.padding = '1rem';
    orders.forEach(order => {
        const div = document.createElement('div');
        div.style.border = '1px solid #ccc';
        div.style.marginBottom = '1rem';
        div.style.padding = '0.5rem';
        const pre = document.createElement('pre');
        pre.textContent = createEmployeeOrderView(order);
        const btn = document.createElement('button');
        btn.textContent = 'Ausgeliefert';
        btn.onclick = () => { deleteOrderById(order.order_number); div.remove(); };
        div.append(pre, btn);
        container.appendChild(div);
    });
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '10%';
    modal.style.left = '50%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.background = '#fff';
    modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';
    modal.style.padding = '1rem';
    modal.style.zIndex = '9999';
    const close = document.createElement('button');
    close.textContent = 'Schließen';
    close.onclick = () => modal.remove();
    modal.append(container, close);
    document.body.appendChild(modal);
}

function saveOrder(tableNumber) {
    if (!cart.length) return alert('Der Warenkorb ist leer.');
    const order = {
        order_number: orderCounter++,
        table_number: tableNumber,
        order_time: getCurrentDateTime(),
        order_items: [...cart]
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

async function showOrderDialog() {
    if (!cart.length) return alert('Dein Warenkorb ist leer.');
    const tableNumber = prompt('Bitte geben Sie die Tischnummer ein:', '1');
    if (!tableNumber) return;

    const order = saveOrder(tableNumber);

    const response = await fetch('http://localhost:8080/engine-rest/process-definition/key/restaurant-guest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            businessKey: `order-${order.order_number}`,
            variables: {
                orderNumber: { value: order.order_number, type: "Integer" },
                tableNumber: { value: parseInt(order.table_number), type: "Integer" },
                orderTime: { value: order.order_time, type: "String" },
                orderItems: { value: JSON.stringify(order.order_items), type: "Json" }
            }
        })
    });

    if (response.ok) {
        alert('Bestellung wurde an Camunda übermittelt:\n\n' + createEmployeeOrderView(order));
        cart = [];
        updateCart();
        closeCartModal();
    } else {
        const errorText = await response.text();
        console.error(errorText);
        alert('Fehler beim Starten des Prozesses!');
    }
}


function addEmployeeSection() {
    const btn = document.createElement('button');
    btn.textContent = 'Mitarbeiterbereich';
    btn.className = 'employee-button';
    btn.onclick = () => {
        const pw = prompt('Bitte geben Sie das Mitarbeiterpasswort ein:');
        if (pw === 'admin123') viewAllOrders();
        else alert('Falsches Passwort.');
    };
    document.querySelector('nav').appendChild(btn);
}

function init() {
    renderMenu(currentCategory);
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) orderCounter = Math.max(...orders.map(o => o.order_number)) + 1;
    updateCart();
    addEmployeeSection();
}

cartIcon.onclick = openCartModal;
closeModal.onclick = closeCartModal;
overlay.onclick = closeCartModal;
checkoutBtn.onclick = showOrderDialog;
categoryButtons.forEach(btn => btn.onclick = () => {
    currentCategory = btn.dataset.category;
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(currentCategory);
});

init();