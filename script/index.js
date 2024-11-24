function TitleChange(){
    document.title = ["Page From C715543139", "每日commit挑战中"][Number(document.visibilityState === "visible")];
}

TitleChange();
document.addEventListener("visibilitychange", TitleChange);