const express = require("express");

const router = express.Router();

router.get('/login', (req, res) =>{
    const htmlContent = `
        <form action='/' method='GET'>
            <input type='text' name='username' placeholder='Enter username'>
            <button type='submit'>login</button>
        </form>
        <script>
            const form = document.querySelector('form');
            form.addEventListener('submit',(e)=>{
                const user = e.target.username.value;
                localStorage.setItem('username', user);
            })
        </script>
    `;
    console.log("+++++++",htmlContent)
    res.send(htmlContent);
})

module.exports = router;