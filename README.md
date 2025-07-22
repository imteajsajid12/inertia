# SaaS Subscription Management System

A modern, full-featured SaaS subscription management platform built with Laravel 12, Inertia.js, React, and Tailwind CSS. Features role-based access control, multiple payment gateways, comprehensive analytics, and a beautiful Horizon UI-inspired interface.

## 🚀 Features

### 🔐 Authentication & Authorization
- Laravel Breeze with Inertia + React
- Role-based access control (Admin & Client roles)
- Email verification support
- Secure password reset functionality

### 💳 Subscription Management
- Flexible subscription plans (Monthly, Yearly, Free Trial)
- Multiple payment gateway support:
  - Stripe (via Laravel Cashier)
  - PayPal integration ready
  - Bangladesh gateways (bKash, SSLCommerz) ready
- Plan upgrades, downgrades, and cancellations
- Proration handling for plan changes
- Trial period management

### 📊 Admin Dashboard
- Comprehensive analytics with charts
- Key metrics: Total Users, Active Subscriptions, MRR, Total Revenue
- User management with role assignment
- Subscription plan management
- Real-time subscription monitoring

### 👨‍💻 Client Dashboard
- Subscription status overview
- Plan selection and management
- Invoice history with PDF downloads
- Payment method management
- Profile settings

### 🎨 Modern UI/UX
- Horizon UI-inspired design system
- Dark/Light mode support
- Fully responsive design
- Beautiful charts and analytics
- Accessible components

## 🛠️ Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS
- **Database**: SQLite (configurable)
- **Payments**: Laravel Cashier (Stripe)
- **Permissions**: Spatie Laravel Permission
- **Charts**: ApexCharts
- **Icons**: Heroicons

## 📦 Installation

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- SQLite (or your preferred database)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-subscription-system
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure your environment**
   Edit `.env` file with your settings:
   ```env
   # Database
   DB_CONNECTION=sqlite
   
   # Stripe (required for payments)
   STRIPE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_SECRET=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   
   # App settings
   APP_NAME="Your SaaS Platform"
   APP_URL=http://localhost:8000
   ```

6. **Database setup**
   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Build assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

8. **Start the application**
   ```bash
   php artisan serve
   ```

## 👥 Default Users

After seeding, you can use these test accounts:

### Admin Account
- **Email**: admin@test.com
- **Password**: password
- **Access**: Full admin dashboard and management features

### Client Account
- **Email**: client@test.com
- **Password**: password
- **Access**: Client dashboard and subscription management

### Create Additional Users
```bash
# Interactive user creation
php artisan user:create --role=admin
php artisan user:create --role=client

# Create test users quickly
php artisan users:create-test
```

## 🔧 Configuration

### Payment Gateway Setup

#### Stripe Configuration
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Update your `.env` file with the keys
4. Create products and prices in Stripe dashboard
5. Update the `gateway_ids` in your subscription plans

#### Webhook Setup
1. Create a webhook endpoint in Stripe dashboard
2. Point it to: `https://yourdomain.com/stripe/webhook`
3. Add the webhook secret to your `.env` file

### Subscription Plans
Plans are seeded automatically, but you can manage them via:
- Admin dashboard at `/admin/plans`
- Database seeders in `database/seeders/PlanSeeder.php`

## 📱 Usage

### Admin Features
- **Dashboard**: View analytics, recent users, and subscriptions
- **User Management**: View, search, and manage user roles
- **Plan Management**: Create, edit, and manage subscription plans
- **Subscription Monitoring**: Track all subscription activities

### Client Features
- **Dashboard**: View subscription status and quick actions
- **Plans**: Browse and select subscription plans
- **Billing**: View invoices and manage payment methods
- **Profile**: Update account information

## 🔌 API Endpoints

### Admin Routes (Protected by `role:admin`)
```
GET    /admin/dashboard           - Admin dashboard
GET    /admin/users              - User management
GET    /admin/plans              - Plan management
GET    /admin/subscriptions      - Subscription monitoring
```

### Client Routes (Protected by `role:client`)
```
GET    /client/dashboard         - Client dashboard
GET    /client/plans             - Available plans
POST   /client/subscribe/{plan}  - Subscribe to plan
PATCH  /client/change-plan/{plan} - Change subscription plan
DELETE /client/cancel            - Cancel subscription
POST   /client/resume            - Resume subscription
GET    /client/invoices          - Invoice history
```

## 🧪 Testing

Run the test suite:
```bash
php artisan test
```

## 🚀 Deployment

### Production Checklist
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure proper database (MySQL/PostgreSQL)
4. Set up proper mail configuration
5. Configure queue workers for background jobs
6. Set up SSL certificate
7. Configure Stripe webhooks for production
8. Set up proper backup strategy

### Queue Workers
For production, run queue workers:
```bash
php artisan queue:work --tries=3
```

## 🔒 Security Features

- CSRF protection on all forms
- SQL injection prevention via Eloquent ORM
- XSS protection via Laravel's built-in features
- Secure password hashing
- Role-based access control
- Payment data encryption
- Secure webhook verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue on GitHub

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete subscription management system
- Admin and client dashboards
- Multiple payment gateway support
- Comprehensive analytics
- Modern UI with dark mode

---

Built with ❤️ using Laravel, React, and modern web technologies.