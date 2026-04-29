import { Injectable } from '@angular/core';

declare global {
  interface Window {
    watsonAssistantChatOptions: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WatsonService {
  private scriptLoaded = false;
  private chatInstance: any = null;

  loadChat() {
    if (this.scriptLoaded) {
      return;
    }

    window.watsonAssistantChatOptions = {
      integrationID: "17543ab7-a46e-4abe-8040-bf5481a7a2e7",
      region: "us-south",
      serviceInstanceID: "a8820602-852c-4c45-b3c5-ed726ed861dc",
      onLoad: async (instance: any) => { 
        this.chatInstance = instance;
        
        // Custom Watson Styling via JS configuration
        instance.updateCSSVariables({
          'BASE-font-family': '"Inter", sans-serif',
          '$focus': '#002855',
          '$hover-primary': '#001a38',
          '$interactive-01': '#002855', // Cibertec Blue
          '$interactive-02': '#0056b3',
          '$text-01': '#1e1e2d',
          '$inverse-01': '#ffffff'
        });

        // Add custom class to the wrapper for additional CSS targeting if needed
        const element = document.createElement('style');
        element.innerHTML = `
          #WACContainer.WACContainer .WACLauncher__Button {
            border-radius: 20px !important;
            box-shadow: 0 10px 25px rgba(0, 40, 85, 0.4) !important;
            transition: transform 0.3s ease !important;
          }
          #WACContainer.WACContainer .WACLauncher__Button:hover {
            transform: scale(1.1) !important;
          }
        `;
        document.head.appendChild(element);

        await instance.render(); 
      }
    };

    const t = document.createElement('script');
    t.id = "watson-chat-script";
    t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
    this.scriptLoaded = true;
  }

  destroyChat() {
    if (this.chatInstance) {
      try {
        this.chatInstance.destroy();
        this.chatInstance = null;
      } catch (e) {
        console.error('Error destroying Watson Chat', e);
      }
    }
    
    // Remove the script to allow a clean reload later
    const script = document.getElementById('watson-chat-script');
    if (script) {
      script.remove();
    }
    this.scriptLoaded = false;
  }
}
