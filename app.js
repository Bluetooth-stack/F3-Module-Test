const title = document.querySelector('#title');
const date = document.querySelector('#date');
const imgContainer = document.querySelector('#current-image-container');

const dateInput = document.querySelector('#search-input');
const submitBtn = document.querySelector('#submit');

const historyBox = document.querySelector('.history');
const ulElement = document.querySelector('#search-history');

const key = 'M7gtcbZBPfC94uUi2dzLiX4FHdQ5sslq7292Dl2l';


async function getCurrentImageOfTheDay(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${key}`);
        const data = await response.json();
        renderData(data);
        // return data;
    }
    catch (error) {
        console.log(error);
    }
}

function getImageOfTheDay(date) {
    getCurrentImageOfTheDay(date);
    saveSearch(date);
}

function saveSearch(date) {
    let curObj = { date: date };
    if (!localStorage.getItem('dateArray')) {
        let curArray = [curObj]
        localStorage.setItem('dateArray', JSON.stringify(curArray));
    }
    else {
        const prev = JSON.parse(localStorage.getItem('dateArray'));
        let updated = [...prev, curObj]
        localStorage.setItem('dateArray', JSON.stringify(updated));
    }
    addSearchToHistory()
}

function addSearchToHistory() {
    if (!localStorage.getItem('dateArray')) {
        ulElement.innerHTML = 'No History !'
    }
    else {
        ulElement.innerHTML = '';
        const history = JSON.parse(localStorage.getItem('dateArray'));
        history.forEach(dateObj => {
            let li = document.createElement('li');
            li.innerHTML = dateObj.date;
            ulElement.appendChild(li);
            li.addEventListener('click', (e)=>{
                e.stopPropagation();
                console.log(e.target.innerHTML);
                imgContainer.innerHTML = '';
                getCurrentImageOfTheDay(e.target.innerHTML);
            })
            console.log(dateObj);
        });
    }
}

function renderData(obj) {
    title.innerHTML = `${obj.title}`;
    date.innerHTML = `${obj.date}`;
    if (obj.media_type == 'image') {
        const div = document.createElement('div');
        div.classList.add('image');
        div.style.backgroundImage = `url(${obj.hdurl})`;
        imgContainer.appendChild(div);
    }
    else if (obj.media_type == 'video') {
        const frame = document.createElement('iframe');
        frame.classList.add('frameVideo');
        frame.src = `${obj.url}`;
        imgContainer.appendChild(frame);
    }
    const p = document.createElement('p');
    p.id = 'description'
    p.innerHTML = `${obj.explanation}`
    imgContainer.appendChild(p);
}


document.body.onload = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log(currentDate);
    getCurrentImageOfTheDay(currentDate);

    submitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (dateInput.value == '') {
            alert('Please enter date!');
            return;
        }
        imgContainer.innerHTML = '';
        getImageOfTheDay(dateInput.value);
    })
    addSearchToHistory()
}
