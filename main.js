import { getFetch, postFetch } from "./api.js";
import getDate from "./getDate.js";
import { renderLoad, renderComments } from "./render.js";

let isLoading = false;

let comments = [];

export const commentsBlock = document.querySelector(".comments");
export const nameEl = document.querySelector(".add-form-name");
export const textEl = document.querySelector(".add-form-text");
export const buttonEl = document.querySelector(".add-form-button");

const getData = () => {
  !comments.length && (commentsBlock.innerHTML = `<article class="cssload-container cssload-container-first"><figure class="cssload-whirlpool" ></figure>...Комментарии загружаются</article>`)

  getFetch()
    .then(data => {
      comments = [...data.comments];
      renderComments(comments);
    })
    .catch(error => {
      if (error.message.includes("Failed to fetch")) {
        console.warn("Сервер упал");
        getData();
      }
    });
};
getData();

const addComment = () => {
  isLoading = true;
  renderLoad(isLoading);
  const postData = () => {
    postFetch()
      .then(() => getData())
      .then(() => {
        isLoading = false;
        renderLoad(isLoading);
        nameEl.value = "";
        textEl.value = "";
      })
      .catch(error => {
        console.error("Ошибка", error.message);
        isLoading = false;
        renderLoad(isLoading);
        if (error.message === "В поле ввода должно быть не меньше 3х символов")
          alert(error.message);
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
}

buttonEl.addEventListener("click", () => {
  addComment();
  buttonEl.setAttribute("disabled", "disabled");
});

nameEl.addEventListener("input", () => {
  nameEl.value && textEl.value
    ? buttonEl.removeAttribute("disabled")
    : buttonEl.setAttribute("disabled", "disabled");
});

textEl.addEventListener("keydown", e => {
  if (e.key === "Enter") e.preventDefault();
});

const events = ["input", "keyup"];

events.forEach(event =>
  textEl.addEventListener(event, e => {
    textEl.value && nameEl.value
      ? (buttonEl.disabled = false)
      : (buttonEl.disabled = true);
    if (e.key === "Enter" && !buttonEl.disabled) {
      addComment();
      buttonEl.disabled = true;
    }
  })
);

console.log("It works!");
