import { Footer } from '@/components/common/footer';
import { Header } from './components/header';
import { InformationCards } from './components/informationCards';
import { LoginOrRegister } from './components/loginOrRegister';

export function MainPage() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow container mx-auto py-8">
        <Header />
        <InformationCards />
        <LoginOrRegister />
      </main>
      
      <Footer />
    </div>
  )
}