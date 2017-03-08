function getDataFromApi(searchTerm, callback, whatElse) {
	if (whatElse == undefined) {
		var settings = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				part: 'snippet',
				key: 'AIzaSyAvhrjI4uL1mw6xIsmeMdn7ttfNl_Zawcc',
				type: 'video', 
				q: searchTerm 
			},
			dataType: 'json',
			type: 'GET',
			success: callback
		};
	}
	else if (callback === pageYouTubeSearchData) {
		var settings = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				pageToken: whatElse,
				part: 'snippet',
				key: 'AIzaSyAvhrjI4uL1mw6xIsmeMdn7ttfNl_Zawcc',
				type: 'video',
				q: searchTerm 
			},
			dataType: 'json',
			type: 'GET',
			success: callback
		};
	} else if (callback === channelSearchYoutubeData) {
		var settings = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				part: 'snippet',
				key: 'AIzaSyAvhrjI4uL1mw6xIsmeMdn7ttfNl_Zawcc',
				type: 'video',
				channelID: whatElse,
				q: searchTerm 
			},
			dataType: 'json',
			type: 'GET',
			success: callback
		};
	} 
  $.ajax(settings);
}


function displayYouTubeSearchData(data) {
	var results = '<p>Click on image to play, you will be redirected to the video on youtube</p>';
  data.items.forEach(function(item){
  	results += "<div><a target='_blank' href='https://youtube.com/watch?v=" + item.id.videoId + "'><img src='" + 
     									item.snippet.thumbnails.medium.url + "' alt='search-result' class='img-responsive'></a><h2>" +
     									item.snippet.title + "</h2><h2>Channel Name: " + item.snippet.channelTitle + "</h2><h4>" + 
     									item.snippet.description + "</h4><a class='channel-search' href='#' data-channelID=" + 
     									item.snippet.channelId + ">More from this channel</a></div>";  	
  });
  results += '<button class="js-more" data-nextToken=' + data.nextPageToken + '>More Results</button>';
  $('.js-search-results').html(results);
}

function pageYouTubeSearchData(data) {
	var results = '';
	data.items.forEach(function(item){
  	results += "<div><a target='_blank' href='https://youtube.com/watch?v=" + item.id.videoId + "'><img src='" + 
     						item.snippet.thumbnails.medium.url + "' alt='search-result' class='img-responsive'></a><h2>" +
     						item.snippet.title + "</h2><h2>Channel Name:" + item.snippet.channelTitle + "</h2><h4>" + 
     						item.snippet.description + "</h4><a class='channel-search' href='#' data-channelID=" + 
     						item.snippet.channelId + ">More from this channel</a></div>";  	
  });
  
  if(data.nextPageToken !== undefined){
  	results += '<button class="js-more" data-nexttoken=' + data.nextPageToken + '>More Results</button>';
  } else {
  	results += '<p>That is it guys.</p>' 
  }

  $('.js-search-results').append(results);
}	

function channelSearchYoutubeData(data) {
	var results = '';
	data.items.forEach(function(item){
  	results += "<div><a target='_blank' href='https://youtube.com/watch?v=" + item.id.videoId + "'><img src='" + 
     						item.snippet.thumbnails.medium.url + "' alt='search-result' class='img-responsive'></a><h2>" +
     						item.snippet.title + "</h2><h2>Channel Name:" + item.snippet.channelTitle + "</h2><h4>" + 
     						item.snippet.description + "</h4></div>";  	
  });
  $('.channelDump').html(results);
}

let query = '';
let channelDump = '<div class="channelDump"></div>'

//event listeners
$('#js-search-form').submit(function(e){
	e.preventDefault();
	query = $(this).find('.js-query').val();
  getDataFromApi(query, displayYouTubeSearchData);
});

$('.js-search-results').on('click', '.js-more', function(){
	$(this).remove();
	getDataFromApi(query, pageYouTubeSearchData, $(this).data("nexttoken"));	
});

$('.js-search-results').on('click', '.channel-search', function(){
	$(this).html(channelDump);
	getDataFromApi(query, channelSearchYoutubeData, $(this).data("channelID"));
}); 

