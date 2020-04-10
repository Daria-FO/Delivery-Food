const cartButton = document.querySelector('#cart-button');
const closeModal = document.querySelector('#modal-close');
const modal = document.querySelector('.modal');
function toggleModalOpen() {
    modal.classList.toggle('modal-open');
}
cartButton.addEventListener('click', toggleModalOpen);
closeModal.addEventListener('click', toggleModalOpen);

new WOW().init();