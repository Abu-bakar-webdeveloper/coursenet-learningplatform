import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="text-blue-600">Hello world</div>
      <UserButton  />
    </>
  );
}
