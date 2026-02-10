import Home from "@/components/Home";

export const revalidate = 60;

export default async function HomePage() {
  return <Home />;
}
