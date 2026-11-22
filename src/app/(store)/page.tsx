import HeroSlider from "@/components/store/HeroSlider";
import JewelleryBagCollection from "@/components/store/JewelleryBagCollection";
import NewArrival from "@/components/store/NewArrival";
import ShopByCategory from "@/components/store/ShopByCategory";
import WomenCollection from "@/components/store/WomenCollection";
import MenCollection from "@/components/store/MenCollection";
import KidsCollection from "@/components/store/KidsCollection";
import ServiceFeatures from "@/components/store/ServiceFeatures";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ShopByCategory />
      <NewArrival />
      <WomenCollection />
      <MenCollection />
      <KidsCollection />
      <JewelleryBagCollection />
      <ServiceFeatures />
    </>
  );
}
