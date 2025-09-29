import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertProject, insertProjectSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



interface AdminProjectFormProps { onClose: () => void; project?: InsertProject; }
export default function AdminServiceForm({ onClose, project }: AdminProjectFormProps) {

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [techInput, setTechInput] = useState("");

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      technologies: project?.technologies || [],
      gradientFrom: project?.gradientFrom || "#3b82f6",
      gradientTo: project?.gradientTo || "#1e293b",
      demoUrl: project?.demoUrl || "",
      githubUrl: project?.githubUrl || "",
      featured: project?.featured || false,
      order: project?.order || 1,
      content: project?.content || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("POST", `/api/projects`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error creating project", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("PUT", `/api/projects/${project?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully!" });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: "Error updating project", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertProject) => {
    const filteredTechnologies = technologies.filter(t => t.trim() !== "");
    const projectData = { ...data, technologies: filteredTechnologies };
    if (project) {
      updateMutation.mutate(projectData);
    } else {
      createMutation.mutate(projectData);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const updateTechnology = (index: number, value: string) => {
    const newTechs = [...technologies];
    newTechs[index] = value;
    setTechnologies(newTechs);
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  return (
    <Card className="bg-dark-secondary border-gray-700 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white">{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-10 gap-4">
            <div className="col-span-8">
              <Label htmlFor="title" className="text-white">Project Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                className="bg-dark-bg border-gray-600 text-white"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="order" className="text-white">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                {...form.register("order", { valueAsNumber: true })}
                className="bg-dark-bg border-gray-600 text-white"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className="bg-dark-bg border-gray-600 text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="image" className="text-white">Image URL</Label>
            <Input
              id="image"
              type="url"
              {...form.register("image")}
              className="bg-dark-bg border-gray-600 text-white"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          <div>
            <Label className="text-white">Technologies</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="Add technology (e.g., React)"
              />
              <Button type="button" onClick={addTechnology} className="px-4">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-tech-light/20 text-tech-light rounded-full text-sm flex items-center"
                >
                  <Input
                    value={tech}
                    onChange={(e) => updateTechnology(index, e.target.value)}
                    className="bg-transparent border-none text-tech-light w-auto px-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="gradientFrom" className="text-white">Gradient Start Color</Label>
              <Input
                id="gradientFrom"
                type="color"
                {...form.register("gradientFrom")}
                className="bg-dark-bg border-gray-600 text-white h-12"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="gradientTo" className="text-white">Gradient End Color</Label>
              <Input
                id="gradientTo"
                type="color"
                {...form.register("gradientTo")}
                className="bg-dark-bg border-gray-600 text-white h-12"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="demoUrl" className="text-white">Demo URL (Optional)</Label>
              <Input
                id="demoUrl"
                type="url"
                {...form.register("demoUrl")}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="https://demo.example.com"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl" className="text-white">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                type="url"
                {...form.register("githubUrl")}
                className="bg-dark-bg border-gray-600 text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="content" className="text-white">Detailed Content (Optional)</Label>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={form.watch("content") || ""}
                onChange={(content) => form.setValue("content", content)}
                placeholder="Detailed project description for the project page..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike',
                  'list', 'bullet', 'link', 'image'
                ]}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '6px',
                  border: '1px solid #4b5563',
                }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={form.watch("featured")}
              onCheckedChange={(checked) => form.setValue("featured", checked)}
            />
            <Label htmlFor="featured" className="text-white">
              Featured Project
            </Label>
          </div>
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-tech-blue to-tech-light"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : project
                  ? "Update Project"
                  : "Add Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}