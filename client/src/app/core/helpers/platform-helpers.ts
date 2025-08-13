import { Platform } from "@ionic/angular/common"

export const skipLocationChange = (platform: Platform): boolean => platform.is('pwa') && (platform.is('ios') || platform.is('desktop'))
