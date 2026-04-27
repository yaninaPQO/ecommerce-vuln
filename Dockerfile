FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

# Vulnerabilidad: npm install sin --production
RUN npm install

COPY . .

# Vulnerabilidad: Expone puerto interno
EXPOSE 3000

# Vulnerabilidad: Corre como root
USER root

CMD ["npm", "start"]
