import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

function AdminIndex() {
    const[admins,setAdmins] = useState([])

    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

      const list=[
        {
        name:"abc",
        age:20
      },
      {
        name:"cd",
        age:20
      },
      {
        name:"bc",
        age:20
      },
    ]

    useEffect(() => {
       axios.get('/user/admin/all',config).then(response=>{
           console.log("hello")
           console.log(response.data)
           setAdmins(response.data)
           

    
      

       })
    }, [])

    function distroy(id){
      axios.delete('/user/'+id).then(response=>{
        console.log(response.data)
     const abc  = admins.filter(nw=>nw._id!==id)
     setAdmins(abc)
      }).catch(err=>{
        console.log(err.request.response)
      })
    }



    




    return (

        <div className="content-wrapper">
        <div className="container">
        <Link className="btn btn-secondary" to="/admin/create">ADD Admin</Link>
            <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">name</th>
                <th scope="col">Email</th>
                <th scope="col">Action</th>
               
              </tr>
            </thead>
            
            <tbody>   
        {admins.map(admin=>{
        return(
            <tr key= {admin._id}>
            <th scope="row">{admin._id}</th>
            <td> {admin.name}</td>
            <td>
            {admin.email}
            </td>
        
            <td>
            <Link className="btn btn-primary" to="">Edit</Link>
            <button className="btn btn-danger" onClick={()=>distroy(admin._id)}  >Delete</button>
            </td>
          </tr>
        )
    })}
              
             
            </tbody>
          
          </table> 
          </div>
        </div>
    )
}

export default AdminIndex
