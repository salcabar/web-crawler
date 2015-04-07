var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var fileUtil = require('file-utils');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http');
// var url = require('url').parse('http://bbs.jjwxc.net/board.php?board=52&page=0');

// request(requrl, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     acquireData(body)
//   }
// })

var url = 'http://bbs.jjwxc.net/board.php?board=52&page=';

var pageNum = 0;

var arr = [];

var str = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body>';

var str1 = '</body></html>';

while(hasNext()){
	next();
};

// write();

function get(url, cb) {

	var data = null;

	http.get(url, function(res) {

	    var bufferHelper = new BufferHelper();

	    res.on('data', function(chunk){
	    	
	    	bufferHelper.concat(chunk);

	    });

	    res.on('end', function(){

	    	data = iconv.decode(bufferHelper.toBuffer(),'gb2312');
	      
	      	cb(data);
	    });

	}).on('error', function(e) {
	    cb(e, null);
	});
}

function write() {
	// console.log(1)
	var str2 = '';

	console.log(arr.length)

    for(var i = 1 ; i < arr.length ; i++) {

    	str2 += arr[i].text + '\n';

    }

    console.log(str2)
    fs.writeFile(path.join(__dirname, './test.html') , str + str2 + str1 , 'UTF-8' , function () {

    });
}

function next() {

	// hasNext(function (err, flag) {
		// console.log(1)
		// if(!flag) {
		// 	write();
		// 	return null;
		// }

		var urlStr = url + pageNum;

		// console.log(urlStr)

		get(urlStr, getData);


	// })
}

function hasNext() {
 	console.log(pageNum)
    if(pageNum === 2){
    	console.log(11)
      	return false;
    }

    return true;

};


function getData (data) {

	// data = iconv.decode(bufferHelper.toBuffer(),'gb2312');

    //data = parseHtml(data);

    // console.log(data)

    var $ = cheerio.load(data);  //cheerio解析data
 
    var content = $('body>table').eq(3);

    var a = content.children();

    a.each(function (i , ele) {

    	var obj = {};

    	var dom = $(this).find('a').first();

    	obj.src = dom.attr('href');

    	obj.text = dom.text();

    	arr.push(obj);

    })

	pageNum++;

}


// function getUrl () {

// 	var pageNum = 0;

// 	var url = 'http://bbs.jjwxc.net/board.php?board=52&page=';

// 	var queryUrl = url + pageNum; 

// 	http.get(queryUrl, function(res){

// 	  	var bufferHelper = new BufferHelper();

// 	  	var data = null;

// 	  	res.on('data', function (chunk) {

// 	    	bufferHelper.concat(chunk);

// 	  	});

// 	  	res.on('end',function(){ 

// 		    // console.log(iconv.decode(bufferHelper.toBuffer(),'gb2312'));

// 		    data = iconv.decode(bufferHelper.toBuffer(),'gb2312');

// 		    //data = parseHtml(data);

// 		    // console.log(data)

// 		    var $ = cheerio.load(data);  //cheerio解析data
		 
// 		    var content = $('body>table').eq(3);

// 		    var a = content.children();

// 		    var arr = [];

// 		    a.each(function (i , ele) {

// 		    	console.log($(this))

// 		    	arr[i] = {};

// 		    	var dom = $(this).find('a').first();

// 		    	arr[i].src = dom.attr('href');

// 		    	arr[i].text = dom.text();
// 		    })

// 		    console.log(arr[0])

// 		    var str2 = '';

// 		    for(var i = 1 ; i < arr.length ; i++) {

// 		    	str2 += arr[i].text + '\n';

// 		    }

		    
// 		    fs.writeFile(path.join(__dirname, './test.html') , str + str2 + str1 , 'UTF-8' , function () {

// 		    });

// 		});
// 	})
// }





// function parseHtml (str) {
// 	console.log(str.match(/每日/))
// 	console.log(str.match(/&#x([a-f][0-9])[^;];/))

// 	// str.replace(/&#x([a-f][0-9])[^;];/, function (m, $1) {
// 	// 	console.log($1)
// 	// 	return String.fromCharCode(parseInt($1 , 16));
// 	// })
// }

// function acquireData(data) {
// 	var bufferHelper = new BufferHelper();
// 	var data = iconv.decode(bufferHelper.concat(data).toBuffer(), 'gb2312');
// 	console.log(data)
//     var $ = cheerio.load(data);  //cheerio解析data
 
//     var content = $('body>table').eq(3);

//     var a = content.children();
    
//     console.log(a.length)

//     fileUtil.write(path.join(__dirname, './test.html') , str + a + str1);
// }