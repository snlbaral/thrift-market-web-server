import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'


function Brandindex(props) {
const[brands,setBrands] = useState([])


    useEffect(() => {

      axios.get('/brand').then(response=>{
          console.log(response.data)
          setBrands(response.data)
          $('#brandTable').DataTable();
         
      }).catch(err=>{
          console.log(err)
      })
    
    }, [props])

    function distroy(id){
        axios.delete('/brand/'+id).then(response=>{
            console.log(response.data)
            const newbrand=[...brands]
            const index = newbrand.findIndex(brand=>brand._id===id)
            newbrand.splice(index,1)
            setBrands(newbrand)

        }).catch(err=>{
            console.log(err.request.response)
        })
    }
    return (
        <div className="content-wrapper">
        <Link className="btn btn-secondary float-right" to="/admin/addbrand">ADD Brand</Link>
        <div className="table-responsive mt-5">
        <table className="table table-light bg-white table-striped border-0" id="brandTable" cellPadding="5">
            <thead>
            <tr className="trhead">
                <th scope="col">#</th>
                <th scope="col">name</th>
                <th scope="col">Image</th>
                <th scope="col">Action</th>
               
              </tr>
            </thead>
            
            <tbody>
            {brands.map(brand=>{
                return(
    
           
    
              <tr key={brand._id}>
                <th scope="row">{brand._id}</th>
                <td> {brand.name}</td>
                <td style={{width:"15%"}}>
                <img src= {brand.image} className="img-fluid w-50" />
                </td>
              
                <td>
                <Link className="btn btn-primary" to={`/admin/editbrand/${brand._id}`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>distroy(brand._id)} >Delete</button>
                </td>
              </tr>
              )})}
            </tbody>
          
          </table>
        </div>
        </div>
    )
}

export default Brandindex
