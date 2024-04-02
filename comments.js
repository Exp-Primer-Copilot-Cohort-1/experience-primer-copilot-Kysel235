// create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var ROOT = __dirname + "/public";
var comments = require('./comments.json');
var log = require('./log')(module);
var server = http.createServer(function(req, res) {
    if (!checkAccess(req)) {
        res.statusCode = 403;
        res.end("Tell me the secret to access!");
        return;
    }
    sendFileSafe(url.parse(req.url).pathname, res);
});

server.listen(3000);

function checkAccess(req) {
    return url.parse(req.url, true).query.secret == 'o_O';
}

function sendFileSafe(filePath, res) {
    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        res.statusCode = 400;
        res.end("Bad Request");
        return;
    }

    if (~filePath.indexOf('\0')) {
        res.statusCode = 400;
        res.end("Bad Request");
        return;
    }

    filePath = path.normalize(path.join(ROOT, filePath));

    if (filePath.indexOf(ROOT) != 0) {
        res.statusCode = 404;
        res.end("File not found");
        return;
    }

    fs.stat(filePath, function(err, stats) {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("File not found");
            return;
        }

        sendFile(filePath, res);
    });
}

function sendFile(filePath, res) {
    fs.readFile(filePath, function(err, content) {
        if (err) throw err;
        var mime = require('mime').lookup(filePath);
        res.setHeader('Content-Type', mime + "; charset=utf-8");
        res.end(content);
    });
}

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
    socket.emit('comments', comments);
    socket.on('comment', function(comment) {
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
            if (err) throw err;
        });
        io.sockets.emit('comment', comment);
    });
});
log.info('Server running on port 3000');