chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);



		myeatclubPlugin.init();

	}
	}, 10);
});



var myeatclubPlugin = (function() {

    var sortOrder = getStorageData();
    var listItems;
    var firstTime = !localStorage.sortOrder || getStorageData().length === 0;
    var categories = [
        {name:'Gluten-Free',url:'gluten_free'},
        {name:'Vegan',url:'vegan'},
        {name:'Spicy',url:'spicy'},
        {name:'Vegetarian',url:'vegetarian'},
        {name:'Nuts',url:'nuts'},
        {name:'Big-Portion',url:'big_portion'},
        {name:'Low-Carb',url:'low_carb'},
        {name:'Paleo',url:'paleo'}
    ];
    var liElem;

    function getStorageData() {
        return localStorage.sortOrder ? JSON.parse(localStorage.sortOrder) : [];
    }

    function setStorageData(data) {
        localStorage.sortOrder = JSON.stringify(data);
    }

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
        var enabledCategories = getStorageData();
        var htmlStrList1 = '';
        var htmlStrList2 = '';

        liElem = ulElem.appendChild(document.createElement('li'));

        if (firstTime) {
            liElem.classList.add('new-feature');
        }

        categories.forEach(function(obj){
            if (enabledCategories.indexOf(obj.url) !== -1) {
                htmlStrList1 += '<li class="icon-sortable">' + obj.name + '</li>';
            } else {
                htmlStrList2 += '<li class="icon-sortable">' + obj.name + '</li>';
            }
        });

        htmlStr = '<a class="sorting-options-menu-item">Sorting Options <div class="sorting-dropdown"><ul id="sorting-options-enabled" class="sorting-options-list sorting-options-enabled">' + htmlStrList1 + '</ul><ul id="sorting-options-disabled" class="sorting-options-list">' + htmlStrList2 + '</ul></div></a>';
        liElem.innerHTML = htmlStr;

        new Sortable(document.getElementById('sorting-options-enabled'), {
            group:'earlgreyhot',
            onUpdate: categoryChangeHandler,
            onAdd: categoryChangeHandler,
            onRemove: categoryChangeHandler
        });
        new Sortable(document.getElementById('sorting-options-disabled'), {
            group:'earlgreyhot'
        });
    }

    function categoryChangeHandler(e) {
        var listItems = document.getElementById('sorting-options-enabled').children;
        sortOrder = [];
        for (var i = 0; i < listItems.length; i++) {
            var itemName = listItems[i].textContent;
            for (var j = 0; j < categories.length; j++) {
                // console.log(categories[j].name, itemName);
                if (categories[j].name === itemName) {
                    sortOrder.push(categories[j].url);
                    break;
                }
            }
        }
        sortOrder.reverse();
        setStorageData(sortOrder);
        sort();

        // since the user has used the feature, remove the new-feature class
        if (firstTime) {
            firstTime = false;
            liElem.classList.remove('new-feature');
        }
    }

    function sort() {
        listItems = Array.prototype.slice.call(document.querySelectorAll('.menu-item'));
        sortOrder.forEach(sortBy);
    }
    function sortBy(sortParam) {
        // alert();
        // console.log('sorting by ' + sortParam);

        listItems = listItems.mergeSort(function(item1,item2){
            var item1Match = !!item1.querySelector('[src*="'+sortParam+'"]');
            var item2Match = !!item2.querySelector('[src*="'+sortParam+'"]');
            if (item1Match && !item2Match) {
                return -1;
            } else if (item2Match && !item1Match) {
                return 1;
            } else {
                return 0;
            }
        });
        updateListItemOrder();
    }

    function updateListItemOrder() {
        // console.log('updating list',listItems.map(function(item){return item.querySelectorAll('.popover-target')}));
        var parent = document.getElementById('menu-main');
        // console.log(listItems);
        listItems.forEach(function(item) {
            parent.appendChild(item);//,parent.children[0]);
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