import { Injectable } from "@angular/core";
import usersData from "../Data/users.data";
import { UserDto } from "../Models/user.dto";
import { Observable, delay, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UsersService {

    // constructor(private httpClient: HttpClient) { }

    getUsers(): Observable<UserDto[]> {
        const delayMs = Math.floor(Math.random() * (1500 - 500 + 1) + 500);

        return of(usersData as UserDto[]).pipe(
            delay(delayMs),
        );
        // return this.httpClient.get<UserDto[]>("/src/app/Data/users.data.ts");
    }
}