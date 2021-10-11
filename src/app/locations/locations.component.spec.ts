import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from './../services/local-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LocationsComponent } from './locations.component';
import { SoundService } from '../services/sound.service';

const localStorageService = {
  getLocations: jest.fn(),
  setLocations: jest.fn()
};

const soundService = {
  dropPop: jest.fn(),
  doAYeet: jest.fn()
};

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationsComponent ],
      imports: [
        BrowserAnimationsModule, 
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule
       ],
        providers: [
          {provide: SoundService, useValue: soundService},
          {provide: LocalStorageService, useValue: localStorageService}
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
