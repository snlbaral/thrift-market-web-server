import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'


function User() {

  
    const[users,setUsers] = useState([])
    useEffect(() => {
       axios.get('/user').then(response=>{
           console.log(response.data)
           setUsers(response.data)
           $('#myTable').DataTable();
       })
    }, [])

    function distroy(){

    }
    
    return (
        <div className="content-wrapper">
        <Link className="btn btn-secondary float-right" to="/adminregister">ADD Admin</Link>
        <div className="table-responsive mt-5">
        <table className="table table-light bg-white table-striped" id="myTable">
            <thead>
              <tr className="trhead">
                <th scope="col">#</th>
                <th scope="col">name</th>
                <th scope="col">Email</th>
                <th scope="col">Action</th>
               
              </tr>
            </thead>
            
            <tbody>
            {users.map(user=>{
                return(
    
           
    
              <tr key={user._id}>
                <th scope="row">{user._id}</th>
                <td> {user.name}</td>
                <td>
                {user.email}
                </td>
              
                <td>
                <Link className="btn btn-primary" to={`/admin/edituser/${user._id}`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>distroy(user._id)} >Delete</button>
                </td>
              </tr>
              )})}
            </tbody>
          
          </table>
        </div>
        </div>
    )
}

export default User
