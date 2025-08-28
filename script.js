document.addEventListener("DOMContentLoaded", () => {
  const GITHUB_USERNAME = "MariShopen";

  const navLinks = document.querySelectorAll(".main-nav a, .cta-button");

  // A list of specific repositories to display in the showcase.
  const FEATURED_REPOS = [
    "MariShopen.github.io",
    "dryh",
    "Pokemon",
    "Country-Quiz",
  ];
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

      // Filter the fetched repos to only include the ones in our featured list.
      const featured = repos
        .filter((repo) => FEATURED_REPOS.includes(repo.name))
        // Sort them to match the order in the FEATURED_REPOS array.
        .sort(
          (a, b) =>
            FEATURED_REPOS.indexOf(a.name) - FEATURED_REPOS.indexOf(b.name)
        );

      featured.forEach((repo) => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";

        const title = document.createElement("h4");
        title.className = "repo-card__title";
        title.textContent = repo.name;
        title.addEventListener("click", () => {
          title.classList.toggle("repo-card__title--expanded");
        });

        const description = document.createElement("p");
        description.className = "repo-card__description";
        description.textContent =
          repo.description || "No description available.";

        const link = document.createElement("a");
        link.className = "repo-card__link";
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View on GitHub";

        repoCard.appendChild(title);
        repoCard.appendChild(description);
        repoCard.appendChild(link);
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
        if (task.completed) {
          li.classList.add("todo-app__item--completed");
        }

        const textSpan = document.createElement("span");
        textSpan.className = "todo-app__item-text";
        textSpan.textContent = task.text;

        // Click the text itself to expand or collapse it.
        textSpan.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent the li's click listener from firing.
          textSpan.classList.toggle("todo-app__item-text--expanded");
        });

        // Click the list item to toggle the completed status.
        li.addEventListener("click", () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          // Toggle the class directly to avoid a full re-render, which would
          // otherwise reset the expanded state of the text.
          li.classList.toggle("todo-app__item--completed");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "todo-app__delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent the li's click listener from firing.
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        li.appendChild(textSpan);
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
