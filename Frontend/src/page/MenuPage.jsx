import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DrinkCard from '@/components/DrinkCard.jsx';
import FoodCard from '@/components/FoodCard.jsx';
import { getMenu } from '@/lib/api.js';
import { useCart } from '@/hooks/useCart.js';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('drinks');
  const [menuData, setMenuData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await getMenu();
        setMenuData(data);
      } catch (err) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Menu - Greenvin Coffee</title>
        <meta name="description" content="Explore our menu of premium espresso drinks, specialty lattes, cold brew, fresh pastries, and artisan food items." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                Our menu
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handcrafted drinks and fresh food made with the finest ingredients
              </p>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="drinks">Drinks</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
              </TabsList>

              <TabsContent value="drinks" className="space-y-16">
                {Object.entries(menuData.drinks).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {items.map((item) => (
                        <DrinkCard key={item.id} item={item} onAddToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="food" className="space-y-16">
                {Object.entries(menuData.food).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {items.map((item) => (
                        <FoodCard key={item.id} item={item} onAddToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}