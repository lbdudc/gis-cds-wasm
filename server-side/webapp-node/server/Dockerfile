FROM node:20.9

WORKDIR /app

COPY package.json .
COPY package-lock.json .                      

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
