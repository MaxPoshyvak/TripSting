const socket = io('http://localhost:3000');

const emailInput = document.getElementById('email');
const continueButton = document.getElementById('continue');
let isListenerAdded = false; // Це дозволить додати обробник події тільки один раз

document.getElementById('next').addEventListener('click', function (event) {
    event.preventDefault(); // Скасовує стандартну поведінку
});

emailInput.addEventListener('input', () => {
    if (emailInput.value.includes('@') && emailInput.value.includes('.com')) {
        continueButton.style.backgroundColor = '#d69107a1';
        document.getElementById('next').style.color = 'rgba(255, 255, 255, 1)';

        // Перевіряємо, чи обробник події уже додано
        if (!isListenerAdded) {
            continueButton.addEventListener('click', sendEmail); // Викликати функцію відправки email
            isListenerAdded = true; // Запобігаємо додаванню обробника події кожного разу
        }
    } else {
        continueButton.style.backgroundColor = 'rgba(252, 252, 252, 0.26)';
        document.getElementById('next').style.color = '';
    }
});

// Функція для відправки email через fetch
function sendEmail() {
    const mail = emailInput.value;

    const userData = {
        email: mail,
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (response.ok) {
                window.location.replace('/home');
                return response.json();
            } else {
                alert('User already exists');
                console.log('Server error: ', response.status, response.statusText);
            }
        })
        .then((data) => {
            console.log('Server response: ', data);
        })
        .catch((error) => {
            console.log('Error occurred:', error);
        });
}

socket.on('getMail', (data) => {
    console.log(data);
    io.emit('setMail', data);
});
