import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import{BrowserRouter , Route , Link, Routes} from 'react-router-dom' 
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
      <Routes>
      <Route path= '/home' element={<Homescreen/>}/>
      <Route path='/book/:roomid/:fromdate/:todate' element={<Bookingscreen/>}/>
      <Route path= '/register' element={<Registerscreen/>}/>
      <Route path= '/login' element={<Loginscreen/>}/>
      <Route path= '/profile' element={<Profilescreen/>}/>
      <Route path= '/admin' element={<Adminscreen/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}
//app.js
export default App;
