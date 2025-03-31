import { Constants } from "../constants/constants";

export class ThemeHelper {
    static seThemeMode(status: string) {
        window.localStorage.setItem(Constants.KEY_DARK_MODE, status);
    }
    static getThemeMode(defaultTheme: string) {
        let toReturn = window.localStorage.getItem(Constants.KEY_DARK_MODE);
        if (!toReturn) toReturn = defaultTheme;
        return toReturn;
    }
}
