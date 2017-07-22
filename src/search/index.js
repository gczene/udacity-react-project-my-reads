import React from 'react';
import {Link} from 'react-router-dom';
import * as API from '../BooksAPI';
import BooksGrid from '../books-grid';

class Search extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchFor: '',
      results: []
    };
  }

  /**
   * debounced function to call when user has finished typing
   * @type {mixed} null or function to execute
   */
  timeoutFunc = null;

  /**
   * setTimeout reference of debounced ajax call
   * @type {mixed} null or setTimeout reference
   */
  timer = null;

  /**
   * search callback
   * called when user is typing and fires debounced ajax call
   * if user input is empty resets booklist to empty list
   * @param  {Object} evt event object
   * @return {undefined}
   */
  onSearchChange = (evt) => {
    let {target: {value: searchFor}} = evt;

    this.setState({searchFor, isLoading: true});

    // removing prev setTimeout
    window.clearTimeout(this.timer);

    // replacing timeoutFunc to execute
    if (searchFor) {
      this.timeoutFunc = () => {
        API.search(searchFor)
          .then(response => {
            let results = response.error ? [] : response;
            this.setState({results, isLoading: false});
          });
      };
      this.timer = window.setTimeout(this.timeoutFunc, 500);
    } else {
      // input is empty, reset book list
      this.setState({results: [], isLoading: false});
    }
  }

  /**
   * Called when user is changing status
   * @param  {object} book book object
   * @param  {object} evt  select event object
   * @return {undefined}
   */
  onBookStatusChange = (book, evt) => {
    let data = {...{id: book.id}};
    API
      .update(data, evt.target.value)
      .then(() => this.props.history.push('/'));
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" onChange={this.onSearchChange} value={this.state.searchFor} placeholder="Search by title or author"/>

          </div>
        </div>
        <div className="search-books-results">
          <h2 className="bookshelf-title">
            {this.state.isLoading && 'Loading...'}
            {!this.state.isLoading && this.state.searchFor && `Search Results (${this.state.results.length}):`}
          </h2>
          <div className="bookshelf-books">
            <BooksGrid onBookStatusChange={this.onBookStatusChange} books={this.state.results} />
          </div>

        </div>
      </div>
    );
  }
};
export default Search;
