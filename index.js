const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.listen(3000);
console.log('Server is listening on port 3000');

app.get('/', (req, res) => {
    res.redirect('/login'); //this will call the /anotherRoute route in the API
});

app.get("/login", (req, res) => {
    res.render("pages/login.ejs");
});

app.get("/discover", (req, res) => {
    res.render("pages/discover.ejs");
});

app.get("/register", (req, res) => {
    res.render("pages/register.ejs");
});

// Register submission
app.post('/register', async (req, res) => {
    //the logic goes here
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = await req.body.username;
    db.tx(async (t) => {
        await t.none(
            "INSERT INTO student_courses(course_id, student_id) VALUES ($1, $2);",
            [course_id, req.session.user.student_id]
          );
          return t.any(all_courses, [req.session.user.student_id]);
        })
          .then((courses) => {
            //console.info(courses);
            res.render("pages/courses", {
              courses,
              message: `Successfully added course ${req.body.course_id}`,
            });
          })
          .catch((err) => {
            res.render("pages/courses", {
              courses: [],
              error: true,
              message: err.message,
            });
          });
    })
    
});