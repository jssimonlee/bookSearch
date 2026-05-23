import React from 'react';
import './SortFilter.css';

const SORT_OPTIONS = [
  { id: 'relevance', label: '🔥 관련도순', type: 'api' },
  { id: 'newest', label: '📅 최신 출판순', type: 'api' },
  { id: 'rating', label: '⭐ 평점 인기순', type: 'client' },
  { id: 'reviews', label: '💬 리뷰 많은순', type: 'client' }
];

export default function SortFilter({ currentSort, onSortChange, totalCount = 0 }) {
  return (
    <div className="sort-filter-container">
      <div className="results-count">
        총 <span className="count-number">{totalCount}</span>개의 도서가 검색되었습니다
      </div>
      
      <div className="sort-tabs glass-panel">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`sort-tab-button ${currentSort === option.id ? 'active' : ''}`}
            onClick={() => onSortChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
