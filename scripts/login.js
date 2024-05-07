import { loginUser } from "./api.js";
import { commentsBlock, getData, userAction, userData } from "./main.js";
import { registryRender } from "./registry.js";

export const loginRender = () => {
  const loginElement = document.querySelector(".container");
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

  const registryEl = document.querySelector(".registry");
  registryEl.addEventListener("click", () => registryRender());

  const loginEl = loginElement.querySelector("#login");
  const passwordEl = loginElement.querySelector("#password");
  const loginHandler = loginElement.querySelector(".button-main");

  loginHandler.addEventListener("click", () => {
    loginUser(loginEl.value, passwordEl.value)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userToken", data.user.token);
        userData.name = data.user.name;
        userData.token = data.user.token;
      })
      .then(() => {
        loginElement.innerHTML = "";
        loginElement.appendChild(commentsBlock);
        loginElement.appendChild(userAction);
        getData();
      })
      .catch(error => {
        alert(error.message);
        console.warn(error.message);
      });
  });
};
