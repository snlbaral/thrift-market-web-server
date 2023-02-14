import React,{useEffect,useState} from 'react'
import axios from 'axios'
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'

function Withdraw() {
const[withdraw,setWithdraw] = useState([])



    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

useEffect(() => {
   axios.get('/user/withdraw',config).then(response=>{
       console.log(response.data)
       setWithdraw(response.data)
       $('#withdrawTable').DataTable({
           'order':[[
               5,"desc"
           ]]
       });
   })
}, [])

function PStatus(e,id){
    const data = {
        status:e.target.value,
        withdrawId : id
    }

    axios.post('user/withdraw/status',data,config).then(response=>{
        console.log(response.data)
    })
}


    return (
        <div className="content-wrapper">
        <div className="table-responsive mt-3">
            <table className="table table-light bg-white table-striped" id="withdrawTable">
            <thead>
              <tr className="bg-dark text-white">
                
                <th scope="col">Seller</th>
                <th scope="col">Payemt_method</th>
                <th scope="col">Account Detail</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                
              </tr>
            </thead>
            
            <tbody>
            {withdraw.map(item=>{
              return(
            <tr key={item._id}>
              <td> {item.seller_id.name}</td>
              <td>{item.payment_method}</td>
              <td>{item.account_detail}</td>
              <td>Rs.{item.amount}</td>
              <td>
              {item.seller_id.is_admin && item.seller_id.is_admin==1?(
                <select className="form-control" onChange ={(e)=>PStatus(e,item._id)}>
                <option value={item.status}>{item.status}</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              ):(
               <span>{item.status}</span>
              )}
             
             </td>
            
              <td>{item.createdAt}</td>
              
            </tr>
            )})}
            </tbody>
          
          </table>
          </div>
        </div>
    )
}

export default Withdraw
