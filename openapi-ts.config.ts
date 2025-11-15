import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  // The path to your generated swagger.json file
  input: '../trade/gen/openapiv2/trade-api/service/v1/service_dist_gen.swagger.json',
  
  // The path to output the generated client
  output: './src/api/generated',
  
  // Specify that we want to use the 'axios' client
  client: 'axios',
});