var app = require('./app')
var port = process.env.PORT || 5000

var server = app.listen(port, ()=>{
    console.log("Server is running on port "+server.address().port+"!")
})
1
