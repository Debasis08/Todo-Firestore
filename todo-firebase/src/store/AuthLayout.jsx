import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {

        if(authentication && authStatus !== authentication) {
            navigate("/")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/vipani-Delat")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? <h1 className='text-white'>Loading...</h1> : <>{children}</>
}