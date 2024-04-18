let counter = 0;
let isLoading = false;

const getDate = date =>
  `${new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })} ${new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

let comments = [];

const commentsBlock = document.querySelector(".comments");
const formEl = document.querySelector(".add-form");
const nameEl = document.querySelector(".add-form-name");
const textEl = document.querySelector(".add-form-text");
const addFormRowEl = document.querySelector(".add-form-row");
const buttonEl = document.querySelector(".add-form-button");

const getData = () => {
  !comments.length &&
    (commentsBlock.innerHTML = `<article class="cssload-container cssload-container-first"><figure class="cssload-whirlpool" ></figure>...Комментарии загружаются</article>`);

  return fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bashkatov/comments", {
    method: "GET",
  })
    .then(response => {
      try {
        if (!response.ok) {
          throw new Error("Сервер не может вернуть данные");
        } else {
          return response.json();
        }
      } catch (error) {
        console.warn(error);
      }
    })
    .then(data => {
      comments = [...data.comments];
      renderComments();
    })
    .catch(error => {
      if (error.message.includes("Failed to fetch")) {
        console.warn("Сервер упал");
        getData();
      }
    });
};
getData();

const answerHandler = () => {
  const commentAnswers = document.querySelectorAll(".comment");
  for (const comment of commentAnswers) {
    comment.addEventListener("click", () => {
      const index = comment.dataset.comment;
      textEl.value = `QUOTE_BEGIN >>${comments[index].author.name}\n \n ${comments[index].text} \n QUOTE_END `;
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

const likesHandler = () => {
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
        renderComments();
      });
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
            <h3>${comment.author.name}</h3>
            <time>${getDate(comment.date)}</time>
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

const renderLoad = () => {
  const cssLoad = formEl.querySelector(".cssload-container");
  isLoading
    ? (formEl.innerHTML = `<article class="cssload-container"><figure class="cssload-whirlpool"></figure>...Комментарий загружается</article>`)
    : (cssLoad && cssLoad.remove(),
      formEl.appendChild(nameEl),
      formEl.appendChild(textEl),
      addFormRowEl.appendChild(buttonEl),
      formEl.appendChild(addFormRowEl));
};

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
  isLoading = true;
  renderLoad();
  const postData = () => {
    fetch("https://wedev-api.sky.pro/api/v1/dmitrii-bashkatov/comments", {
      method: "POST",
      body: JSON.stringify({
        name: sanitize(nameEl.value),
        forceError: true,
        text: sanitize(textEl.value),
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
      .then(() => getData())
      .then(() => {
        isLoading = false;
        renderLoad();
        nameEl.value = "";
        textEl.value = "";
      })
      .catch(error => {
        console.error("Ошибка", error.message);
        isLoading = false;
        renderLoad();
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
      ? (buttonEl.disabled = false)
      : (buttonEl.disabled = true);
    if (e.key === "Enter" && !buttonEl.disabled) {
      addComment();
      buttonEl.disabled = true;
    }
  })
);

console.log("It works!");
