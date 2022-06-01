import React from 'react';

export const Star = ({ marked, starId, onClick }) => {
  return (
    <span 
      tabIndex="0"
      data-star-id={starId} 
      className={ marked
        ? "rate checked fa fa-star" 
        : "rate fa fa-star"
      } 
      role='checkbox'
      aria-label={`nota ${starId}`}
      value={starId}
      onClick={onClick}
      onKeyPress={onClick}
      aria-checked={marked}
    >
    </span>
  );
};