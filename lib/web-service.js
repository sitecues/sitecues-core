const apiBaseUrl = 'https://ws.sitecues.com/sitecues/api/';

function post(route, data) {
    return fetch(apiBaseUrl + route, {
        method : 'POST',
        // These headers are more semantically correct, but they
        // trigger a "non-simple" CORS request.
        // headers : {
        //     Accept         : 'application/json',
        //     'Content-Type' : 'application/json'
        // },
        body : JSON.stringify(data)
    });
}

export {
    post
};
