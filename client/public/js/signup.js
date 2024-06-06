const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const name = e.target.name.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password = e.target.password.value;
        const userObj = { name: name, email: email, phone: phone, password: password };

        console.log("@@@@@", userObj)
        const signup = await axios.post("http://localhost:3000/signup", userObj);
        alert(signup.data.message);
        window.location.href = "login.html";
    }
    catch (err) {
        alert(err.response.data.error);
    }
});