# Laravel Inertia.js Admin Dashboard

A modern, full-featured admin dashboard built with Laravel, Inertia.js, React, and Tailwind CSS. Features comprehensive user management, role-based permissions, subscription management, and more.

## 🚀 Features

- **User Management**: Complete CRUD operations with search, filtering, and export
- **Role & Permission System**: Spatie Laravel Permission integration
- **Subscription Management**: Stripe integration with analytics
- **Modern UI**: React components with Tailwind CSS and dark mode
- **Real-time Search**: Debounced search with instant results
- **Data Export**: CSV export functionality
- **Responsive Design**: Mobile-first responsive interface
- **Security**: Role-based access control and CSRF protection

## 📋 Requirements

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- NPM or Yarn
- MySQL/PostgreSQL/SQLite
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inertia-admin-dashboard
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` file with your database and other configurations:

```env
APP_NAME="Laravel Admin Dashboard"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Stripe Configuration (Optional)
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Mail Configuration (Optional)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 6. Database Setup

```bash
# Run database migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 7. Build Frontend Assets

```bash
# For development
npm run dev

# For production
npm run build
```

### 8. Start the Development Server

```bash
# Start Laravel development server
php artisan serve

# In another terminal, start Vite dev server (for development)
npm run dev
```

## 🔧 Development Commands

### Backend Commands

```bash
# Clear application cache
php artisan cache:clear

# Clear configuration cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Create new migration
php artisan make:migration create_table_name

# Create new model
php artisan make:model ModelName

# Create new controller
php artisan make:controller ControllerName

# Create new seeder
php artisan make:seeder SeederName

# Run tests
php artisan test
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build and watch for changes
npm run watch

# Lint JavaScript/React code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/Admin/    # Admin controllers
│   ├── Models/                    # Eloquent models
│   └── Services/                  # Business logic services
├── database/
│   ├── migrations/                # Database migrations
│   └── seeders/                   # Database seeders
├── resources/
│   ├── js/
│   │   ├── Components/            # Reusable React components
│   │   ├── Layouts/               # Layout components
│   │   └── Pages/                 # Inertia.js pages
│   └── css/                       # Stylesheets
├── routes/
│   └── web.php                    # Web routes
└── public/                        # Public assets
```

## 🔐 Default Login Credentials

After running the seeders, you can login with these default accounts:

### Admin Account
- **Email**: admin@example.com
- **Password**: password

### Test Users
- **Manager**: sarah@manager.com / password
- **Editor**: mike@editor.com / password
- **User**: emily@user.com / password
- **Client**: david@client.com / password

## 🎯 Available Routes

### Admin Routes (Protected by admin role)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/permissions` - Permission management
- `/admin/subscriptions` - Subscription management
- `/admin/plans` - Plan management
- `/admin/settings` - System settings

### Client Routes (Protected by client role)
- `/client/dashboard` - Client dashboard
- `/client/plans` - Available plans
- `/client/invoices` - Invoice history

## 🔧 Configuration

### Permissions System

The application uses Spatie Laravel Permission package. Default permissions include:

- **User Management**: view users, create users, edit users, delete users
- **Plan Management**: view plans, create plans, edit plans, delete plans
- **Subscription Management**: view subscriptions, manage subscriptions
- **Analytics**: view analytics
- **System Settings**: manage settings

### Roles

Default roles:
- **Admin**: Full access to all features
- **Manager**: User and subscription management
- **Editor**: Content management
- **User**: Basic user role
- **Client**: Customer role with limited access

## 🎨 UI Components

The project includes a comprehensive set of reusable UI components:

- **Cards**: Various card layouts
- **Buttons**: Multiple button variants
- **Forms**: Form inputs with validation
- **Tables**: Advanced data tables with sorting/filtering
- **Modals**: Confirmation and form modals
- **Badges**: Status and category badges
- **Navigation**: Breadcrumbs and navigation components

## 📊 Features Overview

### User Management
- ✅ Create, read, update, delete users
- ✅ Real-time search and filtering
- ✅ Role and permission assignment
- ✅ Bulk operations
- ✅ CSV export
- ✅ Responsive cards and table views

### Role & Permission Management
- ✅ Create and manage roles
- ✅ Assign permissions to roles
- ✅ User role assignment
- ✅ Permission inheritance
- ✅ Role-based access control

### Subscription Management
- ✅ Stripe integration
- ✅ Subscription analytics
- ✅ Plan management
- ✅ Invoice handling
- ✅ Payment method management

## 🚀 Deployment

### Production Build

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm install --production

# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### Environment Variables for Production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database configuration
DB_CONNECTION=mysql
DB_HOST=your-production-host
DB_DATABASE=your-production-database
DB_USERNAME=your-production-username
DB_PASSWORD=your-production-password

# Cache and Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   ```bash
   sudo chown -R www-data:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```

2. **Node.js Build Errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Database Connection Issues**
   - Check database credentials in `.env`
   - Ensure database server is running
   - Verify database exists

4. **Vite Build Issues**
   ```bash
   npm run build
   php artisan config:clear
   ```

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or create an issue in the repository.

## 🔄 Updates

To update the project:

```bash
# Pull latest changes
git pull origin main

# Update PHP dependencies
composer update

# Update Node.js dependencies
npm update

# Run migrations
php artisan migrate

# Rebuild assets
npm run build
```

---

**Built with ❤️ using Laravel, Inertia.js, React, and Tailwind CSS**