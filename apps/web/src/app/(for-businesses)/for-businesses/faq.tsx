import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Image from 'next/image'
import BarberImage from './barber-web-img.png'

const FAQ = () => {
  return (
    <section
      id="faq"
      style={{ maxWidth: '1280px' }}
      className="mx-auto space-y-4 px-8 py-16 lg:px-32 "
    >
      <Image
        src={BarberImage}
        alt="barber web img"
        width={768}
        className="flex-1 pb-8 lg:hidden"
      />

      <div className="flex flex-col ">
        <p className="mx-auto rounded-3xl px-6 py-2 text-lg font-bold text-purple-500 underline">
          FAQs
        </p>

        <h2 className="text-center text-3xl font-bold underline">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <Image
          src={BarberImage}
          alt="barber web img"
          width={768}
          className="hidden flex-1 lg:block"
        />
        <Accordion type="single" collapsible className="w-full lg:flex-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Why should I sign up?</AccordionTrigger>
            <AccordionContent>
              TaperAU is the home for independent barbers all around Australia.
              With thousands of customers using us to find their next fresh
              barber, TaperAU is the best place to showcase your profile
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How much does it cost?</AccordionTrigger>
            <AccordionContent>
              Completely free! From the moment you sign up to the first bookings
              you get through Taper, we are proud to offer a completely free
              experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Simply sign up, create a profile, and you're all set!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
