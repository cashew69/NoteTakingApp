const fs = require("fs");
const tsjs = require('tesseract.js');
const { User, Note } = require("../middleware/schemas")
const crypto = require('crypto');




async function encrypt (string, uid) {
	const data = await User.findOne({userid: uid})
	const key = data.key
	
	const iv = data.iv
	let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(string, 'utf-8', 'hex')
	encrypted += cipher.final('hex');
	return encrypted
	}
	
async function decrypt (string, uid) {
	const data = await User.findOne({userid: uid})
	const key = data.key
		
	const iv = data.iv
	let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(string, 'hex', 'utf-8')
	decrypted += decipher.final('utf-8');
	return decrypted
	}

// Show this on sidepane.
const getFilelist = async (req, res) => {
	uid = req.cookies.uid
	const Notes = await Note.find({userid: uid})
	const objlist = []
	for (i=0; i< Notes.length; i++){
		content = await decrypt(Notes[i].title, uid )
		objlist.push([content, Notes[i]._id])
	}
	res.json(objlist)

}

const getData = async (req, res) => {
	var filename = req.params.filename;
	var uid = req.cookies.uid
	const datao = await Note.findOne({_id: filename, userid: uid})
	res.json({ title: await decrypt (datao.title, uid) , content: await decrypt (datao.content, uid)  });
}


const setData = async function setData(filename, content, uid) {
	const note = await Note.create({
		userid: uid,
		title:  await encrypt (filename, uid),
		content: await encrypt (content, uid)
	});
	return `File "${filename}" is saved`;
}

const delData = async (req, res) => {
	var filename = req.params.filename;
	var uid = req.cookies.uid
	filename = await encrypt(filename, uid)
	await Note.findOneAndDelete({title: filename, userid: uid})
	res.json(filename + " Deleted!")
}


const imgTotext = async function imgTotext(filename, uid) {
	let path = 'model/images/' + filename;
	await tsjs.recognize(path, 'eng')
	. then(({data: { text } }) =>  {
	 setData(filename.replace(".jpeg", ""), text, uid);
	})
	fs.unlinkSync('model/images/'+ filename)
	return "Saved";
};
module.exports = { setData, getData, getFilelist, delData, imgTotext}
