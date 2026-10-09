import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule} from './app.module.js';
import { TransformInterceptor } from './common/core/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //instrument: ObserveInstrument,
  });

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableCors({ origin: true, credentials: true });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
