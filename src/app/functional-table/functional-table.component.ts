import { Component, OnInit } from '@angular/core';
import { UserDto } from '../Models/user.dto';
import { UsersService } from '../Services/users.service';
import { SortingInterface } from '../Helpers/sort.interface';
import { of, switchMap } from 'rxjs';


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

  constructor(private usersService: UsersService) {}

  onSearchTermChange() {  
    this.usersService.getUsers().pipe(
      switchMap((users) => {
        this.users = users;
        return of(users.filter((user) => Object.values(user).some((value) => String(value).toLowerCase().includes(this.searchValue.toLowerCase()))));
      })
    ).subscribe((filteredUsers) => {
      this.users = filteredUsers;
      this.page = 1;
    });
  }

  changePage(page: number): void {
    this.page = page;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
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
}
