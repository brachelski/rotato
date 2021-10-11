import { SoundService } from './../services/sound.service';
import { LocalStorageService } from './../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { RefreshService } from '../services/refresh.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  addOnBlur = true;
  removable = true;
  selectable = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  locations: string[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private soundService: SoundService,
    private refreshService: RefreshService) {
  }

  ngOnInit(): void {
    this.locations = this.localStorageService.getLocations();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.locations.push(value);
      this.soundService.dropPop();
      this.localStorageService.setLocations(this.locations);
      this.refreshService.triggerRefresh();
    }

    event.chipInput!.clear();
  }

  remove(location: string): void {
    const index = this.locations.indexOf(location);

    if (index >= 0) {
      this.locations.splice(index, 1);
      this.localStorageService.setLocations(this.locations);
      this.refreshService.triggerRefresh();
      this.soundService.doAYeet();
    }
  }

}
