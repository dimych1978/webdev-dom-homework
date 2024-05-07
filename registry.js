import { addNewUser } from "./api.js";
import { loginRender } from "./login.js";
import { userData } from "./main.js";

export const registryRender = () => {
  const registryElement = document.querySelector(".container");
  const registryHTML = `
    <section class="add-form">
     <h1>Форма регистрации</h1> 
      <input
        type="text"
        class="add-form-name"
        placeholder="Введите имя"
        id="name"
        required
      />
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
>
      <fieldset class="add-form-registry">
        <button class="add-form-button-main button-main" type="submit" >
           Зарегистрироваться </button>
         <u class="add-form-button-link entry"> 
          Войти
        </u>
      </fieldset>
    </section>
`;
  registryElement.innerHTML = registryHTML;

  const entryEl = document.querySelector(".entry");
  entryEl.addEventListener("click", () => loginRender());

  const nameEl = registryElement.querySelector("#name");
  const loginEl = registryElement.querySelector("#login");
  const passwordEl = registryElement.querySelector("#password");

  const registryHandler = registryElement.querySelector(".button-main");

  registryHandler.addEventListener("click", () =>
    addNewUser(nameEl.value, loginEl.value, passwordEl.value)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        userData.name = data.user.name;
        userData.token = data.user.token;
      })
      .then(() => loginRender())
      .catch(error => {
        console.log(error);
        alert(error.message);
        console.warn(error.message);
      })
  );
};
