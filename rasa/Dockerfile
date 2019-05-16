FROM python:3.6-slim

ENV RASA_NLU_DOCKER="YES" \
    RASA_NLU_HOME=/app \
    RASA_RELEASE=0.14.4 \
    RASA_NLU_PYTHON_PACKAGES=/usr/local/lib/python3.6/dist-packages

# Run updates, install basics and cleanup
# - build-essential: Compile specific dependencies
# - git-core: Checkout git repos
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends build-essential git-core wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN wget -O - https://github.com/RasaHQ/rasa/archive/${RASA_RELEASE}.tar.gz | zcat | tar xvf -
RUN mv rasa-${RASA_RELEASE} ${RASA_NLU_HOME}

WORKDIR ${RASA_NLU_HOME}

RUN sed -i '/matplotlib/d' alt_requirements/requirements_bare.txt

RUN pip install -r alt_requirements/requirements_tensorflow_sklearn.txt
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

RUN cp  sample_configs/config_spacy_duckling.yml ${RASA_NLU_HOME}/config.yml

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["start", "--path", "/app/projects", "-c", "config.yml", "--max_training_processes", "1"]
