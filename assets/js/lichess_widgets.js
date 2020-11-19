// lichess widget code. Based on https://rubenwardy.com/lichess_widgets/lichess_widgets.js

var lichess_widgets = (function() {
	function fetchJson(url, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var data = JSON.parse(this.responseText);
				callback(data);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	var cache = {}
	var callbacks = {}
	function getAuthor(name, callback) {
		if (cache[name]) {
			callback(cache[name]);
		} else if (callbacks[name]) {
			callbacks[name].push(callback);
		} else {
			callbacks[name] = [ callback ];

			fetchJson("https://en.lichess.org/api/user/" + name, function(data) {
				cache[name] = data;
				for (var i = 0; i < callbacks[name].length; ++i) {
					callbacks[name][i](data);
				}
				callbacks[name] = null;
			});
		}
	}

	function make_online(id) {
		var ele = document.getElementById(id);
		ele.className = ele.className + " lichess_online";
		ele.getElementsByTagName('img')[0].src = "https://rubenwardy.com/lichess_widgets/lichess_online.png";
	}

	function capitalize(inp) {
		return inp.charAt(0).toUpperCase() + inp.slice(1);
	}

	var serial = 0;
	return {
		my_profile_scores: function(theme, author, text) {
			serial++;
			var id = serial;
			text = "Play me on Lichess.org <br> &#9814 &#9816 &#9815 &#9813 &#9812 &#9815 &#9816 &#9814";
			var tmp = "<a id=\"lichess_widget_" + id + "\" class=\"lichess_widget lichess_theme_" + theme;
			tmp    += "\" href=\"https://lichess.org/@/" + author + "\">";
			tmp    += "<span>" + text + "</span></a>";
			document.write(tmp);
			getAuthor(author, function(data) {
				if (data.online)
					make_online("lichess_widget_" + id);

				var res = text + "<br>Rapid | <b>" + data.perfs.rapid.rating;
				res    += "<br></b>Blitz | <b>" + data.perfs.blitz.rating + "</b>";
				res    += "<br></b>Bullet | <b>" + data.perfs.bullet.rating + "</b>";

				document.getElementById("lichess_widget_" + id).getElementsByTagName('span')[0].innerHTML = res;
			});
		},

	}
})();
