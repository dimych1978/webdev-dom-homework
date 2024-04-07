let counter = 0;
const date = () =>
  `${new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })} ${new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    text: "Это будет первый комментарий на этой странице",
    isLike: false,
    likes: 3,
    isEdit: false,
  },
  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    text: "Мне нравится как оформлена эта страница! ❤",
    isLike: true,
    likes: 75,
    isEdit: false,
  },
];

const commentsBlock = document.querySelector(".comments");
const nameEl = document.querySelector(".add-form-name");
const textEl = document.querySelector(".add-form-text");
const buttonEl = document.querySelector(".add-form-button");

const answerHandler = () => {
  const commentAnswers = document.querySelectorAll(".comment");
  for (const comment of commentAnswers) {
    comment.addEventListener("click", () => {
      const index = comment.dataset.comment;
      textEl.value = `QUOTE_BEGIN >>${comments[index].name}\n \n ${comments[index].text} \n QUOTE_END `;
    });
  }
};

const editHandler = () => {
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
      renderComments();
    });
  }
};

const likesHandler = () => {
  const likesButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likesButtons) {
    likeButton.addEventListener("click", e => {
      e.stopPropagation();
      const index = likeButton.dataset.index;
      comments[index].isLike = !comments[index].isLike;
      comments[index].isLike
        ? ++comments[index].likes
        : --comments[index].likes;
      renderComments();
    });
  }
};

const deleteHandler = () => {
  const deleteButtons = document.querySelectorAll(".delete-button");
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", e => {
      e.stopPropagation();
      const index = deleteButton.dataset.index;
      comments.splice(index, 1);
      renderComments();
    });
  }
};

const renderComments = () => {
  const innerComments = comments
    .map((comment, index) => {
      return `<li class="comment" data-comment = ${index}>
          <header class="comment-header">
            <h3>${comment.name}</h3>
            <time>${comment.date}</time>
          </header>
          <section class="comment-body" data-index=${index}>
            <${!comment.isEdit ? "article" : "textarea"} class="${
        !comment.isEdit ? "comment-text" : "edit-form-text"
      }">
              ${comment.text}
            <${!comment.isEdit ? "/article" : "/textarea"}>
          </section>
          <section class="comment-footer">
            <article class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class='like-button ${
                comment.isLike ? "-active-like" : ""
              }' data-index=${index}></button>
            </article>
            <button class='edit-button' data-index=${index}>${
        !comment.isEdit ? "Редактировать комментарий" : "Сохранить"
      }</button>
            <button class='delete-button' data-index=${index}>Удалить комментарий</button>
          </section>
        </li>`;
    })
    .join("");
  commentsBlock.innerHTML = innerComments;
  deleteHandler();
  likesHandler();
  editHandler();
  answerHandler();
};
renderComments();

const titleEl = document.createElement("h3");
const dateEl = document.createElement("time");

const sanitize = text => {
  return text
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("QUOTE_BEGIN", "<blockquote class='quote'>")
    .replaceAll("QUOTE_END", "</blockquote>");
};

function addComment() {
  titleEl.textContent = nameEl.value;
  dateEl.textContent = date();
  comments.push({
    name: sanitize(titleEl.textContent),
    date: date(),
    text: sanitize(textEl.value),
    quote: sanitize(textEl.textContent),
    isLike: false,
    likes: counter,
    isEdit: false,
  });
  nameEl.value = "";
  textEl.value = "";
  renderComments();
}

buttonEl.addEventListener("click", () => {
  addComment();
  buttonEl.setAttribute("disabled", "disabled");
});

nameEl.addEventListener("input", () => {
  nameEl.value && (textEl.value || editText.value)
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
      ? buttonEl.removeAttribute("disabled")
      : buttonEl.setAttribute("disabled", "disabled");
    if (e.key === "Enter" && !buttonEl.hasAttribute("disabled")) {
      addComment();
      buttonEl.setAttribute("disabled", "disabled");
    }
  })
);

console.log("It works!");
