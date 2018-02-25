const fetch = require('node-fetch');
const _ = require('lodash');

const recipes = {
    getRecipes: function(query) {
        
        const queryString = buildQuerystring(query);
        const url = 'http://www.recipepuppy.com/api/?' + queryString;        
        
        return getInitialRecipes(url)
            .then(function(originalRecipes){                
                const promises = originalRecipes.map(rec =>
                    removeInvalidRecipeLink(rec)                     
                )
                return Promise.all(promises);                
            })
            .catch(function(error){
                console.log('failed inside getRecipes ' + error.toString());
            });   
    },
    getAllRecipes: function(query){            
        // lets default to first 10 pages
        // to get all recipes

        let pageNumbers = [1,2,3,4,5,6,7,8,9,10];

        const promises = pageNumbers.map(page => {
            query.p = page;           
            return recipes.getRecipes(query);                     
        })

        return Promise.all(promises);
    }
}

// function to sort recipes by ingredients
// lodash has lots of utilities to help us here
const findRecipeWithMostIngredients = function(recipes){
    return _.sortBy(recipes, ['numberOfIngredients']); 
}

const getInitialRecipes = function(url)
{
    return fetch(url) 
        .then(res => res.json())
        .then(function(body) {
            return body.results;       
        });
}   

const removeInvalidRecipeLink = function(recipe){
    return fetch(recipe.href)
        .then(function(link) {        
            if (link.ok)
                return { 
                    title: recipe.title, 
                    href: recipe.href, 
                    numberOfIngredients: recipe.ingredients.split(',').length 
                };         
        })
        .catch(function(error) {
            //console.log('error in remove bad links ' + error.toString());
            return { 
                title: recipe.title, 
                href: '', 
                numberOfIngredients: recipe.ingredients.split(',').length 
            };      
        });        
}

const buildQuerystring = function(query) {
    let queryString = '';

    if (query.i)
        queryString += 'i=' + query.i;
    if (query.q)
        queryString += '&q=' + query.q;
    if (query.p)
        queryString += '&p=' + query.p;

    return queryString;    
}

module.exports = recipes;
