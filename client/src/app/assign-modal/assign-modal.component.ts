import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, IonHeader, IonLabel, IonItem, IonContent, IonButton, IonToolbar, IonAvatar, IonList, IonItemOption, IonTitle, IonItemSliding, IonText, IonItemOptions, IonButtons, IonNote, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-assign-modal',
    templateUrl: 'assign-modal.component.html',
    styleUrls: ['assign-modal.component.scss'],
    standalone: true,
    imports: [IonIcon, IonNote, IonButtons, IonItemOptions, IonText, IonItemSliding, IonTitle, IonItemOption, IonList, IonAvatar, IonToolbar, IonButton, IonContent, IonItem, IonLabel, IonHeader, FormsModule, TranslateModule]
})
export class AssignModalComponent implements OnInit {

    @Input() title: string;
    @Input() programId: string;
    @Input() onAssign: (users: any[]) => void;

    users = [];
    filteredUsers = [];
    searchTerm = '';

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        // TODO: load
        this.users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                selected: false
            },
        ];
        this.filteredUsers = [...this.users];
    }

    filterUsers() {
        // TODO
        const term = this.searchTerm.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
    }

    public navigateToUserProfile(user) {
        //TODO
    }

    assignToSelected() {
        const selectedUsers = this.users.filter(user => user.selected);
        if (this.onAssign) {
            this.onAssign(selectedUsers);
        }
        this.dismiss();
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
