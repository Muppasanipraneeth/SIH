import { useState } from 'react';

import './App.css';
import UploadForm from '../components/UploadForm';
import DisplayOutput from '../components/DisplayOutput';

function App() {
  const [address, setAddress] = useState('');

  return (
    <div className=" justify-center items-center ">
      <h1 className='items-center text-center mt-20  border w-auto ml-72 mr-72 text-3xl '>Address Extraction App</h1>
<div className='align-center justify-center  mt-20 ml-44'>      <UploadForm setAddress={setAddress}  />
</div>     
<div className='align-center justify-center items-center mt-20 ml-44'>      <DisplayOutput address={address} />
</div> 
    </div>
  );
}

export default App;
