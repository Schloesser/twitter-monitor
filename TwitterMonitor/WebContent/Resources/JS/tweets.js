var count = 0;
var first = true;
var tweetsfield;
var searchfield;

var language = "all";
var keywords_field = [];
var blacklist_field = [];

/**
 * By passing an array of tweet objects this method creates a tweet-container for all tweets.
 * In addition, this method saves the array that is passed the first time during runtime 
 * in a global variable called "tweetsfield". That makes it possible to have an original array. 
 * @param data
 */
function updateTweets(data) {
	
	if (first) {
		tweetsfield = $.extend(true, [], data);
		searchfield = $.extend(true, [], data);
		first = false;
	} else {
		$("#tweet_panel").remove();
		var tweet_panel = document.createElement("div");
		tweet_panel.setAttribute("id", "tweet_panel");
		$("#page").append(tweet_panel);
	}
	
	count = 0;

	$("#tweet_panel").html("");
	for (var i = 0; i < data.tweets.length; i++) {
		var tweet = data.tweets[i];

		// create a tweet_panel div
		var tweet_div = document.createElement("div");
		tweet_div.setAttribute("class", "tweet_panel");
		tweet_div.setAttribute("id", "tweet".concat(count));
		$("#tweet_panel").append(tweet_div);

		// create a tweet_line_div
		if (i != 0) {
			var line = document.createElement("div");
			line.setAttribute("class", "line");
			tweet_div.appendChild(line);
		} else {
			tweet_div.setAttribute("style", 'margin-top:200px;');
		}
		//create a tweet_pic_div 
		if (tweet.image)
		{	
			var pic = tweet.image;	
		
			var pic_div = document.createElement("div");
			pic_div.setAttribute("class","tweet_pic ");
			pic_div.setAttribute("id","pic".concat(count));
			pic_div.setAttribute("style",'display:block;background-image:url('+pic+')');
			tweet_div.appendChild(pic_div);
		}

		// create a tweet_data_div
		var tweet_data = document.createElement("div");
		tweet_data.setAttribute("class", "tweet_data");
		tweet_div.appendChild(tweet_data);
		if (tweet.image) {
			tweet_data
					.setAttribute("style",
							'border-top-right-radius: 0px;border-top-left-radius: 0px;');
		}

		// create a tweet_author-pic_div and passing author_div from JSON
		var tweet_author_pic = document.createElement("div");
		tweet_author_pic.setAttribute("class", "tweet_author_pic");
		tweet_author_pic.setAttribute("style", 'background-image:url('
				+ tweet.pictureUrl + ')');
		tweet_data.appendChild(tweet_author_pic);

		// create a tweet_author-name_div and passing author_div from JSON
		var tweet_author_name = document.createElement("div");
		tweet_author_name.setAttribute("class", "tweet_author_name");
		tweet_author_name.innerHTML = tweet.name;
		tweet_data.appendChild(tweet_author_name);

		if (tweet.place != "") {
			// create a tweet_place_div and passing author_div from JSON
			var tweet_place = document.createElement("div");
			tweet_place.setAttribute("class", "tweet_place");
			tweet_place.innerHTML = "@".concat(tweet.place);
			tweet_author_name.appendChild(tweet_place);
		}

		// create a tweet_time_div and passing Tweet_time from JSON
		var tweet_time = document.createElement("div");
		tweet_time.setAttribute("class", "tweet_time");
		tweet_time.innerHTML = tweet.createdAt;
		tweet_data.appendChild(tweet_time);

		// create a tweet_text_div and passing Tweet_text from JSON
		var tweet_text = document.createElement("div");
		tweet_text.setAttribute("class", "tweet_text");
		var highlighted = tweet.text;
		for (var k = 0; k < keywords_field.length; k++) {
			highlighted = highlight(highlighted,keywords_field[k]);			
		}
		tweet_text.innerHTML = highlighted;
		tweet_div.appendChild(tweet_text);
		
//		// create a tweet_prio_div and passing Tweet_text from JSON
//		var tweet_prio = document.createElement("div");
//		tweet_prio.setAttribute("class", "tweet_prio");
//		tweet_prio.innerHTML = tweet.priority;
//		tweet_div.appendChild(tweet_prio);
				
		count++;
	}
	
	var welcome_text = "Es werden " + count + " Tweets angezeigt";
	document.getElementById("welcome_text").innerHTML=welcome_text;
	
}

/**
 * 
 * @param pic_id
 * @returns
 */
function getPicsUrls(pic_id) {
	return tweetsfield.tweets[pic_id].urls;
}

function getPicUrl(pic_id) {

	var img = document.getElementById(pic_id);
	var style = img.currentStyle || window.getComputedStyle(img, false);

	return style.backgroundImage.slice(4, -1).replace(/"/g, "");

}

function search() {
		
	searchfield = null;
	searchfield = $.extend(true, [], tweetsfield);
	var keyString = $('#search').val();
	
	if (!(keyString == "")) {
		
		for (var i = 0; i < searchfield.tweets.length; i++) {
			var tweet = searchfield.tweets[i];
			
			if (!(tweet.text.includes(keyString))) {
				searchfield.tweets.splice(i, 1);
				i = -1;
			}
		}
		
		sort();
//		updateTweets(searchfield);

	} else {
		sort();
//		updateTweets(tweetsfield);
	}
}

function sort()
{
	if ($( "#sortOption option:selected" ).text() == "-Bitte wählen-")
	{
		updateTweets(searchfield);
		return;
	}
	searchfield.tweets.sort(function(a, b){

		 if($( "#sortOption option:selected" ).text() == "Zeit")
			{
			if(a.createdAt > b.createdAt) return -1;
			if(a.createdAt < b.createdAt) return 1;
				return 0;
		}else if($( "#sortOption option:selected" ).text() == "Priorität")
			{
			if(a.priority > b.priority) return -1;
			if(a.priority < b.priority) return 1;
				return 0;
		}
	})
	
	updateTweets(searchfield);
}

function highlight(text,string)
{
		var tempstring = string.charAt(0).toUpperCase() + string.slice(1);
		var highlighted = text.split(tempstring).join("<span>".concat(tempstring).concat("</span>"));
		
		tempstring = string.charAt(0).toLowerCase() + string.slice(1);
		highlighted = highlighted.split(tempstring).join("<span>".concat(tempstring).concat("</span>"));
		
		tempstring = tempstring.toLowerCase();
		highlighted = highlighted.split(tempstring).join("<span>".concat(tempstring).concat("</span>"));
		
		tempstring = tempstring.toUpperCase();
		highlighted = highlighted.split(tempstring).join("<span>".concat(tempstring).concat("</span>"));
		return highlighted;
}

function deep() {	
	
	var searchString = $('#search').val();	
	
	if ( searchString.length > 0) {						
		var requestString = "/TwitterMonitor/deepSearch" + "?search=" + searchString + "&lang=" + language;
		first=true;
		$.getJSON(requestString, preLoad);
	}
	else {
		if ( confirm("Wollen Sie wirklich alle Tweets holen ?") ) {
			var requestString = "/TwitterMonitor/deepSearch" + "?search=" + "&lang=" + language;
			first=true;
			$.getJSON(requestString, preLoad);
		}
	}
}

function changeLanguage() {
	
	if ($( "#languageOption option:selected" ).text() == "-Alle-")
		language = "all";
	else if ($( "#languageOption option:selected" ).text() == "Deutsch")
		language = "de";
	else if ($( "#languageOption option:selected" ).text() == "Englisch")
		language = "en";
	
	var requestString = "/TwitterMonitor/getTweets" + "?lang=" + language;
	first=true;
	$.getJSON(requestString,preLoad);
}

function preLoad(data) {
	updateTweets(data);
	search();
	sort();
}

function addSelectionAsKeyword() {
	var newKey = window.getSelection().toString();
	
	if (isNewKeyword(newKey) && (newKey.trim() != "") && (keywords_field.length < 10) && (newKey.length < 20))
	{	
		var keyword = {
				"keyword" : newKey,
				"priority" : 1,
				"active" : true,
				"positive" : true
		}
		
		$.ajax({
		       type: "POST",
		       contentType : 'application/json; charset=utf-8',
		       dataType : 'json',
		       url: "/TwitterMonitor/changePriority",
		       data: JSON.stringify(keyword), 
		       success :function (result) {
		    		keywords_field.push(newKey);
		    	   	var requestString = "/TwitterMonitor/getTweets" + "?lang=" + language;
		    		first=true;
		    		$.getJSON(requestString, preLoad);
		       }
		   }); 
	}
}

function setKeywords(data) {
	for (i=0; i<data.keywords.length; i++) {
		keywords_field.push(data.keywords[i].keyword);
	}
}

function addSelectionToBlacklist() {
	var newKey = window.getSelection().toString();
	
	if (isNewKeyword(newKey) && (newKey.trim() != "") && (keywords_field.length < 10) && (newKey.length < 20))
	{	
		var keyword = {
				"keyword" : newKey,
				"priority" : 1,
				"active" : true,
				"positive" : false
		}
		
		$.ajax({
		       type: "POST",
		       contentType : 'application/json; charset=utf-8',
		       dataType : 'json',
		       url: "/TwitterMonitor/changePriority",
		       data: JSON.stringify(keyword), 
		       success :function (result) {
		    		blacklist_field.push(newKey);
		    	   	var requestString = "/TwitterMonitor/getTweets" + "?lang=" + language;
		    		first=true;
		    		$.getJSON(requestString, preLoad);
		       }
		   }); 
	}
}

function setBlacklist(data) {
	for (i=0; i<data.keywords.length; i++) {
		blacklist_field.push(data.keywords[i].keyword);
	}
}

function isNewKeyword(newKey)
{	
	for(var i=0;i<keywords_field.length;i++)	{		
		if (newKey == keywords_field[i].keyword) {				
			    return false;
		}
	}	
	for(var i=0;i<blacklist_field.length;i++) {		
		if (newKey == blacklist_field[i].keyword) {				
			    return false;
			}
	}	
	return true;
}