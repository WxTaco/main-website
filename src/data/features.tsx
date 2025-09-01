import { 
  Shield, 
  BarChart3, 
  Users, 
  Zap, 
  Settings, 
  Bot 
} from 'lucide-react'

export const featuresData = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Advanced Moderation",
    description: "Keep your server safe with powerful moderation tools and auto-moderation features."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description: "Track server activity, member growth, and engagement with detailed analytics."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Member Management",
    description: "Manage roles, permissions, and member interactions with ease."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Custom Commands",
    description: "Create custom commands and automate server tasks with our powerful system."
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Easy Configuration",
    description: "Set up and configure your bot in minutes with our intuitive dashboard."
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "24/7 Uptime",
    description: "Reliable hosting ensures your bot is always online and ready to serve."
  }
]
