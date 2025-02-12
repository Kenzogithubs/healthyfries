import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Are your reviews sponsored or paid?",
      answer: "Never. We take pride in providing 100% honest, unbiased reviews. We don't accept paid promotions or sponsored content. Every review is based on real experience and thorough research."
    },
    {
      question: "How do you make money if you don't accept paid reviews?",
      answer: "We believe in transparency. Our site is supported by our loyal community through voluntary contributions and our newsletter subscriptions. This allows us to maintain complete editorial independence."
    },
    {
      question: "What's your review process?",
      answer: "Each review involves extensive research, personal testing, and community feedback. We purchase all products ourselves to ensure unbiased opinions. Our reviews include both pros and cons, because no product is perfect."
    },
    {
      question: "Why should I trust your reviews?",
      answer: "Our reputation is built on honesty. We don't sugarcoat our opinions or hide negative aspects of products. Every review includes detailed explanations of our testing process and real results."
    },
    {
      question: "How can I suggest a product for review?",
      answer: "We welcome suggestions from our community! You can reach out through our contact form or email. We prioritize reviewing products that our audience is most interested in."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478145046317-39f10e56b5e9')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Our Commitment to Truth</h1>
            <p className="text-xl text-white/90 mb-8">
              We believe in absolute transparency and honest reviews. No paid promotions, no hidden agendas – just genuine insights you can trust.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-16 -mt-20 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-4 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-amber-800 px-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-amber-700 px-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
