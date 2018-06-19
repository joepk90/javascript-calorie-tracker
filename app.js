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
    },
    getItemByID: function(id) {
      let found = null;

      // Loop Through Items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories
          found = item;
        }
      })
      return found;
    },
    deleteItem: function(id) {
      console.log(data.items);
      // Get the id's
      const ids = data.items.map(function(item) {
        return item.id;
      });
        console.log(ids);
      // Get Index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);

    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Count Total Calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set Total Calories
      data.totalCalories = total;

      return data.totalCalories;
    }
  }
})();





// UI CONTROLLER
const UIController = (function() {

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
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
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
          `
        }

      })
    },
    deleteListItem: function(id) {

      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();

    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = itemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = itemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    removeItems: function() {
      // Remove all Items
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List Into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      })
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UIController.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

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

    // Disable Submit On Enter
    document.addEventListener('keypress', function(e) {

      // Disable Enter Key (13 = Enter Key)
      // e.which is add for older browser compatibility
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Icon Click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //TODO: Back Button creates a page reload
    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

    // Delete Item Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

    // Get Total Calories
    const totalCalories = itemController.getTotalCalories();

    // Update Total Calories UI
    UIController.showTotalCalories(totalCalories);

    // Clear Fields
    UIController.clearInput(e);

    e.preventDefault();
  }

  // Item Edit Click
  const itemEditClick = function(e) {

    if(e.target.classList.contains('edit-item')) {
      // Get List Item ID
      const listId = e.target.parentNode.parentNode.id;
      // console.log(listID.id);

      // Break Into An Array
      const listIdArray = listId.split('-');

      // Get The ID
      const id = parseInt(listIdArray[1]);


    // Get Item
    const itemToEdit = itemController.getItemByID(id);

    // Set Current Item
    itemController.setCurrentItem(itemToEdit);

    // Add Item To Form
    UIController.addItemToForm();

    }

    e.preventDefault();
  }

  //Update Item Submit
  const itemUpdateSubmit = function(e) {

    // Get Item input
    const input = UIController.getItemInput();

    // Update Item
    const updatedItem = itemController.updateItem(input.name, input.calories);

    // Update UI
    UIController.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = itemController.getTotalCalories();

    // Update Total Calories UI
    UIController.showTotalCalories(totalCalories);

    UIController.clearEditState();

    e.preventDefault();
  }

  // Delete Button Event
  const itemDeleteSubmit = function(e) {

    console.log('test');

    // Get Current Item
    const currentItem = itemController.getCurrentItem();

    // Delete from the Data Structure
    itemController.deleteItem(currentItem.id);

    // Delete Item from UI
    UIController.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = itemController.getTotalCalories();

    // Update Total Calories UI
    UIController.showTotalCalories(totalCalories);

    UIController.clearEditState();

    e.preventDefault();
  }

  // Clear Items Event
  const clearAllItemsClick = function() {

    // Delete All Items from Data Structure
    itemController.clearAllItems()

    // Get Total Calories
    const totalCalories = itemController.getTotalCalories();

    // Update Total Calories UI
    UIController.showTotalCalories(totalCalories);

    // Remove from UI
    UIController.removeItems();

    // Hide List
    UIController.hideList();

  }

  // Public Methods
  return {
    init: function() {

      // Clear Edit State
      UIController.clearEditState();

      // Fetch items from data structure
      const items = itemController.getItems();
      console.log('Initializing App');
      console.log(items);

      if(items.length === 0) {
        UIController.hideList();
      } else {
        UIController.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = itemController.getTotalCalories();

      // Update Total Calories UI
      UIController.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    }
  }

})(itemController, UIController);


App.init();
