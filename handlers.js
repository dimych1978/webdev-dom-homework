import { textEl } from "./main.js";
import { renderComments } from "./render.js";

function delay(interval = 300, likeAnimation) {
  return new Promise(resolve => {
    likeAnimation.setAttribute(
      "style",
      "animation: rotating 2s linear infinite"
    );
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export const answerHandler = comments => {
  const commentAnswers = document.querySelectorAll(".comment");
  for (const comment of commentAnswers) {
    comment.addEventListener("click", () => {
      const index = comment.dataset.comment;
      textEl.value = `QUOTE_BEGIN >>${comments[index].author.name}\n \n ${comments[index].text} \n QUOTE_END `;
    });
  }
};

export const deleteHandler = comments => {
  const deleteButtons = document.querySelectorAll(".delete-button");
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", e => {
      e.stopPropagation();
      const index = deleteButton.dataset.index;
      comments.splice(index, 1);
      renderComments(comments);
    });
  }
};

export const likesHandler = comments => {
  const likesButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likesButtons) {
    likeButton.addEventListener("click", e => {
      e.stopPropagation();
      delay(2000, likeButton).then(() => {
        const index = likeButton.dataset.index;
        comments[index].isLike = !comments[index].isLike;
        comments[index].isLike
          ? ++comments[index].likes
          : --comments[index].likes;
        renderComments(comments);
      });
    });
  }
};

export const editHandler = comments => {
  const edits = document.querySelectorAll(".edit-button");
  for (const editBtn of edits) {
    const index = editBtn.dataset.index;
    editBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (comments[index].isEdit) {
        const editTextarea = document.querySelector(".edit-form-text");
        comments[index].text = editTextarea.value;
      }
      comments[index].isEdit = !comments[index].isEdit;
      renderComments(comments);
    });
  }
};
