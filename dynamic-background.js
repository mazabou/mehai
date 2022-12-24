const imageBorder = document.querySelector('#me')
let colors = ["hsl(206, 70%, 90%)", "hsl(142, 52%, 90%)", "hsl(347, 90%, 90%)"];
let index = 0;

imageBorder.style.transition = "border-color 2s";

setInterval(function() {
    imageBorder.style.borderColor = colors[index];
    index = (index + 1) % colors.length;
}, 2000);