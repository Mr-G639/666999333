import Carousel from "@/components/carousel";
import { useAtomValue } from "jotai";
import { bannersState } from "@/state";
import { loadable } from "jotai/utils";

const loadableBannersState = loadable(bannersState);

export default function Banners() {
  const bannersLoadable = useAtomValue(loadableBannersState);

  if (bannersLoadable.state === 'loading') {
    return <div className="w-full h-32 bg-gray-200 rounded"></div>; // Simple skeleton
  }

  if (bannersLoadable.state === 'hasError') {
    console.error("Error loading banners:", bannersLoadable.error);
    return <div>Error loading banners.</div>; // Basic error message
  }

  return (
    <Carousel
      slides={bannersLoadable.data.map((banner) => (
        <img key={banner} className="w-full rounded" src={banner} />
      ))}
    />
  );
}
