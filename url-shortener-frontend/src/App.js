import React from 'react';
import { store } from './stores/reduxStore.ts';
import UrlShortenerLayout from './layouts/UrlShortenerLayout.tsx';
import { Provider } from "react-redux";
function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <UrlShortenerLayout />
    </div>
    </Provider>
  );
}

export default App;