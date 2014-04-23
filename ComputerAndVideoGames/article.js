var convertMonth = function(month) {
    var number;
    return number;
}

var page = require('webpage').create(),
    system = require('system'),
    address;

address = system.args[1];
    
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        window.setTimeout(function () {
            console.log('Parsing & Building JSON');
            page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function() {
                var content = page.evaluate(function () {
                    var result = {title:'', subtitle:'', content:'', image:[], media:[], publishDate:'', author:'', source:''};
                    
                    var header;
                    
                    if ($('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large hgroup').html()) {
                        header = $('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large hgroup');
                    } else  {
                        header = $('div.single-article__header').children('hgroup');
                    }
                    
                    result.title = header.children('h1').html();
                    result.subtitle = header.children('h2').html();

                    if ($('div.single-article__meta p a').html()) {
                        result.author = $('div.single-article__meta p a').html();
                    } else if ($('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large a.is-lowlight').html()) {
                        result.author = $('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large a.is-lowlight').html();
                    }
                    
//                    return $('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large').html();
                    
                    result.source = "Computer and Video Games";

                    var meta;
                    if ($('div.single-article__meta p').html()) {
                        meta = $('div.single-article__meta p');
                    } else if ($('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large').html()) {
                        meta = $('div.highlight__overlay.has-indicator.has-indicator--reviews.has-indicator--large');
                    }
//                        return meta;    

                    var publishDate = meta.html().substring(meta.html().indexOf('on '),meta.html().length);
                    var date = publishDate.replace('on ','').substring(0,publishDate.indexOf('\n')).trim().replace(' at','').replace('th','').replace('rd','').replace('nd','').replace('st','').split(' ');

                    var month;

                    if ('Jan' === date[2]) {
                        month = '01';
                    } else if ('Feb' === date[2]) {
                        month = '02';
                    } else if ('Mar' === date[2]) {
                        month = '03';
                    } else if ('Apr' === date[2]) {
                        month = '04';
                    } else if ('May' === date[2]) {
                        month = '05';
                    } else if ('Jun' === date[2]) {
                        month = '06';
                    } else if ('Jul' === date[2]) {
                        month = '07';
                    } else if ('Aug' === date[2]) {
                        month = '08';
                    } else if ('Sep' === date[2]) {
                        month = '09';
                    } else if ('Oct' === date[2]) {
                        month = '10';
                    } else if ('Nov' === date[2]) {
                        month = '11';
                    } else if ('Dec' === date[2]) {
                        month = '12';
                    }

                    var timeBreakUp = date[4].split(':');
                    var hour = parseInt(timeBreakUp[0]);
                    if (hour < 12 && date[5] === 'PM') {
                        hour = (hour + 12) ;
                    }

                    result.publishDate = date[3] + '-' + month + '-' + date[1] + ' ' + hour + ':' + timeBreakUp[1];



                    var content = $('div#article_body_container div.single-article__body p');
                    content.each(function() {
                        result.content = result.content + "<p>" + $(this).html() + "</p>";
                    });

                    var images = $('div#article_body_container div.single-article__body img');
                    images.each(function() {
                        result.image.push($(this).attr('src'));
                    });

                    var iframe = $('div#article_body_container div.single-article__body iframe');
                    iframe.each(function() {
                        if ($(this).attr('src')) {
                            result.media.push($(this)[0].outerHTML);
                        }
                    });

                    return result;
                
                });
//		console.log(content);
                console.log(JSON.stringify(content));
                phantom.exit();
            });
        }, 1000);
    }
});

