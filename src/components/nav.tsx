"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { useEffect, useState } from "react";

const links = [
  { href: "/products", label: "Collections" },
  { href: "/products?category=living-room", label: "Living" },
  { href: "/products?category=bedroom", label: "Bedroom" },
  { href: "/products?category=kitchen", label: "Kitchen" },
  { href: "/products?category=home-office", label: "Office" },
];

export default function Nav() {
  const pathname = usePathname();
  const { itemCount, saved } = useCart();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthed(Boolean(data?.user));
    };
    load();
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/40 bg-[rgba(247,243,238,0.86)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/company-icon.svg"
            alt="Lunor Atelier icon"
            width={40}
            height={40}
            className="h-8 w-8 rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
            priority
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--umber)] sm:text-xs sm:tracking-[0.3em]">
              Lunor Atelier
            </p>
            <p className="text-sm font-semibold sm:text-lg">Premium Home</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-[var(--umber)] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-[var(--ink)] ${
                pathname === link.href ? "text-[var(--ink)]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/saved"
            className={`transition hover:text-[var(--ink)] ${
              pathname === "/saved" ? "text-[var(--ink)]" : ""
            }`}
          >
            Saved ({saved.length})
          </Link>
          <Link
            href={authed ? "/account" : "/auth"}
            className={`transition hover:text-[var(--ink)] ${
              pathname === "/account" || pathname === "/auth"
                ? "text-[var(--ink)]"
                : ""
            }`}
          >
            {authed ? "Account" : "Sign in"}
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/cart"
            className="rounded-full border border-[rgba(90,70,52,0.2)] px-3 py-1.5 text-xs font-semibold text-[var(--umber)] transition hover:border-[var(--bronze)] sm:px-4 sm:py-2 sm:text-sm"
          >
            Cart ({itemCount})
          </Link>
        </div>
      </div>
    </nav>
  );
}
