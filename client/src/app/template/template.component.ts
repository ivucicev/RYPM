import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { ExerciseFormGroup, FormsService } from '../core/services/forms.service';
import { FormType } from '../core/helpers/form-helpers';
import { TemplateBM } from '../core/models/bm/template-bm';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AutosaveService } from '../core/services/autosave.service';
import { Template } from '../core/models/collections/template';
import { TemplateActionKey, TemplateService } from '../core/services/template.service';

@Component({
    selector: 'app-template',
    templateUrl: 'template.component.html',
    styleUrls: ['./template.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        ExerciseFormComponent
    ],
    providers: [FormsService, AutosaveService]
})
export class TemplateComponent implements OnInit, OnDestroy {

    private unsubscribeAll = new Subject<void>();

    template: Template;
    templateForm: FormGroup<FormType<TemplateBM>> = this.programFormService.createTemplateFormGroup();

    RepType = RepType;
    WeightType = WeightType;
    durationOptions = Array.from({ length: 60 }, (_, i) => ({ value: (i + 1) * 5 }));

    constructor(
        private programFormService: FormsService,
        private pocketbaseService: PocketbaseService,
        private activatedRoute: ActivatedRoute,
        private autosaveService: AutosaveService,
        private templateService: TemplateService,
        private navCtrl: NavController
    ) {
    }

    ok() {
        this.navCtrl.navigateBack(['./tabs']);
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(params => {
                const id = params['id'];
                this.refresh(id);
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    init(template?: Template) {
        this.template = template;
        this.templateForm = this.programFormService.createTemplateFormGroup(template);
        this.autosaveService.register<TemplateBM>(this.templateForm, 'templates', false)
            .subscribe();
    }

    async refresh(id: string) {
        if (!id) {
            this.init();
            return;
        }

        this.pocketbaseService.templates.getOne(id).then((res) => {
            this.init(res);
        });
    }

    get exercisesArray() {
        return this.templateForm.get('exercises') as FormArray<ExerciseFormGroup>;
    }

    async addExercises() {
        const exercises = await this.programFormService.getExerciseTemplates();
        if (!exercises || !exercises.length) return;

        exercises.map(e => {
            const fg = this.programFormService.createExerciseFormGroup(e);
            this.exercisesArray.push(fg);
        })
    }

    async openSettings() {
        const excludeActions: TemplateActionKey = {
            edit: true
        };
        const actionSheet = await this.templateService.presentTemplateActionSheet(this.template, excludeActions);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.destructive || e.data?.constructive) {
                this.navCtrl.navigateBack(['./tabs']);
            }
        })
    }

    removeExercise(index: number) {
        this.exercisesArray.removeAt(index);
    }
}
