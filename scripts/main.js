import { getFetch } from "./api.js";
import { renderComments } from "./render.js";

export const userData = {
  name: localStorage.getItem("userName") || null,
  token: localStorage.getItem("userToken") || null,
};

export let comments = [];

export const commentsBlock = document.querySelector(".comments");
export const userAction = document.querySelector(".user-action");

export const getData = () => {
  !comments.length &&
    (commentsBlock.innerHTML = `<article class="cssload-container cssload-container-first"><figure class="cssload-whirlpool" ></figure>...Комментарии загружаются</article>`);
  getFetch()
    .then(data => {
      comments = [...data.comments];
      renderComments(comments);
    })
    .catch(error => {
      console.warn(error);
      if (error.message.includes("Failed to fetch")) {
        console.warn("Сервер упал");
        getData();
      }
    });
};
getData();

console.log("It works!");
