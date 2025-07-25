import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConversationPage } from './conversation.page';

describe('ConversationPage', () => {
  let component: ConversationPage;
  let fixture: ComponentFixture<ConversationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ConversationPage]
}).compileComponents();

    fixture = TestBed.createComponent(ConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
