# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:22.12-alpine as build

ARG RUN_CONFIG

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

RUN echo ${RUN_CONFIG}

# Generate the build of the application
RUN npm run build:${RUN_CONFIG}
# --prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/kofCUI/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80
EXPOSE 443

# docker build -t lexorandi_kofc_ui_angular .
# docker run --network lexorandinetwork --name lexorandi_kofc_ui_angular_container -p 8080:80 -p 8443:443 -d lexorandi_kofc_ui_angular