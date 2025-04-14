function openProfileEditUi() {
    document.getElementById("profile_edit_ui").style.display = "flex";
}
function closeProfileEditUi() {
    document.getElementById("profile_edit_ui").style.display = "none";
    removeParam('edit-profile');
}
function removeParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.replaceState({}, document.title, url.toString());
}

// When profile edit open has in params
document.addEventListener("DOMContentLoaded", ()=>{
    const searchParam = new URLSearchParams(window.location.search);
    const editProfile = searchParam.get('edit-profile');
    if(editProfile) {
        document.getElementById("profile_edit_ui").style.display = "flex";
    }
})