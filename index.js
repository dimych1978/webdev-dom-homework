let counter = 0;
const date = () => `${new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
})} ${new Date().toLocaleTimeString("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  second: '2-digit'
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
const commentsEl = document.querySelectorAll(".comment");
const form = document.querySelector(".add-form");
const nameEl = document.querySelector(".add-form-name");
const textEl = document.querySelector(".add-form-text");
const buttonEl = document.querySelector(".add-form-button");

const editText = document.createElement("textarea");
editText.className = "edit-form-text";
editText.setAttribute("type", "textarea");
editText.setAttribute("rows", "4");

const editHandler = () => {
  const editComment = document.querySelectorAll(".comment-text");
  const edits = document.querySelectorAll(".edit-button");
  for (const edit of edits) {
    const index = edit.dataset.index;
    edit.addEventListener("click", () => {
      commentTextEl.append(editText);
      if (!comments[index].isEdit) {
        edit.textContent = "Сохранить";
        editComment[index].parentElement.appendChild(editText);
        editText.value = editComment[index].textContent;
      } else {
        edit.textContent = "Редактировать комментарий";
        editComment[index].textContent = editText.value;
        comments[index].text = editText.value;
        editText.remove();
      }
      comments[index].isEdit = !comments[index].isEdit;
    });
  }
};

const likesHandler = () => {
  const likesButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likesButtons) {
    likeButton.addEventListener("click", () => {
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
    deleteButton.addEventListener("click", () => {
      const index = deleteButton.dataset.index;
      comments.splice(index, 1);
      renderComments();
    });
  }
};

const renderComments = () => {
  const innerComments = comments
    .map((comment, index) => {
      return `<li class="comment">
          <header class="comment-header">
            <h3>${comment.name}</h3>
            <time>${comment.date}</time>
          </header>
          <section class="comment-body">
            <article class="comment-text">
              ${comment.text}
            </article>
          </section>
          <section class="comment-footer">
            <article class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class='like-button ${
                comment.isLike ? "-active-like" : ""
              }' data-index=${index}></button>
            </article>
            <button class='edit-button' data-index=${index}>Редактировать комментарий</button>
            <button class='delete-button' data-index=${index}>Удалить комментарий</button>
          </section>
        </li>`;
    })
    .join("");
  commentsBlock.innerHTML = innerComments;
  deleteHandler();
  likesHandler();
  editHandler();
};
renderComments();

const commentTextEl = document.createElement("article");
commentTextEl.className = "comment-text";

const titleEl = document.createElement("h3");
const dateEl = document.createElement("time");

function addComment() {
  titleEl.textContent = nameEl.value;
  dateEl.textContent = date();
  commentTextEl.textContent = textEl.value;
  comments.push({
    name: titleEl.textContent,
    date: date(),
    text: commentTextEl.textContent,
    isLike: false,
    likes: counter,
    isEdit: false,
  });
  renderComments();

  nameEl.value = "";
  textEl.value = "";
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
      ? buttonEl.removeAttribute("disabled")
      : buttonEl.setAttribute("disabled", "disabled");
    if (e.key === "Enter" && !buttonEl.hasAttribute("disabled")) {
      addComment();
      buttonEl.setAttribute("disabled", "disabled");
    }
  })
);

console.log("It works!");
