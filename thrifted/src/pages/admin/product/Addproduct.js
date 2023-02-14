import React,{useEffect,useState} from 'react'
import axios from 'axios'
import $ from 'jquery'

function Addproduct(props) {
    const[brands,setBrands] = useState([])
    const[categories,setCategories]= useState([])
    const[products,setProducts] = useState([])
    const[sizes,setSizes]= useState([])
    const[colors,setColors] = useState([])
  



  //form
    const[name,setName]= useState('')
    const[stock,setStock] = useState('')
    const[price,setPrice] = useState('')
    const[sku,setSku] = useState('')
    const[discount,setDiscount] = useState('')
    const[detail,setDetail] = useState('')
    const[image,setImage] = useState('')
    const[color, setColor]= useState('')
    const[size, setSize]= useState('')
    const[brand,setBrand] = useState(null)
    const[category,setCategory] = useState(null)
    const[featureimg,setFeatureimg] = useState([])
    const[type,setType] = useState('')



useEffect(() => {
    const config = {
        headers: {
          'access-token':localStorage.getItem('token')
        }
      } 

   axios.get('/brand',config).then(response=>{
       console.log(response.data)
       setBrands(response.data)
   })

   axios.get('/category',config).then(response=>{
    console.log(response.data)
    setCategories(response.data)
})
axios.get('/color',config).then(response=>{
    console.log(response.data)
    setColors(response.data)
})

axios.get('/size',config).then(response=>{
    console.log(response.data)
    setSizes(response.data)
}).catch(err=>{
    console.log(err.request.response)
})

}, [])



    function add(e){
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
        data.append('brand',brand)
        data.append('category',category)
        data.append('color',color)
        data.append('size',size)
        data.append('type',type)
        console.log(data)

        console.log(size)
        for(var i=0;i<featureimg.length;i++) {
          data.append('feature',featureimg[i])          
        }
  

       

        axios.post('/product',data,config).then(response=>{
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
        <div className="addheader">Add Product</div>
        <div className="card-body">
        <form onSubmit={(e)=>add(e)}>
     <div className="form-group">
     <select onChange={(e)=>setBrand(e.target.value)} className="form-control"  required>
        <option value="" >Select Brand</option>
        {brands.map(brand=>{
        return( 
        <option key={brand.id} value={brand._id} >{brand.name}</option>
            )
        })}
        </select>
        </div>
        <div className="form-group">
        <select  className="form-control" onChange={(e)=>setCategory(e.target.value)} required>
        <option  value=''>Select Category</option>
        {categories.map(category=>{
          return(
            <>
            <option value="{category._id}"  key={category._id} >
            {category.name}
            </option>
            <Nested cat={category.childrens} n={1}/>
            </>
          )
        })}
        </select>

       
     </div>
     <div className="form-group">
        <select onChange={(e)=>setColor(e.target.value)} className="form-control" required>
        <option value="">Select color</option>
        {colors.map(color=>{
         return( 
        <option key={color.id} value={color._id}>{color.name}</option>
        )
     })}
        </select>
     </div>
     <div className="form-group">
     <select className="form-control" name="size" onChange={(e)=>setSize(e.target.value)} required>
     <option value="">Select Size</option>
        {sizes.map(size=>{
         return( 
        <option value={size._id}>{size.name}</option>

         )
     })}
     </select>

       </div>
       <div className="form-group">
       <label>Product For:</label>
       <select className="form-control" name="type" onChange={(e)=>setType(e.target.value)} placeholder="Select Product Type" required>
       <option value="">Select Product Type</option>
       <option value="rent">Rent</option>
       <option value="sale">Sale</option>
       </select>
       </div>

        <div className="form-group">
        <input type="file" name="image" className="detail" onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div className="form-group">
        <input type="file" name="feature" className="detail" onChange={(e)=>setFeatureimg(e.target.files)} multiple />
        </div>
        <div className="form-group">
        <input type="name" className="form-control detail" name="name" onChange={(e)=>setName(e.target.value)} placeholder="product name here" required/>
        </div>
        <div className="form-group">
        <textarea className="form-control detail" name="detail" onChange={(e)=>setDetail(e.target.value)} placeholder="detail here" required rows="4"/>
        </div>
        <div className="form-group">
        <input type="" className="form-control detail" name="price" onChange={(e)=>setPrice(e.target.value)} placeholder="product price" required/>
        </div>
        <div className="form-group">
        <input type="" className="form-control detail" name="stock" onChange={(e)=>setStock(e.target.value)} placeholder="product stock" required/>
        </div>
        <div className="form-group">
        <input type="name" className="form-control detail" name="sku" onChange={(e)=>setSku(e.target.value)} placeholder="product sku" required/>
        </div>
        <div className="form-group">
        <input type="" className="form-control detail" name="discount" onChange={(e)=>setDiscount(e.target.value)} placeholder="product discount" required/>
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

function Nested({cat, n}) {


    var inc = n;
    function increment(n){
      var ele = "\u00A0 \u00A0 \u00A0"
      inc += 1;
      return ele.repeat(n)
    }
    
      return(
          <>
          {cat.map(catee=>{
            return(
              <>
             <option value={catee._id}>
             {increment(n)} {catee.name} 
              </option>
              <Nested cat={catee.childrens} n={inc}/>
              </>
            )
          })}
          </>
      )
    }

export default Addproduct
