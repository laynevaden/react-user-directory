import React, { Component } from "react";
import API from './utils/API.js';
import Jumbotron from "./components/Jumbotron";
import UserList from './components/UserList';
import Footer from "./components/Footer";

class App extends Component {

  state = {
      orig_users: [],
      display_users: [],
      error: '',
      sort: 'none',
      filter: ''
  };

  // When the component mounts, get users from the Random User API
  componentDidMount() {
    API.getRandomUsers()
      .then(response => this.setState({ orig_users: response.data.results, display_users: response.data.results }))
      .catch(err => console.log(err));
  }

  // If Sort button gets clicked, set sorted to true
  sortByCountry() {
    let sortedUsers = this.state.display_users;

    function compareCountryASC(a,b) {
      const countryA = a.location.country;
      const countryB = b.location.country;

      let comparison = 0;

      if (countryA > countryB) {
          comparison = 1;
      } else if (countryA < countryB) {
        comparison = -1;
      }
      
      return comparison;
    }

    function compareCountryDESC(a,b) {
      const countryA = a.location.country;
      const countryB = b.location.country;

      let comparison = 0;

      if (countryA < countryB) {
          comparison = 1;
      } else if (countryA > countryB) {
        comparison = -1;
      }
      
      return comparison;
    }
    
    if (this.state.sort === 'desc') {
      sortedUsers.sort(compareCountryASC);
      this.setState({ sort: 'asc' });
    } else {
      sortedUsers.sort(compareCountryDESC);
      this.setState({ sort: 'desc' });
    }

    this.setState({
      display_users: sortedUsers
    });

  }

  filterByCountry(filter) {
    let filteredUsers = this.state.display_users;

    if (filter == '') {
      filteredUsers = this.state.orig_users;
      this.setState({ display_users: filteredUsers });
    } else {
      filteredUsers = filteredUsers.filter(function(u) {
        return u.location.country === filter;
      });
      this.setState({ display_users: filteredUsers });
    }

  }

  onInputChange(e) {
    this.setState({ filter: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.filterByCountry(this.state.filter);
  }

  render() {
    return (
      <div>
        <Jumbotron />
        <div className='container block w-screen overflow-auto flex'>
          <div className='inline flex-row w-2/12 m-4 p-2 rounded-md border-black bg-indigo-500 text-white text-center'>
              <button onClick={ this.sortByCountry.bind(this) }>Sort by Country</button>
          </div>
          <div className='inline flex-row w-2/12'>
              <form onSubmit={ this.handleSubmit.bind(this) }>
                <input type='text' onChange={ this.onInputChange.bind(this) } name='filter' placeholder='Filter by Country'
                className='w-full m-4 p-2 rounded-md border-black bg-indigo-500 text-white text-center'/>
              </form>
          </div>
        </div>
        <UserList data={ this.state.display_users } />
        <Footer />
      </div>
    );
  }

}

export default App;