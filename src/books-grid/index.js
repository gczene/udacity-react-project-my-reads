import React from 'react';
import Book from './book';

export default ({books}) => {
  return (
    <ol className="books-grid">
      {books.map(book => (
        <li key={book.id}>
          <Book book={book} />
        </li>
      ))}
    </ol>
  );
}
