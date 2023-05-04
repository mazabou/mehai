document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-expand-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        let isExpanded = false;

        $trigger.addEventListener('click', () => {
            if ($target.style.display === 'block') {
                $target.style.display = 'none';
                $trigger.classList.remove("rotate");
                // $trigger.classList.add("fa-chevron-down");
                // contentDiv.style.maxHeight = '500px';
                // expandButton.textContent = 'Expand';
            } else {
                $target.style.display = 'block';
                // $trigger.classList.remove("fa-chevron-down");
                $trigger.classList.add("rotate");
                // contentDiv.style.maxHeight = '1000px'; // Set the max-height to accommodate the expanded content
                // expandButton.textContent = 'Collapse';
            }
            isExpanded = !isExpanded;
        })
        });
    });



