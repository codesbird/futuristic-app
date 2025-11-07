import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Project } from "@shared/schema";
import ProjectCard from "../components/project-card";

export default function PortfolioPage() {

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <div className="container mx-auto px-6 py-8">
                <Link to="/">
                    <Button variant="outline" className="mb-8">
                        <ArrowLeft className="mr-2" size={16} />
                        Back to Home
                    </Button>
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-inter font-bold mb-6">
                        My <span className="gradient-text">Portfolio</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        A comprehensive collection of my work, showcasing diverse projects in software development, data analysis, and more.
                    </p>
                </div>

                {/* All Projects Grid */}
                <AllProjectsGrid />
            </div>
        </div>
    )
}

function AllProjectsGrid() {
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
        <>
            {projects.filter(p => p.featured).length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Featured Projects</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.filter(p => p.featured).map((project, index) => (
                            <ProjectCard key={project.id} project={project} isImage={true} index={index} />
                        ))}
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-bold gradient-text mb-8 border-b text-center">Recent Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                    .filter(p => !p.featured) // Exclude featured projects from this list
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by creation date descending
                    .map((project, index) => (
                        <ProjectCard key={project.id} project={project} isImage={true} index={index} />
                    ))}
            </div>
        </>
    );
}

interface ProjectCardProps {
    project: Project;
}
