import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContactForm from '@/components/ContactForm.jsx';
import MapEmbed from '@/components/MapEmbed.jsx';

export default function ContactPage() {
  const hours = [
    { day: 'Monday - Friday', time: '6:30 AM - 8:00 PM' },
    { day: 'Saturday', time: '7:00 AM - 9:00 PM' },
    { day: 'Sunday', time: '7:00 AM - 9:00 PM' }
  ];

  return (
    <>
      <Helmet>
        <title>Contact us - Greenvin Coffee</title>
        <meta name="description" content="Get in touch with Greenvin Coffee. Visit us, call, or send a message. We'd love to hear from you." />
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
                Get in touch
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Stop by, give us a call, or send us a message
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h2>
                <ContactForm />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Contact information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Address</p>
                        <p className="text-sm text-muted-foreground">
                          Street: No.5, Srah Keo Village, Kampong Preah Commune, Sangkae District, Battambang Province<br />
                          Springfield, OR 97477
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Phone</p>
                        <a href="tel:+15035551234" className="text-sm text-muted-foreground hover:text-primary transition-all duration-200">
                          (+855) 123 234 567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Email</p>
                        <a href="mailto:justinhello@greenvincoffee.com" className="text-sm text-muted-foreground hover:text-primary transition-all duration-200">
                          justinhello@greenvincoffee.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Hours of operation
                  </h3>
                  <div className="bg-card rounded-xl p-6 shadow-sm">
                    <table className="w-full">
                      <tbody className="divide-y divide-border">
                        {hours.map((schedule, index) => (
                          <tr key={index}>
                            <td className="py-3 text-sm font-medium text-foreground">{schedule.day}</td>
                            <td className="py-3 text-sm text-muted-foreground text-right">{schedule.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Find us</h2>
              <MapEmbed />
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}