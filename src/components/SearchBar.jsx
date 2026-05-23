import React, { useState } from 'react';
import './SearchBar.css';

const LANGUAGES = [
  { code: '', label: '🌐 모든 언어' },
  { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'en', label: '🇺🇸 영어' },
  { code: 'ja', label: '🇯🇵 일본어' },
  { code: 'zh', label: '🇨🇳 중국어' },
  { code: 'es', label: '🇪🇸 스페인어' },
  { code: 'fr', label: '🇫🇷 프랑스어' },
  { code: 'de', label: '🇩🇪 독일어' }
];

export default function SearchBar({ onSearch, initialQuery = '', initialLanguage = '', initialSearchType = 'author' }) {
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState(initialLanguage);
  const [searchType, setSearchType] = useState(initialSearchType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), language, searchType);
  };

  return (
    <form className="search-bar-container glass-panel" onSubmit={handleSubmit}>
      <div className="search-type-controls">
        <div className="select-wrapper type-select-wrapper">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="author">✍️ 작가명</option>
            <option value="title">📖 책 제목</option>
          </select>
          <span className="select-arrow">▼</span>
        </div>
      </div>

      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          placeholder={searchType === 'author' ? '검색할 작가 이름을 입력하세요... (예: 한강, 스티븐 킹)' : '검색할 책 제목을 입력하세요... (예: 소년이 온다, 쇼생크 탈출)'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="search-controls">
        <div className="select-wrapper">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <span className="select-arrow">▼</span>
        </div>
        
        <button type="submit" className="search-button">
          검색하기
        </button>
      </div>
    </form>
  );
}
