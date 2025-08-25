import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@capacitor/keyboard';
import { IonFooter, IonList, IonInput, IonIcon, IonItem, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton, IonButton } from "@ionic/angular/standalone";
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { DateTimePipe } from "../core/pipes/datetime.pipe";
import { alertOutline, chevronForward, readerOutline, sendOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { MESSAGEROLE } from '../core/models/enums/message-role';
import { PB } from '../core/constants/pb-constants';
import { marked } from 'marked';
import { ProgramService } from '../core/services/program.service';
import { FormsService } from '../core/services/forms.service';
import { AutosaveService } from '../core/services/autosave.service';
import { WeightType } from '../core/models/enums/weight-type';
import { ReserveType } from '../core/models/enums/reserve-type';
import { RepType } from '../core/models/enums/rep-type';

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
    transform(value: string): string {
        return marked(value || '') as string;
    }
}

@Component({
    selector: 'app-conversation',
    templateUrl: 'conversation.page.html',
    styleUrls: ['./conversation.page.scss'],
    standalone: true,
    providers: [FormsService, AutosaveService],
    imports: [IonBackButton, FormsModule, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonItem, IonIcon, IonInput, IonList, IonFooter, TranslateModule, DateTimePipe, IonButton, MarkdownPipe],
})
export class ConversationPage implements OnInit {
    showToolbar = false;
    isAIConversation = false;
    aiTrainer: AITrainer;
    aiTrainers = AITrainer;
    user;
    messages = []
    conversationId;
    sendIcon = sendOutline;
    newMessage = '';
    readerIcon = readerOutline;
    chevronIcon = chevronForward;
    alertOutline = alertOutline;
    isTyping = false;

    @ViewChild(IonContent) content!: IonContent;

    constructor(private route: Router, private translate: TranslateService, private autosave: AutosaveService, private programService: ProgramService, private programFormService: FormsService, private pb: PocketbaseService, private activatedRoute: ActivatedRoute, private accountService: AccountService) {
        this.activatedRoute.data.subscribe((data: any) => {
            if (data.aiConversation) {
                this.isAIConversation = true;
            }
        })
        this.activatedRoute.params.subscribe((param: any) => {
            if (param.id) this.conversationId = param.id;
            this.getMessagesByConversationId(this.conversationId);
        });

    }

    async ngOnInit() {
        this.user = await this.accountService.getCurrentUser();
        if (this.user && this.user.aiTrainer) {
            this.aiTrainer = this.user.aiTrainer;
        }
    }

    async getMessagesByConversationId(conversationId: string) {
        const messages = await this.pb.messages.getFullList({
            filter: `conversation = '${conversationId}'`,
            sort: 'created'
        });

        this.messages = [...messages].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        this.scrollToBottom(false);

        await this.pb.pb.realtime.subscribe(conversationId, (e) => {
            this.messages.push(e);
            this.scrollToBottom();
            this.isTyping = false;
        })
    }

    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    async sendMessage() {
        const message = {
            conversation: this.conversationId,
            message: this.newMessage,
            from: this.user.id,
            to: null,
            created: new Date(),
            role: MESSAGEROLE.User,
        };

        this.messages.push(message);
        this.isTyping = true;
        this.newMessage = '';
        this.scrollToBottom();
        const msg = await this.pb.messages.create(message,
            { headers: PB.HEADER.NO_TOAST });

    }

    async createPlanFromMessage(plan) {

        this.scrollToBottom();
        this.isTyping = true;
        if (typeof plan == "string")
            plan = JSON.parse(plan);

        const p = await this.mapToProgram(plan);

        const pr: any = this.programFormService.createProgramFormGroup(p as any)

        const pgroup = pr.getRawValue();
        pgroup.aiProgram = true;

        this.autosave.save("programs", pgroup);

        setTimeout(() => {
            const message = {
                conversation: this.conversationId,
                message: this.translate.instant("Your program is ready! Check it in workouts tab."),
                to: this.user.id,
                from: null,
                created: new Date(),
                role: MESSAGEROLE.Assistant,
                url: './tabs/home'
            };
            this.newMessage = '';
            const msg = this.pb.messages.create(message,
                { headers: PB.HEADER.NO_TOAST });
            this.messages.push(message);
            this.scrollToBottom();
            this.isTyping = false;
        }, 500)
    }

    async navigate(url) {
        this.route.navigate([url])
    }

    async mapToProgram(input: any) {

        const exercise_templates = await this.pb.exercise_templates.getFullList();

        const baseDays: any[] = input.days.map((day, dayIndex) => ({
            id: ``,
            exercises: day.exercises.map((ex, exIndex) => {

                let template: any = exercise_templates.find(ee => ee.name == ex.name);

                const sets = ex.sets.map((set, setIndex) => ({
                    id: ``,
                    index: setIndex + 1,
                    type: RepType.Reps,
                    weightType: this.user.weightType == WeightType.LB ? WeightType.LB : WeightType.KG,
                    weight: set.weight == 0 ? 20 : set.weight,
                    value: set.reps == 0 ? 12 : set.reps,
                    rir: set.rir,
                    rpe: set.rpe,
                }));

                if (template) {
                    template.id = ``,
                    template.sets = sets;
                    template.restDuration = ex.restDuration;
                } else {
                    template = {
                        id: ``,
                        name: ex.name,
                        restDuration: ex.restDuration,
                        superset: "",
                        sets: sets,
                    }
                }

                return template;
            }),
            workout: {
                id: ``,
                name: `Workout ${dayIndex + 1}`,
                description: "",
            },
        }));

        const numberOfWeeks = Number(input.numberOfWeeks);

        const weeks = Array.from({ length: numberOfWeeks }, (_, w) => {
            const weekNum = w + 1;
            // clone baseDays and rewrite ids to include the week number
            const days: any = baseDays.map((d, di) => ({
                ...d,
                exercises: d.exercises.map((e, ei) => ({
                    ...e,
                    sets: (e.sets ?? []).map((s, si) => ({
                        ...s,
                    })),
                })),
                workout: {
                    ...d.workout,
                    name: `Workout ${di + 1} (Week ${weekNum})`,
                },
            }));

            return { id: ``, days };
        });

        const program = {
            id: "",
            name: input.name,
            description: input.description,
            numberOfWeeks,
            weeks,
        };

        return program;
    }

    trainerProfile() {
        if (this.isAIConversation) {
            this.route.navigate(['./trainer-profile/ai/' + this.aiTrainer]);
        } else {
            this.route.navigate(['./trainer-profile']);
        }
    }

    async ngOnDestroy() {
        if (this.conversationId)
            await this.pb.pb.realtime?.unsubscribe(this.conversationId);
    }

    scrollToBottom(smooth: boolean = true) {
        setTimeout(() => this.content.scrollToBottom(smooth ? 300 : 0), 100);
    }
}
