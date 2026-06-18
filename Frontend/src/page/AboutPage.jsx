import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Leaf } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Quality first',
      description: 'We never compromise on the quality of our beans, ingredients, or service. Every detail matters.'
    },
    {
      icon: Users,
      title: 'Community focused',
      description: 'We believe in building relationships, supporting local suppliers, and creating a welcoming space for everyone.'
    },
    {
      icon: Heart,
      title: 'Passion driven',
      description: "Coffee is more than a beverage to us. It's an art form, a daily ritual, and a way to bring people together."
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'From farm to cup, we prioritize ethical sourcing and environmentally responsible practices.'
    }
  ];

  const team = [
    {
      name: 'Elena Rodriguez',
      role: 'Founder & head roaster',
      bio: 'With 23 years of experience, Elena brings her passion for coffee and commitment to quality to every batch we roast.'
    },
    {
      name: 'Marcus Chen',
      role: 'Lead barista',
      description: "Marcus has won multiple latte art competitions and trains our team to deliver exceptional drinks every time."
    },
    {
      name: 'Anika Bergström',
      role: 'Pastry chef',
      description: 'Anika creates our fresh pastries daily using traditional techniques and locally sourced ingredients.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About us - Greenvin Coffee</title>
        <meta name="description" content="Learn about Greenvin Coffee's story, our commitment to quality, sustainability, and the passionate team behind every cup." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
                Our story
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Greenvin Coffee began in 1979 when Elena Rodriguez opened a small roastery in downtown Springfield. What started as a passion project has grown into a beloved community gathering place, but our commitment to exceptional coffee has never wavered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1567789762309-2bb332e77208" 
                    alt="Barista carefully preparing coffee" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">The art of the craft</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe coffee is more than just a morning pick-me-up. It's a ritual that brings people together, sparks conversations, and creates moments worth savoring. That's why we source our beans from sustainable farms in Ethiopia, Colombia, and Guatemala, building direct relationships with farmers who share our values.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every bean is carefully roasted in small batches to bring out its unique flavor profile. Our baristas are trained to treat each drink as a craft, whether it's a simple espresso or an elaborate specialty latte. We take pride in the details because we know they make all the difference.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 prose prose-lg max-w-none"
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">Uncompromising quality</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  From the moment the green beans arrive at our roastery to the final pour of milk, every step is monitored for quality. We grind our beans fresh for every single cup, ensuring maximum flavor extraction and aroma.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Greenvin Coffee serves over 2,847 customers each week, but we still approach every cup with the same care and attention Elena brought to that first batch in 1979. We're grateful to be part of this community, and we look forward to serving you.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg mt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1607139762190-b39c94de158d" 
                      alt="Grinding fresh coffee beans" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1685602729695-0664ea4e5c06" 
                      alt="Modern cafe design and environment" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet our team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind every cup
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm font-medium text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio || member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}