"use client";

import { useEffect } from "react";

export default function MotionEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.94) {
        item.classList.add("is-visible");
      }
    });
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });

    let frame = 0;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty("--page-progress", String(Math.min(Math.max(progress, 0), 1)));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
      root.style.removeProperty("--page-progress");
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  );
}
