// Assignments
const baseURL = "http://localhost:3000/recipes"
const btnAddRec = document.getElementById("add-recipe");
const mealSelector = document.getElementById("meal-selector");
const btnLoadSel = document.getElementById("meal-select");
const recListSec = document.getElementById("recipe-list");
const recDispSec = document.getElementById("recipe-display");

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes()
    // btnAddRec.addEventListener("click", addRecipeRequest)
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

function postComment(e) {
    const newComment = e.target.value;
    console.log(newComment)
    fetch(baseURL + `/${e.target.id}`)
    .then(resp => resp.json())
    .then(recObj => {
        const comments = recObj.comments;
        comments.push(newComment)
    })
    fetch(baseURL + `/${e.target.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({comments})
    }) .then(renderComment(newComment))
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
    recList.innerText = recipe.name;
    recList.addEventListener('click', getRecipeDetails)
    recListSec.appendChild(recList)
}


function renderDetails(recipe) {
    // Hide the recipe index list when rendering details of a recipe
    recListSec.style="display: none"
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
    instrHeader.innerText = "Instructions:"
    const recInstructions = document.createElement('ol');
    recInstructions.className = "card";
    let instrArr = recipe.instructions;
    instrArr.forEach(instr => {
        const instrLi = document.createElement("li");
        instrLi.innerText = `${instr}`
        recInstructions.append(instrLi)
    })
    // Create a comment section and button
    const commentHeader = document.createElement("h3");
    commentHeader.innerText = "Comments:";
    const btnAddComment = document.createElement("button");
    btnAddComment.id = "btn-add-comment";
    btnAddComment.innerText = " Add a comment "
    btnAddComment.addEventListener("click", addCommentForm);
    const commentSection = document.createElement("ul");
    commentSection.className = "card";
    commentSection.id = "comment-section";
    let commArr = recipe.comments;
    commArr.forEach(comment => {
        const commentPara = document.createElement("li")
        commentPara.innerText = `${comment}`
        commentSection.append(commentPara)
    });
    // Create the back button and add event listener
    const backBtn = document.createElement("button");
    backBtn.innerText = " Back to Index ";
    backBtn.addEventListener("click", revealList);
    recCard.append(ingredientHeader, recIngList, instrHeader, recInstructions, commentHeader, btnAddComment, commentSection, backBtn);
    recDispSec.appendChild(recCard);
}

function renderComment(e){
    // Hide the add comment button so you can't add more than one at a time
    const btnAddComment = document.getElementById("btn-add-comment");
    btnAddComment.style="display: in-block";
    // Look up the comment section
    const commentSection = document.getElementById("comment-section");
    const newCommentLi = document.createElement("li");
    let newCommentInput = document.getElementById("new-comment");
    newCommentLi.innerText = newCommentInput.value;
    commentSection.append(newCommentLi);
    const commentForm = document.getElementById("comment-form");
    commentForm.remove();
    const btnCommSubmit = document.getElementById("btn-comm-submit");
    btnCommSubmit.remove();
}


// Event Handlers

function revealList() {
    recDispSec.innerHTML = "";
    recListSec.style="display: inline-block"
}

function addCommentForm() {
    const commentSection = document.getElementById("comment-section");
    const btnAddComment = document.getElementById("btn-add-comment");
    btnAddComment.style="display: none";
    
    const commentForm = document.createElement("form");
    commentForm.id = "comment-form";
    commentForm.innerHTML = `
        <textarea required id="new-comment" placeholder="Add your comment for this recipe"></textarea>
    `
    const btnCommSubmit = document.createElement("button");
    btnCommSubmit.innerText = " Submit Comment ";
    btnCommSubmit.id = "btn-comm-submit";
    btnCommSubmit.addEventListener("click", renderComment);
    commentSection.prepend(commentForm, btnCommSubmit);
    
}

// function addRecipeRequest() {
//     recDispSec.innerHTML = "";
// }