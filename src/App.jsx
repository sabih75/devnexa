import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Menu, 
  X, 
  ArrowDown,
  Mail,
  Smartphone,
  Globe
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let Lenis;
try {
  Lenis = require('@studio-freight/lenis').default;
} catch (e) {
  Lenis = null;
}

// --- Grid Background (Light Theme - Visible Gray Lines) ---
const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Main vertical grid lines - Light gray for white bg */}
      <div className="absolute inset-0 flex justify-between px-12 md:px-24 opacity-[0.15]">
        {[...Array(5)].map((_, i) => (
          <div key={`v-${i}`} className="w-px h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
        ))}
      </div>
      
      {/* Main horizontal grid lines */}
      <div className="absolute inset-0 opacity-[0.1]">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute w-full h-px bg-neutral-400" 
            style={{ top: `${(i + 1) * 12}%` }} 
          />
        ))}
      </div>

      {/* Fine grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Accent lines - Blue/Green for DevNexa branding */}
      <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent opacity-60" />
      <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-green-400/30 to-transparent opacity-60" />
    </div>
  );
};

// --- Custom Cursor (Dark for white bg) ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    setIsVisible(true);

    const moveCursor = (e) => {
      if (cursorRef.current && dotRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out"
        });
        gsap.to(dotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1
        });
      }
    };

    const handleEnter = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { scale: 2, duration: 0.3 });
    };
    const handleLeave = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', moveCursor);
    
    setTimeout(() => {
      const clickables = document.querySelectorAll('a, button, input, textarea, select');
      clickables.forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    }, 1000);

    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Dark cursor for white background */}
      <div ref={cursorRef} className="fixed w-10 h-10 border border-neutral-900 rounded-full pointer-events-none z-[9999] hidden md:block -translate-x-1/2 -translate-y-1/2" />
      <div ref={dotRef} className="fixed w-1 h-1 bg-neutral-900 rounded-full pointer-events-none z-[9999] hidden md:block -translate-x-1/2 -translate-y-1/2" />
    </>
  );
};

// --- 3D Background (Subtle for light theme) ---
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !mountRef.current) return;

    let scene, camera, renderer, particles;
    let animationId;
    let mouseX = 0, mouseY = 0;

    try {
      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new window.THREE.BufferGeometry();
      const count = 400;
      const positions = new Float32Array(count * 3);
      
      for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 30;
        positions[i3 + 1] = (Math.random() - 0.5) * 30;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;
      }
      
      geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
      
      // Light gray particles for white bg
      const material = new window.THREE.PointsMaterial({
        size: 0.05,
        color: 0xcccccc,
        transparent: true,
        opacity: 0.3,
      });
      
      particles = new window.THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 10;

      const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      
      document.addEventListener('mousemove', handleMouseMove, { passive: true });

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (particles) {
          particles.rotation.y += 0.001;
          particles.rotation.x += (mouseY * 0.5 - particles.rotation.x) * 0.02;
          particles.rotation.y += (mouseX * 0.5 - particles.rotation.y) * 0.02;
        }
        renderer.render(scene, camera);
      };
      
      animate();

      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (mountRef.current && renderer?.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error('Three.js error:', err);
    }
  }, [loaded]);

  return <div ref={mountRef} className="fixed inset-0 z-0 opacity-50 pointer-events-none" />;
};

// --- Text Reveal ---
const RevealText = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    gsap.fromTo(ref.current,
      { y: "100%" },
      {
        y: "0%",
        duration: 1.2,
        delay: delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, [delay]);

  return (
    <div className="overflow-hidden">
      <div ref={ref} className={className}>
        {children}
      </div>
    </div>
  );
};

// --- Project Card ---
const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(cardRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    const img = cardRef.current.querySelector('img');
    if (img) {
      gsap.to(img, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  const isEven = index % 2 === 0;

  return (
    <article ref={cardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-32 relative z-10">
      <div className={`overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 group cursor-pointer border border-neutral-200 shadow-sm">
          <img 
            src={project.img} 
            alt={project.title}
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      </div>

      <div className={`space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1 lg:text-right'}`}>
        <div className={`flex items-center gap-4 text-sm text-neutral-500 tracking-widest uppercase ${isEven ? '' : 'lg:justify-end'}`}>
          <span className="text-neutral-600">{project.cat}</span>
          <span className="w-12 h-px bg-neutral-300" />
          <span className="text-neutral-400">2024</span>
        </div>
        
        <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-neutral-900 group-hover:text-blue-600 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-neutral-600 text-lg leading-relaxed max-w-md">
          {project.desc}
        </p>

        <div className={`pt-4 ${isEven ? '' : 'lg:text-right'}`}>
          <button 
            onClick={onClick}
            className="inline-flex items-center gap-2 text-neutral-900 border-b border-neutral-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors group/link"
          >
            View Project 
            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

// --- Main App ---
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!Lenis) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const portfolioItems = [
    { id: 1, cat: 'Web Development', title: 'FinTech Dashboard', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80', desc: 'Real-time financial analytics platform handling millions of transactions daily with high-frequency trading capabilities.' },
    { id: 2, cat: 'Mobile App', title: 'HealthTrack', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80', desc: 'AI-powered fitness tracking ecosystem built for iOS and Android with seamless wearable integration.' },
    { id: 3, cat: 'Brand Identity', title: 'E-Commerce Elite', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80', desc: 'High-conversion Shopify solution with custom checkout flow and inventory management system.' },
    { id: 4, cat: '3D Experience', title: 'NeonBrand', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80', desc: 'Complete corporate rebranding with WebGL immersive experiences and motion design language.' },
  ];

  const filteredPortfolio = activeTab === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.cat.toLowerCase().includes(activeTab));

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div className="bg-white text-neutral-900 min-h-screen w-full overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <CustomCursor />
      <ThreeBackground />
      <GridBackground />

      {/* Navigation - Light Theme */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
      <a href="#" className="flex items-center gap-1 text-2xl font-bold tracking-tighter text-neutral-900 hover:text-blue-600 transition-colors z-50 group">
  <img 
    src="/logo.png" 
    alt="DevNexa Logo" 
    className="h-14 w-auto object-contain"
  />
  <span className="-ml-1">devnexa<span className="text-blue-600">.</span></span>
</a>     
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-widest uppercase text-neutral-600 hover:text-neutral-900 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-600 transition-all group-hover:w-full" />
                </a>
              ))}
              <button 
                onClick={scrollToContact}
                className="px-6 py-2 border border-neutral-900 text-neutral-900 text-sm tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-neutral-900 hover:text-blue-600 transition-colors z-50 relative"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Light */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-700 ease-in-out md:hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col justify-center items-center gap-8 pt-20">
          {navLinks.map((item, i) => (
            <a 
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-5xl font-bold tracking-tighter text-neutral-900 hover:text-blue-600 transition-colors"
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Hero Section - Light */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 pb-12 relative">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <RevealText delay={0.2}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-4 text-neutral-900">
              Digital
            </h1>
          </RevealText>
          
          <RevealText delay={0.3}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-4 text-transparent stroke-text-light">
              Excellence
            </h1>
          </RevealText>
          
          <RevealText delay={0.4}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none text-blue-600 mb-12">
              Agency
            </h1>
          </RevealText>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-12">
            <RevealText delay={0.5}>
              <p className="max-w-md text-lg text-neutral-600 leading-relaxed">
                We are DevNexa, a creative technology studio crafting digital experiences that merge art with functionality. Based in Lahore, working globally.
              </p>
            </RevealText>
            
            <RevealText delay={0.6}>
              <div className="flex items-center gap-2 text-sm tracking-widest uppercase text-neutral-500">
                <span>Scroll to explore</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12 py-12 relative z-10">
        <div className="h-px bg-neutral-200 w-full" />
      </div>

      {/* Introduction */}
      <section id="about" className="px-6 md:px-12 py-24 md:py-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RevealText>
            <p className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-neutral-600">
              We're the founder & creative directors at <span className="text-neutral-900 font-semibold">DevNexa</span>, a studio that builds and runs its own digital products – and occasionally works with partners such as <span className="text-blue-600 font-semibold">NASA</span> and <span className="text-green-600 font-semibold">Fortune 500</span> brands to transform their digital presence.
            </p>
          </RevealText>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-12 relative z-10">
        <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
          <RevealText>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900">Selected Work</h2>
          </RevealText>
          <span className="text-neutral-500 tracking-widest text-sm">(2023—2024)</span>
        </div>

        <div className="h-px bg-neutral-200 mx-6 md:mx-12 mb-24" />

        <div className="px-6 md:px-12 mb-16 flex gap-4 flex-wrap">
          {['all', 'web', 'app', 'branding'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium tracking-wider uppercase transition-all border ${
                activeTab === tab 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-6 md:px-12">
          {filteredPortfolio.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onClick={scrollToContact} />
          ))}
        </div>
      </section>

      {/* Services Marquee - Light */}
      <section id="services" className="py-24 overflow-hidden border-y border-neutral-200 my-24 relative z-10 bg-neutral-50">
        <div className="flex whitespace-nowrap">
          <div className="flex gap-12 text-6xl md:text-8xl font-bold tracking-tighter text-neutral-200 animate-marquee">
            <span>Web Development</span>
            <span className="text-neutral-300">•</span>
            <span>Mobile Apps</span>
            <span className="text-neutral-300">•</span>
            <span>Brand Identity</span>
            <span className="text-neutral-300">•</span>
            <span>AI Solutions</span>
            <span className="text-neutral-300">•</span>
            <span>Web Development</span>
            <span className="text-neutral-300">•</span>
            <span>Mobile Apps</span>
            <span className="text-neutral-300">•</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 md:px-12 py-32 md:py-48 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <RevealText>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-neutral-900">
                  Let's work<br />
                  <span className="text-blue-600">together</span>
                </h2>
              </RevealText>
              
              <RevealText>
                <p className="text-xl text-neutral-600 mb-8 max-w-md">
                  Have a project in mind? We'd love to hear about it. Get in touch and let's create something extraordinary.
                </p>
              </RevealText>
              
              <div className="space-y-4">
                <RevealText>
                  <a href="mailto:hello@devnexa.dev" className="flex items-center gap-4 text-neutral-600 hover:text-neutral-900 transition-colors group">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-lg">hello@devnexa.dev</span>
                  </a>
                </RevealText>
                <RevealText>
                  <a href="tel:+923003386392" className="flex items-center gap-4 text-neutral-600 hover:text-neutral-900 transition-colors group">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <span className="text-lg">+92 300 3386392</span>
                  </a>
                </RevealText>
                <RevealText>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <Globe className="w-5 h-5 text-neutral-400" />
                    <span className="text-lg">DHA Phase 2, Lahore</span>
                  </div>
                </RevealText>
              </div>

              <div className="flex gap-6 mt-12">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                  <RevealText key={social} delay={i * 0.1}>
                    <a href="#" className="text-sm tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900 pb-1">
                      {social}
                    </a>
                  </RevealText>
                ))}
              </div>
            </div>

            <div className="lg:pt-24">
              <form
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Message sent! We will get back to you soon.');
                  formRef.current.reset();
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-neutral-500 mb-2 text-sm tracking-wider uppercase">Name</label>
                    <input
                      type="text"
                      name="user_name"
                      required
                      className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-900 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-neutral-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-neutral-500 mb-2 text-sm tracking-wider uppercase">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      required
                      className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-900 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-neutral-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-neutral-500 mb-2 text-sm tracking-wider uppercase">Subject</label>
                  <select
                    name="subject"
                    className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-900 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option className="bg-white text-neutral-900">Web Development</option>
                    <option className="bg-white text-neutral-900">Mobile App</option>
                    <option className="bg-white text-neutral-900">Branding</option>
                    <option className="bg-white text-neutral-900">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-neutral-500 mb-2 text-sm tracking-wider uppercase">Message</label>
                  <textarea
                    rows="4"
                    name="message"
                    required
                    className="w-full bg-transparent border-b border-neutral-300 py-3 text-neutral-900 focus:border-blue-600 focus:outline-none transition-colors resize-none placeholder:text-neutral-400"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="group flex items-center gap-3 text-neutral-900 border border-neutral-900 px-8 py-4 rounded-full hover:bg-neutral-900 hover:text-white transition-all duration-300 mt-8" 
                >
                  Send Message
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-neutral-200 relative z-10 bg-neutral-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-sm tracking-wider">
          <p>© 2024 DevNexa. All rights reserved.</p>
          <p>Designed & Built with passion</p>
        </div>
      </footer>

      <style>{`
        .stroke-text-light {
          -webkit-text-stroke: 2px #171717;
          -webkit-text-fill-color: transparent;
        }
        @media (min-width: 768px) {
          .stroke-text-light {
            -webkit-text-stroke: 3px #171717;
          }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
        ::selection {
          background: #2563EB;
          color: #fff;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f5f5f5;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2563EB;
        }
        html {
          background-color: #fff;
        }
        body {
          background-color: #fff;
          color: #171717;
        }
      `}</style>
    </div>
  );
}