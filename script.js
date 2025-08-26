document.addEventListener("DOMContentLoaded", () => {
  const GITHUB_USERNAME = "MariShopen";

  const navLinks = document.querySelectorAll(".main-nav a, .cta-button");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const fetchGitHubRepos = async () => {
    const reposContainer = document.getElementById("github-repos");
    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`
      );
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      const repos = await response.json();

      reposContainer.innerHTML = "";

      repos.slice(0, 6).forEach((repo) => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
                    <h4 class="repo-card__title">${repo.name}</h4>
                    <p class="repo-card__description">${
                      repo.description || "No description available."
                    }</p>
                    <a class="repo-card__link" href="${
                      repo.html_url
                    }" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                `;
        reposContainer.appendChild(repoCard);
      });
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      reposContainer.innerHTML =
        "<p>Could not load projects. Please try again later.</p>";
    }
  };
  fetchGitHubRepos();


  const githubLink = document.getElementById("github-link");
  if (githubLink) {
    githubLink.href = `https://github.com/${GITHUB_USERNAME}`;
    githubLink.textContent = GITHUB_USERNAME;
  }

  // --- To-Do List Logic ---
  const todoApp = () => {
    const todoInput = document.getElementById("todo-input");
    const addTodoBtn = document.getElementById("add-todo-btn");
    const todoList = document.getElementById("todo-list");

    // Load tasks from localStorage, or start with an empty list.
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const saveTasks = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
    const renderTasks = () => {
      todoList.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "todo-app__item";
        li.textContent = task.text;
        if (task.completed) {
          li.classList.add("todo-app__item--completed");
        }

        // Mark task as completed on click
        li.addEventListener("click", () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "todo-app__delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent the li's click listener from firing
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
      });
    };

    const addTask = () => {
      const taskText = todoInput.value.trim();
      if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        todoInput.value = "";
        saveTasks();
        renderTasks();
      }
    };

    addTodoBtn.addEventListener("click", addTask);
    todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTask();
      }
    });

    renderTasks();
  };

  todoApp();
});
