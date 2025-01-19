import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Canvas from "../components/Canvas";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-canvas-bg"
    >
      <Hero />
      <Canvas />
    </motion.div>
  );
};

export default Index;