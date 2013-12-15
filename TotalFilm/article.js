var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

address = system.args[1];
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        window.setTimeout(function () {
            console.log('Parsing & Building JSON');
            var content = page.evaluate(function () {
                var result = {title:'', subtitle:'', content:'', image:[], media:[], publishDate:'', author:'', source:''};
                var header = document.getElementById('articleMeta');
                var headings = header.getElementsByTagName('h1');
                var subheadings = header.getElementsByTagName('h2');

                for (var i=0; i<headings.length; i++) {
                    result.title += headings[i].innerHTML;
                }
                
                for (var i=0; i<subheadings.length; i++) {
                    result.subtitle += subheadings[i].innerHTML;
                    
                    var articleDate = subheadings[i].parentNode.getElementsByClassName('articleDate');
                    for (var a=0; a<articleDate.length; a++) {
                        var date = articleDate[a].getElementsByTagName('meta');
                        for (var n=0; n<date.length; n++) {
                            result.publishDate += date[n].getAttribute('content');
                        }
                    }
                    
                    var articleAuthor = subheadings[i].parentNode.getElementsByClassName('articleAuthor');
                    for (var a=0; a<articleAuthor.length; a++) {
                        var author = articleAuthor[a].children;
                        for (var n=0; n<author.length; n++) {
                            result.author += author[n].innerHTML;
                        }
                    }
                }

                var article = document.getElementById('articleContent');
                var body = article.getElementsByClassName('body');
                for (var i=0; i<body.length; i++) {
                    var pictures = body[i].getElementsByTagName('img');
                    for (var n=0; n<pictures.length; n++) {
                        result.image.push(pictures[n].getAttribute('src'));
                        
                        pictures[n].parentNode.parentNode.removeChild(pictures[n].parentNode);
                    }
                    
                    var media = body[i].getElementsByTagName('iframe');
                    for (var n=0; n<media.length; n++) {
                        result.media.push(media[n].outerHTML);
                        
                        media[n].parentNode.removeChild(media[n]);
                    }
                    
                    var source = body[i].getElementsByClassName('sourceLink');
                    
                    for (var n=0; n<source.length; n++) {
                        result.source = source[n].innerHTML.replace('Source:', '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        source[n].parentNode.removeChild(source[n])
                    }
                    
                    result.content = body[i].innerHTML;
                }


                return result;
            });
            console.log(JSON.stringify(content));
            //page.content = JSON.stringify(content);
            //page.render(output);
            phantom.exit();
        }, 100);
    }
});
