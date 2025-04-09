import { Component, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class ThemeToggleComponent {

    isDark: Signal<boolean> = this.themeService.isDark;

    constructor(private themeService: ThemeService) { }

    toggleTheme() {
        this.themeService.toggleTheme();
    }
}
