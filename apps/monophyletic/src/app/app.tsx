import React from 'react';
import './app.css';
import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';
import { Route, Link } from 'react-router-dom';
import { PageTitle } from '@clades/ui-header'
import { useState, useEffect } from 'react';

export const App = () => {

  const [apiResponse, setApiResponse] = useState({ message: 'Loading...' });
  useEffect(() => {
    fetch('/api').then(r => r.json()).then(setApiResponse);
  }, [])
  return (
    <div className="app">
      <header className="flex">
        <Logo width="75" height="75" />
        <PageTitle></PageTitle>

      </header>
      <main>
        <p>{apiResponse.message}</p>
      </main>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Route
        path="/"
        exact
        render={() => (
          <div>
            This is the generated root route.{' '}
            <Link to="/page-2">Click here for page 2.</Link>
          </div>
        )}
      />
      <Route
        path="/page-2"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back to root page.</Link>
          </div>
        )}
      />
      {/* END: routes */}
    </div>
  );
};

export default App;
