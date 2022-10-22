const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('input');
const suggBox = searchWrapper.querySelector('.autocom-box');
const search = searchWrapper.querySelector('.icon');
const linkTag = searchWrapper.querySelector('a');
inputBox.onkeyup = (e) => {
    // console.log(e.target.value);
    let userData = e.target.value;
    let emptyArray = [];
    if (userData) {
        emptyArray = suggestions.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            return `<li>${data}</li>`;
        });
        // console.log(emptyArray);
        searchWrapper.classList.add('active');
        showSuggestions(emptyArray);
        let allLi = suggBox.querySelectorAll('li');
        for (let i = 0; i < allLi.length; i++) {
            allLi[i].setAttribute('onclick', 'select(this)');
        }
    } else {
        searchWrapper.classList.remove('active');
    }
}

function select(element) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    searchWrapper.classList.remove('active');
}

function showSuggestions(list) {
    let listData;
    if (list.length) {
        listData = list.join('');
    } else {
        userData = inputBox.value;
        listData = `<li>${userData}</li>`;
    }
    suggBox.innerHTML = listData;
}

inputBox.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        searchOnGoogle();
    }
})

search.addEventListener('click', (event) => {
    searchOnGoogle();
})

function searchOnGoogle() {
    let textToSearch = inputBox.value;
    if (textToSearch) {
        let weblink = 'https://www.google.com/search?q=' + textToSearch;
        linkTag.setAttribute('href', weblink);
        linkTag.click();
    }
}