// const fs = require("fs");
// const imgBase64 = [];
// fs.readFile("../images/mail.png", "base64", (err, data) => {
//     imgBase64.push(data);
// })
{/* <img src="data:images/png;base64,'${imgBase64[0]}'"/> */ }
const emailContents = (num) => (`
<div style="width: 600px; height:600px;display: flex; flex-direction: column;">
<div
    style=" background-size: cover; height: 100%; background-position: center; background-image: url('https://github.com/Choi-seok-jun/STAMP.run/blob/develop/images/mail.png?raw=true')">
    <div style="margin-top: 47%; color:white; font-size:25px; text-align: center;">
        <p>STAMP 의 회원가입을</p>
        <p style="margin-top:-2%"> 해주셔서 감사합니다.</p>
        <p style="margin-top:-2%">밑의 인증번호를 입력해주시기 바랍니다.</p>
    </div>
    <div
        style="margin-top: 8%;  background-color: #3b465b; display: flex; flex-direction: row; justify-content: center; align-items: center">

        <div style="width: 300px;height: 100px; background-color: white; margin: 10px; border-radius: 25px">
            <div style="display: flex; flex-direction: row;">
                <p style="font-size: 50px;color:#3a455b;margin-top:5%; margin-bottom: -20%; ">
                    <strong style='margin-left: 90px'>${num}</strong></p>
            </div>
        </div>

    </div>
</div>
</div>
</div>
`);

module.exports = { emailContents };