import './App.css'
import { Routes, Route} from 'react-router-dom';
import Login from './components/Login'
import NavBar from './components/NavBar'
import Register from './components/Register'
import AdminContent from './components/AdminContent';
import UserProfile from './components/UserProfile';
import ModeratorContent from './components/ModeratorContent';
import UserContent from './components/UserContent';

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path={"/"} element={<div>Homepage. No login or permissions required</div>} />
        <Route exact path={"/pot"} element={"mensaje"} /> 
        <Route exact path={"/login"} element={<Login />} />
        <Route exact path={"/register"} element={<Register />} />
        <Route exact path={"/profile"} element={<UserProfile />} />
        <Route path="/admin" element={<AdminContent role='admin' />} />
        <Route path="/moderator" element={<ModeratorContent role='moderator'/>} />
        <Route path="/user" element={<UserContent />} />
      </Routes>
    </>
  )
}

export default App
