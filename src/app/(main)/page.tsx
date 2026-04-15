import ContactForm from '../../components/ContactForm'
import Galery from '../../components/Home/Gallery'
import Hero from '../../components/Home/Hero'
import Pricing from '../../components/Home/Pricing'
import Journal from '../../components/Home/Journal'
import Records from '../../components/Home/Records'
import Partner from '../../components/Home/Partner'
import News from '../../components/Home/News'
import Activity from '../../components/Home/Activity'
import Registration from '../../components/Home/Registration'
import Sambutan from '../../components/Home/Sambutan'
import Sejarah from '../../components/Home/Sejarah'

export const metadata = {
  title: "Master PPI",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Sambutan />
      <Sejarah />
      {/* <Records /> */}
      <News />
      {/* <Journal /> */}
      {/* <Pricing /> */}
      <Activity />
      <Registration />
      <Galery />
      <Partner />
      {/* <ContactForm /> */}
    </main>
  )
}
