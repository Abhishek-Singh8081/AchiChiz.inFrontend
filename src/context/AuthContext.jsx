import { createContext, useContext, useState,useEffect } from "react";
import { auth } from "../data/allapi";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {




  const [customMessage, setCustomMessage] = useState("");
  const [user, setUser] = useState(null);
  const [quantity,setQuantity]=useState(1)
  if(quantity<1){
    setQuantity(1)
    
  }
  

const [usertoken,setusertoken]=useState(localStorage.getItem("token"))
  const [userdata,setuserdata]=useState()
    const settoken=(token)=>{
      setusertoken(token)
        localStorage.setItem("token",token)
    }
  
    const logoutuser=()=>{
      setusertoken("")
      return localStorage.removeItem("token")

    }
    const isloggedin= !! usertoken;

    const userauthentication=async ()=>{
      try {
        const response=await fetch(auth.USER_AUTHORIZATION_FOR_PROFILE,{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${usertoken}`
          }
        })
       if (response.ok) {
  const mydata = await response.json();
  const { user } = mydata;

  setuserdata(user); // ✅ This sets the user data correctly
  // console.log("user my data", user);
}

        // console.log("data from context",response)
        
      } catch (error) {
        console.log(error)
      // navigate("/errorpage")
        
      }
    }
 


  useEffect(()=>{
userauthentication()
console.log(usertoken)
  },[usertoken])
  
  const login = (name = "John Doe") => setUser({ name });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout,userdata,setuserdata,usertoken,setusertoken,logoutuser,settoken,quantity,setQuantity,customMessage,setCustomMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
