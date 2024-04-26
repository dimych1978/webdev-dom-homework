import { nameEl, textEl } from "./main.js";
import sanitize from "./sanitize.js";

export const getFetch = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bashkatov/comments", {
    method: "GET",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Сервер не может вернуть данные");
    } else {
      return response.json();
    }
  });
}

export const postFetch = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bashkatov/comments", {
    method: "POST",
    body: JSON.stringify({
      name: sanitize(nameEl.value),
      forceError: true,
      text: sanitize(textEl.value),
    }),
  }).then(response => {
    if (response.status === 400) {
      throw new Error("В поле ввода должно быть не меньше 3х символов");
    } else if (response.status === 500) {
      throw new Error(
        "Нет интернета, пробую отправить запрос повторно. Если это сообщение появляется слишком часто, попробуйте повторить попытку позже."
      );
    } else {
      return response.json();
    }
  });
};