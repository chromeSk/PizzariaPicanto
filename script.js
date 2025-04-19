async function getProducts() {
    let response = await fetch("store.json");
    let products = await response.json();
    return products;
};

function getCardHTML(product) {

let productData = JSON.stringify(product);
console.log(product);

    return `
        <div class="card">
            <img src="img/${product.image}" alt="${product.name}">
            <h3>${product.title}</h3>
            <p>Price: ${product.price}₴</p>
            <button class="add-to-cart" data-product='${productData}'>Add to Cart</button>
        </div>
    `;
}
    getProducts().then(function(products) {
        let productsList = document.querySelector(".pizza-container");
        if (productsList) {
            products.forEach(function(product) {
                productsList.innerHTML += getCardHTML(product);
            });
        }
    let buyButtons = document.querySelectorAll(".add-to-cart");

    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener("click", addToCart);
        });
    }
})

// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cart');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign("cart.html");
});

// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.cartCounter = document.querySelector('.cart-counter'); // отримуємо лічильник кількості товарів
        this.cartElement = document.querySelector('#cart-items');
        this.loadCartFromCookies(); // завантажуємо з куків раніше додані товари
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.updateCounter(); // Оновлюємо лічильник товарів
        this.saveCartToCookies();
    }

    // Зміна кількості товару
    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity == 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }

    // Оновлення лічильника товарів
    updateCounter() {
        let count = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            count += this.items[key].quantity; // рахуємо кількість усіх товарів
        }
        this.cartCounter.textContent = count; // оновлюємо лічильник на сторінці
    }

    // Зберігання кошика в куках
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з куків
    loadCartFromCookies() {
        let cartCookie = this.getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
            this.updateCounter();
        }
    }

    // Отримання значення кукі за іменем
    getCookieValue(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return '';
    }

    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика
let cart = new ShoppingCart();

// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);

    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}