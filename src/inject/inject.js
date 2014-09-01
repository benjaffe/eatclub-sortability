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
            {name:'Low-Carb',url:'low_carb'},
            {name:'Paleo',url:'paleo'}
        ].map(function(obj){
            return '<li class="icon-sortable">' + obj.name + '</li>';
        }).join('');
        htmlStr = '<a>Sorting Options <ul>' + htmlStr + '</ul></a>';
        liElem.innerHTML = htmlStr;
    }

    var sortOrder = ['vegan','vegetarian','big_portion'].reverse();
    var listItems;

    function sort() {
        listItems = Array.prototype.slice.call(document.querySelectorAll('.menu-item'));
        sortOrder.forEach(sortBy);
    }
    function sortBy(sortParam) {
        // alert();
        console.log('sorting by ' + sortParam);

        listItems = listItems.mergeSort(function(item){
            if (item.querySelector('[src*="'+sortParam+'"]')) {
                console.log('found ' + sortParam);
                return 0;
            } else {
                return 1;
            }
        });
        updateListItemOrder();
    }

    function updateListItemOrder() {
        console.log('updating list',listItems.map(function(item){return item.querySelectorAll('.popover-target')}));
        var parent = document.getElementById('menu-main');
        console.log(listItems);
        listItems.forEach(function(item) {
            parent.appendChild(item);
        });
    }

    return {
        init: init
    };
})();


// Add stable merge sort to Array and jQuery prototypes
// Note: We wrap it in a closure so it doesn't pollute the global
//       namespace, but we don't put it in $(document).ready, since it's
//       not dependent on the DOM
(function() {

  // expose to Array and jQuery
  Array.prototype.mergeSort = mergeSort;

  function mergeSort(compare) {

    var length = this.length,
        middle = Math.floor(length / 2);

    if (!compare) {
      compare = function(left, right) {
        if (left < right)
          return -1;
        if (left == right)
          return 0;
        else
          return 1;
      };
    }

    if (length < 2)
      return this;

    return merge(
      this.slice(0, middle).mergeSort(compare),
      this.slice(middle, length).mergeSort(compare),
      compare
    );
  }

  function merge(left, right, compare) {

    var result = [];

    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
  }
})();