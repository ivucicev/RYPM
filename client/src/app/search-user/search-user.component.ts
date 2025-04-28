import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-search-user',
    templateUrl: './search-user.component.html',
    styleUrls: ['./search-user.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, TranslateModule]
})
export class SearchUserComponent {

    searchTerm = '';

    // TODO: Trainer
    results = [
        { id: '1', name: 'Amenda Johnson', avatar: 'assets/images/gym_trainer_1.png', type: 'trainer' },
        { id: '2', name: 'Russeil Taylor', avatar: 'assets/images/gym_trainer_2.png', type: 'trainer' },
        { id: '3', name: 'Samantha Doe', avatar: 'assets/images/user_1.png', type: 'user' },
        { id: '4', name: 'John Smith', avatar: 'assets/images/user_2.png', type: 'user' },
    ];

    filteredResults = [...this.results];

    constructor(private navCtrl: NavController) { }

    filterResults() {
        const term = this.searchTerm.toLowerCase();
        this.filteredResults = this.results.filter(result =>
            result.name.toLowerCase().includes(term)
        );
    }

    selectResult(result) {
        // TODO: Trainer
    }

    close() {
        this.navCtrl.navigateForward(['/chats']);
    }

}
