# Tutoriel HTTP/Express Node.js

- [Tutoriel HTTP/Express Node.js](#tutoriel-httpexpress-nodejs)
  - [Partie 1 : serveur HTTP natif Node.js](#partie-1--serveur-http-natif-nodejs)
    - [Installation](#installation)
    - [Servir différents types de contenus](#servir-différents-types-de-contenus)
    - [Mode développement](#mode-développement)
    - [Gestion manuelle des routes](#gestion-manuelle-des-routes)
  - [Partie 2 : framework Express](#partie-2--framework-express)
    - [Création du serveur](#création-du-serveur)
    - [Ajout de middlewares](#ajout-de-middlewares)
    - [Rendu avec EJS](#rendu-avec-ejs)
    - [Gestion d'erreurs](#gestion-derreurs)
  - [Conclusion](#conclusion)

Ce tutorial est inspiré de [_How To Create a Web Server in Node.js with the HTTP Module_](https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module) et compléter avec une partie sur Express.

Ce tutorial vous fait prendre en main l'environnement Node.js avec un petit projet de serveur web monté pas à pas, utilisant essentiellement les bilbiothèques standards de Node.js. Le framework <http://expressjs.com/> sera introduit ensuite.

- installer Node.js <https://nodejs.org/en/download/> pour votre environnement
- cloner le projet de départ de la GitHub Classroom <https://classroom.github.com/a/8mQFHDdO>
  - on obtient un dossier `tutoriel-http-express-node-LOGIN` qu'on appellera `devweb-tp5` par la suite par commodité

**RENDU** vous devrez remplir le fichier `README.md` avec les questions du sujet et **commiter/pousser sur GitHub Classroom**.
Les différentes étapes à réaliser seront aussi committées. La date limite de rendu est le **lundi 29 août 2022 23h59**.

## Partie 1 : serveur HTTP natif Node.js

### Installation

Exécuter la commande `npm init` dans le dossier `devweb-tp5`.
Répondre avec les valeurs par défaut, sauf pour _entry point: (index.js)_ où donner la valeur `server-http.mjs`
À ce stade, un fichier `package.json` a du être créé à peu près comme suit.

```json
{
  "name": "devweb-tp5",
  "version": "1.0.0",
  "description": "",
  "main": "server-http.mjs",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

Toujours dans le dossier `devweb-tp5` , créer le fichier `server-http.mjs` avec le contenu suivant :

```js
import http from "node:http";

const host = "localhost";
const port = 8000;

function requestListener(_request, response) {
  response.writeHead(200);
  response.end("<html><h1>My first server!<h1></html>");
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

Enfin, exécuter la commande `node server-http.mjs` et vérifier que votre application web fonctionne en vous connectant avec votre navigateur.

**Question 1.1** donner la liste des en-têtes de la réponse HTTP du serveur.

<!-- réponse 1.1 -->
```
HTTP/1.1 200 OK
Date: Wed, 27 Sep 2023 21:40:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked
```

### Servir différents types de contenus

Maintenant, remplacer la fonction `requestListener()` par la suivante et tester :

```js
function requestListener(_request, response) {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "I'm OK" }));
}
```

**Question 1.2** donner la liste des en-têtes qui ont changé depuis la version précédente.

<!-- réponse 1.2 -->
```
HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 27 Sep 2023 21:46:58 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20
```

Remplacer enfin la fonction `requestListener()` par la suivante et tester :

```js
import fs from "node:fs/promises";

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      return response.end(contents);
    })
    .catch((error) => console.error(error));
}
```

**Question 1.3** que contient la réponse reçue par le client ?

<!-- réponse 1.3 -->
```
HTTP/1.1 200 OK
Content-Type: text/html
Date: Wed, 27 Sep 2023 21:54:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

Parmi les en-têtes de réponse HTTP du serveur, on a une en-têtes nommé content-type.
 Elle nous renseigne sur le contenu et avec ça on peut savoir d'où il provient.
Et dans cette question la réponse contient le texte présent dans le fichier index.html
```

**Question 1.4** quelle est l'erreur affichée dans la console ? Retrouver sur <https://nodejs.org/api> le code d'erreur affiché.

<!-- réponse 1.4 -->
```
l'erreur affiché est une erreur errno avec comme nombre négatif "-4058"
 et avec comme code "ENOENT".
 cette erreur signifie que le fichier index.html est introuvable et pour cause,
 nous avons modifier le nom du fichier index.html
```

Modifier la fonction `requestListener()` précédente pour que le client recoive une erreur 500 si `index.html` est introuvable en remplacant le callback de la méthode `Promise.catch()`.

Maintenant, renommer le fichier `__index.html` en `index.html` et tester à nouveau.

Enfin, reprenez `requestListener()` dans le style `async/await`.

**Question 1.5** donner le code de `requestListener()` modifié _avec gestion d'erreur_ en `async/await`.

<!-- réponse question 1.5 -->
```js
async function requestListener(_request, response) {
  try {
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    response.end(contents);
  } catch (error) {
    console.error(error);
    response.writeHead(500); // Set HTTP status code to 500 (Internal Server Error)
    response.end("Internal Server Error");
  }
}
```

**Commit/push** dans votre dépot Git.

### Mode développement

Dans le dossier `devweb-tp5` exécuter les commandes suivantes :

- `npm install cross-env --save`
- `npm install nodemon --save-dev`

**Question 1.6** indiquer ce que cette commande a modifié dans votre projet.
```
cette commande a ajouter un un dossier node_modules et
un fichier package-lock.json qui installe les dépendances npm.
```

Ensuite, remplacer la propriété `"scripts"` du fichier `package.json` par la suivante :

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "http-dev": "cross-env NODE_ENV=development nodemon server-http.mjs",
    "http-prod": "cross-env NODE_ENV=production node server-http.mjs"
  },
```

Exécuter `npm run http-dev`, visiter le site, puis _pendant que le serveur s'exécute_ modifier le fichier `server-http.mjs` en ajoutant la ligne `console.log("NODE_ENV =", process.env.NODE_ENV);`.
Enregistrer le fichier et vérifier qu'il y a eu rechargement automatique grâce à <https://nodemon.io/>.
Ensuite, faire la même chose avec la commande `npm run http-prod`.

**Question 1.7** quelles sont les différences entre les scripts `http-dev` et `http-prod` ?

```
une des différences remarqués entre les scripts ci-dessus sont le fait
que le serveur est rechargé à chaque sauvegarde du script pour http-dev
par rapport à http-prod qui lui n'a pas cette capacité.
```

Les fichiers [`.eslintrc.json`](.eslintrc.json) et [`.prettierrc`](.prettierrc) sont fournis dans le dossier `devweb-tp5`. Exécuter la commande suivante pour installe les dépendances :

```bash
npm install --save-dev prettier eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jest eslint-plugin-node eslint-plugin-promise eslint-plugin-security eslint-plugin-unicorn
```

Vérifier que l'autoformattage avec <https://prettier.io> et le linting avec <https://eslint.org/> fonctionnent dans VSCode **et** en ligne de commande avec les commandes suivantes :

- `npx eslint server-http.mjs`
- `npx prettier server-http.mjs --write`

**Commit/push** dans votre dépot Git.

### Gestion manuelle des routes

Remplacer la fonction `requestListener()` par la suivante :

```js
async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const contents = await fs.readFile("index.html", "utf8");
    switch (request.url) {
      case "/index.html":
        response.writeHead(200);
        return response.end(contents);
      case "/random.html":
        response.writeHead(200);
        return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}
```

Tester les **routes** suivantes :

- `http://localhost:8000/index.html`
- `http://localhost:8000/random.html`
- `http://localhost:8000/`
- `http://localhost:8000/dont-exist`

**Question 1.8** donner les codes HTTP reçus par votre navigateur pour chacune des quatre pages précédentes.

```
http://localhost:8000/index.html : 200
http://localhost:8000/random.html : 200
http://localhost:8000/ : 404
http://localhost:8000/dont-exist : 404
```
 
Maintenant, on veut ajouter une route `/random/:nb` où `:nb` est un paramètre entier avec le nombre d'entiers à générer. Ajouter cette route au `switch` et reprendre la page `random.html` pour générer autant de nombres qu'indiqué dans l'URL.

Pour cela, utiliser `request.url.split("/");` qui va décomposer le chemin demandé et faire le `switch` sur le premier niveau de l'arborescence. Faites en sorte que le `switch` traite `/index.html` et `/` de la même façon.

**Commit/push** dans votre dépot Git.
```js
let nb = 1;
let valeur_random = [];

async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
        const contents = await fs.readFile("index.html", "utf8");
        switch (request.url.split("/")[1]) {
            case "index.html":
                response.writeHead(200);
                return response.end(contents);
            case "":
                response.writeHead(200);
                return response.end(contents);
            case "random.html":
                for (let i=0;i<nb;i++){
                    valeur_random.push(Math.floor(100 * Math.random()));
                }
                valeur_random=valeur_random.map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
                response.writeHead(200);
                return response.end(`<html><p>${valeur_random}</p></html>`);
            case "random":
                response.writeHead(200);
                nb = request.url.split("/")[2];
                return response.end(`<html><p>${nb}</p></html>`);
            default:
                response.writeHead(404);
                return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
    }
}
```
## Partie 2 : framework Express

On voit que la gestion manuelle des routes avec un grand `switch` va devenir complexe et laborieuse.
Les frameworks serveur comme <http://expressjs.com/>, <https://koajs.com/>, <https://www.fastify.io/> ou <https://hapi.dev/> vont s'occuper de cette plomberie et proposer une API pour enregistrer des _handlers_ aux différentes routes de l'application.

### Création du serveur

Créer le fichier `server-express.mjs` et exécuter la commande suivante :

```bash
npm install --save express http-errors loglevel morgan
```

**Question 2.1** donner les URL des documentations de chacun des modules installés par la commande précédente.
```
Express.js :  https://expressjs.com/.
http-errors : https://github.com/jshttp/http-errors.
loglevel : https://www.npmjs.com/package/loglevel.
morgan : https://www.npmjs.com/package/morgan
```

Ensuite, sur le modèle des scripts `http-prod` et `http-dev` du fichier `package.json`, créer les scripts `express-prod` et `express-dev`.

Ensuite, ajouter le contenu suivant au fichier `server-express.mjs`

```js
import express from "express";
import morgan from "morgan";

const host = "localhost";
const port = 8000;

const app = express();

app.get(["/", "/index.html"], async function (request, response, next) {
  response.sendFile("index.html", { root: "./" });
});

app.get("/random/:nb", async function (request, response, next) {
  const length = request.params.nb;
  const contents = Array.from({ length })
    .map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
  return response.send(`<html><ul>${contents}</ul></html>`);
});

app.listen(port, host);
```

**Question 2.2** vérifier que les trois routes fonctionnent.
![localhost8000](https://github.com/tlagikula/LAGIKULA_Tenisio_CC3/assets/144082027/4bca529f-b005-460c-855a-5979cfd77e24)
![localhostindexhtml](https://github.com/tlagikula/LAGIKULA_Tenisio_CC3/assets/144082027/ed644bc0-15c5-4091-b45e-8fbd9afa80d2)
![localhostrandom](https://github.com/tlagikula/LAGIKULA_Tenisio_CC3/assets/144082027/c70cc26e-4918-4d1a-889b-52776cd2bf39)




**Question 2.3** lister les en-têtes des réponses fournies par Express. Lesquelles sont nouvelles par rapport au serveur HTTP ?

```
- X-Powered-By
- Accept-Ranges
- Cache-Control
- Last-Modified
- ETag
- Content-Length
```

Remplacer la dernière ligne de `server-express.mjs` par les suivantes

```js
const server = app.listen(port, host);

server.on("listening", () =>
  console.info(
    `HTTP listening on http://${server.address().address}:${server.address().port} with mode '${process.env.NODE_ENV}'`,
  ),
);

console.info(`File ${import.meta.url} executed.`);
```

**Question 2.4** quand l'événement `listening` est-il déclenché ?
```
le listening est déclenché quand notre adresse est connecté au port.
```

**Commit/push** dans votre dépot Git.

### Ajout de middlewares

Ici, la route de la page d'accueil charge dynamiquement à chaque requête une ressource statique.
Ce n'est pas très performant, d'autant plus qu'un _middleware_ Epxress [existe déjà pour ça](http://expressjs.com/en/resources/middleware/serve-static.html).

- créer un sous-dossier `static`
- déplacer le fichier `index.html` dans le sous-dossier `static`
- extraire l'élément `<style>` de `index.html` dans un nouveau fichier `style.css` que vous lierez à `index.html` avec `<link rel="stylesheet" href="style.css">`
- remplacer la route de la page d'accueil par `app.use(express.static("static"));`

**Question 2.5** indiquer quelle est l'option (activée par défaut) qui redirige `/` vers `/index.html` ?

```
{index:""} est l'option activée par défaut qui redirige '/' vers '/index.html'
```

**Question 2.6** visiter la page d'accueil puis rafraichir (Ctrl+R) et _ensuite_ **forcer** le rafraichissement (Ctrl+Shift+R). Quels sont les codes HTTP sur le fichier `style.css` ? Justifier.
```
304 quand c'est pas forcé
200 quand c'est forcé
ce changement est due au faite que le cache est désactivé.
```

réactiver le cache pour cette question seulement et désactiver après.

Ajouter la ligne `if (app.get("env") === "development") app.use(morgan("dev"));` au bon endroit dans `server-express.mjs` pour activer le middleware Morgan.

**Commit/push** dans votre dépot Git.

### Rendu avec EJS

Le moteur de templating <https://ejs.co/> est l'équivalent de Jinja utilisé pour Python/Flask dans l'écosytème Nodes.js/Express.
Une [extension VSCode](https://marketplace.visualstudio.com/items?itemName=DigitalBrainstem.javascript-ejs-support) est disponible pour EJS.

On va utiliser le moteur EJS pour améliorer la page `random` générée dynamiquement côté serveur.

1. créer un sous-dossier `views/` et créer un fichier `views/random.ejs` avec le contenu ci-après;
2. exécuter la commande `npm install --save ejs`;
3. ajouter la ligne `app.set("view engine", "ejs");` à `server-express.mjs`;
4. modifier le _handler_ de la route `/random/:nb` avec `response.render("random", {numbers, welcome});` pour appeller le moteur de rendu, où `numbers` est un tableau de nombres aléatoires (comme précédemment) et `welcome` une chaîne de caractères.

#### Contenu de `views/random.ejs`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" />
    <link rel="stylesheet" href="/style.css" />
    <title>Tutorial</title>
  </head>

  <body>
    <div class="center">
      <h1><%= welcome %></h1>
      <% numbers.forEach(element => { %>
      <code><%= element %></code>
      <% }) %>
    </div>
  </body>
</html>
```

**Commit/push** dans votre dépot Git.

### Gestion d'erreurs

On va maintenant vérifier que le paramètre `/random/:nb` est bien un nombre. Si ce n'est pas le cas, il faut retourner une erreur HTTP 400.
Pour cela, utiliser le module <https://github.com/jshttp/http-errors>

1. ajouter le module `http-errors` avec `npm`
2. ajouter le `import ... from ...` correspondant dans `server-express.mjs`
3. dans la toute `/random/:nb`, faites la vérification avec `const length = Number.parseInt(request.params.nb, 10);` puis `Number.isNaN(length)`, si le paramètre, n'est pas un nombre, produire une erreur 400 avec `next(createError(400));`

**Commit/push** dans votre dépot Git.

Avec cette solution, l'erreur n'est pas bien rendue sur le client car elle passe dans le **handler d'erreur par défaut d'Express**. De plus, quand on visite une page qui n'existe pas, par exemple `http://localhost:8000/javascript`, la 404 n'est pas terrible non plus.

Ajouter, _tout à la fin des routes_, juste avant `app.listen(port, host);`, deux nouvaux _handlers_ comme suit :

```js
app.use((request, response, next) => {
  concole.debug(`default route handler : ${request.url}`);
  return next(createError(404));
});

app.use((error, _request, response, _next) => {
  concole.debug(`default error handler: ${error}`);
  const status = error.status ?? 500;
  const stack = app.get("env") === "development" ? error.stack : "";
  const result = { code: status, message: error.message, stack };
  return response.render("error", result);
});
```

Ensuite, créer, sur le modèle de `random.ejs`, une vue `error.ejs` dont le corps est comme suit :

```html
<body>
  <div class="center">
    <h1>Error <%= code %></h1>
    <p><%= message %></p>
  </div>
  <% if (stack != null) { %>
  <pre><%= stack %></pre>
  <% } %>
</body>
```

**Question 2.7** vérifier que l'affichage change bien entre le mode _production_ et le mode _development_.

**Commit/push** dans votre dépot Git.

Enfin, chargez le module `loglevel` avec `import logger from "loglevel";` puis fixer un niveau de verbosité avec `logger.setLevel(logger.levels.DEBUG);`.

Remplacez tous les `console.log()` et variantes par `logger.error()`, `logger.warn()`, `logger.info()`, `logger.debug()` ou `logger.trace()` approprié.

Modifier le niveau de verbosité, par exemple `logger.setLevel(logger.levels.WARN);` et vérifier l'affichage.

**Commit/push** dans votre dépot Git.

## Conclusion

À ce stade du tutoriel, vous avez vues les principales étapes de la création d'une application Node.js/Express.
Ces étapes seront déjà réalisées dans le projet de départ du [TP6](../TP6).

