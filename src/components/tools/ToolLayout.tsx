import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Check, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ComparisonItem {
  feature: string;
  current: boolean;
  competitor: boolean;
}

interface ToolLayoutProps {
  name: string;
  description: string;
  benefits: string[];
  features: Feature[];
  testimonials: Testimonial[];
  pricing: {
    price: string;
    interval: string;
    features: string[];
  }[];
  comparison: ComparisonItem[];
  techSpecs: {
    category: string;
    items: { label: string; value: string }[];
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  stats: {
    users: number;
    rating: number;
    reviews: number;
  };
}

export function ToolLayout({
  name,
  description,
  benefits,
  features,
  testimonials,
  pricing,
  comparison,
  techSpecs,
  faq,
  stats,
}: ToolLayoutProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-metallic-light mb-4">{name}</h1>
          <p className="text-xl text-accent-metallic mb-8">{description}</p>
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{stats.users}+ users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{stats.rating} rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{stats.reviews} reviews</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Try for Free</Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-accent-purple/10">
                    <Check className="w-5 h-5 text-accent-purple-light" />
                  </div>
                  <p className="text-accent-metallic">{benefit}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-accent-purple/10">
                    <feature.icon className="w-6 h-6 text-accent-purple-light" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-accent-metallic-light mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-accent-metallic">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-accent-metallic-light">{plan.price}</div>
                  <div className="text-accent-metallic">per {plan.interval}</div>
                </div>
                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-accent-purple-light" />
                      <span className="text-accent-metallic">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button fullWidth>Get Started</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Compare Solutions
        </h2>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="font-semibold text-accent-metallic-light">Feature</div>
            <div className="font-semibold text-accent-metallic-light text-center">Our Solution</div>
            <div className="font-semibold text-accent-metallic-light text-center">Competitors</div>
            {comparison.map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-accent-metallic">{item.feature}</div>
                <div className="text-center">
                  {item.current ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <div className="w-5 h-0.5 bg-red-500 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  {item.competitor ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <div className="w-5 h-0.5 bg-red-500 mx-auto" />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          What Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-accent-metallic-light">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-accent-metallic">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-accent-metallic">"{testimonial.content}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Technical Specifications
        </h2>
        <div className="space-y-8">
          {techSpecs.map((category, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold text-accent-metallic-light mb-4">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between">
                    <span className="text-accent-metallic">{item.label}</span>
                    <span className="text-accent-metallic-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faq.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold text-accent-metallic-light mb-2">
                {item.question}
              </h3>
              <p className="text-accent-metallic">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4">
        <Card className="p-12 text-center">
          <h2 className="text-3xl font-bold text-accent-metallic-light mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-accent-metallic mb-8">
            Join thousands of users already leveraging our platform
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
