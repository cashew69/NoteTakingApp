const username = document.querySelector('.uname')
const password = document.querySelector('.password')
const submitbtn = document.querySelector('.btn')

submitbtn.addEventListener('click', async (event) =>{
    event.preventDefault()
    const options = {
        method: 'POST',
        //credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: `{"username":"${username.value}","password":"${password.value}"}`
      };
    //const token = ""  
    await fetch('/logingin', options)
        .then(res => res.json())
        .then(data => document.cookie=`jwt=${data.jwt}`)
        .catch(err => console.error(err));
})
