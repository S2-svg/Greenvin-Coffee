import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GalleryImage from '@/components/GalleryImage.jsx';

export default function GalleryPage() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1699396178638-cf55dc1317d1',
      alt: 'Warm coffee shop atmosphere with customers enjoying drinks',
      caption: 'Our welcoming space'
    },
    {
      src: 'https://images.unsplash.com/photo-1592809617613-434cd2efab9d',
      alt: 'Cozy seating area with natural lighting',
      caption: 'Perfect spot to relax'
    },
    {
      src: 'https://images.unsplash.com/photo-1629814558612-6e6a38b79f98',
      alt: 'Modern coffee shop interior with wooden accents',
      caption: 'Thoughtfully designed interior'
    },
    {
      src: 'https://images.unsplash.com/photo-1656159512988-3e293f5a41b3',
      alt: 'Barista carefully preparing espresso',
      caption: 'Crafted with precision'
    },
    {
      src: 'https://images.unsplash.com/photo-1696686575259-b413296ac67b',
      alt: 'Latte art being poured into a cup',
      caption: 'Art in every cup'
    },
    {
      src: 'https://images.unsplash.com/photo-1607613982330-4acfb339788b',
      alt: 'Coffee shop interior with warm ambient lighting',
      caption: 'A place to gather'
    },
    {
      src: 'https://images.unsplash.com/photo-1678791160773-c6d13bf417ac',
      alt: 'Freshly brewed espresso in a white cup',
      caption: 'Rich, bold espresso'
    },
    {
      src: 'https://images.unsplash.com/photo-1521161908453-1cacd0215437',
      alt: 'Creamy latte with beautiful foam art',
      caption: 'Velvety smooth lattes'
    },
    {
      src: 'https://images.unsplash.com/photo-1626201629367-03921bb3bf8c',
      alt: 'Cappuccino with perfect foam texture',
      caption: 'Classic cappuccinos'
    },
    {
      src: 'https://images.unsplash.com/photo-1682687224418-9c1b2e5a7c8e',
      alt: 'Barista pouring steamed milk into a cup of coffee',
      caption: 'The art of pouring'
    },
    // Interiors & Atmosphere
    { src: 'https://images.unsplash.com/photo-1538078813755-ba9b7ac8e6c3', alt: 'Cozy seating with warm lighting', caption: 'Warm and inviting atmosphere' },
    { src: 'https://images.unsplash.com/photo-1699301178449-eb7aa74d2ef0', alt: 'Comfortable cafe interior', caption: 'A place to relax and connect' },
    { src: 'https://images.unsplash.com/photo-1652512260930-98521f1b5614', alt: 'Modern cafe design', caption: 'Modern, clean aesthetic' },
    { src: 'https://images.unsplash.com/photo-1550688561-a259d9d15e34', alt: 'Barista at work', caption: 'Crafting your perfect cup' },
    { src: 'https://images.unsplash.com/photo-1567789762309-2bb332e77208', alt: 'Barista preparing coffee', caption: 'Precision in every pour' },
    { src: 'https://images.unsplash.com/photo-1685602729695-0664ea4e5c06', alt: 'Premium minimalist cafe', caption: 'Thoughtfully designed spaces' },

    // Customers & Atmosphere
    { src: 'https://images.unsplash.com/photo-1671342322594-6d5990d500fe', alt: 'Customers enjoying coffee', caption: 'Community at our core' },
    { src: 'https://images.unsplash.com/photo-1601914511778-046273fbcc22', alt: 'Upscale coffee shop ambiance', caption: 'Your daily retreat' },

    // Drink Photography
    { src: 'https://images.unsplash.com/photo-1641962710743-72b45db10571', alt: 'Espresso with latte art', caption: 'Signature latte art' },
    { src: 'https://images.unsplash.com/photo-1692036026173-8650d9b57e42', alt: 'Professional espresso shot', caption: 'Rich, bold espresso' },
    { src: 'https://images.unsplash.com/photo-1521868328968-ec26b3b3b6b2', alt: 'Espresso in ceramic cup', caption: 'The perfect extraction' },
    { src: 'https://images.unsplash.com/photo-1632487274350-5fd14a1bdb64', alt: 'Cappuccino with foam art', caption: 'Velvety smooth cappuccinos' },
    { src: 'https://images.unsplash.com/photo-1472651030833-8ed31729c888', alt: 'Cappuccino beverage', caption: 'Classic comfort' },
    { src: 'https://images.unsplash.com/photo-1544803591-2267f09d81a3', alt: 'Cold brew iced coffee', caption: 'Refreshing cold brew' },
    { src: 'https://images.unsplash.com/photo-1703022726280-06dc0801fe50', alt: 'Iced specialty beverage', caption: 'Specialty iced drinks' },

    // Food & Pastries
    { src: 'https://images.unsplash.com/photo-1585729986380-5ac3b27521ac', alt: 'Fresh croissants', caption: 'Flaky, buttery croissants' },
    { src: 'https://images.unsplash.com/photo-1691625739165-39f123a5216f', alt: 'Pastries on plate', caption: 'Freshly baked daily' },
    { src: 'https://images.unsplash.com/photo-1554781432-97f6388fab35', alt: 'Muffins and baked goods', caption: 'Artisan muffins' },
    { src: 'https://images.unsplash.com/photo-1681713483173-656c6ce76cb1', alt: 'Breakfast sandwich', caption: 'Hearty breakfast options' },
    { src: 'https://images.unsplash.com/photo-1578390590504-f4d5727c511c', alt: 'Desserts and treats', caption: 'Sweet indulgences' },

    // Coffee Preparation
    { src: 'https://images.unsplash.com/photo-1607139762190-b39c94de158d', alt: 'Grinding coffee beans', caption: 'Freshly ground for every cup' },
    { src: 'https://images.unsplash.com/photo-1514927298007-a2b56e5270e1', alt: 'Pouring water brewing', caption: 'Mastering the pour-over' },
    { src: 'https://images.unsplash.com/photo-1606160596346-47f3e09f473a', alt: 'Coffee preparation technique', caption: 'Attention to detail' },
    { src: 'https://images.unsplash.com/photo-1681362241937-fc167cb6b530', alt: 'Brewing process', caption: 'The art of brewing' }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery - Greenvin Coffee</title>
        <meta name="description" content="Explore photos of our coffee shop atmosphere, interior design, and beautifully crafted drinks." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                Gallery
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A glimpse into our space, our craft, and the moments we create together
              </p>
            </motion.div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {images.map((image, index) => (
                <GalleryImage
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  caption={image.caption}
                />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
