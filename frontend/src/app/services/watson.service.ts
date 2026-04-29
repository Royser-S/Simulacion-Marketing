import { Injectable, inject } from '@angular/core';
import { SimulationService } from './simulation.service';

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

  constructor() { }

  loadChat() {
    if (this.scriptLoaded) return;
    this.scriptLoaded = true;

    window.watsonAssistantChatOptions = {
      integrationID: "17543ab7-a46e-4abe-8040-bf5481a7a2e7",
      region: "us-south",
      serviceInstanceID: "a8820602-852c-4c45-b3c5-ed726ed861dc",
      onLoad: (instance: any) => { 
        this.chatInstance = instance;
        instance.render();
      }
    };

    const t = document.createElement('script');
    t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  }

  destroyChat() {
    if (this.chatInstance) {
      this.chatInstance.destroy();
      this.chatInstance = null;
    }
    this.scriptLoaded = false;
  }
}
