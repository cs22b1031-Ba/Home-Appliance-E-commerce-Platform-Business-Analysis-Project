# Lunor Atelier: Home Commerce Platform

## Business Overview
Lunor Atelier is a premium ecommerce platform for home appliances and furniture, designed to support both customer-facing sales and business-side operations. The platform combines a branded storefront, customer account area, admin management console, order tracking, product content management, and manual-assisted payment verification.

This web application is positioned as a digital retail channel for a premium home brand that wants:

- a polished online storefront
- full internal control over products and homepage content
- customer account management
- order lifecycle visibility
- admin-managed fulfillment updates
- a low-friction 10% advance UPI payment + 90% cash-on-delivery model

---

## Business Objective
The platform supports a business model where:

- customers discover and browse premium products online
- customers create accounts and place orders directly
- the business collects a 10% advance through UPI
- the remaining 90% is collected on delivery
- admins manually verify payment and update shipping progress
- customers track payment and item location from their dashboard

This model helps balance trust, conversion, and operational control in markets where full prepayment may reduce purchase confidence.

---

## Core Stakeholders

### 1. Customers
Customers use the storefront to:

- browse categories and products
- view multiple product images and videos
- search by product or category
- create an account using phone number and password
- save items for later
- place orders
- pay the 10% advance using UPI QR
- track payment status, item location, and delivery progress
- submit reviews

### 2. Admin / Business Owner
The admin controls:

- category creation and management
- product creation, editing, and deletion
- media upload through Cloudinary
- homepage content management
- homepage featured product selection
- order review and management
- payment status update
- delivery status update
- item location update
- business overview dashboards for revenue, order counts, inventory, monthly/yearly performance

### 3. Business Analyst / Operations Team
The business analyst can use this platform to evaluate:

- product assortment effectiveness
- customer journey completion
- payment conversion
- order volume trends
- delivery status bottlenecks
- stock levels
- content and campaign performance

---

## Customer Journey

### Discovery
The customer lands on a premium homepage with:

- search at the top
- curated categories
- homepage-selected products
- premium brand-focused visual presentation

### Product Evaluation
The customer can:

- open product details
- view multiple images or videos
- slide through media
- read material, dimensions, warranty, and energy details
- review product-specific pledge information
- read and submit reviews

### Account Creation
The customer signs up using:

- phone number
- password
- email
- full address details

### Checkout
The checkout supports:

- 10% UPI advance payment
- 90% cash on delivery
- QR code based payment flow
- UPI app deep-link support on mobile

### Post-Purchase
The customer dashboard shows:

- personal details
- order list
- 10% payment status
- delivery progress
- item location
- ordered products and pricing

---

## Admin Workflow

### Product Management
Admin can:

- add categories
- add products
- upload multiple product images and videos
- edit specifications
- add or remove pledge content
- update homepage product visibility

### Homepage Management
Admin can edit homepage business content, including:

- hero copy
- promotional text
- CTA labels and links
- stats
- material lab content
- appointment content
- homepage featured product IDs

### Order Management
Admin can:

- view all orders
- update payment status
- update order status
- update delivery stage
- update item location

This allows the business to operationally control fulfillment without integrating a third-party logistics tracking provider in the first phase.

### Business Tracking
Admin overview includes:

- total revenue
- total orders
- product count
- pending orders
- low stock products
- recently updated products
- recent orders
- monthly collections
- yearly collections

---

## Business Rules Embedded in the Platform

### Payment Rule
- 10% paid online through UPI
- 90% collected on delivery
- payment verification is currently admin-confirmed

### Delivery Tracking Rule
- admin manually updates delivery progress
- customer sees item location and stage in the dashboard

### Content Rule
- homepage is not static
- admin can continuously adjust homepage messaging and product focus

### Access Rule
- admin pages require a token
- customers access personal dashboards only through signed-in sessions

---

## Commercial Benefits

### 1. Increased Trust
The 10% advance + 90% COD model lowers risk for customers and improves willingness to order premium items.

### 2. Strong Brand Control
The admin-managed homepage and media experience allow the business to maintain a premium presentation similar to branded home retailers.

### 3. Operational Visibility
Order statuses, item locations, and dashboards provide internal clarity without requiring a complex enterprise system in phase one.

### 4. Better Mobile Reach
The interface has been optimized toward Android users, who are expected to represent the largest user base.

### 5. Scalable Foundation
The platform can later evolve into:

- marketplace-assisted logistics
- automated payment reconciliation
- multi-city store support
- mobile app distribution
- wholesale workflows

---

## Key Data Tracked
The system currently tracks:

- categories
- products
- product media
- users
- sessions
- orders
- order items
- payment status
- delivery status
- item location
- reviews
- homepage content configuration

This makes the platform useful not just as a storefront, but as an operational dataset for business reporting and decision-making.

---

## Current Technology Stack

- Frontend: Next.js
- Backend: Next.js API routes
- Database: Prisma ORM
- Production Database: Neon PostgreSQL
- Media Storage: Cloudinary
- Hosting: Vercel
- Mobile App Path: Capacitor-based Android wrapper is already scaffolded

---

## Deployment Model
The web application is structured for public deployment using:

- GitHub for source control
- Vercel for frontend and server runtime
- Neon for cloud database hosting
- Cloudinary for media

This setup allows the platform to be shared publicly without depending on a local machine.

---

## Risks and Current Limitations

### Manual Payment Verification
UPI advance payments are currently confirmed by the admin manually. This works for a controlled launch, but it may need automation later.

### Admin Token Security
Admin access is token-based and should be protected carefully in production.

### Delivery Tracking Is Manual
Item location and status depend on admin updates rather than courier API integration.

### No Automated ERP / Warehouse Layer Yet
Stock and order operations are managed within the app itself and are not yet integrated with larger back-office systems.

---

## Recommended Next Business Enhancements

1. Add automated payment gateway verification
2. Add analytics dashboard for conversion and funnel tracking
3. Add SKU-level stock forecasting
4. Add role-based admin access
5. Add multi-warehouse or multi-city fulfillment support
6. Add wholesale mode if the business pivots toward B2B
7. Add customer support ticketing
8. Add delivery partner integration

---

## Who This README Is For
This document is intended for:

- business analysts
- founders
- operations managers
- ecommerce strategists
- implementation partners

It explains the platform from a business and operational point of view rather than only a software engineering point of view.

---

## Repository Purpose
This repository contains the working source code for the Lunor Atelier commerce platform and serves as the base for:

- deployment
- business demonstration
- operational testing
- future product expansion

