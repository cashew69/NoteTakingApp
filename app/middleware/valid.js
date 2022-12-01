function isvalid(data) {
	return data.title && data.title.toString().trim() != '' && 
		data.content && data.title.toString().trim() != '';
}

module.exports = isvalid