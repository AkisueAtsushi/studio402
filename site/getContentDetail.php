<?php
	require("/home/studio402/db/mysql_connect.php");

	$id = $_GET['id'];

	if($id == "about") {
		$row['about'] = "studio402はオールディレクター集団として立ち上げました。 作品ごとに、その作品に合った監督が指揮を執ることで、多種多様な作品を生み出すことを可能にしました。また、単なる分業ではなく、オールディレクターであることで初めて可能になる、知識や技術の融合と集約によって、クリエイションの新たな地平の開拓を目指しています。そのために様々な得意ジャンルを持つ若手クリエイターが、映画やMV、ドキュメンタリー等の映像制作を中心に作品を生み出しています。加えて活動領域は映像表現のみにとどまらず、ロゴデザイン・インスタレーション・楽曲提供・イベントオーガナイズなど、ジャンルを横断した表現を日々模索し続けています。そして、映像ディレクター、建築家、プロデューサー、カメラマン、照明技師など、それぞれが個人としての活動を続けていく一方で、studio402としての作品に力を集約させることを目指します。";
		echo json_encode($row);
		exit;
	}

	$link = db_connect('studio402_data');

	$sql = 'SELECT * FROM works WHERE works_id=' . $id;
	$rs = mysql_query($sql, $link);
	$row = mysql_fetch_assoc($rs);

	$row['img'] = 'http://img.studio402.jp/works/' . $row['img'];

	$row['description'] = str_replace("\n", "<br>", $row['description']);

	echo json_encode($row);

	db_close($link);
?>