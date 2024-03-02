import { Injectable } from "@angular/core";
import usersData from "../Data/users.data";
import { UserDto } from "../Models/user.dto";
import { Observable, delay, of } from "rxjs";

@Injectable()
export class UsersService {

    constructor() { }

    getUsers(): Observable<UserDto[]> {
        const delayMs = Math.floor(Math.random() * (1500 - 500 + 1) + 500);

        return of(usersData as UserDto[]).pipe(
            delay(delayMs),
        );
    }
}