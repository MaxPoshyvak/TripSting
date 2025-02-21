setTimeout(() => {
    setTimeout(() => {
        document.querySelector('.description').style.display = 'block';

        document.querySelector('.description').classList.add('animate__animated', 'animate__fadeInUp');

        setTimeout(() => {
            document.querySelector('.starting__btns').style.display = 'flex';

            document.querySelector('.starting__btns').classList.add('animate__animated', 'animate__fadeInUp');
        }, 70);
    }, 0);
}, 0);

window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        document.querySelector('header').style.backgroundColor = 'white';
    } else {
        document.querySelector('header').style.backgroundColor = '#ffb319';
    }
});
