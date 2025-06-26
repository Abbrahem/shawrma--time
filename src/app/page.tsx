import Hero from "@/components/Hero";
import MenuCategories from "@/components/MenuCategories";
import About from "@/components/About";
import DeliverySection from "@/components/DeliverySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <MenuCategories />
      <About />
      <DeliverySection />
      <Footer />
    </main>
  );
}
