import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-[var(--night)] text-[var(--mist)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-lg text-white">Lunor Atelier</h3>
          <p className="mt-3 text-sm text-[rgba(232,224,211,0.8)]">
            Curated appliances and furniture for gallery-grade interiors. Every
            piece is vetted for longevity, texture, and presence.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-white">Concierge</p>
          <ul className="mt-3 space-y-2 text-[rgba(232,224,211,0.8)]">
            <li>Design advisory sessions</li>
            <li>White-glove delivery</li>
            <li>Extended warranties</li>
            <li>Trade partnerships</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-white">Navigate</p>
          <div className="mt-3 flex flex-col gap-2 text-[rgba(232,224,211,0.8)]">
            <Link href="/products">Collections</Link>
            <Link href="/products?category=living-room">Living Room</Link>
            <Link href="/products?category=bedroom">Bedroom</Link>
            <Link href="/products?category=kitchen">Kitchen</Link>
            <Link href="/products?category=home-office">Home Office</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-[rgba(232,224,211,0.6)]">
        © 2026 Lunor Atelier. All rights reserved.
      </div>
    </footer>
  );
}
