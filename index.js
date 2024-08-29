const items = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control-prev');
const nextButton = document.querySelector('.carousel-control-next');
let currentIndex = 0;


items[currentIndex].classList.add('active');


function showItem(index) {
    items[currentIndex].classList.remove('active');
    currentIndex = (index + items.length) % items.length; 
    items[currentIndex].classList.add('active');
}


prevButton.addEventListener('click', () => {
    showItem(currentIndex - 1);
});


nextButton.addEventListener('click', () => {
    showItem(currentIndex + 1);
});