import { postFetch } from "./api.js";
import { nameEl, textEl } from "./handlers.js";
import { getData } from "./main.js";
import { renderLoad } from "./render.js";
import sanitize from "./sanitize.js";

let isLoading = false;

export const addComment = () => {
  isLoading = true;
  renderLoad(isLoading);
  const postData = () => {
    postFetch(sanitize(nameEl.value), sanitize(textEl.value))
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
};
