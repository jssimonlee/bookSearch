import React from 'react';
import './BookCard.css';

export default function BookCard({ book, onClick }) {
  const { volumeInfo } = book;
  const title = volumeInfo.title || '제목 없음';
  const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : '저자 미상';
  const publishedDate = volumeInfo.publishedDate || '출판년도 미상';
  const publishedYear = publishedDate.split('-')[0]; // 연도만 추출
  
  // 평점 및 리뷰 수 존재 여부 체크
  const hasRating = volumeInfo.averageRating !== undefined;
  const averageRating = volumeInfo.averageRating || 0;
  const ratingsCount = volumeInfo.ratingsCount || 0;

  // 책 표지 이미지 처리 (thumbnail이 없을 경우 대체 이미지 생성)
  const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;

  // 별점 렌더링 헬퍼 함수
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="book-card glass-panel" onClick={() => onClick(book)}>
      <div className="card-cover-wrapper">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="card-cover-img" loading="lazy" />
        ) : (
          <div className="card-cover-fallback">
            <span className="fallback-icon">📖</span>
            <span className="fallback-text">No Cover Available</span>
          </div>
        )}
        <div className="card-overlay">
          <span className="view-detail-btn">상세 보기</span>
        </div>
      </div>
      
      <div className="card-info">
        <h3 className="card-title" title={title}>{title}</h3>
        <p className="card-author" title={authors}>{authors}</p>
        
        <div className="card-meta">
          <span className="card-year">{publishedYear}</span>
          
          <div className="card-rating">
            {hasRating ? (
              <>
                <div className="stars-wrapper">
                  {renderStars(averageRating)}
                </div>
                {ratingsCount > 0 && (
                  <span className="rating-count">({ratingsCount})</span>
                )}
              </>
            ) : (
              <span className="rating-none" style={{ fontSize: '0.75rem', color: 'var(--text-dimmed)', fontWeight: '600' }}>
                평점 정보 없음
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
