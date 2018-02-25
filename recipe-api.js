const fetch = require('node-fetch');

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
                return [];
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

        console.log('total ' + recipeCollection.length.toString);
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
    return fetch(recipe.href)
        .then(function(link)
        {
            if (link.ok)
                return { 
                    title: recipe.title, 
                    href: recipe.href, 
                    numberOfIngredients: recipe.ingredients.split(',').length 
                };         
        })
        .catch(function(error){
            console.log('error in remove bad links ' + error.toString());
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
