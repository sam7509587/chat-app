const { database } = require('./src/config/db');
const { port, env } = require('./src/config');
const { app } = require('./src/app');

async function bootstrap() {
  try {
    await database.authenticate().then(() => {
      console.log(`Database connected 🔥 on ${env} mode...`);

      app.listen(port, () => {
        console.log(`Server running 🚀 on port:${port} in ${env} mode..`);
        console.log(`link to connect - http:127.0.0.1:${port}/api/v2`);
      });
    });
  } catch (error) {
    console.log(`Database not connected: ${error?.message}`);
    process.exit(1);
  }
}

bootstrap();
