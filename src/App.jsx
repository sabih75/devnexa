import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Mail
} from 'lucide-react';

/**
 * DEVNEXA - Professional Digital Agency Website
 * Built with React, Tailwind CSS, and Three.js for 3D effects.
 */

// --- 3D Background Component (Three.js) ---
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Dynamically load Three.js from CDN if not already present
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    
    script.onload = () => {
      initThreeJS();
    };
    
    document.body.appendChild(script);

    let scene, camera, renderer, particles, animationId;

    const initThreeJS = () => {
      if (!mountRef.current || !window.THREE) return;

      // Scene Setup
      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Particles
      const geometry = new window.THREE.BufferGeometry();
      const count = 700;
      const positions = new Float32Array(count * 3);
      
      for(let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20; // Spread
      }
      
      geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
      
      const isLight = document.documentElement.classList.contains('light');

const material = new window.THREE.PointsMaterial({
  size: 0.05,
  color: isLight ? 0x6366f1 : 0x0ea5e9,
  transparent: true,
  opacity: isLight ? 0.25 : 0.8,
});

      
      particles = new window.THREE.Points(geometry, material);
      scene.add(particles);
      
      camera.position.z = 5;

      // Mouse Interaction
      let mouseX = 0;
      let mouseY = 0;
      
      const handleMouseMove = (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
      };
      
      document.addEventListener('mousemove', handleMouseMove);

      // Animation Loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        if (particles) {
          particles.rotation.y += 0.001;
          particles.rotation.x += 0.001;
          
          // Gentle sway based on mouse
          particles.rotation.x += mouseY * 0.05;
          particles.rotation.y += mouseX * 0.05;
        }

        renderer.render(scene, camera);
      };
      
      animate();

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    };

    return () => {
      if (mountRef.current) mountRef.current.innerHTML = ''; 
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
};

// --- Reusable Components ---

const SectionHeader = ({ title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : 'text-left'} reveal-on-scroll`}>
    <h3 className="text-sky-400 font-bold tracking-widest uppercase text-sm mb-2">{subtitle}</h3>
    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
      {title}
    </h2>
    <div className={`h-1 w-20 bg-gradient-to-r from-sky-500 to-indigo-600 mt-4 rounded-full ${center ? 'mx-auto' : ''}`}></div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-sky-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 overflow-hidden reveal-on-scroll">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-sky-500/30">
        <Icon className="w-7 h-7 text-sky-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-sky-500/30 transition-all reveal-on-scroll">
    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-2">
      {number}
    </div>
    <div className="text-slate-400 font-medium">{label}</div>
  </div>
);

const NavLink = ({ href, children, mobile = false, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className={`${mobile ? 'block w-full py-4 text-center text-xl border-b border-slate-800' : 'text-sm font-medium'} text-slate-300 hover:text-white transition-colors relative group`}
  >
    {children}
    {!mobile && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>}
  </a>
);

// --- Main Application Component ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
const [theme, setTheme] = useState('dark');

useEffect(() => {
  document.documentElement.classList.toggle('light', theme === 'light');
}, [theme]);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

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
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center transform rotate-3">
                <Code className="text-white w-6 h-6" />
              </div>
<span className="text-2xl font-bold tracking-tight">
  DEV<span className="text-sky-500">NEXA</span>
</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink href="#home">Home</NavLink>
                <NavLink href="#about">About</NavLink>
                <NavLink href="#services">Services</NavLink>
                <NavLink href="#work">Our Work</NavLink>
                <a href="#contact" className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-full transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40">
                  Get Started
                </a>
              </div>
            </div>
<button
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  className="px-4 py-2 rounded-full border transition-all
bg-[var(--card)] text-[var(--text)] border-[var(--border)]"

>
  {theme === 'dark' ? 'Light Mode ' : 'Dark Mode '}
</button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 absolute top-20 left-0 w-full h-screen p-4 flex flex-col items-center animate-fade-in-down">
            <NavLink href="#home" mobile onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink href="#about" mobile onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink href="#services" mobile onClick={() => setIsMenuOpen(false)}>Services</NavLink>
            <NavLink href="#work" mobile onClick={() => setIsMenuOpen(false)}>Work</NavLink>
            <NavLink href="#contact" mobile onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <ThreeBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-sm font-semibold tracking-wide mb-6">
              INNOVATE • CONNECT • LEAD
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Unleash Your
Creativity with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                DevNexa              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
Empowering your business with cutting-edge development solutions. From app development to digital marketing, we've got you covered!            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 group">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary px-8 py-4 rounded-full font-bold text-lg">
  View Portfolio
</button>

            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-sky-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* About Section (Storytelling) */}
      <section id="about" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative reveal-on-scroll">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl opacity-30 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team Collaboration" 
                className="relative rounded-2xl shadow-2xl border border-slate-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">5+ Years</div>
                    <div className="text-slate-400 text-sm">Experience</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-on-scroll">
              <h3 className="text-sky-400 font-bold uppercase tracking-wider mb-2">Who We Are</h3>
              <h2 className="text-4xl font-bold text-white mb-6">Architects of the <br/>Digital Realm</h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                At DEVNEXA, we don't just write code; we craft experiences. Founded by a team of visionary developers and designers, our mission is to bridge the gap between complex technology and human-centric design.
              </p>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                We believe that every brand has a story waiting to be told. Through immersive 3D web design, seamless mobile applications, and strategic branding, we turn your vision into a digital reality that resonates with your audience.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-sky-400" />
                  <span className="text-white font-medium">Fast Performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-sky-400" />
                  <span className="text-white font-medium">Global Reach</span>
                </div>
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-sky-400" />
                  <span className="text-white font-medium">AI Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-sky-400" />
                  <span className="text-white font-medium">24/7 Support</span>
                </div>
              </div>

              <a href="#about" className="text-sky-400 font-semibold hover:text-sky-300 flex items-center gap-2 group">
                Learn more about our journey <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="150+" label="Projects Delivered" />
            <StatCard number="98%" label="Client Satisfaction" />
            <StatCard number="12+" label="Awards Won" />
            <StatCard number="24/7" label="Support System" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-950">
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
              icon={Rocket}
              title="Digital Branding"
              description="Complete brand identity packages, from logo design to brand voice, ensuring you stand out."
            />
            <ServiceCard 
              icon={Code}
              title="Content Writing"
              description="Engaging, SEO-optimized content that converts visitors."
            />
            <ServiceCard 
              icon={MessageSquare}
              title="Digital Marketing"
              description="Data-driven strategies including SEO, content marketing, and social media management."
            />
          </div>
        </div>
      </section>

      {/* Portfolio / Work Section */}
      <section id="work" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Featured Projects" 
            subtitle="OUR WORK" 
          />

          {/* Filter Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap reveal-on-scroll">
            {['all', 'web', 'app', 'branding'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden cursor-pointer reveal-on-scroll">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <p className="text-sky-400 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center reveal-on-scroll">
             <button className="text-slate-300 hover:text-white font-medium border-b border-sky-500 pb-1">View All Projects</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center reveal-on-scroll">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Vision?</h2>
          <p className="text-sky-100 text-lg mb-10">
            Join the hundreds of businesses that have scaled their digital presence with DEVNEXA.
          </p>
          <button className="bg-white text-indigo-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-sky-50 transition-colors shadow-2xl">
            Schedule a Consultation
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="reveal-on-scroll">
              <h3 className="text-sky-400 font-bold uppercase tracking-wider mb-2">Get In Touch</h3>
              <h2 className="text-4xl font-bold text-white mb-6">Let's Build Something <br/>Amazing Together</h2>
              <p className="text-slate-400 mb-8">
                Have an idea? We would love to hear about it. Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-sky-400">
                    <Mail />
                  </div>
                  <div>
                    <div className="text-white font-medium">Email Us</div>
                    <div className="text-slate-400">devnexa.dev</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-sky-400">
                    <Smartphone />
                  </div>
                  <div>
                    <div className="text-white font-medium">Call Us</div>
                    <div className="text-slate-400">+92 300 3386392</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-sky-400">
                    <Globe />
                  </div>
                  <div>
                    <div className="text-white font-medium">Visit Us</div>
                    <div className="text-slate-400">DHA phase 2</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter className="w-5 h-5"/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Linkedin className="w-5 h-5"/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Github className="w-5 h-5"/></a>
              </div>
            </div>

            <form className="bg-slate-900 p-8 rounded-2xl border border-slate-800 reveal-on-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-slate-400 mb-2 text-sm">Name</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-2 text-sm">Email</label>
                  <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-slate-400 mb-2 text-sm">Subject</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors">
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>Branding</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-slate-400 mb-2 text-sm">Message</label>
                <textarea rows="4" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors" placeholder="Tell us about your project..."></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Code className="text-sky-500 w-5 h-5" />
            <span className="font-bold text-white">DEVNEXA &copy; 2024</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Tailwind & Custom Styles */}
<style jsx global>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg: #0f172a;
    --bg-soft: #020617;
    --card: #1e293b;
    --border: #334155;
    --text: #e5e7eb;
    --text-muted: #94a3b8;
    --scroll-track: #0f172a;
    --scroll-thumb: #334155;
  }

  /* LIGHT THEME */
  .light {
    --bg: #ffffff;
    --bg-soft: #f8fafc;
    --card: #f1f5f9;
    --border: #e2e8f0;
    --text: #0f172a;
    --text-muted: #475569;
    --scroll-track: #f1f5f9;
    --scroll-thumb: #cbd5e1;
  }

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

/* Buttons */
.btn-primary {
  background: linear-gradient(to right, #0ea5e9, #6366f1);
  color: white;
}

.btn-secondary {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
}

/* Navbar text fix */
.nav-link {
  color: var(--text-muted);
}
.nav-link:hover {
  color: var(--text);
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
      transform: translateY(20px);
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

  /* Scrollbar Styling (Theme Aware) */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--scroll-track);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #0ea5e9;
  }

/* ================================
   THEME OVERRIDES FOR TAILWIND
================================ */

/* BACKGROUNDS */
.light .bg-slate-900,
.light .bg-slate-950 {
  background-color: var(--bg) !important;
}

.light .bg-slate-900\/80 {
  background-color: rgba(255,255,255,0.85) !important;
}

.light .bg-slate-800,
.light .bg-slate-800\/50 {
  background-color: var(--card) !important;
}

/* TEXT */
.light .text-white {
  color: var(--text) !important;
}

.light .text-slate-400,
.light .text-slate-300 {
  color: var(--text-muted) !important;
}

/* BORDERS */
.light .border-slate-700,
.light .border-slate-800 {
  border-color: var(--border) !important;
}

/* INPUTS */
.light input,
.light textarea,
.light select {
  background-color: #ffffff !important;
  color: var(--text) !important;
  border-color: var(--border) !important;
}


`}</style>
   </div>
  );
}