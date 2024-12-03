/* title change */ function TitleChange() {
    document.title = [
        "Page From C715543139",
        "\u6BCF\u65E5 commit \u6311\u6218\u4E2D"
    ][Number(document.visibilityState === "visible")];
}
TitleChange();
document.addEventListener("visibilitychange", TitleChange);
/* holo */ let main = document.getElementsByTagName("main")[0];
let overlay = document.getElementById("overlay");
main.addEventListener("mouseenter", ()=>{
    overlay.style.opacity = 0;
});
main.addEventListener("mouseleave", ()=>{
    overlay.style.opacity = 1;
});

//# sourceMappingURL=index.c36f364e.js.map
