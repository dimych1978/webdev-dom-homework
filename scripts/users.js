import { userURL } from "./api.js";
import { userData } from "./main.js";

export const users = () => {
  return fetch(userURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
    .then(response => response.json())
    .then(data => console.log( data));
};
