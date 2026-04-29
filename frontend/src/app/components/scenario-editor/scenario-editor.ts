import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-scenario-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './scenario-editor.html',
  styleUrl: './scenario-editor.css'
})
export class ScenarioEditorComponent implements OnInit {
  private adminService = inject(AdminService);
  private notify = inject(NotificationService);
  public authService = inject(AuthService);
  private router = inject(Router);

  view = signal<'LIST' | 'CREATE_SCENARIO' | 'EDIT_QUESTIONS'>('LIST');
  loading = signal(false);
  
  escenarios = signal<any[]>([]);
  selectedScenarioId = signal<number | null>(null);

  // Form Scenario
  scenarioForm = {
    titulo: '',
    descripcionEmpresa: '',
    descripcionProducto: '',
    situacionMercado: ''
  };

  // Form Question
  questionForm = {
    enunciado: '',
    fase: 1,
    subFase: 'Análisis A',
    options: [
      { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false },
      { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false },
      { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false }
    ]
  };

  ngOnInit() {
    this.cargarEscenarios();
  }

  cargarEscenarios() {
    this.loading.set(true);
    this.adminService.listarEscenarios().subscribe({
      next: (data: any[]) => {
        this.escenarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar escenarios');
        this.loading.set(false);
      }
    });
  }

  showCreateScenario() {
    this.scenarioForm = { titulo: '', descripcionEmpresa: '', descripcionProducto: '', situacionMercado: '' };
    this.view.set('CREATE_SCENARIO');
  }

  saveScenario() {
    this.loading.set(true);
    this.adminService.crearEscenario(this.scenarioForm).subscribe({
      next: (res) => {
        this.selectedScenarioId.set(res.id);
        this.notify.success('Escenario creado correctamente.');
        this.view.set('EDIT_QUESTIONS');
        this.loading.set(false);
        this.cargarEscenarios();
      },
      error: () => {
        this.notify.error('Error al guardar escenario');
        this.loading.set(false);
      }
    });
  }

  editQuestions(id: number) {
    this.selectedScenarioId.set(id);
    this.view.set('EDIT_QUESTIONS');
    // En una implementación real cargaríamos las preguntas existentes aquí
  }

  addQuestion() {
    if (!this.selectedScenarioId()) return;

    this.loading.set(true);
    const questionData = {
      escenarioId: this.selectedScenarioId()!,
      fase: this.questionForm.fase,
      enunciado: this.questionForm.enunciado
    };

    this.adminService.agregarPregunta(questionData).subscribe({
      next: (resPregunta) => {
        // Guardar opciones una por una
        let saved = 0;
        this.questionForm.options.forEach(opt => {
          this.adminService.agregarOpcion({ preguntaId: resPregunta.id, ...opt }).subscribe({
            next: () => {
              saved++;
              if (saved === this.questionForm.options.length) {
                this.notify.success('Pregunta añadida con éxito');
                this.resetQuestionForm();
                this.loading.set(false);
              }
            }
          });
        });
      },
      error: () => {
        this.notify.error('Error al guardar pregunta');
        this.loading.set(false);
      }
    });
  }

  resetQuestionForm() {
    this.questionForm = {
      enunciado: '',
      fase: 1,
      subFase: 'Análisis A',
      options: [
        { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false },
        { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false },
        { textoOpcion: '', feedback: '', puntos: 0, esMejorOpcion: false }
      ]
    };
  }

  deleteScenario(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este escenario?')) {
      this.adminService.eliminarEscenario(id).subscribe({
        next: () => {
          this.notify.success('Escenario eliminado');
          this.cargarEscenarios();
        }
      });
    }
  }

  goBack() {
    if (this.view() === 'LIST') {
      this.router.navigate(['/dashboard']);
    } else {
      this.view.set('LIST');
    }
  }
}
