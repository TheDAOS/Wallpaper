document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('Download');
    const success = document.getElementById("S-download");

    button.addEventListener('click', () => {
        if (success.style.display === 'none' || success.style.display === '') {
            success.style.display = 'block';
        } else {
            success.style.display = 'none';
        }
    });
});