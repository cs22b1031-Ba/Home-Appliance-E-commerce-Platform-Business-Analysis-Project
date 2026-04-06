"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/toast-provider";

type Review = {
  id: number;
  rating: number;
  comment: string;
  name: string;
  createdAt: string;
};

export default function ReviewsPanel({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [authed, setAuthed] = useState(false);
  const { pushToast } = useToast();

  const load = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
  };

  useEffect(() => {
    load();
  }, [productId]);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuthed(Boolean(data?.user));
    };
    checkAuth();
  }, []);

  const submit = async () => {
    setStatus("Submitting...");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setStatus(payload.message ?? "Failed to submit review.");
      return;
    }
    setComment("");
    setRating(5);
    setStatus("Review submitted.");
    pushToast("Review submitted");
    await load();
  };

  return (
    <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Reviews
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Customer feedback</h2>
        </div>
        {!authed ? (
          <Link
            href="/auth"
            className="rounded-full border border-[rgba(90,70,52,0.3)] px-4 py-2 text-xs font-semibold text-[var(--umber)]"
          >
            Sign in to review
          </Link>
        ) : null}
      </div>

      {authed ? (
        <div className="mt-4 grid gap-3 text-sm">
          <label className="flex flex-col gap-2">
            Rating
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
              rows={3}
            />
          </label>
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white"
          >
            Submit review
          </button>
          {status ? <p className="text-xs text-[var(--umber)]">{status}</p> : null}
        </div>
      ) : null}

      <div className="mt-6 space-y-3 text-sm">
        {reviews.length === 0 ? (
          <p className="text-[var(--umber)]">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            >
              <div className="flex items-center justify-between text-xs text-[var(--umber)]">
                <span>{review.name}</span>
                <span>{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p className="mt-1 text-sm font-semibold">
                {"★".repeat(review.rating)}{" "}
                <span className="text-[var(--umber)]">
                  {"☆".repeat(5 - review.rating)}
                </span>
              </p>
              <p className="mt-2 text-sm text-[var(--umber)]">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
