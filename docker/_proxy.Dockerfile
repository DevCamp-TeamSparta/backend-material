FROM nginx:1.21.6

# 환경설정
ARG ENV
COPY ["proxy/nginx-${ENV}.conf", "/etc/nginx/nginx.conf"]