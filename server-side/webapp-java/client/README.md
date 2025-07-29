# wasm

## Project setup

### Change Node version to the specified for the project

*(This only works if you use [NVM](https://github.com/nvm-sh/nvm) to manage Node versions)*

```
nvm use
```

If you're using Windows, you maybe have to execute the following command instead.

```
nvm use $(cat .\.nvmrc)
```

### Install dependencies

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Configuration

### package.json

* `scripts.serve: "vue-cli-service serve --port 1234"`: port to deploy the web client

### properties.js

* `GEOSERVER_URL: "http://localhost:9001/geoserver"`: full url to the geoserver installation
* `SERVER_URL: "http://localhost:8080/api"`: url to the web server api

## Launch using HTTPS - certificate generation

To launch the client using HTTPS, we need a certificate and a key. We will generate it using Certbot 
and for this the steps below are indicated, which have been taken from 
[this tutorial](https://dzone.com/articles/spring-boot-secured-by-lets-encrypt).

First of all you need to download Cerbot:
> git clone https://github.com/certbot/certbot.git

Once downloaded, we access the folder of this and execute the following commands:

```bash
# This generates two .pem files, "fullchain.pem" y "privkey.pem"
.\certbot-auto certonly -a standalone -d <NOMBRE_DOMINIO>
```

Once these two steps are done, we already have the *fullchain.pem* and *privkey.pem* of the client 
(which we have to add in the *client/public/keys/* directory). 

If the path of the certificates or their name is changed, go to the file *vue.config.js* and change the 
key and cert properties there, assigning them the new value that corresponds.

After creating these certificates, you can also generate the one for the server, 
whose instructions can be found in the README of the server.


## Changelog and release version

### Automation

To automate CHANGELOG file update you must follow these steps:  
- Enable CI/CD on GitLab project.
- Create a specific GitLab Runner for this project or use a shared one:
  - Registered runner must use Docker or Kubernetes executor.
- Create GitLab access token with API scope and store it into *GL_TOKEN* variable.

This will update release version and CHANGELOG.md file on every commit on *main* branch, by default. To modify this behaviour, edit *.gitlab-ci.yml* file.

### Commit messages

In order to making possible CI/CD pipeline works properly and that releases and CHANGELOG file are updated correctly, commit messages must follow [Angular Commit Message Conventions](https://semantic-release.gitbook.io/semantic-release/#commit-message-format).
