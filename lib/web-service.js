const apiBaseUrl = 'https://ws.sitecues.com/sitecues/api/';

function post(path, data) {
    return fetch(apiBaseUrl + path, {
        method : 'POST',
        headers : {
            Accept         : 'application/json',
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    });
}

export {
    post
};
