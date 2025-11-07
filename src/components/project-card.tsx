import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
  isImage: boolean;
}

export default function ProjectCard({ project, isImage }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/project/${project.id}`}>
      <div className="glass-morphism rounded-xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 15px 30px rgba(0, 255, 255, 0.15)' : 'none'
        }}
      >
        {isImage &&
          <img
            src={project.image}
            alt={project.title}
            className="" />
        }

        <div className="p-6">
          <div className="text-xs text-gray-500 mb-2">
            {new Date(project.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-tech-light transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {project.description.length > 250 ? project.description.substring(0, 250) + "..." : project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <button className="inline-flex items-center text-tech-light hover:text-neon-cyan transition-colors">
            View Project <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </Link>
  );
}
