console.log("Frontend Js is working")
const form = document.getElementById("create-form")

function itemTemplate(item) {
return `<li style="display: flex; flex-direction: column; gap: 15px;" class="list-group-item align-items-center justify-content-between d-flex list-group-item-info">
        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; gap: 15px;">
        <span class="item-text">${item.reja}</span>
        <div>
        <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm">Edit</button>
        </div>
        </div>      
        </li>`;
}

let createfield = document.getElementById("create-field")

form.addEventListener("submit", function (e) {
    e.preventDefault()

    axios
    .post("create-item", {reja: createfield.value})
    .then((response) => {
        document.getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createfield.value = ""
        createfield.focus()
    })
    .catch((err) => {
        console.log("Try again")
    })
})

