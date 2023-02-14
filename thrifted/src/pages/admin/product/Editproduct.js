import React,{useEffect,useState} from 'react'
import axios from 'axios'

function Editproduct(props) {
    const[product,setProduct] = useState([])
    const[name,setName]= useState('')
    const[stock,setStock] = useState('')
    const[price,setPrice] = useState('')
    const[sku,setSku] = useState('')
    const[discount,setDiscount] = useState('')
    const[detail,setDetail] = useState('')
    const[image,setImage] = useState('')
    const[type,setType] = useState('')
    const[brand,setBrand] = useState([])
    const[brands,setBrands] = useState([])
    const[categories,setCategories]= useState([])
    const[category,setCategory]= useState([])
    const[cate,setCate] = useState(null)
    const[brandd,setBrandd] = useState(null)

useEffect(() => {
    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

   axios.get('/product/'+props.match.params.id,config).then(response=>{
    console.log(response.data)
    setName(response.data.name)
    setStock(response.data.stock)
    setPrice(response.data.price)
    setSku(response.data.sku)
    setType(response.data.type)
    setDiscount(response.data.discount)
    setDetail(response.data.detail)
    setImage(response.data.image)
    setCategory(response.data.category_id)
    setBrand(response.data.brand_id)
    setCate(response.data.category_id._id)
    setBrandd(response.data.brand_id._id)
   })

   
  axios.get('/category').then(response=>{
    console.log(response.data)
    setCategories(response.data)
})
axios.get('/brand').then(response=>{
    console.log(response.data)
    setBrands(response.data)
})
}, [])

function replace(e){
    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 
    e.preventDefault()
    const data = new FormData()
    data.append('name',name)
    data.append('stock',stock)
    data.append('price',price)
    data.append('sku',sku)
    data.append('discount',discount)
    data.append('detail',detail)
    data.append('image',image)
    data.append('brand',brandd)
    data.append('category',cate)
    data.append('type',type)

    
   

    axios.put('/product/'+props.match.params.id,data,config).then(response=>{
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
        <div className="addheader">Edit Product</div>
        <div className="card-body">
        <form onSubmit={(e)=>replace(e)}>

        <div className="form-group">
        <label>Brand</label>
        <select onChange={(e)=>setBrandd(e.target.value)} className="form-control"  required>
           <option value={brand._id} >{brand.name}</option>
           {brands.map(brnd=>{
           return( 
           <option key={brnd._id} value={brnd._id} >{brnd.name}</option>
               )
           })}
           </select>
           </div>


           <div className="form-group">
           <label>Category</label>
        <select onChange={(e)=>setCate(e.target.value)} className="form-control" required>
        <option value={category._id}>{category.name}</option>
        {categories.map(cat=>{
         return( 
        <option key={cat._id} value={cat._id}>{cat.name}</option>
        )
     })}
        </select>
     </div>
     <div className="form-group">
       <label>Product For:</label>
       <select className="form-control" name="type"  onChange={(e)=>setType(e.target.value)} placeholder="Select Product Type" required>
       <option value={type}>{type}</option>
       <option value="rent">Rent</option>
       <option value="sale">Sale</option>
       </select>
       </div>

        <div className="form-group">
        <label>Image</label>
        <input type="file" name="image" defaultValue={image} onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div className="form-group">
        <label>Name</label>
        <input type="name" className="form-control detail" name="name" defaultValue={name} onChange={(e)=>setName(e.target.value)} required/>
        </div>
        <div className="form-group">
        <label>Price</label>
        <input type="" className="form-control detail" name="price" defaultValue={price} onChange={(e)=>setPrice(e.target.value)} required/>
        </div>
        <div className="form-group">
        <label>Stock</label>
        <input type="" className="form-control detail" name="stock" defaultValue={stock} onChange={(e)=>setStock(e.target.value)} required/>
        </div>
        <div className="form-group">
        <label>Detail</label>
        <input type="name" className="form-control detail" name="detail" defaultValue={detail} onChange={(e)=>setDetail(e.target.value)} required/>
        </div>
        <div className="form-group">
        <label>Sku</label>
        <input type="name" className="form-control detail" name="sku" defaultValue={sku} onChange={(e)=>setSku(e.target.value)} placeholder="product SKu"  required/>
        </div>
        <div className="form-group">
        <label>Discount</label>
        <input type="" className="form-control detail" name="discount" defaultValue={discount} onChange={(e)=>setDiscount(e.target.value)} required/>
        </div>
        <button className="btn btn-primary">Submit</button>
        </form>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Editproduct
