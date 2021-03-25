/**
 * Redirect to login after logging out
 */

let logOutBtn = document.getElementById("logOut-btn");
logOutBtn.onclick = logOut;
function logOut() {
    fetch("/logout", {
        method: "GET"
    })
        .then(res => res.json())
        .then(resJSON => {
            if (resJSON.error) {
                console.log(resJSON.error)
            }
            else {
                
                window.location.href = "/login";
            }
        })
}