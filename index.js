const recipes = require('./recipe-api');
const express = require('express');
const app = express();

app.get('/', function(request, response) {
    validateQuery(request.query);
    response.send(recipes.recipeResults);
});

let validateQuery = function(query) {
    if (query['i'])
        console.log(query.i);
    if (query['q'])
        console.log(query.q);
    if (query['p'])
        console.log(query.p);
    //console.log(query);
};

app.listen(3000, () => console.log('Example app listening on port 3000!'));