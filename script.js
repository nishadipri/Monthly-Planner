function getMonthName(monthIndex) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[monthIndex];
}

function getWeekDayName(dayIndex) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return days[dayIndex];
}

function getNumOfWeeksOfMonth(year, monthIndex) {
  const date = new Date(year, monthIndex);

  const firstDay = new Date(date.setDate(1)).getDay();
  const totalDays = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  return Math.ceil((firstDay + totalDays) / 7);
}

function toggleModal() {
  const modal = document.querySelector('#addTaskModal');
  const span = document.querySelector('.closeModal');

  span.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function drawCalendar(year, monthIndex) {
  const numOfWeeks = getNumOfWeeksOfMonth(year, monthIndex);

  const daysPerWeeks = 7;

  const calendarContainer = document.querySelector('#daysOfMonth');

  calendarContainer.innerHTML = '';

  const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
  let runningDate = 1;

  const existingTasks = localStorage.getItem('savedTasks');

  for (let i = 0; i < numOfWeeks; i++) {
    const weekContainer = document.createElement('div');
    weekContainer.setAttribute('class', 'weekRow');

    for (let j = 0; j < daysPerWeeks; j++) {
      const dayContainer = document.createElement('div');
      dayContainer.setAttribute('class', 'dayOfWeek');

      const dayContainerHeader = document.createElement('div');
      dayContainerHeader.setAttribute('class', 'dayHeader');
      const dayContainerBody = document.createElement('div');
      dayContainerBody.setAttribute('class', 'dayBody');

      if (runningDate <= lastDayOfMonth) {
        const currentDate = new Date(year, monthIndex, runningDate).setHours(
          0,
          0,
          0,
          0
        );

        if (existingTasks) {
          const savedTasks = JSON.parse(existingTasks);

          const tasksForCurrentDate = savedTasks.filter(
            (task) => task.dueDate === currentDate
          );

          const tasksListItemsHTML = tasksForCurrentDate.map((task) => {
            const listItemNode = document.createElement('li');

            listItemNode.innerHTML = `<p>${task.name} : ${task.difficulty}`;

            const deleteTaskButton = document.createElement('button');
            deleteTaskButton.innerText = '-';
            deleteTaskButton.setAttribute('class', 'deleteTaskButton');

            deleteTaskButton.onclick = () => {
              const savedTasks = JSON.parse(existingTasks);

              const filteredTasks = savedTasks.filter((savedTask) => savedTask.index !== task.index);

              localStorage.setItem('savedTasks', JSON.stringify(filteredTasks));

              const taskDate = new Date(task.dueDate);

              drawCalendar(taskDate.getFullYear(), taskDate.getMonth());
            };

            listItemNode.appendChild(deleteTaskButton);

            return listItemNode;
          });

          if (tasksListItemsHTML.length) {
            const listNode = document.createElement('ul');
            listNode.setAttribute('class', 'tasksList');
            listNode.append(...tasksListItemsHTML);
            dayContainerBody.append(listNode);
          }
        }

        const taskButton = document.createElement('button');
        taskButton.setAttribute('class', 'taskOfTheDay');
        taskButton.innerHTML = '+';

        const runningDay = document.createElement('p');
        runningDay.setAttribute('class', 'runningDay');
        runningDay.innerText = runningDate;

        taskButton.onclick = () => {
          const modalContainer = document.querySelector('#addTaskModal');
          modalContainer.style.display = 'block';
          selectedDate = currentDate;
        };

        dayContainerHeader.append(runningDay, taskButton);

        dayContainer.append(dayContainerHeader, dayContainerBody);

        runningDate++;
      } else {
        dayContainer.classList.add('class', ['dayOfWeek', 'disabled']);
      }

      weekContainer.appendChild(dayContainer);
    }

    calendarContainer.appendChild(weekContainer);
  }
}

function drawCurrentDate(year, month) {
  const currentMonthName = getMonthName(month);

  const currentYearContainer = document.querySelector('#currentYear');
  const currentMonthContainer = document.querySelector('#currentMonth');

  currentYearContainer.innerHTML = year;
  currentMonthContainer.innerHTML = currentMonthName;
}

function createTask(e) {
  e.preventDefault();

  const form = document.forms.createTaskForm;

  const name = form['task'].value;
  const difficulty = form['difficulty'].value;
  const category = form['category'].value;
  const dueDate = selectedDate;

  const newTask = {
    name,
    difficulty,
    category,
    dueDate,
  };

  const existingTasks = localStorage.getItem('savedTasks');

  if (existingTasks) {
    const savedTasks = JSON.parse(existingTasks);
    newTask['index'] = savedTasks.length;
    savedTasks.push(newTask);
    localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
  } else {
    localStorage.setItem('savedTasks', JSON.stringify([newTask]));
  }

  form.reset();

  const modal = document.querySelector('#addTaskModal');

  modal.style.display = 'none';

  const currentDate = new Date(selectedDate);

  drawCalendar(currentDate.getFullYear(), currentDate.getMonth());

  selectedDate = undefined;
}

let selectedDate;

const currentDate = new Date();

drawCalendar(currentDate.getFullYear(), currentDate.getMonth());
toggleModal();
