function parseSubmitRequest(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
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

const funcSubmit = () => {
    socket.emit('chat message', {
        msg: document.getElementById('postedMessage').value,
        room: room,
        name: name
    });
    document.getElementById('postedMessage').value = '';
    location.reload();
    return false;
};

module.exports = { parseSubmitRequest, handleErrors, funcSubmit };