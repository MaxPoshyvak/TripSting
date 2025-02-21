window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        document.querySelector('header').style.backgroundColor = 'white';
    } else {
        document.querySelector('header').style.backgroundColor = '#ffb319';
    }
});

document.getElementById('toSendMassage').addEventListener('click', function () {
    window.scrollTo({
        top: 1100, // Скрол назад на 300 пікселів
        behavior: 'smooth', // Плавна анімація
    });
});
