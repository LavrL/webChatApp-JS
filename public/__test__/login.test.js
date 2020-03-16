const validateForm = require('../js/frontScript');

test('checks if forms validation function exists', () => {
    expect(validateForm).toBeDefined();
});

test('test input values with validationForm function - with input', () => {
    document.body.innerHTML += '<div> <form name="loginForm" >' +
        '<input type="text" name="username" id="username" >' +
        '<input type="text" name="room" id="room" >' +
        '</form> </div>';
    const x = document.getElementById('username').value = 'Lavr'
    const y = document.getElementById('room').value = '1'
    expect(validateForm()).toBe(true);
})
test('test input values with validationForm function - no input', () => {
    document.body.innerHTML += '<div> <form name="loginForm" >' +
        '<div class="input-form__error-message"></div>' +
        '<input type="text" name="username" id="username" >' +
        '<input type="text" name="room" id="room" >' +
        '</form> </div>';
    const x = document.getElementById('username').value = ''
    const y = document.getElementById('room').value = ''
    expect(validateForm()).toBe(false);
})
