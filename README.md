# Console Codes

| Codes     | Meaning         |
| --------- | --------------- |
| **"[!]"** | Error           |
| **"[+]"** | Warning         |
| **"[*]"** | Information     |
| **"[#]"** | Process Started |

# API

Here, I will explain how the API works for safe usage. The API is well-designed because it is based on the Route File system (yes, I made up this term, why not :-) ). To explain this simply, when you create a directory in the `./api/` folder, it is transformed into an API route.

## How to create routes?

As I mentioned earlier, you need to create a directory in the `./api/` folder. At the end create the file `route.js`.

> \> **NOTE**: When you create routes, you can also create subfolders, and it will work as well (as long as there is a folder inside xD). You can access it here:
> **example:** `./src/api/your/subfolder/route.js` > `http://localhost:XXXX/api/your/subfolder`
> You need to create all routes in the `/api/` folder.

## How to use the API basically?

To start, you've created file(s)—good! Now, how do you add logic to the API route? Simple!

```javascript
// Import express and declare router
const express = require("express");
const router = express.Router();

// Define route with router
router.get("/", async (req, res) => {
    /* You're logic here */
});

module.exports = router;
```

> \> **NOTE**: The parameters **req** and **res** are necessary. "**req**" represents the request we send, and "**res**" is what we receive in response (just like any other JavaScript request 😄).
>
> \> Make sure to use "**/**" always. Otherwise, the route will be detected in the console but will be **unusable**.

## Create Protected Routes

If you want to protect a few routes, follow these steps:

1.  Import **middleware**
2.  Use **Express Router**
3.  Add the middleware
4.  **Export** the router

Here's the syntax:

```javascript
const { checkUserConnection } = require("./path/to/checkUserConnection");

// Past the middleware function (! without "()" !)
router.get("/", checkUserConnection, async (req, res) => {
    /* ... */
});

module.exports = router;
```

Afterwards, check out the **[official documentation](https://expressjs.com/fr/)** of the EXPRESS module for more details.

## IMPORTANT Information

The middleware is really well implemented.

-   For any request where you use the middleware, you need to pass an authorization header with the format: `"Bearer <YOUR SECRET TOKEN>"`. You won't be able to access the route if you don't have a valid token.
-   To get the token, it's simple: you just need to log in with your `username` and `password`, which you previously registered in the database.

# Configure Project

To start, you need a `.env` file at the root of your project clone. You need to add these values in your `.env` file:

```.env
TOKEN=<YOUR DISCORD BOT TOKEN>
PORT=<YOUR API LISTENING PORT>
DATABASE_URL="<YOUR DATABASE LINK>"
JWT_TIMING=<YOUR JWT TIMING, e.g., 1h>
```

Next, execute `npx prisma init` and copy paste the same `schema.prisma` structure as below:

```prisma
// This is your Prisma schema file.
// Learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// ----------------------------- Database Config ---------------------------- //

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ---------------------------- Database Content ---------------------------- //

enum Group {
  USER
  AUTHUSER
  NOTAUTHUSER
}

model APIUser {
  id          Int      @id @default(autoincrement())
  password    String
  email       String?
  discordTag  String   @unique
  username    String   @unique
  group       Group
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([email])
}

model AnonymousUserVisit {
  id                     Int @id @default(autoincrement())
  EcoleDirectePlusUserId Int @unique
}

```

> \> **NOTE**: After migrating with `npx prisma migrate dev` for create and init tables, remember to generate your Prisma client with `npx prisma generate`

Once you have all the files set up as above, you need to generate your private and public keys. Here's how to proceed:

1. Open a new Terminal window in your `.certs` folder.
2. Use your preferred tool (SSH-KeyGen or OpenSSL).
3. To generate keys, you can use either **OpenSSL** or **ssh-keygen**:

    ### With OpenSSL:

    - Generate the private key:  
      `openssl genrsa -out private.pem 4096`
    - Generate the public key from the private key:  
      `openssl rsa -in private.pem -pubout -out public.pem`
        > **Note**: Make sure to name them `private.pem` and `public.pem` and use the PEM format.

    ### With ssh-keygen:

    - Generate the private key:  
      `ssh-keygen -t rsa -b 4096 -m PEM -f private.pem`
    - Generate the public key:  
       `ssh-keygen -f private.pem -e -m PEM > public.pem`
        > **Note**: Make sure the keys are saved as `private.pem` and `public.pem`.

Now you are able to lunch API and log in
