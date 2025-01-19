import { motion } from "framer-motion";
import { Square, Circle, Triangle } from "lucide-react";

const Canvas = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="inline-block px-4 py-1.5 bg-tool-secondary/10 text-tool-secondary rounded-full text-sm font-medium mb-6">
              Intuitive Canvas
            </span>
            <h2 className="text-4xl font-bold text-canvas-text mb-6">
              Your Creative Space, <br />Reimagined
            </h2>
            <p className="text-canvas-muted text-lg mb-8">
              Experience a canvas that adapts to your workflow. With smart guides,
              precise controls, and infinite possibilities.
            </p>
            <div className="flex gap-4">
              <ToolButton icon={<Square className="w-5 h-5" />} label="Shapes" />
              <ToolButton icon={<Circle className="w-5 h-5" />} label="Elements" />
              <ToolButton icon={<Triangle className="w-5 h-5" />} label="Components" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="relative aspect-square max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-tool-primary/10 to-tool-secondary/10 rounded-2xl" />
              <div className="absolute inset-4 bg-white rounded-xl shadow-lg" />
              <div className="absolute inset-y-8 inset-x-8 bg-canvas-bg rounded-lg" />
              <GridPattern />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ToolButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-canvas-bg hover:bg-canvas-border/20 transition-colors duration-200"
  >
    {icon}
    <span className="text-canvas-text font-medium">{label}</span>
  </motion.button>
);

const GridPattern = () => (
  <div className="absolute inset-8 grid grid-cols-4 gap-4 pointer-events-none">
    {Array.from({ length: 16 }).map((_, i) => (
      <div
        key={i}
        className="aspect-square rounded-md bg-canvas-border/20"
      />
    ))}
  </div>
);

export default Canvas;