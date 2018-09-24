FROM alpine:3.8


ENV RASA_RELEASE=0.13.4 \
    RASA_NLU_HOME=/app \
    RASA_NLU_PYTHON_PACKAGES=/usr/local/lib/python2.7/dist-packages

# -----below from https://github.com/abn/scipy-docker-alpine
# Linking of locale.h as xlocale.h
# This is done to ensure successfull install of python numpy package
# see https://forum.alpinelinux.org/comment/690#comment-690 for more information.

RUN apk --update add --virtual scipy-runtime python py-pip \
    && apk add --virtual scipy-build \
        build-base python-dev openblas-dev freetype-dev pkgconfig gfortran \
    && ln -s /usr/include/locale.h /usr/include/xlocale.h \
    && pip install --upgrade pip
RUN pip install --no-cache-dir scipy \
#    && apk del scipy-build \
#    && pip install --no-cache-dir 'numpy>=1.14.5' \ 
#    && pip install --no-cache-dir matplotlib \
    && apk add --virtual scipy-runtime \
        freetype libgfortran libgcc libpng  libstdc++ musl openblas tcl tk \
    && rm -rf /var/cache/apk/*
# -----above from https://github.com/abn/scipy-docker-alpine
#  Watchout for the 'apk del' above - it will delete that package _AND_ anything --virtual'ed with it

RUN apk add git bash --update-cache

RUN wget -O - https://github.com/RasaHQ/rasa_nlu/archive/${RASA_RELEASE}.tar.gz | zcat | tar xvf -
RUN mv rasa_nlu-${RASA_RELEASE} ${RASA_NLU_HOME}

WORKDIR ${RASA_NLU_HOME}

RUN sed -i '/matplotlib/d' alt_requirements/requirements_bare.txt

# We install numpy above, not certain why, but we do.
RUN sed -i '/numpy/d' alt_requirements/requirements_bare.txt

#only turn on if you want mitie too (in which case turn on the wget below too
#RUN pip install -r alt_requirements/requirements_full.txt

#just install the spacy stuff
RUN pip install -r alt_requirements/requirements_spacy_sklearn.txt

RUN pip install -e .

RUN pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_md-2.0.0/en_core_web_md-2.0.0.tar.gz --no-cache-dir > /dev/null \
    && python -m spacy link en_core_web_md en
RUN pip install https://github.com/explosion/spacy-models/releases/download/de_core_news_sm-2.0.0/de_core_news_sm-2.0.0.tar.gz --no-cache-dir > /dev/null \
    && python -m spacy link de_core_news_sm de
RUN pip install https://github.com/explosion/spacy-models/releases/download/fr_core_news_md-2.0.0/fr_core_news_md-2.0.0.tar.gz --no-cache-dir > /dev/null \
    && python -m spacy link fr_core_news_md fr
RUN pip install https://github.com/explosion/spacy-models/releases/download/es_core_news_md-2.0.0/es_core_news_md-2.0.0.tar.gz --no-cache-dir > /dev/null \
    && python -m spacy link es_core_news_md es
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_sm-2.0.0/pt_core_news_sm-2.0.0.tar.gz --no-cache-dir > /dev/null \
    && python -m spacy link pt_core_news_sm pt

RUN pip uninstall msgpack-python -y
RUN pip install msgpack-python==0.5.2

#only turn on if using mitie
# RUN wget -P data/ https://s3-eu-west-1.amazonaws.com/mitie/total_word_feature_extractor.dat

RUN cp  sample_configs/config_spacy_duckling.yml ${RASA_NLU_HOME}/config.yml

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["start", "--path", "/app/projects", "-c", "config.yml", "--max_training_processes", "1"]

