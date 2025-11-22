let currentEditIndex = -1;

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const title = document.querySelector('#title').value;
    const genre = document.querySelector('#genre').value;
    const releaseYear = document.querySelector('#releaseYear').value;
    const isWatched = document.querySelector('#isWatched').checked;
    
    const film = {
        title, 
        genre, 
        releaseYear, 
        isWatched
    };

    if (currentEditIndex === -1) {
        addFilmToLocalStorage(film);
    } else {
        updateFilmInLocalStorage(currentEditIndex, film);
        cancelEdit();
    }
}

function validateForm() {
    let isValid = true;
    
    const title = document.querySelector('#title').value.trim();
    const genre = document.querySelector('#genre').value.trim();
    const releaseYear = document.querySelector('#releaseYear').value.trim();
    
    const titleError = document.querySelector('#title-error');
    const genreError = document.querySelector('#genre-error');
    const releaseYearError = document.querySelector('#releaseYear-error');
    
    titleError.textContent = '';
    genreError.textContent = '';
    releaseYearError.textContent = '';
    
    if (title === '') {
        titleError.textContent = 'Введите название фильма!';
        isValid = false;
    }
    
    if (genre === '') {
        genreError.textContent = 'Введите жанр фильма!';
        isValid = false;
    }
    
    if (releaseYear === '') {
        releaseYearError.textContent = 'Введите год выпуска фильма!';
        isValid = false;
    } else if (releaseYear.length !== 4 || isNaN(releaseYear)) {
        releaseYearError.textContent = 'Год должен состоять из ЧЕТЫРЁХ ЦИФР!';
        isValid = false;
    }
    
    return isValid;
}

function addFilmToLocalStorage(film) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films.push(film);
    localStorage.setItem('films', JSON.stringify(films));

    renderTable();
    clearForm();
}

function updateFilmInLocalStorage(index, film) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films[index] = film;
    localStorage.setItem('films', JSON.stringify(films));
    renderTable();
}

function deleteFilmFromLocalStorage(index) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    films.splice(index, 1);
    localStorage.setItem('films', JSON.stringify(films));
    renderTable();
}

function editFilm(index) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    const film = films[index];
    
    document.querySelector('#title').value = film.title;
    document.querySelector('#genre').value = film.genre;
    document.querySelector('#releaseYear').value = film.releaseYear;
    document.querySelector('#isWatched').checked = film.isWatched;
    
    currentEditIndex = index;
    
    document.querySelector('#submit-btn').textContent = 'Обновить';
    document.querySelector('#cancel-edit').style.display = 'block';
}

function cancelEdit() {
    currentEditIndex = -1;
    document.querySelector('#submit-btn').textContent = 'Добавить';
    document.querySelector('#cancel-edit').style.display = 'none';
    clearForm();
}

function clearForm() {
    document.querySelector('#film-form').reset();
    document.querySelector('#title-error').textContent = '';
    document.querySelector('#genre-error').textContent = '';
    document.querySelector('#releaseYear-error').textContent = '';
}

function sortFilms(criteria) {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    
    films.sort((a, b) => {
        if (criteria === 'releaseYear') {
            return parseInt(a[criteria]) - parseInt(b[criteria]);
        } else {
            return a[criteria].localeCompare(b[criteria]);
        }
    });
    
    localStorage.setItem('films', JSON.stringify(films));
    renderTable();
}

function renderTable() {
    const films = JSON.parse(localStorage.getItem('films')) || [];
    const filmTableBody = document.querySelector('#film-tbody');

    filmTableBody.innerHTML = "";

    films.forEach((film, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.genre}</td>
            <td>${film.releaseYear}</td>
            <td>${film.isWatched ? "Да" : "Нет"}</td>
            <td>
                <button onclick="editFilm(${index})">Редактировать</button>
                <button onclick="deleteFilmFromLocalStorage(${index})">Удалить</button>
            </td>
        `;
        filmTableBody.appendChild(row);
    });
}

document.querySelector('#film-form').addEventListener("submit", handleFormSubmit);
document.querySelector('#cancel-edit').addEventListener("click", cancelEdit);
document.querySelector('#sort-button').addEventListener("click", function() {
    const sortCriteria = document.querySelector('#sort-select').value;
    sortFilms(sortCriteria);
});

renderTable();