import {faker} from '@faker-js/faker';
import {User} from "./user/user.entity";
import * as fs from "fs"; // Für das Hashen der Passwörter

export function createDemoUsers(count: number): User[] {
    const users: User[] = [];

    const admin: User = {
        id: 1,
        username: 'admin',
        password:'admin',
        isAdmin: true,
        elo: 1000,
        image_name: "default.png",
    }

    users.push(admin)


    for (let i = 0; i < count; i++) {
        const username = faker.internet.userName();
        const password = faker.internet.password();


        const user: User = {
            id: i + 2,
            username: username,
            password: password,
            isAdmin: false,
            elo: 1000,
            image_name: "default.png",

        };

        users.push(user);
    }
    fs.writeFileSync('demoUsers.txt', users.map(user => `${user.username} ${user.password}`).join('\n'));

    return users;
}
