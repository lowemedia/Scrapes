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
                
                var article = document.getElementsByClassName('grid group');
                return article.length;
//                for (var n=0; n<article.length; n++) {
//                    return article[n].innerHTML;
//                }


                return result;
            });
            console.log(content);
            //page.content = JSON.stringify(content);
            //page.render(output);
            phantom.exit();
        }, 100);
    }
});
