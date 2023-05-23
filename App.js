//---Firebase---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-cab43-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");
//-----
const input = document.getElementById("input");
const addButton = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());
    shoppingListEl.innerHTML = "";
    for (let shoppingItem of shoppingListArray) {
      addListHtml(shoppingItem);
    }
  } else {
    shoppingListEl.innerHTML = "<h3>No items here... yet</h3>";
  }
});

function addListHtml(item) {
  let itemID = item[0];
  let itemValue = item[1].name;
  let checked = item[1].done;

  if (itemValue) {
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    //delete function
    newEl.addEventListener("dblclick", function () {
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
      remove(exactLocationOfItemInDB);
    });
    //toggle function
    newEl.addEventListener("click", function () {
      checked = !checked;
      //newEl.classList.toggle("green");
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
      update(exactLocationOfItemInDB, { done: checked });
    });

    newEl.style.backgroundColor = checked ? "rgb(182, 227, 115)" : "#fffdf8";

    shoppingListEl.append(newEl);
  }
}

function add() {
  const inputValue = input.value;
  if (inputValue) {
    push(shoppingListInDB, { name: inputValue, done: false });
    input.value = "";
  }
}
addButton.addEventListener("click", add);
