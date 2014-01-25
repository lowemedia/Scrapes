

var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

//if (system.args.length < 3 || system.args.length > 5) {
//    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
//    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
//    phantom.exit(1);
//} else {
    address = system.args[1];
    output = system.args[2];
    page.viewportSize = { width: 600, height: 600 };
    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
    }
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
            window.setTimeout(function () {
                console.log('Parsing & Building JSON');
                var content = page.evaluate(function () {
                    var result = {title:'', subtitle:'', content:'', image:[], media:[], publishDate:'', author:'', source:''};
                    var element = document.getElementsByClassName('col mp-all ml-all t-all d-8');
                    
                    var article = element[0].getElementsByTagName('article');
                    
                    for (var n=0; n<article.length; n++) {
                        var header = article[n].getElementsByClassName('single-article__header');
                        
                        var title = header[0].getElementsByTagName('h1');
                        result.title = title[0].innerHTML;
                        
                        var subtitle = header[0].getElementsByTagName('h2');
                        result.subtitle = subtitle[0].innerHTML;
                        
                        var source = article[n].getElementsByClassName('single-article__meta');
                        var author = source[0].getElementsByTagName('a');
                        result.author = author[0].innerHTML;
                        var sourceText = source[0].getElementsByTagName('p')[0].innerHTML;
                        
                        var publishDate = sourceText.substring(sourceText.indexOf('on '),sourceText.length);
                        result.publishDate = publishDate.replace('on ','').substring(0,publishDate.indexOf('\n')).trim();
                        
                    }
                    var content = document.getElementById('article_body_container');
                    
                    var paragraph = content.getElementsByTagName('p');
                    for (var x=0; x<paragraph.length; x++) {
                        result.content = result.content + paragraph[x].outerHTML;
                    }
                    
                    
                    return result;
    		});
                //page.content = JSON.stringify(content);
		console.log(JSON.stringify(content));
		//page.render(output);
                phantom.exit();
            }, 100);
        }
    });
//}
