import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { REGISTRATION_SERVICE } from "./common/constants";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: REGISTRATION_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: "127.0.0.1",
                    port: 8866,
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
