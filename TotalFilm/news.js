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
                var content = page.evaluate(function () {
                    var result = {'link':[]};
                    var addresses = [];
                    
                    var newsHtml = document.getElementsByClassName('metawrap');
                    for (var n=0; n<newsHtml.length; n++) {
                        var anchors = newsHtml[n].getElementsByTagName('a');
                        for (var i=0; i<anchors.length; i++) {
                            var address = anchors[i].getAttribute("href");
                            if (address.indexOf('#comments') < 0) {
                                addresses.push(address);
                            }
                        }
                    }
                    
                    var moreNews = document.getElementsByClassName('metaWrap');
                    for (var n=0; n<moreNews.length; n++) {
                        var anchors = moreNews[n].getElementsByTagName('a');
                        for (var i=0; i<anchors.length; i++) {
                            var address = anchors[i].getAttribute("href");
                            if (address.indexOf('#comments') < 0) {
                                addresses.push(address);
                            }
                        }
                    }
                    
                    
                    result.link = addresses;
                    return result;
                });
                console.log(JSON.stringify(content));
//                page.content = content.link;
//                page.render('totalFilm.pdf');
                phantom.exit();
            }, 100);
        }
    });
//}
