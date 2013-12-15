<?php
//$outputNews = shell_exec('bin/phantomjs Empire/news.js http://www.empireonline.com/news');
//$news = explode('Parsing & Building JSON', $outputNews);
//print_r(json_decode($news[1]));

$outputArticle = shell_exec('bin/phantomjs Empire/article.js http://www.empireonline.com/news/story.asp?NID=39504');
$article = explode('Parsing & Building JSON', $outputArticle);
print_r(json_decode($article[1]));

//$outputNews = shell_exec('bin/phantomjs TotalFilm/news.js http://www.totalfilm.com/news');
//$news = explode('Parsing & Building JSON', $outputNews);
//print_r(json_decode($news[1]));

$outputArticle = shell_exec('bin/phantomjs TotalFilm/article.js http://www.totalfilm.com/news/edgar-wright-talks-ant-man-2');
$article = explode('Parsing & Building JSON', $outputArticle);
print_r(json_decode($article[1]));

