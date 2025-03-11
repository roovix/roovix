// Open sign_up page with given email from join roovix
const user_email_submit_form = document.getElementById('user_email_submit_form');
user_email_submit_form.addEventListener('submit', ()=>{
    event.preventDefault();
    let email = user_email.value;

    if(email === "") {
        user_email.classList.add("empty-input-field");
        return;
    }

    user_email.classList.remove("empty-input-field");
    window.location.href = `sign_up.html?user_email=${email}&source=join_roovix`;
})