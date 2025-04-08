import AppRouter from "./Pages/user/Router/Router";
import Router from "./Pages/user/Router/Router";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
 
   
        <div className="App">
           <BrowserRouter>
           <AppRouter />
          </BrowserRouter>
        </div>
     
  );
}

export default App;
