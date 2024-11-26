
import { useDispatch, useSelector } from 'react-redux'
import {logout} from '../store/store.js'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Navbar(){
    const {user} = useSelector((state)=>state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
 


const handleLogout = ()=>{
    dispatch(logout());
    navigate('/')
}

return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <div>
      <Link to="/home" className="mr-4 hover:underline">
          Home
        </Link>

        {user && (
               <button onClick={handleLogout} className="hover:underline">logout</button>
        )}

      </div>
      <span>{user?.username}</span>



        </nav>

)

}
export default Navbar