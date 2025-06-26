// src\api\server.ts

import app from "~/src/api/index";

const PORT = process.env.PORT;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;
