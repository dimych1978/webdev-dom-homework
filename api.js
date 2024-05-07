import { addCommentRender } from "./addComment.js";
import { userData } from "./main.js";

const baseURL = "https://wedev-api.sky.pro/api/v2/dmitrii-bashkatov/comments";

const userURL = "https://wedev-api.sky.pro/api/user";

export const validToken = newToken => {
  token = newToken;
};

export const getFetch = () => {
  return fetch(baseURL, {
    method: "GET",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Сервер не может вернуть данные");
    } else {
      return response.json();
    }
  });
};

export const postFetch = text => {
  return fetch(baseURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then(response => {
      if (response.status === 400) {
        throw new Error("В поле ввода должно быть не меньше 3х символов");
      } else if (response.status === 500) {
        throw new Error(
          "Нет интернета, пробую отправить запрос повторно. Если это сообщение появляется слишком часто, попробуйте повторить попытку позже."
        );
      } else {
        return response.json();
      }
    })
    .catch(error => {
      console.warn(error.message);
      addCommentRender();
    });
};

export const addNewUser = (name, login, password) => {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({ name: name, login: login, password: password }),
  });
};

export const loginUser = (login, password) => {
  return fetch(userURL + "/login", {
    method: "POST",
    body: JSON.stringify({ login: login, password: password }),
  });
};
