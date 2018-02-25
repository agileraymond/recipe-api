const recipes = require('./recipe-api');
const express = require('express');
const app = express();

app.get('/', function(request, response) {
    recipes.getRecipes(request.query)
        .then(function(items){
            //console.log(items);
            response.send(items);
        });    
    });

app.get('/all', function(request, response) {
    recipes.getAllRecipes(request.query)
        .then(function(items){
            response.send('total items: ' + items.length);
        });
    });

app.listen(3000, () => console.log('Example app listening on port 3000!'));
