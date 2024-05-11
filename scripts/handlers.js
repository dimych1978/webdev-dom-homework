import { delay } from './delay.js'
import { renderComments } from './render.js'
import { comments, getData, userData } from './main.js'
import { deleteComment, getFetch, likeChangeComment } from './api.js'

export const answerHandler = (comments) => {
  const commentAnswers = document.querySelectorAll('.comment')
  const textEl = document.querySelector('.add-form-text')

  if (userData.token)
    for (const comment of commentAnswers) {
      comment.addEventListener('click', () => {
        const index = comment.dataset.comment
        textEl.value = `QUOTE_BEGIN >>${comments[index].author.name}\n \n ${comments[index].text} \n QUOTE_END `
      })
    }
}

export const deleteHandler = () => {
  const deleteButtons = document.querySelectorAll('.delete-button')

  if (userData.token)
    for (const deleteButton of deleteButtons) {
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation()

        getFetch()
          .then((data) => {
            const [itemId] = data.comments.filter(
              (comment) => comment.id === deleteButton.dataset.index,
            )
            deleteComment(itemId.id)
          })
          .then(() => getData())

        // Удаление комментария на стороне пользователя
        // const index = deleteButton.dataset.index;
        // comments.splice(index, 1);
      })
    }
}

export const likesHandler = () => {
  const likesButtons = document.querySelectorAll('.like-button')

  if (userData.token)
    for (const likeButton of likesButtons) {
      likeButton.addEventListener('click', (e) => {
        e.stopPropagation()

        delay(2000, likeButton).then(() => {
          const [itemId] = comments.filter(
            (comment) => comment.id === likeButton.dataset.index,
          )
          likeChangeComment(itemId.id).then(() => getData())
        })

        //  Изменение лайка на стороне пользователя
        // const index = likeButton.dataset.index;
        // comments[index].isLike = !comments[index].isLike;
        // comments[index].isLike
        //   ? ++comments[index].likes
        //   : --comments[index].likes;
        // renderComments(comments);
      })
    }
}

export const editHandler = (comments) => {
  const edits = document.querySelectorAll('.edit-button')

  if (userData.token)
    for (const editBtn of edits) {
      const index = editBtn.dataset.index
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        if (comments[index].isEdit) {
          const editTextarea = document.querySelector('.edit-form-text')
          comments[index].text = editTextarea.value
        }
        comments[index].isEdit = !comments[index].isEdit
        renderComments(comments)
      })
    }
}
