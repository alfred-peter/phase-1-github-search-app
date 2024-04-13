const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = searchInput.value.trim();
    if (username === '') return;

    const usersEndpoint = "https://api.github.com/search/users?q=${username}";
    try {
        const response = await fetch(usersEndpoint, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        displayUsers(data.items);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

function displayUsers(users) {
    searchResults.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userElement.addEventListener('click', async function() {
            const reposEndpoint = "https://api.github.com/users/${user.login}/repos";
            try {
                const response = await fetch(reposEndpoint, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                const reposData = await response.json();
                displayRepos(reposData);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        });
        searchResults.appendChild(userElement);
    });
}

function displayRepos(repos) {
    const reposList = document.createElement('ul');
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.textContent = repo.full_name;
        reposList.appendChild(repoItem);
    });
    searchResults.appendChild(reposList);
}