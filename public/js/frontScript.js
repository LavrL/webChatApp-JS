function validateForm() {
    const nameField = document.getElementById('username').value;
    const roomField = document.getElementById('room').value;
    if ((nameField == "") || (roomField == "")) {
        document.getElementsByClassName("input-form__error-message")[0].innerHTML = "Incorrect Username or Password";
        return false;
    }
    return true;
}
module.exports = validateForm;
