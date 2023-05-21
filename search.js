const entries = document.querySelectorAll('.entry');
const tagButtons = document.querySelectorAll('.tag-button');

const footer = document.querySelector('.footer');
const breadcrumbs = document.querySelectorAll('.colorme');
console.log(breadcrumbs);

console.log(`Buttons registered: ${tagButtons}`);
function handleTagButtonClick(event) {
    console.log(`Tag button clicked: ${event.target.dataset.tag}`);
    button.style.display = 'block'
    const clickedButton = event.target;
    const clickedTag = clickedButton.dataset.tag;

    document.body.style.backgroundColor = clickedButton.dataset.color;
    breadcrumbs.forEach(breadcrumb => breadcrumb.style.color = clickedButton.dataset.breadcrumbcolor);
    tagButtons.forEach(button => button.classList.remove('ghostbutton'));
    clickedButton.classList.add('ghostbutton');

    entries.forEach(entry => {
        if (entry.dataset.tags.includes(clickedTag)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });

    footer.style.display = 'none';

}
tagButtons.forEach(button => button.addEventListener('click', handleTagButtonClick));

const button = document.querySelector('#reset');

function handleButtonClick() {
    console.log('Reset button clicked');

    document.body.style.backgroundColor = 'white';
    entries.forEach(entry => entry.style.display = 'block');
    tagButtons.forEach(button => button.classList.remove('ghostbutton'))
    button.style.display = 'none';
    footer.style.display = 'block';
    breadcrumbs.forEach(breadcrumb => breadcrumb.style.color = "rgb(74, 74, 74)");
}

button.addEventListener('click', handleButtonClick);