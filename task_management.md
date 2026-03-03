# Project: iGrab Customer App (Mobile Clone)

## Overview
Conversion of the existing EJS-based website into a cross-platform mobile application using Ionic, Capacitor, and React.js, supported by a new Node.js/Express backend.

---


## 2. Backend Development (Node.js/Express)
- [ ] **2.a. API Architecture & Security**
    - [ ] Design RESTful API endpoints.
    - [ ] Implement JWT-based authentication.
    - [ ] Set up middleware for error handling and validation.
- [ ] **2.b. Database Integration**
    - [ ] Connect to MongoDB/PostgreSQL.
    - [ ] Create schemas for Users, Products, Orders, and Notifications.
- [ ] **2.c. Order Management Logic**
    - [ ] Implement order placement and status update triggers.
    - [ ] Integrate notification logic for status changes.

## 3. Frontend Development (Ionic/React)
- [ ] **3.a. UI/UX Migration (EJS to React)**
    - [ ] Analyze existing EJS templates and styles.
    - [ ] Create reusable React components (Header, Footer, ProductCard, etc.).
    - [ ] Implement responsive layouts matching the website aesthetic.
- [ ] **3.b. Page Development**
    - [ ] Home Page (Slider, Featured Products).
    - [ ] Product Listing & Search.
    - [ ] Product Detail Page.
    - [ ] Shopping Cart & Checkout.
    - [ ] User Profile & Order History.
- [ ] **3.c. State Management & API Integration**
    - [ ] Set up state management (Redux or Context API).
    - [ ] Connect frontend components to the new backend APIs.

## 4. Advanced Features & Communication
- [ ] **4.a. Push Notifications (Firebase/FCM)**
    - [ ] Configure Firebase project and FCM.
    - [ ] Implement frontend listener for real-time status alerts.
    - [ ] Implement backend triggers for "Order Placed/Packed/Shipped/Delivered".
- [ ] **4.b. Deep Linking**
    - [ ] Configure Android Intent Filters and iOS Universal Links.
    - [ ] Implement app-side routing to handle product-specific links (WhatsApp sharing).
- [ ] **4.c. Performance & Offline Stability**
    - [ ] Implement IndexedDB/Capacitor Storage for API caching.
    - [ ] Create animated Skeleton Screens for all data-heavy pages.
    - [ ] Verify local bundling of all assets (Zero-CDN).

## 5. Hardware & OS Integration
- [ ] **5.a. Location Services (GPS)**
    - [ ] Implement GPS coordinate detection for delivery addresses.
    - [ ] Integrate map selection (Google Maps or similar) if needed.
- [ ] **5.b. Native Back Button (Android)**
    - [ ] Implement hardware back button handler.
    - [ ] Add "Exit App" confirmation logic on the home screen.

## 6. Testing & Deployment
- [ ] **6.a. Cross-Platform Testing**
    - [ ] Test on Android Emulator and Physical Device.
    - [ ] Test on iOS Simulator and Physical Device.
- [ ] **6.b. Performance Optimization**
    - [ ] Audit bundle size.
    - [ ] Optimize image loading and caching.
- [ ] **6.c. Store Submission Preparation**
    - [ ] Generate app icons and splash screens.
    - [ ] Prepare metadata for Google Play and App Store.
