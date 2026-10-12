import app from './app';
import { ENV } from './config/env';

app.listen(ENV.PORT, () => {
  console.log(`🚀 AdaptLearn AI Backend running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
});
