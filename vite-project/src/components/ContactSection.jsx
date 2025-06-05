import {
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Send
  } from "lucide-react";
  
  export const ContactSection = () => {

	return (
	  <section id="contact" className="py-24 px-4 relative bg-secondary/30">
		<div className="container mx-auto max-w-5xl">
		  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
			Get In <span className="text-primary"> Touch</span>
		  </h2>
  
		  <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
			Have a project in mind or want to collaborate? Feel free to reach out.
			I'm always open to discussing new opportunities.
		  </p>
  
		  <div className="grid grid-cols-1 md:grid-cols-1 gap-12 justify-center">
			<div className="space-y-8 mx-auto text-center">  
			  <div className="space-y-6 justify-center">
				<div className="flex items-start space-x-4">
				  <div className="p-3 rounded-full bg-primary/10">
					<Mail className="h-6 w-6 text-primary" />{" "}
				  </div>
				  <div>
					<h4 className="font-medium"> Email</h4>
					<a
					  href="mailto:hello@gmail.com"
					  className="text-muted-foreground hover:text-primary transition-colors"
					>
					  lluis.igl3sias@gmail.com
					</a>
				  </div>
				</div>
				<div className="flex items-start space-x-4">
				  <div className="p-3 rounded-full bg-primary/10">
					<MapPin className="h-6 w-6 text-primary" />{" "}
				  </div>
				  <div>
					<h4 className="font-medium"> Location</h4>
					<a className="text-muted-foreground hover:text-primary transition-colors">
					  Hamburg, DE, Germany
					</a>
				  </div>
				</div>
			  </div>
  
			  <div className="pt-8">
				<h4 className="font-medium mb-4"> Connect With Me</h4>
				<div className="flex space-x-4 justify-center">
				  <a href="https://www.linkedin.com/in/luis-iglesias-ab8068243/" target="_blank">
					<Linkedin />
				  </a>
				  <a href="https://www.instagram.com/lluis.iglesias?igsh=ZWl1NHg1dm1vMmJ3&utm_source=qr" target="_blank">
					<Instagram />
				  </a>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </section>
	);
  };