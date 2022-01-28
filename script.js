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

// Rendering

function renderAllRecipes(recArr) {
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
    const btnAddComment = document.createElement("button")
    btnAddComment.innerText = " Add a comment "
    btnAddComment.addEventListener("click", addCommentForm)
    const commentSection = document.createElement("ul");
    commentSection.className = "card";
    commentSection.id = "commentSection";
    let commArr = recipe.comments;
    commArr.forEach(comment => {
        const commentPara = document.createElement("li")
        commentPara.innerText = `${comment}`
        commentSection.append(commentPara)
    })
    
    // Create the back button and add event listener
    const backBtn = document.createElement("button");
    backBtn.innerText = " Back to Index ";
    backBtn.addEventListener("click", revealList);
    
    recCard.append(ingredientHeader, recIngList, instrHeader, recInstructions, commentHeader, btnAddComment, commentSection, backBtn);
    recDispSec.appendChild(recCard);
}


// Event Listeners



// Event Handlers

function revealList() {
    recDispSec.innerHTML = "";
    recListSec.style="display: inline-block"
}

function addCommentForm() {
    console.log("hi")
}