const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => { //this has to be put before ID because otherwise the http request will treat 'new' as an ID
    res.render('./campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('./campgrounds/show', { camp });
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})