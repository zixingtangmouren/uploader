import React, { useRef } from 'react';
import { Sdk } from '@tangjs/uploader';
import { useMount } from 'ahooks';

function App() {
  const sdkRef = useRef<Sdk>(new Sdk());
  useMount(() => {
    //
  });
  return (
    <div>
      App
      <button
        onClick={() => {
          sdkRef.current.upload();
        }}
      >
        upload
      </button>
    </div>
  );
}

export default App;
