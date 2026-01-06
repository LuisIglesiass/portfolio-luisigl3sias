import { ArrowRight, ExternalLink, Github } from "lucide-react";

const projects = [
    {
      id: 1,
      title: "Aesthetic Art Gallery",
      description: "A minimalist digital art gallery built with Nuxt and GSAP, focused on refined typography, smooth scroll animations, and a calm, gallery-like visual experience.",
      image: "/projects/AestheticArtGallery.jpg",
      tags: ["Nuxt", "Vue", "GSAP", "ScrollTrigger", "UI/UX"],
      demoUrl: "https://aesthetic-art-gallery.vercel.app/",
      githubUrl: "https://github.com/LuisIglesiass/aesthetic-art-gallery",
    },
    {
    id: 2,
    title: "Smart Energy",
    description: "Real-time CO₂ and energy tracking with data visualization and category-based analysis.",
    image: "/projects/SmartEnergy.jpg",
    tags: ["Next.js", "TailwindCSS", "MongoDB"],
    demoUrl: "https://smart-energy-2e28tkmmo-luis-iglesias-projects.vercel.app",
    githubUrl: "https://github.com/LuisIglesiass/SmartEnergy",
  },
  {
    id: 3,
    title: "Tailwind UI Kit",
    description:
      "A modern, responsive UI components library built with Tailwind CSS and React, featuring clean design, ready-to-use components, and easy customization.",
    image: "/projects/MyUiKit.jpg",
    tags: ["React", "Tailwind CSS", "Vite"],
    demoUrl: "https://my-ui-kit-ten.vercel.app/",
    githubUrl: "https://github.com/LuisIglesiass/tailwind-ui-kit",
  },
  {
    id: 4,
    title: "HabitFlow",
    description:
      "Minimalist habit tracker with progress visualization and smart tracking features.",
    image: "/projects/HabitFlow.jpg",
    tags: ["React", "Tailwind", "Typescript"],
    githubUrl: "https://github.com/LuisIglesiass/habit-tracker",
  },
  {
    id: 5,
    title: "Movie Searcher",
    description:
      "Fast and minimal movie search tool using OMDb API and pure JavaScript.",
    image: "/projects/MovieSearcher.jpg",
    tags: ["Javascript", "CSS", "HTML"],
    demoUrl: "https://findmyfilm-neon.vercel.app/",
    githubUrl: "https://github.com/LuisIglesiass/movie-search-js",
  },
  {
    id: 6,
    title: "FocusList – React To-Do App",
    description: 
    "Clean to-do app for managing tasks with real-time stats and local storage.",
    image: "/projects/FocusList.jpg",
    tags: ["JavaScript", "React", "Vite", "CSS", "localStorage"],
    demoUrl: "https://focuslist-drab.vercel.app/",
    githubUrl: "https://github.com/LuisIglesiass/todo-app-react",
  },
  {
    id: 7,
    title: "Simple Calculator",
    description:
      "Lightweight calculator designed for quick and easy calculations.",
    image: "/projects/CalculatorApp.jpg",
    tags: ["Javascript", "CSS", "HTML"],
    demoUrl: "https://calculator-app-snowy-mu.vercel.app/",
    githubUrl: "https://github.com/LuisIglesiass/calculator-app",
  }
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/LuisIglesiass"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};