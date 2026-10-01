import { useEffect } from 'react';
import { request } from './api/client';

function App() {

  useEffect(() => {
    request('/login', {
      method: 'POST',
      body: { email: 'jane@kinoxii.test', password: 'password' },
    }).then((res) => console.log(Object.keys(res), res));
  }, []);

  return <h1>Kino XII</h1>;
}

export default App;