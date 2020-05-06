'use strict';

const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const labelAuth = document.querySelector('.label-auth');
const passwordInput = document.querySelector('#password');
const cardsRestorants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const cardsMenu = document.querySelector('.cards-menu');
const logo = document.querySelector('.logo');

let  login = localStorage.getItem('userLogin');

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
}

function toggleModal() {
    modal.classList.toggle("is-open");
}

function authorized() {
    function logOut () {
        login = null;
        localStorage.removeItem('userLogin');

        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';

        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    }
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';
    buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
    function logIn(event){
        let errorLoginSpan = document.querySelector('.notice-error');
        let password = passwordInput.value;
        event.preventDefault();
        login = loginInput.value;
        if (login && password) {
        toggleModalAuth();

        buttonAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();
        localStorage.setItem('userLogin', login);
        checkAuth();
        } else if(!errorLoginSpan){
        let errorLogin =  document.createElement('span');
        errorLogin.className = 'notice-error';
        errorLogin.textContent = 'Пожалуйста, введите логин и пароль'
        labelAuth.before(errorLogin);
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);

    logInForm.addEventListener('submit', logIn);

}

function checkAuth() {
    if(login) {
        authorized();
    } else {
        notAuthorized();
    }
}

function createCardRestaurant() {
    const card = `
        <a class="card card-restaurant">
            <img src="img/pizza-burger/preview.jpg" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">PizzaBurger</h3>
                    <span class="card-tag tag">45 мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От 700 ₽</div>
                    <div class="category">Пицца</div>
                </div>
            </div>
        </a>
    `;

    cardsRestorants.insertAdjacentHTML('beforeend', card);
}

function createCardGood() {
    const cardGood = `
        <div class="card">
            <img src="img/pizza-plus/pizza-oleole.jpg" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">Пицца Оле-Оле</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">Соус томатный, сыр «Моцарелла», черри, маслины, зелень, майонез
                    </div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price-bold">440 ₽</strong>
                </div>
            </div>
        </div>
    `;
    cardsMenu.insertAdjacentHTML('beforeend', cardGood);
 
}

function openGoods(event) {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
        if (login) {
            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            createCardGood();
            createCardGood();
            createCardGood();
            createCardGood();
        } else {
            let event = new Event("click");
            buttonAuth.dispatchEvent(event);
            console.dir(buttonAuth);
        }
        
    }

}

cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);
cardsRestorants.addEventListener('click', openGoods);

logo.addEventListener('click', function() {
        containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
});

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

checkAuth();