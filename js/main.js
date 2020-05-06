const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day 1
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

let  login = localStorage.getItem('userLogin');

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
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

  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('не авторизован');

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

checkAuth();