var path = require('path');
var morgan = require('morgan');
var express = require('express');
var body_parser = require('body-parser');
var serve_favicon = require('serve-favicon');
var express_session = require('express-session');
var connect_mongo = require('connect-mongo')(express_session);
var socket_io_express_session = require('socket.io-express-session');

var server_socket = require('./server/socket/server_socket');

var admin = require('./routes/admin');
var index = require('./routes/index');
var logout = require('./routes/logout');
var force_out = require('./routes/force_out');
var add_notice = require('./routes/add_notice');
var get_session = require('./routes/get_session');
var health_check = require('./routes/health_check');
var delete_notice = require('./routes/delete_notice');
var get_all_notices = require('./routes/get_all_notices');
var get_video_posts = require('./routes/get_video_posts');
var broadcast_notice = require('./routes/broadcast_notice');
var get_users_number = require('./routes/get_users_number');
var write_video_post = require('./routes/write_video_post');
var appointment_owner = require('./routes/appointment_owner');
var edit_matching_room = require('./routes/edit_matching_room');
var get_job_search_posts = require('./routes/get_job_search_posts');
var write_job_search_post = require('./routes/write_job_search_post');
var delete_job_search_post = require('./routes/delete_job_search_post');
var get_all_matching_rooms = require('./routes/get_all_matching_rooms');
var write_video_post_reply = require('./routes/write_video_post_reply');
var get_public_chat_messages = require('./routes/get_public_chat_messages');
var update_video_post_points = require('./routes/update_video_post_points');
var send_message_to_public_chat = require('./routes/send_message_to_public_chat');
var invite_to_party_matching_room = require('./routes/invite_to_party_matching_room');
var update_video_post_reply_points = require('./routes/update_video_post_reply_points');
var send_message_to_matching_room_chat = require('./routes/send_message_to_matching_room_chat');
var battlenet_login = process.env.NODE_ENV != 'production' ? require('./routes/battlenet_login_for_debugging') : require('./routes/battlenet_login');
var battlenet_callback = process.env.NODE_ENV != 'production' ? require('./routes/battlenet_callback_for_debugging') : require('./routes/battlenet_callback');

require('./server/socket/join');
require('./server/socket/leave');
require('./server/socket/connection');
require('./server/socket/disconnect');
require('./server/socket/join_matching_room');
require('./server/socket/leave_matching_room');
require('./server/socket/create_matching_room');

require('./server/init/init');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'));
}
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(serve_favicon(path.join(__dirname, 'server/favicon/favicon.ico')));
var kemfl112 = express_session({
  resave: false,
  secret: 'mmk3aads',
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  store: new connect_mongo({ url: process.env.NODE_ENV != 'production' ? 'mongodb://localhost/overmatch' : 'mongodb://172.31.12.84/overmatch' })
})
app.use(kemfl112);

app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'client/images')));
app.use(express.static(path.join(__dirname, 'client/robots')));
app.use(express.static(path.join(__dirname, 'client/webmaster')));

server_socket.use(socket_io_express_session(kemfl112));

app.use('/', index);
app.use('/admin', admin);
app.use('/logout', logout);
app.use('/force_out', force_out);
app.use('/add_notice', add_notice);
app.use('/get_session', get_session);
app.use('/health_check', health_check);
app.use('/delete_notice', delete_notice);
app.use('/battlenet_login', battlenet_login);
app.use('/get_all_notices', get_all_notices);
app.use('/get_video_posts', get_video_posts);
app.use('/broadcast_notice', broadcast_notice);
app.use('/get_users_number', get_users_number);
app.use('/write_video_post', write_video_post);
app.use('/appointment_owner', appointment_owner);
app.use('/battlenet_callback', battlenet_callback);
app.use('/edit_matching_room', edit_matching_room);
app.use('/get_job_search_posts', get_job_search_posts);
app.use('/write_job_search_post', write_job_search_post);
app.use('/delete_job_search_post', delete_job_search_post);
app.use('/get_all_matching_rooms', get_all_matching_rooms);
app.use('/write_video_post_reply', write_video_post_reply);
app.use('/get_public_chat_messages', get_public_chat_messages);
app.use('/update_video_post_points', update_video_post_points);
app.use('/send_message_to_public_chat', send_message_to_public_chat);
app.use('/invite_to_party_matching_room', invite_to_party_matching_room);
app.use('/update_video_post_reply_points', update_video_post_reply_points);
app.use('/send_message_to_matching_room_chat', send_message_to_matching_room_chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
