import React from 'react';
import './style.css';
import 'bulma/css/bulma.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AudioList } from './screens/AudioList';

const App = () => {
  return (
    <Router basename={'/xadmin'}>
      <Routes>
        <Route path="/audio/" element={AudioList()} />
      </Routes>
    </Router>
  );
};

export default App;

// export default function App() {
//   return (
//     <div>
//       <h1>Project Still webclient backend</h1>
//       <p>Start editing to see some magic happen :)</p>
//     </div>
//   );
// }
