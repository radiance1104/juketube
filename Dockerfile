FROM centos:8

RUN dnf install -y https://download.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
RUN dnf localinstall -y --nogpgcheck https://download1.rpmfusion.org/free/el/rpmfusion-free-release-8.noarch.rpm
RUN dnf install -y --nogpgcheck https://download1.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-8.noarch.rpm
RUN dnf install -y http://rpmfind.net/linux/epel/7/x86_64/Packages/s/SDL2-2.0.10-1.el7.x86_64.rpm

RUN dnf install -y nginx nodejs mpg123 ffmpeg
RUN dnf install -y python36
RUN npm install -g @angular/cli@7.3.9
RUN alternatives --set python /usr/bin/python3

ADD front/ /root/front/
ADD back/ /root/back/
ADD startup.sh /root/startup.sh

RUN chmod 744 /root/startup.sh

# Build frontend
RUN cd /root/front && npm install && npm rebuild node-sass && ng build
RUN rm -f /usr/share/nginx/html/*
RUN mv /root/front/dist/front/* /usr/share/nginx/html/

# Build backend
RUN cd /root/back && npm install && npm run build

# Start service
CMD ["/root/startup.sh"]
