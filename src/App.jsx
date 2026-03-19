import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, 
  Smartphone, 
  Globe, 
  Cpu, 
  Rocket, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';

/**
 * DEVNEXA - Professional Digital Agency Website
 * Built with React, Tailwind CSS, and Three.js for 3D effects.
 * Theme: Blue, Green, Gray matching logo
 */

// --- 3D Background Component (Three.js) ---
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    
    script.onload = () => {
      initThreeJS();
    };
    
    document.body.appendChild(script);

    let scene, camera, renderer, particles, lines, animationId;

    const initThreeJS = () => {
      if (!mountRef.current || !window.THREE) return;

      // Scene Setup
      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // Create Particles with Blue/Green colors
      const geometry = new window.THREE.BufferGeometry();
      const count = 800;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      const color1 = new window.THREE.Color(0x3B82F6); // Blue
      const color2 = new window.THREE.Color(0x10B981); // Green
      
      for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 25;
        positions[i3 + 1] = (Math.random() - 0.5) * 25;
        positions[i3 + 2] = (Math.random() - 0.5) * 25;
        
        // Mix blue and green colors
        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      
      geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));
      
      const material = new window.THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: window.THREE.AdditiveBlending
      });
      
      particles = new window.THREE.Points(geometry, material);
      scene.add(particles);

      // Add connecting lines between nearby particles
      const lineMaterial = new window.THREE.LineBasicMaterial({
        color: 0x3B82F6,
        transparent: true,
        opacity: 0.15
      });

      camera.position.z = 8;

      // Mouse Interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      
      const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      
      document.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Scroll-based camera movement
      let scrollY = 0;
      const handleScroll = () => {
        scrollY = window.scrollY;
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Animation Loop
      const clock = new window.THREE.Clock();
      
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        if (particles) {
          // Gentle rotation
          particles.rotation.y = elapsedTime * 0.05;
          particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;
          
          // Mouse follow with smooth interpolation
          targetX = mouseX * 0.5;
          targetY = mouseY * 0.5;
          particles.rotation.y += (targetX - particles.rotation.y) * 0.02;
          particles.rotation.x += (targetY - particles.rotation.x) * 0.02;
          
          // Scroll-based vertical movement
          camera.position.y = -scrollY * 0.002;
        }

        renderer.render(scene, camera);
      };
      
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationId);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 opacity-60 pointer-events-none" />;
};

// --- Floating Orbs Background ---
const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
};

// --- Reusable Components ---

const SectionHeader = ({ title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : 'text-left'} reveal-on-scroll`}>
    <h3 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2">{subtitle}</h3>
    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
      {title}
    </h2>
    <div className={`h-1 w-20 bg-gradient-to-r from-blue-500 to-green-500 mt-4 rounded-full ${center ? 'mx-auto' : ''}`}></div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="service-card rounded-2xl p-8 transition-all reveal-on-scroll bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-blue-300/50">
    <div className="w-14 h-14 mb-6 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-slate-900">
      {title}
    </h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="stat-card text-center p-6 rounded-2xl transition-all bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
    <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
      {number}
    </div>
    <p className="mt-2 text-sm font-medium text-slate-500">
      {label}
    </p>
  </div>
);

const NavLink = ({ href, children, mobile = false, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className={`${mobile ? 'block w-full py-4 text-center text-xl border-b border-slate-200' : 'text-sm font-medium'} text-slate-600 hover:text-blue-600 transition-colors relative group`}
  >
    {children}
    {!mobile && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all group-hover:w-full"></span>}
  </a>
);

// --- Main Application Component ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const form = useRef();

const sendEmail = async (e) => {
  e.preventDefault();

  const formData = {
    name: form.current.user_name.value,
    email: form.current.user_email.value,
    subject: form.current.subject.value,
    message: form.current.message.value,
  };

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) form.current.reset();
  } catch (err) {
    alert("Failed to send message");
    console.error(err);
  }
};

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const portfolioItems = [
    { id: 1, cat: 'web', title: 'FinTech Dashboard', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', desc: 'Real-time financial analytics platform.' },
    { id: 2, cat: 'app', title: 'HealthTrack Mobile', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', desc: 'AI-powered fitness tracking app.' },
    { id: 3, cat: 'web', title: 'E-Commerce Elite', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', desc: 'High-conversion Shopify solution.' },
    { id: 4, cat: 'branding', title: 'NeonBrand Identity', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', desc: 'Complete corporate rebranding.' },
  ];

  const filteredPortfolio = activeTab === 'all' ? portfolioItems : portfolioItems.filter(item => item.cat === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 3D Background */}
      <ThreeBackground />
      <FloatingOrbs />
      
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-slate-200/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="DevNexa Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              devnexa<span className="text-green-500">.</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink href="#home">Home</NavLink>
                <NavLink href="#about">About</NavLink>
                <NavLink href="#services">Services</NavLink>
                <NavLink href="#work">Our Work</NavLink>
                <a href="#contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-full transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                  Get Started
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 p-2 transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg absolute top-20 left-0 w-full h-screen p-4 flex flex-col items-center animate-fade-in-down">
            <NavLink href="#home" mobile onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink href="#about" mobile onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink href="#services" mobile onClick={() => setIsMenuOpen(false)}>Services</NavLink>
            <NavLink href="#work" mobile onClick={() => setIsMenuOpen(false)}>Work</NavLink>
            <NavLink href="#contact" mobile onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block py-2 px-4 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-sm font-semibold tracking-wide mb-6">
              INNOVATE • CONNECT • LEAD
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Unleash Your<br />
              <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
                Digital Potential
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
              Empowering your business with cutting-edge development solutions. From app development to digital marketing, we've got you covered!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group hover:scale-105">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#work" className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-full font-bold text-lg transition-all flex items-center justify-center hover:shadow-lg">
                View Portfolio
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative reveal-on-scroll">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-20 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team Collaboration" 
                className="relative rounded-2xl shadow-2xl border border-slate-200/50"
              />
              <div className="absolute -bottom-6 -right-6 p-6 rounded-xl bg-white shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">5+ Years</div>
                    <div className="text-slate-500 text-sm">Experience</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-on-scroll">
              <h3 className="text-blue-500 font-bold uppercase tracking-wider mb-2">Who We Are</h3>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Architects of the <br/>Digital Realm</h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                At devnexa, we don't just write code; we craft experiences. Founded by a team of visionary developers and designers, our mission is to bridge the gap between complex technology and human-centric design.
              </p>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We believe that every brand has a story waiting to be told. Through immersive web design, seamless mobile applications, and strategic branding, we turn your vision into a digital reality.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-slate-900 font-medium">Fast Performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-slate-900 font-medium">Global Reach</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-slate-900 font-medium">AI Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-slate-900 font-medium">24/7 Support</span>
                </div>
              </div>

              <a href="#services" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
                Learn more about our journey <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="150+" label="Projects Delivered" />
            <StatCard number="98%" label="Client Satisfaction" />
            <StatCard number="12+" label="Awards Won" />
            <StatCard number="24/7" label="Support System" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Our Expertise" 
            subtitle="WHAT WE DO" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Globe}
              title="Web Development"
              description="Custom, high-performance websites built with React & Next.js. We focus on SEO, speed, and responsive design."
            />
            <ServiceCard 
              icon={Smartphone}
              title="App Development"
              description="Native and cross-platform mobile apps that provide seamless user experiences on iOS and Android."
            />
            <ServiceCard 
              icon={Cpu}
              title="AI Solutions"
              description="Integrate artificial intelligence to automate processes and enhance user decision-making capabilities."
            />
            <ServiceCard 
              icon={Layers}
              title="Digital Branding"
              description="Complete brand identity packages, from logo design to brand voice, ensuring you stand out."
            />
            <ServiceCard 
              icon={Code}
              title="Content Writing"
              description="Engaging, SEO-optimized content that converts visitors into loyal customers."
            />
            <ServiceCard 
              icon={TrendingUp}
              title="Digital Marketing"
              description="Data-driven strategies including SEO, content marketing, and social media management."
            />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Featured Projects" 
            subtitle="OUR WORK" 
          />

          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap reveal-on-scroll">
            {['all', 'web', 'app', 'branding'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPortfolio.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer reveal-on-scroll bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <p className="text-blue-400 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center reveal-on-scroll">
            <a href="#contact" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium border-b-2 border-blue-500 pb-1 transition-colors">
              View All Projects <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center reveal-on-scroll">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Vision?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Join the hundreds of businesses that have scaled their digital presence with devnexa.
          </p>
          <a href="#contact" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-2xl hover:scale-105 transition-transform">
            Schedule a Consultation
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="reveal-on-scroll">
              <h3 className="text-blue-500 font-bold uppercase tracking-wider mb-2">Get In Touch</h3>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Let's Build Something <br/>Amazing Together</h2>
              <p className="text-slate-600 mb-8">
                Have an idea? We would love to hear about it. Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Email Us</div>
                    <div className="text-slate-500">hello@devnexa.dev</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Call Us</div>
                    <div className="text-slate-500">+92 300 3386392</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Visit Us</div>
                    <div className="text-slate-500">DHA Phase 2, Lahore</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <a href="#" className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-all hover:scale-110">
                  <Twitter className="w-5 h-5"/>
                </a>
                <a href="https://www.linkedin.com/company/99885845/" className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5"/>
                </a>
                <a href="#" className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all hover:scale-110">
                  <Github className="w-5 h-5"/>
                </a>
              </div>
            </div>

            <form
              ref={form}
              onSubmit={sendEmail}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 reveal-on-scroll"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-slate-600 mb-2 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-slate-600 mb-2 text-sm font-medium">Subject</label>
                <select
                  name="subject"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                >
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>Branding</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-slate-600 mb-2 text-sm font-medium">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50" 
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-500 w-5 h-5" />
            <span className="font-bold text-white">devnexa &copy; 2024</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        /* Scroll Reveal Animations */
        .reveal-on-scroll {
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3B82F6, #10B981);
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563EB, #059669);
        }

        /* Selection */
        ::selection {
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
