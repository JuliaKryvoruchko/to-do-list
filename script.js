window.onload = function () {
    displayItems()
}

function displayItems() {
    let items = ""
    for (let i = 0; i < itemsArray.length; i++) {
        items += getItemHtmlTemplate(itemsArray[i]);
    }
    toDoList.innerHTML = items;
    activateListeners();
}

function activateListeners() {
    activateDeleteListeners();
    activateEditListeners();
    activateDeleteAll();
}

function getItemHtmlTemplate(item) {
    return `<div class="item" id="${item.id}">
            <div class="input-controller">
            <div class="textarea" disabled style="overflow:hidden" itemId=${item.id}><p>${item.value}</p></div>
            <div class="edit-controller">
                <button class="editBtn" id="btn-${item.id}"><img src="img/checkbox-outline.png" alt="" class="img-edit" ><p class="text-safe">Safe</p></button>
                <i class="fa-solid fa-circle-xmark fa-2xl deleteBtn" style="color: #9c9c9c" style="width: 46px" id="btnDel-${item.id}"><p class="text-delete" id="textDelete">Delete</p></i>
            </div>
            </div>
            </div>`;
}

let buttonSaveEdit = document.getElementById('enter');
let clearAllButton = document.getElementById('clearAll');
let itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
let toDoList = document.querySelector(".to-do-list");
let input = document.getElementById("item")

disableSaveButton(true);
document.querySelector("#enter").addEventListener("click", () => {
    const item = document.querySelector("#item")
    upsertItem(item)
    item.value = "";
    item.setAttribute("itemId", "");
    disableSaveButton(true);
})

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buttonSaveEdit.click()
    }
})

function onKeyUp() {
    let condition = document.getElementById("item").value === "";
    disableSaveButton(condition);
}

function disableSaveButton(isButtonDisabled) {
    buttonSaveEdit.disabled = isButtonDisabled;
}

function activateDeleteAll() {
    let deleteAll = document.querySelectorAll(".img-footer")
    deleteAll.forEach((da, i) => {
        da.addEventListener("click", () => { deleteAllItems(i) })
    })
}

function activateDeleteListeners() {
    let deleteBtn = document.querySelectorAll(".deleteBtn")
    deleteBtn.forEach((db, i) => {
        db.addEventListener("click", () => {
            deleteItem(i);
            deleteItemFromHtml(db);
        })
    })
}

function deleteItemFromHtml(deleteButton) {
    let item = deleteButton.parentElement.parentElement.parentElement;
    toDoList.removeChild(item);
}

function activateEditListeners() {
    const editBtn = document.querySelectorAll(".editBtn")
    const inputs = document.querySelectorAll(".input-controller .textarea")
    editBtn.forEach((eb, i) => {
        eb.addEventListener("click", () => {
            let mainInput = document.getElementById('item');
            let valueToTransfer = inputs[i].textContent;
            let IdToTransfer = inputs[i].getAttribute('itemId');
            mainInput.value = valueToTransfer;
            mainInput.setAttribute('itemId', IdToTransfer);
            changeSaveEditButtonState();
            disableEditButtons(true);
            eb.style.backgroundColor = 'green';
        })
    })
}

function disableEditButtons(isDisabled) {
    let editButtons = document.querySelectorAll(".editBtn");
    editButtons.forEach((editButton) => {
        editButton.disabled = isDisabled;
    })
}

function changeSaveEditButtonState() {
    if (buttonSaveEdit.style.backgroundColor === 'red') {
        buttonSaveEdit.style.backgroundColor = 'green';
        buttonSaveEdit.innerHTML = 'Save';
        clearAllButton.setAttribute('disabled', false);

    }
    else {
        buttonSaveEdit.style.backgroundColor = 'red';
        buttonSaveEdit.innerHTML = 'Edit';
        clearAllButton.setAttribute('disabled', true);
    }
}

function updateItem(text, i) {
    itemsArray[i] = text
    localStorage.setItem("items", JSON.stringify(itemsArray));
}

function deleteAllItems() {
    if (!clearAllButton.getAttribute('disabled')) {
        itemsArray = [];
        localStorage.setItem("items", JSON.stringify(itemsArray));
        toDoList.innerHTML = "";
    }
}

function deleteItem(i) {
    itemsArray.splice(i, 1)
    localStorage.setItem("items", JSON.stringify(itemsArray))
}

function upsertItem(item) {
    const condition = (element) => element.id.toString() === item.getAttribute('itemId');
    if (itemsArray.some(condition)) {
        const found = itemsArray.find((element) => element.id.toString() === item.getAttribute('itemId'));
        found.value = item.value;
        localStorage.setItem("items", JSON.stringify(itemsArray));
        let htmlItem = document.getElementById(`${found.id}`);
        let inputController = htmlItem.children[0];
        updateHtmlItem(found, inputController);
        updateButtonsState(inputController);
        changeSaveEditButtonState(inputController);
        activateListeners();
        return;
    }
    let itemObject = { value: item.value, id: Date.now() };
    itemsArray.push(itemObject);
    localStorage.setItem("items", JSON.stringify(itemsArray));
    let htmlTemplate = getItemHtmlTemplate(itemObject);
    toDoList.innerHTML += htmlTemplate;
    activateListeners();
}

function updateHtmlItem(item, inputController) {
    inputController.children[0].children[0].innerText = item.value;
}

function updateButtonsState(inputController) {
    inputController.children[1].children[0].style.backgroundColor = '#FF3D00';
}
