sử dụng câu lệnh openapi đến auto gen api từ swagger backend
npx swagger-cli bundle http://localhost:5000/swagger.json -o fixed.json
npx openapi-typescript-codegen --input ./fixed.json --output ./src/api/generated --client axios

hoặc chạy npm run gen:api

hoặc chạy npx openapi-typescript-codegen --input http://localhost:5000/swagger.json --output ./src/api/generated --client axios