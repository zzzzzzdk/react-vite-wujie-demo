const express = require("express");
const router = express.Router();

router.post('/v1/admin/login/app_login', (req, res) => {
  // res.send({data: data2})
  res.send({
    "status": 20000,
    "message": "\u767b\u5f55\u6210\u529f!",
    "data": {
        "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDUwNDgwMTUsInN1YiI6IiIsIm5iZiI6MCwiYXVkIjoiIiwiaWF0IjoxNzA1MDQwODE1LCJqdGkiOiI4MmUyYzNlMmM4MmFjZDllZGUxNTk0ZGQ1MDQyOGQyNiIsImlzcyI6Inlpc2EiLCJzdGF0dXMiOjEsImRhdGEiOnsiaWQiOjE3MjksInVzZXJfbmFtZSI6IuWtlOe5geWuhyIsInVzZXJfdXVpZCI6IjAwMjM5ZTMzLWMzYjUtYTZiNy03ZDFhLWE4ODZkNzY3ZDQxOSIsImFjY291bnQiOiJrb25nZnkiLCJ1c2VyX2lwIjoiMTkyLjE2OC4xNC4xMzUiLCJ1c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzExNS4wLjAuMCBTYWZhcmkvNTM3LjM2In19.OutNpb5NtzHUKJ3g7BjUaQ7Qorjcp82Q-FRmlD_8p56KmFnnMZypPQOi8cBs1cMGzIJHmKK-2JkTSVQnTz0NFWakqhQkIq3NPmgvX4N3fwYp4kP1bfEvYPJXfqRMtSKG8vsrmfiILnQzNpCxjMhfpqTRjLycdYiA8kppycPs2KgDtoTncskQMWTrk_uZ3RC6jTq471cNWQSf8swQdgbz3qztSstyyygK-R0d2SKmMmE6pE5Dg5jVNj1cTbxqMH_mUgAmkhmTwbOBa2LPxgyETtEwLB57dJdPdALPdm7WVVuoj7ugeea6xGHn_CWZ7xpBKzajm5BXjDw_TA6EEzDpUQ",
        "jump_url":"http://localhost:8081/#/home"
    }
});
})
router.get('/v1/admin/get_load_pbk',(req,res)=>{
res.send({
    data:"aaaaaaaaaaaaaaaaa",
    status: 20000
})
})
module.exports = router;
