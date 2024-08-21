import { Footer } from '@/components/common/footer';
import { Header } from './components/header';
import { InformationCards } from './components/informationCards';
import { LoginOrRegisterCard } from './components/loginOrRegisterCard';

export function MainPageUnLogged() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow container mx-auto py-8">
        <Header />
        <InformationCards />
        <LoginOrRegisterCard />
      </main>
      
      <Footer />
    </div>
  )
}