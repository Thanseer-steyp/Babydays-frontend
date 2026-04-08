import Hero from "@/components/screens/home/Hero";
import Home from "@/components/Home";

export const metadata = {
  title: "Premium Baby Products | Pillows, Swaddles & More",
  description: "Discover our range of premium baby products — head pillows, swaddle wraps, sherpa sleepers & more.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <div>
      <Hero />
      <Home />
      <a href="/deals"><img src="/images/deals/hotdeal.png" alt="hotdeal" /></a>
    </div>
  );
}


