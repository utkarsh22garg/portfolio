import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Award } from "lucide-react";
import config from "@/data/config.json";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {config.personal.summary}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Education */}
          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Education</h3>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">{config.education.degree}</h4>
                <p className="text-muted-foreground">{config.education.institution}</p>
                <p className="text-sm text-muted-foreground">{config.education.duration}</p>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  CGPA: {config.education.cgpa}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Location</h3>
              </div>
              <p className="text-lg text-card-foreground">{config.personal.location}</p>
              <p className="text-muted-foreground mt-2">
                Available for remote work and on-site collaboration
              </p>
            </CardContent>
          </Card>

          {/* Awards */}
          <Card className="border-border bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Recognition</h3>
              </div>
              <p className="text-muted-foreground">
                {config.awards.length} Awards & Achievements
              </p>
              <div className="mt-3">
                <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                  Top Performer
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center text-foreground">Technical Skills</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-primary mb-4">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {config.skills.languages.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-accent mb-4">Libraries & Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {config.skills.libraries.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-muted-foreground mb-4">Tools & Software</h4>
              <div className="flex flex-wrap gap-2">
                {config.skills.tools.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;