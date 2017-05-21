var wrapper;
var logo;
var detail;
var news_detail;
var contents;
var members;

var only_first = true;
var isAnimating = false;
var isAbout = false;
var isBack = false;

var content_logo_diff;
var detail_logo_diff;

var logo_set_height;	//logoの現在の高さ
var logo_top_set_height;	//logoの高さ上限
var logo_bottom_set_height;	//logoの低さ下限
var browser_min_height = 600;
var movie_height = 510;
var movie_width = 680;

var timeId;
var timeId2;
var Interval;
var progress;
var counter;

var source;
var detailObject;
var opacity = 0.01;

var isPercentage = false;
var onScroller = false;
var dragging = false;
var pastY;
var posY = 1;
var diff;

/* IE判定 */
var isIE6 = false;
var isIE7 = false;
var isIE8 = false;

var request = new XMLHttpRequest();

(function(){
	var _ua = navigator.userAgent;
	if(_ua.indexOf('MSIE') > -1) {
		var _app = navigator.appVersion;
		isIE6 = (_app.indexOf('MSIE 6.0') > -1) ? true : false;
		isIE7 = (_app.indexOf('MSIE 7.0') > -1) ? true : false;
		isIE8 = (_app.indexOf('MSIE 8.0') > -1) ? true : false;
	}
})();

function loaded() {

	window.onresize = onResize;

	logo = document.getElementById("logo");
	contents = document.getElementById("contents");
	members = document.getElementById("members");
	detail = document.getElementById("detail");
	news_detail = document.getElementById("news_detail");

	var browserHeight = (getBrowserHeight() < browser_min_height) ? browser_min_height : getBrowserHeight();

	wrapper = document.getElementById("wrapper");
	wrapper.style.overflow = "hidden";
	wrapper.style.height = browserHeight + "px";

	//ロゴの中央寄せ
	logo_set_height =  (browserHeight - logo.offsetHeight) / 2;
	logo.style.top = logo_set_height + "px";
	logo.style.visibility = "visible";

	//トップの高さ
	logo_top_set_height = 0;

	//ボトムの高さ
	logo_bottom_set_height = browserHeight - (logo.offsetHeight + 20);	//20は上のマージン分

	//contentsとmembersのtop位置（40は上下のマージン分）
	contents.style.top = (logo.offsetHeight + 40) + "px";
	members.style.top = (logo.offsetHeight + 40) + "px";

	content_logo_diff = Math.abs(logo.offsetHeight + 40);

	//detailとnews_detailのleft位置(top位置は動的に毎回取得)
	detail.style.left = ((wrapper.offsetWidth - detail.offsetWidth) / 2) + "px";
	news_detail.style.left = ((wrapper.offsetWidth - news_detail.offsetWidth) / 2) + "px";

	//news_detailのスクロールを装着するか
	if(news_detail.offsetHeight < document.getElementById("article").offsetHeight) {
		var scroller_height = news_detail.offsetHeight - (document.getElementById("article").offsetHeight - news_detail.offsetHeight);
		document.getElementById("scroller").style.height = ((scroller_height < 50) ? 50 : scroller_height) + "px";
		isPercentage = (scroller_height < 50) ? true : false;

		document.getElementById("scroller").onmouseover = function() {
																												onScroller = true;
																												this.style.opacity = 1.0;
																											}

		document.getElementById("scroller").onmouseout = function() {
																												onScroller = false;
																												if( ! dragging)	this.style.opacity = "";
																											}

	if(isIE6 || isIE7 || isIE8) {
		document.attachEvent('onmousemove', onMouseMove);
		document.getElementById("scroller").attachEvent('onmousedown', onMouseDown);
	}
	else {
		document.addEventListener('mousemove', onMouseMove, false);
		document.getElementById("scroller").addEventListener('mousedown', onMouseDown, false);
	}

		document.onmouseup = function () {
														dragging = false;
														document.getElementById("scroller").style.opacity = "";
												};

		if (window.addEventListener)
			document.getElementById("news_detail").addEventListener('DOMMouseScroll', wheel, false);
		document.getElementById("news_detail").onmousewheel = wheel;
	}
	else
		document.getElementById("bar").style.visibility = "hidden";

	setTimeout(function() {
								Interval = 17;
								progress = 28;
								counter = 0;
								timeId = setInterval("logo_mover(" + logo_set_height + ", " + logo_top_set_height +  ", " + progress + ")", Interval);
							}, 800);

	document.getElementById("logo_img").onclick = function() {
																			if(isAnimating)	return;
																			if(isBack == false) return;

																			isAnimating = true;
																			isBack = false;

																			if(isAbout) {
																				document.getElementById("contents").style.visibility = "hidden";
																				document.getElementById("members").style.visibility = "visible";
																				document.getElementById("members").style.opacity = null;
																			}
																			else {
																				document.getElementById("contents").style.visibility = "visible";
																				document.getElementById("members").style.visibility = "hidden";
																			}

																			Interval = 17;
																			progress = 35;
																			counter = 0;
																			timeId = setInterval("logo_mover(" + logo_set_height + ", " + logo_top_set_height +  ", " + progress + ")", Interval);
																		};

	document.getElementById("close").onclick = function() {
																			document.getElementById("show").style.visibility = "hidden";
																			document.getElementById("movie").style.width = 0 + "px";
																			document.getElementById("movie").style.height = 0 + "px";
																			document.getElementById("movie").setAttribute("src", source);
																		};

	var content_width = contents.offsetWidth / 4;
	var content_height = (content_width / 16) * 9;

	var content;
	if(isIE6 || isIE7 || isIE8)
		content = getElementsByClassName("content", "div");
	else
		content = document.getElementsByClassName("content");
	for(var i=0; i < content.length; i++) {
		content[i].style.width = content_width + "px";
		content[i].style.height = content_height + "px";

		content[i].childNodes[0].onclick = function() {
																if(isAnimating)	return;

																isAnimating = true;
																isBack = true;

																browserHeight = (getBrowserHeight() < browser_min_height) ? browser_min_height : getBrowserHeight();
																wrapper.style.height = browserHeight + "px";
																wrapper.style.overflow = "hidden";
																logo_bottom_set_height = browserHeight - (logo.offsetHeight + 30);	//30は上のマージン分
																detail.style.top = - (((browserHeight - logo.offsetHeight - detail.offsetHeight) / 2) + detail.offsetHeight) + "px";
																detail.style.visibility = "visible";
																news_detail.style.visibility = "hidden";
																detail_logo_diff = Math.abs((((browserHeight - logo.offsetHeight - detail.offsetHeight) / 2) + detail.offsetHeight));
																
																if(isIE6 || isIE7 || isIE8)
																	document.getElementById("movie").style.top = ((wrapper.offsetHeight - (logo.offsetHeight + 40) - movie_height) / 2) + "px";
																else {
																	document.getElementById("movie").style.marginTop = ((wrapper.offsetHeight - (logo.offsetHeight + 40) - movie_height) / 2) + "px";
																	document.getElementById("close").style.top = ((wrapper.offsetHeight - (logo.offsetHeight + 40) - movie_height) / 2) + "px";
																}

																detailObject = null;
																var config = {Interval: 17, progress: 30, from: logo_set_height, to: logo_bottom_set_height};
																getDetails(this.id, config);
															};

		content[i].childNodes[0].onmouseover = function() {
																						if(isIE6 || isIE7 || isIE8)
																							this.style.filter = "alpha(opacity=80)";
																						else
																							this.style.opacity = 0.8;
																					};
		content[i].childNodes[0].onmouseout = function() {
																						if(isIE6 || isIE7 || isIE8)
																							this.style.filter = "alpha(opacity=100)";
																						else
																							this.style.opacity = 1.0;
																					};
	}

	var persons;
	if(isIE6 || isIE7 || isIE8)
		persons = getElementsByClassName("person", "div");
	else
		persons = document.getElementsByClassName("person");

	var names;
	if(isIE6 || isIE7 || isIE8)
		namess = getElementsByClassName("name", "div");
	else
		names = document.getElementsByClassName("name");

	for(var i=0; i < persons.length; i++) {
		persons[i].style.width = content_width + "px";
		persons[i].style.height = content_height + "px";

		if(! (isIE6 || isIE7 || isIE8))
			names[i].style.lineHeight = names[i].offsetHeight + "px";
	}

	var member_link;
	if(isIE6 || isIE7 || isIE8)
		member_link = getElementsByClassName("member_link", "a");
	else
		member_link = document.getElementsByClassName("member_link");
	for(var i=0; i < member_link.length; i++) {
		member_link[i].onmouseover = function() { this.style.backgroundColor = "white";};
		member_link[i].onmouseout = function() { this.style.backgroundColor = ""; };
	}

	var news = document.getElementById("news");
	news.onmouseover = function() { this.style.backgroundColor = "white"; };
	news.onmouseout = function() { this.style.backgroundColor = ""; };

	news.onclick = function() {
									if(isAnimating)	return;

									isAnimating = true;
									isBack = true;

									browserHeight = (getBrowserHeight() < browser_min_height) ? browser_min_height : getBrowserHeight();
									wrapper.style.height = browserHeight + "px";
									wrapper.style.overflow = "hidden";
									logo_bottom_set_height = browserHeight - (logo.offsetHeight + 30);	//30は上のマージン分
									news_detail.style.top = - (((browserHeight - logo.offsetHeight - news_detail.offsetHeight) / 2) + news_detail.offsetHeight) + "px";
									news_detail.style.visibility = "visible";
									detail.style.visibility = "hidden";
									detail_logo_diff = Math.abs((((browserHeight - logo.offsetHeight - news_detail.offsetHeight) / 2) + news_detail.offsetHeight));

									var config = {Interval: 17, progress: 30, from: logo_set_height, to: logo_bottom_set_height};
									counter = 0;
									timeId = setInterval("logo_mover(" + config.from + ", " + config.to +  ", " + config.progress + ")", config.Interval);
	}

	var about = document.getElementById("about");
	about.onmouseover = function() { this.style.background = "white"; };
	about.onmouseout = function() { this.style.background = ""; };

	about.onclick = function() {
								if(isAnimating)	return;

								isAnimating = true;
								isAbout = true;
								isBack = true;

								browserHeight = (getBrowserHeight() < browser_min_height) ? browser_min_height : getBrowserHeight();
								wrapper.style.height = browserHeight + "px";
								wrapper.style.overflow = "hidden";
								logo_bottom_set_height = browserHeight - (logo.offsetHeight + 30);	//30は上のマージン分
								detail.style.top = - (((browserHeight - logo.offsetHeight - detail.offsetHeight - 40) / 2) + detail.offsetHeight) + "px";
								detail.style.visibility = "visible";
								news_detail.style.visibility = "hidden";
								detail_logo_diff = Math.abs((((browserHeight - logo.offsetHeight - detail.offsetHeight) / 2) + detail.offsetHeight));

								document.getElementById("title").innerHTML = "studio402";
								document.getElementById("genre").style.visibility = "hidden";
								document.getElementById("thumbnail").style.width = 0;
								document.getElementById("image").style.visibility = "hidden";
								document.getElementById("credit").innerHTML = "";
								document.getElementById("title").style.top = "15px";
								document.getElementById("description").style.paddingLeft = "80px";
								document.getElementById("description").style.paddingRight = "80px";
								document.getElementById("contact").style.visibility = "visible";
								document.getElementById("link").style.visibility = "hidden";
								document.getElementById("caption").style.top = (detail.offsetHeight - document.getElementById("caption").offsetHeight) / 2 + "px";
								document.getElementById("caption").style.left = (detail.offsetWidth - document.getElementById("caption").offsetWidth) / 2 + "px";

								detailObject = null;
								var config = {Interval: 17, progress: 30, from: logo_set_height, to: logo_bottom_set_height};
								getDetails(this.id, config);
							};

	document.getElementById("backHome").onmouseover = function() { this.style.backgroundColor = "white"; this.style.color = "rgb(114, 113, 118)"; };
	document.getElementById("backHome").onmouseout = function() { this.style.backgroundColor = ""; this.style.color = "";};
	document.getElementById("backHome").onclick = function() {

																					if(isAbout) {
																						isAbout = false;
																						document.getElementById("genre").style.visibility = "";
																						document.getElementById("thumbnail").style.width = null;
																						document.getElementById("image").style.visibility = "";
																						document.getElementById("title").style.top = null;
																						document.getElementById("description").style.position = "";
																						document.getElementById("description").style.top = null;
																						document.getElementById("description").style.paddingLeft = null;
																						document.getElementById("description").style.paddingRight = null;
																						document.getElementById("contact").style.visibility = "";
																						document.getElementById("link").style.visibility = "";
																					}

																					if(logo.offsetHeight + 30 + contents.offsetHeight  < getBrowserHeight())	//30はlogoのマージン
																						wrapper.style.overflow = "hidden";

																					if(isIE6 || isIE7 || isIE8) {
																						contents.style.visibility = "visible";
																						members.style.visibility = "hidden";
																					}
																					else {
																						opacity = 0;
																						contents.style.opacity = opacity;
																						contents.style.visibility = "visible";
																						timeId2 = setInterval("dissolve()", 15);
																					}
																				};

	document.getElementById("close").onmouseover = function() {
																									if(isIE6 || isIE7 || isIE8)
																										this.style.filter = "alpha(opacity=80)";
																									else
																										this.style.opacity = 0.8;
																								};
	document.getElementById("close").onmouseout = function() {
																									if(isIE6 || isIE7 || isIE8)
																										this.style.filter = "alpha(opacity=100)";
																									else
																										this.style.opacity = null;
																								};
}

function wheel(event){
	var delta = 0;
	if(!event)
		event = window.event;

	if (event.wheelDelta)
		delta = event.wheelDelta/60;
	else if (event.detail)
		delta = -event.detail/2;

	if(delta)
		handle(delta);
	else
		document.getElementById("scroller").style.opacity = "";

	if(event.preventDefault)
		event.preventDefault();

	event.returnValue = false;
}

function handle(delta) {
	if(isIE6 || isIE7 || isIE8)
		document.getElementById("scroller").style.filter = "alpha(opacity=100)";
	else
		document.getElementById("scroller").style.opacity = 1.0;
	if(delta < 0)
		delta = -8;
	else
		delta = 8;
	posY -= delta;
	if(posY < 1)	posY = 1;
	else if(posY > news_detail.offsetHeight - document.getElementById("scroller").offsetHeight - 5)
	posY = news_detail.offsetHeight - document.getElementById("scroller").offsetHeight - 5;
	document.getElementById("scroller").style.top = posY + "px";
	if(isPercentage) {
		var move = parseInt(document.getElementById("article").offsetHeight * (posY / news_detail.offsetHeight));
		document.getElementById("article").style.top = -move + "px";
	}
	else
		document.getElementById("article").style.top = -posY + "px";
}

function onMouseMove(e) {
	if(dragging) {
		if(isIE6 || isIE7 || isIE8) {
			diff = e.y - pastY;
			pastY = e.y;
		}
		else {
			diff = e.pageY - pastY;
			pastY = e.pageY;
		}
		if(isNaN(diff))	diff = 0;
		posY += diff;
		if(posY < 1)	posY = 1;
		else if(posY > news_detail.offsetHeight - document.getElementById("scroller").offsetHeight - 5)
			posY = news_detail.offsetHeight - document.getElementById("scroller").offsetHeight - 5;
		document.getElementById("scroller").style.top = posY + "px";
		if(isPercentage) {
			var move = parseInt(document.getElementById("article").offsetHeight * (posY / news_detail.offsetHeight));
			document.getElementById("article").style.top = -move + "px";
		}
		else
			document.getElementById("article").style.top = -posY + "px";
	}
	else if( ! onScroller) {
		if(!(isIE6 || isIE7 || isIE8))
			document.getElementById("scroller").style.opacity = "";
		else
			document.getElementById("scroller").style.filter = "alpha(opacity=60)";
	}
}

function onMouseDown(e) {
	dragging = true;
	if(isIE6 || isIE7 || isIE8) {
		e.returnValue = false;
		pastY = e.y;
		document.getElementById("scroller").style.filter = "alpha(opacity=100)";
	}
	else {
		e.preventDefault();
		pastY = e.pageY;
		this.style.opacity = 1.0;
	}
}

function getDetails(num, config) {
	var url = "../site/getContentDetail.php?id=" + num;
	request.open("GET", url, true);
	request.send("");
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			detailObject = eval( "(" + request.responseText + ")" );

			if("about" in detailObject)
				document.getElementById("description").innerHTML = detailObject.about;
			else {
				document.getElementById("title").innerHTML = detailObject.title;
				document.getElementById("genre").innerHTML = detailObject.genre;
				document.getElementById("image").setAttribute("src", detailObject.img);
				document.getElementById("credit").innerHTML = detailObject.credit;
				document.getElementById("description").innerHTML = detailObject.description;

				if(detailObject.link != "") {
					document.getElementById("link").setAttribute("href", detailObject.link);
					document.getElementById("link").innerHTML = detailObject.link_word;
				}
				else {
					document.getElementById("link").setAttribute("href", "");
					document.getElementById("link").innerHTML = "";
				}

				source = detailObject.source;
				if(source != "") {
					document.getElementById("image").style.cursor = "";
					document.getElementById("image").onmouseover = function() {
																														if(isIE6 || isIE7 || isIE8)
																															document.getElementById("image").style.filter = "alpha(opacity=60)";
																														else
																															this.style.opacity = 0.8;
																													};
					document.getElementById("image").onmouseout = function() {
																														if(isIE6 || isIE7 || isIE8)
																															document.getElementById("image").style.filter = "alpha(opacity=100)";
																														else
																															this.style.opacity = 1.0;
																													};

					document.getElementById("image").onclick = function() {
																									document.getElementById("show").style.visibility = "visible";
																									document.getElementById("movie").style.width = movie_width + "px";
																									document.getElementById("movie").style.height = movie_height + "px";
																								};
				}
				else {
					document.getElementById("image").style.cursor = "auto";
					document.getElementById("image").onclick = "";
					document.getElementById("image").onmouseover = "";
					document.getElementById("image").onmouseout = "";
				}
			}

			document.getElementById("caption").style.top = (detail.offsetHeight - document.getElementById("caption").offsetHeight) / 2 + "px";
			document.getElementById("caption").style.left = (detail.offsetWidth - document.getElementById("caption").offsetWidth) / 2 + "px";
			document.getElementById("image").style.marginTop = (document.getElementById("caption").offsetHeight - document.getElementById("image").offsetHeight) / 2 + "px";
			document.getElementById("description").style.marginTop = (document.getElementById("caption").offsetHeight - document.getElementById("description").offsetHeight) / 2 + "px";

			counter = 0;
			timeId = setInterval("logo_mover(" + config.from + ", " + config.to +  ", " + config.progress + ")", config.Interval);
		}
	}
}

function logo_mover(from, to, progress) {

	var first = 5;
	var margin = 20;
	var margin2 = 50;
	var margin3 = 60;

	counter++;
	if(counter < first)	progress = 5;

	if(from < to) {
		if(logo_bottom_set_height - logo_set_height <= margin)
			progress = 1;
		else if(logo_bottom_set_height - logo_set_height <= margin2)
			progress = 4;
		else if(logo_bottom_set_height - logo_set_height <= margin3)
			progress = 8;
		else if(logo_bottom_set_height - (logo_set_height + progress) <= margin2)
			progress = (logo_bottom_set_height - logo_set_height) - margin3;

		logo_set_height += progress;

		if(logo_set_height >= logo_bottom_set_height) {
			clearInterval(timeId);
			logo_set_height = logo_bottom_set_height;

			if(source != "")
				document.getElementById("movie").setAttribute("src", source);

			contents.style.visibility = "hidden";
			members.style.visibility = "hidden";
			document.getElementById("logo_img").style.cursor = "pointer";
			isAnimating = false;
		}
	}
	else {
		if(logo_set_height - logo_top_set_height <= margin)
			progress = 1;
		else if(logo_set_height - logo_top_set_height <= margin2)
			progress = 4;
		else if(logo_set_height - logo_top_set_height <= margin3)
			progress = 8;
		else if((logo_set_height - progress) - logo_top_set_height <= margin3)
			progress = (logo_set_height - logo_top_set_height) - margin3;

		logo_set_height -= progress;

		if(logo_set_height <= logo_top_set_height) {
			clearInterval(timeId);
			logo_set_height = logo_top_set_height;

			var showBrockHeight = (isAbout) ? members.offsetHeight : contents.offsetHeight;
			if(logo.offsetHeight + 30 + showBrockHeight  < getBrowserHeight())	//30はlogoのマージン
				wrapper.style.overflow = "hidden";
			else
				wrapper.style.overflow = "";

			document.getElementById("logo_img").style.cursor = null;

			if(only_first) {
				contents.style.opacity = opacity;
				contents.style.visibility = "visible";

				timeId2 = setInterval("first_animation()", 10);

				only_first = false;
			}
			isAnimating = false;
		}
	}

	logo.style.top = logo_set_height + "px";
	detail.style.top = (logo_set_height - detail_logo_diff) + "px";
	news_detail.style.top = (logo_set_height - detail_logo_diff) + "px";

	if( ! only_first ) {
		contents.style.top = (logo_set_height + content_logo_diff) + "px";
		members.style.top = (logo_set_height + content_logo_diff) + "px";
	}
}

function dissolve() {
	var boundary = 0.5;
	var increment = 0.02;

	opacity += increment;

	members.style.opacity = 1 - opacity;

	if(opacity >= (1 + boundary)) {
		clearInterval(timeId2);
		members.style.visibility = "hidden";
	}
	else if(opacity > boundary)
		contents.style.opacity = opacity - boundary;
}

function first_animation() {
	contents.style.opacity = opacity;
	opacity += 0.02;
	if(opacity >= 1)
		clearInterval(timeId2);
}

function onResize() {
	var browserHeight = (getBrowserHeight() < browser_min_height) ? browser_min_height : getBrowserHeight();

	wrapper.style.height = browserHeight + "px";

	//ボトムの高さ
	logo_bottom_set_height = browserHeight - (logo.offsetHeight + 30);	//30は上のマージン分

	if(only_first) {
		logo_set_height =  (browserHeight - logo.offsetHeight) / 2;
		logo.style.top = logo_set_height + "px";
	}
	else if(logo_set_height != logo_top_set_height && !only_first) {
		logo_set_height = logo_bottom_set_height;
		logo.style.top = logo_set_height + "px";

		contents.style.top = (logo_set_height + content_logo_diff) + "px";
		members.style.top = (logo_set_height + content_logo_diff) + "px";
	}

	document.getElementById("show").style.paddingTop = ((browserHeight - (logo.offsetHeight + 40) - movie_height) / 2) + "px";
	detail_logo_diff = Math.abs((((browserHeight - logo.offsetHeight - detail.offsetHeight) / 2) + detail.offsetHeight));
	detail.style.top = (logo_set_height - detail_logo_diff) + "px";
}

function getElementsByClassName(className, tag){
	var _tags = document.getElementsByTagName(tag);
	var _i, _num = _tags.length;
	var _targetTags = [];

	for(_i = 0; _i < _num; _i++) {
		if(isIE6 || isIE7) {
			if(_tags[_i].getAttribute('className') === className)
				_targetTags.push(_tags[_i]);
		}
		else {
			if(_tags[_i].getAttribute('class') === className)
				_targetTags.push(_tags[_i]);
		}
	}
	return _targetTags;
}

function getBrowserHeight() {
	if ( window.innerHeight )
		return window.innerHeight;
	else if ( document.documentElement && document.documentElement.clientHeight != 0 )
		return document.documentElement.clientHeight;
	else if ( document.body )
		return document.body.clientHeight;
	return 0;
}

if(window.addEventListener)
	document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 300); }, false);
else
	window.attachEvent('onload', loaded);
