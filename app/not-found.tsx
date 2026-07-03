'use client';

import { useAppStore } from "@/providers/store-provider";
import { Button } from "antd";
import Image from "next/image";

const NotFound = () => {
  const { user } = useAppStore((state) => state);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1>404</h1>
      <h3>Page not found</h3>
      <Image src="/404b.png" alt="404" width={350} height={100} className="h-auto" />
      <Button href={user ? "/dashboard" : "/"} type="link">
        Go to Home page
      </Button>
    </div>
  );
};
export default NotFound;