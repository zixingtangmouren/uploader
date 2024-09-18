import React from 'react';
import uploader from '@tangjs/uploader';
import { useMount } from 'ahooks';

function App() {
  useMount(() => {
    uploader();
  });
  return <div>App</div>;
}

export default App;
