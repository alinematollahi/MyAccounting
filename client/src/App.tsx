import * as React from 'react';

import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';


import AuthenticationPage from './pages/authentication/authentication'
import EntrancePage from './pages/entrance/entrance';
import DashboardPage from './pages/dashboard/dashboard';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});


function App() {
  let x: number = 25
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/auth" />} />
            <Route path="/auth" element={<AuthenticationPage />} />

            
            <Route path="/enter" element={<EntrancePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

          </Routes>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
