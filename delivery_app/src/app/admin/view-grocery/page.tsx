'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from "motion/react"
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IGrocery } from '@/models/grocery.model'
import Image from 'next/image'

function page() {
    const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Spices & Masalas",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Package Food",
    "Baby & Pet Care"
]
const units = [
    "kg", "g", "liter", "ml", "piece", "pack"
]
    const [search,setSearch]=useState("")
    const [filtered,setFiltered]=useState<IGrocery[]>([])
    const handleImageUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0]
        if(file){
            setBackendImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }
    const [loading,setLoading]=useState(false)
    const handleDelete=async ()=>{
        setLoading(true)
        try {
            const result=await axios.post('/api/admin/delete-grocery',{groceryId:editing?._id.toString()})
            window.location.reload()
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const handleEdit=async ()=>{
        setLoading(true)
        try{
            const formData=new FormData()
            if(!editing)
                return
            formData.append("groceryId",editing._id.toString()!)
            formData.append("name",editing.name)
            formData.append("category",editing.category)
            formData.append("price",editing.price)
            formData.append("unit",editing.unit)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result=await axios.post("/api/admin/EditGrocery",formData)
            window.location.reload()
            setLoading(false)
        }catch(error){
            console.log(error)
            setLoading(false)
        }
    }
    const [backendImage,setBackendImage]=useState<Blob|null>(null)
    const [editing,setEditing]=useState<IGrocery|null>(null)
    const [imagePreview,setImagePreview]=useState<string|null>(null)
    useEffect(()=>{
        const getGrocery=async ()=>{
            try {
                const result=await axios.get('/api/admin/getGrocery')
                setGroceries(result.data)
                setFiltered(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getGrocery()
    },[])
    useEffect(()=>{
        if(editing){
            setImagePreview(editing.image)
        }
    },[editing])
    const router=useRouter()
    const [groceries,setGroceries]=useState<IGrocery[]>([])
    const handleSearch=(e:React.FormEvent)=>{
        e.preventDefault()
        const q=search.toLowerCase()
        setFiltered(
            groceries.filter((g)=>g.name.toLowerCase().includes(q)||g.category.toLowerCase().includes(q))
        )
    }
  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
      <motion.div
      initial={{opacity:0,x:-20}}
      animate={{opacity:1,x:0}}
      transition={{duration:0.4}}
      className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 text-center sm:text-left'
      >
        <button onClick={()=>router.back()} className='flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto '><ArrowLeft size={28}/></button>
        <h1 className='text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2'><Package size={18} className='text-green-700'/>Manage Grocery</h1>
      </motion.div>
      <motion.form
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.4}}
      className='flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hower:shadow-lg transition-all max-w-lg mx-auto w-full'
      onSubmit={handleSearch}
      >
        <Search className='h-5 w-5 mr-2 text-gray-700'/>
        <input type="text" className='w-full outline-none text-gray-700 placeholder-gray-400' placeholder='Search by name or category' onChange={(e)=>setSearch(e.target.value)} value={search}/>
      </motion.form>
      <div className='space-y-4'>
        {filtered.map((g,i)=>(
            <motion.div key={i}
            whileHover={{scale:1.01}}
            transition={{type:"spring",stiffness:100}}
            className='bg-white rounded-2xl shadow-md hover:hadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all'>
                <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200'>
                    <Image src={g.image} alt={g.name} fill className='object-cover hover:scale-110 transition-transform duration-500'/>
                </div>
                <div className='flex-1 flx flex-col justify-between w-full'>
                    <div>
                        <h3 className='font-semibold text-gray-800 text-lg truncate'>{g.name}</h3>
                        <p className='text-gray-500 text-sm capitalize'>{g.category}</p>
                    </div>
                    <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                        <p className='text-green-700 font-bold text-lg'>₹{g.price}/<span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span></p>
                        <button className='bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all' onClick={()=>{
                            setEditing(g)
                        }}>
                            <Pencil size={15}/> Edit
                        </button>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {editing&&<motion.div
        initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4'
        >
            <motion.div
            initial={{y:40,opacity:0}}
            animate={{y:0,opacity:1}}
            exit={{y:40,opacity:0}}
            transition={{duration:0.3}}
            className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-green-700 font-bold text-2xl'>Edit Grocery</h2>
                    <button className='text-gray-600 hover:text-red-600' onClick={()=>setEditing(null)}><X size={18}/></button>
                </div>
                <div className='relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group'>
                    {imagePreview&&<Image src={imagePreview} alt={editing.name} fill className='object-cover'/>}
                    <label htmlFor='imageUpload' className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity'><Upload size={28} className='text-green-500'/></label>
                    <input type="file" accept='image/*' hidden id='imageUpload' onChange={handleImageUpload}/>
                </div>
                <div className='space-y-4'>
                    <input type="text" placeholder='Ebter grocery name' onChange={(e)=>{
                        setEditing({...editing,name:e.target.value})
                    }} value={editing.name} className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'/>
                    <select className='w-full border border-gray-300
                    rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-400
                    bg-white ' value={editing.category} onChange={(e)=>{
                        setEditing({...editing,category:e.target.value})
                    }}>
                        <option>Select Category</option>
                        {categories.map((c,i)=>(
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                    <input type="text" placeholder='Ebter grocery price' onChange={(e)=>{
                        setEditing({...editing,price:e.target.value})
                    }} value={editing.price} className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'/>
                    <select className='w-full border border-gray-300
                    rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-400
                    bg-white ' value={editing.unit} onChange={(e)=>{
                        setEditing({...editing,unit:e.target.value})
                    }}>
                        <option>Select unit</option>
                        {units.map((c,i)=>(
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className='flex justify-end gap-3 mt-6'>
                <button className='px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white items-center flex gap-2 transition-all' disabled={loading} onClick={handleEdit}>{loading?<Loader className='w-5 h-5 text-center animate-spin'/>:"Edit Grocery"}</button>
                <button className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white items-center flex gap-2 transition-all' disabled={loading} onClick={handleDelete}>{loading?<Loader className='w-5 h-5 text-center animate-spin'/>:"Delete Grocery"}</button>
                </div>
            </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default page
