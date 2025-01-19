import { motion } from "framer-motion";
import { MessageSquare, History, Database, Settings, Bolt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const journeys = [
    {
      title: "Past Conversations",
      description: "Review and analyze previous conversation records",
      icon: <History className="w-6 h-6" />,
      onClick: () => navigate("/past-conversations"),
    },
    {
      title: "Online Conversations",
      description: "Monitor and analyze real-time conversations",
      icon: <MessageSquare className="w-6 h-6" />,
      onClick: () => console.log("Online Conversations - Coming Soon"),
    },
    {
      title: "Batch Conversations",
      description: "Process multiple conversations in bulk",
      icon: <Database className="w-6 h-6" />,
      onClick: () => console.log("Batch Conversations - Coming Soon"),
    },
    {
      title: "Admin Dashboard",
      description: "Access administrative controls and settings",
      icon: <Settings className="w-6 h-6" />,
      onClick: () => navigate("/admin"),
    },
  ];

  return (
    <div className="min-h-screen bg-canvas-bg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="mb-12 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-canvas-text bg-gray-100 px-6 py-3 rounded-lg">
              Outcomes360
            </h1>
            <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-lg self-start">
              <Bolt className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">AI</span>
            </div>
          </div>
          <p className="text-canvas-muted text-lg">
            Monitor, analyze, and ensure compliance across all conversations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <motion.div
              key={journey.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer h-full hover:shadow-lg transition-shadow"
                onClick={journey.onClick}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-canvas-accent/10 text-canvas-accent">
                      {journey.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{journey.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {journey.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;