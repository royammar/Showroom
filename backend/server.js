const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const http = require('http').createServer(app);


const itemRoutes = require('./api/item/item.routes')
const shopRoutes = require('./api/shop/shop.routes')
const orderRoutes = require('./api/order/order.routes')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const connectSockets = require('./api/socket/socket.routes')





app.use(cookieParser())
app.use(bodyParser.json());
app.use(session({
    secret: 'devSocketKeyBoard!@#$',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}


app.use('/api/item', itemRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use(express.static('public'));


const logger = require('./services/logger.service')

const port = process.env.PORT || 3030;
var server= app.listen(port, () => {
 console.log(`App listening on port ${port}!`)
});

const io = require('socket.io').listen(server);
connectSockets(io)


// const port = process.env.PORT || 3030;
// http.listen(port, () => {
//     logger.info('Server is running on port: ' + port)
// });

