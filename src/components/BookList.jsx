import React from 'react';
import BookCard from './BookCard';
import './BookList.css';

// 로딩 뼈대(Skeleton Card) 렌더링을 위한 임시 배열
const SKELETONS = Array.from({ length: 8 });

export default function BookList({ books, loading, error, onBookClick }) {
  if (loading) {
    return (
      <div className="book-list-container">
        <div className="book-grid">
          {SKELETONS.map((_, index) => (
            <div key={index} className="book-card-skeleton glass-panel shimmer">
              <div className="skeleton-cover"></div>
              <div className="skeleton-info">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line author"></div>
                <div className="skeleton-footer">
                  <div className="skeleton-line pill"></div>
                  <div className="skeleton-line rating"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message-container glass-panel">
        <div className="error-icon">⚠️</div>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="state-message-container glass-panel">
        <div className="empty-icon">🔍</div>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 작가 이름을 입력하시거나, 언어 필터를 확인해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-grid">
        {books.map((book, index) => (
          <BookCard
            key={`${book.id}-${index}`}
            book={book}
            onClick={onBookClick}
          />
        ))}
      </div>
    </div>
  );
}
