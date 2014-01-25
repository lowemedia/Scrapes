

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
                    var result = {'link':[]};
                    var addresses = []
                    var element = document.getElementsByTagName('article');
                    for (var n = 0; n < 2; n++) {
                        var subElement = element[n].getElementsByTagName('h1');
                        for (var n = 0; n < subElement.length; n++) {
                            var link = subElement[n].getElementsByTagName('a')[0].getAttribute('href');
                            addresses.push(link);
                        }
                    }
//                    result.link.push(element[0]);
//                    for (var n = 0; n < element.length; n++) {
//                        var subElement = element[n].getElementsByTagName('div');
//                        for (var m = 0; m < subElement; m++) {
//                            var section = subElement[n].getElementsByClassName('media__body');
//                            for (var i = 0; i < section; i++) {
//                                var link = section[i].getElementsByTagName('a')[0].getAttribute('href');
//                                result.link.push(section[i]);
//                            }
//                        }
//                        
//                    }

                    
                    return addresses;
    		});
                //page.content = JSON.stringify(content);
		console.log(JSON.stringify(content));
		//page.render(output);
                phantom.exit();
            }, 100);
        }
    });
//}
