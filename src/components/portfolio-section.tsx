import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./project-card";
import type { Project } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PortfolioSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 relative">
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-light"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-inter font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A showcase of my journey in software development, data analysis, and innovative projects.
          </p>
        </div>
        <div className="flex justify-center my-8">
          <Link to="/portfolio" className="inline-flex items-center text-tech-light hover:text-neon-cyan bg-dark-bg border border-tech-light px-4 py-2 rounded-full transition-colors duration-300">
            View All Portfolios <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => p.featured).map((project, index) => (
            <ProjectCard key={project.id} project={project} isImage={false} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
