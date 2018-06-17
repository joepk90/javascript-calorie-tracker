// SORAGE CONTROLLER


// ITEM CONTROLLER
const itemController = (function() {
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 300},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0;
      }

      // Calories T Number
      calories = parseInt(calories);

      // Create New Item
      newItem = new Item(ID, name, calories);

      // Add New Item to Items Array
      data.items.push(newItem);

      return newItem;
    },
    logData: function(){
      return data;
    }
  }
})();





// UI CONTROLLER
const UIController = (function() {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    ItemCaloriesInput: '#item-calories'
  }

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
          <li id="item-${item.id}" class="collection-item">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>
        `;
      });
      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.ItemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the List
        document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');

      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.ItemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    getSelectors: function() {
       return UISelectors;
    }
  }

})();





// APP CONTROLLER
const App = (function(itemController, UIController) {

  // Load Event Listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UIController.getSelectors();

    // Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  // Add Item Submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UIController.getItemInput();

    // Check name and calorie inputs are populated
    if(input.name !== '' && input.calories !== '') {
      const newItem = itemController.addItem(input.name, input.calories);
      // Add Item to UI list
      UIController.addListItem(newItem);
    }

    // Clear Fields
    UIController.clearInput();

    e.preventDefault();
  }


  // Public Methods
  return {
    init: function() {

      // Fetch items from data structure
      const items = itemController.getItems();
      console.log('Initializing App');
      console.log(items);

      if(items.length === 0) {
        UIController.hideList();
      } else {
        UIController.populateItemList(items);
      }



      // Load Event Listeners
      loadEventListeners();
    }
  }

})(itemController, UIController);


App.init();
