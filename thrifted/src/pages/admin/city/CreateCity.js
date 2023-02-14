import axios from 'axios'
import React,{useState,useEffect} from 'react'

function CreateCity(props) {

    const[city,setCity]= useState(null)
    const[districts,setDistricts] = useState([])
    const[district,setDistrict] = useState('')

    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

useEffect(() => {
   axios.get('/district',config).then(response=>{
       console.log(response.data)
       setDistricts(response.data)
   })
}, [])




    
    function add(e){
     e.preventDefault()
    const data = {
        district,
        city
    }
    console.log(data)
    axios.post('/city',data,config).then(response=>{
        console.log(response.data)
    }).catch(err=>{
        console.log(err.request.response)
    })
        }




    return (
        <div className="content-wrapper">
            <div className="container py-5 mx-auto">
                <div className="row justify-content-center">
                    <div className="col-md-9">
                    <button className="btn btn-success float-right mb-4" onClick={()=>props.history.goBack()}>Go Back</button>

                <div className="card clear">
                <div className="addheader">Create City</div>
                     <div className="card-body">
                     <form onSubmit={(e)=>add(e)}>


                         <div className="form-group">
                             <select onChange={(e)=>setDistrict(e.target.value)} className="form-control"  required>
                                <option value="" >Select District</option>
                                {districts.map(district=>{
                                return( 
                                <option key={district._id} value={district._id} >{district.district}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="form-group">
                        <label>City</label>
                        <input type="text" className="form-control city"  name="city" onChange={(e)=>setCity(e.target.value)}  id="formGroupExampleInput" placeholder="enter city name" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>





        </form>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default CreateCity
