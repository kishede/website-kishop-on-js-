document.addEventListener('DOMContentLoaded', function() {
    // Инициализация рейтинга (ваш существующий код)
    const stars = document.querySelectorAll('.star');

    // Инициализация корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.getElementById('cartIcon');
    const cartCounter = document.getElementById('cartCounter');

    function updateCartCounter() {
        cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }


    // Обработчики для кнопок "Купить"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productId = product.dataset.id || 
            product.querySelector('.product-title').textContent.replace(/\s+/g, '-').toLowerCase();
            const productName = product.querySelector('.product-title').textContent;
            const productPrice = parseFloat(product.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
            const productImage = product.querySelector('.product-img img').src;
            const productRating = parseInt(localStorage.getItem(`productRating_${productId}`)) || 0;

            // Проверяем, есть ли товар уже в корзине
            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex !== -1) {
                // Если товар уже есть - увеличиваем quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Если нет - добавляем новый товар
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    rating: productRating // Сохраняем рейтинг товара
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            
            // Анимация иконки корзины
            cartIcon.classList.add('added');
            setTimeout(() => cartIcon.classList.remove('added'), 500);
            
            alert(`${productName} добавлен в корзину! (Всего: ${cart[existingItemIndex]?.quantity || 1})`);
        });
    });

    // Переход в корзину
    cartIcon.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });

    // Ваш существующий код для рейтинга
    function highlightStars(rating, isHover = false) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-rating'));
            star.classList.remove('active', 'hovered');
            
            if (starValue <= rating) {
                star.classList.add(isHover ? 'hovered' : 'active');
            }
        });
    }

    document.querySelectorAll('.product').forEach(product => {
        const stars = product.querySelectorAll('.star');
        const ratingValue = product.querySelector('.rating-value');
        const productId = product.dataset.id || 
                        product.querySelector('.product-title').textContent.replace(/\s+/g, '-').toLowerCase();
        
        // Загружаем рейтинг для конкретного товара
        let currentRating = localStorage.getItem(`productRating_${productId}`) || 0;
        ratingValue.textContent = currentRating;
        
        function highlightStars(rating, isHover = false) {
            stars.forEach(star => {
                const starValue = parseInt(star.getAttribute('data-rating'));
                star.classList.remove('active', 'hovered');
                
                if (starValue <= rating) {
                    star.classList.add(isHover ? 'hovered' : 'active');
                }
            });
        }
        
        // Инициализация звезд
        highlightStars(currentRating);
        
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const hoverRating = parseInt(star.getAttribute('data-rating'));
                highlightStars(hoverRating, true);
            });
            
            star.addEventListener('mouseout', () => {
                highlightStars(currentRating);
            });
            
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-rating'));
                ratingValue.textContent = currentRating;
                // Сохраняем рейтинг для конкретного товара
                localStorage.setItem(`productRating_${productId}`, currentRating);
                highlightStars(currentRating);
            });
        });
    });
});