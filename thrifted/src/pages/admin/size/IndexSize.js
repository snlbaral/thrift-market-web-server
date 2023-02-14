import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'

function IndexSize() {
    const [sizes,setSizes] = useState([])

    useEffect(() => {
      const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

     axios.get('/size',config).then(response=>{
       console.log(response.data)
       setSizes(response.data)
       $('#myTable').DataTable();
     })
    }, [])
  
  function distroy(e,id){
  
    axios.delete('/size/'+id).then(response=>{
      console.log(response.data)
      
      // setSizes(response.data)
  
      const products = [...sizes]
      console.log(products)
      const index= products.findIndex(product=>product._id===id)
      console.log(index)
      products.splice(index,1)
      setSizes(products)
    })
}



    return (
        <div className="content-wrapper">
        <div className="container ">
    <table className="table" id="myTable">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">name</th>
      </tr>
    </thead>
    
    <tbody>
    <Link className="btn btn-secondary" to='/admin/addsize' > Add</Link>
    {sizes.map(size=>{
        return(

      <tr key={size._id}>
        <th scope="row">{size._id}</th>
        <td> {size.name}</td>
        <td>
        <Link className="btn btn-primary" to={`/admin/editsize/${size._id}`}>Edit</Link>
        <button className="btn btn-danger" onClick={(e)=>distroy(e,size._id)} >Delete</button>
        </td>
        
      </tr>
     
      )})}
    </tbody>
  
  </table>
    </div>
    </div>
    )
}

export default IndexSize
