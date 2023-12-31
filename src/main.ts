import { TransformInterceptor } from "./interceptors/response-handling.interceptor";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./interceptors/handling";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true});
  
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ limit: "50mb", extended: true }));
    app.enableCors();
  
    const config = new DocumentBuilder()
        .setTitle("Auth Apis")
        .setDescription("The Auth API description")
        .setVersion("1.0")
        .addTag("Auth")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
  
    await app.listen(4000);
}
bootstrap();
