const recipes = require('./recipe-api');
const express = require('express');
const app = express();

app.get('/', function(request, response){
    recipes.getRecipes(request.query)
        .then(function(items){
            response.send(items);
        })
        .catch(function(error){
            response.send('failed to get a recipe');
        });    
    });

app.get('/recipes', function(request, response){
    recipes.getAllRecipes(request.query)
        .then(function(items){
            // console.log(items);
            // we have the items here
            // right now they are not in the right format
            response.send('total items: ' + items.length);
        })
        .catch(function(error){
            response.send('failed to get all recipes');
        });
    });

app.listen(3000, () => console.log('Example app listening on port 3000!'));
