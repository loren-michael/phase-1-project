# Recipe Manager

# Project Description

I built this project to make it easier to find and organize recipes to assist with meal planning. By building my own database of recipes I have limited the database to only the recipes I like, and can customize the information that is provided. In its first version, the Recipe Manager is meant mainly to filter by meal type so that I can choose which recipes I want to use that week. In the future, I intend to add functionality to search for specific ingredients, display and add a filter using tags, and build in a way to show embedded videos on the recipe details page. I thought about adding functionality to edit recipes, but I've decided to use the comments to leave notes instead in order to preserve the integrity of the author's recipe.


# How To Run

In order to run this project, you will need to clone it to your system and run a json server for the recipe database.

In your terminal, navigate to the directory where you'd like to install, and type:
        git clone git@github.com:loren-michael/phase-1-project.git

Once the project is cloned you will need to start your json server. Do this by typing the following into your terminal:
        json-server --watch db.json

If you need to install the json server, please install by typing this into your terminal:
        npm install -g json-server

Once the server is running, open the index.html file in your browser and you should see the Recipe Manager with a list of recipes there for you to interact with.


# Functionality

At its current iteration, the functionality of this project is limited yet powerful. The Recipe Manager has ways for you to Add A Recipe using a detailed form, filter the list of recipes by the type of meal (dinner, lunch, sides), and add comments to each of the recipes so you can keep track of any notes you have.
