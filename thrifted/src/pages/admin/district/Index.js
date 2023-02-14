import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'

function Index(props) {
    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 
    const[districts,setDistricts] = useState([])


    useEffect(() => {
       
      axios.get('/district',config).then(response=>{
          console.log(response.data)
          setDistricts(response.data)
          $('#districtTable').DataTable();
         
      }).catch(err=>{
          console.log(err)
      })
    
    }, [props])

    function distroy(id){
        axios.delete('/district/'+id).then(response=>{
            console.log(response.data)
            const newdistrict=[...districts]
            const index = newdistrict.findIndex(district=>district._id===id)
            newdistrict.splice(index,1)
            setDistricts(newdistrict)

        }).catch(err=>{
            console.log(err.request.response)
        })
    }
    return (
        <div className="content-wrapper">
        <Link className="btn btn-secondary float-right" to="/admin/createdistrict">ADD district</Link>
        <div className="table-responsive mt-5">
        <table className="table table-light bg-white table-striped border-0" id="districtTable" cellPadding="5">
            <thead>
            <tr className="trhead">
                <th scope="col">#</th>
                <th scope="col">Districts</th>
                <th scope="col">Action</th>
               
              </tr>
            </thead>
            
            <tbody>
            {districts.map(district=>{
                return(
    
           
    
              <tr key={district._id}>
                <th scope="row">{district._id}</th>
                <td> {district.district}</td>

                <td>
                <Link className="btn btn-primary" to={`/admin/editdistrict/${district._id}`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>distroy(district._id)} >Delete</button>
                </td>
              </tr>
              )})}
            </tbody>
          
          </table>
        </div>
        </div>
    )





}

export default Index
