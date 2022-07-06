FROM node:14.17.0

WORKDIR /usr/src/smart-brain-back

COPY ./ ./ 

RUN npm install 

CMD ["/bin/bash"]
