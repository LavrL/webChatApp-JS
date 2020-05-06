const { parseSubmitRequest, handleErrors, funcSubmit } = require('../js/script');
const fetchMock = require('fetch-mock');

describe('FrontChat testing', () => {
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
        var successMessage = { ok: false, status: '1', json: jest.fn() };
        expect(() => handleErrors(successMessage)).toThrow('1');

        successMessage.ok = true;
        expect(handleErrors(successMessage)).toBe(successMessage.json());
    });

})
