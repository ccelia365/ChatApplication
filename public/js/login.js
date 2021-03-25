/**
 * Validate user info and verify user credentials. Notify users in case of an error.
 */

let notification = document.querySelector(".notification");
let errors = [];

/////Login/////
let loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    saveLogin();
});

/////Sign-Up/////

let signUpBtn = document.getElementById("signUp-btn");
signUpBtn.addEventListener("click", (event) => {
    event.preventDefault();
    saveRegister();
});

//Save User Info

function saveRegister() {

    let name = document.getElementById("name").value;
    let userSignUp = document.getElementById("userSignUp").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    ///////Check if UserName Length > 4
    if (userSignUp.length < 4) {
        errors.push({ msg: "Username must be at least 4 characters" });
    }
    ///////Check if passwords match
    if (newPassword != confirmPassword) {
        errors.push({ msg: "Passwords do not match" });
    }
    ///////Check if password length >6
    if (newPassword.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters" });
    }


    if (errors.length > 0) {
        errorMessages(errors);
    }
    else {
        ////Validation passed

        fetch("/register", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                username: userSignUp,
                password: newPassword
            }),
            headers: {
                'Content-Type': "application/json"
            }
        })

            .then(res => res.json())
            .then(resJSON => { // { error: { errors: [{msg: "Username exists"}] } }

                if (resJSON.error) {
                    console.log(resJSON.error)
                    errorMessages(resJSON.error.errors);
                }
                else {

                    // redirect to login page
                    window.location.href = "/login";
                }
            })

    }
}

//Check user credentials

function saveLogin() {
    let userSignIn = document.getElementById("userSignIn").value;
    let passwordSignIn = document.getElementById("passwordSignIn").value;

    fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            username: userSignIn,
            password: passwordSignIn
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())
        .then(resJSON => {
            if (resJSON.error) {
                console.log(resJSON.error)
                errorMessages(resJSON.error.errors)
            }
            else {

                window.location.href = "/room";
            }
        })

}

/**
 * errors to be in the format: [{msg: "error message text"}, {}]
 * 
 */
function errorMessages(errors) {
    notification.innerHTML = `
        ${errors.map(error => `<li class="userList">${error.msg}</li>`).join('')}
    `;
}


