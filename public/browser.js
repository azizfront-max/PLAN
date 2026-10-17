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
    .post("/create-item", {reja: createfield.value})
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

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-me")) {
        if (confirm("You really want to delete?")) {
            axios.post("/delete-item", { id: e.target.getAttribute("data-id") })
                .then((response) => {
                    console.log(response.data)
                    
                    const li = e.target.closest("li")
                    const ul = li.parentElement
                    
                    li.remove()
                    
                    if (ul.querySelectorAll("li").length === 0) {
                        ul.style.display = "none"
                    }
                })
                .catch((err) => {
                    console.log("ERROR:", err)
                })
        }
    }

    if (e.target.classList.contains("edit-me")) {
        const li = e.target.closest("li")
        const span = li.querySelector(".item-text")
        const id = e.target.getAttribute("data-id")
      let userInput = prompt("O'zgartirish kiriting", span.innerHTML
    )
     if (userInput) {
        console.log(userInput)
        axios.post("/edit-item", {id: id, 
        reja: userInput,
     })
     .then(response => {
       console.log(response.data)
       span.innerHTML = userInput
     })
     .catch(err => {
       console.log("ERROR:", err)
     })
    }
 } 
})


document.getElementById("clean-all").addEventListener("click", function() {
    axios.post("/delete-all", {delete_all: true})
    .then(response => {
        alert(response.data.message || "All plans are cleaned")
        document.location.reload()
    })
    .catch(err => {
        console.log("Delete all error:", err)
    })
})



