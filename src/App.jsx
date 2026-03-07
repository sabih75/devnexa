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
import emailjs from "@emailjs/browser";

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
const form = useRef();

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
  <div className="service-card rounded-2xl p-8 transition-all reveal-on-scroll">
      <div className="w-12 h-12 mb-6 rounded-xl flex items-center justify-center service-icon">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-semibold mb-3 service-title">
        {title}
      </h3>

      <p className="service-description leading-relaxed">
        {description}
      </p>
    </div>
);

const StatCard = ({ number, label }) => (
  <div className="stat-card text-center p-6 rounded-2xl transition-all">
    <div className="text-4xl font-extrabold text-sky-400">
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
const form = useRef();
const verifyEmailAPI = async (email) => {
  const response = await fetch(`https://api.mailboxlayer.com/check?access_key=YOUR_KEY&email=${email}`);
  const data = await response.json();
  return data.format_valid && data.mx_found && data.smtp_check;
};

const sendEmail = async (e) => {
  e.preventDefault();

  const emailValue = form.current.user_email.value.trim();

  // 1️⃣ Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailValue)) {
    alert("Please enter a valid email format.");
    return;
  }

  try {
    // 2️⃣ Verify email existence using API
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_API_KEY&email=${emailValue}`
    );
    const data = await response.json();

    if (!data.is_valid_format.value || !data.deliverability || data.is_disposable_email.value) {
      alert("Please enter a real, valid email address.");
      return;
    }

    // 3️⃣ If email is valid, send via EmailJS
    emailjs
      .sendForm(
        "service_devnexa",
        "template_6ca97nb",
        form.current,
        "O3sDnGpVcn78rGBN1"
      )
      .then(
        () => {
          alert("Message sent successfully!");
          form.current.reset();
        },
        () => {
          alert("Failed to send message");
        }
      );

  } catch (error) {
    console.error("Email verification failed:", error);
    alert("Error verifying email. Please try again later.");
  }
};

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

  const applyTheme = (e) => {
    if (e.matches) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };
  

  // Initial check
  applyTheme(mediaQuery);

  // Listen for system changes
  mediaQuery.addEventListener('change', applyTheme);

  return () => {
    mediaQuery.removeEventListener('change', applyTheme);
  };
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
<div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
  <div className="w-12 h-12 flex items-center justify-center">
    <img
      src="/logo.png"
      alt="DevNexa Logo"
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>

   {/* Brand Text */}
  <span
    className="
      text-2xl font-extrabold tracking-tight
      bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600
      bg-clip-text text-transparent
    "
  >
    DEVNEXA
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
              <span className="text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600
      bg-clip-text text-transparent">
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
              <div className="experience-card absolute -bottom-6 -right-6 p-6 rounded-xl border shadow-xl hidden md:block">
  <div className="flex items-center gap-4">
    <div className="bg-green-500/20 p-3 rounded-full">
      <CheckCircle2 className="w-8 h-8 text-green-500" />
    </div>
    <div>
      <div className="text-2xl font-bold experience-title">5+ Years</div>
      <div className="experience-subtitle text-sm">Experience</div>
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
<section className="py-12 border-y border-slate-800 bg-transparent">
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
      className={`filter-tab px-6 py-2 rounded-full text-sm font-medium transition-all ${
        activeTab === tab ? 'filter-tab-active' : ''
      }`}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>


          {/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {filteredPortfolio.map((item) => (
    <div
      key={item.id}
      className="group relative rounded-2xl overflow-hidden cursor-pointer reveal-on-scroll"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Overlay */}
      <div className="portfolio-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
        <h3 className="portfolio-title text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {item.title}
        </h3>
        <p className="portfolio-desc translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {item.desc}
        </p>
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
<div className="icon-circle w-12 h-12 rounded-full flex items-center justify-center text-sky-400">
                    <Mail />
                  </div>
                  <div>
                    <div className="text-white font-medium">Email Us</div>
                    <div className="text-slate-400">devnexa.dev</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
<div className="icon-circle w-12 h-12 rounded-full flex items-center justify-center text-sky-400">
                    <Smartphone />
                  </div>
                  <div>
                    <div className="text-white font-medium">Call Us</div>
                    <div className="text-slate-400">+92 300 3386392</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
<div className="icon-circle w-12 h-12 rounded-full flex items-center justify-center text-sky-400">
                    <Globe />
                  </div>
                  <div>
                    <div className="text-white font-medium">Visit Us</div>
                    <div className="text-slate-400">DHA phase 2</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <a href="#" className="icon-circle w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"><Twitter className="w-5 h-5"/></a>
                <a href="https://www.linkedin.com/company/99885845/admin/dashboard/" className="icon-circle w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"><Linkedin className="w-5 h-5"/></a>
                <a href="#" className="icon-circle w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"><Github className="w-5 h-5"/></a>
              </div>
            </div>

            <form
  ref={form}
  onSubmit={sendEmail}
  className="bg-slate-900 p-8 rounded-2xl border border-slate-800 reveal-on-scroll"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="block text-slate-400 mb-2 text-sm">Name</label>
      <input
        type="text"
        name="user_name"
        required
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors"
        placeholder="John Doe"
      />
    </div>

    <div>
      <label className="block text-slate-400 mb-2 text-sm">Email</label>
      <input
        type="email"
        name="user_email"
        required
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors"
        placeholder="john@example.com"
      />
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-slate-400 mb-2 text-sm">Subject</label>
    <select
      name="subject"
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors"
    >
      <option>Web Development</option>
      <option>Mobile App</option>
      <option>Branding</option>
      <option>Other</option>
    </select>
  </div>

  <div className="mb-6">
    <label className="block text-slate-400 mb-2 text-sm">Message</label>
    <textarea
      rows="4"
      name="message"
      required
      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none transition-colors"
      placeholder="Tell us about your project..."
    ></textarea>
  </div>

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all" onClick={(e)=> sendEmail(e)}
  >
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
/* NAVBAR LIGHT MODE FIX */
.light nav {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.light nav a {
  color: #0f172a !important;
}

.light nav a:hover {
  color: #2563eb !important;
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

/* ================================
   STAT CARDS – THEME PERFECT
================================ */

/* ================================
   STAT CARDS – FINAL THEME FIX
================================ */

/* DARK MODE (DEFAULT) */
.stat-card {
  background-color: #0f172a; /* slate-900 */
  border: 1px solid #1e293b; /* slate-800 */
  box-shadow: none;
}

/* LIGHT MODE – PURE WHITE + SHADOW */
.light .stat-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.08),
    0 4px 10px rgba(15, 23, 42, 0.05);
}

/* Hover effect (both themes) */
.stat-card:hover {
  transform: translateY(-6px);
}

/* Hover glow (light mode only) */
.light .stat-card:hover {
  box-shadow:
    0 18px 40px rgba(56, 189, 248, 0.18),
    0 8px 20px rgba(15, 23, 42, 0.08);
  border-color: #38bdf8;
}
/* ================================
   EXPERIENCE FLOATING CARD
================================ */

/* DARK MODE (default) */
.experience-card {
  background-color: #1e293b; /* slate-800 */
  border: 1px solid #334155; /* slate-700 */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.experience-title {
  color: #ffffff;
}

.experience-subtitle {
  color: #94a3b8; /* slate-400 */
}

/* LIGHT MODE */
.light .experience-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 14px 35px rgba(15, 23, 42, 0.12),
    0 6px 14px rgba(15, 23, 42, 0.08);
}

.light .experience-title {
  color: #0f172a;
}

.light .experience-subtitle {
  color: #475569;
}

/* ================================
   SERVICE CARDS – THEME PERFECT
================================ */

/* DARK MODE (default) */
.service-card {
  background-color: #1e293b; /* slate-800 */
  border: 1px solid #334155;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.service-title {
  color: #ffffff;
}

.service-description {
  color: #94a3b8; /* slate-400 */
}

.service-icon {
  background-color: #020617; /* slate-950 */
  color: #38bdf8;
}

/* LIGHT MODE */
.light .service-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 16px 40px rgba(15, 23, 42, 0.12),
    0 6px 16px rgba(15, 23, 42, 0.08);
}

.light .service-title {
  color: #0f172a;
}

.light .service-description {
  color: #475569;
}

.light .service-icon {
  background-color: #f8fafc;
  color: #0ea5e9;
}

/* Hover polish */
.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 55px rgba(56, 189, 248, 0.25);
  border-color: #38bdf8;
}
/* ================================
   FILTER TABS – THEME PERFECT
================================ */

/* DEFAULT (Dark Mode) */
.filter-tab {
  background-color: #1e293b; /* slate-800 */
  color: #94a3b8; /* slate-400 */
  border: 1px solid #334155;
}

.filter-tab:hover {
  background-color: #334155;
  color: #ffffff;
}

/* ACTIVE TAB (Both Themes) */
.filter-tab-active {
  background: linear-gradient(to right, #0ea5e9, #6366f1);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 30px rgba(56, 189, 248, 0.35);
}

/* LIGHT MODE */
.light .filter-tab {
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.light .filter-tab:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

/* Light mode active stays brand */
.light .filter-tab-active {
  background: linear-gradient(to right, #0ea5e9, #6366f1);
  color: #ffffff;
  box-shadow: 0 12px 35px rgba(56, 189, 248, 0.35);
}

/* ================================
   PORTFOLIO OVERLAY – THEME SAFE
================================ */

/* Text stays SAME in both themes */
.portfolio-title {
  color: #ffffff;
}

.portfolio-desc {
  color: #38bdf8; /* sky-400 */
}

/* Dark Mode Overlay */
.portfolio-overlay {
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.95),
    rgba(15, 23, 42, 0.85),
    transparent
  );
}

/* Light Mode Overlay */
.light .portfolio-overlay {
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.85),
    rgba(15, 23, 42, 0.65),
    transparent
  );
}

/* ================================
   ICON CIRCLES – BORDER + SHADOW
================================ */

/* Default (Dark Theme) */
.icon-circle {
  background-color: #1e293b; /* slate-800 */
  border: 1px solid rgba(148, 163, 184, 0.15); /* subtle slate border */
  box-shadow:
    0 0 0 1px rgba(148, 163, 184, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.35);
  transition: 
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}

/* Light Theme */
.light .icon-circle {
  background-color: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.08),
    0 10px 30px rgba(15, 23, 42, 0.15);
}

/* Hover – Brand Glow */
.icon-circle:hover {
  background-color: #0ea5e9; /* sky-500 */
  border-color: rgba(14, 165, 233, 0.6);
  box-shadow:
    0 0 0 3px rgba(14, 165, 233, 0.35), /* circular glow ring */
    0 12px 40px rgba(14, 165, 233, 0.45);
  color: #ffffff !important;
  transform: translateY(-2px);
}


`}</style>
   </div>
  );
}