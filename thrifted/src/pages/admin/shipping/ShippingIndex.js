import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'



function ShippingIndex() {
    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 


const[shippings,setShippings] = useState([])
useEffect(() => {
   axios.get('/shipping',config).then(response=>{
       console.log(response.data)
       setShippings(response.data)
   })
}, [])

function distroy(id){
    axios.delete('/shipping/'+id).then(response=>{
        console.log(response.data)
        var abc= shippings.filter(shipping=>shipping._id!=id)
        setShippings(abc)
    })
}


    return (
        <div className="content-wrapper">
        <div className="container ">
        <Link className="btn btn-secondary float-right mb-2" to='/admin/addshipping' > Add Shipping</Link>

        <div className="table-responsive mt-5">
        <table className="table table-light bg-white table-striped" id ="myTable">
    <thead>
    <tr className="trhead">
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Days</th>
        <th scope="col">Fee</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    
    <tbody>
    {shippings.map(shipping=>{
        return(

      <tr key={shipping._id}>
        <th scope="row">{shipping._id}</th>
        <td> {shipping.location}</td>
        <td> {shipping.days}</td>
        <td> {shipping.fee}</td>

        <td>
        <Link className="btn btn-primary" to={`/admin/editshipping/${shipping._id}`}>Edit</Link>
        <button className="btn btn-danger" onClick={()=>distroy(shipping._id)} >Delete</button>
        </td>
        
      </tr>
     
      )})}
    </tbody>
  
  </table>
    </div>
    </div>
    </div>
    )
}

export default ShippingIndex
