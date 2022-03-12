const express = require('express');
const app = express();
var url = require('./url.json')
require('dotenv').config()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origins: url.frontend, credentials: true } })
const mongo = require('./db')
const cors = require('cors');
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
var morgan = require('morgan')
mongo()
const User = require('./models/user')
const ServerModel = require('./models/ServerModel')
const ChannelModel = require('./models/ChannelModel')
const ChatModel = require('./models/ChatModel')
app.use(cors({ origin: url.frontend, credentials: true }))
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({ cookie: { sameSite: 'lax' }, secret: process.env.COOKIE_SECRET, resave: true, saveUninitialized: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)
function handleValidation(a) {
    let email = a.email
    let username = a.username
    let password = a.password
    let fields = { email, username, password };
    let formIsValid = true;
    if (typeof fields["username"] !== "undefined") {
        if (!fields["username"].match(/^[a-zA-Z]+$/)) {
            formIsValid = false;
        }
    }
    if (fields["username"] === '') {
        formIsValid = false;
    }
    if (typeof fields["email"] !== "undefined") {
        let lastAtPos = fields["email"].lastIndexOf('@');
        let lastDotPos = fields["email"].lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
            formIsValid = false;
        }
    }
    if (fields["email"] === "") {
        formIsValid = false;
    }
    if (fields['password'].length < 8) {
        formIsValid = false;
    }
    return formIsValid;
}
app.post('/auth/register', async (req, res) => {
    console.log(req.body)
    if (handleValidation(req.body)) {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            let hashed = await bcrypt.hash(req.body.password, 12)
            user = User.create({ email: req.body.email, displayName: req.body.displayName, password: hashed })
            res.send({ error: null })
        } else {
            res.send({ error: 'user exists' })
        }
    } else {
        res.send({ error: 'not valid' }).status(401);
    }
})
app.post('/auth/login', (req, res, next) => {
    passport.authenticate("local", { session: true }, (err, user, info) => {
        if (err) throw err;
        if (!user) res.send({ error: 'invalid credentials' });
        else {
            req.login(user, (err) => {
                if (err) throw err;
                res.send({ error: null });
            });
        }
    })(req, res, next);
});
app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        let data = { id: req.user._id, name: req.user.displayName, email: req.user.email, profile: req.user.image, server: req.user.servers }
        res.send(data)
    } else {
        res.send('')
    }
})
app.post('/api/register/server', async (req, res) => {
    if (req.isAuthenticated()) {
        let name = req.body.name
        let _id = req.body.admin
        console.log(name, _id)
        if (name === '' || _id === '') {
            res.send({ error: 'invalid' })
        } else {
            let server = await ServerModel.create({ serverName: name, admin: _id, members: [_id] })
            User.findOne({ _id: _id }, (err, user) => {
                if (err) throw err
                user.servers.push(server._id)
                user.save()
                res.send({ status: 'done' })
            })
        }
    } else {
        res.send({ error: 'not authenticated' }).status(401)
    }
})
app.post('/api/get/server', async (req, res) => {
    if (req.isAuthenticated()) {
        let id = req.body.id
        let serverData = []
        let user = await User.findOne({ _id: id })
        if (!user) res.send({ error: 'invalid user' })
        let servers = user.servers
        for (var i = 0; i < servers.length; i++) {
            await ServerModel.findOne({ _id: servers[i] }, (err, server) => {
                if (err) throw err
                serverData.push(server);
            })
        }
        res.send({ error: 'null', servers: serverData })
    } else {
        res.send({ error: 'not authenticated' }).status(401)
    }
})
app.post('/api/get/channel', async (req, res) => {
    if (req.isAuthenticated()) {
        let id = req.body.id
        let channelData = []
        let server = await ServerModel.findOne({ _id: id })
        if (!server) res.send({ error: 'invalid server' })
        try {
            let channels = server.channelAvailable
            for (var i = 0; i < channels.length; i++) {
                await ChannelModel.findOne({ _id: channels[i] }, (err, c) => {
                    if (err) throw err
                    channelData.push(c);
                })
            }
            res.send({ error: null, channels: channelData })
        } catch (err) {
            throw err
        }
    } else {
        res.send({ error: 'not authenticated' }).status(401)
    }
})
app.post('/api/register/channel', async (req, res) => {
    if (req.isAuthenticated()) {
        let name = req.body.name
        let _id = req.body.parent
        let type = 'text'
        if (req.body.type) {
            type = 'text'
        } else {
            type = 'voice'
        }
        if (name === '' || _id === '') {
            res.send({ error: 'invalid' })
        } else {
            let channel = await ChannelModel.create({ channelName: name, parent: _id, channelType: type })
            ServerModel.findOne({ _id: _id }, (err, serverfound) => {
                if (err) throw err
                serverfound.channelAvailable.push(channel._id)
                serverfound.save()
                res.send({ status: 'done' })
            }).catch(err => { throw err })
        }
    } else {
        res.send({ error: 'not authenticated' }).status(401)
    }
})
app.post('/api/get/member', async (req, res) => {
    let id = req.body.id
    let server = await ServerModel.findOne({ _id: id })
    if (!server) res.send({}).status(404)
    let UserData = []
    for (var i = 0; i < server.members.length; i++) {
        await User.findOne({ _id: server.members[i] }, (err, c) => {
            if (err) throw err
            let data = { name: c.displayName, profile: c.image, id: c._id }
            UserData.push(data);
        }).catch(err => { throw err })
    }
    res.send({ error: null, users: UserData })
})
app.post('/api/get/chat', async (req, res) => {
    if (req.isAuthenticated) {
        const id = req.body.channelId
        let chats = await ChatModel.find({ channel: id })
        for (var i = 0; i < chats.length; i++) {
            let user = await User.findOne({ _id: chats[i].by })
            chats[i].by = user.displayName

        }
        res.send({ error: null, chat: chats })
    } else {
        res.send({ error: 'not authenticated' }).status(401)
    }
})
app.get('/join/:id', (req, res) => {
    if (req.isAuthenticated()) {
        let id = req.params.id
        let userId = req.user.id
        User.findOne({ _id: userId }, (err, user) => {
            if (!user.servers.includes(id)) {
                user.servers.push(id)
                user.save()
            }
        })
        ServerModel.findOne({ _id: id }, (err, server) => {
            if (!server.members.includes(userId)){
                server.members.push(userId)
                server.save()
                io.sockets.to(id).emit("member-joined",id,userId)
                res.send('Done boi')
            }
            else{
                res.send('Already in!')
            }
        })
    } else {
        res.send('Sign in boi').status(401)
    }
})
io.on('connection', socket => {
    console.log(socket.client.conn.server.clientsCount)
    io.emit('joined')
    socket.on('send-msg', (msg, channelId, userId,serverId) => {
        console.log(msg, channelId, userId)
        User.findOne({ _id: userId }, (err, user) => {
            if (err) throw err
            socket.to(channelId).emit('msg', [msg, user.displayName, user.image, channelId, Date.now])
            socket.to(serverId).emit('new-msg', [msg, user.displayName, user.image, Date.now])
            let chat = ChatModel.create({ message: msg, channel: channelId, by: userId, senderProfile: user.image })
        })
    })
    socket.on('join-room', channelId => {
        socket.join(channelId)
        socket.broadcast.to(channelId).emit('user-connected')
    })
    socket.on('server-connected', server => {
        socket.join(server)
        console.log(server)
    })
    socket.on('channel-created', serverId =>{
        console.log(serverId)
        socket.to(serverId).emit('new-channel', serverId)
    })
})
server.listen(4000, (console.log('Server Started')))
