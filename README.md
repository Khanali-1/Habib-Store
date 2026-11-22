# H-Store — Premium Fashion E-Commerce

**Where Modern Fashion Meets a Premium Shopping Experience.**

H-Store is a modern, full-stack fashion e-commerce platform designed to deliver a seamless and elegant online shopping experience. Explore premium collections of Men, Women, Kids, Jewellery, Fragrance, and Accessories through a clean, responsive, and user-friendly interface.

## ✨ Features

- **Premium UI/UX:** Modern design with a burgundy, blush pink, and chartreuse color palette.
- **Product Collections:** Browse Men, Women, Kids, Jewellery, Fragrance, and Accessories.
- **Product Management:** Dynamic product listings and category-based browsing.
- **Authentication:** Secure user login and registration.
- **Shopping Cart:** Add and manage products in your cart.
- **Wishlist:** Save favorite products for later.
- **Checkout:** Streamlined shopping and checkout experience.
- **Order Management:** Manage and track customer orders.
- **Country-Based Pricing:** Support for country-specific product prices.
- **Admin Dashboard:** Manage products, categories, customers, and orders.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React.js
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes
- Node.js
- MongoDB
- Mongoose

**Tools & Libraries**
- Axios
- JSON Web Token (JWT)
- Git & GitHub

## 📁 Project Structure

```text
H-Store/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   └── (store)/
│   ├── backend/
│   │   ├── config/
│   │   ├── middleware/
│   │   └── models/
│   ├── components/
│   ├── context/
│   └── lib/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Khanali-1/H-Store.git
```

### 2. Navigate to the Project

```bash
cd H-Store
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Replace the placeholder values with your own credentials. Never commit environment files or expose database credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Identity

H-Store uses a carefully selected visual palette:

| Color | Hex Code |
|---|---|
| Burgundy | `#5e1a2e` |
| Blush Pink | `#f1c5c9` |
| Chartreuse | `#c8e61c` |

## 🌐 Deployment

The project can be deployed using [Vercel](https://vercel.com/).

Configure the required environment variables in your deployment settings before deploying.

## 👨‍💻 Developer

**Habib Khan**

- GitHub: [Khanali-1](https://github.com/Khanali-1)
- Project Repository: [H-Store](https://github.com/Khanali-1/H