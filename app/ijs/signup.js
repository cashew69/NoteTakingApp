const username = document.querySelector('.uname')
const password = document.querySelector('.password')
const submitbtn = document.querySelector('.btn')

submitbtn.addEventListener('click', async (event) =>{
    event.preventDefault()
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"username":"${username.value}","password":"${password.value}"}`
      };
    //const token = ""  
    await fetch('/registering', options)
})
