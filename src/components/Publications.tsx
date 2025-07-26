import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, BookOpen } from "lucide-react";
import config from "@/data/config.json";

const Publications = () => {
  return (
    <section id="publications" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Publications
          </h2>
          <p className="text-xl text-muted-foreground">
            My published research and articles
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 mb-16">
          {config.publications.map((publication, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                    {publication.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-accent">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{publication.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{publication.journal}</span>
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed">
                  {publication.description}
                </p>

                <div className="flex gap-2 mt-6">
                  {publication.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="group/btn"
                      asChild
                    >
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        View Publication
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
