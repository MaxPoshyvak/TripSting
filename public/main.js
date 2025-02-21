const fs = require('fs');
document.getElementById('continue').addEventListener('click', function () {
    const mail = document.getElementById('email').value;

    const userData = {
        email: mail,
    };

    fetch('/', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (response.ok) {
                console.log('Server response: ', response.json());
            } else {
                console.log('Server error: ', response.status, response.statusText);
            }
        })
        .catch((error) => {
            console.log('помилка:', error);
        });
});
