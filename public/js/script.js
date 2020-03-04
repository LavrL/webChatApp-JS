function parseSubmitRequest(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return undefined;
};

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response.json();
}

module.exports = { parseSubmitRequest, handleErrors };