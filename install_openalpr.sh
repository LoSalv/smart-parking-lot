#!/bin/bash

apt-get update
apt-get install -y libopencv-dev libtesseract-dev git cmake build-essential libleptonica-dev 
apt-get install -y liblog4cplus-dev libcurl3-dev && apt-get install -y beanstalkd 
git clone https://github.com/openalpr/openalpr.git && cd openalpr/src
mkdir build && cd build
cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_INSTALL_SYSCONFDIR:PATH=/etc ..
make && make install


#test
# wget http://plates.openalpr.com/h786poj.jpg -O lp.jpg
# alpr lp.jpg
