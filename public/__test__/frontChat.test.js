const { parseSubmitRequest, handleErrors, funcSubmit } = require('../js/script');
const fetchMock = require('fetch-mock');

test('checks if parseSubmitRequest function exists', () => {
    expect(parseSubmitRequest).toBeDefined();
});

test('checks if parseSubmitRequest works', () => {
    let variable = 'username';
    expect(parseSubmitRequest(variable)).toBe('lavr1');

    variable = 'user';
    expect(parseSubmitRequest(variable)).toBe(undefined);
});

test('check handleError function', () => {
    var successMessage = { ok: false, status: '1' };

    successMessage.ok = true;
    expect(() => handleErrors(successMessage)).toThrow();

    successMessage.ok = false;
    expect(() => handleErrors(successMessage)).toThrow();
});
// test('submit function with no parameters', () => {
//     //spyOn(funcSubmit, 'funcSubmit');
//     // const mockFn = jest.fn().mockImplementation(funcSubmit);
//     // // c.circumference(2);
//     // expect(mockFn.mock.calls[0][0]).toEqual(1);

// })

// test('checks if handleErrors works in fetch request', async () => {
//     fetchMock.get("http://localhost:3000/chats", {hello: "world"});
//     const response = await fetch('http://localhost:3000/chats');
//     console.log('response ', await response.json());
//     expect(handleErrors).toContain(response);
// })