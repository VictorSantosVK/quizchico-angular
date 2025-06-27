import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderQuiz } from './responder-quiz';

describe('ResponderQuiz', () => {
  let component: ResponderQuiz;
  let fixture: ComponentFixture<ResponderQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponderQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
