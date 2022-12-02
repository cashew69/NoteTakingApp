
const InTitle = document.querySelector(".notetitle");
const Editor = document.querySelector(".textareas");
const Preview = document.querySelector(".preview");
const converter = new showdown.Converter();
const form = document.querySelector('form');
const b1 = document.querySelector('.b1')
const b2 = document.querySelector('.b2')
const b3 = document.querySelector('.b3')
const URI ='http://127.0.0.1:3000/' 
//const lis = document.querySelector('#clickonfiles');

// Realtime Markdown Rendering
Editor.addEventListener("keyup", evt => {
	evt.preventDefault();
    const { value } = evt.target;
    const html = converter.makeHtml(value)
    Preview.innerHTML = html;
})
// Markdown Rendering on DOMContentLoaded
document.addEventListener('DOMContentLoaded', evt => {
	evt.preventDefault();
	const formData = new FormData(form);
    const content = formData.get('content');
	const html = converter.makeHtml(content)
	Preview.innerHTML = html;
    displayfiles();
})

async function getFile(filename){
	var content = "";
	await fetch(URI+'files/'+ filename)
	.then((res) => res.json())
	.then((data) =>  content = data.content)
	Preview.innerHTML = converter.makeHtml(content)
	Editor.value = content;
	InTitle.value = filename;
}

//Displays Files in DOM.
function displayfiles(){
	fetch(URI+'files')
	.then((res) => res.json())
	.then((data) => {
    	let output = `<h2>Files</h2>`;
    	data.forEach(element => {
        	output += `
            	<ul>
                	<li><a onclick="getFile('${element}')">${element}</a></li>
            	</ul>
        	`;
    	});
    	document.querySelector('.File_list').innerHTML = output;	
	})
}

// Sends POST request to server with {title: "", content: ""}
b3.addEventListener('click', (event) => {
	event.preventDefault();

	const formData = new FormData(form);
	const title = formData.get('title');
	const content = formData.get('content');
	const data = {
		title,
		content
	};
	
	const Request = {
		method :'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	};
	fetch(URI+"send", Request);
});


b2.addEventListener('click', (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const filename = formData.get('title');
	const Request = {
		method :'DELETE',
		
	};
	var content = "";

	fetch(URI+'files/'+filename, Request)
	.then((res) => res.json())
	.then((data) => content = data)
	console.log(content)
	Editor.value = ""
	InTitle.value = ""

})

b1.addEventListener('click', (event) => {
	event.preventDefault();
	const file = document.querySelector(".upFile");

	const form = new FormData();
	form.append('image', file.files[0]);

	const Request = {
		method :'POST',
		//headers: {
			//'Content-Type': 'multipart/form-data'
		//},
		body: form
	};
	fetch(URI+'ocr', Request).catch(console.error);
	
})