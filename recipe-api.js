const fetch = require('node-fetch');

/*
fetch('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=1')
{   title: 'Creamy Tomato Sauce for Pasta',
    href: 'http://www.recipezaar.com/Creamy-Tomato-Sauce-for-Pasta-112945',
    ingredients: 'cream, cream cheese, basil, black pepper, garlic, olive oil, parmesan cheese, pesto, salt, tomato sauce',
    thumbnail: '' 
}*/

const recipes = {
    getRecipes: function(query) {
        
        const queryString = buildQuerystring(query);
        const url = 'http://www.recipepuppy.com/api/?' + queryString;        
        
        return getInitialRecipes(url)
            .then(function(originalRecipes){
                let formattedRecipes = [];

                originalRecipes.forEach(function(nextRecipe) {
                    let item = removeInvalidRecipeLink(nextRecipe);
                    formattedRecipes.push(item);
                });

                return formattedRecipes;
            });   
    },
    getAllRecipes: function(query){
    
        let hasItems = true;
        let recipeCollection = [];
        let pageNumber = 1;

        // set page number to 1
        query.p = pageNumber;

        //while (hasItems)
        for (let i = 1; i < 10; i++)
        {
            query.p = i;
            console.log('all page' + i.toString());
            recipes.getRecipes(query)
                .then(function(items){

                    console.log('item count: ' + items.length.toString());

                    if (items && items.length > 0)
                    {
                        //console.log(items.length);
                        recipeCollection.concat(items);
                        //pageNumber++;
                        //query.p = pageNumber;
                    }
                    else{                                            
                        hasItems = false;
                    }
                })
                .catch(function(error){                    
                    })
                .then(function() {                                        
                    }, function(){
                });                
            
            pageNumber++;
        };
    }
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

    return queryString;    
}

module.exports = recipes;
