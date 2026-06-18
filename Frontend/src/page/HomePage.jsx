import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Leaf, Heart, Loader2 } from "lucide-react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import MenuItemCard from "@/components/MenuItemCard.jsx";
import { getFeaturedItems } from "@/lib/api.js";
import { useCart } from "@/hooks/useCart.js";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedItems();
        setFeaturedItems(data);
      } catch (err) {
        console.error("Failed to load featured items:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
      <Helmet>
        <title>Greenvin Coffee - Premium specialty coffee in Springfield</title>
        <meta
          name="description"
          content="Experience exceptional coffee at Greenvin Coffee. Serving premium specialty drinks, fresh pastries, and artisan food since 1979."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1538078813755-ba9b7ac8e6c3"
              alt="Cozy coffee shop interior with warm lighting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-overlay" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Welcome to Greenvin Coffee
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Where every cup is crafted with passion, precision, and the
                finest beans from around the world
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/menu">
                  <Button size="lg" className="text-lg px-8">
                    Browse menu
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/order">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    Order now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Why choose Greenvin Coffee
              </motion.h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're committed to delivering an exceptional coffee experience
                in every cup
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Coffee className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  Premium quality beans
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We source our beans from sustainable farms across Ethiopia,
                  Colombia, and Guatemala, ensuring every cup delivers
                  exceptional flavor and supports ethical farming practices.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  Sustainable practices
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  From compostable cups to energy-efficient roasting, we're
                  dedicated to reducing our environmental impact while serving
                  the community we love.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-muted rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3 text-center">
                Crafted with care
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
                Our skilled baristas bring 47 years of combined experience,
                treating each drink as a work of art. Whether it's your morning
                espresso or afternoon latte, we pour our passion into every cup.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Featured favorites
              </motion.h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our most loved drinks and treats
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                <p>Failed to load featured items. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MenuItemCard item={item} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/menu">
                <Button size="lg">
                  View full menu
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1550688561-a259d9d15e34"
                    alt="Customers enjoying coffee in a warm atmosphere"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  More than just coffee
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Greenvin Coffee is a gathering place. Whether you're meeting a
                  friend, catching up on work, or simply taking a moment for
                  yourself, our space is designed to make you feel right at
                  home.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join our community of coffee lovers and experience the warmth
                  and hospitality that has made us a local favorite since 1979.
                </p>
                <Link to="/gallery">
                  <Button variant="outline" size="lg">
                    View gallery
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
