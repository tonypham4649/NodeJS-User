// delete function
document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.btn-danger');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const confirmation = confirm('Are you sure you want to delete this user?');

            if (!confirmation) {
                return;
            }
            const userId = e.target.closest('tr').id;

            fetch(`/delete/${userId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        e.target.closest('tr').remove();
                    } else {
                        alert('Error deleting user');
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error.message);
                });
        });
    });
});

// edit function
function toggleEdit(userId) {
    const row = document.getElementById(userId);
    const inputs = row.querySelectorAll('input');
    const editButton = row.querySelector('.btn-warning');

    if (editButton.textContent === 'Edit') {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
        editButton.textContent = 'Save';
    } else {
        let updatedData = {};

        inputs.forEach(input => {
            const field = input.getAttribute('data-field');
            updatedData[field] = input.value;
            input.setAttribute('readonly', true);
        });

        fetch(`/update/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('User updated successfully');
                } else {
                    alert('Error updating user');
                }
                editButton.textContent = 'Edit';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });
    }
}

//add user
function addUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;

    fetch('/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, fullname })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User added successfully');
                window.location.href = '/users';
            } else {
                alert('Error adding user');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}
