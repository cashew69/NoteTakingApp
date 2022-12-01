//const { assert } = require("console");
const { notStrictEqual } = require("assert");
const fs = require("fs");
const tsjs = require('tesseract.js');
const { User, Note } = require("../middleware/schemas")


// Show this on sidepane.
let getFilelist = function getFilelist(){
	let files = fs.readdirSync('files/');
	return (files);
}

const getData = async (req, res) => {
	var filename = req.params.filename;
	console.log(filename)
	const datao = await Note.findById({_id: filename})
	res.json({ title: datao.title, content: datao.content });
}

const setData = async function setData(filename, content) {
	const note = await Note.create({
		no: 177,
		title:  filename,
		content: content
	});
	await User.findOneAndUpdate({username: "Nikhil"},  {$push: {arrayofNotes: note}} );
	return `File "${filename}" is saved`;
}

const delData = async (req, res) => {
	var filename = req.params.filename;
	await Note.findByIdAndRemove({_id: filename})
	res.json(filename + " Deleted!")
}


const imgTotext = async function imgTotext(filename) {
	let path = 'images/' + filename;
	await tsjs.recognize(path, 'eng')
	. then(({data: { text } }) =>  {
	 setData(filename.replace(".jpeg", ""), text);
	})
	fs.unlinkSync('images/'+ filename)
	return "Saved";
};
module.exports = { setData, getData, getFilelist, delData, imgTotext}
