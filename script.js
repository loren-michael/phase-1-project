// Assignments
const baseURL = "http://localhost:3000/recipes"
const selectBar = document.getElementById("select");
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
    selectBar.prepend(backBtn)

}

function renderComment() {
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

function filterRecipesByMeal() {
    const recipeList = document.getElementById("recipe-list");
    const mealType = mealSelector.value;
    let listLi = recipeList.getElementsByTagName("li")
    console.log(listLi)
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


// Event listeners

btnAddRec.addEventListener("click", toggleFormVisibility)
btnLoadSel.addEventListener("click", filterRecipesByMeal)


// Event Handlers

function revealList() {
    recDispSec.innerHTML = "";
    recListSec.style="display: inline-block"
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
    if (e.target.innerText === "Add A Recipe") {
        e.target.innerText = "Hide Form";
        document.getElementById("add-recipe-div").classList.remove("hide")
    } else if (e.target.innerText !== "Add A Recipe") {
        e.target.innerText = "Add A Recipe";
        document.getElementById("add-recipe-div").classList.add("hide");
    }
}
