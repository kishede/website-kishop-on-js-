document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Функция для отрисовки звезд рейтинга
    function renderRatingStars(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= (rating || 0) ? 'active' : '';
            starsHtml += `<span class="star ${activeClass}" data-rating="${i}">★</span>`;
        }
        return starsHtml;
    }

    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
            cartTotal.textContent = '0';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                    <div class="cart-product-info">
                        <h3>${item.name}</h3>
                        <div class="product-rating">
                            <div class="rating-container">
                                ${renderRatingStars(item.rating)}
                            </div>
                            <p class="rating-text">Рейтинг: <span class="rating-value">${item.rating || 0}</span>/5</p>
                        </div>
                        <div class="cart-product-controls">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <p>${item.price} ₽ × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ₽</p>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">Удалить</button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Обработчики событий
    document.addEventListener('click', function(e) {
        const target = e.target;
        const itemId = target.dataset?.id;
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (target.classList.contains('plus') && itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
        } 
        else if (target.classList.contains('minus') && itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        else if (target.classList.contains('remove-item') && itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCounter(); // Обновляем счетчик в шапке
    });

    // Функция для обновления счетчика в шапке
    function updateCartCounter() {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    renderCart();
    updateCartCounter();
});