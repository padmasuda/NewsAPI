//------- Const for API Key -------//
const apiKey = 'eebb1b338a084392ae9dda14e487d1c8';  // News API key

//------- Variables for Pagination -------//
let currentPage = 1;
const pageSize = 10;

//------- Async/Await with Fetch -------//
async function getNews(page = 1) {
    //------- Template Literals and Const -------//
    const category = document.getElementById('newscategory').value;
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

    try {
        //------- Await with Fetch -------//
        const response = await fetch(url);
        if (!response.ok) {
            //------- Throw in Async/Await Context -------//
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //------- Destructuring JSON Response -------//
        const data = await response.json();
        displayNewsArticles(data);
        updatePagination(data.totalResults);
    } catch (error) {
        console.error('Failed to fetch news article:', error);
        alert('Failed to fetch news article.');
    }
}

function displayNewsArticles(data) {
    //------- Destructuring for Easier Access to Nested Data -------//
    const { articles } = data;
    const newsDisplay = document.getElementById('newsDisplay');

    //------- Clear previous news articles -------//
    newsDisplay.innerHTML = '';

    //------- Template Literals for HTML Generation -------//
    articles.forEach(article => {
        const { title, description, url, urlToImage, publishedAt, source: { name: sourceName } } = article;
        const articleHTML = `
            <div class="news-article">
                <h2>${title}</h2>
                ${urlToImage ? `<img src="${urlToImage}" alt="${title}" style="max-width: 100%;">` : ''}
                <p><strong>Source:</strong> ${sourceName}</p>
                <p><strong>Published at:</strong> ${new Date(publishedAt).toLocaleString()}</p>
                <p>${description}</p>
                <a href="${url}" target="_blank">Read more</a>
            </div>
        `;
        newsDisplay.innerHTML += articleHTML;
    });
}
// Function to update pagination buttons
function updatePagination(totalResults) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalResults / pageSize);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => {
            currentPage = i;
            getNews(i);
        };
        pagination.appendChild(pageButton);
    }
}