function validateForm() {
    const nameField = document.forms["loginForm"]["name"].value;
    const roomField = document.forms["loginForm"]["room"].value;
    if ((nameField == "") || (roomField == "")) {
        document.getElementsByClassName("input-form__error-message")[0].innerHTML = "Incorrect Username or Password";
        return false;
    }
    return true;
}