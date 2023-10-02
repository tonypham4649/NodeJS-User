const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const users = require('./public/data/users.json');

app.get('/users', (req, res) => {
    res.render('list-user', { users })
})

app.get('/users/:id', (req, res) => {
    const user = users.find(user => user.id === +req.params.id)
    res.render('detail-user', { user })
})

app.delete('/delete/:id', (req, res) => {
    const userId = +req.params.id;
    const data = JSON.parse(fs.readFileSync('./public/data/users.json'), 'utf8')


    const updatedUsers = data.filter(user => user.id !== userId);

    if (updatedUsers.length !== data.length) {
        fs.writeFileSync('./public/data/users.json', JSON.stringify(updatedUsers));
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/update/:id', (req, res) => {
    const userId = +req.params.id
    const updatedData = req.body;

    const data = JSON.parse(fs.readFileSync('./public/data/users.json'), 'utf8')
    let user = data.find(u => u.id === userId);

    if (user) {
        Object.assign(user, updatedData);

        fs.writeFileSync('./public/data/users.json', JSON.stringify(data));

        res.json({ success: true });

    } else {
        res.json({ success: false });
    }
});

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/add-user', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./public/data/users.json', 'utf8'));

    const newId = data.length > 0 ? Math.max(...data.map(user => user.id)) + 1 : 1;
    const newUser = {
        id: newId,
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname
    };

    data.push(newUser);
    fs.writeFileSync('./public/data/users.json', JSON.stringify(data));

    res.json({ success: true });
});


app.listen(3000, () => {
    console.log('Running on port 3000');
})