import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'


function IndexCategory() {
const[categories,setCategories] = useState([])

useEffect(() => {
   axios.get('/category/all').then(response=>{
       console.log(response.data)
       setCategories(response.data)
       $('#myTable').DataTable();
      
   }).catch(err=>{
       console.log(err)
   })
}, [])


function distroy(id){
axios.delete('/category/'+id).then(response=>{
    console.log(response.data)
    const newcat = [...categories]
    const index= newcat.findIndex(cat=>cat._id===id)
    newcat.splice(index,1)
    setCategories(newcat)


})
}



    return (
        <div className="content-wrapper">
        <Link className="btn btn-secondary float-right" to="/admin/addcategory">ADD Category</Link>
        <div className="table-responsive mt-5">
        <table className="table table-light bg-white table-striped border-0" id="myTable" cellPadding="5">
            <thead>
            <tr className="trhead">
                <th scope="col">#</th>
                <th scope="col">name</th>
                <th scope="col">Image</th>
                <th scope="col">Action</th>
               
              </tr>
            </thead>
            
            <tbody>
            {categories.map(category=>{
                return(
              <tr key={category._id}>
                <th scope="row">{category._id}</th>
                <td> {category.name}</td>
                <td style={{width:"15%"}}>
                <img src= {category.image} className="img-fluid w-50" />
                </td>
              
                <td>
                <Link className="btn btn-primary" to={`/admin/editcategory/${category._id}`}>Edit</Link>
                <button className="btn btn-danger" onClick={()=>distroy(category._id)} >Delete</button>
                </td>
              </tr>
              )})}
            </tbody>
          
          </table>
</div>

              

        </div>
    )
}






export default IndexCategory
