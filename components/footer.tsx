import { Hotel, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/10 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Hotel className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Neware Khaja Ghar</span>
            </div>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Premium guest house and restaurant experience with authentic hospitality and comfortable rooms.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Phones:</span><br/>
                9811529745, 9821426998, 9841621462
              </li>
              <li>
                <span className="font-medium text-foreground">Email:</span><br/>
                <a href="mailto:raj123nayaju@gmail.com" className="hover:text-primary transition-colors">raj123nayaju@gmail.com</a>
              </li>
              <li className="flex items-center gap-4 pt-2">
                <a href="https://www.instagram.com/newari_khaja_ghar2/" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary transition-colors font-medium">Instagram</a>
                <a href="https://sabin.tik" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary transition-colors font-medium">TikTok</a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">
              <a href="https://maps.app.goo.gl/cvjcys9arWzdjgsF8" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                Our Location <ArrowRight className="h-4 w-4" />
              </a>
            </h4>
            <div className="h-48 w-full rounded-2xl overflow-hidden border border-border/50 bg-muted">
              {/* Generic map embed as a placeholder for the shortlink location */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.64621398864!2d85.25006095594411!3d27.708942728287718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1714479532588!5m2!1sen!2snp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Neware Khaja Ghar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
