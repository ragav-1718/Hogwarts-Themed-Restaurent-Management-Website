// Default menu items with real food images
const defaultMenu = {
    gryffindor: [
        { id: 'gryf-1', name: 'Shawarma', price: 12, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', house: 'gryffindor' },
        { id: 'gryf-2', name: 'Burger', price: 10, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', house: 'gryffindor' },
        { id: 'gryf-3', name: 'Sandwich', price: 8, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', house: 'gryffindor' }
    ],
    slytherin: [
        { id: 'slyt-1', name: 'Lemonade', price: 5, image: 'https://natashaskitchen.com/wp-content/uploads/2023/07/Lemonade-Recipe-3.jpg', house: 'slytherin' },
        { id: 'slyt-2', name: 'Mojito', price: 7, image: 'https://thenovicechefblog.com/wp-content/uploads/2021/02/Mojito-1.jpg', house: 'slytherin' },
        { id: 'slyt-3', name: 'Mint Juice', price: 4, image: 'https://www.sharmispassions.com/wp-content/uploads/2025/04/lemon-mint-juice11-683x1024.jpg', house: 'slytherin' }
    ],
    hufflepuff: [
        { id: 'huff-1', name: 'Idli', price: 6, image: 'https://www.thespruceeats.com/thmb/6j6Ne_4F62_uigRCvTZYVykcHhc=/2122x1415/filters:fill(auto,1)/idli-56a510b63df78cf772862c34.jpg', house: 'hufflepuff' },
        { id: 'huff-2', name: 'Dosa', price: 9, image: 'https://media.cntraveller.in/wp-content/uploads/2020/05/dosa-recipes-1366x768.jpg', house: 'hufflepuff' },
        { id: 'huff-3', name: 'Vada', price: 5, image: 'https://img.freepik.com/premium-photo/sambar-vada-medu-vada-popular-south-indian-food-served-with-green-red-coconut-chutney-moody-background-selective-focus_466689-59620.jpg', house: 'hufflepuff' }
    ],
    ravenclaw: [
        { id: 'rave-1', name: 'Grill', price: 15, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', house: 'ravenclaw' },
        { id: 'rave-2', name: 'Fries', price: 6, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', house: 'ravenclaw' },
        { id: 'rave-3', name: 'Barbeque', price: 18, image: 'https://cdn.pixabay.com/photo/2015/06/24/13/31/barbecue-820010_1280.jpg', house: 'ravenclaw' }
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await initializeMenu();
    renderMenu();
    loadCart();
    updateCartDisplay();
});

// Initialize menu from localStorage or defaults
async function initializeMenu() {
    
    const FORCE_RESET = true;

    if (FORCE_RESET) {
        localStorage.removeItem('hogwartsMenu');
    }

    const storedMenu = localStorage.getItem('hogwartsMenu');

    if (!storedMenu) {
        await loadImagesForMenu(defaultMenu);
        saveMenuToStorage(defaultMenu);
    } else {
        try {
            const menu = JSON.parse(storedMenu);

            
            Object.keys(defaultMenu).forEach(house => {
                defaultMenu[house].forEach(defaultItem => {
                    const storedItem = menu[house]?.find(i => i.id === defaultItem.id);
                    if (storedItem) {
                        storedItem.image = defaultItem.image;
                    }
                });
            });

            await loadImagesForMenu(menu);
            saveMenuToStorage(menu);
        } catch (error) {
            console.error('Error parsing stored menu:', error);
            await loadImagesForMenu(defaultMenu);
            saveMenuToStorage(defaultMenu);
        }
    }
}


// Load menu from storage
function loadMenuFromStorage() {
    const stored = localStorage.getItem('hogwartsMenu');
    if (stored) {
        return JSON.parse(stored);
    }
    return defaultMenu;
}

// Save menu to storage
function saveMenuToStorage(menu) {
    localStorage.setItem('hogwartsMenu', JSON.stringify(menu));
}

// Load images for menu items (ensure all items have images)
async function loadImagesForMenu(menu) {
    const houses = ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'];
    
    for (const house of houses) {
        if (menu[house]) {
            for (const item of menu[house]) {
                // If item doesn't have an image, try to get one
                if (!item.image || item.image === '') {
                    // Try to get image based on item name
                    const imageUrl = await getFoodImage(item.name);
                    item.image = imageUrl;
                }
            }
        }
    }
    saveMenuToStorage(menu);
}

// Get food image URL based on item name
async function getFoodImage(itemName) {
    // Food image URLs mapping
    const foodImages = {
        'shawarma': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
        'lemonade': 'https://natashaskitchen.com/wp-content/uploads/2023/07/Lemonade-Recipe-3.jpg',
        'mojito': 'https://thenovicechefblog.com/wp-content/uploads/2021/02/Mojito-1.jpg',
        'mint juice': 'https://www.sharmispassions.com/wp-content/uploads/2025/04/lemon-mint-juice11-683x1024.jpg',
        'idli': 'https://www.thespruceeats.com/thmb/6j6Ne_4F62_uigRCvTZYVykcHhc=/2122x1415/filters:fill(auto,1)/idli-56a510b63df78cf772862c34.jpg',
        'dosa': 'https://media.cntraveller.in/wp-content/uploads/2020/05/dosa-recipes-1366x768.jpg',
        'vada': 'https://img.freepik.com/premium-photo/sambar-vada-medu-vada-popular-south-indian-food-served-with-green-red-coconut-chutney-moody-background-selective-focus_466689-59620.jpg',
        'grill': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
        'fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
        'barbeque': 'https://cdn.pixabay.com/photo/2015/06/24/13/31/barbecue-820010_1280.jpg'
    };
    
    const lowerName = itemName.toLowerCase();
    const imageUrl = foodImages[lowerName] || `https://via.placeholder.com/300x200/2a2a2a/cccccc?text=${encodeURIComponent(itemName)}`;
    
    // Verify image loads
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => resolve(`https://via.placeholder.com/300x200/2a2a2a/cccccc?text=${encodeURIComponent(itemName)}`);
        img.src = imageUrl;
        setTimeout(() => {
            if (!img.complete) {
                resolve(`https://via.placeholder.com/300x200/2a2a2a/cccccc?text=${encodeURIComponent(itemName)}`);
            }
        }, 3000);
    });
}

// Render menu items
function renderMenu() {
    const menu = loadMenuFromStorage();
    const houses = ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'];
    
    houses.forEach(house => {
        const container = document.getElementById(`${house}-menu`);
        if (container && menu[house] && Array.isArray(menu[house])) {
            container.innerHTML = '';
            menu[house].forEach(item => {
                if (item && item.id && item.name) {
                    const itemCard = createMenuItemCard(item);
                    container.appendChild(itemCard);
                }
            });
        }
    });
}

// Create menu item card
function createMenuItemCard(item) {
    if (!item || !item.id || !item.name) {
        console.error('Invalid item:', item);
        return document.createElement('div');
    }
    
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.onclick = () => addToCart(item);
    
    const imageUrl = item.image || 'https://via.placeholder.com/300x200';
    const itemName = escapeHtml(item.name);
    const price = (item.price || 0).toFixed(2);
    const fallbackImage = `https://via.placeholder.com/300x200/2a2a2a/cccccc?text=${encodeURIComponent(item.name)}`;
    
    card.innerHTML = `
        <img src="${imageUrl}" 
             alt="${itemName}" 
             class="menu-item-image"
             onerror="this.onerror=null; this.src='${fallbackImage}'">
        <div class="menu-item-info">
            <div class="menu-item-name">${itemName}</div>
            <div class="menu-item-price">$${price}</div>
        </div>
    `;
    
    return card;
}

// Cart functionality
let cart = [];

function loadCart() {
    try {
        const stored = localStorage.getItem('hogwartsCart');
        if (stored) {
            cart = JSON.parse(stored);
            if (!Array.isArray(cart)) {
                cart = [];
            }
        } else {
            cart = [];
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('hogwartsCart', JSON.stringify(cart));
}

function addToCart(item) {
    if (!item || !item.id || !item.name) {
        console.error('Invalid item to add to cart:', item);
        return;
    }
    
    if (!Array.isArray(cart)) {
        cart = [];
    }
    
    const existingItem = cart.find(cartItem => cartItem && cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: 1,
            house: item.house || ''
        });
    }
    
    saveCart();
    updateCartDisplay();
    showCart();
}

function removeFromCart(itemId) {
    if (!itemId) return;
    
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    if (!itemId) return;
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

function calculateTotal() {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartItems || !cartTotal || !cartCount) return;
    
    if (!Array.isArray(cart) || cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        cartCount.textContent = '0';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            if (!item || !item.id || !item.name) return;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const safeId = String(item.id).replace(/'/g, "\\'");
            const itemName = escapeHtml(item.name);
            const quantity = item.quantity || 0;
            const price = (item.price || 0).toFixed(2);
            const subtotal = ((item.price || 0) * quantity).toFixed(2);
            
            cartItem.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-name">${itemName}</span>
                    <button class="cart-item-remove" onclick="removeFromCart('${safeId}')">×</button>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${safeId}', -1)">−</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${safeId}', 1)">+</button>
                    </div>
                    <div class="cart-item-subtotal">$${subtotal}</div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        const total = calculateTotal();
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function showCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.add('open');
}

// CRUD Operations
function openManageMenu() {
    const modal = document.getElementById('manage-menu-modal');
    modal.classList.add('active');
    renderManageMenu();
}

function closeManageMenu() {
    const modal = document.getElementById('manage-menu-modal');
    modal.classList.remove('active');
    document.getElementById('add-item-form').reset();
}

function renderManageMenu() {
    const container = document.getElementById('manage-menu-list');
    if (!container) return;
    
    const menu = loadMenuFromStorage();
    container.innerHTML = '';
    
    const houses = ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'];
    houses.forEach(house => {
        if (menu[house] && Array.isArray(menu[house]) && menu[house].length > 0) {
            menu[house].forEach(item => {
                if (item && item.id && item.name) {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `manage-item ${house}`;
                    const price = (item.price || 0).toFixed(2);
                    const houseName = house.charAt(0).toUpperCase() + house.slice(1);
                    const safeId = String(item.id).replace(/'/g, "\\'");
                    itemDiv.innerHTML = `
                        <div class="manage-item-info">
                            <div class="manage-item-name">${escapeHtml(item.name)}</div>
                            <div class="manage-item-details">$${price} • ${houseName}</div>
                        </div>
                        <div class="manage-item-actions">
                            <button class="btn-edit" onclick="editMenuItem('${safeId}')">Edit</button>
                            <button class="btn-delete" onclick="deleteMenuItem('${safeId}')">Delete</button>
                        </div>
                    `;
                    container.appendChild(itemDiv);
                }
            });
        }
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function addMenuItem(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const priceInput = document.getElementById('item-price');
    const houseSelect = document.getElementById('item-house');
    
    if (!nameInput || !priceInput || !houseSelect) {
        alert('Form elements not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const house = houseSelect.value;
    
    if (!name || isNaN(price) || price < 0 || !house) {
        alert('Please fill all fields with valid values');
        return;
    }
    
    const menu = loadMenuFromStorage();
    if (!menu[house]) {
        menu[house] = [];
    }
    
    const newId = `${house.substring(0, 4)}-${Date.now()}`;
    
    const newItem = {
        id: newId,
        name: name,
        price: price,
        image: '',
        house: house
    };
    
    // Load image for new item
    try {
        newItem.image = await getFoodImage(name);
    } catch (error) {
        console.error('Error loading image:', error);
        newItem.image = `https://via.placeholder.com/300x200/2a2a2a/cccccc?text=${encodeURIComponent(name)}`;
    }
    
    menu[house].push(newItem);
    saveMenuToStorage(menu);
    renderMenu();
    renderManageMenu();
    const form = document.getElementById('add-item-form');
    if (form) {
        form.reset();
    }
}

function editMenuItem(itemId) {
    if (!itemId) return;
    
    const menu = loadMenuFromStorage();
    let item = null;
    let house = null;
    
    const houses = ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'];
    for (const h of houses) {
        if (menu[h] && Array.isArray(menu[h])) {
            const found = menu[h].find(i => i && i.id === itemId);
            if (found) {
                item = found;
                house = h;
                break;
            }
        }
    }
    
    if (!item || !house) {
        alert('Item not found');
        return;
    }
    
    const newName = prompt('Enter new name:', item.name || '');
    if (newName === null) return;
    
    if (!newName.trim()) {
        alert('Name cannot be empty');
        return;
    }
    
    const newPriceStr = prompt('Enter new price:', item.price || 0);
    if (newPriceStr === null) return;
    
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice) || newPrice < 0) {
        alert('Invalid price');
        return;
    }
    
    item.name = newName.trim();
    item.price = newPrice;
    
    saveMenuToStorage(menu);
    renderMenu();
    renderManageMenu();
}

function deleteMenuItem(itemId) {
    if (!itemId) return;
    
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const menu = loadMenuFromStorage();
    const houses = ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'];
    
    for (const house of houses) {
        if (menu[house] && Array.isArray(menu[house])) {
            const index = menu[house].findIndex(i => i && i.id === itemId);
            if (index !== -1) {
                menu[house].splice(index, 1);
                break;
            }
        }
    }
    
    saveMenuToStorage(menu);
    renderMenu();
    renderManageMenu();
}

// Payment functionality
function openPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('payment-modal');
    const total = calculateTotal();
    const totalElement = document.getElementById('payment-total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    
    // Generate QR code
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;
    
    qrContainer.innerHTML = '';
    
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        qrContainer.innerHTML = '<p style="color: #aaa;">QR Code library not loaded. Please refresh the page.</p>';
        modal.classList.add('active');
        return;
    }
    
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    
    try {
        QRCode.toCanvas(canvas, `Payment: $${total.toFixed(2)}`, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function (error) {
            if (error) {
                console.error('QR code generation error:', error);
                qrContainer.innerHTML = '<p style="color: #aaa;">QR Code unavailable. Please try again.</p>';
            }
        });
    } catch (error) {
        console.error('QR code generation error:', error);
        qrContainer.innerHTML = '<p style="color: #aaa;">QR Code unavailable. Please try again.</p>';
    }
    
    modal.classList.add('active');
}

function closePayment() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('active');
}

function completePayment() {
    

    if (cart.length === 0) return;
    
    const sale = {
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime(),
        items: JSON.parse(JSON.stringify(cart)),
        total: calculateTotal()
    };
    
    // Save sale record
    const sales = getSalesRecords();
    sales.push(sale);
    localStorage.setItem('hogwartsSales', JSON.stringify(sales));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    closePayment();
    alert('Payment completed successfully!');
    
}

// Bill printing and PDF download
function printBill() {
    if (!Array.isArray(cart) || cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = calculateTotal();
    const date = new Date().toLocaleString();
    const orderNumber = Date.now();
    
    // Generate PDF using jsPDF
    if (typeof window.jspdf !== 'undefined') {
        generatePDFBill(total, date, orderNumber);
    }
    
    // Also show print dialog
    const printContainer = document.getElementById('print-bill');
    if (printContainer) {
        let itemsHtml = '';
        cart.forEach(item => {
            if (!item || !item.name) return;
            const itemName = escapeHtml(item.name);
            const quantity = item.quantity || 0;
            const price = parseFloat(item.price) || 0;
            const subtotal = (price * quantity).toFixed(2);
            
            itemsHtml += `
                <div class="bill-item">
                    <div>
                        <strong>${itemName}</strong> × ${quantity}
                    </div>
                    <div>$${subtotal}</div>
                </div>
            `;
        });
        
        printContainer.innerHTML = `
            <div class="bill-content">
                <h2>⚡ Hogwarts Restaurant ⚡</h2>
                <div class="bill-info">
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Order #:</strong> ${orderNumber}</p>
                </div>
                <div class="bill-items">
                    ${itemsHtml || '<p>No items</p>'}
                </div>
                <div class="bill-total">
                    Total: $${total.toFixed(2)}
                </div>
                <p style="text-align: center; margin-top: 30px; color: #666;">
                    Thank you for dining with us!
                </p>
            </div>
        `;
        
        printContainer.style.display = 'block';
        window.print();
        setTimeout(() => {
            printContainer.style.display = 'none';
        }, 1000);
    }
}

// Generate PDF bill
function generatePDFBill(total, date, orderNumber) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(116, 0, 1); // Gryffindor red
        doc.text('⚡ Hogwarts Restaurant ⚡', 105, 20, { align: 'center' });
        
        // Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${date}`, 20, 35);
        doc.text(`Order #: ${orderNumber}`, 20, 42);
        
        // Line separator
        doc.setDrawColor(116, 0, 1);
        doc.line(20, 48, 190, 48);
        
        // Items header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Items', 20, 58);
        doc.text('Price', 150, 58);
        
        let yPos = 68;
        
        // Items list
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        cart.forEach((item, index) => {
            if (!item || !item.name) return;
            
            const itemName = item.name;
            const quantity = item.quantity || 0;
            const price = parseFloat(item.price) || 0;
            const subtotal = (price * quantity).toFixed(2);
            
            doc.text(`${itemName} × ${quantity}`, 20, yPos);
            doc.text(`$${subtotal}`, 150, yPos);
            
            yPos += 8;
            
            // Add new page if needed
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
        
        // Total line
        doc.setDrawColor(116, 0, 1);
        doc.line(20, yPos + 5, 190, yPos + 5);
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: $${total.toFixed(2)}`, 150, yPos + 12);
        
        // Footer
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for dining with us!', 105, 280, { align: 'center' });
        
        // Save PDF
        doc.save(`Hogwarts_Bill_${orderNumber}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('PDF generation failed. Using print dialog instead.');
    }
}

// Sales tracking
function getSalesRecords() {
    try {
        const stored = localStorage.getItem('hogwartsSales');
        if (stored) {
            const records = JSON.parse(stored);
            return Array.isArray(records) ? records : [];
        }
        return [];
    } catch (error) {
        console.error('Error loading sales records:', error);
        return [];
    }
}

function openSalesReport() {
    const modal = document.getElementById('sales-report-modal');
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('report-month').value = currentMonth;
    modal.classList.add('active');
    updateSalesReport();
}

function closeSalesReport() {
    const modal = document.getElementById('sales-report-modal');
    modal.classList.remove('active');
}

function updateSalesReport() {
    const monthInput = document.getElementById('report-month');
    if (!monthInput || !monthInput.value) return;
    
    const monthValue = monthInput.value;
    const parts = monthValue.split('-');
    if (parts.length !== 2) return;
    
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    
    if (isNaN(year) || isNaN(month)) return;
    
    const sales = getSalesRecords();
    const container = document.getElementById('sales-report-content');
    
    if (!container) return;
    
    // Filter sales for the selected month
    const monthSales = sales.filter(sale => {
        if (!sale || !sale.timestamp) return false;
        try {
            const saleDate = new Date(sale.timestamp);
            return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month;
        } catch (error) {
            return false;
        }
    });
    
    if (monthSales.length === 0) {
        container.innerHTML = '<p>No sales recorded for this month.</p>';
        return;
    }
    
    // Calculate statistics
    const totalSales = monthSales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);
    const totalItems = monthSales.reduce((sum, sale) => {
        if (!sale.items || !Array.isArray(sale.items)) return sum;
        return sum + sale.items.reduce((itemSum, item) => itemSum + (parseInt(item.quantity) || 0), 0);
    }, 0);
    const totalTransactions = monthSales.length;
    
    // Item-wise breakdown
    const itemBreakdown = {};
    monthSales.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                if (!item || !item.name) return;
                if (!itemBreakdown[item.name]) {
                    itemBreakdown[item.name] = { quantity: 0, revenue: 0 };
                }
                itemBreakdown[item.name].quantity += parseInt(item.quantity) || 0;
                itemBreakdown[item.name].revenue += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
            });
        }
    });
    
    let breakdownHtml = '';
    Object.keys(itemBreakdown).sort().forEach(itemName => {
        const stats = itemBreakdown[itemName];
        const safeName = escapeHtml(itemName);
        breakdownHtml += `
            <div class="report-item">
                <div>
                    <strong>${safeName}</strong>
                    <div style="font-size: 0.9em; color: #aaa;">
                        ${stats.quantity} sold
                    </div>
                </div>
                <div style="font-weight: bold; color: var(--gryffindor-secondary);">
                    $${stats.revenue.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    const avgOrder = totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : '0.00';
    
    container.innerHTML = `
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-label">Total Sales</div>
                <div class="stat-value">$${totalSales.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Items Sold</div>
                <div class="stat-value">${totalItems}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Transactions</div>
                <div class="stat-value">${totalTransactions}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Order</div>
                <div class="stat-value">$${avgOrder}</div>
            </div>
        </div>
        <div class="report-items">
            <h3 style="margin-bottom: 15px; color: var(--gryffindor-secondary);">Item-wise Breakdown</h3>
            ${breakdownHtml || '<p>No items to display</p>'}
        </div>
        <p style="margin-top: 20px; color: #aaa; font-style: italic;">
            Report for ${monthName}
        </p>
    `;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = ['manage-menu-modal', 'payment-modal', 'sales-report-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}
let selectedRating = 0;

// Open / Close
function openFeedback() {
    document.getElementById('feedback-modal').classList.add('active');
}

function closeFeedback() {
    document.getElementById('feedback-modal').classList.remove('active');
}

// Rating Logic
document.querySelectorAll('.rating span').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        document.querySelectorAll('.rating span').forEach(s =>
            s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating)
        );
    });
});

// Save Feedback
document.getElementById('feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById('feedback-text').value.trim();
    if (!selectedRating || !text) {
        alert('Please provide rating and feedback');
        return;
    }

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const feedbackEntry = {
        rating: selectedRating,
        comment: text,
        date: now.toLocaleString()
    };

    const feedbackStore = JSON.parse(localStorage.getItem('hogwartsFeedback')) || {};
    if (!feedbackStore[monthKey]) feedbackStore[monthKey] = [];
    feedbackStore[monthKey].push(feedbackEntry);

    localStorage.setItem('hogwartsFeedback', JSON.stringify(feedbackStore));

    // Reset
    selectedRating = 0;
    document.getElementById('feedback-form').reset();
    document.querySelectorAll('.rating span').forEach(s => s.classList.remove('active'));

    closeFeedback();
    alert('✨ Thank you for your feedback!');
});
/* =========================
   SIMPLE CHATBOT
   ========================= */

function toggleChatbot() {
    document.getElementById('chatbot').classList.toggle('active');
}

function sendChat(event) {
    event.preventDefault();

    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, 'user');
    input.value = '';

  fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
})
.then(res => res.json())
.then(data => {
    addChatMessage(data.reply, "bot");
})
.catch(() => {
    addChatMessage("Sorry, I couldn't respond right now.", "bot");
});

}

function addChatMessage(text, sender) {
    const container = document.getElementById('chatbot-messages');
    const msg = document.createElement('div');
    msg.className = `chat-message chat-${sender}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function getBotReply(message) {
    const msg = message.toLowerCase();

    if (msg.includes('menu')) return 'You can browse the menu by house. Click on any item to add it to cart.';
    if (msg.includes('payment')) return 'We accept QR-based payment. Click "Pay Now" to proceed.';
    if (msg.includes('hours')) return 'We are open from 10 AM to 11 PM every day.';
    if (msg.includes('feedback')) return 'You can leave feedback using the feedback button on the left.';
    if (msg.includes('cart')) return 'Your cart is on the right side. Click the cart icon to view it.';
    if (msg.includes('hello') || msg.includes('hi')) return 'Hello! Welcome to Hogwarts Restaurant 🪄';

    return 'I can help with menu, payment, cart, hours, or feedback.';
}

