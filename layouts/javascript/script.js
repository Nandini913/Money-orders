const userDropdown = document.getElementById('user');

fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(usernames => {
        usernames.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            userDropdown.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching usernames:', error);
    });
