import Image from "next/image";
import Link from "next/link";

import Chat from "@/components/chat"; // Import the Chat component
export default function Home() {
  return (

<div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
            <Chat />
          </div>
  );
}
