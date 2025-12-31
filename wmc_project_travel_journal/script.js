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
