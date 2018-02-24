const fetch = require('node-fetch');

/*

fetch('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=1')

{ 
    title: 'Creamy Tomato Sauce for Pasta',
    href: 'http://www.recipezaar.com/Creamy-Tomato-Sauce-for-Pasta-112945',
    ingredients: 'cream, cream cheese, basil, black pepper, garlic, olive oil, parmesan cheese, pesto, salt, tomato sauce',
    thumbnail: '' 
}
  */

const recipes = {
    getRecipes: function(query) {
        
        const queryString = buildQuerystring(query);
        const url = 'http://www.recipepuppy.com/api/?' + queryString;        
        
        return getInitialRecipes(url)
            .then(function(originalRecipes){
                let formattedRecipes = [];

                originalRecipes.forEach(function(result) {
                                        
                    //let finalLink = 
                    let item = removeInvalidRecipeLink(result);
                    //.then(link => {
                    //    return link;                        
                    //});

                    //finalLink.then(l => console.log(l));
                    /*
                    let item = { 
                        title: result.title, 
                        href: finalLink, 
                        numberOfIngredients: result.ingredients.split(',').length 
                    };
                    */
                    formattedRecipes.push(item);
                });

                return formattedRecipes;
            });            
                  
    }
}

let getInitialRecipes = function(url)
{
    return fetch(url) 
        .then(res => res.json())
        .then(function(body) {
            return body.results;       
        });
}   

const removeInvalidRecipeLink = function(recipe){
    let item = { 
        title: recipe.title, 
        href: recipe.href, 
        numberOfIngredients: recipe.ingredients.split(',').length 
    };

    fetch(recipe.href)
        .then(function(link)
        {
            if (!link.ok)
               item.href = '';             
        })
        .catch(function(error){
            console.log('error with link: ' + recipe.href);
            item.href = '';            
        })
        .then(function() {                                        
            }, function(){                
        });
        
    return item;        
}

const buildQuerystring = function(query) {
    let queryString = '';

    if (query.i)
        queryString += 'i=' + query.i;
    if (query.q)
        queryString += '&q=' + query.q;
    if (query.p)
        queryString += '&p=' + query.p;

    //console.log(queryString);
    return queryString;    
}

module.exports = recipes;
