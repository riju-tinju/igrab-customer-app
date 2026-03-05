import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './index.css';

import { BranchProvider } from './contexts/BranchContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CompanyProfile from './pages/CompanyProfile';
import NotFound from './pages/NotFound';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <LanguageProvider>
        <AuthProvider>
          <BranchProvider>
            <CartProvider>
              <WishlistProvider>
                <IonReactRouter>
                  <IonRouterOutlet>
                    <Route exact path="/home">
                      <Home />
                    </Route>
                    <Route exact path="/shop">
                      <Shop />
                    </Route>
                    <Route exact path="/contact">
                      <Contact />
                    </Route>
                    <Route exact path="/privacy-policy">
                      <PrivacyPolicy />
                    </Route>
                    <Route exact path="/terms-and-conditions">
                      <TermsConditions />
                    </Route>
                    <Route exact path="/company-profile">
                      <CompanyProfile />
                    </Route>
                    <Route exact path="/brands">
                      <CompanyProfile />
                    </Route>
                    <Route>
                      <NotFound />
                    </Route>
                    <Route exact path="/auth">
                      <Auth />
                    </Route>
                    <Route exact path="/checkout">
                      <Checkout />
                    </Route>
                    <Route exact path="/product/:slug">
                      <ProductDetails />
                    </Route>
                    <Route exact path="/">
                      <Redirect to="/home" />
                    </Route>
                  </IonRouterOutlet>
                </IonReactRouter>
              </WishlistProvider>
            </CartProvider>
          </BranchProvider>
        </AuthProvider>
      </LanguageProvider>
    </IonApp>
  );
};

export default App;
