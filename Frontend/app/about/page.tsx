import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Zap,
  Shield,
  Users,
  Code,
  FacebookIcon,
  Edit,
  Speech
} from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function AboutPage() {
  const features = [
    {
      icon: <MessageSquare className='h-6 w-6' />,
      title: 'Smart talk',
      description:
        'Natural communication with AI using advanced language processing technology'
    },
    {
      icon: <FacebookIcon className='h-6 w-6' />,
      title: 'Facebook linked',
      description:
        'Links the content to post on facebook and other media platforms'
    },
    {
      icon: <Edit className='h-6 w-6' />,
      title: 'Edit content',
      description: 'You can edit the content before posting'
    },
    {
      icon: <Speech className='h-6 w-6' />,
      title: 'Speech to text',
      description: 'You can use speech to text to create content easily'
    }
  ];

  const chatbots = [
    {
      icon: <MessageSquare className='h-8 w-8' />,
      title: 'General Content Writer AI',
      description: 'Creates high-quality, engaging content for any topic'
    },
    {
      icon: <Zap className='h-8 w-8' />,
      title: 'Sales Copywriter AI',
      description: 'Creates high-quality, persuasive sales copy'
    },
    {
      icon: <Code className='h-8 w-8' />,
      title: 'Negotiation Document Writer AI',
      description: 'Creates professional negotiation documents for businesses'
    },
    {
      icon: <Users className='h-8 w-8' />,
      title: 'Marketing Content Creation AI',
      description: 'Develops creative marketing content and strategies'
    }
  ];

  return (
    <div className='min-h-screen bg-[#0e0314] text-white'>
      <Navbar />
      {/* About Section */}
      <section className='py-16 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
              About Our AI Chatbot
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Discover how our advanced AI technology is revolutionizing content
              creation and communication
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            <div>
              <h3 className='text-2xl font-bold mb-4 text-purple-400'>
                Our Mission
              </h3>
              <p className='text-gray-300 mb-6'>
                We're dedicated to making AI technology accessible and useful
                for everyone. Our chatbot solutions are designed to enhance
                productivity, creativity, and communication across various
                industries.
              </p>
              <p className='text-gray-300'>
                By leveraging the latest advancements in natural language
                processing and machine learning, we provide tools that
                understand context, learn from interactions, and deliver
                valuable insights.
              </p>
            </div>
            <div>
              <h3 className='text-2xl font-bold mb-4 text-purple-400'>
                Our Technology
              </h3>
              <p className='text-gray-300 mb-6'>
                Built on cutting-edge AI models, our chatbot utilizes advanced
                algorithms to understand and generate human-like text. We
                continuously train and improve our models to ensure the highest
                quality responses.
              </p>
              <p className='text-gray-300'>
                Our technology integrates seamlessly with existing workflows,
                providing a powerful tool that adapts to your specific needs and
                requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4 bg-[#150627]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
              Key Features
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Explore the powerful capabilities that make our AI chatbot stand
              out
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='bg-[#1a0936] border-purple-900/20 hover:border-purple-500/50 transition-all'
              >
                <CardContent className='p-6'>
                  <div className='h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mb-4 text-white'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-bold mb-2 text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-300'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore AI Chatbots Section */}
      <section className='py-16 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
              Explore AI Chatbots
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Discover our specialized AI solutions designed for different
              content needs
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {chatbots.map((chatbot, index) => (
              <div
                key={index}
                className='bg-[#1a0936] p-8 rounded-lg text-center'
              >
                <div className='h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4 text-white'>
                  {chatbot.icon}
                </div>
                <h3 className='text-xl font-bold mb-2 text-white'>
                  {chatbot.title}
                </h3>
                <p className='text-gray-300'>{chatbot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className='py-16 px-4 bg-[#150627]'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
              How It Works
            </h2>
            <p className='text-lg text-gray-300'>
              Simple process to start creating with AI
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                1
              </div>
              <h3 className='text-xl font-semibold mb-2 text-white'>
                Choose Your AI
              </h3>
              <p className='text-gray-300'>
                Select the specialized AI chatbot that fits your content needs
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                2
              </div>
              <h3 className='text-xl font-semibold mb-2 text-white'>
                Describe Your Needs
              </h3>
              <p className='text-gray-300'>
                Provide details about your content requirements and goals
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                3
              </div>
              <h3 className='text-xl font-semibold mb-2 text-white'>
                Get Results
              </h3>
              <p className='text-gray-300'>
                Receive high-quality, AI-generated content ready for use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-gradient-to-r from-purple-900 to-purple-700'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
            Ready to Transform Your Content Strategy?
          </h2>
          <p className='text-xl mb-8 text-white opacity-90'>
            Start creating powerful, engaging content with our AI tools today
          </p>
        </div>
      </section>
    </div>
  );
}
