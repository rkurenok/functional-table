import { Component, OnInit } from '@angular/core';
import { UserDto } from '../Models/user.dto';
import { UsersService } from '../Services/users.service';
import { SortingInterface } from '../Helpers/sort.interface';
import { of, switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-functional-table',
  templateUrl: './functional-table.component.html',
  styleUrls: ['./functional-table.component.scss']
})
export class FunctionalTableComponent implements OnInit {
  users: UserDto[] = [];
  filteredData = this.users;
  columns: string[] = ["_id", "isActive", "balance", "picture", "age", "name", "company", "email", "address", "tags", "favoriteFruit"];
  sorting: SortingInterface = {
    column: null,
    order: 'asc',
  };
  searchValue: string = '';
  itemsPerPage: number = 5;
  page: number = 1;
  showFilter: boolean = false;
  columnsToShow: boolean[] = new Array(this.columns.length).fill(true);

  constructor(private usersService: UsersService, private spinner: NgxSpinnerService) { }

  onSearchTermChange() {
    this.spinner.show();
    this.usersService.getUsers().pipe(
      switchMap((users) => {
        this.users = users;
        return of(users.filter((user) => Object.values(user).some((value) => String(value).toLowerCase().includes(this.searchValue.toLowerCase()))));
      })
    ).subscribe((filteredUsers) => {
      this.users = filteredUsers;
      this.page = 1;
      this.spinner.hide();
    });
  }

  changePage(page: number): void {
    this.page = page;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.spinner.show();
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      this.spinner.hide();
    });
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  sortTable(column: string): void {
    const futureSortingOrder = this.isDescSorting(column) ? 'asc' : 'desc';
    this.sorting = {
      column,
      order: futureSortingOrder,
    };

    this.users = this.users.sort((a, b) => {
      const valueA = this.sorting.column ? a[this.sorting.column] : 0;
      const valueB = this.sorting.column ? b[this.sorting.column] : 0;

      if (this.sorting.order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleColumn(column: number) {
    this.columnsToShow[column] = !this.columnsToShow[column];
  }

  formatName(value: any): string {
    let result = '';

    if (value instanceof Array)
      result = value.join(', ');
    else if (typeof value === 'object')
      result = value?.first + " " + value?.last
    else
      result = value

    return result;
  }
}
