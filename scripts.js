var rate_album = {
	init: function(config) {
		this.config = config;

		this.setupTemplates();
		this.bindEvents();
	},

	setupTemplates: function() {
		this.config.albumTemplate = Handlebars.compile(this.config.albumTemplate);
	},

	bindEvents: function() {
		var self = rate_album;

		// on h1 click, show intro text and hide siblings
		$("h1 a").on('click', function(e) {
			$(".main #intro").fadeIn(200).siblings().hide();
			$("nav a").css("color", "#242424")
			e.preventDefault();
		});

		// a click on submit, browse or search hides siblings and fades in the selected element
		// also does some css color changing
		$("nav a").on('click', function(e) {
			var which = $(this).text();
			$(this).css("color", "#FF5D40");
			$(this).parent().siblings().children().css("color", "#242424");
			if (which == "Submit") {
				self.config.submitForm.siblings().hide();
				self.config.submitForm.fadeIn(200);			
			}
			else if (which == "Browse") {
				self.config.albumList.siblings().hide();
				self.config.albumList.fadeIn(200);
				self.displayBrowse();				
			}
			else if (which == "Search") {
				self.config.searchForm.siblings().hide();
				self.config.searchForm.fadeIn(200);		
			}
		});

		// do a POST request to submit an album
		$("#submit_album input[type='submit']").on('click', function(e) {
			$.post(
				"submit.php",
				self.config.submitForm.serialize(),
				function(data) {
					self.config.submitForm.append(data);
				}
			);
			e.preventDefault();
		});

		// do a POST request to search for an album
		$("#search_album input[type='submit']").on('click', function(e) {

			self.config.albumList.empty();
			self.config.albumList.show();

			$.ajax({
				url: 'results.php',
				type: 'POST',
				data: self.config.searchForm.serialize(),
				dataType: 'json',
				success: function(results) {
					if (results[0]) {
						// bind results to albumTemplate, and append the template to the album_list html						
						self.config.albumList.append(self.config.albumTemplate(results));
					} else {
						self.config.albumList.append("<li>No results</li>");
					}
				}
			});
			e.preventDefault();
		});
	},

	// do a POST request for 10 results
	// a click on "more" link should also display more results
	displayBrowse: function() {
		var self = rate_album;

		$.ajax({
			url: 'results.php',
			type: 'POST',
			data: {browse:10},
			dataType: 'json',
			success: function(results) {
				$(".album_list").empty();
				if (results[0]) {
					// bind results to albumTemplate, and append the template to the album_list html
					self.config.albumList.append(self.config.albumTemplate(results));
				} else {
					self.config.albumList.append("<li>No results</li>");
				}
			}
		});
	}
}

rate_album.init({
	submitForm: $("#submit_album"),
	searchForm: $("#search_album"),
	albumList: $("ul.album_list"),
	albumTemplate: $(".album_list #album_template").html()
});