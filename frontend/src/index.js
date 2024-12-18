import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StreamerDashboard from './pages/StreamerDashboard';
import ModDashboard from './pages/ModDashboard';
import PrivateRoute from './components/PrivateRoute';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/register" component={RegistrationPage} />
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/admin-dashboard" component={AdminDashboard} allowedRoles={['admin']} />
      <PrivateRoute path="/streamer-dashboard" component={StreamerDashboard} allowedRoles={['streamer']} />
      <PrivateRoute path="/mod-dashboard" component={ModDashboard} allowedRoles={['mod']} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
