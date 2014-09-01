chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);



		myeatclubPlugin.init();

	}
	}, 10);
});

var myeatclubPlugin = (function() {

    function init() {
        sort();

        //init MutationObserver
        var target = document.getElementById('menu-main');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mut){
                if (mut.addedNodes.length > 1) {
                    sort();
                }
            });
        });
        observer.observe(target, {childList:true});
    }

    function sort() {
        var vList = document.querySelectorAll('.menu-item [data-content^="Ve"]');
        vList = Array.prototype.slice.call(vList);

        // get the item we want to sort
        vList = vList.map(function(v){
            return v.parentNode.parentNode.parentNode.parentNode; //TODO: Make this more robust
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

    return {
        init: init
    };
})();