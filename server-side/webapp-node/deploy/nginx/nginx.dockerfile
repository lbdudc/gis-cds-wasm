FROM nginx:1.25.0-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY ./config/etc/nginx.conf /etc/nginx/conf.d/
COPY ./config/nginx.conf /etc/nginx/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
