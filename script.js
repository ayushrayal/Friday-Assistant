let btn = document.getElementById("btn");
let content = document.getElementById("content");

function speak(text){
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.lang = "hi-GB";
    text_speak.volume = 1; // 0 to 1
    text_speak.rate = 1; // 0.1 to 10
    text_speak.pitch = 2; // 0 to 2
    window.speechSynthesis.speak(text_speak);
}
btn.addEventListener("click", ()=>{
    let text = content.value;
    speak(text);
})