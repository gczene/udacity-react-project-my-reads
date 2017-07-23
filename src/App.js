import React from 'react'
import './App.css'
import {Route} from 'react-router-dom';
import Home from './home';
import Search from './search';
import {getAll, update} from './BooksAPI';

class BooksApp extends React.Component {
  componentDidMount() {
    this.setState({
      isLoading: true
    });
    getAll().then(books => {
      this.setState({isLoading: false, books});
    });
  }
  state = {
    books: [],
    isLoading: false
  }

  /**
   * rearranging (updating) the book list immediately based on the choosen book shelf
   * @param  {object} book  book object
   * @param  {string} shelf choosen shelf
   * @return {undefined}
   */
  rearrangeBooks = (book, shelf) => {
    this.setState(prevState => {
      let newState;
      if (shelf === 'none') {
        // deleting from list
        newState = {...prevState, ...{books: prevState.books.filter(b => (b.id !== book.id))}};
      } else if (this.state.books.some(b => (b.id === book.id))) {
        // book already exists in list. Shelf update needed
        newState = {...prevState, ...{books: prevState.books.map(b => {
          if (b.id !== book.id) {
            return b;
          } else {
            return {...b, ...{shelf}}
          }
        })}};
      } else {
        // beand new book not in the list
        let newBook = {...book, ...{shelf}};
        newState = {...prevState, ...{books: prevState.books.concat(newBook)}};
      }
      return newState;
    });
  }

  /**
   * Called when user is changing status
   * @param  {object} book book object
   * @param  {object} evt  select event object
   * @return {undefined}
   */
  onBookStatusChange = (book, evt) => {
    let data = {...{id: book.id}};

    this.rearrangeBooks(book, evt.target.value);
    update(data, evt.target.value)
      .then(() => this.props.history.push('/'));
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => <Home isLoading={this.state.isLoading} onBookStatusChange={this.onBookStatusChange} books={this.state.books} />} />
        <Route path='/search' render={() => <Search onBookStatusChange={this.onBookStatusChange} />} />
      </div>
    )
  }
}

export default BooksApp
