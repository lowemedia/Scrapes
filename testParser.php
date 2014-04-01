<?php
//$outputNews = shell_exec('bin/phantomjs Empire/news.js http://www.empireonline.com/news');
//$news = explode('Parsing & Building JSON', $outputNews);
//print_r(json_decode($news[1]));

//$outputArticle = shell_exec('bin/phantomjs Empire/article.js http://www.empireonline.com/news/story.asp?NID=39504');
//$article = explode('Parsing & Building JSON', $outputArticle);
//print_r(json_decode($article[1]));

//$outputNews = shell_exec('bin/phantomjs TotalFilm/news.js http://www.totalfilm.com/news');
//$news = explode('Parsing & Building JSON', $outputNews);
//print_r(json_decode($news[1]));

//$outputArticle = shell_exec('bin/phantomjs TotalFilm/article.js http://www.totalfilm.com/news/edgar-wright-talks-ant-man-2');
//$article = explode('Parsing & Building JSON', $outputArticle);
//print_r(json_decode($article[1]));
$start = microtime(true);
echo "************************************************************\n";
echo "Scraping News Page\n";
$outputNews = shell_exec('bin/phantomjs ComputerAndVideoGames/news.js http://www.computerandvideogames.com/news.php');
$news = explode('Parsing & Building JSON', $outputNews);
$links = json_decode($news[1]);
echo "Done\n\n";


echo "Scraping Article Pages\n";

$count = 0;
foreach ($links->link as $link) {
    $outputArticle = shell_exec('bin/phantomjs ComputerAndVideoGames/article.js ' . $link);
    $article = explode('Parsing & Building JSON', $outputArticle);
    $count++;
    sleep(5);
}
echo "Done\n\n";
$end = microtime(true);
$total = $end - $start;

echo "{$count} articles scraped\n";
echo "Time Taken: {$total}\n";
echo "************************************************************\n";
