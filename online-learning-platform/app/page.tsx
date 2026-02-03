import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
// import { FaShoppingCart } from 'react-icons/fa';


export default function Home() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Hi</h2>
      <Button>Add To Cart</Button>
      
      <UserButton />
    </div>
            
  );
}
