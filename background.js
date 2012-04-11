var url_base = "http://www.iciba.com/";

chrome.omnibox.onInputChanged.addListener(function(text, suggestionsCallback){
	chrome.omnibox.setDefaultSuggestion({
		description: 'Translate: ' + text
	});
	if(text != ""){
		console.log("searching: " + text);
		$.get(url_base + text, function(data){
			var html = fetch_html(data);
			//console.log(html);
			var html_obj = $(html);
			//console.log(html_obj);
			var suggest_results = [];
			html_obj.find("div#dict_main div.simple  div.dict_content").first().find("div.group_prons div.group_pos p").each(function(){
				var word_type = $(this).find("strong.fl").text().replace(/[\t\r\n]+/g, "");
				var word_meaning = $(this).find("span.label_list").text().replace(/[\t\r\n]+/g, "");
				var desc = text + " - " + word_type + " " + word_meaning;
				//console.log(desc);
				if(chrome.omnibox.styleMatch){
					suggest_results.push({
						content: text,
						description: desc,
						descriptionStyles: [chrome.omnibox.styleMath(0, desc.length)]
					});
				}else{
					suggest_results.push({
						content: text,
						description: '<match>' + desc + '</match>'
					});
				}
			});
			console.log(suggest_results);
			if(suggest_results.length > 0){
				chrome.omnibox.setDefaultSuggestion({
					description: suggest_results[0].description
				});
				suggest_results.shift();
			}
			suggestionsCallback(suggest_results);
		});
	}
});

/*
chrome.omnibox.onInputStarted.addListener(function(){
	chrome.omnibox.setDefaultSuggestion({
		description: 'Translate: '
	});
});

chrome.omnibox.onInputCancelled.addListener(function(){
	chrome.omnibox.setDefaultSuggestion({
		description: 'Translate'
	});
});
*/

chrome.omnibox.onInputEntered.addListener(function(text){
	var url = url_base + text;
	chrome.tabs.create({
		'url': url
	});
});
