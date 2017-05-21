<?php
	require("/home/studio402/db/mysql_connect.php");

	$link = db_connect("studio402_data");

	$sql = 'SELECT works_id, title, img, genre FROM works';
	$rs = mysql_query($sql, $link);
	while($row = mysql_fetch_assoc($rs))
		$contents[$row['works_id']] = $row;

	$sql = 'SELECT * FROM member';
	$rs = mysql_query($sql, $link);
	while($row = mysql_fetch_assoc($rs))
		$members[$row['member_id']] = $row;

	db_close($link);

	$article = simplexml_load_file('http://studio402.tumblr.com/rss');

	$items = array();
	foreach($article->channel->item as $item) {
		$temp = array();
		foreach($item as $column => $value) {
			$temp[$column] = (string)$value;
		} unset($column); unset($value);
		array_push($items, $temp);
	} unset($item);
?>

<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<meta name="keyword" content="studio402">
		<meta name="description" content="studio402の公式Webサイトです。">
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title>studio402</title>

		<script src="../site/js/index.js"></script>
		<link rel="stylesheet" href="../site/css/html5reset-1.6.1.css" />
		<link rel="stylesheet" href="../site/css/index.css" />

		<script type="text/javascript" async="" src="http://www.google-analytics.com/ga.js"></script>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-19055556-1']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>

	<body>
		<div id="show">
			<iframe id="movie" width="0" height="0" src="" frameborder="0" allowfullscreen></iframe>
			<img id="close" src="http://img.studio402.jp/close.png" />
		</div>
		<div id="wrapper">
			<div id="news_detail">
				<div id="bar">
					<div id="scroller"></div>
				</div>
				<div id="article">
					<?php
						$item_num = count($items);
						$counter = 0;
						foreach($items as $item) {
							echo '<div class="item">';
							date_default_timezone_set('Asia/Tokyo');
							$myDate = strtotime($item['pubDate']); 
							echo '<p class="news_header"><span class="news_date">' . date('Y/m/d', $myDate) . '</span><span class="news_title">' .  $item['title'] . '</span></p>';
							echo $item['description'];
							$counter++;
							if($counter != $item_num)	echo '<span class="border"></span>';
							echo '</div>';
						} unset($item);
					?>
				</div>
			</div>
			<div id="detail">
				<span id="title"></span>
				<span id="genre">o</span>
				<div id="caption">
					<div id="thumbnail">
						<img id="image" src="" />
						<span id="credit"></span>
					</div>
					<p id="description"></p>
				</div>
				<span id="contact">studio402.info@gmail.com</span>
				<span><a id="link" href="" target="_blank"></a></span>
			</div>
			<div id="logo">
				<img id="logo_img" src="http://img.studio402.jp/logo.png" />
			</div>
			<div id="contents">
				<div class="content">
					<div id="about" class="content_thumbnail"></div>
					<div class="content_title">about</div>
				</div>
				<div class="content">
					<div id="news" class="content_thumbnail"></div>
					<div class="content_title">news</div>
				</div>
				<?php
					foreach($contents as $data) {
						echo "<div class=\"content\">";
						echo "<img id=\"" . $data['works_id'] . "\" class=\"content_thumbnail\" src=\"http://img.studio402.jp/works/" . $data['img'] . "\">";
						echo "<div class=\"content_title\">" . $data['title'] . "</div>";
						echo "<div class=\"content_genre\">" . $data['genre'] . "</div>";
						echo "</div>";
					} unset($data);
				?>
			</div>
			<div id="members">
				<div class="person">
					<span id="backHome" class="name">back to top</span>
				</div>
				<?php
					foreach($members as $member) {
						echo "<div class=\"person\">";
						echo "<span id=\"" . $member['member_id'] . "_member\" class=\"name\">";
						if($member['link'] != "")
							echo "<a class = \"member_link\" href=\"" . $member['link'] . "\" target=\"_blank\">" . $member['name'] . "</a>";
						else if($member['twitter'] != "")
							echo "<a class = \"member_link\" href=\"" . $member['twitter'] . "\" target=\"_blank\">" . $member['name'] . "</a>";
						else
							echo $member['name'];
						echo "</span>";
						echo "<span class=\"yomi\">" . $member['yomi'] . "</span>";
						echo "</div>";
					} unset($member);
				?>
			</div>
		</div>
	</body>
</html>