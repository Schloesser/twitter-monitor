<!-- IMPORTS -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>

<html>

<!------------------------- META TAGS ---------------------------------------------->
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<link rel="stylesheet" type="text/css"
	href="Resources/CSS/showTweets.css">
<link rel="stylesheet" type="text/css" href="Resources/CSS/header.css">

<script type="text/javascript" src="Resources/JS/jquery-2.1.4.js"></script>
<script type="text/javascript" src="Resources/JS/header.js"></script>
<script type="text/javascript" src="Resources/JS/tweets.js"></script>

<title>TwitterMonitor - Tweets</title>
</head>

<body style="margin: 0 auto;">
	<!-------------------------- HEADER ------------------------------------------------->

	<div id="header"></div>

	<nav>
		<div id="logo"></div>
		<ul>
			<li><a href="${pageContext.request.contextPath}/showTweets">Tweets</a></li>
			<li><a href="${pageContext.request.contextPath}/keywords">Keywords</a></li>
			<li><a href="${pageContext.request.contextPath}/settings">Einstellungen</a></li>
			<li><a href="${pageContext.request.contextPath}/instructions">Anleitung</a></li>
			<li><a href="${pageContext.request.contextPath}/logout">Logout</a></li>
		</ul>


		<ul2 id="ul2" onclick="showMenu()">
		<li><a href="${pageContext.request.contextPath}/showTweets">Tweets</a></li>
		<li><a href="${pageContext.request.contextPath}/keywords">Keywords</a></li>
		<li><a href="${pageContext.request.contextPath}/settings">Einstellungen</a></li>
		<li><a href="${pageContext.request.contextPath}/instructions">Anleitung</a></li>
		<li><a href="${pageContext.request.contextPath}/logout">Logout</a></li>
		</ul2>
	</nav>

	<!-------------------------- BODY --------------------------------------------------->
	<div id="page">
		<!--############# Side Bar ####################-->
		<div id="sidebar">

			<div id="username">Hallo ${pageContext.request.userPrincipal.name}</div>
			<div id="welcome_text">Tweets werden geladen ...</div>

			<button id="refreshButton" onclick="onLoad()">Tweets aktualisieren</button>

			<div>
				<label for="search">Search</label> <input id="search"
					onkeyup="search()" type="search">
				<button id="deepSearchButton" onclick="deep()">Deep Search</button>
			</div>
			<script>
				function deep() {					
					var searchString = $('#search').val();					
					if ( searchString.length > 3) {						
						var requestString = "<c:url value="/deepSearch"/>" + "?search=" + searchString;
						first=true;
						$.getJSON(requestString, updateTweets);
					}
				}
			</script>

			<div>
				<label for="sort">Sort</label> <select id="sortOption" onChange="sort()">
					<option>-Bitte wählen-</option>
					<option>Priorität</option>
					<option>Zeit</option>
				</select>
			</div>

		</div>

		<!--############# Tweet Panel ##################-->
		<div id="tweet_panel"></div>

		<script type="text/javascript">
			function onLoad() {
				$.getJSON("<c:url value="/getTweets"/>", updateTweets);
			}
			onLoad();
		</script>
		
	</div>

	<!----------------------------------------------------------------------------------->
</body>
</html>
