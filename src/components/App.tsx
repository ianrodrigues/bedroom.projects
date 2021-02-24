import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import GlobalStyle from 'styles';

const Home = React.lazy(() => import('pages/Home'));

const App: React.VFC<RouteComponentProps> = () => {
  return (
    <main>
      <GlobalStyle />
      <React.Suspense fallback={<span>loading</span>}>
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
      </React.Suspense>
    </main>
  );
};

export default withRouter(App);
