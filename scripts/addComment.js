import { postFetch } from "./api.js";
import { loginRender } from "./login.js";
import { getData, userAction, userData } from "./main.js";
import { renderLoad } from "./render.js";
import sanitize from "./sanitize.js";

let isLoading = false;

export let textComment;

export const addCommentRender = () => {
  const addCommentHTML = `
  <section class="add-form">
        <figure class="add-form-name-with-exit" title="exit">
        <input
          type="text"
          class="add-form-name"
          name="author"
          placeholder="Введите ваше имя"
          required
        /><img class="exit" src="../img/exit.svg"/></figure>
        <textarea
          type="textarea"
          class="add-form-text"
          name="body"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>
        <fieldset class="add-form-row">
          <button class="add-form-button" type="submit" disabled="disabled">
            Написать
          </button>
      </fieldset>
      </section>
`;
  userData.token
    ? (userAction.innerHTML = addCommentHTML)
    : (userAction.innerHTML = `<div  style="text-align: center; margin: 22px">Чтобы добавить комментарий,<a class="entry" style="cursor: pointer"> <u>авторизуйтесь</u></a></div>`);

  const nameEl = document.querySelector(".add-form-name");
  const textEl = document.querySelector(".add-form-text");
  const buttonEl = document.querySelector(".add-form-button");
  const exitEl = document.querySelector(".exit");
  const entryEl = document.querySelector(".entry");

  entryEl && entryEl.addEventListener("click", () => loginRender());

  exitEl &&
    exitEl.addEventListener("click", () => {
      (userData.name = null), (userData.token = null);
      getData();
    });

  if (textComment) textEl.value = textComment;
  buttonEl &&
    buttonEl.addEventListener("click", () => {
      addComment(textEl.value);
      buttonEl.setAttribute("disabled", "disabled");
    });

  nameEl && ((nameEl.value = userData.name), (nameEl.readOnly = true));
  nameEl &&
    nameEl.addEventListener("input", () => {
      textEl.value
        ? buttonEl.removeAttribute("disabled")
        : buttonEl.setAttribute("disabled", "disabled");
    });

  textEl &&
    textEl.addEventListener("keydown", e => {
      if (e.key === "Enter") e.preventDefault();
    });

  const events = ["input", "keyup"];

  buttonEl &&
    textEl &&
    events.forEach(event =>
      textEl.addEventListener(event, e => {
        textEl.value ? (buttonEl.disabled = false) : (buttonEl.disabled = true);
        if (e.key == "Enter" && !buttonEl.disabled) {
          addComment();
          buttonEl.disabled = true;
        }
      })
    );
};

export const addComment = text => {
  isLoading = true;
  renderLoad(isLoading);
  const postData = () => {
    postFetch(sanitize(text))
      .then(data => {
        if (data.error) throw new Error(data.error);
      })
      .then(() => getData())
      .then(() => {
        isLoading = false;
        renderLoad(isLoading);
        textComment = "";
      })
      .catch(error => {
        console.warn("Ошибка", error.message);
        isLoading = false;
        if (error.message === "text должен содержать хотя бы 3 символа") {
          textComment = text;
          alert(error.message);
        }
        renderLoad(isLoading);
        if (
          error.message ===
          "Нет интернета, пробую отправить запрос повторно. Если это сообщение появляется слишком часто, попробуйте повторить попытку позже."
        ) {
          console.warn(error.message);
          postData();
        }
        if (error.message === "Failed to fetch") {
          alert("Проверьте соединение с интернетом");
          return;
        }
      });
  };
  postData();
};
