var todoApp = (function() {
  var ENTER_KEY_CODE = 13;

  function addTask() {
    var input = document.getElementById('new_todo');
    var deadline = document.getElementById('deadline');

    if (input.value === "") {
      alert("To add task you should give it some name");
      return;
    } 
    
    if (deadline.value === "") {
      alert("To add task you should give it some deadline");
      return;
    } 

    addTodoToDOM();

    addTodoToLocalStorage();

    clearInputFields();
  }

  function addTodoToDOM() {
    var input = document.getElementById('new_todo');
    var li = document.createElement('li');
    var textEl = document.createElement('span');
    var textVal = document.createTextNode(input.value);
    textEl.className = "todo-text";
    textEl.appendChild(textVal);
    li.appendChild(textEl);
    li.setAttribute('class', 'not-completed');
    document.getElementById('todos').appendChild(li);

    var removeEl = document.createElement('span');
    var removeVal = document.createTextNode("Remove");
    removeEl.className = "remove-todo";
    removeEl.appendChild(removeVal);
    li.appendChild(removeEl);

    var time_span = document.createElement('span');
    var time = document.createTextNode(deadline.value);
    time_span.className = "time";
    time_span.appendChild(time);
    li.appendChild(time_span);
    li.classList.add('todo-item');
  }

  function addTodoToLocalStorage() {
    window.localStorage.setItem('todos', document.getElementById('todos').innerHTML);
  }

  function clearInputFields() {
    document.getElementById('deadline').value = "";
    document.getElementById('new_todo').value = "";
  }

  function deadlineFilter() {
    var filter = document.getElementById('filters__deadline');
    var deadlineList = document.getElementsByClassName('todo-item');

    var today = new Date();
    var tomorrow = new Date();
    var nextWeekMonday = new Date();
    var nextWeekSunday = new Date();

    tomorrow.setDate(today.getDate() + 1);
    nextWeekMonday.setDate(
      today.getDate() +
      ((8 - today.getDay()) % 7) +
      (today.getDay() === 1 ? 7 : 0)
    );
    nextWeekSunday.setDate(today.getDate() + ((14 - today.getDay()) % 7) + 8);

    tomorrow.setHours(0, 0, 0, 0);
    nextWeekMonday.setHours(0, 0, 0, 0);
    nextWeekSunday.setHours(0, 0, 0, 0);

    for (var i = 0; i < deadlineList.length; i++) {
      var deadline = new Date(deadlineList[i].lastChild.innerText);
      deadline.setHours(0, 0, 0, 0);
      if (filter.value === 'Tomorrow') {
        deadline.getTime() == tomorrow.getTime()
          ? deadlineList[i].classList.remove('hidden')
          : deadlineList[i].classList.add('hidden');
      } else if (filter.value === 'Next week') {
        deadline.getTime() >= nextWeekMonday.getTime() &&
        deadline.getTime() <= nextWeekSunday.getTime()
          ? deadlineList[i].classList.remove('hidden')
          : deadlineList[i].classList.add('hidden');
      } else {
        deadlineList[i].classList.remove('hidden');
      }
    }
  }

  function compliteFilter() {
    var filter = document.getElementById('filters__completion');

    switch (filter.value) {
      case 'Only uncomplited':
        hideElems('completed');
        showElems('not-completed');
        break;
      case 'Only complited':
        hideElems('not-completed');
        showElems('completed');
        break;
      case 'All tasks':
        showElems('not-completed');
        showElems('completed');
        break;
      default:
        break;
    }
  }

  function hideElems(clsName) {
    var elemsToHide = document.getElementsByClassName(clsName);
    for (var i = 0; i < elemsToHide.length; i++) {
      elemsToHide[i].classList.add('hidden');
    }
  }

  function showElems(clsName) {
    var elemsToShow = document.getElementsByClassName(clsName);
    for (var i = 0; i < elemsToShow.length; i++) {
      elemsToShow[i].classList.remove('hidden');
    }
  }

  function toggleTaskCompleted(task) {
    if(task.target.tagName === 'LI') {
      task.target.classList.toggle('not-completed');
      task.target.classList.toggle('completed');
    } else if(task.target.classList.contains('remove-todo')) {
      var div = task.target.parentNode;
      div.remove();
    }
    window.localStorage.setItem('todos', document.getElementById('todos').innerHTML);
  }

  function getTodosFromLocalStorage() {
    document.getElementById('todos').innerHTML = window.localStorage.getItem('todos');
  }

  function addEventListeners() {
    document.getElementById('button__add').addEventListener('click', addTask);
    document.getElementById('filters__completion').addEventListener('change', compliteFilter);
    document.getElementById('filters__deadline').addEventListener('change', deadlineFilter);
    document.querySelector('ul').addEventListener('click', toggleTaskCompleted);
    document.addEventListener("keyup", function(event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        addTask();
      };
    });
  }

  return {
    init: function() {
      getTodosFromLocalStorage();
      addEventListeners();
    }
  }
})();

todoApp.init();