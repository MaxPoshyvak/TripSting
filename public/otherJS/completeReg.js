const next = () => {
    document.getElementById('next').setAttribute('href', '/home');
};

const Nonext = () => {
    document.getElementById('next').setAttribute('href', '');
};

export { next, Nonext };
