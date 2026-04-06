"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";

const items = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Search" },
  { href: "/cart", label: "Cart" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthed(Boolean(data?.user));
    };
    load();
  }, []);

  const accountHref = authed ? "/account" : "/auth";

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-white/40 bg-[rgba(247,243,238,0.92)] backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-2 text-[11px] font-semibold text-[var(--umber)]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              pathname === item.href ? "text-[var(--ink)]" : ""
            }`}
          >
            <span>{item.label}</span>
            {item.href === "/cart" ? (
              <span className="rounded-full border border-[rgba(90,70,52,0.2)] px-2 py-0.5 text-[10px]">
                {itemCount}
              </span>
            ) : null}
          </Link>
        ))}
        <Link
          href={accountHref}
          className={`flex flex-col items-center gap-1 ${
            pathname === accountHref ? "text-[var(--ink)]" : ""
          }`}
        >
          <span>{authed ? "Account" : "Sign in"}</span>
        </Link>
      </div>
    </nav>
  );
}
