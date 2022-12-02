//const { assert } = require("console");
const { notStrictEqual } = require("assert");
const { json } = require("express");
const fs = require("fs");
const tsjs = require('tesseract.js');
const { User, Note } = require("../middleware/schemas")
var uid = ""


// Show this on sidepane.
const getFilelist = async (req, res) => {
	uid = req.cookies.uid
	const Notes = await Note.find({userid: uid})
	const list = []
	Notes.forEach(async note => {list.push(note.title);})
	res.json(list)
	
}

const getData = async (req, res) => {
	var filename = req.params.filename;
	console.log(filename)
	const datao = await Note.findOne({title: filename, userid: uid})
	res.json({ title: datao.title, content: datao.content });
}

const setData = async function setData(filename, content) {
	const note = await Note.create({
		userid: uid,
		title:  filename,
		content: content
	});
	await User.findOneAndUpdate({userid: uid},  {$push: {arrayofNotes: note}} );
	return `File "${filename}" is saved`;
}

const delData = async (req, res) => {
	var filename = req.params.filename;
	await Note.findOneAndDelete({title: filename, userid: uid})
	res.json(filename + " Deleted!")
}


const imgTotext = async function imgTotext(filename) {
	let path = 'model/images/' + filename;
	await tsjs.recognize(path, 'eng')
	. then(({data: { text } }) =>  {
	 setData(filename.replace(".jpeg", ""), text);
	})
	fs.unlinkSync('model/images/'+ filename)
	return "Saved";
};
module.exports = { setData, getData, getFilelist, delData, imgTotext}
