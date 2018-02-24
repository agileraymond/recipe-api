const fetch = require('node-fetch');

//fetch('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=1')

let recipes = function()
{
    let recipeResults = fetch('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet') 
    .then(res => res.json())
    .then(body => console.log(body));
}

let buildUrl = function(query) {
        
}

module.exports = recipes;    