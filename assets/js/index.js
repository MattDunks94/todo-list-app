document.addEventListener("DOMContentLoaded", function () {

    let input = document.getElementById("usersInput");
    // Focus on input element on page load.
    input.focus();

    let addTaskBtn = document.getElementById("addTaskBtn");
    // Adding addTask function to btn.
    addTaskBtn.addEventListener("click", addTask);

    // Task List Div.
    let taskListDiv = document.getElementById("taskListDiv");

    let alertBox = document.getElementById("alertBox");

    // Bootstrap Alerts.
    // Emtpy input value alert.
    let emptyTaskAlert = `
    <div class="alert alert-info alert-dismissible fade show w-75 mx-auto mt-2 text-center" role="alert">
        No task added! Please enter a task.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    // Task duplicate alert.
    let duplicateAlert = `
    <div class="alert alert-warning alert-dismissible fade show  w-75 mx-auto mt-2 text-center" role="alert">
        Task already exists!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>`;

    let arrayOfTasks = [];
    let uniqueTasks = [];

    // Add task function.
    function addTask() {
        // Creating all li elements.
        let [taskNameElement, priorityElement, doneElement, removeElement] = [
            document.createElement("li"),
            document.createElement("li"),
            document.createElement("li"),
            document.createElement("li")
        ];

        // Create required buttons.
        let [upBtn, importantBtn, downBtn, doneBtn, removeBtn] = [
            document.createElement("button"),
            document.createElement("button"),
            document.createElement("button"),
            document.createElement("button"),
            document.createElement("button")
        ];

        // Create individual task row, containing list elements.
        let rowUl = document.createElement("ul");
        rowUl.classList.add("list-group", "list-group-horizontal", "mt-2", "invisible-border-left");
        rowUl.append(taskNameElement, priorityElement, doneElement, removeElement);

        // Prepending tasks to taskList div. Recent task appears top of list.
        // taskListDiv.prepend(rowUl);

        // Adding custom list-item class and bootstrap class to each element.
        [taskNameElement, priorityElement, doneElement, removeElement].forEach(
            (element) => {
                element.classList.add("list-item", "w-25");
            }
        );

        // Task Name Element.
        taskNameElement.innerText = input.value;
        taskNameElement.classList.add("text-truncate");

        // Priority element
        priorityElement.append(upBtn, importantBtn, downBtn);
        priorityElement.classList.add("px-0");

        importantBtn.classList.add("mx-lg-4", "mx-4", "red-btn", "opacity-30");
        // Priority li element btns innerHTML, fontawesome icons.
        [upBtn.innerHTML, importantBtn.innerHTML, downBtn.innerHTML] = [
            '<i class="fa-regular fa-square-caret-up fa-xl" style="color: #388eff;"></i>',
            '<i class="fa-solid fa-circle-exclamation fa-xl"></i>',
            '<i class="fa-regular fa-square-caret-down fa-xl" style="color: #388eff;"></i>'
        ];

        // Adding bootstrap classes to each element.
        [upBtn, importantBtn, downBtn].forEach((button) => {
            button.classList.add("btn", "p-0");
        });

        // importantBtn click event.
        importantBtn.addEventListener("click", function () {
            this.classList.toggle("opacity-30");
            taskNameElement.classList.toggle("important-task");
            rowUl.classList.toggle("border-left-red");
            removeBtn.classList.toggle("disabled");
            // Adding/removing click event if class doesn't/does exist.
            if (removeBtn.classList.contains("disabled") === false) {
                removeBtn.addEventListener("click", removeTask);
            } else {
                removeBtn.removeEventListener("click", removeTask);
            };
            doneBtn.addEventListener("click", function () {
                taskNameElement.classList.toggle("important-task");
                rowUl.classList.toggle("border-left-red");
            });
            input.focus();
        });

        // upBtn click event listener, containing moveTaskUp function.
        upBtn.addEventListener("click", function () {
            if (rowUl != taskListDiv.firstElementChild) {
                moveTaskUp(taskListDiv, rowUl);
            };
            input.focus();
        });

        // downBtn click event listener, containing moveTaskDown function.
        downBtn.addEventListener("click", function () {
            if (rowUl !== taskListDiv.lastElementChild) {
                moveTaskDown(taskListDiv, rowUl);
            };
            input.focus();
        });

        // Done & Remove Elements, appending their respective btns.
        [doneElement.append(doneBtn), removeElement.append(removeBtn)];
        // Adding bootstrap classes to both done & remove btns.
        doneBtn.classList.add("btn", "btn-sm", "btn-success", "w-75");
        removeBtn.classList.add("btn", "btn-sm", "btn-danger", "w-75");
        // Done & remove btns innerText value.
        [doneBtn.innerText, removeBtn.innerText] = ["Done", "Remove"];

        // doneBtn click event.
        doneBtn.addEventListener("click", function () {
            rowUl.classList.toggle("border-left-green");
            rowUl.classList.toggle("invisible-border-left");
            taskNameElement.classList.toggle("done-task");
            importantBtn.addEventListener("click", function () {
                taskNameElement.classList.toggle("important-task");
                rowUl.classList.toggle("border-left-red");
            });
            input.focus();
        });

        // Adding removeTask function, click event to removeBtn.
        removeBtn.addEventListener("click", removeTask);

        // Checking input value, display alert if empty.
        if (input.value === "" || input.value === " ") {
            alertBox.innerHTML = emptyTaskAlert;
            rowUl.remove();
        };

        // Pushing task name to array for comparison reasons, apart from empty values.
        if (input.value !== "" && input.value != " ") {
            arrayOfTasks.push(taskNameElement.innerText);
        };

        arrayOfTasks.forEach((task) => {
            if (!uniqueTasks.includes(task)) {
                uniqueTasks.push(task);
                taskListDiv.prepend(rowUl);
            };
        });

        if (arrayOfTasks.length > uniqueTasks.length) {
            alertBox.innerHTML = duplicateAlert;
            arrayOfTasks.pop();
        };

        // Set 3s timeout for alert box display.
        setTimeout(() => {
            alertBox.innerHTML = "";
        }, 3000);

        // Reset input value.
        input.value = "";
        // Refocus input after every addBtn click event.
        input.focus();

        console.log(arrayOfTasks);
        console.log(uniqueTasks);
    };

    // Keypress event listener for adding tasks via "Enter" key.
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTaskBtn.click();
        };
    });

    // Removes Task.
    function removeTask() {
        this.closest("ul").remove();
        input.focus();
    };

    // Move task up list.
    function moveTaskUp(list, task) {
        list.insertBefore(task, task.previousSibling);
    };

    // Move task down.
    function moveTaskDown(list, task) {
        list.insertBefore(task.nextElementSibling, task);
    };
});