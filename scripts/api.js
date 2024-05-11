import { userData } from "./main.js";

const baseURL = "https://wedev-api.sky.pro/api/v2/dmitrii-bashkatov1/comments";

export const userURL = "https://wedev-api.sky.pro/api/user";

export const validToken = newToken => {
  token = newToken;
};

export const getFetch = () => {
  return fetch(baseURL, {
    method: "GET",
    headers: { Authorization: `Bearer ${userData.token}` },
  }).then(response => {
    if (!response.ok) throw new Error("Сервер не может вернуть данные");
    return response.json();
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
  }).then(response => {
    if (response.status == 500) {
      throw new Error(
        "Нет интернета, пробую отправить запрос повторно. Если это сообщение появляется слишком часто, попробуйте повторить попытку позже."
      );
    }
    return response.json();
  });
};

export const deleteComment = id => {
  return fetch(baseURL + `/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  });
};

export const likeChangeComment = id => {
  return fetch(baseURL + `/${id}` + "/toggle-like", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
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
