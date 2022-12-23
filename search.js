const entries = document.querySelectorAll('.entry');
const tagButtons = document.querySelectorAll('.tag-button');
console.log(`Buttons registered: ${tagButtons}`);
function handleTagButtonClick(event) {
    console.log(`Tag button clicked: ${event.target.dataset.tag}`);
    button.style.display = 'block'
    const clickedButton = event.target;
    const clickedTag = clickedButton.dataset.tag;

    document.body.style.backgroundColor = clickedButton.dataset.color;
    tagButtons.forEach(button => button.classList.remove('ghostbutton'));
    clickedButton.classList.add('ghostbutton');

    entries.forEach(entry => {
        if (entry.dataset.tags.includes(clickedTag)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
}
tagButtons.forEach(button => button.addEventListener('click', handleTagButtonClick));

const button = document.querySelector('#reset');

function handleButtonClick() {
    console.log('Reset button clicked');

    document.body.style.backgroundColor = 'white';
    entries.forEach(entry => entry.style.display = 'block');
    tagButtons.forEach(button => button.classList.remove('ghostbutton'))
    button.style.display = 'none'

}

button.addEventListener('click', handleButtonClick);