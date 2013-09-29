var rate_album = {
	init: function(config) {
		this.config = config;

		this.setupTemplates();
		this.bindEvents();
	},

	setupTemplates: function() {
		this.config.albumTemplate = Handlebars.compile(this.config.albumTemplate);

		Handlebars.registerHelper('starRating', function(results) {
			var ret = "<div id='stars'>";
			for (var i = 0; i < results.rating; i++) {
				ret += "*";
			}
			ret += "</div>";
			return new Handlebars.SafeString(ret); // do not escape the html in the template
		});
	},

	bindEvents: function() {
		var self = rate_album;

		// on h1 click, show intro text and hide siblings
		$("h1 a").on('click', function(e) {
			$(".main #intro").fadeIn(200).siblings().hide();
			$("nav a").css("color", "#BEBEBE");
			e.preventDefault();
		});

		// a click on submit, browse or search hides siblings and fades in the selected element
		// also does some css color changing
		$("nav a").on('click', function() {
			var which = $(this).text();
			$(this).css("color", "#FF5D40");
			$(this).parent().siblings().children().css("color", "#BEBEBE");
			if (which == "Submit") {
				self.config.submitForm.siblings().hide();
				self.config.submitForm.fadeIn(200);			
			}
			else if (which == "Browse") {
				self.config.albumList.siblings().hide();
				self.config.albumList.fadeIn(200);				
			}
			else if (which == "Search") {
				self.config.searchForm.siblings().hide();
				self.config.searchForm.fadeIn(200);		
			}
		});

		// on rating submit click, do a POST request to submit an album
		$("#submit_album").submit(function(e) {
			$.ajax({
				url: 'submit.php',
				type: 'POST',
				data: self.config.submitForm.serialize(),
				success: function(results) {
					self.config.submitForm.each(function() {
						this.reset();
					});
					alert(results);
				}
			});
			e.preventDefault();
		});

		// on browse nav element click, do a POST request for all ratings
		$("nav a:contains('Browse')").on('click', function() {
			$.ajax({
				url: 'results.php',
				type: 'POST',
				data: {browse:5},
				dataType: 'json',
				success: function(results) {
					self.handleDisplay(results);
				}
			});
		});			

		// on search submit click, do a POST request to search for an album
		$("#search_album").submit(function(e) {
			$.ajax({
				url: 'results.php',
				type: 'POST',
				data: self.config.searchForm.serialize(),
				dataType: 'json',
				success: function(results) {
					self.config.searchForm.each(function() {
						this.reset();
					});
					self.handleDisplay(results);
				}
			});
			e.preventDefault();
		});
	},

	// do a POST request for all results
	// then initiate the displaySubset/handleMore process
	handleDisplay: function(results) {
		var self = rate_album;

		/*var results = {
			"0" : {
				"artist":"a","album":"x","rating":5
			},
			"1" : {
				"artist":"b","album":"x","rating":5
			},
			"2" : {
				"artist":"c","album":"x","rating":5
			},
			"3" : {
				"artist":"d","album":"x","rating":5
			},
			"4" : {
				"artist":"e","album":"x","rating":5
			},
			"5" : {
				"artist":"f","album":"x","rating":5
			},
			"6" : {
				"artist":"g","album":"x","rating":5
			},
			"7" : {
				"artist":"h","album":"x","rating":5
			},
			"8" : {
				"artist":"i","album":"x","rating":5
			},
			"9" : {
				"artist":"j","album":"x","rating":5
			},
			"10" : {
				"artist":"k","album":"x","rating":5
			},
			"11" : {
				"artist":"l","album":"x","rating":5
			},
			"12" : {
				"artist":"m","album":"x","rating":5
			},
			"13" : {
				"artist":"n","album":"x","rating":5
			}
		};*/

		console.log(results);

		if (results[0]) {
			min = 0, max = 4;
			self.displaySubset(results, min, max);
			self.handleMore(results, min, max);
		}
		else {
			self.config.albumList.append("<li>No results</li>");
		}		
	},	

	// display from results[min] to results[max] in an empty albumList div
	displaySubset: function(results, min, max) {
		var self = rate_album;
		self.config.albumList.empty();
		self.config.albumList.show();

		var displaySet = {}

		for (var i = min; i <= max; i++) {
			if (results[i]){
				displaySet[i.toString()] = results[i];
			}			
		}

		self.config.albumList.append(self.config.albumTemplate(displaySet));
	},

	// facilitates viewing more results
	handleMore: function(results, min, max) {
		var self = rate_album;

		if ($("#more").length > 0) { // remove 'View more ratings' if it exists
			$("#more").remove();
		}
		if (results[max+1]) { // if there are more results, add 'View more ratings'
			self.config.albumList.append("<a id='more' href='#'>View more ratings</a>");
		}		

		$("a#more").click(function () {
			min += 5;	// shift the subset by 5
			max += 5;

			// in case we are at the last subset, adjust max
			for (var i = min; i <= max; i++) {
				if (!results[i]) { 
					max = i - 1;
					break;
				}
			}

			self.displaySubset(results, min, max);
			self.handleMore(results, min, max);
		});
	}
}

rate_album.init({
	submitForm: $("#submit_album"),
	searchForm: $("#search_album"),
	albumList: $("ul.album_list"),
	albumTemplate: $(".album_list #album_template").html()
});