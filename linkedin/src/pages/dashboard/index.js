import React , {useEffect} from 'react'
import {useRouter } from 'next/router';



export default function Dashboard() {
    const router=useRouter();
    const[isTokenThere,setisTokenThere]=React.useState(false);
  
    useEffect(()=>{
        if(localStorage.getItem('token')===null){
          router.push('/login');
        }
        setisTokenThere(true);

    })
    useEffect(()=>{


    })
    return(
        <div>
            dashboard
        </div>
    )
    
        
    
     


}
