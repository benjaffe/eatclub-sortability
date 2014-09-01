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
        addUI();
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

    function addUI () {
        var ulElem = document.querySelector('.ddmenu > ul');
        var liElem = ulElem.appendChild(document.createElement('li'));
        var htmlStr = [
            {name:'Gluten-Free',url:'gluten_free'},
            {name:'Vegan',url:'vegan'},
            {name:'Spicy',url:'spicy'},
            {name:'Vegetarian',url:'vegetarian'},
            {name:'Nuts',url:'nuts'},
            {name:'Spicy',url:'spicy'},
            {name:'Big-Portion',url:'big_portion'},
            {name:'Low-Carb',url:'low_carb'}
        ].map(function(obj){
            return '<li class="icon-sortable">' + obj.name + '</li>';
        }).join('');
        htmlStr = '<a>Sorting Options <ul>' + htmlStr + '</ul></a>';
        liElem.innerHTML = htmlStr;
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