'use strict';

const cartButton = document.getElementById('cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.getElementById('logInForm');
const loginInput = document.getElementById('login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const labelAuth = document.querySelector('.label-auth');
const passwordInput = document.getElementById('password');
const cardsRestorants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const cardsMenu = document.querySelector('.cards-menu');
const logo = document.querySelector('.logo');
const sectionHeadingMenu = document.querySelector('.section-heading_menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const noticeError = document.querySelector('.notice-error');

let  login = localStorage.getItem('userLogin');

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}.
        Статус ошибки ${response.status}`);
    }
    return await response.json();
};

const toggleModalAuth = function () {
    modalAuth.classList.toggle("is-open");
    noticeError.style.display = 'none';
};

const toggleModal = function () {
    modal.classList.toggle("is-open");
};

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
        } else {
            noticeError.style.display = 'block';
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

function createCardRestaurant({ image, kitchen, name, price, products, stars, time_of_delivery:timeOfDelivery }) {
    const card = `
        <div class="card card-restaurant" 
            data-products="${products}" 
            data-info="${[name, price, stars, kitchen]}">
            <img src="${image}" alt="${name}" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery} мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">${stars}</div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </div>
    `;

    cardsRestorants.insertAdjacentHTML('beforeend', card);
}

function createSectionHeadingMenu(info) {
    const [name, price, stars, kitchen, kitchenTwo] = info;

    let kitchenAll = kitchen;

    if (kitchenTwo) {
        kitchenAll = `${kitchen}, ${kitchenTwo}`;
    }

    const sectionHeadin = `
        <h2 class="section-title restaurant-title">${name}</h2>
        <div class="card-info">
            <div class="rating">
                ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchenAll}</div>
        </div>
    `;

    sectionHeadingMenu.insertAdjacentHTML('beforeend', sectionHeadin);
}

function createCardGoods({ description, id, image, name, price }) {
    const cardGood = `
        <div class="card" id="${id}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${description}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price-bold">${price} ₽</strong>
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
            const info  = restaurant.dataset.info.split(',');

            cardsMenu.textContent = '';
            sectionHeadingMenu.textContent = '';

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            createSectionHeadingMenu(info);

            getData(`./db/${restaurant.dataset.products}`).then(function(data) {
                data.forEach(createCardGoods);
            });

            menu.classList.remove('hide');
        } else {
            let event = new Event("click");
            buttonAuth.dispatchEvent(event);
        }
    }
}

function init() {
    getData('./db/partners.json').then(function(data) {
        data.forEach(createCardRestaurant);
    });

        cartButton.addEventListener('click', toggleModal);
        close.addEventListener('click', toggleModal);
        cardsRestorants.addEventListener('click', openGoods);

        logo.addEventListener('click', function() {
        containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });

    inputSearch.addEventListener('keydown', function(event) {

        if (event.keyCode === 13) {
            const target = event.target;

            const value =target.value.toLowerCase().trim();

            const goods = [];

            if (!value || value.length < 3) {
                target.style.outlineColor = 'tomato';
                setTimeout(function(){
                    target.style.borderColor = '';
                }, 2000);

                return;
            }

            target.value = '';

            getData('./db/partners.json').then(function(data) {

                const products = data.map(function(item) {
                    return item.products;
                });

                products.forEach(function(product) {
                    getData(`./db/${product}`)
                        .then(function(data) {
                            goods.push(...data);

                            cardsMenu.textContent = ''

                            containerPromo.classList.add('hide');
                            restaurants.classList.add('hide');
                            menu.classList.remove('hide');

                            const searchGoods = goods.filter(function(item) {
                                return item.name.toLowerCase().includes(value);
                            });

                        return searchGoods;

                    }).then(function(data) {
                        data.forEach(createCardGoods);
                    });
                });
            });
            const sectionHeadin = `
                <h2>Результаты поиска</h2>
            `;

            sectionHeadingMenu.insertAdjacentHTML('beforeend', sectionHeadin);
        }
    });

    checkAuth();
}

init();