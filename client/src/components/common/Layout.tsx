import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    customFooter?: React.ReactNode;
    hidePadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    showHeader = true,
    showFooter = true,
    customFooter,
    hidePadding = false
}) => {
    return (
        <IonPage>
            {showHeader && <Header />}
            <IonContent fullscreen className={showFooter ? "ion-padding-bottom" : ""}>
                <main className={`main-container bg-muted ${showHeader ? 'mt-[80px]' : ''} ${hidePadding ? '' : 'px-4 lg:px-12'} ${showFooter ? 'pb-24 lg:pb-12' : ''}`}>
                    {children}
                </main>
            </IonContent>
            {showFooter && <Footer />}
            {customFooter}
        </IonPage>
    );
};

export default Layout;
