const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
// const Joi = require('joi');
// const schema = Joi.any();
mongoose.connect("mongodb+srv://akbarali:akbarali2206@cluster0.1t6ltwf.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("MongoDbga muvaffaqiyatli ulanildi...");
    })
    .catch((err) => {
        console.log("MongoDbga ulanishda qandaydir xatolik yuz berdi!", err);
    });

const booksSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    text: String
});
const Book = mongoose.model("Books", booksSchema);

const books = [
    { id: 1, name: 'javascript' },
    { id: 2, name: 'react' },
    { id: 3, name: 'node.js' },
    { id: 4, name: 'python' }
];

app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/head', (req, res) => {
    res.send('Bosh qismi')
})

// id boyicha qidirish
app.get('/api/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        res.status(404).send("Berilgan ID bo'yicha kitob topilmadi");
    }
    res.send(book);
});

app.get('/api/books', async (req, res) => {
        const book = await Book.find().sort('name');
        console.log(book);
        res.send(book);
})



// // qo'shish

app.post('/api/books', async (req, res) => {
    // res.send(req.body)

    if (!req.body) {
        return res.status(400).send('name is not');
    }
    if (req.body.name < 3) {
        return res.status(401).send("name is don't ful");
    }
    const book = await new Book({
        name: req.body.name,
        text: req.body.text
    });
    await book.save();
    console.log(book);
    res.status(201).send(book);

});


// yangilash

app.put('/api/books/:id', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send('name is not');
    }
    if (req.body.name.length < 3) {
        return res.status(401).send("name is don't full");
    }
    const book = await Book.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        text: req.body.text
    });
    if (!book) {
        return res.status(404).send("Berilgan ID bo'yicha kitob topilmadi");
    }

    res.send(book);
});


// o'chirish
app.delete('/api/books/:id', async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        res.status(400).send('Berilgan ID bo\'yicha hech qanday kitob topilmadi')
    }
    res.send(book);
})


const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`${port} portni eshitishni boshladim...`);
});