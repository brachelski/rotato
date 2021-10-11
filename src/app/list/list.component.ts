import { DevLocation } from './../utillity/dev-location';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BACK_BURNER_MESSAGE, DEV_TYPE, BOARD_TYPE, DELETE_BUTTON_TEXT} from '../utillity/constants';
import {LocalStorageService} from '../services/local-storage.service';
import {SoundService} from '../services/sound.service';
import {ThemeService} from '../services/theme.service';
import {found, notFound} from '../utillity/lulz';
import {ListType} from '../utillity/list-type';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DevService } from '../services/dev.service';
import { BoardService } from '../services/board.service';
import { RefreshService } from '../services/refresh.service';
import { DEV_KEY } from '../utillity/constants';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input()
  isMobile = false;
  @Input()
  type: ListType;

  list: string[];
  disabledList: string[];
  locations: string[];
  devLocations: DevLocation[];

  deleteText = DELETE_BUTTON_TEXT;
  backBurnerMessage = BACK_BURNER_MESSAGE;

  constructor(
    private localStorageService: LocalStorageService,
    private soundService: SoundService,
    private themeService: ThemeService,
    private dialog: MatDialog,
    private devService: DevService,
    private boardService: BoardService,
    private refreshService: RefreshService
  ) {
  }

  ngOnInit(): void {
    this.refreshService.onRefresh().pipe(
      tap(() => this.loadData())
    ).subscribe();
    this.loadData();
  }

  handleAdd(item: string): void {
    if (item !== '') {
      this.localStorageService.add(this.type.listKey, item);
      this.soundService.dropPop();
    }
    this.list = this.localStorageService.get(this.type.listKey);
    this.refreshService.triggerRefresh();
  }

  handleDelete(i: number, item: string): void {
    switch (this.type) {
    case DEV_TYPE:
      this.devService.delete(item);
      break;
    case BOARD_TYPE:
      this.boardService.delete(item);
      break;
    }

    this.loadData();
    this.refreshService.triggerRefresh();
    this.soundService.doAYeet();
  }

  handleDisable(i: number, item: string): void {
    const index = this.disabledList.findIndex(name => name === item);
    if (notFound(index)) {
      this.disabledList.push(item);
    } else {
      this.disabledList.splice(index, 1);
    }
    this.localStorageService.set(this.type.disabledKey, this.disabledList);
    this.refreshService.triggerRefresh();
  }

  handleEdit(i: number, item: string): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {type: this.type, name: item}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      switch (this.type) {
      case DEV_TYPE:
        this.devService.update(item, result);
        break;
      case BOARD_TYPE:
        this.boardService.update(item, result);
        break;
      }

      this.loadData();
      this.refreshService.triggerRefresh();
    });
  }

  isDisabled(item: string): string {
    return this.disabledList.find(name => name === item);
  }

  getCurrentClass(item: string): string {
    return this.isDisabled(item) ? this.themeService.getSelected() : this.themeService.getListItem();
  }

  getInputColor(): string {
    return this.themeService.getInputColor();
  }

  isStrikeThrough(dev: string): string {
    return this.isDisabled(dev) ? 'strike-through' : '';
  }

  showAddBoard(item: string) {
    return this.type === BOARD_TYPE;
  }

  handleAddBoard(i: number, item: string) {
    const pairs = this.localStorageService.getPairs();
    if( notFound(pairs.findIndex(pair => pair.board === item))){
      pairs.push({board:item, devs:[]});
      this.localStorageService.setPairs(pairs);
    }
    const index = this.disabledList.findIndex(name => name === item);
    this.disabledList.splice(index, 1);
    this.localStorageService.set(this.type.disabledKey, this.disabledList);
    this.loadData();
    this.refreshService.triggerRefresh();
  }
  
  // TODO: Need to update locations here as they are added and removed.
  // Only show remove location if location is present
  // rotate by office feature

  // Merge all changes into fork repo

  setLocationForDev(dev: string, location: string) {
    if (this.devLocations.filter(dl => dl.dev === dev).length > 0) {
      console.log('EXISTING: ', dev);
      const updatedDevLocations = this.devLocations.filter(dl => dl.dev !== dev);
      this.devLocations = updatedDevLocations;
      this.localStorageService.setDevLocations(updatedDevLocations);
    }
    this.devLocations.push({dev, location});
    this.localStorageService.setDevLocations(this.devLocations);
    this.soundService.dropPop();
    this.refreshService.triggerRefresh();
  }

  removeDevLocation(dev: string) {
    const updatedDevLocations = this.devLocations.filter(dl => dl.dev !== dev);
    this.devLocations = updatedDevLocations;
    this.localStorageService.setDevLocations(updatedDevLocations);
    this.soundService.doAYeet();
    this.refreshService.triggerRefresh();
  }

  handleLocationLetterForDev(dev: string): string {
    const devMaybe = this.devLocations.filter(devs => devs.dev === dev)[0];

    return devMaybe ? devMaybe.location.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'').toUpperCase() : '?';
  }

  shouldShowRemoveLocation(dev: string): boolean {
    return this.devLocations?.filter(dl => dl.dev === dev).length > 0 ? true : false;
  }

  private loadData(): void {
    this.list = this.localStorageService.get(this.type.listKey);
    this.disabledList = this.localStorageService.get(this.type.disabledKey);
    if (this.type.listKey === DEV_KEY) {
      this.devLocations = this.localStorageService.getDevLocations();
      this.locations = this.localStorageService.getLocations();;
    }
  }
}
