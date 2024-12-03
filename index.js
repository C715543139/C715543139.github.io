/* title change */
function TitleChange() {
    document.title = ["Page From C715543139", "每日 commit 挑战中"]
        [Number(document.visibilityState === "visible")];
}
TitleChange();
document.addEventListener("visibilitychange", TitleChange);

/* holo */
let main = document.getElementsByTagName("main")[0];
let overlay = document.getElementById("overlay");
main.addEventListener("mouseenter", ()=>{
    overlay.style.opacity = 0;
})
main.addEventListener("mouseleave", ()=>{
    overlay.style.opacity = 1;
})