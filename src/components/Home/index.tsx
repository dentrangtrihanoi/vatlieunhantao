import dynamic from "next/dynamic";
import Hero from "./Hero";
import FooterFeature from "./Hero/FooterFeature";
import NewArrival from "./NewArrivals";

const PromoBanner = dynamic(() => import("./PromoBanner"), { ssr: true });
const BestSeller = dynamic(() => import("./BestSeller"), { ssr: true });
const CountDown = dynamic(() => import("./Countdown"), { ssr: true });
const Testimonials = dynamic(() => import("./Testimonials"), { ssr: true });
const HomeBlog = dynamic(() => import("./Blog"), { ssr: true });

const Home = () => {
  return (
    <main>
      <Hero />
      <FooterFeature />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CountDown />
      <Testimonials />
      <HomeBlog />
    </main>
  );
};

export default Home;
