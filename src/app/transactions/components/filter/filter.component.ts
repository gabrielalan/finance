import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { GroupsService } from '../../../core/services/groups.service';
import { Group } from '../../../core/models/groups/group';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  @Output() onFilter = new EventEmitter();

  @Input() useDateRange: Boolean = false;

  groups: Array<any>;

  filterForm: FormGroup = new FormGroup({
    date: new FormControl(moment().format('YYYY-MM')),
    startDate: new FormControl(moment().subtract(1, 'month').format('YYYY-MM-DD')),
    finalDate: new FormControl(moment().format('YYYY-MM-DD')),
    group: new FormControl()
  });

  constructor(groupsService: GroupsService) {
    this.groups = groupsService.getGroups();
    this.groups.push({
      name: 'Others'
    });
  }

  onSubmit($event) {
    $event.preventDefault();

    this.onFilter.emit(this.filterForm.getRawValue());
  }

}
