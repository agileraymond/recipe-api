const fetch = require('node-fetch');

//fetch('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=1')

const recipes = {
    getRecipes: function(query) {
        //console.log(query);
        const queryString = buildQuerystring(query);
        const url = 'http://www.recipepuppy.com/api/?' + queryString;
        //console.log(url);

        let formattedRecipes = [];

        return fetch(url) 
            .then(res => res.json())
            .then(function(body) {
                //console.log(body);               
                
                body.results.forEach(function(result) {
                    //console.log(result.href);
                    formattedRecipes.push(result);
                });

                return formattedRecipes;
            });        
    }
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
