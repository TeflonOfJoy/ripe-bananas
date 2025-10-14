# Banana Bread - Project Structure

```
banana_bread/
├── .env
├── package.json
├── package-lock.json
├── structure.md
├── scripts/
│   ├── generate-aggregate.js
│   └── generate-openapi.js
└── src/
    ├── app.js
    ├── config/
    │   ├── database.js
    │   └── swagger.js
    ├── controllers/
    │   ├── chat.controller.js
    │   └── review.controller.js
    ├── middleware/
    │   ├── errorHandler.js
    │   └── validation.js
    ├── models/
    │   ├── chatMessage.model.js
    │   ├── index.js
    │   ├── review.model.js
    │   └── reviewAggregate.model.js
    └── routes/
        ├── chat.route.js
        └── review.route.js
```
