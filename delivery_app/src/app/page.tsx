import { auth } from "@/auth";
import AdminDashboard from "@/components/adminDashboard";
import CategorySlider from "@/components/categorySlider";
import DeliveryBoyDashBoard from "@/components/deliveryBoyDashBoard";
import EditMobileRole from "@/components/EditMobileRole";
import Footer from "@/components/Footer";
import GeoUpdate from "@/components/GeoUpdate";
import GroceryItemCard from "@/components/GroceryItemCard";
import Nav from "@/components/nav";
import UserDashboard from "@/components/userDashboard";
import connectdb from "@/lib/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home(props:{
  searchParams:Promise<{q:string}>
}) {
  const searchParams=await props.searchParams
  let groceryList:IGrocery[]=[]
  await connectdb()
  const session=await auth()
  const user=await User.findById(session?.user?.id)
  if(!user){
    redirect('/login')
  }
  const inComplete=!user.mobile || !user.role ||(!user.mobile&&user.role=='user')
  if(inComplete)
    return <EditMobileRole />
  const plainUser=JSON.parse(JSON.stringify(user))
  if(user.role=='user'){
    if(searchParams.q){
      groceryList=await Grocery.find({
        $or:[
          {name:{$regex:searchParams.q||"",$options:"i"}},
          {catgory:{$regex:searchParams.q||"",$options:"i"}}
        ]
      })
    }
    else{
      groceryList=await Grocery.find({})
    }
  }
  return (
    <>
    <Nav user={plainUser}/>
    <GeoUpdate userId={plainUser._id}/>
    {user.role=="user"?(<><UserDashboard groceryList={groceryList}/></>)
    :(user.role=="admin"?(<AdminDashboard />):(<DeliveryBoyDashBoard />))}
    <Footer />
    </>
  );
}
