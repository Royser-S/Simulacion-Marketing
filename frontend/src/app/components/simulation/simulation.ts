import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation.html'
})
export class SimulationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  private simulationService = inject(SimulationService);
  private notify = inject(NotificationService);
  
  dateNow = new Date();
  
  simulacionId = signal<number | null>(null);
  preguntas = signal<any[]>([]);
  currentQuestionIndex = signal(0);
  feedbackActual = signal<any>(null);
  mostrarResultado = signal(false);
  resultado = signal<any>(null);
  cargandoRespuesta = signal<boolean>(false);
  puntajeAcumulado = signal(0);
  isReadOnly = signal(false);

  // --- NUEVA LÓGICA DE NAVEGACIÓN INVISIBLE ---
  currentBranch = signal<string | null>(null);
  completedBranches = signal<string[]>([]);
  findingActual = signal<string | null>(null);
  mostrarResultadosRama = signal<boolean>(false);
  
  viewMode = computed(() => {
    if (this.mostrarResultado()) return 'FINAL_RESULT';
    if (this.preguntas().length === 0) return 'LOADING';
    if (this.mostrarResultadosRama()) return 'RESULT_FINDING';
    return 'SIMULATION'; // Una única interfaz de formulario
  });

  // Determinar en qué fase y qué "Pregunta de Navegación" mostrar si no hay una rama activa
  navStatus = computed(() => {
    const list = this.preguntas();
    const done = this.completedBranches();
    
    // Fase 1: Análisis (Necesita 3)
    const analA = done.includes('Análisis A');
    const analB = done.includes('Análisis B');
    const analC = done.includes('Análisis C');
    const f1Done = analA && analB && analC;

    // Fase 2: Personas (Necesita 2)
    const perH = done.includes('Persona Hijo');
    const perP = done.includes('Persona Padre');
    const f2Done = perH && perP;

    // Fase 3: Ejes (Necesita 3)
    const eje1 = done.includes('Eje Precio/Calidad');
    const eje2 = done.includes('Eje Innovación');
    const eje3 = done.includes('Eje Prestigio');
    const f3Done = eje1 && eje2 && eje3;

    let phase = 1;
    let nextBranches: string[] = [];
    let navTitle = "¿Qué área de investigación deseas priorizar ahora?";
    
    if (!f1Done) {
      phase = 1;
      if (!analA) nextBranches.push('Análisis A');
      if (!analB) nextBranches.push('Análisis B');
      if (!analC) nextBranches.push('Análisis C');
    } else if (!f2Done) {
      phase = 2;
      navTitle = "¡Análisis completo! Selecciona ahora el perfil de Buyer Persona:";
      if (!perH) nextBranches.push('Persona Hijo');
      if (!perP) nextBranches.push('Persona Padre');
    } else if (!f3Done) {
      phase = 3;
      navTitle = "¡Perfiles definidos! Elige el eje de posicionamiento estratégico:";
      if (!eje1) nextBranches.push('Eje Precio/Calidad');
      if (!eje2) nextBranches.push('Eje Innovación');
      if (!eje3) nextBranches.push('Eje Prestigio');
    }

    return { 
      phase, 
      nextBranches, 
      navTitle, 
      allDone: f1Done && f2Done && f3Done 
    };
  });

  // La pregunta que se muestra (sea Navegación o Instrumento)
  displayState = computed(() => {
    const branch = this.currentBranch();
    if (branch) {
      // Estamos dentro de una rama -> Mostrar Instrumentos Reales
      const q = this.preguntas().find(p => p.subFase === branch && !this.isQuestionAnswered(p.id));
      return { isNav: false, question: q };
    } else {
      // Estamos en "El Mapa" -> Generar Pregunta de Navegación Sintética
      const nav = this.navStatus();
      if (nav.allDone) return { isNav: false, question: null }; // Ir al Final

      return {
        isNav: true,
        question: {
          enunciado: nav.navTitle,
          fase: nav.phase,
          opciones: nav.nextBranches.map((b, i) => ({ 
            id: -(i + 1), // ID negativo para navegación
            textoOpcion: b,
            tag: b // Aquí guardamos el nombre de la rama
          }))
        }
      };
    }
  });

  isQuestionAnswered(qId: number): boolean {
    return this.resultado()?.decisiones.some((d: any) => d.preguntaId === qId) || false;
  }

  ngOnInit() {
    const sId = Number(this.route.snapshot.paramMap.get('id'));
    this.simulacionId.set(sId);
    
    // 1. Obtener resultado primero para saber el escenario
    this.simulationService.obtenerResultado(sId).subscribe({
      next: (res) => {
        const escenarioId = res.escenarioId || 1;
        // 2. Cargar preguntas del escenario correcto
        this.simulationService.obtenerPreguntas(escenarioId, sId).subscribe({
          next: (preguntas) => {
            this.preguntas.set(preguntas);
            // 3. Solo después de tener las preguntas, procesamos el progreso
            this.processExistingProgress(res);
          }
        });
      },
      error: (err) => console.error('Error al recuperar estado', err)
    });
  }

  private processExistingProgress(res: any) {
    if (!res || !res.decisiones) return;
    
    this.resultado.set(res);
    this.puntajeAcumulado.set(res.puntajeTotal);
    
    // Ahora find() funcionará porque preguntas() ya tiene datos
    const branches = res.decisiones.map((d: any) => {
      const q = this.preguntas().find(p => p.id === d.preguntaId);
      return q?.subFase;
    }).filter((b: string | undefined) => !!b) as string[];
    
    this.completedBranches.set(branches);

    if (res.decisiones.length >= 8) {
      this.mostrarResultado.set(true);
      this.isReadOnly.set(true);
    }
    
    const user = this.authService.getCurrentUser();
    if (user && (user.rolNombre === 'DOCENTE' || user.rolNombre === 'ADMIN')) {
      this.isReadOnly.set(true);
    }
  }

  seleccionarRama(nombre: string) {
    if (this.isReadOnly()) return;
    this.currentBranch.set(nombre);
  }

  submitAnswer(opcionId: any) {
    if (this.isReadOnly() || this.cargandoRespuesta()) return;

    // Lógica para Navegación (ID negativo)
    if (typeof opcionId === 'object' && opcionId.id < 0) {
      this.seleccionarRama(opcionId.tag);
      return;
    }
    
    // Lógica para Pregunta Real
    this.cargandoRespuesta.set(true);
    const q = this.displayState().question;
    const request = {
      simulacionId: this.simulacionId(),
      preguntaId: q?.id,
      opcionId: opcionId
    };

    this.simulationService.enviarRespuesta(request).subscribe({
      next: (feedback) => {
        this.feedbackActual.set(feedback);
        this.puntajeAcumulado.update(p => p + feedback.puntosObtenidos);
        
        // Simular Hallazgos (o tomarlos de feedback si extendimos el backend)
        this.findingActual.set(feedback.hallazgos || 'Hallazgos clave identificados en este análisis.');
        
        this.cargandoRespuesta.set(false);
        const branch = this.currentBranch();
        if (branch) {
          this.completedBranches.update(prev => [...prev, branch]);
        }
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Error al enviar respuesta');
        this.cargandoRespuesta.set(false);
      }
    });
  }

  showFindings() {
    this.mostrarResultadosRama.set(true);
    this.feedbackActual.set(null);
  }

  nextPhase() {
    this.mostrarResultadosRama.set(false);
    this.currentBranch.set(null); 

    if (this.completedBranches().length >= 8) {
      this.finishSimulation();
    }
  }

  finishSimulation() {
    this.simulationService.obtenerResultado(this.simulacionId()!).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.mostrarResultado.set(true);
      }
    });
  }

  printReport() {
    window.print();
  }

  downloadCertificate() {
    const element = document.getElementById('certificate-card');
    if (!element) return;

    this.notify.info('Generando tu certificado de CiberMarketing Lab...');
    
    html2canvas(element, { 
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true 
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `CiberMarketing_Lab_Resultado_${this.simulacionId()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.notify.success('¡Imagen descargada con éxito!');
    });
  }
}
