import Link from "next/link"
import { MessageSquare, BarChart, FileText, Megaphone } from "lucide-react"

interface ChatbotCardProps {
  type: "general" | "sales" | "negotiation" | "marketing"
  isActive?: boolean
}

export function ChatbotCard({ type, isActive = false }: ChatbotCardProps) {
  const cardData = {
    general: {
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      title: "General Content Writer AI",
      description:
        "Generate high-quality, engaging content on any topic, from informative articles to thought-provoking blog posts, tailored to your audience's needs.",
    },
    sales: {
      icon: <BarChart className="h-8 w-8 text-white" />,
      title: "Sales Copywriter AI",
      description:
        "AI empowers you to generate high-quality, engaging content on any topic, ranging from in-depth informative articles to thought-provoking blog posts, all meticulously tailored to captivate your audience.",
    },
    negotiation: {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Negotiation Document Writer AI",
      description:
        "Create professionally crafted documents for your negotiations, from proposals to contracts, ensuring clear, concise, and persuasive written communications.",
    },
    marketing: {
      icon: <Megaphone className="h-8 w-8 text-white" />,
      title: "Marketing Content Creation AI",
      description:
        "Develop creative and strategic marketing content that stands out in the market, from social media posts to video scripts, resonating with your audience and driving engagement.",
    },
  }

  const data = cardData[type]

  return (
    <Link
      href={`/chatbot/${type}`}
      className={`block ${isActive ? "bg-purple-900/50" : "bg-purple-900/20"} rounded-lg p-6 transition-all hover:bg-purple-900/40`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-purple-600 p-3 rounded-full mb-4">{data.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
        <p className="text-sm text-gray-300">{data.description}</p>
      </div>
    </Link>
  )
}

