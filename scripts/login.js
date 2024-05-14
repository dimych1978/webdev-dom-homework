import { addCommentRender } from './addComment.js';
import { loginUser } from './api.js';
import { commentsBlock, getData, userAction, userData } from './main.js';
import { registryRender } from './registry.js';
import sanitize from './sanitize.js';

let textLogin;

export const loginRender = () => {
  const loginElement = document.querySelector('.container');
  const loginHTML = `
      <section class="add-form">
        <h1>Форма входа</h1> 
      <input
        type="text"
        class="add-form-name"
        placeholder="Введите логин"
        id="login"
        required
      />
      <input
        type="text"
        class="add-form-name"
        placeholder="Введите пароль"
        id="password"
        required
      ></input>
      <fieldset class="add-form-registry">
        <button class="add-form-button-main button-main" type="submit" >
            Войти</button>
         <u class="add-form-button-link registry" > 
          Зарегистрироваться
        </u>
      </fieldset>
    </section>
`;
  loginElement.innerHTML = loginHTML;

  const registryEl = document.querySelector('.registry');
  registryEl.addEventListener('click', () => registryRender());

  const loginEl = loginElement.querySelector('#login');
  const passwordEl = loginElement.querySelector('#password');
  const loginHandler = loginElement.querySelector('.button-main');

  if (textLogin) loginEl.value = textLogin;

  loginElement.querySelectorAll('.add-form-name').forEach((el) => {
    el.addEventListener(
      'keydown',
      (e) => e.key !== 'Enter' && el.setAttribute('style', 'border: none'),
    );
  });

  loginHandler.addEventListener('click', () => {
    if (!loginEl.value.match(/\S/) || !passwordEl.value.match(/\S/)) {
      textLogin = loginEl.value;
      passwordEl.value = '';
      loginEl.setAttribute('style', 'border: 3px solid red');
      passwordEl.setAttribute('style', 'border: 3px solid red');
      textLogin = loginEl.value;
      return;
    }

    loginUser(sanitize(loginEl.value), passwordEl.value)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userToken', data.user.token);
        userData.name = data.user.name;
        userData.token = data.user.token;
      })
      .then(() => {
        loginElement.innerHTML = '';
        loginElement.appendChild(commentsBlock);
        loginElement.appendChild(userAction);
        getData();
        addCommentRender();
      })
      .catch((error) => {
        textLogin = loginEl.value;
        alert(error.message);
        console.warn(error.message);
      });
  });
};
