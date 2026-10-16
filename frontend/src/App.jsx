import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Outlet, Routes, Route } from "react-router-dom";
import { LazyMotion, MotionConfig } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Seo from "./components/Seo";
import Home from "./pages/Home";
import content from "./data/content";

const About = lazy(() => import("./pages/About"));
const Training = lazy(() => import("./pages/Training"));
const TrainingApply = lazy(() => import("./pages/TrainingApply"));
const SpawnBooking = lazy(() => import("./pages/SpawnBooking"));
const News = lazy(() => import("./pages/News"));
const Contact = lazy(() => import("./pages/Contact"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Shop = lazy(() => import("./pages/Shop"));
const GetQuote = lazy(() => import("./pages/GetQuote"));
const Showcase = lazy(() => import("./pages/Showcase"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Termsofservices = lazy(() => import("./pages/Termsofservices"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

// Animation code is fetched separately so it doesn't hold up the first render; `strict` makes
// any full `motion` component (which would bundle it again) an error. Use `m` instead.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((mod) => mod.default);

function PageFallback() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" aria-hidden="true" />
      <span className="sr-only">{content.ui.loading}</span>
    </div>
  );
}

// Header and footer around every public page, and its search/social tags (Seo).
function PublicLayout() {
  return (
    <>
      <Seo />
      <Header />
      <div id="main-content" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotionFeatures} strict>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/training" element={<Training />} />
              <Route path="/training/apply" element={<TrainingApply />} />
              <Route path="/spawn-booking" element={<SpawnBooking />} />
              {/* Services and Mushroom Technologies are now sections of the Incubation page. */}
              {/* Pages merged into others: old links land on the new section. */}
              <Route path="/incubation" element={<Navigate to="/training#incubation" replace />} />
              <Route path="/services" element={<Navigate to="/training" replace />} />
              <Route path="/technologies" element={<Navigate to="/training#technologies" replace />} />
              <Route path="/value-added" element={<Navigate to="/spawn-booking#value-added" replace />} />
              <Route path="/media" element={<Navigate to="/news#media" replace />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/get-quote" element={<GetQuote />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/termsofservices" element={<Termsofservices />} />
              {/* Any other address: "Page not found" (marked noindex). */}
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Staff-only content management; not linked from the site and excluded from search engines. */}
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AdminApp />
                </Suspense>
              }
            />
          </Routes>
        </LazyMotion>
      </MotionConfig>
    </Router>
  );
}
