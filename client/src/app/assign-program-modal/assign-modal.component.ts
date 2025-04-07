import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-assign-modal',
    templateUrl: './assign-modal.component.html',
    styleUrls: ['./assign-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, TranslateModule]
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
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
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
