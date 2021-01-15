import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitingPage } from './inviting.page';

describe('InvitingPage', () => {
  let component: InvitingPage;
  let fixture: ComponentFixture<InvitingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
