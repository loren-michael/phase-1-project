// Assignments
const baseURL = "http://localhost:3000/recipes";
const navBar = document.getElementById("navigation");
const selectBar = document.getElementById("select");
const btnAddRec = document.getElementById("add-recipe");
const mealSelector = document.getElementById("meal-selector");
const btnLoadSel = document.getElementById("meal-select");
const recListSec = document.getElementById("recipe-list");
const recDispSec = document.getElementById("recipe-display");
const recipeForm = document.getElementById("add-recipe-form");
const btnAddIng = document.getElementById("btn-add-ingredient");
const btnAddInstr = document.getElementById("btn-add-instructions");
const btnSubmitRec = document.getElementById("submit-new-recipe");
const btnResetForm = document.getElementById("add-form-reset")

// console.log(btnAddIng)
// console.log(btnAddInstr)

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes()
})// End of DOMContentLoaded


// Fetches

function fetchRecipes() {
    return fetch(baseURL)
    .then(resp => resp.json())
    .then(renderAllRecipes)
}

function getRecipeDetails(e) {
    return fetch(baseURL + `/${e.target.id}`)
    .then(resp => resp.json())
    .then(renderDetails)
}

function patchComment(e) {
    // Look up recipe ID and retrieve the value from the comment box
    const id = e.target.parentNode.parentNode.id;
    const newCommentInput = document.getElementById("new-comment")
    const newComment = newCommentInput.value;
    // Patch to the recipe through the ID, push new comment to the comment array and render
    fetch(baseURL + `/${id}`)
    .then(resp => resp.json())
    .then(recObj => {
        let comments = recObj.comments;
        comments.push(`${newComment}`)
            fetch(baseURL + `/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({comments})
        }) .then(renderComment(newComment))
    }) 
}

function postNewRecipe(newRecObj) {
    // console.log(JSON.stringify(newRecObj))
    fetch(baseURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecObj)
    })
    .then(resp => resp.json())
    .catch(error => console.error('Error', error))
    .then(reloadPage)
}


// Rendering

function renderAllRecipes(recArr) {
    // This hides the recipe display if one was being displayed
    recDispSec.innerHTML = "";
    recArr.forEach(renderOneRecipe)
}

function renderOneRecipe(recipe) {
    const recList = document.createElement("li")
    recList.id = recipe.id;
    recList.className = recipe.mealtype;
    recList.innerText = recipe.name;
    recList.addEventListener("click", getRecipeDetails)
    recListSec.appendChild(recList)
}

function renderDetails(recipe) {
    // Hide the recipe index list when rendering details of a recipe
    recListSec.style="display: none";
    btnAddRec.className = "hide";

    // Create the recipe card
    const recCard = document.createElement("div");
    recCard.className = "card";
    recCard.id = recipe.id;
    // Rendering the recipe image, name and author
    recCard.innerHTML = `
        <img class="center" src="${recipe.img}">
        <h2 align="middle">${recipe.name}</h2>
        <h3 align="middle">By ${recipe.author}</h3>
    `;
    // Check to see if there is a source link, adding link if available
    if(recipe.source.length > 0) {
        const recipeLink = document.createElement("a");
        recipeLink.style.marginLeft = "auto";
        recipeLink.style.marginRight = "auto";
        recipeLink.innerHTML = `
            <a target="_blank" href="${recipe.source}">Recipe source link</a>
        `;
        recCard.append(recipeLink)
    }
    //Creating ingredient header and list using a forEach
    const ingredientHeader = document.createElement("h3");
    ingredientHeader.innerText = "Ingredients:";
    const recIngList = document.createElement("ul");
    recIngList.id = "ingList";
    let ingArr = recipe.ingredients;
    ingArr.forEach(ing => {
        const ingLi = document.createElement("li");
        ingLi.innerText = `${ing}`;
        recIngList.append(ingLi)
    })
    //Creating instruction header and list using a forEach
    const instrHeader = document.createElement("h3");
    instrHeader.innerText = "Instructions:";
    const recInstructions = document.createElement('ol');
    recInstructions.className = "card";
    let instrArr = recipe.instructions;
    instrArr.forEach(instr => {
        const instrLi = document.createElement("li");
        instrLi.innerText = `${instr}`;
        recInstructions.append(instrLi)
    })
    // Create a comment section and submit button
    const commentHeader = document.createElement("h3");
    commentHeader.innerText = "Comments:";
    const btnAddComment = document.createElement("button");
    btnAddComment.id = "btn-add-comment";
    btnAddComment.innerText = " Add a comment ";
    btnAddComment.addEventListener("click", addCommentForm);
    const commentSection = document.createElement("ul");
    commentSection.className = "card";
    commentSection.id = "comment-section";
    let commArr = recipe.comments;
    if (commArr.length > 0) {
        commArr.forEach(comment => {
        const commentPara = document.createElement("li");
        commentPara.innerText = `${comment}`;
        commentSection.append(commentPara)
    })};
    // Create the back button, back button clone for the top of the page and add event listener
    const backBtn = document.createElement("button");
    backBtn.id = "back-btn";
    backBtn.innerText = " Back to Index ";
    backBtn.addEventListener("click", revealList);
    const backBtnClone = backBtn.cloneNode(true);
    backBtnClone.id = "back-btn-clone";
    backBtnClone.addEventListener("click", revealList);
    recCard.append(ingredientHeader, recIngList, instrHeader, recInstructions, commentHeader, btnAddComment, commentSection, backBtn);
    recDispSec.appendChild(recCard);
    selectBar.classList = "hide";
    navBar.append(backBtnClone)
}

function renderComment() {
    // Hide the add comment button so you can't add more than one at a time
    const btnAddComment = document.getElementById("btn-add-comment");
    btnAddComment.style="display: in-block";
    // Look up the comment section
    const commentSection = document.getElementById("comment-section");
    const newCommentLi = document.createElement("li");
    // Create a new comment element and insert text from form, append to comments
    let newCommentInput = document.getElementById("new-comment");
    newCommentLi.innerText = newCommentInput.value;
    commentSection.append(newCommentLi);
    // Remove the form and button after submitting the comment
    const commentForm = document.getElementById("comment-form");
    commentForm.remove();
    const btnCommSubmit = document.getElementById("btn-comm-submit");
    btnCommSubmit.remove();
}


// Event listeners

btnAddRec.addEventListener("click", toggleFormVisibility)
btnLoadSel.addEventListener("click", filterRecipesByMeal)
btnAddIng.addEventListener("click", addIngBox)
btnAddInstr.addEventListener("click", addInstrBox)
btnSubmitRec.addEventListener("click", createNewRecObj)
btnResetForm.addEventListener("click", resetForm)


// Event Handlers

function revealList() {
    recDispSec.innerHTML = "";
    recListSec.style="display: inline-block";
    document.getElementById("back-btn-clone").remove();
    btnAddRec.classList.remove("hide");
    selectBar.classList.remove("hide")
}

function addCommentForm() {
    // Find the comment section and the add comment button so we can hide it later
    const commentSection = document.getElementById("comment-section");
    const btnAddComment = document.getElementById("btn-add-comment");
    btnAddComment.style="display: none";
    // Add the comment form to the comment section
    const commentForm = document.createElement("form");
    commentForm.id = "comment-form";
    commentForm.innerHTML = `
        <textarea required id="new-comment" placeholder="Add your comment for this recipe"></textarea>
    `
    const btnCommSubmit = document.createElement("button");
    btnCommSubmit.innerText = " Submit Comment ";
    btnCommSubmit.id = "btn-comm-submit";
    btnCommSubmit.addEventListener("click", patchComment);
    commentSection.prepend(commentForm, btnCommSubmit);
}

function toggleFormVisibility(e) {
    recListSec.style="display: none";
    selectBar.className = "hide";
    if (e.target.innerText === "Add A Recipe") {
        e.target.innerText = "Hide Form";
        document.getElementById("add-recipe-div").classList.remove("hide")
    } else if (e.target.innerText !== "Add A Recipe") {
        e.target.innerText = "Add A Recipe";
        document.getElementById("add-recipe-div").classList.add("hide");
        recListSec.style="display:inline-block";
        selectBar.classList.remove("hide")
    }
}

function filterRecipesByMeal(e) {
    e.preventDefault()
    const recipeList = document.getElementById("recipe-list");
    const mealType = mealSelector.value;
    let listLi = recipeList.getElementsByTagName("li")
    // console.log(listLi)
    for(i=0; i < listLi.length; i++) {
        if (mealType === "Show All"){
            listLi[i].style.display = ""
        } else if (listLi[i].className === mealType) {
            listLi[i].style.display = ""
        } else {
            listLi[i].style.display = "none"
        }
    }
}

function addIngBox(e) {
    const lineBreak = document.createElement("br");
    const newIngBox = document.createElement("input");
    newIngBox.type = "text";
    newIngBox.id = "add-ingredient"
    newIngBox.name = "add-ingredient";
    const addButton = e.target.parentNode; // targets the div
    addButton.insertBefore(newIngBox, e.target);
    addButton.insertBefore(lineBreak, e.target)
}

function addInstrBox(e) {
    const lineBreak = document.createElement("br");
    const newInstrBox = document.createElement("input");
    newInstrBox.type = "text";
    newInstrBox.id = "add-instructions";
    newInstrBox.name = "add-instructions";
    const addButton = e.target.parentNode; // targets the div
    addButton.insertBefore(newInstrBox, e.target);
    addButton.insertBefore(lineBreak, e.target)
}

function createNewRecObj (e) {
    e.preventDefault();// Prevent default on a submit is preventing you from the automatic POST, which in turn stops the page from refreshing
    //Create our Ingredients array from the HTML collection pulled from our form
    let ingArr = [];
    let ingColl = document.getElementsByClassName("addIngredients");
    for (let i = 0; i < ingColl.length; i++) {
        if (ingColl[i].value.length > 0) {
            ingArr.push(ingColl[i].value)
        }
    };
    // Create our Instructions array from the HTML collection pulled from our form
    let instrArr = [];
    let instrColl = document.getElementsByClassName("addInstr");
    for (let i = 0; i < instrColl.length; i++) {
        if (instrColl[i].value.length > 0) {
            instrArr.push(instrColl[i].value)
        }
    };
    // Create initial comment array
    let commArr = [];
    if (document.getElementById("init-comm").value.length > 0) {
        commArr.push(document.getElementById("init-comm").value)
    };
    //Create our new Recipe Object to be POST-ed to the database
    let newRecObj = {
        img: document.getElementById("add-img").value,
        video: document.getElementById("add-video").value,
        name: document.getElementById("add-name").value,
        source: document.getElementById("add-source").value,
        author: document.getElementById("add-author").value,
        mealtype: document.getElementById("add-meal-selector").value,
        preptime: document.getElementById("add-preptime").value,
        cooktime: document.getElementById("add-cooktime").value,
        servings: document.getElementById("add-servings").value,
        instructions: instrArr,
        ingredients: ingArr,
        comments: commArr
    }
    // console.log(newRecObj)
    postNewRecipe(newRecObj);
}

function reloadPage() {
    location.reload(true);
}

function resetForm() {
    recipeForm.reset()
}