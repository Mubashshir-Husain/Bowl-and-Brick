import React, { useEffect, useRef, useState } from 'react'
import RestaurantHeader from '../../components/customer/RestaurantHeader'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL 

/* =========================================================
   ANIMATION STYLES (no Tailwind config changes needed)
========================================================= */
const animationStyles = `
  :root { --ease-out: cubic-bezier(0.22, 1, 0.36, 1); }

  /* ---- Hero load sequence ---- */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes kenBurns {
    from { transform: scale(1.12); }
    to   { transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes growLine {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes floatArrow {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }
  @keyframes softPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200, 169, 107, 0.35); }
    50%      { box-shadow: 0 0 0 10px rgba(200, 169, 107, 0); }
  }

  .hero-bg      { animation: kenBurns 18s var(--ease-out) both; }
  .hero-overlay { animation: fadeIn 1.4s ease-out both; }
  .hero-item    { opacity: 0; animation: heroFadeUp 1s var(--ease-out) forwards; }
  .hero-d1 { animation-delay: 0.15s; }
  .hero-d2 { animation-delay: 0.35s; }
  .hero-d3 { animation-delay: 0.55s; }
  .hero-d4 { animation-delay: 0.75s; }
  .hero-d5 { animation-delay: 0.95s; }

  .scroll-hint { animation: floatArrow 2.2s ease-in-out infinite; }
  .cta-pulse   { animation: softPulse 2.8s ease-in-out infinite; }

  /* ---- Scroll reveal ---- */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out);
    will-change: opacity, transform;
  }
  .reveal-left  { transform: translateX(-40px); }
  .reveal-right { transform: translateX(40px); }
  .reveal-zoom  { transform: scale(0.96); }
  .reveal.is-visible { opacity: 1; transform: none; }

  /* ---- Ornamental divider ---- */
  .divider-line {
    transform: scaleX(0);
    transition: transform 1s var(--ease-out) 0.3s;
  }
  .is-visible .divider-line { transform: scaleX(1); }
  .divider-line.origin-right { transform-origin: right; }
  .divider-line.origin-left  { transform-origin: left; }

  /* ---- Button shine sweep ---- */
  .btn-shine {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    isolation: isolate;
    transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out),
                background-color 0.3s ease, color 0.3s ease;
  }
  .btn-shine::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
    transform: translateX(-120%);
  }
  .btn-shine:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(200,169,107,0.55); }
  .btn-shine:hover::after { transform: translateX(120%); transition: transform 0.8s var(--ease-out); }
  .btn-shine:active { transform: translateY(0) scale(0.98); }

  /* ---- Animated underline link ---- */
  .link-underline {
    cursor: pointer;
    background-image: linear-gradient(currentColor, currentColor);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 0% 1px;
    transition: background-size 0.5s var(--ease-out), color 0.3s ease;
  }
  .link-underline:hover { background-size: 100% 1px; }

  /* ---- Cards ---- */
  .dish-card {
    transition: transform 0.5s var(--ease-out), border-color 0.4s ease, box-shadow 0.5s var(--ease-out);
  }
  .dish-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 40px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,169,107,0.25);
  }
  .dish-card .dish-arrow { transition: transform 0.4s var(--ease-out); }
  .dish-card:hover .dish-arrow { transform: translateX(6px); }

  /* ---- Icons ---- */
  .icon-pop { transition: transform 0.5s var(--ease-out), color 0.3s ease; }
  .feature-item:hover .icon-pop { transform: translateY(-4px) scale(1.15); }
  .ring-icon { transition: transform 0.5s var(--ease-out), background-color 0.4s ease, color 0.4s ease; }
  .bottom-item:hover .ring-icon { transform: rotate(360deg) scale(1.05); background-color: #C8A96B; color: #100C09; }
  .feature-item { transition: background-color 0.4s ease; }
  .feature-item:hover { background-color: rgba(200,169,107,0.05); }

  /* ---- Story image ---- */
  .story-img { transition: transform 1.6s var(--ease-out); }
  .story-wrap:hover .story-img { transform: scale(1.06); }

  /* ---- Accessibility ---- */
  a:focus-visible, button:focus-visible {
    outline: 2px solid #C8A96B;
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal, .hero-item, .hero-bg, .hero-overlay, .divider-line,
    .scroll-hint, .cta-pulse, .story-img, .dish-card {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`

/* =========================================================
   ANIMATION HELPERS (UI only — no data logic)
========================================================= */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // animate once
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0, variant = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${variant ? `reveal-${variant}` : ''} ${
        inView ? 'is-visible' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Counts up numbers like "50+", "10+", "4.8/5" when scrolled into view
function CountUp({ value, duration = 1600 }) {
  const [ref, inView] = useInView(0.4)
  const text = String(value)
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[1]) : null
  const suffix = match ? match[2] : ''
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || target === null) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(target)
      return
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration])

  if (target === null) return <span ref={ref}>{text}</span>
  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* =========================================================
   PAGE
========================================================= */
export default function Home() {
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/restaurant/info`),
          fetch(`${BACKEND_URL}/api/menu`),
        ])

        if (restaurantRes.ok) {
          const restaurantData = await restaurantRes.json()
          setRestaurant(restaurantData)
        }

        if (menuRes.ok) {
          const menuData = await menuRes.json()

          // Handle both direct array and { data: [] } response
          const items = Array.isArray(menuData)
            ? menuData
            : menuData.data || []

          setMenuItems(items)
        }
      } catch (error) {
        console.error('Home data error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const signatureDishes = menuItems.slice(0, 5)

  return (
    <div className="min-h-screen scroll-smooth bg-[#100C09] text-[#F7F4ED]">

      <style>{animationStyles}</style>

      {/* Header */}
      <RestaurantHeader />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg"
            alt="Bowl and Brick food"
            className="hero-bg h-full w-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#100C09] via-[#100C09]/85 to-[#100C09]/30" />

          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20 lg:px-10">

          <div className="max-w-2xl">

            <p className="hero-item hero-d1 mb-5 text-sm font-medium uppercase tracking-[0.35em] text-[#C8A96B]">
              Welcome to {restaurant?.name || 'Bowl and Brick'}
            </p>

            <h1 className="font-serif text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="hero-item hero-d2 block">AUTHENTIC.</span>
              <span className="hero-item hero-d3 block text-[#C8A96B]">
                FRESH.
              </span>
              <span className="hero-item hero-d4 block">
                UNFORGETTABLE.
              </span>
            </h1>

            <p className="hero-item hero-d4 mt-7 max-w-lg text-base leading-7 text-[#EEEEEE]/80 sm:text-lg">
              Experience delicious food, carefully prepared with quality
              ingredients, rich flavours and a passion for great dining.
            </p>

            <div className="hero-item hero-d5 mt-9 flex flex-wrap gap-4">

              <a
                onClick={()=> navigate('/menu')}
                className="btn-shine cta-pulse rounded-sm bg-[#C8A96B] px-7 py-3.5 text-sm font-semibold text-[#100C09] hover:bg-[#D8BB7C]"
              >
                Explore Menu
              </a>

              <a
                onClick={()=> navigate('/menu')}
                className="btn-shine group rounded-sm border border-[#C8A96B]/70 px-7 py-3.5 text-sm font-semibold text-[#F7F4ED] hover:bg-[#C8A96B] hover:text-[#100C09]"
              >
                Order Now
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </a>

            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-item hero-d5 pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
          <div className="scroll-hint text-xl text-[#C8A96B]/70">⌄</div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="border-y border-[#C8A96B]/20 bg-[#130F0C]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#C8A96B]/20 lg:grid-cols-4">

          <Feature
            delay={0}
            icon="✦"
            title="FRESH & QUALITY"
            description="Only quality ingredients used in every dish."
          />

          <Feature
            delay={120}
            icon="♨"
            title="EXPERT CHEFS"
            description="Delicious food prepared with care and expertise."
          />

          <Feature
            delay={240}
            icon="◈"
            title="AUTHENTIC RECIPES"
            description="Traditional flavours made for modern dining."
          />

          <Feature
            delay={360}
            icon="♡"
            title="MADE WITH LOVE"
            description="Every dish is prepared with passion and care."
          />

        </div>

      </section>

      {/* ================= SIGNATURE DISHES ================= */}
      <section
        id="menu"
        className="bg-[#100C09] px-6 py-20 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">

          <Reveal className="mb-12 text-center">

            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-[#C8A96B]">
              Discover Our Menu
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl">
              Signature Dishes
            </h2>

            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <span className="divider-line origin-right h-px w-12 bg-[#C8A96B]" />
              <span className="text-[#C8A96B]">◆</span>
              <span className="divider-line origin-left h-px w-12 bg-[#C8A96B]" />
            </div>

          </Reveal>

          {loading ? (
            <div className="py-16 text-center text-[#EEEEEE]/60 animate-pulse">
              Loading our delicious menu...
            </div>
          ) : signatureDishes.length === 0 ? (
            <Reveal className="rounded-lg border border-[#C8A96B]/20 bg-[#15110E] py-16 text-center">
              <p className="text-[#EEEEEE]/60">
                Our menu is currently being prepared.
              </p>
            </Reveal>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

              {signatureDishes.map((item, index) => (

                <Reveal key={item._id || index} delay={index * 110} variant="zoom">
                  <DishCard
                    item={item}
                    index={index}
                  />
                </Reveal>

              ))}

            </div>
          )}

          {/* View Full Menu */}
          <Reveal className="mt-10 text-center" delay={200}>

            <a
              onClick={()=> navigate('/menu')}
              className="link-underline group inline-flex items-center gap-2 pb-1 text-sm font-medium text-[#C8A96B] hover:text-[#F7F4ED]"
            >
              View Full Menu
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>

          </Reveal>

        </div>

      </section>

      {/* ================= STORY ================= */}
      <section className="bg-[#15110E]">

        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">

          {/* Image */}
          <Reveal variant="left" className="story-wrap relative min-h-[450px] overflow-hidden">

            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh food at Bowl and Brick"
              className="story-img absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#100C09]/20" />

          </Reveal>

          {/* Content */}
          <div className="flex items-center px-8 py-16 sm:px-12 lg:px-16">

            <Reveal variant="right" delay={150} className="max-w-xl">

              <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-[#C8A96B]">
                Our Story
              </p>

              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
                A Taste of
                <span className="block text-[#C8A96B]">
                  Tradition
                </span>
              </h2>

              <p className="mt-6 leading-7 text-[#EEEEEE]/70">
                At {restaurant?.name || 'Bowl and Brick'}, we believe that
                great food is more than just a meal. It is about bringing
                people together around flavours, memories and experiences.
              </p>

              <p className="mt-4 leading-7 text-[#EEEEEE]/70">
                From carefully selected ingredients to every dish that reaches
                your table, we put quality and passion at the heart of
                everything we serve.
              </p>

              <a
                onClick={() => navigate('/menu')}
                className="btn-shine mt-8 inline-block rounded-sm bg-[#C8A96B] px-7 py-3.5 text-sm font-semibold text-[#100C09] hover:bg-[#D8BB7C]"
              >
                Explore Our Menu
              </a>

            </Reveal>

          </div>

        </div>

      </section>

      {/* ================= RESTAURANT STATS ================= */}
      <section className="border-y border-[#C8A96B]/20 bg-[#100C09]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#C8A96B]/20 sm:grid-cols-4">

          <Stat
            delay={0}
            number="1000+"
            label="Happy Customers"
          />

          <Stat
            delay={120}
            number={`${menuItems.length || '50'}+`}
            label="Delicious Dishes"
          />

          <Stat
            delay={240}
            number="10+"
            label="Years of Excellence"
          />

          <Stat
            delay={360}
            number="4.8/5"
            label="Customer Rating"
          />

        </div>

      </section>

      {/* ================= BOTTOM FEATURES ================= */}
      <section className="bg-[#130F0C] px-6 py-14 lg:px-10">

        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">

          <BottomFeature
            delay={0}
            icon="♧"
            title="FRESH INGREDIENTS"
            description="Quality ingredients selected for every dish."
          />

          <BottomFeature
            delay={120}
            icon="▣"
            title="SAFE & CLEAN"
            description="Clean preparation and hygienic dining experience."
          />

          <BottomFeature
            delay={240}
            icon="₹"
            title="EASY PAYMENT"
            description="Simply enjoy your meal and pay at the counter."
          />

          <BottomFeature
            delay={360}
            icon="♡"
            title="GREAT SERVICE"
            description="We are here to make your dining experience special."
          />

        </div>

      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden px-6 py-20 text-center">

        <div className="absolute inset-0 bg-[#C8A96B]/5" />

        <Reveal className="relative mx-auto max-w-3xl">

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#C8A96B]">
            Hungry Yet?
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl">
            Good Food Is Waiting For You
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[#EEEEEE]/65">
            Explore our menu, choose your favourites and place your order
            directly from your table.
          </p>

          <a
            onClick={() => navigate('/menu')}
            className="btn-shine group mt-8 inline-block rounded-sm bg-[#C8A96B] px-8 py-4 text-sm font-semibold text-[#100C09] hover:bg-[#D8BB7C]"
          >
            Explore Menu
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </a>

        </Reveal>

      </section>

      {/* Footer */}
      <Reveal>
        <footer className="border-t border-[#C8A96B]/20 bg-[#0B0806] px-6 py-8 text-center">

          <p className="font-serif text-xl text-[#C8A96B]">
            {restaurant?.name || 'Bowl and Brick'}
          </p>

          <p className="mt-2 text-xs text-[#EEEEEE]/50">
            Crafted with passion. Served with love.
          </p>

          {restaurant?.address && (
            <p className="mt-2 text-xs text-[#EEEEEE]/40">
              {restaurant.address}
            </p>
          )}

        </footer>
      </Reveal>

    </div>
  )
}


/* =========================================================
   COMPONENTS
========================================================= */

function Feature({ icon, title, description, delay = 0 }) {
  return (
    <Reveal delay={delay} className="feature-item px-5 py-8 text-center sm:px-8">

      <div className="icon-pop mb-4 text-3xl text-[#C8A96B]">
        {icon}
      </div>

      <h3 className="text-xs font-semibold tracking-[0.12em] text-[#F7F4ED]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-[220px] text-xs leading-5 text-[#EEEEEE]/55">
        {description}
      </p>

    </Reveal>
  )
}


function DishCard({ item, index }) {
  const fallbackImages = [
    'https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg',
    'https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg',
    'https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg',
    'https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg',
    'https://i.pinimg.com/1200x/b0/85/d4/b085d4c9f72701890ba49f6b7b0ce67e.jpg',
  ]

  const image =
    item.image ||
    item.imageUrl ||
    item.photo ||
    fallbackImages[index % fallbackImages.length]

  return (
    <div className="dish-card group h-full overflow-hidden rounded-md border border-[#C8A96B]/15 bg-[#15110E] hover:border-[#C8A96B]/50">

      {/* Image */}
      <div className="relative h-48 overflow-hidden">

        <img
          src={image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-80" />

        {item.available === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full border border-white/30 bg-black/60 px-3 py-1 text-xs text-white">
              Currently Unavailable
            </span>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="p-4">

        <div className="flex items-start justify-between gap-2">

          <h3 className="font-serif text-lg text-[#F7F4ED] transition-colors duration-300 group-hover:text-[#C8A96B]">
            {item.name}
          </h3>

          {item.type && (
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ${
                item.type.toLowerCase() === 'veg'
                  ? 'border-[#8FA28A] bg-[#8FA28A]'
                  : 'border-red-400 bg-red-400'
              }`}
            />
          )}

        </div>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#EEEEEE]/55">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">

          <span className="text-sm font-semibold text-[#C8A96B]">
            ₹{item.price}
          </span>

          <a
            href={`/customer/dish/${item._id}`}
            className="dish-arrow text-lg text-[#C8A96B]"
          >
            →
          </a>

        </div>

      </div>

    </div>
  )
}


function Stat({ number, label, delay = 0 }) {
  return (
    <Reveal delay={delay} className="px-4 py-10 text-center">

      <div className="font-serif text-3xl text-[#C8A96B] sm:text-4xl">
        <CountUp value={number} />
      </div>

      <p className="mt-2 text-xs uppercase tracking-wider text-[#EEEEEE]/55">
        {label}
      </p>

    </Reveal>
  )
}


function BottomFeature({ icon, title, description, delay = 0 }) {
  return (
    <Reveal delay={delay} className="bottom-item flex gap-4">

      <div className="ring-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C8A96B]/40 text-xl text-[#C8A96B]">
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-[#F7F4ED]">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#EEEEEE]/50">
          {description}
        </p>
      </div>

    </Reveal>
  )
}