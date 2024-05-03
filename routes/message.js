const express = require("express");
const fs = require("fs");
const path = require('path');

const router = express.Router();
router.use(express.json());
const rootDir = require('../util/path');

router.get('/', (req, res) => {
    let message;
    try {
        message = fs.readFileSync('message.txt', 'utf-8');
    }
    catch (err) {
        message = "No messages found!"
    }
    res.sendFile(path.join(rootDir, 'views', 'message.html'));
});

router.post('/', (req, res) => {
    const message = req.body.message + '\n';
    fs.appendFileSync('message.txt', message);
    res.redirect('/');
})

module.exports = router;


// const express = require("express");
// const fs = require("fs");

// const router = express.Router();
// router.use(express.json());

// router.get('/', (req, res) => {
//     let message;
//     try {
//         message = fs.readFileSync('message.txt', 'utf-8');
//     }
//     catch (err) {
//         message = "No messages found!"
//     }
//     const htmlContent = `
//         <form action='/' method='POST'>
//             <pre>${message}</pre>
//             <input type='text' name='msg' placeholder='write your message here'>
//             <button type='submit'>Send</button>
//         </form>
//         <script>
//             const user = localStorage.getItem('username');
//             if(!user) user = "Anonymous";
//             const form = document.querySelector('form');
//             form.addEventListener('submit',(e)=>{
//                 e.preventDefault();
//                 const msg = e.target.msg.value;
//                 const newmsg = user + ':' + msg + ' ';
//                 fetch('/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ message: newmsg })
//                   }).then(()=> window.location.reload()).catch((e) => {
//                     console.log(e);
//                   })
//             })
//         </script>
//         `;
//     res.send(htmlContent);
// });

// router.post('/', (req, res) => {
//     const message = req.body.message + '\n';
//     fs.appendFileSync('message.txt', message);
//     res.redirect('/');
// })

// module.exports = router;