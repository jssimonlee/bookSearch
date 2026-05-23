import React, { useEffect } from 'react';
import './BookDetailModal.css';

export default function BookDetailModal({ book, onClose }) {
  if (!book) return null;

  const { volumeInfo } = book;
  const title = volumeInfo.title || '제목 없음';
  const subtitle = volumeInfo.subtitle;
  const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : '저자 미상';
  const publisher = volumeInfo.publisher || '정보 없음';
  const publishedDate = volumeInfo.publishedDate || '정보 없음';
  const description = volumeInfo.description || '줄거리 및 도서 상세 소개 정보가 등록되어 있지 않습니다.';
  const pageCount = volumeInfo.pageCount ? `${volumeInfo.pageCount} 페이지` : '정보 없음';
  const categories = volumeInfo.categories ? volumeInfo.categories.join(', ') : '미분류';
  const hasRating = volumeInfo.averageRating !== undefined;
  const averageRating = volumeInfo.averageRating || 0;
  const ratingsCount = volumeInfo.ratingsCount || 0;
  const infoLink = volumeInfo.infoLink;

  const thumbnail = volumeInfo.imageLinks?.medium || 
                    volumeInfo.imageLinks?.large || 
                    volumeInfo.imageLinks?.thumbnail || 
                    volumeInfo.imageLinks?.smallThumbnail;

  // ESC 키 클릭 시 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // 뒷배경 스크롤 방지

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // 별점 렌더링 헬퍼
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-modal full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star-modal half">★</span>);
      } else {
        stars.push(<span key={i} className="star-modal empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        
        <div className="modal-body">
          <div className="modal-cover-section">
            {thumbnail ? (
              <img src={thumbnail} alt={title} className="modal-cover-img" />
            ) : (
              <div className="modal-cover-fallback">
                <span className="fallback-large-icon">📖</span>
                <span>No Cover Available</span>
              </div>
            )}
            
            {infoLink && (
              <a 
                href={infoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="info-link-button"
              >
                구글 도서에서 더 보기
              </a>
            )}
          </div>
          
          <div className="modal-info-section">
            <div className="modal-header-info">
              {categories && <span className="modal-category">{categories}</span>}
              <h2 className="modal-title">{title}</h2>
              {subtitle && <h4 className="modal-subtitle">{subtitle}</h4>}
              <p className="modal-authors">저자 : {authors}</p>
            </div>
            
            <div className="modal-rating-row">
              {hasRating ? (
                <>
                  <div className="modal-stars">
                    {renderStars(averageRating)}
                    <span className="modal-rating-score">{averageRating.toFixed(1)} / 5.0</span>
                  </div>
                  {ratingsCount > 0 && (
                    <span className="modal-reviews-count">리뷰 {ratingsCount}개</span>
                  )}
                </>
              ) : (
                <span className="modal-rating-none" style={{ fontSize: '0.85rem', color: 'var(--text-dimmed)', fontWeight: '600' }}>
                  등록된 평점 정보가 없습니다.
                </span>
              )}
            </div>

            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="meta-label">출판사</span>
                <span className="meta-value">{publisher}</span>
              </div>
              <div className="metadata-item">
                <span className="meta-label">출판일</span>
                <span className="meta-value">{publishedDate}</span>
              </div>
              <div className="metadata-item">
                <span className="meta-label">페이지 수</span>
                <span className="meta-value">{pageCount}</span>
              </div>
            </div>
            
            <div className="modal-desc-box">
              <h5 className="desc-title">도서 줄거리</h5>
              <div className="desc-text-wrapper">
                <p className="desc-text" dangerouslySetInnerHTML={{ __html: description }}></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
