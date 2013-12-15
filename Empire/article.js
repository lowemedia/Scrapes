

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
//                    var result = {title:'', subtitle:'', content:'', image:'', media:'', details:''};
    		    var container = document.getElementById('mainbodycontainer');
                    var tag = container.getElementsByTagName('td');
                    
                    var image = tag[0].getElementsByTagName("img");
                    if (image) {
                        if (image.length > 0) {
                            result.image.push(image[0].getAttribute('src'));
                            for (index = image.length - 1; index >= 0; index--) {
                                image[index].parentNode.removeChild(image[index]);
                            }
                        }
                    }

                    var media = tag[0].getElementsByTagName("object");
                    if (media.length > 0) {
                        result.media.push(tag[0].outerHTML);
                        for (index = media.length - 1; index >= 0; index--) {
                            media[index].parentNode.removeChild(media[index]);
                        }
                    }
                    
                    media = tag[0].getElementsByTagName("iframe");
                    if (media.length > 0) {
                        result.media.push(media[0].outerHTML);
                        for (index = media.length - 1; index >= 0; index--) {
                            media[index].parentNode.removeChild(media[index]);
                        }
                    }
                    
                    media = tag[0].getElementsByTagName("script");
                    if (media.length > 0) {
                        result.media.push(tag[0].outerHTML);
                        for (index = media.length - 1; index >= 0; index--) {
                            media[index].parentNode.removeChild(media[index]);
                        }
                    }
                    
                    var content = tag[0].getElementsByTagName('p');
                    for (index = 0; index < content.length; index++) {
                        if (content[index].innerHTML !== "") {
                            content[index].removeAttribute('class');
                            var links = content[index].getElementsByTagName('a');
                            
                            for (linkIndex = 0; linkIndex < links.length; linkIndex++) {
                                links[linkIndex].removeAttribute('class');
                            }
                            
                            result.content = result.content + content[index].outerHTML;
                        }
                    }
                    
                    
                    var element = document.getElementsByTagName('td');
                    for (index = 0; index < element.length; index++) {
                        if (element[index].hasAttribute('class') && element[index].getAttribute('class') === "largeblack") {
                            result.title = element[index].getElementsByTagName('b')[0].innerHTML;
                            result.subtitle = element[index].getElementsByTagName('i')[0].innerHTML;
                            
                            var details = element[index].getElementsByTagName('span');
                            for (detailsIndex = 0; detailsIndex < details.length; detailsIndex++) {
                                if (details[detailsIndex].hasAttribute('class') && details[detailsIndex].getAttribute('class') === "smallgrey") {
                                    var articleDetails = details[detailsIndex].innerHTML.split('&nbsp;&nbsp;|&nbsp;&nbsp;');
                                    result.source = articleDetails[2].replace('Source:', '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                                    result.author = articleDetails[1].replace("Written by ", "");
                                    result.publishDate = articleDetails[0];
                                }
                            }
                            
                            break;
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
