"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  image: string;
  alt: string;
  href: string;
}

const slides: HeroSlide[] = [
  { image: "/hero/gu10-lights.webp", alt: "GU10 LED Lighting, Focused Light, Brilliant Performance", href: "/shop/gu10-downlights" },
  { image: "/hero/e27-lights.png", alt: "E27 Frosted LED Bulbs, Everyday Light, Exceptional Comfort", href: "/shop/led-frosted-bulbs" },
  { image: "/hero/candle-bulbs.png", alt: "E14 Candle LED Bulbs, Elegant Shape, Beautiful Light", href: "/shop/led-candle-bulbs" },
  { image: "/hero/downlights.png", alt: "GU10 Downlights, Designed to Fit, Built to Shine", href: "/shop/gu10-downlights" },
  { image: "/hero/security-alarms.webp", alt: "Smoke & Carbon Monoxide Alarms, Protection You Can Trust", href: "/shop/smart-gadgets" },
  { image: "/hero/b22-bulbs.png", alt: "B22 Frosted LED Bulbs, Soft Light, Powerful Performance", href: "/shop/led-frosted-bulbs" },
];

const AUTOPLAY_MS = 5000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, index]);

  function handlePrev() {
    setDirection(-1);
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function handleNext() {
    setDirection(1);
    setIndex((current) => (current + 1) % slides.length);
  }

  function handleDot(i: number) {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  }

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-[#f3e4d4]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[7/5] max-h-[640px] w-full">
        <AnimatePresence custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Link href={slide.href} className="block h-full w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : undefined}
                sizes="100vw"
                className="object-cover"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/40 to-transparent py-4">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => handleDot(i)}
                suppressHydrationWarning
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span className="relative h-2.5 w-2.5">
                  <span
                    className={`absolute inset-0 rounded-full transition-colors ${
                      i === index ? "bg-gold-500" : "bg-white/50 group-hover:bg-white/70"
                    }`}
                  />
                  {i === index && (
                    <motion.span
                      layoutId="hero-dot-ring"
                      className="absolute -inset-1 rounded-full ring-2 ring-gold-500/40"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              suppressHydrationWarning
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              suppressHydrationWarning
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
