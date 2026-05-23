import React, { useState, useMemo, useRef } from 'react';
import SearchBar from './components/SearchBar';
import SortFilter from './components/SortFilter';
import BookList from './components/BookList';
import BookDetailModal from './components/BookDetailModal';

const POPULAR_AUTHORS = [
  { name: 'Han Kang', emoji: '🍁' },
  { name: 'Stephen King', emoji: '🤡' },
  { name: 'Bernard Werber', emoji: '🐜' },
  { name: 'Keigo Higashino', emoji: '🕵️' },
  { name: 'Haruki Murakami', emoji: '🐱' },
  { name: 'J. K. Rowling', emoji: '⚡' }
];

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedBook, setSelectedBook] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState('author');
  const [hasMore, setHasMore] = useState(false);

  // Ref to track the active request parameters to prevent race conditions
  const activeRequestRef = useRef({ query: '', type: '', lang: '' });

  const fetchBooks = async (query, lang = '', type = 'author', isLoadMore = false) => {
    if (!query) return;

    const currentStartIndex = isLoadMore ? books.length : 0;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setBooks([]);
      // Track active single search parameters
      activeRequestRef.current = { query, type, lang };
    }

    setSearchQuery(query);
    setSearchLanguage(lang);
    setSearchType(type);
    setHasSearched(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const queryPrefix = type === 'title' ? 'intitle:' : 'inauthor:';
      let url = `https://www.googleapis.com/books/v1/volumes?q=${queryPrefix}"${encodeURIComponent(query)}"&maxResults=40&startIndex=${currentStartIndex}`;
      
      if (lang) {
        url += `&langRestrict=${lang}`;
      }

      if (apiKey) {
        url += `&key=${apiKey}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API Rate limit (429) exceeded. Please configure Google Books API Key in .env file.');
        }
        throw new Error(`Server error. (Status: ${response.status})`);
      }

      const data = await response.json();
      
      // If the search criteria changed while fetching, ignore the stale response
      if (
        activeRequestRef.current.query !== query ||
        activeRequestRef.current.type !== type ||
        activeRequestRef.current.lang !== lang
      ) {
        return;
      }

      const newItems = data.items || [];

      if (isLoadMore) {
        setBooks((prev) => [...prev, ...newItems]);
      } else {
        setBooks(newItems);
      }

      setHasMore(newItems.length > 0);
    } catch (err) {
      // Stale response error ignore check
      if (
        !isLoadMore &&
        (activeRequestRef.current.query !== query ||
          activeRequestRef.current.type !== type ||
          activeRequestRef.current.lang !== lang)
      ) {
        return;
      }
      setError(err.message || 'Connection failed.');
      if (!isLoadMore) setBooks([]);
    } finally {
      // Stale response finally skip check
      if (
        !isLoadMore &&
        (activeRequestRef.current.query !== query ||
          activeRequestRef.current.type !== type ||
          activeRequestRef.current.lang !== lang)
      ) {
        // do not turn off loading for the newer request that is still running
      } else {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const handleTagClick = (authorName) => {
    fetchBooks(authorName, searchLanguage, 'author');
  };

  const handleLoadMore = () => {
    fetchBooks(searchQuery, searchLanguage, searchType, true);
  };

  const processedBooks = useMemo(() => {
    if (!books || books.length === 0) return [];

    const list = [...books];

    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => {
          const dateA = a.volumeInfo.publishedDate || '0000';
          const dateB = b.volumeInfo.publishedDate || '0000';
          return dateB.localeCompare(dateA);
        });

      case 'rating':
        return list.sort((a, b) => {
          const ratingA = a.volumeInfo.averageRating || 0;
          const ratingB = b.volumeInfo.averageRating || 0;
          
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          const countA = a.volumeInfo.ratingsCount || 0;
          const countB = b.volumeInfo.ratingsCount || 0;
          return countB - countA;
        });

      case 'reviews':
        return list.sort((a, b) => {
          const countA = a.volumeInfo.ratingsCount || 0;
          const countB = b.volumeInfo.ratingsCount || 0;
          
          if (countB !== countA) {
            return countB - countA;
          }
          const ratingA = a.volumeInfo.averageRating || 0;
          const ratingB = b.volumeInfo.averageRating || 0;
          return ratingB - ratingA;
        });

      case 'relevance':
      default:
        return list;
    }
  }, [books, sortBy]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '4rem 1rem 2rem 1rem', 
        textAlign: 'center', 
        maxWidth: '850px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' }}>📖</span>
          <h1 className="glow-text" style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            letterSpacing: '-0.05em' 
          }}>
            LuminaBook
          </h1>
        </div>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.1rem', 
          fontWeight: '500', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Explore worldwide masterpieces using Google Books API.<br />
          Optimized sorting by publish year, rating, and customer reviews count.
        </p>
        
        <SearchBar 
          onSearch={fetchBooks} 
          initialQuery={searchQuery} 
          initialLanguage={searchLanguage} 
          initialSearchType={searchType}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dimmed)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>
            🔥 POPULAR AUTHORS SEARCH
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
            {POPULAR_AUTHORS.map((author) => (
              <button
                key={author.name}
                onClick={() => handleTagClick(author.name)}
                style={{
                  background: searchQuery === author.name ? 'var(--gradient-main)' : 'var(--glass-bg)',
                  border: `1px solid ${searchQuery === author.name ? 'transparent' : 'var(--glass-border)'}`,
                  color: searchQuery === author.name ? '#ffffff' : 'var(--text-muted)',
                  padding: '0.5rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: searchQuery === author.name ? '0 4px 10px rgba(139, 92, 246, 0.25)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}
                className={searchQuery !== author.name ? 'glass-panel' : ''}
              >
                <span>{author.emoji}</span>
                <span>{author.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {hasSearched && (
          <SortFilter 
            currentSort={sortBy} 
            onSortChange={setSortBy} 
            totalCount={books.length} 
          />
        )}

        <BookList 
          books={processedBooks} 
          loading={loading && books.length === 0} 
          error={error} 
          onBookClick={setSelectedBook} 
        />

        {hasMore && books.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto 4rem auto' }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
                padding: '1rem 3rem',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '700',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              className="glass-panel"
            >
              {loadingMore ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  <span>Loading More...</span>
                </>
              ) : (
                <span>📖 Load More Books (+)</span>
              )}
            </button>
          </div>
        )}
      </main>

      <footer style={{
        padding: '2.5rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        background: 'rgba(7, 9, 19, 0.4)',
        marginTop: 'auto'
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dimmed)', fontWeight: '500' }}>
          &copy; {new Date().getFullYear()} LuminaBook. Created with Google Books API & React.
        </p>
      </footer>

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}
