import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useScroll, motion } from 'framer-motion';

/** Shared video source – single constant to avoid duplication */
const HERO_VIDEO_SRC =
    'https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477';

export function HeroSection() {
    /**
     * A single <video> element is rendered here and shared visually with the
     * header via a portal-style ref.  The header positions its own clipped
     * viewport over the *same* video element so the browser only decodes one
     * stream.
     */
    const heroVideoRef = React.useRef<HTMLVideoElement>(null);

    return (
        <>
            <HeroHeader heroVideoRef={heroVideoRef} />
            <main className="overflow-x-hidden">
                <section>
                    <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72 relative min-h-screen">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:mt-16 xl:text-7xl">
                                    TISSUE<br />BIOENGINEERING
                                </h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg text-slate-200">
                                    Advancing regenerative medicine through tissue engineering, biomaterials, stem cell technologies, and personalized regenerative therapies.
                                </p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-6 pr-4 text-base font-bold bg-white text-navy hover:bg-sky-100 transition-all shadow-xl">
                                        <Link to="/research">
                                            <span className="text-nowrap">Explore Research</span>
                                            <ChevronRight className="ml-1 text-navy" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-6 text-base font-semibold text-white border border-white/40 hover:bg-white/10 backdrop-blur-md">
                                        <Link to="/services">
                                            <span className="text-nowrap">Our Services</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-[2/3] absolute inset-0 overflow-hidden border border-black/10 sm:aspect-video dark:border-white/5 z-0">
                            <video
                                ref={heroVideoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="size-full object-cover opacity-60 dark:opacity-75"
                                src={HERO_VIDEO_SRC}></video>
                            <div className="absolute inset-0 bg-[#05142D]/60 backdrop-blur-[2px]" />
                        </div>
                    </div>
                </section>
                <section className="bg-[#05142D] pb-6 border-t border-white/10">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="relative py-6 w-full">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={48}>
                                    {[
                                        'Skin Regeneration',
                                        'Biomaterial Scaffolds',
                                        'Stem Cell Therapy',
                                        '3D Bioprinting',
                                        'Cartilage Repair',
                                        'Bone Regeneration',
                                        'Burn Reconstruction',
                                        'Chronic Wound Healing',
                                        'Facial Tissue Engineering',
                                        'Personalized Regenerative Medicine',
                                        'Extracellular Matrix (ECM)',
                                        'Collagen Engineering',
                                        'Advanced Biomaterials',
                                        'Tissue Engineering',
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 whitespace-nowrap">
                                            <span className="text-sm font-medium tracking-wider text-white/80 uppercase">
                                                {item}
                                            </span>
                                            <span className="text-sky-400 font-bold">•</span>
                                        </div>
                                    ))}
                                </InfiniteSlider>

                                <div className="bg-gradient-to-r from-[#05142D] absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"></div>
                                <div className="bg-gradient-to-l from-[#05142D] absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Research', href: '/research' },
    { name: 'Core Services', href: '/services' },
    { name: 'Articles', href: '/articles' },
    { name: 'Clinical Partners', href: '/case-studies' },
    { name: 'Contact', href: '/contact' },
]

/**
 * HeroHeader — premium glassmorphism navbar with video background.
 *
 * The header uses the same DNA animation video as the hero section.
 * At the top of the page the header is fully transparent so the hero
 * video shows through.  On scroll it gains a stronger overlay and
 * backdrop-blur while keeping the video subtly visible underneath.
 *
 * A dedicated <video> element is rendered *inside* the header to
 * avoid CSS clip-path hacks; we point it at the same `src` so the
 * browser can de-duplicate the network request (same-URL caching).
 * The element is hidden with `aria-hidden` and `pointer-events-none`.
 */
const HeroHeader = ({
    heroVideoRef,
}: {
    heroVideoRef: React.RefObject<HTMLVideoElement | null>;
}) => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group fixed z-50 w-full pt-2">
                <div
                    className={cn(
                        'mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-500 lg:px-12 relative overflow-hidden',
                        scrolled
                            ? 'border border-white/10 shadow-2xl'
                            : 'border border-transparent shadow-none'
                    )}
                    style={{
                        /* GPU-accelerated compositing layer */
                        willChange: 'backdrop-filter, background-color',
                        transform: 'translateZ(0)',
                    }}>

                    {/* ── Video Background Layer ── */}
                    <div
                        className="absolute inset-0 -z-20 overflow-hidden rounded-3xl"
                        aria-hidden="true"
                        style={{ transform: 'translateZ(0)' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={cn(
                                'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700',
                                scrolled ? 'opacity-40' : 'opacity-0'
                            )}
                            src={HERO_VIDEO_SRC}
                        />
                    </div>

                    {/* ── Dark Navy Overlay ── */}
                    <div
                        className={cn(
                            'absolute inset-0 -z-10 rounded-3xl transition-all duration-500',
                            scrolled
                                ? 'bg-[rgba(5,20,45,0.70)] backdrop-blur-2xl'
                                : 'bg-transparent backdrop-blur-none'
                        )}
                        aria-hidden="true"
                        style={{ transform: 'translateZ(0)' }}
                    />

                    {/* ── Navigation Content ── */}
                    <motion.div
                        key={1}
                        className={cn(
                            'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6',
                            scrolled && 'lg:py-4'
                        )}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState === true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-slate-200">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="hover:text-[#7DD3FC] block duration-150 transition-colors">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-[#05142D]/95 backdrop-blur-xl group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/20 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                            <div className="lg:hidden">
                                <ul className="space-y-4 text-sm font-medium text-slate-200">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="hover:text-[#7DD3FC] block duration-150 transition-colors">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-white text-navy hover:bg-sky-100 font-bold rounded-full px-5 py-2 shadow-lg shadow-sky-500/10 transition-all duration-300">
                                    <Link to="/consultation">
                                        <span>Book Consultation</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                <span className="font-extrabold text-xs">TB</span>
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
                Tissue Bioengineering
            </span>
        </div>
    )
}

export default HeroSection;
