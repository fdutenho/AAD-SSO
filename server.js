const express = require("express")
const path = require('path')
const validate = require('validate-azure-ad-token').default

const app = express()

app.get("/protected", (req, res) => {
      var reqToken = (req.headers.authorization)?req.headers.authorization.split(' ')[1]:""
      validate(reqToken, {
          tenantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          audience: '00000003-0000-0000-c000-000000000000',
          applicationId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          scopes: ["openid"]
        })
        .then(decodedToken => {
          console.debug("logged in user is " + JSON.stringify(decodedToken.payload.upn))
          res.status(200).json({ message: "This message contains protected data. You are entitled to see the data." })
        })
        .catch (error => {
          console.error("error whith verifying token: " + error)
          res.status(401).json({err:"not authorised"})
        })
    }
)

app.use(express.static('app'));
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + '/index.html'))
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Listening on port " + port)
})
