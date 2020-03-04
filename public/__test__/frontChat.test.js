const { parseSubmitRequest, handleErrors } = require('../js/script');
const fetchMock = require('fetch-mock');

test('checks if parseSubmitRequest function exists', () => {
    expect(parseSubmitRequest).toBeDefined();
});

test('checks if parseSubmitRequest works', () => {
    var variable = 'username';
    expect(parseSubmitRequest(variable)).toBe('lavr1');
});

// test('checks if handleErrors works in fetch request', async () => {
//     fetchMock.get("http://localhost:3000/chats", {hello: "world"});
//     const response = await fetch('http://localhost:3000/chats');
//     console.log('response ', await response.json());
//     expect(handleErrors).toContain(response);
// })