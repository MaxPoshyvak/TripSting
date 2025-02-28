window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        document.querySelector('header').style.backgroundColor = 'white';
    } else {
        document.querySelector('header').style.backgroundColor = '#ffb319';
    }
});
document.getElementById('getTips').addEventListener('click', function () {
    window.scrollTo({
        top: 1000,
        behavior: 'smooth', // Плавна анімація
    });
});
