import { DateTimePipe } from './datetime.pipe';

describe('DatetimePipe', () => {
    it('create an instance', () => {
        const pipe = new DateTimePipe();
        expect(pipe).toBeTruthy();
    });
});
