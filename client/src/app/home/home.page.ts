import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, lastValueFrom } from 'rxjs';
import { AssignModalComponent } from '../assign-program-modal/assign-modal.component';
import { Exercise } from '../core/models/exercise';
import { Program } from '../core/models/program';
import { User } from '../core/models/user';
import { Template } from '../core/models/Template';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
        ReactiveFormsModule
    ],
})
export class HomePage implements OnInit {
    tab: string = "programs";

    searchControl: FormControl = new FormControl('');
    searching: boolean = false;

    // TODO: fetch
    exercises: Exercise[] = [
        { id: '1', name: 'Push-Up', tags: ['Upper Body', 'Bodyweight'], notes: 'Great for chest and triceps', restDuration: 60 },
        { id: '2', name: 'Squat', tags: ['Lower Body', 'Bodyweight'], notes: 'Targets legs and glutes', restDuration: 90 },
        { id: '3', name: 'Plank', tags: ['Core'], notes: 'Strengthens core muscles', restDuration: 30 },
    ];
    // Map tags from exercises
    programs = [
        { id: '1', duration: 1, name: 'Full body', description: 'Full Body Blast', tags: ['HIIT', 'Strength'] },
        { id: '2', duration: 2, name: 'Stretch', tags: ['Lower Body', 'Bodyweight'] },
        { id: '3', duration: 4, name: 'Core', tags: ['Core'] },
    ];

    // TODO: fetch
    templates: Template[] = [
        {
            id: '1',
            name: 'Full body',
            exercises: [
                { id: '1', name: 'Push-Up', tags: ['Upper Body'], notes: '', restDuration: 60 },
                { id: '2', name: 'Squat', tags: ['Lower Body'], notes: '', restDuration: 90 },
            ],
        },
        {
            id: '2',
            name: null,
            exercises: [
                { id: '3', name: 'Plank', tags: ['Core'], notes: '', restDuration: 30 },
            ],
        },
    ];

    constructor(
        private modalCtrl: ModalController,
        private route: Router,
        private navCtrl: NavController,
        private translateService: TranslateService,
        private actionSheetCtrl: ActionSheetController
    ) { }

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(700),
                distinctUntilChanged()
            )
            .subscribe(search => {
                this.searching = false;
                this.filterItems(search);
            });
    }

    onSearchInput() {
        this.searching = true;
    }

    filterItems(searchTerm: string) {
        // Implement your filtering logic here
        // This will depend on your data structure
    }

    openNewProgram() {
        this.navCtrl.navigateForward(['./program']);
    }

    openNewTemplate() {
        this.navCtrl.navigateForward(['./template']);
    }

    openDetailProgram(id: string): void {
        this.navCtrl.navigateForward(`./program/${id}`);
    }

    async presentProgramActionSheet(program: Program) {
        const programId = program.id;

        const translations = await lastValueFrom(this.translateService.get([
            'start', 'edit', 'close', 'delete', 'assign'
        ]));
        const actionSheet = await this.actionSheetCtrl.create({
            header: program.name,
            buttons: [
                {
                    text: translations.start,
                    icon: 'play-outline',
                    handler: () => {
                        this.startWorkout(programId);
                    },
                },
                {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                        this.editTemplate(programId);
                    },
                },
                {
                    text: translations.assign,
                    icon: 'person-add-outline',
                    handler: () => {
                        this.presentAssignProgramPopover(program);
                    },
                },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        this.deleteProgram(programId);
                    },
                },
                {
                    text: translations.close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ],
        });

        await actionSheet.present();
    }

    async presentTemplateActionSheet(template: Template) {
        const templateId = template.id;

        const translations = await lastValueFrom(this.translateService.get([
            'start', 'edit', 'close', 'delete', 'template', 'assign'
        ]));
        const actionSheet = await this.actionSheetCtrl.create({
            header: template.name ?? translations.template,
            buttons: [
                {
                    text: translations.start,
                    icon: 'play-outline',
                    handler: () => {
                        this.startWorkout(templateId);
                    },
                },
                {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                        this.editTemplate(templateId);
                    },
                },
                {
                    text: translations.assign,
                    icon: 'person-add-outline',
                    handler: () => {
                        this.presentAssignTemplatePopover(template);
                    },
                },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        this.deleteTemplate(templateId);
                    },
                },
                {
                    text: translations.close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ],
        });

        await actionSheet.present();
    }

    startWorkout(templateId: string) {
        console.log('Starting workout for template:', templateId);
        // TODO: Implement navigation to workout page or start workout logic
    }

    editTemplate(templateId: string) {
        // TODO
        console.log('Editing template:', templateId);
        this.navCtrl.navigateForward(`./template/${templateId}`);
    }

    presentAssignTemplatePopover(template: Template): void {
        const assign = (users) => {
            console.log('Users assigned:', users);
        }
        this.presentAssignPopover(template.name, assign);
    }

    deleteProgram(id: string): void {
        this.programs = this.programs.filter(exercise => exercise.id !== id);
        // TODO
        console.log('Deleted exercise with ID:', id);
    }

    deleteTemplate(id: string): void {
        this.templates = this.templates.filter(template => template.id !== id);
        // TODO
        console.log('Deleted template:', id);
    }

    async presentAssignProgramPopover(program: Program) {
        const assign = (users) => {
            console.log('Users assigned:', users);
        }
        this.presentAssignPopover(program.name, assign);
    }

    async presentAssignPopover(title: string, func: (users: User) => void) {
        const modal = await this.modalCtrl.create({
            component: AssignModalComponent,
            componentProps: {
                title: title,
                onAssign: (users) => {
                    // TODO
                    func(users)
                }
            }
        });

        await modal.present();
    }
}
