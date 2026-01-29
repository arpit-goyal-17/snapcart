import { auth } from "@/auth";
import AdminDashboard from "@/components/adminDashboard";
import DeliveryBoyDashBoard from "@/components/deliveryBoyDashBoard";
import EditMobileRole from "@/components/EditMobileRole";
import Nav from "@/components/nav";
import UserDashboard from "@/components/userDashboard";
import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
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
  return (
    <>
    <Nav user={plainUser}/>
    {user.role=="user"?(<UserDashboard />)
    :(user.role=="admin"?(<AdminDashboard />):(<DeliveryBoyDashBoard />))}
    </>
  );
}
