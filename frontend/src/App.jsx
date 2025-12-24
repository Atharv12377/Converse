
import './App.css'
import { Routes , Route} from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ChatLayout } from './pages/ChatLayout'
import VerificationPage from './pages/VerificationPage'
function App() {

  return (
    <Routes>
      <Route path='/login' element = {<Login/>}/>
      <Route path='/signup' element = {<SignUp/>}/>
      <Route path='/verify' element={<VerificationPage/>}/>
      <Route path='/' element = {


        <ChatLayout/>
        
        }>
      <Route path='chat/:conversationId' element = {<ChatPage/>}/>
      </Route>
    </Routes>

  )
}

export default App
