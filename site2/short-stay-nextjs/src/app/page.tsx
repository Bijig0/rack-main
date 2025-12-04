import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { PrimaryButton, OutlinedButton } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { Check, X, Star, ArrowRight } from 'lucide-react';

const pricingFeatures = [
  {
    title: 'Customizable Data-Driven Smart Pricing',
    description:
      'Intelligent price recommendations considering market trends like supply, demand, seasons, events, and holidays, with full control over the final prices',
  },
  {
    title: 'Advanced Minimum Stay Intelligence',
    description:
      'Optimize booking duration with helpful recommendations specific to each property',
  },
  {
    title: 'Time-Saving Workflows',
    description:
      'View and update multiple properties in bulk with MultiCalendar, CSVs or APIs to save valuable time',
  },
];

const trustedIndustries = [
  { name: 'CoreLogic', img: '/images/corelogic.svg' },
  { name: 'AirDNA', img: '/images/airdna.svg' },
  { name: 'Wheelhouse', img: '/images/wheelhouse.svg' },
];

const toolFeatures = [
  {
    icon: '📋',
    title: 'Structured Property Checklists',
    description:
      'Capture every detail during site visits, with customizable fields and mobile-friendly design.',
  },
  {
    icon: '📈',
    title: 'Live Market Data Panel',
    description:
      'Visualize pricing trends, occupancy rates, and demand indicators from trusted APIs—right where you need them.',
  },
  {
    icon: '📄',
    title: 'Automated Rental Appraisal Generator',
    description:
      'Produce sleek, data-backed reports in minutes—perfect for investor presentations or internal evaluations.',
  },
];

const platformComparison = {
  withPlatform: [
    'All your data, aggregated in one place',
    'Standardized reports ready for investors',
    'Instant alerts for planning & risk factors',
    'Make decisions backed by real-time analytics',
  ],
  withoutPlatform: [
    'Manually searching 5+ sites for data',
    'Inconsistent, unstructured appraisals',
    'Overlooking zoning and environmental risks',
    'Relying on gut feeling',
  ],
};

const testimonials = [
  {
    name: 'Mark McCarthy',
    avatar: '/images/avatar.svg',
    rating: 5,
    comment:
      'This platform saves me hours every week. The generated reports are investor-ready and backed by real-time data.',
  },
  {
    name: 'Robert Fox',
    avatar: '/images/avatar1.svg',
    rating: 5,
    comment:
      'As an investor, I need clarity. This tool gives me the confidence to act quickly on the right properties.',
  },
  {
    name: 'James Wilson',
    avatar: '/images/avatar2.svg',
    rating: 5,
    comment:
      'This platform saves me hours every week. The appraisal reports are investor-ready and backed by real-time data.',
  },
];

const pricingPlans = [
  {
    type: 'STARTER PLAN',
    price: '$29',
    currency: 'AUD',
    period: '/month',
    description: 'Ideal For: New buyer agents or low-volume users',
    features: [
      'Create and manage up to 10 properties',
      'Access to 3 checklist templates',
      'Generate up to 10 rental appraisal reports/month',
    ],
    buttonLabel: 'Get Started',
    isPopular: false,
  },
  {
    type: 'PROFESSIONAL PLAN',
    price: '$59',
    currency: 'AUD',
    period: '/month',
    description: 'Ideal For: Active agents managing multiple properties',
    features: [
      'Create and manage up to 50 properties',
      'Access to unlimited checklist templates',
      'Generate up to 50 rental appraisal reports/month',
      'Email support',
    ],
    buttonLabel: 'Get Started',
    isPopular: true,
  },
  {
    type: 'PREMIUM PLAN',
    price: '$99',
    currency: 'AUD',
    period: '/month',
    description: 'Ideal For: Power users and agencies',
    features: [
      'Create and manage unlimited properties',
      'Access to all available checklist templates',
      'Generate unlimited appraisal reports',
      'Priority email support',
      'Early access to new features',
    ],
    buttonLabel: 'Get Started',
    isPopular: false,
  },
];

const faqItems = [
  {
    question: 'What types of properties are supported?',
    answer:
      'Residential properties, with support for short stay market analysis.',
  },
  {
    question: 'Can I export or share reports?',
    answer:
      'Yes, all reports can be exported as PDFs and shared directly via email or download link.',
  },
  {
    question: 'Is this platform only for buyer agents?',
    answer:
      'No, our platform is designed for buyer agents, property managers, and investors looking to analyze short-stay potential.',
  },
  {
    question: 'What data sources are used?',
    answer:
      'We integrate with leading industry APIs including AirDNA, CoreLogic, and other trusted data providers for accurate market insights.',
  },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-primary py-12 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                From front door to forecast – Your property investment journey
                starts here.
              </h1>
              <p className="text-lg lg:text-xl text-white/90 mt-6">
                Discover high-potential short stay properties with dynamic
                rental appraisals, on-site checklists, and integrated
                environmental risk data—powered by leading industry APIs.
              </p>
              <PrimaryButton
                className="mt-8 bg-white text-primary hover:bg-gray-100"
                label="Download Sample Report"
              />
            </div>
            <div>
              <Image
                src="/images/hero-img.svg"
                alt="Property Investment"
                width={600}
                height={500}
                className="w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Revenue Section */}
      <section className="py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
              Increase Revenue With Data-Driven Pricing
            </h2>
            <p className="text-lg text-gray">
              From pinpointing a property to presenting investor-ready
              reports—our dashboard brings every step of the appraisal journey
              into one seamless workflow.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/revenue-img.svg"
                alt="Revenue Analytics"
                width={600}
                height={500}
                className="w-full"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark mb-2">
                Dynamic Pricing
              </h3>
              <p className="text-gray mb-6">
                Now with Hyper Local Pulse (HLP), our smart pricing algorithm
                that uses hyper local market data to make accurate pricing
                decisions
              </p>
              <ul className="space-y-4">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-dark">
                        {feature.title}
                      </h4>
                      <p className="text-gray mt-1">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Trusted Industries */}
      <section className="py-12 bg-dark">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <h3 className="text-2xl font-semibold text-white text-center lg:text-left">
              Powered by Trusted Industry Data Sources
            </h3>
            <div className="flex items-center justify-center lg:justify-end gap-8 flex-wrap">
              {trustedIndustries.map((industry) => (
                <Image
                  key={industry.name}
                  src={industry.img}
                  alt={industry.name}
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Powerful Tools Section */}
      <section className="py-16 bg-light">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
              Powerful Tools. Clean, Modern Interface.
            </h2>
            <p className="text-lg text-gray">
              From pinpointing a property to presenting investor-ready
              reports—our dashboard brings every step of the appraisal journey
              into one seamless workflow.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {toolFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <h4 className="text-xl font-bold text-dark">
                    {feature.icon} {feature.title}
                  </h4>
                  <p className="text-gray mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
            <div>
              <Image
                src="/images/modernimg.svg"
                alt="Modern Interface"
                width={600}
                height={500}
                className="w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Why Use Our Platform */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark">
              Why Use Our Platform
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                With Our Platform
              </h3>
              <ul className="space-y-3">
                {platformComparison.withPlatform.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Without Our Platform
              </h3>
              <ul className="space-y-3">
                {platformComparison.withoutPlatform.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Testimonials
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-dark">
                      {testimonial.name}
                    </h4>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-golden fill-golden"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray leading-relaxed">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-16" id="pricing">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-dark mb-4">
              Simple Pricing for Powerful Insights.
            </h2>
            <p className="text-xl text-gray">
              Whether you&apos;re a solo agent or managing multiple clients, our
              plans scale with your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md flex flex-col ${
                  plan.isPopular ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-dark mb-2">
                    {plan.type}
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary">
                      {plan.currency}
                    </span>
                    <span className="text-4xl font-bold text-primary mx-1">
                      {plan.price}
                    </span>
                    <span className="text-lg text-dark">{plan.period}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-dark mb-3">
                    What&apos;s Included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-6">
                  <Link href="/register">
                    {plan.isPopular ? (
                      <PrimaryButton
                        label={plan.buttonLabel}
                        icon={<ArrowRight className="w-4 h-4" />}
                        iconPos="right"
                        className="w-full"
                      />
                    ) : (
                      <OutlinedButton
                        label={plan.buttonLabel}
                        icon={<ArrowRight className="w-4 h-4" />}
                        iconPos="right"
                        className="w-full"
                      />
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqItems} />
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
