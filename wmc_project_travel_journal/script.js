/* This is for the feedback form on the travel journal website */

(function () {
    const form = document.querySelector('#feedback-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn?.setAttribute('disabled', 'disabled');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            });

            if (response.ok) {
                alert('Danke, dein Feedback wurde gesendet.');
                form.reset();
            } else {
                alert('Senden fehlgeschlagen. Bitte später erneut versuchen.');
            }
        } catch (error) {
            alert('Netzwerkfehler. Bitte später erneut versuchen.');
        } finally {
            submitBtn?.removeAttribute('disabled');
        }
    });
})();

/* Burger Menu Toggle */
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
