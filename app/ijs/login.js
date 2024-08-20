const username = document.querySelector('.uname')
const password = document.querySelector('.password')
const loginbtn = document.querySelector('.btn')
const signupbtn = document.querySelector('.signup')

loginbtn.addEventListener('click', async (event) =>{
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
        .then(data => {document.cookie=`jwt=${data.jwt}`; 
        document.cookie=`uid=${data.uid}`})
        .catch(err => console.error(err));
        location.assign('/app')
})

signupbtn.addEventListener('click', () => {
  location.assign('/register')
})
