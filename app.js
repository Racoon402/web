const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'starchery-1.cacbwbsoptfr.ap-northeast-2.rds.amazonaws.com',
    user: 'sangbin',
    password: '235789lsB!',
    database: 'my_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});
app.get('/login', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, 'login.html'));
    }
});
app.get('/intro_group', (req, res) => {
    if (req.session.username) {    
        res.sendFile(path.join(__dirname, 'intro_group_login.html'));
    } else {   
        res.sendFile(path.join(__dirname, 'intro_group.html'));
    }
});
app.get('/intro_page', (req, res) => {
    if (req.session.username) {    
        res.sendFile(path.join(__dirname, 'intro_page_login.html'));
    } else {   
        res.sendFile(path.join(__dirname, 'intro_page.html'));
    }
});
app.get('/intro_map', (req, res) => {
    if (req.session.username) {    
        res.sendFile(path.join(__dirname, 'intro_map_login.html'));
    } else {   
        res.sendFile(path.join(__dirname, 'intro_map.html'));
    }
});

app.get('/recode', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'recode.html'));
    } else {
        res.sendFile(path.join(__dirname, 'need_login.html'));
    }
});
app.get('/map', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'map.html'));
    } else {
        res.sendFile(path.join(__dirname, 'need_login.html'));
    }
});
app.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, 'complete.html'));
});

app.get('/board_free', (req, res) => {
    if (req.session.username) {
        const perPage = 15; // 한 페이지당 표시할 글 개수

        const countQuery = 'SELECT COUNT(*) AS count FROM board_table'; // 글의 총 개수를 가져오는 쿼리
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error('Error querying data from MySQL:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const totalCount = countResult[0].count; // 총 글 개수
    
                const currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지
                const totalPages = Math.ceil(totalCount / perPage); // 총 페이지 수
    
                const offset = (currentPage - 1) * perPage; // 가져올 글의 시작 위치
    
                const query = 'SELECT * FROM board_table ORDER BY id DESC LIMIT ?, ?'; // 페이지별로 글 가져오는 쿼리
                db.query(query, [offset, perPage], (err, results) => {
                    if (err) {
                        console.error('Error querying data from MySQL:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('board_free', { posts: results, currentPage, totalPages });
                    }
                });
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'need_login.html'));
    }
});
app.get('/board_photo', (req, res) => {
    if (req.session.username) {
        const perPage = 15; // 한 페이지당 표시할 글 개수

        const countQuery = 'SELECT COUNT(*) AS count FROM photo_table'; // 글의 총 개수를 가져오는 쿼리
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error('Error querying data from MySQL:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const totalCount = countResult[0].count; // 총 글 개수
    
                const currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지
                const totalPages = Math.ceil(totalCount / perPage); // 총 페이지 수
    
                const offset = (currentPage - 1) * perPage; // 가져올 글의 시작 위치
    
                const query = 'SELECT * FROM photo_table ORDER BY id DESC LIMIT ?, ?'; // 페이지별로 글 가져오는 쿼리
                db.query(query, [offset, perPage], (err, results) => {
                    if (err) {
                        console.error('Error querying data from MySQL:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('board_photo', { posts: results, currentPage, totalPages });
                    }
                });
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'need_login.html'));
    }
});
app.get('/board_recode', (req, res) => {
    if (req.session.username) {
        const perPage = 15; // 한 페이지당 표시할 글 개수

        const countQuery = 'SELECT COUNT(*) AS count FROM recode_table'; // 글의 총 개수를 가져오는 쿼리
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error('Error querying data from MySQL:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const totalCount = countResult[0].count; // 총 글 개수
        
                const currentPage = req.query.page ? parseInt(req.query.page) : 1; // 현재 페이지
                const totalPages = Math.ceil(totalCount / perPage); // 총 페이지 수
        
                const offset = (currentPage - 1) * perPage; // 가져올 글의 시작 위치
        
                const username = req.session.username; // 로그인한 유저의 username을 사용합니다.
                const query = 'SELECT * FROM recode_table WHERE username = ? ORDER BY id DESC LIMIT ?, ?'; // 페이지별로 글 가져오는 쿼리
                db.query(query, [username, offset, perPage], (err, results) => {
                    if (err) {
                        console.error('Error querying data from MySQL:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('board_recode', { posts: results, currentPage, totalPages });
                    }
                });
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'need_login.html'));
    }
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});
app.get('/checklogin', (req, res) => {
    if (req.session.username) {
        // 로그인된 경우
        res.json({ loggedIn: true });
    } else {
        // 로그인되지 않은 경우
        res.json({ loggedIn: false });
    }
});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) throw err;

        if (result.length === 1) {
            req.session.username = username;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});



app.post("/saveData", (req, res) => {
    const data = req.body;
    const username = req.session.username;
    const currentDateTime = new Date();

    const sql = "INSERT INTO recode_table (column1, column2, column3, column4, column5, column6, userName, currentDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = data.map(row => [row[0], row[1], row[2], row[3], row[4], row[5], username, currentDateTime]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error saving data:", err);
            res.status(500).json({ message: "Error saving data" });
        } else {
            console.log("Data saved successfully");
            res.json({ message: "Data saved successfully" });
            
        }
    });
});

app.post('/register_process', function (request, response) {
    var username = request.body.username;
    var password = request.body.pwd;
    var password2 = request.body.pwd2;

    if (username && password && password2) {

        db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO users (username, password) VALUES(?,?)', [username, password], function (error, data) {
                    if (error) throw error2;
                    response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);
            }
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});



// 게시물 보기
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM board_table WHERE id = ?';

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Error querying data from MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('post', { post: results[0] });
        }
    });
});

// 게시물 작성 양식 보기
app.get('/write_free', (req, res) => {
        res.render('write_free');
});

app.get('/write_photo', (req, res) => {
    res.render('write_photo');
});

// 게시물 작성 처리
app.post('/write_free', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const username = req.session.username;
    const currentDateTime = new Date();
    const query = 'INSERT INTO board_table (title, author, content, date) VALUES (?, ?, ?, ?)';

    db.query(query, [title, username, content, currentDateTime], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
            res.redirect('/write_free');
        } else {
            res.redirect('/board_free');
        }
    });
});

app.post('/write_photo', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const username = req.session.username;
    const currentDateTime = new Date();
    const query = 'INSERT INTO photo_table (title, author, content, date) VALUES (?, ?, ?, ?)';

    db.query(query, [title, username, content, currentDateTime], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
            res.redirect('/write_photo');
        } else {
            res.redirect('/board_photo');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
