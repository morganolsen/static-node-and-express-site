const express = require('express');
const data = require('./data.json');

// Which port should the application run on?
const port = 3000;

const app = express();

// Define static path.
app.use('/static', express.static('public'));

// Sets templating engine to pug.
app.set('view engine', 'pug');

/**
 * Renders the index template when the root path is requested.
 */
app.get('', (req, res, next) => {
    res.render("index", data);
});

/**
 * Renders the about template when the /about path is requested.
 */
app.get('/about', (req, res) => {
    res.render("about");
});

/**
 * Renders the project with the given ID when the /project/* path is requested
 */
app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    const dataTemplate = data.projects[projectId];
    res.render("project", dataTemplate);
})

/**
 * Route added to test the error handler. Left it in because easter eggs.
 */
app.get('/coffee', (req, res, next) => {
    const err = new Error("Unable to fetch 'coffee': I'm a teapot.");
    err.status = 418;
    next(err);
});

// Handles "page not found" when a route wasn't found for the request.
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Handles any errors that comes in.
app.use((err, req, res, next) => {
    res.locals.error = err;
    if(!err.status){
        err.status = 500;
    }
    if(!err.message){
        err.message = "Internal server error";
    }
    console.log(`Error ${err.status}: ${err.message}`);
    res.status(err.status);
    if(err.status === 404)
    {
        res.render('page-not-found');
    }else{
        res.render('error');
    }
});

// Starts listening and prints a message to the console.
app.listen(port, () => {
    console.log(`Application started. Listening to port ${port}`);
});