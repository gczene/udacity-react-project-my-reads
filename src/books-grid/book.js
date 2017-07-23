import React from 'react';
import BookShelfChanger from './book-shelf-changer';

export default ({book}) => {
  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
        <BookShelfChanger />
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors && book.authors.join(' & ')}</div>
    </div>
  );
};
