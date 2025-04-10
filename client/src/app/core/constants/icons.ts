import { addIcons } from 'ionicons';
import {
    warningOutline,
    alertCircleOutline,
    checkmarkCircleOutline,
    informationCircleOutline,
    closeOutline,
    close,
    closeCircle,
    checkmark,
    checkmarkOutline,
    checkmarkCircle,
    checkmarkDoneOutline,
    chevronUp,
    chevronDown,
    chevronForward,
    chevronForwardOutline,
    chevronUpOutline,
    chevronDownOutline,
    chevronBackOutline,
    arrowForwardOutline,
    ellipsisVerticalCircleOutline,
    ellipsisVertical,
    ellipsisHorizontalCircle,
    add,
    addOutline,
    addCircle,
    addCircleOutline,
    remove,
    trash,
    trashOutline,
    createOutline,
    refreshOutline,
    filterOutline,
    documentTextOutline,
    playOutline,
    playSkipForwardOutline,
    playSkipBackOutline,
    playSkipBackCircleOutline,
    playSkipForwardCircleOutline,
    personAddOutline,
    personOutline,
    personAdd,
    timerOutline,
    hourglassOutline,
    timeOutline,
    barbellOutline,
    reorderTwoOutline,
    sunnyOutline,
    moonOutline,
} from 'ionicons/icons';

export function registerIcons(): void {
    addIcons({
        // UI/Feedback icons
        warningOutline,
        alertCircleOutline,
        checkmarkCircleOutline,
        informationCircleOutline,
        closeOutline,
        close,
        closeCircle,
        checkmark,
        checkmarkOutline,
        checkmarkCircle,
        checkmarkDoneOutline,

        // Navigation icons
        chevronUp,
        chevronDown,
        chevronForward,
        chevronForwardOutline,
        chevronUpOutline,
        chevronDownOutline,
        chevronBackOutline,
        arrowForwardOutline,

        // Action icons
        ellipsisVerticalCircleOutline,
        ellipsisVertical,
        ellipsisHorizontalCircle,
        add,
        addOutline,
        addCircle,
        addCircleOutline,
        remove,
        trash,
        trashOutline,
        createOutline,
        refreshOutline,
        filterOutline,
        documentTextOutline,

        // Media control icons
        playOutline,
        playSkipForwardOutline,
        playSkipBackOutline,
        playSkipBackCircleOutline,
        playSkipForwardCircleOutline,

        // User icons
        personAddOutline,
        personOutline,
        personAdd,

        // Time/Clock icons
        timerOutline,
        hourglassOutline,
        timeOutline,

        // Fitness icons
        barbellOutline,

        // Layout icons
        reorderTwoOutline,

        // Theme icons
        sunnyOutline,
        moonOutline,
    });
}
