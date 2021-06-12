let username;
let socket = io();

do {
  username = prompt("Enter Username");
} while (!username);

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment_box");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  }
  postComment(comment);
});

function postComment(comment) {
  let data = {
    username: username,
    comment: comment,
  };
  //   append to dom
  appendToDom(data);
  textarea.value = "";
  //   broadcast
  broadcastComment(data);
  //   sync with mongodb
  syncWithDb(data);
}

function appendToDom(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");
  let markup = `
            <div class="card border-light mb-3">
              <div class="card-body">
                <h6>${data.username}</h6>
                <p>
                ${data.comment}
                </p>
                <div>
                    <img src="/images/clock.png" alt="clock">
                    <small>${moment(data.time).format("LT")}</small>
                </div>
              </div>
            </div>
    `;
  lTag.innerHTML = markup;
  commentBox.prepend(lTag);
}

function broadcastComment(data) {
  // emit event
  socket.emit("comment", data);
}

socket.on("comment", (data) => {
  appendToDom(data);
});

let typing = document.querySelector(".typing");

let timerId = null;

function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    func();
  }, timer);
}

socket.on("typing", (data) => {
  typing.innerHTML = `${data.username} is typing`;
  debounce(function () {
    typing.innerHTML = "";
  }, 1000);
});

// Event listener on text area
textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username });
});

// api calls

function syncWithDb(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/api/comments", {
    method: "post",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => {
      response.json();
    })
    .then((result) => {
      console.log(result);
    });
}

function fetchComments(){
    fetch('/api/comments')
    .then((res)=>res.json())
    .then(result=>{
        console.log(result)
        result.forEach((comment)=>{
            comment.time = comment.createdAt
            appendToDom(comment)
        })
    })
}

window.onload = fetchComments