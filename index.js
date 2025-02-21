import express from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';
import { Server } from 'socket.io';
import http from 'http';
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

let mailCanSended = 'mail';

// Створюємо транспорт для надсилання пошти
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL, // Має бути правильний email
        pass: process.env.PASS, // Має бути правильний пароль або пароль додатку
    },
});

// Функція для надсилання email
const sendingEmailReg = async () => {
    const mailOptions = {
        from: process.env.GMAIL,
        to: 'kvsam7395@gmail.com',
        subject: 'TriPsting',
        html: '<h1>Welcome!</h1><p>Thank you for your registratinst on our site.</p> <span>Our site: </span><a href="http://localhost:3000/home">https://tripsting.com<a>',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email надіслано успішно:', info.response);
        return { success: true, info };
    } catch (err) {
        console.log('Помилка при відправці пошти:', err);
        return { success: false, error: err };
    }
};

// Middleware для обробки JSON-запитів
app.use(express.json());

// Шлях до файлу з даними користувачів
const usersFilePath = path.join(__dirname, './data/users.json');

// Функції для роботи з файлом
const GetDataFromFile = async (filePath) => {
    try {
        const data = await promisify(fs.readFile)(filePath, 'utf-8');
        return JSON.parse(data); // Парсинг JSON після зчитування файлу
    } catch (error) {
        console.error(`Помилка при зчитуванні файлу ${filePath}:`, error);
        return [];
    }
};

const AddDataToFile = async (filePath, data) => {
    try {
        await promisify(fs.writeFile)(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Помилка при записі у файл ${filePath}:`, error);
    }
};

// Маршрут для додавання нового користувача
app.post('/register', async (req, res) => {
    const { email } = req.body;

    console.log('Received email:', email); // Додайте логування для перевірки отриманого email
    mailCanSended = email;
    if (email) {
        const users = await GetDataFromFile(usersFilePath);
        const userExist = users.some((user) => user.email === email);

        if (userExist) {
            console.log('User already exists'); // Логування при існуючому користувачі
            return res.status(400).json({ message: 'Користувач уже існує' });
        }

        const sendIt = await sendingEmailReg();

        const userData = { email };
        users.push(userData);
        await AddDataToFile(usersFilePath, users);

        console.log(`Користувач з email "${email}" доданий`);
        return res.status(200).json({ message: 'Дані успішно отримано' });
    } else {
        console.log('Invalid input'); // Логування при неправильному вводі
        return res.status(400).json({ message: 'Неправильний ввід' });
    }
});

app.post('/signing', async (req, res) => {
    const { email } = req.body;
    mailCanSended = email;

    if (email) {
        const users = await GetDataFromFile(usersFilePath);
        const userExist = users.some((user) => user.email === email);

        if (userExist) {
            console.log('Succesfully'); // Логування при існуючому користувачі
            return res.status(200).json({ message: 'Успішно' });
        }
    } else {
        console.log('Invalid input'); // Логування при неправильному вводі
        return res.status(400).json({ message: 'Неправильний ввід' });
    }
});

// Маршрути для обробки HTML сторінок
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'registration.html'));
});
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'signIn.html'));
});
app.get('/routes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'routes.html'));
});
app.get('/popularPlaces', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'popularPlaces.html'));
});
app.get('/tips', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'tips.html'));
});
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'blog.html'));
});
app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'otherHTML', 'contacts.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
server.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});

//*Bot TG
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const commands = [{ command: '/start', description: 'Lets start' }];

const options = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Support', callback_data: 'btn1' }],
            [{ text: 'Report', callback_data: 'btn2' }],
            [{ text: 'Informations', callback_data: 'btn3' }],
        ],
    },
};

bot.setMyCommands(commands);

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const isIncludeCommand = commands.some((el) => text.includes(el.command));

    console.log(chatId, text);
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        '*Welcome* to *TriPstings* Support Bot! How can we assist you today? \n\n' +
            '_Please select an option to get started:_ \n' +
            '- Need help with booking or planning a trip?\n' +
            '- Having trouble with your account or payment?\n' +
            '- Want information on our latest travel deals?\n' +
            '- Got questions about popular destinations or travel tips?\n\n' +
            "We're here to help make your travel experience smooth and enjoyable!",

        options
    );
});

// bot.onText(/\/events/, (msg) => {
//     bot.sendMessage(msg.chat.id, 'Оберіть подію: ', options);
// });

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data == 'btn1') {
        bot.deleteMessage(chatId, query.message.message_id).then(() => {
            // Надсилання нового повідомлення
            bot.sendMessage(chatId, 'Write your question here: ', {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Back', callback_data: 'btnBack' }]],
                },
            });
        });
    }
    if (data == 'btn2') {
        bot.deleteMessage(chatId, query.message.message_id).then(() => {
            // Надсилання нового повідомлення
            bot.sendMessage(chatId, 'Write your report here: ', {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: 'Back', callback_data: 'btnBack' }]],
                },
            });
        });
    }
    if (data == 'btn3') {
        bot.deleteMessage(chatId, query.message.message_id).then(() => {
            // Надсилання нового повідомлення
            bot.sendMessage(
                chatId,
                '_New information,_ \n\n You can use the promocode for your first trip on our site: `IDUEHAJ`',
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: 'Back', callback_data: 'btnBack' }]],
                    },
                }
            );
        });
    }
    if (data == 'btnBack') {
        const msg = query.message;
        bot.deleteMessage(chatId, query.message.message_id).then(() => {
            // Надсилання нового повідомлення
            bot.sendMessage(
                msg.chat.id,
                'Welcome to TriPstings Support Bot! How can we assist you today? \n\n Please select an option to get started: \n Need help with booking or planning a trip?\n Having trouble with your account or payment?\n Want information on our latest travel deals?\n Got questions about popular destinations or travel tips?\n Were here to help make your travel experience smooth and enjoyable!',
                options
            );
        });
    }
});
const sendingEmailSupport = async (firstName, lastName, phone, textQuestion, mailCanSended) => {
    const mailOptions = {
        from: process.env.GMAIL,
        to: 'kvsam7395@gmail.com',
        subject: 'TriPsting',
        html: `<h1>New Message!</h1> <p>Form: </p><h2>${firstName} ${lastName}</h2> <br> <p>Phone: </p><h2>${phone}</h2> <br> <p>Email: </p><h2>${mailCanSended}</h2> <br> <p>Message: </p> <h2>${textQuestion}</h2>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email надіслано успішно:', info.response);
        return { success: true, info };
    } catch (err) {
        console.log('Помилка при відправці пошти:', err);
        return { success: false, error: err };
    }
};

bot.on('polling_error', (err) => {
    console.error(err);
});

// console.log(email);

io.on('connection', (socket) => {
    fs.readFile('./data/importedData.txt', 'UTF8', (err, data) => {
        socket.emit('getInfoForFront', data);
    });
    fs.readFile('./data/placesAdd.json', 'UTF8', (err, data) => {
        let finaldata = JSON.parse(data);
        socket.emit('sendDataRoutes', finaldata);
    });
    socket.on('isSubmit', (data) => {
        sendingEmailSupport(data[0], data[1], data[2], data[3], mailCanSended);
    });
});
