import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, Droplets, Egg, Facebook,
  Leaf, Mail, Menu, MessageCircle, Milk, Phone, ShieldCheck, Sprout, Tractor, TreePine,
  X, Wheat, Wind, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Route = 'home' | 'about' | 'products' | 'services' | 'blog' | 'contact' | 'privacy';
type ProductCategory = 'All' | 'Vegetables' | 'Dairy & Eggs';

const images = {
  hero: 'https://res.cloudinary.com/yxwjuk4k/image/upload/f_auto,q_auto/WhatsApp_Image_2026-10-08_at_22.36.00',
  irrigation: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791525958/WhatsApp_Image_2026-10-08_at_22.36.00_1.jpg',
  dairy: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526180/WhatsApp_Image_2026-10-08_at_22.35.56.jpg',
  tomatoes: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526281/WhatsApp_Image_2026-10-08_at_22.35.55.jpg',
  potatoes: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526462/WhatsApp_Image_2026-10-08_at_22.35.58.jpg',
  pawpaws: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526639/WhatsApp_Image_2026-10-08_at_22.36.01.jpg',
  beans: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526708/WhatsApp_Image_2026-10-09_at_09.17.06.jpg',
  peppers: 'https://res.cloudinary.com/yxwjuk4k/image/upload/v1791526796/WhatsApp_Image_2026-10-09_at_09.19.33.jpg',
  eggs: 'https://cdn.standardmedia.co.ke/images/tuesday/fmfodslmvgz9b61b8c8b93dc39.jpg',
};

const products = [
  { name: 'Fresh vegetables', category: 'Vegetables' as ProductCategory, description: 'Seasonal greens and vegetables grown with care for the local market.', image: images.hero, icon: Leaf },
  { name: 'Tomatoes', category: 'Vegetables' as ProductCategory, description: 'Vibrant, farm-grown tomatoes for everyday cooking and fresh meals.', image: images.tomatoes, icon: Sprout },
  { name: 'Potatoes', category: 'Vegetables' as ProductCategory, description: 'Farm-grown potatoes for everyday meals and local kitchens.', image: images.potatoes, icon: Wheat },
  { name: 'Bush common beans', category: 'Vegetables' as ProductCategory, description: 'Tender bush beans grown as part of the farm’s seasonal crop mix.', image: images.beans, icon: Sprout },
  { name: 'Bell peppers', category: 'Vegetables' as ProductCategory, description: 'Colourful bell peppers grown for fresh cooking and local customers.', image: images.peppers, icon: Leaf },
  { name: 'Red bulb onions', category: 'Vegetables' as ProductCategory, description: 'Red bulb onions with a rich colour and full kitchen flavour.', image: 'https://alphaveggies.com/wp-content/uploads/2026/02/Kikuyu-Onions.jpg', icon: Wheat },
  { name: 'Pawpaws', category: 'Vegetables' as ProductCategory, description: 'Fresh pawpaws grown on the farm and offered when in season.', image: images.pawpaws, icon: Sprout },
  { name: 'Fresh milk', category: 'Dairy & Eggs' as ProductCategory, description: 'Fresh dairy from a working mixed-farm environment.', image: images.dairy, icon: Milk },
  { name: 'Farm eggs', category: 'Dairy & Eggs' as ProductCategory, description: 'Farm eggs for households, cooks and local businesses.', image: images.eggs, icon: Egg },
];

const services = [
  { title: 'Farming consultancy', description: 'Practical agricultural advice and support to help farmers make informed production decisions.', icon: Sprout },
  { title: 'Irrigation installation', description: 'Irrigation installation support designed around farm requirements and available resources.', icon: Droplets },
  { title: 'Farm production guidance', description: 'Guidance on efficient production practices, farm planning and responsible resource use.', icon: Tractor },
  { title: 'Sustainable farming support', description: 'Practical guidance for adopting environmentally responsible farming techniques.', icon: TreePine },
];

const articles = [
  { slug: 'vegetable-farming-in-kenya', category: 'Farming guide', date: '08 Oct 2026', title: 'How to Start Vegetable Farming in Kenya: A Practical Guide', excerpt: 'A grounded starting point for choosing crops, preparing land and planning a vegetable growing season.', image: images.beans },
  { slug: 'choosing-an-irrigation-system', category: 'Water & irrigation', date: '08 Oct 2026', title: 'Choosing an Irrigation System for Your Farm in Kenya', excerpt: 'What to consider when matching an irrigation approach to your farm, crops, water source and routine.', image: images.irrigation },
  { slug: 'tomato-farming-in-kenya', category: 'Crop care', date: '08 Oct 2026', title: 'Tomato Farming in Kenya: Soil Preparation, Watering and Crop Care', excerpt: 'Practical foundations for giving tomato plants a strong start and consistent attention through the season.', image: images.tomatoes },
  { slug: 'water-efficiency-on-your-farm', category: 'Sustainability', date: '08 Oct 2026', title: 'Five Practical Ways to Improve Water Efficiency on Your Farm', excerpt: 'Small, considered improvements that help farms use water more responsibly.', image: images.pawpaws },
  { slug: 'mixed-farming-in-kenya', category: 'Mixed farming', date: '08 Oct 2026', title: 'Mixed Farming in Kenya: Combining Crops, Livestock and Poultry', excerpt: 'How a diversified farm can make thoughtful use of land, labour and available resources.', image: images.dairy },
];

const navItems: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' }, { label: 'About', route: 'about' }, { label: 'Products', route: 'products' },
  { label: 'Services', route: 'services' }, { label: 'Blog', route: 'blog' }, { label: 'Contact', route: 'contact' },
];

function App() {
  const [route, setRoute] = useState<Route>(() => getRoute());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextRoute: Route, articleSlug?: string) => {
    const path = articleSlug ? `/blog/${articleSlug}` : nextRoute === 'home' ? '/' : `/${nextRoute}`;
    window.history.pushState({}, '', path);
    setSelectedArticle(articleSlug ?? null);
    setRoute(nextRoute);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const page = selectedArticle ? <ArticlePage slug={selectedArticle} onNavigate={navigate} /> : renderPage(route, navigate);

  return (
    <div className="site-shell">
      <div className="utility-bar"><div className="container utility-inner"><span>Mixed Farming</span><i /> <span>Agricultural Consultancy</span><i /> <span>Irrigation Solutions</span><a href="tel:+254796210123">0796 210 123 <Phone size={13} /></a></div></div>
      <header className="site-header">
        <div className="container nav-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="Agri-Tech Farm home"><span className="brand-mark"><Leaf size={22} strokeWidth={1.8} /></span><span><strong>Agri-Tech</strong><em>Farm</em></span></button>
          <nav className={`main-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => <button key={item.route} className={route === item.route && !selectedArticle ? 'active' : ''} onClick={() => navigate(item.route)}>{item.label}</button>)}
            <button className="nav-cta" onClick={() => navigate('contact')}>Contact us <ArrowUpRight size={16} /></button>
          </nav>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main>{page}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function getRoute(): Route {
  const path = window.location.pathname.replace(/^\//, '').split('/')[0];
  return (['about', 'products', 'services', 'blog', 'contact', 'privacy'].includes(path) ? path : 'home') as Route;
}

function renderPage(route: Route, navigate: (route: Route, articleSlug?: string) => void) {
  switch (route) {
    case 'about': return <AboutPage onNavigate={navigate} />;
    case 'products': return <ProductsPage onNavigate={navigate} />;
    case 'services': return <ServicesPage onNavigate={navigate} />;
    case 'blog': return <BlogPage onNavigate={navigate} />;
    case 'contact': return <ContactPage />;
    case 'privacy': return <PrivacyPage />;
    default: return <HomePage onNavigate={navigate} />;
  }
}

function HomePage({ onNavigate }: { onNavigate: (route: Route, articleSlug?: string) => void }) {
  return <>
    <section className="hero">
      <img src={images.hero} alt="Cabbage rows growing on a farm in Laikipia" />
      <div className="hero-shade" />
      <div className="container hero-content"><p className="eyebrow light"><span /> Back to the roots</p><h1>Growing better.<br /><i>Farming smarter.</i></h1><p className="hero-copy">Fresh farm produce, practical agricultural expertise and irrigation solutions to help farms grow sustainably.</p><div className="button-row"><button className="button button-leaf" onClick={() => onNavigate('products')}>Explore our products <ArrowRight size={17} /></button><button className="text-button light-link" onClick={() => onNavigate('services')}>Discover our services <ArrowUpRight size={17} /></button></div></div>
      <div className="hero-note"><span>01</span><span className="hero-line" /><span>Rooted in Laikipia</span></div>
    </section>
    <section className="intro section-pad"><div className="container intro-grid"><div className="image-frame intro-image"><img src={images.beans} alt="Beans growing in the farm" /><span className="image-stamp">Since<br /><strong>2026</strong></span></div><div className="intro-copy"><p className="eyebrow">Who we are</p><h2>Rooted in farming.<br /><em>Focused on the future.</em></h2><p>Agri-Tech Farm is a mixed farming enterprise based in Laikipia East, Laikipia County. We bring together crop production, livestock and poultry with practical agricultural consultancy and irrigation support.</p><p>Our work is guided by responsible resource use, quality and a belief that better farming starts with solutions that fit the farm.</p><button className="text-button dark-link" onClick={() => onNavigate('about')}>Learn about our farm <ArrowUpRight size={17} /></button></div></div></section>
    <ProductPreview onNavigate={onNavigate} />
    <section className="services-band section-pad"><div className="container"><div className="section-heading centered"><p className="eyebrow">What we do</p><h2>Practical solutions for<br /><em>better farming.</em></h2><p>From the soil to the water system, we offer grounded support for farms ready to grow with intention.</p></div><div className="service-grid">{services.map((service) => <ServiceCard key={service.title} {...service} onNavigate={onNavigate} />)}</div><div className="center-action"><button className="button button-outline" onClick={() => onNavigate('services')}>View all services <ArrowRight size={17} /></button></div></div></section>
    <section className="values-section section-pad"><div className="container values-grid"><div><p className="eyebrow">Why Agri-Tech Farm</p><h2>A practical approach to <em>sustainable agriculture.</em></h2><p className="lead">We are building a farm and a farming partner that values quality over shortcuts, and practical progress over empty promises.</p><button className="text-button dark-link" onClick={() => onNavigate('about')}>Our story and values <ArrowUpRight size={17} /></button></div><div className="value-list">{['Diversified mixed farming', 'Customer-focused support', 'Responsible resource use', 'Quality and integrity', 'Sustainable farming practices', 'A vision for a self-sustaining farm'].map((value, index) => <div className="value-item" key={value}><span>0{index + 1}</span><Check size={16} /><strong>{value}</strong></div>)}</div></div></section>
    <Sustainability onNavigate={onNavigate} />
    <BlogPreview onNavigate={onNavigate} />
    <ContactBanner />
  </>;
}

function ProductPreview({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <section className="products-section section-pad"><div className="container"><div className="section-heading split"><div><p className="eyebrow">Farm products</p><h2>Fresh from<br /><em>our farm.</em></h2></div><div><p>Carefully grown and produced for the local market. Ask us about current availability, quantities and prices.</p><button className="text-button dark-link" onClick={() => onNavigate('products')}>View all products <ArrowUpRight size={17} /></button></div></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.name} {...product} />)}</div></div></section>;
}

function ProductCard({ name, description, image, icon: Icon }: (typeof products)[number]) {
  return <article className="product-card"><div className="product-image"><img src={image} alt={name} loading="lazy" /><span className="product-icon"><Icon size={19} /></span></div><div className="product-card-body"><h3>{name}</h3><p>{description}</p><a className="card-link" href={`https://wa.me/254796210123?text=${encodeURIComponent(`Hello Agri-Tech Farm, I would like to enquire about ${name}.`)}`} target="_blank" rel="noreferrer">Make an enquiry <ArrowUpRight size={15} /></a></div></article>;
}

function ServiceCard({ title, description, icon: Icon, onNavigate }: (typeof services)[number] & { onNavigate: (route: Route) => void }) {
  return <article className="service-card"><div className="service-icon"><Icon size={22} /></div><span className="service-number">0{services.findIndex((item) => item.title === title) + 1}</span><h3>{title}</h3><p>{description}</p><button className="card-link" onClick={() => onNavigate('services')}>Discuss your needs <ArrowRight size={15} /></button></article>;
}

function Sustainability({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <section className="sustainability"><div className="sustain-image"><img src={images.irrigation} alt="Working drip irrigation system on the farm" loading="lazy" /></div><div className="sustain-copy"><p className="eyebrow light">Our approach</p><h2>Growing with<br /><em>nature in mind.</em></h2><p>We believe that healthy soil, responsible farming and efficient use of resources are important to productive agriculture and healthier communities.</p><p className="small-note"><Wind size={17} /> Organic-oriented, not certified organic</p><button className="text-button light-link" onClick={() => onNavigate('about')}>What guides our work <ArrowUpRight size={17} /></button></div></section>;
}

function BlogPreview({ onNavigate }: { onNavigate: (route: Route, articleSlug?: string) => void }) {
  return <section className="blog-section section-pad"><div className="container"><div className="section-heading split"><div><p className="eyebrow">From the farm</p><h2>Insights for<br /><em>better growing.</em></h2></div><button className="text-button dark-link" onClick={() => onNavigate('blog')}>Explore farming resources <ArrowUpRight size={17} /></button></div><div className="article-grid">{articles.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} onNavigate={onNavigate} />)}</div></div></section>;
}

function ArticleCard({ article, onNavigate }: { article: typeof articles[number]; onNavigate: (route: Route, articleSlug?: string) => void }) {
  return <article className="article-card"><button className="article-image" onClick={() => onNavigate('blog', article.slug)}><img src={article.image} alt={article.title} loading="lazy" /><span><ArrowUpRight size={18} /></span></button><div className="article-meta"><span>{article.category}</span><i />{article.date}</div><h3><button onClick={() => onNavigate('blog', article.slug)}>{article.title}</button></h3><p>{article.excerpt}</p><button className="card-link" onClick={() => onNavigate('blog', article.slug)}>Read article <ArrowRight size={15} /></button></article>;
}

function AboutPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <PageIntro eyebrow="Our story" title={<>A farm built on<br /><em>good ground.</em></>} intro="Agri-Tech Farm is a growing mixed farming enterprise in Laikipia East, built around a simple belief: better farming starts with practical, responsible solutions." image={images.dairy} imageAlt="Dairy cattle feeding at Agri-Tech Farm"><section className="section-pad about-story"><div className="container narrow-grid"><div><p className="eyebrow">The business</p><h2>From our land to<br /><em>your table.</em></h2></div><div><p>Established in 2026 and managed by Peter Migwi Mwai, Agri-Tech Farm operates on approximately nine acres of mixed farming land in Laikipia East, Laikipia County.</p><p>The farm combines crop production, livestock and poultry activities with agricultural consultancy and irrigation services. We serve the local market with fresh produce while supporting other farmers with practical guidance.</p><p>Our approach is organic-oriented and grounded in the responsible use of land, water and other farm resources. We do not claim certified organic status.</p></div></div></section><section className="beliefs section-pad"><div className="container beliefs-grid"><div className="belief-card dark-card"><p className="eyebrow light">Our vision</p><h2>“Embracing a<br /><em>self-sustaining<br />mixed farm.</em>”</h2></div><div className="belief-card gold-card"><p className="eyebrow">Our mission</p><h2>“Maximizing on organic farming practices for better health.”</h2></div></div></section><section className="section-pad values-page"><div className="container"><div className="section-heading centered"><p className="eyebrow">What we stand for</p><h2>Values that keep us<br /><em>grounded.</em></h2></div><div className="values-page-grid">{['Sustainability', 'Quality', 'Integrity', 'Innovation', 'Community development', 'Environmental responsibility'].map((value, index) => <div className="value-page-item" key={value}><span>0{index + 1}</span><Leaf size={18} /><h3>{value}</h3><p>Guiding the way we grow, serve and build for the future.</p></div>)}</div><div className="center-action"><button className="button button-leaf" onClick={() => onNavigate('contact')}>Work with us <ArrowRight size={17} /></button></div></div></section></PageIntro>;
}

function ProductsPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [filter, setFilter] = useState<ProductCategory>('All');
  const visible = filter === 'All' ? products : products.filter((product) => product.category === filter);
  return <PageIntro eyebrow="From our farm" title={<>Produce with<br /><em>purpose.</em></>} intro="Explore the products we grow and produce at Agri-Tech Farm. Availability, quantities and current prices vary, so please enquire with our team." image={images.tomatoes} imageAlt="Tomatoes growing in the farm"><section className="section-pad catalogue"><div className="container"><div className="filter-row">{(['All', 'Vegetables', 'Dairy & Eggs'] as ProductCategory[]).map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="catalogue-grid">{visible.map((product) => <ProductCard key={product.name} {...product} />)}</div><div className="availability-note"><ShieldCheck size={21} /><div><strong>Planning a purchase?</strong><p>Contact the farm to confirm current availability, quantities and prices.</p></div><button className="text-button dark-link" onClick={() => onNavigate('contact')}>Make an enquiry <ArrowUpRight size={17} /></button></div></div></section><ContactBanner /></PageIntro>;
}

function ServicesPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <PageIntro eyebrow="How we help" title={<>Support for farms<br /><em>that want to grow.</em></>} intro="Practical agricultural support, from production decisions to irrigation installation and sustainable resource use." image={images.irrigation} imageAlt="Drip irrigation system working on the farm"><section className="section-pad service-detail"><div className="container detail-grid">{services.concat([{ title: 'Farm planning & resource use', description: 'Basic farm planning and resource-use guidance to help you think clearly about the next season.', icon: Zap }]).map((service, index) => <div className="detail-row" key={service.title}><div className="detail-index">0{index + 1}</div><div className="detail-icon"><service.icon size={22} /></div><div><h2>{service.title}</h2><p>{service.description}</p><button className="card-link" onClick={() => document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' })}>Discuss your needs <ArrowRight size={15} /></button></div></div>)}</div></section><ServiceForm onNavigate={onNavigate} /></PageIntro>;
}

function ServiceForm({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus('sending'); setError('');
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const { error: insertError } = await supabase.from('service_enquiries').insert({ full_name: values.fullName, phone: values.phone, email: values.email || null, service: values.service, farm_location: values.location, needs: values.needs });
    if (insertError) { setStatus('error'); setError('We could not send your enquiry right now. Please call or WhatsApp the farm instead.'); return; }
    setStatus('success'); event.currentTarget.reset();
  };
  return <section id="service-form" className="form-section section-pad"><div className="container form-grid"><div><p className="eyebrow">Start a conversation</p><h2>Tell us what<br /><em>you’re growing.</em></h2><p>Share a little about your farm or project and we’ll have a clearer starting point for the conversation.</p><div className="form-contact"><a href="tel:+254796210123"><Phone size={16} /> 0796 210 123</a><a href="https://wa.me/254796210123" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp the farm</a></div></div><form onSubmit={submit} className="enquiry-form"><div className="form-row"><label>Full name<input name="fullName" required minLength={2} placeholder="Your name" /></label><label>Phone number<input name="phone" required minLength={7} placeholder="07xx xxx xxx" /></label></div><div className="form-row"><label>Email address <span>(optional)</span><input name="email" type="email" placeholder="you@example.com" /></label><label>Service required<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}<option>Farm planning & resource use</option></select></label></div><label>Farm location<input name="location" required minLength={2} placeholder="Town, county or area" /></label><label>Tell us briefly about your needs<textarea name="needs" required minLength={10} rows={5} placeholder="What would you like help with?" /></label>{status === 'error' && <p className="form-message error">{error}</p>}{status === 'success' && <p className="form-message success"><Check size={16} /> Your enquiry has been received. We’ll be in touch.</p>}<button className="button button-leaf full-button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'} <ArrowRight size={17} /></button><p className="form-footnote">Prefer a quick conversation? <button type="button" onClick={() => onNavigate('contact')}>View all contact options</button></p></form></div></section>;
}

function BlogPage({ onNavigate }: { onNavigate: (route: Route, articleSlug?: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => articles.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <PageIntro eyebrow="Farming resources" title={<>Ideas from the<br /><em>field.</em></>} intro="Practical, considered reading for farmers and growers navigating crops, water, mixed farming and sustainable progress." image={images.pawpaws} imageAlt="Pawpaws growing on a farm tree"><section className="section-pad blog-index"><div className="container"><div className="blog-tools"><p>{filtered.length} resources</p><label><span>Search articles</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “irrigation”" /></label></div><div className="article-index-grid">{filtered.map((article) => <ArticleCard key={article.slug} article={article} onNavigate={onNavigate} />)}</div></div></section></PageIntro>;
}

const articleContent: Record<string, React.ReactNode> = {
  'vegetable-farming-in-kenya': <>
    <p className="dropcap">Vegetable farming in Kenya is one of the most accessible ways to earn from a small plot of land. Whether you are working a kitchen garden in Laikipia or planning a commercial planting, the principles that lead to a productive season are the same: choose the right crops, prepare your land well, and stay attentive from seed to harvest.</p>
    <h2>Choose crops that fit your conditions</h2>
    <p>Not every vegetable grows well in every place. Start by observing your soil type, average rainfall, temperature range and the length of your growing season. In many parts of Kenya, crops like kale (sukuma wiki), spinach, cabbage, onions, tomatoes and beans perform reliably because they suit local climates and have steady market demand.</p>
    <p>Think about your water source early. If you depend on rainfall alone, choose quick-maturing crops and plant at the start of the rains. If you have access to irrigation, your options widen — you can grow through the dry season when market prices are often higher.</p>
    <h2>Prepare the land properly</h2>
    <p>Good land preparation sets the foundation for the entire season. Clear weeds and crop residues, break up compacted soil, and work in well-decomposed manure or compost to improve structure and fertility. Raised beds help with drainage in wetter areas, while sunken beds can conserve moisture where it is dry.</p>
    <p>Test your soil if you can. A simple pH and nutrient check tells you whether your soil is too acidic, too alkaline, or missing key nutrients. Many Kenyan soils benefit from added organic matter and, where needed, a balanced fertiliser applied according to the crop's growth stage.</p>
    <h2>Plant with a plan</h2>
    <p>Use quality seed from a reliable supplier. Pay attention to spacing — overcrowded plants compete for water, light and nutrients, which reduces yields and invites disease. Follow recommended spacing for each crop and thin seedlings early if they come up too thickly.</p>
    <p>Stagger your planting where possible. Sowing a small section every two weeks gives you a continuous harvest rather than a single glut, which makes selling easier and spreads your risk across the season.</p>
    <div className="article-callout"><Sprout size={22} /><div><strong>Need help choosing crops for your farm?</strong><p>Agri-Tech Farm offers farming consultancy to help you plan a vegetable season that fits your land and market.</p><button className="text-button dark-link" onClick={() => onNavigate('services')}>Explore our services <ArrowUpRight size={17} /></button></div></div>
    <h2>Manage weeds, pests and water</h2>
    <p>Weeds compete directly with your vegetables. Keep beds clean by hand-weeding or light cultivation, and mulch around plants to suppress regrowth and conserve moisture. Watch for common pests like aphids, cutworms and nematodes — early detection saves crops. Where possible, use organic-oriented controls such as neem extracts, companion planting and crop rotation before reaching for stronger measures.</p>
    <p>Water consistently, especially during the first weeks after planting and again during flowering and fruiting. Uneven watering stresses plants and reduces quality. Water at the base rather than overhead to keep leaves dry and reduce disease.</p>
    <h2>Harvest and sell smartly</h2>
    <p>Harvest at the right maturity for each crop — too early and you lose yield, too late and quality drops. Sort your produce by grade, because better-looking vegetables earn higher prices. Build relationships with local buyers, kiosks, hotels and markets before your harvest is ready, so you have somewhere to sell when the produce is at its peak.</p>
    <p className="article-signoff">Written for the Agri-Tech Farm resource library.</p>
  </>,
  'choosing-an-irrigation-system': <>
    <p className="dropcap">Water is often the single biggest factor in whether a Kenyan farm produces well or struggles through the dry months. Choosing an irrigation system is not about buying the most expensive equipment — it is about matching the right method to your crops, your water source, your budget and the time you can give to maintenance.</p>
    <h2>Understand your water source first</h2>
    <p>Before comparing systems, know what you are working with. Is your water from a borehole, a river, a dam, a tank or a municipal supply? Each source has a different flow rate, pressure and reliability. Measure how much water you can realistically deliver per hour, because that figure determines which systems will work on your farm.</p>
    <p>Also consider water quality. Silt or debris in river water can clog fine emitters, while borehole water may carry minerals that build up over time. A simple filter at the source protects most systems and extends their working life considerably.</p>
    <h2>Match the system to your crops</h2>
    <p>Different crops have different watering needs. Drip irrigation is ideal for vegetables, tomatoes, onions and fruit trees because it delivers water directly to the root zone, reducing waste and keeping leaves dry. It works well where water is limited, since losses to evaporation and runoff are minimal.</p>
    <p>Sprinkler systems are better suited to close-growing crops like kale, spinach and pasture, where a wider spread of water is useful. They mimic rainfall and can cover large areas quickly, but they use more water than drip and can encourage leaf disease if used in humid conditions or late in the evening.</p>
    <p>For small plots or seedling nurseries, simple watering cans or a hose with a rose attachment may be enough to start. The best system is the one you can operate consistently, not the one that looks most advanced.</p>
    <div className="article-callout"><Sprout size={22} /><div><strong>Looking to install irrigation?</strong><p>Agri-Tech Farm provides irrigation installation and system design support for farms in Laikipia and the surrounding region.</p><button className="text-button dark-link" onClick={() => onNavigate('services')}>Explore our services <ArrowUpRight size={17} /></button></div></div>
    <h2>Think about pressure, slopes and layout</h2>
    <p>Water moves through pipes under pressure, and pressure depends on elevation. If your water source is uphill from your plot, gravity can do much of the work for you, which reduces pumping costs. If the source is below your farm, you will need a pump — so factor in the cost of fuel or electricity and the pump's maintenance needs.</p>
    <p>On sloping land, design laterals along the contour rather than up and down the slope. This keeps water distribution even and prevents erosion. Drip lines should follow plant rows, with emitters spaced to match each crop's root spread.</p>
    <h2>Plan for maintenance from the start</h2>
    <p>An irrigation system is only as reliable as its upkeep. Flush lines regularly to clear sediment, check emitters for blockages, inspect fittings for leaks and service pumps on schedule. A neglected drip system can lose half its efficiency within a season, while a maintained one runs for years.</p>
    <p>Build maintenance into your routine from day one — a weekly check takes minutes and prevents the kind of failures that damage crops when water matters most.</p>
    <p className="article-signoff">Written for the Agri-Tech Farm resource library.</p>
  </>,
  'tomato-farming-in-kenya': <>
    <p className="dropcap">Tomatoes are one of the most rewarding crops a Kenyan farmer can grow, but they are also demanding. A healthy tomato crop needs the right soil, careful watering, regular monitoring and timely intervention when pests or disease appear. Get the foundations right and the season runs far more smoothly.</p>
    <h2>Soil preparation for strong roots</h2>
    <p>Tomatoes do best in well-drained, fertile soil with a pH between 6.0 and 6.8. Before planting, work generous amounts of compost or well-rotted manure into the beds to build organic matter and improve moisture retention. Avoid soils that waterlog easily, because tomato roots suffocate in standing water and become vulnerable to root rot.</p>
    <p>Raised beds are a good choice in most Kenyan conditions. They improve drainage, warm up faster in the early season, and make staking and harvesting easier. Space beds about a metre apart so you have room to work between rows without compacting the soil around the plants.</p>
    <h2>Raising and transplanting seedlings</h2>
    <p>Start seeds in a nursery tray or seedbed with fine, loose soil. Keep the nursery moist but not saturated, and shade it during the hottest part of the day. Seedlings are ready to transplant at about three to four weeks, once they have four to six true leaves and a sturdy stem.</p>
    <p>Harden off seedlings by reducing water and shade for a few days before transplanting. Plant them slightly deeper than they grew in the nursery — buried stem sections will develop additional roots, which strengthens the plant and improves drought tolerance. Space plants about 60 cm apart within rows.</p>
    <div className="article-callout"><Sprout size={22} /><div><strong>Want support with your tomato crop?</strong><p>Agri-Tech Farm offers crop care guidance and irrigation setup tailored to vegetable growers.</p><button className="text-button dark-link" onClick={() => onNavigate('services')}>Explore our services <ArrowUpRight size={17} /></button></div></div>
    <h2>Watering and feeding</h2>
    <p>Consistent moisture is the key to good tomatoes. Fluctuations between dry and wet soil cause blossom-end rot, fruit splitting and poor set. Water deeply and regularly at the base of the plant, keeping the foliage dry to reduce blight. Drip irrigation is ideal here — it delivers steady moisture exactly where roots need it.</p>
    <p>Feed tomatoes in stages. They need nitrogen early for leaf growth, then more phosphorus and potassium once flowering begins. A side dressing of compost or a balanced fertiliser every two to three weeks supports steady production through the fruiting period.</p>
    <h2>Pests, diseases and crop care</h2>
    <p>Tomatoes attract a range of problems: early and late blight, aphids, whiteflies, nematodes and tomato leaf miner among them. The best defence is prevention — rotate tomatoes with non-related crops each season, space plants for airflow, mulch to prevent soil splashing onto leaves, and inspect plants at least twice a week.</p>
    <p>Stake or cage plants early so fruit does not touch the ground. Remove diseased leaves promptly and dispose of them away from the crop. Where blight pressure is high, consider resistant varieties and avoid overhead watering entirely.</p>
    <h2>Harvesting for quality</h2>
    <p>Pick tomatoes at the breaker stage — when the fruit shows its first colour but is still firm — for transport to distant markets. For local sale, allow fruit to ripen fully on the vine for the best flavour. Handle carefully, as bruised tomatoes spoil quickly and drag down the price of an entire crate.</p>
    <p className="article-signoff">Written for the Agri-Tech Farm resource library.</p>
  </>,
  'water-efficiency-on-your-farm': <>
    <p className="dropcap">Water is a finite resource, and on most Kenyan farms it is also a limiting one. Improving water efficiency does not always require major investment — often, a handful of small, deliberate changes can significantly reduce waste, lower costs and keep crops productive through dry spells.</p>
    <h2>1. Deliver water to the roots, not the leaves</h2>
    <p>The most common waste on small farms is water that never reaches the plant. Overhead sprinklers lose a large share of water to evaporation, wind drift and runoff. Drip irrigation, by contrast, places water at the root zone where the plant can use it immediately. Even a basic drip kit on a gravity line can cut water use dramatically compared to flood or sprinkler watering.</p>
    <h2>2. Mulch to hold moisture in the soil</h2>
    <p>A layer of mulch — straw, dried grass, leaves or compost — around your plants reduces evaporation from the soil surface, keeps roots cooler and suppresses weeds that would otherwise compete for water. Mulched beds can stay moist for days longer than bare soil, which means less frequent watering and healthier plants during hot periods.</p>
    <div className="article-callout"><Sprout size={22} /><div><strong>Want to reduce water waste on your farm?</strong><p>Agri-Tech Farm helps growers design efficient irrigation and water management practices.</p><button className="text-button dark-link" onClick={() => onNavigate('services')}>Explore our services <ArrowUpRight size={17} /></button></div></div>
    <h2>3. Water at the right time of day</h2>
    <p>When you water matters as much as how you water. Early morning is ideal — temperatures are lower, wind is calmer and water soaks in before evaporation peaks. Avoid watering in the heat of midday, when losses to evaporation are highest. Evening watering can work in dry areas, but it leaves foliage wet overnight, which increases disease risk on crops like tomatoes and beans.</p>
    <h2>4. Capture and store rainwater</h2>
    <p>Even on a small farm, simple rainwater harvesting makes a difference. Gutters on farm buildings can channel runoff into tanks or drums for use during dry weeks. Contour bunds and swales on sloping land slow runoff and let water soak into the soil rather than washing away. Every litre stored is a litre you do not have to pump later.</p>
    <h2>5. Group crops by water need</h2>
    <p>Not every crop needs the same amount of water. Place thirsty crops like tomatoes and cabbages close to your water source, and plant more drought-tolerant crops like beans, cowpeas and sorghum further away. This way you are not over-watering the hardy crops just to satisfy the demanding ones, and your irrigation layout stays simpler and cheaper to run.</p>
    <p>Small changes compound. A farm that saves 20 percent of its water through better timing, mulching and drip lines can extend its growing season by weeks — and that is often the difference between a crop that finishes well and one that runs dry before maturity.</p>
    <p className="article-signoff">Written for the Agri-Tech Farm resource library.</p>
  </>,
  'mixed-farming-in-kenya': <>
    <p className="dropcap">Mixed farming — growing crops alongside livestock and poultry on the same holding — is one of the oldest and most resilient farming models in Kenya. Rather than relying on a single income stream, a diversified farm spreads risk across several enterprises and makes fuller use of land, labour and resources throughout the year.</p>
    <h2>Why diversification makes sense</h2>
    <p>A farm that depends on one crop or one type of livestock is exposed to a single point of failure. A dry season, a price crash or a disease outbreak can wipe out the year's income. A mixed farm absorbs shocks better: when vegetable prices dip, poultry eggs may still sell well; when rains delay planting, livestock can carry the farm through the gap.</p>
    <p>Diversification also smooths cash flow. Crops pay out at harvest, milk generates income daily, and poultry eggs and broilers provide a steady weekly return. Together, these enterprises keep money coming in across the calendar rather than in one or two lump sums.</p>
    <h2>Let each enterprise feed the others</h2>
    <p>The real strength of mixed farming is the way its parts connect. Crop residues — maize stalks, bean haulms, vegetable trimmings — become feed for cattle and poultry instead of being wasted. Manure from livestock and poultry goes back onto the vegetable beds and compost heaps, reducing the need for bought-in fertiliser. Layers of productivity build on one another when the system is designed thoughtfully.</p>
    <div className="article-callout"><Sprout size={22} /><div><strong>Planning a diversified farm?</strong><p>Agri-Tech Farm operates its own mixed farming model and offers consultancy to farmers building similar systems.</p><button className="text-button dark-link" onClick={() => onNavigate('services')}>Explore our services <ArrowUpRight size={17} /></button></div></div>
    <h2>Balance land, labour and water</h2>
    <p>A common mistake is taking on too many enterprises at once. Each one demands time, knowledge and daily attention. Start with two or three that complement each other — for example, vegetables and a small poultry unit — and expand only once the first enterprises are running well. Consider how much labour your household can realistically provide and which tasks need to be shared or hired out.</p>
    <p>Water allocation matters too. On a small holding, the crops closest to the water source should be the ones with the highest water need, while livestock drinking systems can be simpler and centralised.</p>
    <h2>Manage health and biosecurity</h2>
    <p>With multiple enterprises comes responsibility for animal and plant health. Vaccinate poultry against Newcastle disease, deworm cattle on a schedule, and keep livestock and poultry housing clean and well-ventilated. Separate sick animals promptly and avoid sharing water points between poultry and cattle. On the crop side, rotate plant families each season so pests and soil-borne diseases do not build up in one area.</p>
    <h2>Plan for the market</h2>
    <p>Each product from a mixed farm has its own market. Fresh vegetables sell to local buyers and kiosks; milk moves through dairy cooperatives or direct neighbours; eggs and broilers supply shops and restaurants. Map out who buys what before you scale up, so that increased production leads to increased sales rather than surplus that spoils.</p>
    <p className="article-signoff">Written for the Agri-Tech Farm resource library.</p>
  </>,
};

function ArticlePage({ slug, onNavigate }: { slug: string; onNavigate: (route: Route, articleSlug?: string) => void }) {
  const article = articles.find((item) => item.slug === slug) ?? articles[0];
  return <article className="article-page"><div className="container article-container"><button className="back-link" onClick={() => onNavigate('blog')}><ChevronRight size={16} className="rotate" /> All resources</button><div className="article-header"><p className="eyebrow">{article.category} <span>·</span> {article.date}</p><h1>{article.title}</h1><p className="article-dek">{article.excerpt}</p></div><img className="article-hero" src={article.image} alt={article.title} /><div className="article-content">{articleContent[article.slug]}</div></div></article>;
}

function PageIntro({ eyebrow, title, intro, image, imageAlt, children }: { eyebrow: string; title: React.ReactNode; intro: string; image: string; imageAlt: string; children: React.ReactNode }) {
  return <><section className="page-hero"><div className="container page-hero-grid"><div><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div><img src={image} alt={imageAlt} /></div></section>{children}</>;
}

function ContactPage() {
  return <><section className="contact-hero"><div className="container"><p className="eyebrow light">Let’s talk</p><h1>Let’s grow something<br /><em>good together.</em></h1><p>Looking for fresh farm produce, agricultural advice or irrigation installation support? Get in touch with Agri-Tech Farm.</p></div></section><section className="section-pad contact-details"><div className="container contact-grid"><div><p className="eyebrow">Contact the farm</p><h2>Good conversations<br /><em>start here.</em></h2><p>We’re based in Laikipia East, Laikipia County, Kenya. Reach out by phone, WhatsApp or email for product enquiries and service discussions.</p><div className="contact-actions"><a href="tel:+254796210123"><span><Phone size={20} /></span><div><small>Call the farm</small><strong>0796 210 123</strong></div><ArrowUpRight size={17} /></a><a href="https://wa.me/254796210123" target="_blank" rel="noreferrer"><span><MessageCircle size={20} /></span><div><small>WhatsApp us</small><strong>Start a conversation</strong></div><ArrowUpRight size={17} /></a><a href="mailto:info.agrictech7@gmail.com"><span><Mail size={20} /></span><div><small>Send an email</small><strong>info.agrictech7@gmail.com</strong></div><ArrowUpRight size={17} /></a></div></div><div className="contact-image"><img src={images.peppers} alt="Bell peppers growing in the farm" /><div className="location-card"><MapPinIcon /><span>Laikipia East<br /><strong>Laikipia County, Kenya</strong></span></div></div></div></section><ContactBanner /></>;
}

function MapPinIcon() { return <span className="map-pin"><Leaf size={18} /></span>; }

function PrivacyPage() { return <section className="section-pad legal-page"><div className="container legal-container"><p className="eyebrow">Your information</p><h1>Privacy <em>policy.</em></h1><p className="legal-intro">A clear, simple explanation of how Agri-Tech Farm handles information shared through this website.</p><h2>What we collect</h2><p>When you send a service enquiry, we may collect your name, phone number, optional email address, farm location and the details you choose to share about your needs.</p><h2>How we use it</h2><p>We use enquiry details to respond to your request, discuss products or services and provide relevant follow-up. We do not sell your personal information.</p><h2>Contact options</h2><p>Phone, WhatsApp and email links open your chosen communication service. Those services may process information under their own privacy policies.</p><h2>Questions</h2><p>For questions about information shared with Agri-Tech Farm, contact <a href="mailto:info.agrictech7@gmail.com">info.agrictech7@gmail.com</a>.</p></div></section>;
}

function ContactBanner() { return <section className="contact-banner"><div className="container contact-banner-inner"><div><p className="eyebrow light">Start a conversation</p><h2>Let’s grow something<br /><em>good together.</em></h2></div><div><p>Fresh produce, agricultural advice or irrigation support — we’re here to listen.</p><div className="button-row"><a className="button button-leaf" href="tel:+254796210123">Call the farm <Phone size={16} /></a><a className="button button-ghost" href="https://wa.me/254796210123" target="_blank" rel="noreferrer">WhatsApp us <MessageCircle size={16} /></a></div></div></div></section>; }

function Footer({ onNavigate }: { onNavigate: (route: Route) => void }) { return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><button className="brand light-brand" onClick={() => onNavigate('home')}><span className="brand-mark"><Leaf size={22} /></span><span><strong>Agri-Tech</strong><em>Farm</em></span></button><p>Growing quality. Sharing knowledge. Building sustainable farming solutions.</p><span className="footer-tagline">Back to the roots.</span></div><div className="footer-column"><h3>Explore</h3>{navItems.slice(0, 5).map((item) => <button key={item.route} onClick={() => onNavigate(item.route)}>{item.label}</button>)}</div><div className="footer-column"><h3>Farm products</h3>{products.map((product) => <a key={product.name} href={`https://wa.me/254796210123?text=${encodeURIComponent(`Hello Agri-Tech Farm, I would like to enquire about ${product.name}.`)}`} target="_blank" rel="noreferrer">{product.name}</a>)}</div><div className="footer-column footer-contact"><h3>Find us</h3><p>Laikipia East<br />Laikipia County, Kenya</p><a href="tel:+254796210123">0796 210 123</a><a href="mailto:info.agrictech7@gmail.com">info.agrictech7@gmail.com</a><p>P.O. Box 80-10400</p></div></div><div className="container footer-bottom"><span>© 2026 Agri-Tech Farm. All rights reserved.</span><button onClick={() => onNavigate('privacy')}>Privacy policy</button><span className="footer-social"><Facebook size={15} /> <span>Rooted in Laikipia</span></span></div></footer>; }

export default App;
