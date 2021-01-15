import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskdescriptionPage } from './taskdescription.page';

describe('TaskdescriptionPage', () => {
  let component: TaskdescriptionPage;
  let fixture: ComponentFixture<TaskdescriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskdescriptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskdescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
