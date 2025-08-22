import { useContext, useEffect } from "react"
// import { DataContext } from "./context/Datacontextwrapper"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"


const LogOut = () => {
    const {logoutuser}=useContext(AuthContext)

    useEffect(()=>{
        logoutuser()
        // console.log("main chla")
    },[logoutuser])
  return (
    <Navigate to="/"/>
  )
}

export default LogOut