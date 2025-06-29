const mealsPizza = [
    { id: 1, name: "Pizza Margherita", description: "Klassische Pizza mit fruchtiger Tomatensauce, Mozzarella und frischem Basilikum", price: 12.50, image: "images/PizzaMahrgerita.webp" },
    { id: 2, name: "Pizza Tono", description: "Pizza mit Thunfisch, Zwiebeln und Tomatensauce – ein mediterraner Genuss", price: 13.50, image: "images/PizzaTono.webp" },
    { id: 3, name: "Pizza Funghi", description: "Aromatische Champignons auf Tomatensauce mit Mozzarella – vegetarisch und lecker", price: 15.00, image: "images/PizzaFunghi.jpeg" },
    { id: 4, name: "Pizza Prosciutto", description: "Mit feinem Kochschinken, Tomatensauce und geschmolzenem Mozzarella", price: 14.00, image: "images/PizzaProscutto.jpeg" },
    { id: 5, name: "Pizza Rohschinken", description: "Belegt mit Rohschinken und frischem Rucola – verfeinert mit Parmesan", price: 18.50, image: "images/PizzaRohschinken.jpeg" },
    { id: 6, name: "Pizza Diavolo", description: "Würzige Salami feurig-scharf und intensiv im Geschmack", price: 16.00, image: "images/PizzaSalami.webp" }
];

const mealsStarter = [
    { id: 101, name: "Tomatensuppe", description: "Hausgemachte Suppe aus sonnengereiften Tomaten, verfeinert mit Sahne und Basilikum", price: 6.00, image: "images/Tomatensuppe.webp" },
    { id: 102, name: "Pizza Brötchen", description: "Ofenfrische, goldbraune Brötchen mit Pizzagewürz und Käsefüllung", price: 4.50, image: "images/Pizzabrötchne.jpg" },
    { id: 103, name: "Gemischter Salat", description: "Frischer Salat mit knackigem Gemüse", price: 3.50, image: "images/mixedSalad.jpg" }
];

const mealsDrink = [
    { id: 201, name: "Cola", description: "Erfrischende Cola", price: 4.00, image: "images/coke.jpg" },
    { id: 202, name: "Fanta", description: "Fruchtig erfrischend", price: 4.00, image: "images/fanta.jpeg" },
    { id: 203, name: "Mineralwasser", description: "Natürliches Mineralwasser", price: 3.50, image: "images/sparklingWater.jpg" }
];

const availableMeals = { pizzas: mealsPizza, vorspeissen: mealsStarter, drinks: mealsDrink };
let activeGroup = 'pizzas';
let shoppingBag = [];
let orderIdCounter = 1;

const menuSection = document.getElementById('menu-container');
const bagModalPanel = document.getElementById('cart-modal');
const bagIcon = document.getElementById('cart-icon');
const closeBagButton = document.getElementById('close-modal');
const pageOverlay = document.getElementById('overlay');
const bagItemsWrapper = document.getElementById('cart-items');
const bagCountDisplay = document.getElementById('cart-count');
const totalCostDisplay = document.getElementById('total-price');
const placeOrderButton = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-button');

function displayMenuGroup(category) {
    menuSection.innerHTML = '';
    const items = availableMeals[category];
    items.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-img">
                <img src="${meal.image}" alt="${meal.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${meal.name}</h3>
                <p class="item-description">${meal.description}</p>
                <p class="item-price">${meal.price.toFixed(2).replace('.', ',')} CHF</p>
                <button class="add-to-cart" data-id="${meal.id}" data-category="${category}">In den Warenkorb</button>
            </div>`;
        menuSection.appendChild(card);
    });
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const mealId = parseInt(btn.getAttribute('data-id'));
            const mealCat = btn.getAttribute('data-category');
            addToBag(mealId, mealCat);
        });
    });
}

function addToBag(mealId, category) {
    const item = availableMeals[category].find(i => i.id === mealId);
    const existing = shoppingBag.find(i => i.id === mealId);
    if (existing) existing.quantity++;
    else shoppingBag.push({ ...item, quantity: 1 });
    refreshBag();
    bagIcon.style.transform = 'scale(1.2)';
    setTimeout(() => bagIcon.style.transform = 'scale(1)', 200);
}

function refreshBag() {
    showBagItems();
    bagCountDisplay.textContent = shoppingBag.reduce((sum, i) => sum + i.quantity, 0);
    totalCostDisplay.textContent = shoppingBag.reduce((sum, i) => sum + i.quantity * i.price, 0).toFixed(2).replace('.', ',') + ' CHF';
    localStorage.setItem('cart', JSON.stringify(shoppingBag));
}

function showBagItems() {
    bagItemsWrapper.innerHTML = shoppingBag.length ? '' : '<p>Dein Warenkorb ist leer.</p>';
    shoppingBag.forEach(item => {
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
        bagItemsWrapper.appendChild(div);
    });
    document.querySelectorAll('.decrease').forEach(b => b.onclick = () => adjustItemQuantity(b.dataset.id, -1));
    document.querySelectorAll('.increase').forEach(b => b.onclick = () => adjustItemQuantity(b.dataset.id, 1));
    document.querySelectorAll('.remove-item').forEach(b => b.onclick = () => removeItemFromBag(b.dataset.id));
}

function adjustItemQuantity(id, delta) {
    const item = shoppingBag.find(i => i.id === parseInt(id));
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) shoppingBag = shoppingBag.filter(i => i.id !== item.id);
    refreshBag();
}

function removeItemFromBag(id) {
    shoppingBag = shoppingBag.filter(i => i.id !== parseInt(id));
    refreshBag();
}

function showBagModal() {
    bagModalPanel.classList.add('active');
    pageOverlay.classList.add('active');
}

function hideBagModal() {
    bagModalPanel.classList.remove('active');
    pageOverlay.classList.remove('active');
}

function nowFormatted() {
    const now = new Date();
    return `${now.toLocaleDateString('de-CH')} ${now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatOrderDetails(order) {
    let txt = `Bestellnummer: #${order.order_number}\nTisch: ${order.table_number}\nBestellzeit: ${order.order_time}\nBestellung:\n`;
    order.order_items.forEach(i => txt += `${i.quantity}x ${i.name} - ${(i.price * i.quantity).toFixed(2).replace('.', ',')} CHF\n`);
    txt += `\nGesamt: ${order.order_items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2).replace('.', ',')} CHF`;
    return txt;
}

function storeOrderData(tableNumber) {
    if (!shoppingBag.length) return alert('Der Warenkorb ist leer.');
    const order = {
        order_number: orderIdCounter++,
        table_number: tableNumber,
        order_time: nowFormatted(),
        order_items: [...shoppingBag]
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

async function triggerOrderFlow() {
    if (!shoppingBag.length) return alert('Dein Warenkorb ist leer.');
    const tableNumber = prompt('Bitte geben Sie die Tischnummer ein:', '1');
    if (!tableNumber) return;

    const order = storeOrderData(tableNumber);

    // camunda usage
    const response = await fetch('http://localhost:8080/engine-rest/process-definition/key/restaurant-guest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            businessKey: `order-${order.order_number}`,
            variables: {
                orderNumber: { value: order.order_number, type: "Integer" },
                tableNumber: { value: parseInt(order.table_number), type: "Integer" },
                orderTime: { value: order.order_time, type: "String" },
                orderItems: { value: JSON.stringify(order.order_items, null, 2), type: "String" }
            }
        })
    });

    // camunda usage
    if (response.ok) {
        alert('Bestellung wurde an Camunda übermittelt:\n\n' + formatOrderDetails(order));
        shoppingBag = [];
        refreshBag();
        hideBagModal();
    } else {
        // camunda usage
        const errorText = await response.text();
        console.error(errorText);
        alert('Fehler beim Starten des Prozesses!');
    }
}

function showStoredOrders() {
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
        pre.textContent = formatOrderDetails(order);
        const btn = document.createElement('button');
        btn.textContent = 'Ausgeliefert';
        btn.onclick = () => { 
            const updated = orders.filter(o => o.order_number !== order.order_number);
            localStorage.setItem('orders', JSON.stringify(updated));
            div.remove(); 
        };
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

function setupEmployeeAccess() {
    const btn = document.createElement('button');
    btn.textContent = 'Mitarbeiterbereich';
    btn.className = 'employee-button';
    btn.onclick = () => {
        const pw = prompt('Bitte geben Sie das Mitarbeiterpasswort ein:');
        if (pw === 'admin') showStoredOrders();
        else alert('Falsches Passwort.');
    };
    document.querySelector('nav').appendChild(btn);
}

function init() {
    displayMenuGroup(activeGroup);
    const savedBag = localStorage.getItem('cart');
    if (savedBag) shoppingBag = JSON.parse(savedBag);
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (savedOrders.length > 0) orderIdCounter = Math.max(...savedOrders.map(o => o.order_number)) + 1;
    refreshBag();
    setupEmployeeAccess();
}

bagIcon.onclick = showBagModal;
closeBagButton.onclick = hideBagModal;
pageOverlay.onclick = hideBagModal;
placeOrderButton.onclick = triggerOrderFlow;
categoryButtons.forEach(btn => btn.onclick = () => {
    activeGroup = btn.dataset.category;
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    displayMenuGroup(activeGroup);
});

init();
