import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Calendar } from "lucide-react";
import config from "@/data/config.json";

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Projects
          </h2>
          <p className="text-xl text-muted-foreground">
            Some of my notable work and contributions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {config.projects.map((project, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-accent">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{project.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs border-primary text-primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(project.github, '_blank')}
                    className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Awards section */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center text-foreground">Awards & Achievements</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {config.awards.map((award, index) => (
              <Card key={index} className="border-border bg-card hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-primary">{award.title}</h4>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {award.date}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {award.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Interested in working together?
          </h3>
          <p className="text-muted-foreground mb-6">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <Button 
            size="lg"
            onClick={() => window.open(`mailto:${config.personal.email}`, '_blank')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;