

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
                    var element = document.getElementsByTagName('table');
                    for (index = 0; index < element.length; index++) {
                        if (element[index].hasAttribute('width') && element[index].getAttribute('width') === "795") {
                            links = element[index].getElementsByTagName('a');
                            for (linkIndex = 0; linkIndex < links.length; linkIndex++) {
                                if (links[linkIndex].hasAttribute('href') && links[linkIndex].hasAttribute('class') && links[linkIndex].getAttribute('class') === "largeblack") {
                                    result.link.push(links[linkIndex].getAttribute('href'));
//                                    break;
                                }
                            }
//                            break;
                        }
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