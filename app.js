var fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    BufferHelper = require('bufferhelper'),
    http = require('http'),
    Q = require('q');


var startUrl = 'http://bbs.jjwxc.net/board.php?board=52&page=',
    topicUrl = 'http://bbs.jjwxc.net/';

var pageNum = 1;

var arr = [];

var beginStr = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Document</title>\n</head>\n<body>\n<ol style="margin-left:20px">\n';

var endStr = '</ol>\n</body>\n</html>';

next(startUrl, 101).then(write).then(getContent);

function getContent() {

    var len = arr.length;

    for (var i = 5; i < len; i++) {

        (function(i) {

            var url = topicUrl + arr[i].src;

            get(url).then(function(data) {

                return getTopic(data);

            }).then(function(content) {

                writeTopic(content, arr[i].src);

            })

        })(i);

    }
}

function writeTopic(str, id) {

    fs.writeFile(path.join(__dirname, './content/' + id.match(/.*id=(\d*)/)[1] + '.html'), beginStr + str + endStr, 'UTF-8', function() {

    });

}

function getTopic(data) {

    var $ = cheerio.load(data); //cheerio解析data

    var topic = $.html($('#topic'));

    return topic;

}

function get(url) {

    var deferred = Q.defer();

    var data = null;

    http.get(url, function(res) {

        var bufferHelper = new BufferHelper();

        res.on('data', function(chunk) {

            bufferHelper.concat(chunk);

        });

        res.on('end', function() {

            data = iconv.decode(bufferHelper.toBuffer(), 'gb2312');

            deferred.resolve(data);

        });

    }).on('error', function(e) {

        deferred.reject();

    });

    return deferred.promise;
}

function next(urls, num) {

    var url = urls + pageNum;

    return get(url).then(function(data) {

        if (pageNum == num) {

            return null;

        }

        pageNum++;

        getData(data);

        return next(startUrl, num);

    })
}


function write() {

    var str = '';

    for (var i = 0; i < arr.length; i++) {

        if (arr[i].src == undefined) {

        } else {

            str += '<li class="' + i + '"><a href="./content/' + arr[i].src.match(/.*id=(\d*)/)[1] + '.html' + '">' + arr[i].text.trim() + '</a></li> \n';

        }
    }

    fs.writeFile(path.join(__dirname, './test.html'), beginStr + str + endStr, 'UTF-8', function() {

    });
}

function getData(data) {

    var $ = cheerio.load(data); //cheerio解析data

    var content = $('body>table').eq(3);

    var a = content.children();

    a.each(function(i, ele) {

        var obj = {};

        var dom = $(this).find('a').first();

        obj.src = dom.attr('href');

        if (obj.src == undefined) {

        } else {

            obj.text = dom.text();

            arr.push(obj);
        }

    })

}