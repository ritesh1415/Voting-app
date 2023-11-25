import React from 'react';
//import Layout from './Component/Layout/Layout';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Login from './Component/Login';
import Signup from './Component/Signup';
import {createContext,useState} from 'react';
import Vote from './Component/Vote';

const Appstate = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <Appstate.Provider value={{ login, userName, setLogin, setUserName }}>

    <div >
    
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<Login/>}/>
<Route path='/Signup' element={<Signup/>}/>
<Route path='/vote' element={<Vote/>}/>
      </Routes></BrowserRouter>
    </div>    </Appstate.Provider>

  );
}


export default App;
export { Appstate }
