import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewaccountPage } from './newaccount.page';

describe('NewaccountPage', () => {
  let component: NewaccountPage;
  let fixture: ComponentFixture<NewaccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewaccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewaccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
