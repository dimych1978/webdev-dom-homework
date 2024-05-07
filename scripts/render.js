import { commentsBlock } from "./main.js";
import getDate from "./getDate.js";
import {
  answerHandler,
  deleteHandler,
  editHandler,
  likesHandler,
} from "./handlers.js";
import { addCommentRender } from "./addComment.js";

export const renderLoad = isLoading => {
  const formEl = document.querySelector(".add-form");
  const cssLoad = formEl.querySelector(".cssload-container");

  isLoading
    ? (formEl.innerHTML = `<article class="cssload-container"><figure class="cssload-whirlpool"></figure>...Комментарий загружается</article>`)
    : (cssLoad && cssLoad.remove(), addCommentRender());
};

export const renderComments = comments => {
  const innerComments = comments
    .map((comment, index) => {
      return `<li class="comment" data-comment = ${index}>
          <header class="comment-header">
            <h3>${comment.author.name}</h3>
            <time>${getDate(comment.date)}</time>
          </header>
          <section class="comment-body" data-index=${index}>
            <${!comment.isEdit ? "article" : "textarea"} class="${
        !comment.isEdit ? "comment-text" : "edit-form-text"
      }">${comment.text}<${
        !comment.isEdit ? "/article" : "/textarea"
      }></section><section class="comment-footer">
            <article class="likes"><span class="likes-counter">${
              comment.likes
            }</span><button class='like-button ${
        comment.isLike ? "-active-like" : ""
      }' data-index=${index}></button></article><button class='edit-button' data-index=${index}>${
        !comment.isEdit ? "Редактировать комментарий" : "Сохранить"
      }</button>
            <button class='delete-button' data-index=${index}>Удалить комментарий</button>
          </section>
        </li>`;
    })
    .join("");

  commentsBlock.innerHTML = innerComments;
  addCommentRender();
  deleteHandler(comments);
  likesHandler(comments);
  editHandler(comments);
  answerHandler(comments);
};
