function TitleChange() {
    document.title = ["Page From C715543139", "每日 commit 挑战中"][Number(document.visibilityState === "visible")];
}

TitleChange();
document.addEventListener("visibilitychange", TitleChange);
