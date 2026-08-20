FROM php:8.2-apache

# Installer les dépendances système, extensions PHP et Node.js
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-install pdo pdo_mysql intl zip opcache

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurer Apache pour pointer vers public/ et activer rewrite + headers
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite headers

# Copier le code du projet
WORKDIR /var/www/html
COPY . .

# Installer les dépendances PHP et vider le cache
ENV APP_ENV=prod
RUN composer install --no-dev --optimize-autoloader

# Compiler les assets
RUN npm install && npm run build

RUN php bin/console cache:clear --env=prod

# Fixer les permissions
RUN chown -R www-data:www-data /var/www/html/var

EXPOSE 80
CMD ["apache2-foreground"]