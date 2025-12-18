
import './App.css'
import { Routes , Route} from 'react-router'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
function App() {

  return (
    <Routes>
      <Route path='/login' element = {<Login/>}/>
      <Route path='/signup' element = {<SignUp/>}/>

      <Route path='/' element = {<ChatLayout/>}>
      <Route path='/' element = {<ChatPage/>}/>
      </Route>
    </Routes>

  )
}

export default App
