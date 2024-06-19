import React, { useState, useEffect } from 'react';
import './NewsFetcher.css';

// Constants
const apiKey = 'eebb1b338a084392ae9dda14e487d1c8';
const pageSize = 10;

const NewsFetcher = () => {
  // State hooks for managing category, articles, current page, and total results
  const [category, setCategory] = useState('general');
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  // Function to fetch news articles
  const getNews = async (page = 1) => {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data.articles);
      setTotalResults(data.totalResults);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch news article:', error);
      setError('Failed to fetch news article.');
    }
  };

  // Fetch news articles whenever the category or current page changes
  useEffect(() => {
    getNews(currentPage);
  }, [category, currentPage]);

  // Function to handle category change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  // Function to render pagination buttons
  const renderPagination = () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage(i);
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      <h1>Fetch News Articles</h1>
      <label htmlFor="newscategory">Select Category:</label>
      <select class="category" id="newscategory" value={category} onChange={handleCategoryChange}>
        <option value="business">Business</option>
        <option value="entertainment">Entertainment</option>
        <option value="general">General</option>
        <option value="health">Health</option>
        <option value="science">Science</option>
        <option value="sports">Sports</option>
        <option value="technology">Technology</option>
      </select>
      <button class="News" onClick={() => getNews()}>Get News</button>
      <div id="newsDisplay">
        {error && <p>{error}</p>}
        {articles.map((article, index) => (
          <div key={index} className="news-article">
            <h2>{article.title}</h2>
            {article.urlToImage && <img src={article.urlToImage} alt={article.title} style={{ maxWidth: '100%' }} />}
            <p><strong>Source:</strong> {article.source.name}</p>
            <p><strong>Published at:</strong> {new Date(article.publishedAt).toLocaleString()}</p>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
      <div id="pagination">
        {renderPagination()}
      </div>
    </div>
  );
};

export default NewsFetcher;