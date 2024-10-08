const express = require('express')
const cors = require('cors');
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router()
const AuthController = require('./controller/authController')
const crud = require('./controller/crud')
const authenticate = require('./middleware/authenticate')
const isvalid = require('./middleware/valid')
const cookieparser = require('cookie-parser')


//MongoDb Connection
mongoose.connect(
	'mongodb+srv://n:n@cluster0.waqno.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0',
	{ useNewUrlParser: true }
).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'model/images/')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
//multer middleware
const upload = multer({ storage: fileStorage});

//-----------------------------------------------------
//Cookie -parser
router.use(cookieparser())

//cors
router.use(cors());
//body type
router.use(express.json())


//-----------------------------------------------------

//get forms
router.get('/', (req, res) => {
	res.render('w')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/image', (req, res) => {
	res.sendFile(__dirname + "/views/" + 'appss.png')
})

router.get('/register', (req, res) => {
	res.render('register')
})
//post login and register
router.post('/registering', AuthController.register)
router.post('/logingin', AuthController.login)

//get app
router.get('/main.js', function(req, res) {
	res.sendFile(__dirname + "/ijs/" + "main.js");
  });
router.get('/stylesheet.css', function(req, res) {
	res.sendFile(__dirname + "/public/" + "stylesheet.css");
});


router.get('/w.css', function(req, res) {
	res.sendFile(__dirname + "/public/" + "w.css");
	});

router.get('/app', authenticate, (req, res) => {
	//res.sendFile(__dirname +"/index.html")});
	res.render('index')});



router.get('/login.js', function(req, res) {
	res.sendFile(__dirname + "/ijs/" + "login.js");
	});
router.get('/login.css', function(req, res) {
	res.sendFile(__dirname + "/public/" + "login.css");
	});


router.get('/signup.js', function(req, res) {
		res.sendFile(__dirname + "/ijs/" + "signup.js");
		});
router.get('/register.css', function(req, res) {
		res.sendFile(__dirname + "/public/" + "register.css");
		});
	

//get file list
router.get('/files', authenticate, crud.getFilelist)

//post note
router.post('/send', authenticate, (req, res) => {
	if(isvalid(req.body)) {
		//save to db
		const data =  {
			title: req.body.title.toString(),
			content: req.body.content.toString()
		};
		res.json(crud.setData(data.title, data.content, req.cookies.uid));
		console.log(`File "${data.title} is saved`);
	}
	else {
		res.status(422);
		res.json({
			message: 'Name and Content Required!'});
	}
})

//OCR POST
router.post('/ocr', authenticate, upload.single('image'), (req, res) => {
    
    var filename = req.file.originalname;

    res.json(crud.imgTotext(filename, req.cookies.uid));
  });

//get note
router.get('/files/:filename', authenticate, crud.getData )

//del note
router.delete('/files/:filename', authenticate, crud.delData )


module.exports = router
