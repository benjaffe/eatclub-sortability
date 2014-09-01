chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var vList = document.querySelectorAll('.menu-item [data-content^="Ve"]');
        vList = Array.prototype.slice.call(vList);
        vList = vList.map(function(v){
            return v.parentNode.parentNode.parentNode.parentNode;
        });
        vList.forEach(function(v) {
            var parent = v.parentNode;
            var first = parent.children[0];
            parent.insertBefore(v, first);

            //remove manually-set margin-right
            Array.prototype.slice.call(parent.children).forEach(function(elem){
                elem.style.marginRight = '';
            });
        });

	}
	}, 10);
});