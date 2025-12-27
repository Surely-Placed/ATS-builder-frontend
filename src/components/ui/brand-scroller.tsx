"use client";

import { 
  SiGoogle, 
  SiSpotify, 
  SiAmazon, 
  SiMeta, 
  SiApple, 
  SiNetflix,
  SiTesla,
  SiAdobe,
  SiSalesforce,
  SiOracle,
  SiNvidia,
  SiIntel
} from "react-icons/si";

export const BrandScroller = () => {
  return (
    <div className="group flex overflow-hidden py-4 [--gap:3rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row"
            key={i}
          >
            <div className="flex items-center w-36 gap-3">
              <SiGoogle size={28} className="text-[#4285F4]" />
              <p className="text-xl font-semibold opacity-70">Google</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiSpotify size={28} className="text-[#1DB954]" />
              <p className="text-xl font-semibold opacity-70">Spotify</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiAmazon size={28} className="text-[#FF9900]" />
              <p className="text-xl font-semibold opacity-70">Amazon</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiMeta size={28} className="text-[#0668E1]" />
              <p className="text-xl font-semibold opacity-70">Meta</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiApple size={28} className="text-foreground opacity-70" />
              <p className="text-xl font-semibold opacity-70">Apple</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiNetflix size={28} className="text-[#E50914]" />
              <p className="text-xl font-semibold opacity-70">Netflix</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiTesla size={28} className="text-[#E82127]" />
              <p className="text-xl font-semibold opacity-70">Tesla</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiAdobe size={28} className="text-[#FF0000]" />
              <p className="text-xl font-semibold opacity-70">Adobe</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiSalesforce size={28} className="text-[#00A1E0]" />
              <p className="text-xl font-semibold opacity-70">Salesforce</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiOracle size={28} className="text-[#F80000]" />
              <p className="text-xl font-semibold opacity-70">Oracle</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiNvidia size={28} className="text-[#76B900]" />
              <p className="text-xl font-semibold opacity-70">Nvidia</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiIntel size={28} className="text-[#0071C5]" />
              <p className="text-xl font-semibold opacity-70">Intel</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export const BrandScrollerReverse = () => {
  return (
    <div className="group flex overflow-hidden py-4 [--gap:3rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row"
            key={i}
          >
            <div className="flex items-center w-36 gap-3">
              <SiGoogle size={28} className="text-[#4285F4]" />
              <p className="text-xl font-semibold opacity-70">Google</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiSpotify size={28} className="text-[#1DB954]" />
              <p className="text-xl font-semibold opacity-70">Spotify</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiAmazon size={28} className="text-[#FF9900]" />
              <p className="text-xl font-semibold opacity-70">Amazon</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiMeta size={28} className="text-[#0668E1]" />
              <p className="text-xl font-semibold opacity-70">Meta</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiApple size={28} className="text-foreground opacity-70" />
              <p className="text-xl font-semibold opacity-70">Apple</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiNetflix size={28} className="text-[#E50914]" />
              <p className="text-xl font-semibold opacity-70">Netflix</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiTesla size={28} className="text-[#E82127]" />
              <p className="text-xl font-semibold opacity-70">Tesla</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiAdobe size={28} className="text-[#FF0000]" />
              <p className="text-xl font-semibold opacity-70">Adobe</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiSalesforce size={28} className="text-[#00A1E0]" />
              <p className="text-xl font-semibold opacity-70">Salesforce</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiOracle size={28} className="text-[#F80000]" />
              <p className="text-xl font-semibold opacity-70">Oracle</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiNvidia size={28} className="text-[#76B900]" />
              <p className="text-xl font-semibold opacity-70">Nvidia</p>
            </div>
            <div className="flex items-center w-36 gap-3">
              <SiIntel size={28} className="text-[#0071C5]" />
              <p className="text-xl font-semibold opacity-70">Intel</p>
            </div>
          </div>
        ))}
    </div>
  );
};
