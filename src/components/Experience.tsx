import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building } from "lucide-react";
import config from "@/data/config.json";

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Experience
          </h2>
          <p className="text-xl text-muted-foreground">
            My professional journey and key contributions
          </p>
        </div>

        <div className="space-y-8">
          {config.experience.map((exp, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl text-primary mb-2">{exp.position}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{exp.duration}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground mb-6 leading-relaxed">
                  {exp.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">Key Achievements:</h4>
                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add some visual indicators for the current role */}
                {index === 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Badge className="bg-primary text-primary-foreground">
                      Current Role
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;