const items = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control-prev');
const nextButton = document.querySelector('.carousel-control-next');
let currentIndex = 0;

// Показване на първия елемент по подразбиране
items[currentIndex].classList.add('active');

// Функция за смяна на активния елемент
function showItem(index) {
    items[currentIndex].classList.remove('active');
    currentIndex = (index + items.length) % items.length; // Циклиране през елементите
    items[currentIndex].classList.add('active');
}

// Действие при натискане на бутона за предишен елемент
prevButton.addEventListener('click', () => {
    showItem(currentIndex - 1);
});

// Действие при натискане на бутона за следващ елемент
nextButton.addEventListener('click', () => {
    showItem(currentIndex + 1);
});