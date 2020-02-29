const parseSubmitRequest = require('../scripts/script');

test('checks if parseSubmitRequest function exists', () => {
    expect(parseSubmitRequest).toBeDefined();
});

test('checks if parseSubmitRequest works', () => {
    var variable = 'username';
    expect(parseSubmitRequest(variable)).toBe('lavr1');
});